"use server";
import { prisma } from "#/lib/prisma";
import { cookies } from "next/headers";

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

// Lấy danh sách các Job đang mở của Shop
export async function getShopActiveJobs() {
  const user = await getAuthenticatedUser();
  if (!user || user.role !== "SHOP") return { success: false, error: "Unauthorized" };

  try {
    const jobs = await prisma.job.findMany({
      where: { 
        shopId: user.id,
        status: { in: ["RECRUITING", "DRAFT"] } // Tạm cho phép DRAFT hoặc RECRUITING
      },
      orderBy: { createdAt: "desc" }
    });
    return { success: true, data: jobs };
  } catch (error) {
    console.error("Lỗi getShopActiveJobs:", error);
    return { success: false, error: "Lỗi server" };
  }
}

// Kiểm tra xem Shop đã gửi lời mời cho KOL này chưa
export async function checkHasInvited(creatorId) {
  const user = await getAuthenticatedUser();
  if (!user || user.role !== "SHOP") return { success: false, data: false };

  try {
    const application = await prisma.application.findFirst({
      where: {
        creatorId: creatorId,
        job: { shopId: user.id }
      }
    });
    return { success: true, data: !!application };
  } catch (error) {
    console.error("Lỗi checkHasInvited:", error);
    return { success: false, error: "Lỗi server" };
  }
}

// Shop gửi lời mời KOL tham gia Job
export async function inviteCreatorToJob(creatorId, jobId) {
  const user = await getAuthenticatedUser();
  if (!user || user.role !== "SHOP") return { success: false, error: "Unauthorized" };

  try {
    // Kiểm tra Job có thuộc về Shop này không
    const job = await prisma.job.findUnique({ where: { id: jobId } });
    if (!job || job.shopId !== user.id) {
      return { success: false, error: "Job không hợp lệ" };
    }

    // Kiểm tra xem KOL đã được mời hoặc đã ứng tuyển Job này chưa
    const existing = await prisma.application.findFirst({
      where: { creatorId, jobId }
    });

    if (existing) {
      return { success: false, error: "KOL này đã ứng tuyển hoặc đã được mời vào Job này rồi" };
    }

    // Tạo bản ghi Application với trạng thái INVITED
    const application = await prisma.application.create({
      data: {
        jobId,
        creatorId,
        matchRate: 0,
        status: "INVITED"
      }
    });

    return { success: true, data: application };
  } catch (error) {
    console.error("Lỗi inviteCreatorToJob:", error);
    return { success: false, error: "Lỗi server" };
  }
}
