"use server";
import { prisma } from "#/lib/prisma";
import { cookies } from "next/headers";
import { createSignatureRequest, checkDocumentStatus, downloadSignedDocument } from "#/lib/signnow";

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
      status: app.status, // PENDING, ACCEPTED, REJECTED
      matchRate: app.matchRate,
      createdAt: app.createdAt,
      creator: {
        id: app.creator.id,
        name: app.creator.name,
        avatar: "👩🏻", // Mock avatar temporarily until we have image uploads
        vibe: app.creator.creatorProfile?.styles?.[0] ? `#${app.creator.creatorProfile.styles[0]}` : "#GenZ",
        channelUrl: app.creator.creatorProfile?.portfolioUrl || "tiktok.com/@creator",
        followers: "120K", // Mock metric temporarily
        bio: app.creator.creatorProfile?.bio || "Xin chào, mình mong được hợp tác với shop!",
      },
      metrics: {
        engagementRate: "5.0%",
        avgViews: "30K",
      },
      proposal: {
        message: app.creator.creatorProfile?.bio || "Mình rất thích dự án này và mong muốn được làm việc chung.",
        budget: "Theo ngân sách", // Can be updated if budget negotiation is added
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
    // 1. Kiểm tra job có thuộc về shop này không
    const job = await prisma.job.findUnique({ where: { id: jobId } });
    if (!job || job.shopId !== user.id) {
      return { success: false, error: "Không tìm thấy chiến dịch hợp lệ" };
    }

    const appRecord = await prisma.application.findUnique({
      where: { id: applicationId },
      include: {
        job: { include: { shop: true } },
        creator: true
      }
    });

    if (!appRecord) return { success: false, error: "Không tìm thấy ứng viên" };

    // 2. Tạo yêu cầu chữ ký điện tử
    const signQuickRes = await createSignatureRequest(
      appRecord.job.shop.email,
      appRecord.creator.email,
      appRecord.job.shop.name,
      appRecord.creator.name,
      appRecord.job.budget
    );

    // 3. Chuyển Application này thành ACCEPTED và lưu trạng thái Hợp đồng
    await prisma.application.update({
      where: { id: applicationId },
      data: { 
        status: "ACCEPTED",
        contractDocumentId: signQuickRes.success ? signQuickRes.documentId : null,
        contractStatus: "PENDING",
        contractUrl: signQuickRes.success ? signQuickRes.pdfUrl : null, // Lưu bản PDF xem trước
        signUrl: signQuickRes.success ? signQuickRes.signUrl : null
      }
    });

    // 4. Chuyển tất cả Application khác thành REJECTED
    await prisma.application.updateMany({
      where: {
        jobId: jobId,
        id: { not: applicationId }
      },
      data: { status: "REJECTED" }
    });

    // 5 & 6. Cập nhật trạng thái Job và tự động tạo 4 Milestones chuẩn (nếu chưa có)
    const existingMilestonesCount = await prisma.milestone.count({ where: { jobId } });
    
    if (existingMilestonesCount === 0) {
      await prisma.job.update({
        where: { id: jobId },
        data: { 
          status: "IN_PROGRESS",
          milestones: {
            create: [
              { title: "Nộp kịch bản", type: "SCRIPT", order: 1, status: "IN_PROGRESS" }, // Bước 1 được tự động bật IN_PROGRESS
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

// Shop duyệt Milestone
export async function approveMilestone(milestoneId) {
  try {
    const milestone = await prisma.milestone.findUnique({
      where: { id: milestoneId },
      include: { job: true }
    });
    if (!milestone) return { success: false, error: "Không tìm thấy Milestone" };

    // Update current milestone to COMPLETED
    await prisma.milestone.update({
      where: { id: milestoneId },
      data: { status: "COMPLETED", feedback: null }
    });

    // If it's the last milestone (PAYMENT), mark job as COMPLETED
    if (milestone.type === "PAYMENT") {
      await prisma.job.update({
        where: { id: milestone.jobId },
        data: { status: "COMPLETED" }
      });
    } else {
      // Find the next milestone and mark it IN_PROGRESS
      const nextMilestone = await prisma.milestone.findFirst({
        where: { jobId: milestone.jobId, order: milestone.order + 1 }
      });
      if (nextMilestone) {
        await prisma.milestone.update({
          where: { id: nextMilestone.id },
          data: { status: "IN_PROGRESS" }
        });
      }
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
      return { success: true, status: "COMPLETED" }; // Đã ký xong
    }

    // Gọi API SignNow để kiểm tra trạng thái
    const statusRes = await checkDocumentStatus(appRecord.contractDocumentId);
    
    if (statusRes.success && statusRes.status === "fulfilled") {
      // 1. Tải bản gốc (đã có đủ chữ ký của 2 bên) về máy chủ
      const completedPdfUrl = await downloadSignedDocument(appRecord.contractDocumentId);

      // 2. Cập nhật DB
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
