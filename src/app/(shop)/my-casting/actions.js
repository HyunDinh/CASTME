// src/app/(shop)/my-casting/actions.js
"use server";
import { prisma } from "#/lib/prisma";
import { cookies } from "next/headers";

// Lấy thông tin user từ cookie
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

export async function createJobAction(data) {
  const user = await getAuthenticatedUser();
  
  if (!user || user.role !== "SHOP") {
    return { success: false, error: "Bạn không có quyền thực hiện hành động này." };
  }

  try {
    const newJob = await prisma.job.create({
      data: {
        title: data.title,
        vibeTags: data.vibeTags || [],
        budget: data.budget,
        description: data.description,
        shopId: user.id, // Dùng ID chuẩn lấy từ cookie đã parse
        status: "DRAFT",
      },
    });

    return { success: true, data: newJob };
  } catch (error) {
    console.error("Lỗi tạo Job:", error);
    return { success: false, error: "Không thể lưu bài tuyển dụng." };
  }
}

export async function getMyCastingJobs() {
  const user = await getAuthenticatedUser();
  
  if (!user || user.role !== "SHOP") {
    return { success: false, error: "Vui lòng đăng nhập lại." };
  }

  try {
    const jobs = await prisma.job.findMany({
      where: { shopId: user.id }, // Dùng ID lấy từ cookie
      orderBy: { createdAt: 'desc' },
      include: { applications: true },
    });

    // ... code map dữ liệu giữ nguyên ...
    const formattedJobs = jobs.map((job) => ({
      id: job.id,
      title: job.title,
      description: job.description,
      budget: job.budget,
      vibeTags: job.vibeTags || [],
      status: job.status.toLowerCase().replace('_', '-'),
      applicantsCount: job.applications.length,
      activeWorkersCount: job.applications.filter(app => app.status === "ACCEPTED").length,
    }));

    return { success: true, data: formattedJobs };
  } catch (error) {
    return { success: false, error: "Không thể tải dữ liệu." };
  }
}


export async function updateJobStatus(jobId, newStatus) {
  const user = await getAuthenticatedUser();

  if (!user || user.role !== "SHOP") {
    return { success: false, error: "Không có quyền" };
  }

  try {
    await prisma.job.update({
      where: { id: jobId },
      data: { status: newStatus },
    });
    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false, error: "Không thể cập nhật trạng thái" };
  }
}