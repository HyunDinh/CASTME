"use server";
import { prisma } from "#/lib/prisma";
import { cookies } from "next/headers";

async function getAuthShop() {
  const cookieStore = await cookies();
  const session = cookieStore.get("castme_session");
  if (!session) return null;
  return JSON.parse(session.value);
}

// Lấy profile Shop
export async function getShopProfile() {
  const user = await getAuthShop();
  if (!user || user.role !== "SHOP") {
    return { success: false, error: "Vui lòng đăng nhập" };
  }

  try {
    const profile = await prisma.shopProfile.findUnique({
      where: { userId: user.id },
    });

    const user_data = await prisma.user.findUnique({
      where: { id: user.id },
    });

    return {
      success: true,
      data: {
        shopName: profile?.shopName || "",
        description: profile?.description || "",
        categories: profile?.categories || [],
        vibeText: profile?.vibeText || "",
        website: profile?.website || "",
        instagram: profile?.instagram || "",
        phone: profile?.phone || "",
        address: profile?.address || "",
        averageRating: profile?.averageRating || 0,
        totalJobs: profile?.totalJobs || 0,
        plan: user_data?.plan || "FREE",
        hearts: user_data?.hearts || 0,
        connects: user_data?.connects || 0,
      },
    };
  } catch (error) {
    console.error(error);
    return { success: false, error: "Không thể tải hồ sơ" };
  }
}

// Cập nhật profile Shop
export async function updateShopProfile(data) {
  const user = await getAuthShop();
  if (!user || user.role !== "SHOP") {
    return { success: false, error: "Vui lòng đăng nhập" };
  }

  try {
    await prisma.shopProfile.upsert({
      where: { userId: user.id },
      update: {
        shopName: data.shopName,
        description: data.description,
        categories: data.categories,
        vibeText: data.vibeText,
        website: data.website,
        instagram: data.instagram,
        phone: data.phone,
        address: data.address,
      },
      create: {
        userId: user.id,
        shopName: data.shopName,
        description: data.description,
        categories: data.categories,
        vibeText: data.vibeText,
        website: data.website,
        instagram: data.instagram,
        phone: data.phone,
        address: data.address,
      },
    });

    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false, error: "Không thể cập nhật hồ sơ" };
  }
}
