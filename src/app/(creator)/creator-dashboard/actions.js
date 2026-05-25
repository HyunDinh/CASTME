"use server";
import { prisma } from "#/lib/prisma";
import { cookies } from "next/headers";

// Lấy thông tin Creator từ Cookie
async function getAuthCreator() {
  const cookieStore = await cookies();
  const session = cookieStore.get("castme_session");
  if (!session) return null;
  return JSON.parse(session.value);
}

// READ: Lấy danh sách việc làm đang mở
// READ: Lấy danh sách việc làm đang mở
export async function getAvailableJobs() {
  const jobs = await prisma.job.findMany({
    where: { status: "RECRUITING" },   // Giữ nguyên điều kiện query
    orderBy: { createdAt: "desc" },
    include: { shop: true }, // Nếu bạn cần thông tin shop
  });

  // Format status về UPPERCASE trước khi trả về
  const formattedJobs = jobs.map((job) => ({
    ...job,
    status: job.status?.toUpperCase() || "RECRUITING",   // Đảm bảo luôn uppercase
  }));

  return formattedJobs;
}

// CREATE: Ứng tuyển vào công việc
export async function applyToJobAction(jobId) {
  const user = await getAuthCreator();
  if (!user || user.role !== "CREATOR") return { success: false, error: "Chưa đăng nhập" };

  try {
    const existing = await prisma.application.findFirst({
      where: { jobId, creatorId: user.id }
    });
    
    if (existing) return { success: false, error: "Bạn đã ứng tuyển công việc này rồi" };

    await prisma.application.create({
      data: { jobId, creatorId: user.id, status: "PENDING" }
    });
    return { success: true };
  } catch (error) {
    return { success: false, error: "Lỗi hệ thống" };
  }
}