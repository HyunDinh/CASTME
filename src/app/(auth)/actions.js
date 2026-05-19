// src/app/(auth)/actions.js
"use server"; // Khai báo toàn bộ hàm trong file này là Server Actions

import { prisma } from "#/lib/prisma";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";

// 1. ACTION ĐĂNG KÝ
export async function registerAction(formData) {
  const name = formData.get("name");
  const email = formData.get("email");
  const password = formData.get("password");
  const role = formData.get("role"); // "SHOP" hoặc "CREATOR"

  if (!name || !email || !password || !role) {
    return { error: "Vui lòng điền đầy đủ thông tin" };
  }

  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return { error: "Email này đã được đăng ký" };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const trialEndsAt = new Date();
    trialEndsAt.setMonth(trialEndsAt.getMonth() + 1); // 1 tháng dùng thử free

    await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: { name, email, password: hashedPassword, role, trialEndsAt },
      });

      if (role === "SHOP") {
        await tx.shopProfile.create({ data: { userId: user.id } });
      } else if (role === "CREATOR") {
        await tx.creatorProfile.create({ data: { userId: user.id } });
      }
    });

    return { success: true };
  } catch (error) {
    console.error(error);
    return { error: "Có lỗi xảy ra phía máy chủ" };
  }
}

// 2. ACTION ĐĂNG NHẬP
export async function loginAction(formData) {
  const email = formData.get("email");
  const password = formData.get("password");

  if (!email || !password) {
    return { error: "Vui lòng nhập đầy đủ email và mật khẩu" };
  }

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return { error: "Tài khoản hoặc mật khẩu không chính xác" };
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return { error: "Tài khoản hoặc mật khẩu không chính xác" };
    }

    // TẠO SESSION BẰNG COOKIE (Thay thế cho việc lưu localStorage thô sơ)
    // Để làm nhanh và bảo mật cơ bản, ta lưu thông tin User dạng chuỗi JSON thô sơ vào Cookie
    const cookieStore = await cookies();
    cookieStore.set("castme_session", JSON.stringify({
      id: user.id,
      name: user.name,
      role: user.role
    }), {
      httpOnly: true, // Bảo mật: Chống mã độc JavaScript (XSS) lấy cắp cookie
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // Cookie có hiệu lực trong 7 ngày
      path: "/",
    });

    return { success: true, role: user.role };
  } catch (error) {
    console.error(error);
    return { error: "Có lỗi xảy ra phía máy chủ" };
  }
}