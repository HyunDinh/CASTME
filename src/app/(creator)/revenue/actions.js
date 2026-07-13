"use server";
import { prisma } from "#/lib/prisma";
import { cookies } from "next/headers";

async function getAuthCreator() {
  const cookieStore = await cookies();
  const session = cookieStore.get("castme_session");
  if (!session) return null;
  try {
    return JSON.parse(session.value);
  } catch {
    return null;
  }
}

export async function getCreatorRevenue() {
  const user = await getAuthCreator();

  if (!user || user.role !== "CREATOR") {
    return { success: false, error: "Unauthorized" };
  }

  const userData = await prisma.user.findUnique({
    where: { id: user.id },
    select: { balance: true },
  });

  const transactions = await prisma.transaction.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    take: 50,
    include: { job: true },
  });

  const incomeTransactions = transactions.filter((t) => t.type === "RECEIVE_JOB" && t.status === "SUCCESS");
  const pendingWithdrawTransactions = transactions.filter((t) => t.type === "WITHDRAW" && t.status === "PENDING");
  const completedWithdrawTransactions = transactions.filter((t) => t.type === "WITHDRAW" && t.status === "SUCCESS");

  const available = Number(userData?.balance || 0);
  const pendingWithdraw = pendingWithdrawTransactions.reduce((sum, t) => sum + Number(t.netAmount ?? t.amount ?? 0), 0);
  const withdrawn = completedWithdrawTransactions.reduce((sum, t) => sum + Number(t.netAmount ?? t.amount ?? 0), 0);
  const totalEarned = incomeTransactions.reduce((sum, t) => sum + Number(t.netAmount || 0), 0);

  return {
    success: true,
    data: {
      available,
      pendingWithdraw,
      withdrawn,
      totalEarned,
      pendingWithdrawCount: pendingWithdrawTransactions.length,
      transactions: transactions.map((t) => ({
        id: t.id,
        jobTitle: t.job?.title || t.description || "Giao dịch",
        grossAmount: Number(t.amount || 0),
        fee: Number(t.fee || 0),
        netAmount: Number(t.netAmount ?? t.amount ?? 0),
        type: t.type,
        status: t.status,
        date: t.createdAt.toLocaleDateString("vi-VN"),
      })),
    },
  };
}

// Lấy thông tin ngân hàng của Creator
export async function getCreatorBankInfo() {
  const user = await getAuthCreator();
  if (!user || user.role !== "CREATOR") {
    return { success: false, error: "Unauthorized" };
  }

  const profile = await prisma.creatorProfile.findUnique({
    where: { userId: user.id },
    select: {
      bankName: true,
      bankAccount: true,
      bankOwner: true,
      qrCodeUrl: true,
    },
  });

  return { success: true, data: profile || {} };
}

// Cập nhật thông tin ngân hàng
export async function updateCreatorBankInfo(data) {
  const user = await getAuthCreator();
  if (!user || user.role !== "CREATOR") {
    return { success: false, error: "Unauthorized" };
  }

  // Kiểm tra xem có request rút tiền đang chờ không
  const pendingWithdraw = await prisma.transaction.findFirst({
    where: {
      userId: user.id,
      type: "WITHDRAW",
      status: "PENDING",
    },
  });

  if (pendingWithdraw) {
    return { success: false, error: "Bạn đang có lệnh rút tiền đang chờ xử lý, không thể chỉnh sửa thông tin ngân hàng." };
  }

  await prisma.creatorProfile.upsert({
    where: { userId: user.id },
    update: {
      bankName: data.bankName,
      bankAccount: data.bankAccount,
      bankOwner: data.bankOwner,
      qrCodeUrl: data.qrCodeUrl,
    },
    create: {
      userId: user.id,
      bankName: data.bankName,
      bankAccount: data.bankAccount,
      bankOwner: data.bankOwner,
      qrCodeUrl: data.qrCodeUrl,
    },
  });

  return { success: true, message: "Cập nhật thông tin ngân hàng thành công" };
}

// Rút toàn bộ tiền
export async function requestFullWithdraw() {
  const user = await getAuthCreator();
  if (!user || user.role !== "CREATOR") {
    return { success: false, error: "Unauthorized" };
  }

  const existingPendingWithdraw = await prisma.transaction.findFirst({
    where: {
      userId: user.id,
      type: "WITHDRAW",
      status: "PENDING",
    },
    select: { id: true },
  });

  if (existingPendingWithdraw) {
    return { success: false, error: "Bạn đã có yêu cầu rút tiền đang chờ admin xác nhận." };
  }

  const userData = await prisma.user.findUnique({
    where: { id: user.id },
    select: { balance: true },
  });

  const amount = Number(userData?.balance || 0);

  if (amount <= 0) {
    return { success: false, error: "Số dư không đủ để rút" };
  }

  await prisma.transaction.create({
    data: {
      userId: user.id,
      amount,
      fee: 0,
      netAmount: amount,
      type: "WITHDRAW",
      status: "PENDING",
      description: "Yêu cầu rút tiền chờ admin duyệt",
    },
  });

  return { success: true, message: `Đã gửi yêu cầu rút ${amount.toLocaleString()}đ. Admin sẽ xác nhận trong thời gian sớm nhất.` };
}