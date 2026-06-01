"use server";
import { prisma } from "#/lib/prisma";
import { cookies } from "next/headers";

// ==================== HÀM CHUNG ====================
async function getAuthCreator() {
  const cookieStore = await cookies();
  const session = cookieStore.get("castme_session");
  
  if (!session) return null;
  
  try {
    return JSON.parse(session.value);
  } catch (e) {
    return null;
  }
}

// ==================== CÁC FUNCTION HIỆN CÓ ====================

// Lấy danh sách việc làm đang mở
export async function getAvailableJobs() {
  const jobs = await prisma.job.findMany({
    where: { status: "RECRUITING" },
    orderBy: { createdAt: "desc" },
    include: { shop: true },
  });

  const formattedJobs = jobs.map((job) => ({
    ...job,
    status: job.status?.toUpperCase() || "RECRUITING",
  }));

  return formattedJobs;
}

// Ứng tuyển job
export async function applyToJobAction(jobId) {
  const user = await getAuthCreator();
  if (!user || user.role !== "CREATOR") {
    return { success: false, error: "Chưa đăng nhập" };
  }

  try {
    // Kiểm tra số Tim
    if (user.hearts < 5) {
      return { 
        success: false, 
        error: "Bạn không đủ 5 Trái Tim để ứng tuyển. Hãy nạp thêm Tim." 
      };
    }

    // Kiểm tra đã apply chưa
    const existing = await prisma.application.findFirst({
      where: { jobId, creatorId: user.id }
    });
   
    if (existing) {
      return { success: false, error: "Bạn đã ứng tuyển công việc này rồi" };
    }

    await prisma.$transaction(async (tx) => {
      // Tạo Application
      await tx.application.create({
        data: { 
          jobId, 
          creatorId: user.id, 
          status: "PENDING",
          matchRate: Math.floor(Math.random() * 40) + 65, // Tạm thời, sau có thể tính AI thật
        },
      });

      // Trừ 5 Tim
      await tx.user.update({
        where: { id: user.id },
        data: {
          hearts: { decrement: 5 },
        },
      });

      // Ghi lịch sử giao dịch (tiêu hao)
      await tx.transaction.create({
        data: {
          userId: user.id,
          amount: 0,           // Không trừ tiền thật, chỉ trừ Tim
          type: "PAY_JOB",     // Hoặc "SPEND_HEARTS"
          status: "SUCCESS",
          fee: 0,
        },
      });
    });

    return { success: true, message: "Ứng tuyển thành công! Đã trừ 5 Trái Tim." };
  } catch (error) {
    console.error(error);
    return { success: false, error: "Lỗi hệ thống khi ứng tuyển" };
  }
}

// ==================== PROFILE ====================
export async function getCreatorProfile() {
  const user = await getAuthCreator();
  if (!user || user.role !== "CREATOR") {
    return { success: false, error: "Vui lòng đăng nhập" };
  }

  try {
    const profile = await prisma.creatorProfile.findUnique({
      where: { userId: user.id },
    });

    return {
      success: true,
      data: {
        bio: profile?.bio || "",
        styles: profile?.styles || [],
        portfolioUrl: profile?.portfolioUrl || "",
      },
    };
  } catch (error) {
    return { success: false, error: "Không thể tải hồ sơ" };
  }
}

export async function updateCreatorProfile(data) {
  const user = await getAuthCreator();
  if (!user || user.role !== "CREATOR") {
    return { success: false, error: "Vui lòng đăng nhập" };
  }

  try {
    await prisma.creatorProfile.upsert({
      where: { userId: user.id },
      update: {
        bio: data.bio,
        styles: data.styles,
        portfolioUrl: data.portfolioUrl,
      },
      create: {
        userId: user.id,
        bio: data.bio,
        styles: data.styles,
        portfolioUrl: data.portfolioUrl,
      },
    });

    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false, error: "Không thể cập nhật hồ sơ" };
  }
}

// ==================== NẠP TIM ====================
export async function rechargeHearts(heartsAmount, amount) {
  const user = await getAuthCreator();
  if (!user || user.role !== "CREATOR") {
    return { success: false, error: "Vui lòng đăng nhập" };
  }

  try {
    await prisma.$transaction(async (tx) => {
      // Tạo giao dịch nạp tiền
      await tx.transaction.create({
        data: {
          userId: user.id,
          amount: amount,
          type: "DEPOSIT",
          status: "SUCCESS",
          fee: 0,
        },
      });

      // Tăng số Tim
      await tx.user.update({
        where: { id: user.id },
        data: {
          hearts: { increment: heartsAmount },
        },
      });
    });

    return { success: true, message: `Nạp thành công ${heartsAmount} Tim` };
  } catch (error) {
    console.error(error);
    return { success: false, error: "Không thể nạp Tim lúc này" };
  }
}

export async function getUserHearts() {
  const user = await getAuthCreator();
  if (!user || user.role !== "CREATOR") {
    return { success: false, error: "Chưa đăng nhập" };
  }

  try {
    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { hearts: true },
    });

    return { 
      success: true, 
      data: { hearts: dbUser?.hearts || 0 } 
    };
  } catch (error) {
    return { success: false, error: "Không thể lấy số Tim" };
  }
}

// ==================== MY JOBS ====================
export async function getMyAppliedJobs() {
  const user = await getAuthCreator();
  if (!user || user.role !== "CREATOR") {
    return { success: false, error: "Chưa đăng nhập" };
  }

  try {
    const applications = await prisma.application.findMany({
      where: { creatorId: user.id },
      include: {
        job: {
          include: { shop: true }
        }
      },
      orderBy: { createdAt: "desc" }
    });

    const formattedJobs = applications.map((app) => {
      const job = app.job;
      let uiStatus = "APPLYING";

      if (app.status === "ACCEPTED") {
        if (job.status === "IN_PROGRESS") uiStatus = "PROCESSING";
        else if (job.status === "COMPLETED") uiStatus = "COMPLETED";
      } else if (app.status === "REJECTED") {
        uiStatus = "REJECTED"; // Hoặc ẩn đi
      }

      return {
        id: job.id,
        applicationId: app.id,
        shopName: job.shop.name,
        title: job.title,
        budget: job.budget,
        uiStatus: uiStatus, // APPLYING | PROCESSING | COMPLETED | REJECTED
        jobStatus: job.status,
        appStatus: app.status,
        notes: job.description,
        deadline: "N/A"
      };
    });

    return { success: true, data: formattedJobs };
  } catch (error) {
    console.error(error);
    return { success: false, error: "Lỗi hệ thống khi tải danh sách công việc" };
  }
}

// Nộp bài cho Milestone
export async function submitMilestone(milestoneId, submissionText) {
  const user = await getAuthCreator();
  if (!user || user.role !== "CREATOR") {
    return { success: false, error: "Chưa đăng nhập" };
  }

  try {
    const milestone = await prisma.milestone.findUnique({
      where: { id: milestoneId },
      include: { job: { include: { applications: true } } }
    });

    if (!milestone) return { success: false, error: "Không tìm thấy Milestone" };

    // Update milestone
    await prisma.milestone.update({
      where: { id: milestoneId },
      data: {
        submission: submissionText,
        status: "REVIEWING" // Chờ Shop duyệt
      }
    });

    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false, error: "Lỗi khi nộp bài" };
  }
}

// Lấy profile cửa hàng công khai cho Creator xem (theo userId của Shop)
export async function getPublicShopProfile(shopUserId) {
  try {
    const profile = await prisma.shopProfile.findUnique({
      where: { userId: shopUserId },
    });

    const user_data = await prisma.user.findUnique({
      where: { id: shopUserId },
    });

    if (!profile && !user_data) {
      return { success: false, error: "Không tìm thấy cửa hàng" };
    }

    return {
      success: true,
      data: {
        shopName: profile?.shopName || user_data?.name || "",
        description: profile?.description || "",
        categories: profile?.categories || [],
        vibeText: profile?.vibeText || "",
        website: profile?.website || "",
        instagram: profile?.instagram || "",
        phone: profile?.phone || "",
        address: profile?.address || "",
        averageRating: profile?.averageRating || 0,
        totalJobs: profile?.totalJobs || 0,
        ownerName: user_data?.name || "",
      },
    };
  } catch (error) {
    console.error(error);
    return { success: false, error: "Không thể tải hồ sơ cửa hàng" };
  }
}