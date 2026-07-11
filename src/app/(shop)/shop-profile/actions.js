"use server";
import { prisma } from "#/lib/prisma";
import { cookies } from "next/headers";

async function getAuthShop() {
  const cookieStore = await cookies();
  const session = cookieStore.get("castme_session");
  if (!session) return null;
  try {
    return JSON.parse(session.value);
  } catch {
    return null;
  }
}

// Lấy profile Shop
export async function getShopProfile() {
  const user = await getAuthShop();
  if (!user || user.role !== "SHOP") {
    return { success: false, error: "Vui lòng đăng nhập" };
  }

  try {
    // Tối ưu hóa: Gộp 2 lệnh query cũ thành 1 lệnh bằng include liên kết
    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      include: { shopProfile: true }
    });

    if (!dbUser) return { success: false, error: "Người dùng không tồn tại" };
    const profile = dbUser.shopProfile;

    return {
      success: true,
      data: {
        shopName: profile?.shopName || dbUser.name || "",
        description: profile?.description || "",
        categories: profile?.categories || [],
        vibeText: profile?.vibeText || "",
        website: profile?.website || "",
        instagram: profile?.instagram || "",
        phone: profile?.phone || "",
        address: profile?.address || "",
        averageRating: profile?.averageRating || 0,
        totalJobs: profile?.totalJobs || 0,
        // Dữ liệu ảnh mới
        mainImage: profile?.mainImage || "",
        coverImage: profile?.coverImage || "",
        gallery: profile?.gallery || [],
        // Dữ liệu gói cước từ User
        plan: dbUser.plan || "FREE",
        hearts: dbUser.hearts || 0,
        connects: dbUser.connects || 0,
      },
    };
  } catch (error) {
    console.error("Get shop profile error:", error);
    return { success: false, error: "Không thể tải hồ sơ" };
  }
}

// Cập nhật profile Shop
export async function updateShopProfile(formData) {
  const user = await getAuthShop();
  if (!user || user.role !== "SHOP") {
    return { success: false, error: "Vui lòng đăng nhập" };
  }

  // Đảm bảo bóc tách dữ liệu an toàn tránh injection trường lạ
  const {
    shopName, description, categories, vibeText,
    website, instagram, phone, address,
    mainImage, coverImage, gallery
  } = formData;

  const shopFields = {
    shopName, description, categories, vibeText,
    website, instagram, phone, address,
    mainImage, coverImage, gallery
  };

  try {
    await prisma.shopProfile.upsert({
      where: { userId: user.id },
      update: shopFields,
      create: {
        userId: user.id,
        ...shopFields
      },
    });

    if (shopName) {
      await prisma.user.update({
        where: { id: user.id },
        data: { name: shopName }
      });
      // Cập nhật session cookie để đồng bộ hóa tên hiển thị trên header
      const cookieStore = await cookies();
      const sessionCookie = cookieStore.get("castme_session");
      if (sessionCookie) {
        try {
          const sessionData = JSON.parse(sessionCookie.value);
          sessionData.name = shopName;
          cookieStore.set("castme_session", JSON.stringify(sessionData), {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 60 * 60 * 24 * 7,
            path: "/",
          });
        } catch (e) {
          console.error("Update session cookie error:", e);
        }
      }
    }

    return { success: true };
  } catch (error) {
    console.error("Update shop profile error:", error);
    return { success: false, error: "Không thể cập nhật hồ sơ" };
  }
}