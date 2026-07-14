"use server";

import { prisma } from "#/lib/prisma";
import { cookies } from "next/headers";

async function getAuthenticatedUser() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("castme_session");
  if (!sessionCookie) return null;

  try {
    return JSON.parse(sessionCookie.value);
  } catch {
    return null;
  }
}

export async function getAdminWithdrawRequests() {
  const user = await getAuthenticatedUser();
  if (!user || user.role !== "ADMIN") {
    return { success: false, error: "Unauthorized" };
  }

  const requests = await prisma.transaction.findMany({
    where: { type: "WITHDRAW", status: "PENDING" },
    orderBy: { createdAt: "desc" },
    include: {
      user: {
        include: {
          creatorProfile: true,
        },
      },
    },
  });

  return {
    success: true,
    data: requests.map((request) => ({
      id: request.id,
      amount: Number(request.amount || 0),
      netAmount: Number(request.netAmount || 0),
      createdAt: request.createdAt,
      description: request.description,
      user: {
        id: request.user.id,
        name: request.user.name,
        email: request.user.email,
        balance: Number(request.user.balance || 0),
        bankName: request.user.creatorProfile?.bankName || null,
        bankAccount: request.user.creatorProfile?.bankAccount || null,
        bankOwner: request.user.creatorProfile?.bankOwner || null,
        qrCodeUrl: request.user.creatorProfile?.qrCodeUrl || null,
      },
    })),
  };
}

export async function getAllUsersForAdmin() {
  const user = await getAuthenticatedUser();
  if (!user || user.role !== "ADMIN") {
    return { success: false, error: "Unauthorized" };
  }

  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      balance: true,
      hearts: true,
      connects: true,
      createdAt: true,
      shopProfile: { select: { shopName: true } },
      creatorProfile: { select: { bio: true } },
    },
  });

  return {
    success: true,
    data: users.map((u) => ({
      ...u,
      balance: Number(u.balance || 0),
      shopName: u.shopProfile?.shopName || null,
      creatorBio: u.creatorProfile?.bio || null,
    })),
  };
}

export async function createAdminAccount(formData) {
  const user = await getAuthenticatedUser();
  if (!user || user.role !== "ADMIN") {
    return { success: false, error: "Unauthorized" };
  }

  const name = formData.get("name")?.toString().trim();
  const email = formData.get("email")?.toString().trim();
  const password = formData.get("password")?.toString();

  if (!name || !email || !password) {
    return { success: false, error: "Vui lòng nhập đầy đủ thông tin" };
  }

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    return { success: false, error: "Email đã tồn tại" };
  }

  const bcrypt = require("bcryptjs");
  const passwordHash = await bcrypt.hash(password, 10);

  await prisma.user.create({
    data: {
      name,
      email,
      password: passwordHash,
      role: "ADMIN",
    },
  });

  return { success: true, message: "Tạo tài khoản admin thành công" };
}

export async function handleWithdrawRequest(transactionId, action, reason = "") {
  const user = await getAuthenticatedUser();
  if (!user || user.role !== "ADMIN") {
    return { success: false, error: "Unauthorized" };
  }

  const transaction = await prisma.transaction.findUnique({
    where: { id: transactionId },
    include: { user: true },
  });

  if (!transaction) {
    return { success: false, error: "Không tìm thấy yêu cầu rút tiền" };
  }

  if (transaction.type !== "WITHDRAW" || transaction.status !== "PENDING") {
    return { success: false, error: "Yêu cầu này không còn ở trạng thái chờ xử lý" };
  }

  const withdrawAmount = Number(transaction.netAmount ?? transaction.amount ?? 0);

  if (action === "APPROVE") {
    await prisma.$transaction(async (tx) => {
      await tx.transaction.update({
        where: { id: transactionId },
        data: {
          status: "SUCCESS",
          description: transaction.description || "Đã chuyển tiền cho creator",
        },
      });

      if (withdrawAmount > 0) {
        await tx.user.update({
          where: { id: transaction.userId },
          data: { balance: { decrement: withdrawAmount } },
        });
      }
    });

    return { success: true, message: "Đã đánh dấu là đã chuyển" };
  }

  const restoreAmount = withdrawAmount;

  await prisma.$transaction(async (tx) => {
    await tx.transaction.update({
      where: { id: transactionId },
      data: {
        status: "FAILED",
        description: reason ? `Từ chối rút tiền: ${reason}` : "Từ chối rút tiền",
      },
    });

    if (restoreAmount > 0) {
      await tx.user.update({
        where: { id: transaction.userId },
        data: { balance: { increment: restoreAmount } },
      });
    }
  });

  return { success: true, message: "Đã từ chối yêu cầu rút tiền" };
}
