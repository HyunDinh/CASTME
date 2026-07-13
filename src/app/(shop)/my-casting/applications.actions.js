"use server";
import { prisma } from "#/lib/prisma";
import { cookies } from "next/headers";
import { createSignatureRequest, checkDocumentStatus, downloadSignedDocument } from "#/lib/signnow";

// Dùng Escape Hatch để bypass hoàn toàn cơ chế bọc proxy của Turbopack/Webpack
let PayOSClass;
try {
  const nativeRequire = eval("require");
  const payosModule = nativeRequire("@payos/node");
  PayOSClass = payosModule.PayOS || payosModule.default || payosModule;
} catch (e) {
  console.error("Không thể nạp thư viện PayOS gốc từ node_modules:", e);
}

function parseBudgetAmount(budget) {
  if (!budget) return 100000;
  const match = String(budget).match(/(\d[\d.,]*)/);
  if (!match) return 100000;
  const normalized = match[1].replace(/,/g, "");
  const numeric = Number.parseInt(normalized, 10);
  return Number.isFinite(numeric) && numeric > 0 ? numeric : 100000;
}

function buildPayosOrderCode(milestoneId) {
  const suffix = String(milestoneId).slice(-6);
  return Number(`${Date.now()}${suffix}`.slice(0, 10));
}

async function createPayosPaymentLink(milestone, shopUser) {
  const clientId = process.env.PAYOS_CLIENT_ID || process.env.NEXT_PUBLIC_PAYOS_CLIENT_ID;
  const apiKey = process.env.PAYOS_API_KEY || process.env.NEXT_PUBLIC_PAYOS_API_KEY;
  const checksumKey = process.env.PAYOS_CHECKSUM_KEY;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.APP_URL || "http://localhost:3000";

  if (!clientId || !apiKey || !checksumKey) {
    return { success: false, error: "Thiếu cấu hình PayOS" };
  }

  if (!PayOSClass) {
    return { success: false, error: "Thư viện PayOS chưa được tải" };
  }

  const amount = parseBudgetAmount(milestone.job?.budget);
  const orderCode = buildPayosOrderCode(milestone.id);

  const rawDescription = `Thanh toan job ${milestone.job?.title || "CASTME"}`;
  const description = rawDescription
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9 ]/g, "")
    .slice(0, 25);

  try {
    // Khởi tạo theo cách mới (object config)
    const payos = new PayOSClass({
      clientId,
      apiKey,
      checksumKey,
    });

    const paymentLinkData = await payos.paymentRequests.create({
      orderCode,
      amount,
      description,
      cancelUrl: `${appUrl}/my-casting?jobId=${milestone.job.id}`,
      returnUrl: `${appUrl}/my-casting?jobId=${milestone.job.id}&payment=success`,
      buyerName: shopUser?.name || "Shop CASTME",
      buyerEmail: shopUser?.email || "shop@castme.vn",
      items: [
        {
          name: (milestone.job?.title || "Thanh toan job")
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .slice(0, 25),
          quantity: 1,
          price: amount,
        },
      ],
    });

    const checkoutUrl = paymentLinkData?.checkoutUrl;

    if (!checkoutUrl) {
      return { success: false, error: "Không lấy được link thanh toán từ PayOS" };
    }

    return { success: true, checkoutUrl };
  } catch (error) {
    console.error("PayOS SDK tạo link thất bại:", error);
    return { success: false, error: error?.message || "Không thể kết nối PayOS" };
  }
}

// Helper lấy user
async function getAuthenticatedUser() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("castme_session");
  if (!sessionCookie) return null;
  try {
    return JSON.parse(sessionCookie.value);
  } catch (e) {
    return null;
  }
}

export async function finalizePaymentMilestone(milestone, paymentAmount = null) {
  if (!milestone) {
    return { success: false, error: "Không tìm thấy milestone" };
  }

  if (milestone.status === "COMPLETED") {
    return { success: true, alreadyCompleted: true };
  }

  const acceptedApplication = await prisma.application.findFirst({
    where: {
      jobId: milestone.jobId,
      status: "ACCEPTED",
    },
    select: { creatorId: true },
  });

  if (!acceptedApplication?.creatorId) {
    return { success: false, error: "Không tìm thấy KOL được chấp nhận cho công việc này" };
  }

  const amount = Number(paymentAmount ?? parseBudgetAmount(milestone.job?.budget));
  const netAmount = Math.floor(amount * 0.97);
  const fee = amount - netAmount;

  try {
    await prisma.$transaction(async (tx) => {
      await tx.milestone.update({
        where: { id: milestone.id },
        data: {
          status: "COMPLETED",
          submission: milestone.submission || `Thanh toán thành công - Milestone ${milestone.id}`,
        },
      });

      await tx.job.update({
        where: { id: milestone.jobId },
        data: { status: "COMPLETED" },
      });

      const transaction = await tx.transaction.create({
        data: {
          userId: acceptedApplication.creatorId,
          jobId: milestone.jobId,
          milestoneId: milestone.id,
          amount,
          fee,
          netAmount,
          type: "RECEIVE_JOB",
          status: "SUCCESS",
          description: `Thanh toán job: ${milestone.job?.title || "Công việc"}`,
        },
      });

      await tx.user.update({
        where: { id: acceptedApplication.creatorId },
        data: { balance: { increment: netAmount } },
      });

      await tx.milestone.update({
        where: { id: milestone.id },
        data: { paymentTransactionId: transaction.id },
      });
    });

    return { success: true, data: { amount, netAmount, fee, creatorId: acceptedApplication.creatorId } };
  } catch (error) {
    console.error("Lỗi hoàn tất thanh toán milestone:", error);
    return { success: false, error: error?.message || "Lỗi khi ghi nhận thanh toán" };
  }
}

export async function getJobApplicants(jobId) {
  const user = await getAuthenticatedUser();
  if (!user || user.role !== "SHOP") {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const applications = await prisma.application.findMany({
      where: { jobId },
      include: {
        creator: {
          include: {
            creatorProfile: true
          }
        }
      },
      orderBy: { createdAt: "desc" },
    });

    const formatted = applications.map(app => ({
      id: app.id,
      jobId: app.jobId,
      status: app.status,
      matchRate: app.matchRate,
      createdAt: app.createdAt,
      creator: {
        id: app.creator.id,
        name: app.creator.name,
        avatar: "👩🏻",
        vibe: app.creator.creatorProfile?.styles?.[0] ? `#${app.creator.creatorProfile.styles[0]}` : "#GenZ",
        channelUrl: app.creator.creatorProfile?.portfolioUrl || "tiktok.com/@creator",
        followers: "120K",
        bio: app.creator.creatorProfile?.bio || "Xin chào, mình mong được hợp tác với shop!",
      },
      metrics: {
        engagementRate: "5.0%",
        avgViews: "30K",
      },
      proposal: {
        message: app.creator.creatorProfile?.bio || "Mình rất thích dự án này và mong muốn được làm việc chung.",
        budget: "Theo ngân sách",
      }
    }));

    return { success: true, data: formatted };
  } catch (error) {
    console.error("Lỗi lấy ứng viên:", error);
    return { success: false, error: "Lỗi server" };
  }
}

export async function approveApplicant(applicationId, jobId) {
  const user = await getAuthenticatedUser();
  if (!user || user.role !== "SHOP") {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const job = await prisma.job.findUnique({ where: { id: jobId } });
    if (!job || job.shopId !== user.id) {
      return { success: false, error: "Không tìm thấy chiến dịch hợp lệ" };
    }

    const existingMilestonesCount = await prisma.milestone.count({ where: { jobId } });

    if (existingMilestonesCount === 0) {
      await prisma.job.update({
        where: { id: jobId },
        data: {
          status: "IN_PROGRESS",
          milestones: {
            create: [
              { title: "Nộp kịch bản", type: "SCRIPT", order: 1, status: "IN_PROGRESS" },
              { title: "Nộp video mẫu", type: "VIDEO", order: 2, status: "PENDING" },
              { title: "Đăng video lên kênh", type: "LINK", order: 3, status: "PENDING" },
              { title: "Nghiệm thu & Thanh toán", type: "PAYMENT", order: 4, status: "PENDING" },
            ]
          }
        }
      });
    } else {
      await prisma.job.update({
        where: { id: jobId },
        data: { status: "IN_PROGRESS" }
      });
    }

    const appRecord = await prisma.application.findUnique({
      where: { id: applicationId },
      include: {
        job: {
          include: {
            shop: true,
            milestones: { orderBy: { order: "asc" } }
          }
        },
        creator: {
          include: { creatorProfile: true }
        }
      }
    });

    if (!appRecord) return { success: false, error: "Không tìm thấy ứng viên" };

    const signQuickRes = await createSignatureRequest(appRecord);

    await prisma.application.update({
      where: { id: applicationId },
      data: {
        status: "ACCEPTED",
        contractDocumentId: signQuickRes.success ? signQuickRes.documentId : null,
        contractStatus: "PENDING",
        contractUrl: signQuickRes.success ? signQuickRes.pdfUrl : null,
        signUrl: signQuickRes.success ? signQuickRes.signUrl : null
      }
    });

    await prisma.application.updateMany({
      where: {
        jobId: jobId,
        id: { not: applicationId }
      },
      data: { status: "REJECTED" }
    });

    return { success: true };
  } catch (error) {
    console.error("Lỗi duyệt ứng viên:", error);
    return { success: false, error: "Đã có lỗi xảy ra" };
  }
}

export async function rejectApplicant(applicationId) {
  const user = await getAuthenticatedUser();
  if (!user || user.role !== "SHOP") {
    return { success: false, error: "Unauthorized" };
  }

  try {
    await prisma.application.update({
      where: { id: applicationId },
      data: { status: "REJECTED" }
    });
    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false, error: "Lỗi server" };
  }
}

export async function getAcceptedApplication(jobId) {
  const user = await getAuthenticatedUser();
  if (!user) return { success: false, error: "Unauthorized" };

  try {
    const application = await prisma.application.findFirst({
      where: { jobId, status: "ACCEPTED" }
    });
    return { success: true, data: application };
  } catch (error) {
    console.error(error);
    return { success: false, error: "Lỗi lấy thông tin ứng tuyển" };
  }
}

export async function getJobMilestones(jobId) {
  const user = await getAuthenticatedUser();
  if (!user) return { success: false, error: "Unauthorized" };

  try {
    const milestones = await prisma.milestone.findMany({
      where: { jobId },
      orderBy: { order: "asc" }
    });
    return { success: true, data: milestones };
  } catch (error) {
    console.error(error);
    return { success: false, error: "Lỗi lấy dữ liệu tiến độ" };
  }
}

export async function createPaymentLinkForMilestone(milestoneId) {
  const user = await getAuthenticatedUser();
  if (!user || user.role !== "SHOP") return { success: false, error: "Unauthorized" };

  try {
    const milestone = await prisma.milestone.findUnique({
      where: { id: milestoneId },
      include: { job: true }
    });

    if (!milestone) return { success: false, error: "Không tìm thấy Milestone" };
    if (milestone.job.shopId !== user.id) return { success: false, error: "Milestone không thuộc shop này" };
    if (milestone.type !== "PAYMENT") return { success: false, error: "Milestone này không phải bước thanh toán" };
    if (milestone.status === "COMPLETED") return { success: false, error: "Bước thanh toán đã hoàn thành" };

    const paymentLinkResult = await createPayosPaymentLink(milestone, user);
    if (!paymentLinkResult.success) {
      return { success: false, error: paymentLinkResult.error };
    }

    await prisma.milestone.update({
      where: { id: milestoneId },
      data: {
        submission: paymentLinkResult.checkoutUrl,
        feedback: null,
      }
    });

    return { success: true, data: paymentLinkResult.checkoutUrl };
  } catch (error) {
    console.error("Lỗi tạo link thanh toán:", error);
    return { success: false, error: "Lỗi khi tạo link thanh toán" };
  }
}

// Shop duyệt Milestone
export async function approveMilestone(milestoneId) {
  const user = await getAuthenticatedUser();
  if (!user || user.role !== "SHOP") {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const milestone = await prisma.milestone.findUnique({
      where: { id: milestoneId },
      include: { job: true }
    });
    if (!milestone) return { success: false, error: "Không tìm thấy Milestone" };

    if (milestone.type === "PAYMENT") {
      const result = await finalizePaymentMilestone(milestone);
      if (!result.success) {
        return { success: false, error: result.error };
      }
      return { success: true, data: result.data };
    }

    await prisma.milestone.update({
      where: { id: milestoneId },
      data: { status: "COMPLETED", feedback: null }
    });

    const nextMilestone = await prisma.milestone.findFirst({
      where: { jobId: milestone.jobId, order: milestone.order + 1 },
      include: { job: true }
    });
    if (nextMilestone) {
      const updateData = { status: "IN_PROGRESS" };
      if (nextMilestone.type === "PAYMENT") {
        const paymentLinkResult = await createPayosPaymentLink(nextMilestone, user);
        if (paymentLinkResult.success) {
          updateData.submission = paymentLinkResult.checkoutUrl;
        }
      }
      await prisma.milestone.update({
        where: { id: nextMilestone.id },
        data: updateData
      });
    }

    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false, error: "Lỗi khi duyệt Milestone" };
  }
}

// Shop từ chối Milestone
export async function rejectMilestone(milestoneId, feedback) {
  try {
    await prisma.milestone.update({
      where: { id: milestoneId },
      data: { status: "REJECTED", feedback: feedback }
    });
    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false, error: "Lỗi khi từ chối Milestone" };
  }
}

// Cập nhật trạng thái hợp đồng (Polling / On Demand)
export async function syncContractStatus(applicationId) {
  const user = await getAuthenticatedUser();
  if (!user) return { success: false, error: "Unauthorized" };

  try {
    const appRecord = await prisma.application.findUnique({
      where: { id: applicationId }
    });

    if (!appRecord || !appRecord.contractDocumentId) {
      return { success: false, error: "Không tìm thấy thông tin hợp đồng" };
    }

    if (appRecord.contractStatus === "COMPLETED") {
      return { success: true, status: "COMPLETED" };
    }

    const statusRes = await checkDocumentStatus(appRecord.contractDocumentId);

    if (statusRes.success && statusRes.status === "fulfilled") {
      const completedPdfUrl = await downloadSignedDocument(appRecord.contractDocumentId);

      await prisma.application.update({
        where: { id: applicationId },
        data: {
          contractStatus: "COMPLETED",
          contractUrl: completedPdfUrl || appRecord.contractUrl
        }
      });
      return { success: true, status: "COMPLETED" };
    }

    return { success: true, status: "PENDING" };
  } catch (error) {
    console.error("Lỗi đồng bộ trạng thái hợp đồng:", error);
    return { success: false, error: "Lỗi server" };
  }
}