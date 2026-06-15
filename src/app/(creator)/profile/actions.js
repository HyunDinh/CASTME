"use server";
import { prisma } from "#/lib/prisma";
import { cookies } from "next/headers";

async function getAuthCreator() {
  const cookieStore = await cookies();
  const session = cookieStore.get("castme_session");
  if (!session) return null;
  return JSON.parse(session.value);
}

// Lấy profile Creator
export async function getCreatorProfile() {
  const user = await getAuthCreator();
  if (!user || user.role !== "CREATOR") {
    return { success: false, error: "Vui lòng đăng nhập" };
  }

  try {
    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      include: { creatorProfile: true }
    });

    if (!dbUser) return { success: false, error: "Người dùng không tồn tại" };
    const profile = dbUser.creatorProfile;

    return {
      success: true,
      data: {
        name: dbUser.name || "Tên của bạn",
        bio: profile?.bio || "",
        styles: profile?.styles || [],
        portfolioUrl: profile?.portfolioUrl || "",
        location: profile?.location || "",
        priceRange: profile?.priceRange || "",
        followersCount: profile?.followersCount || "",
        mainImage: profile?.mainImage || "",
        coverImage: profile?.coverImage || "",
        gallery: profile?.gallery || [],
        socialLinks: profile?.socialLinks || {},
      },
    };
  } catch (error) {
    return { success: false, error: "Không thể tải hồ sơ" };
  }
}

// Cập nhật profile Creator
export async function updateCreatorProfile(data) {
  const user = await getAuthCreator();
  if (!user || user.role !== "CREATOR") {
    return { success: false, error: "Vui lòng đăng nhập" };
  }

  try {
    if (data.name) {
      await prisma.user.update({
        where: { id: user.id },
        data: { name: data.name }
      });
    }

    await prisma.creatorProfile.upsert({
      where: { userId: user.id },
      update: {
        bio: data.bio,
        styles: data.styles,
        portfolioUrl: data.portfolioUrl,
        location: data.location,
        priceRange: data.priceRange,
        followersCount: data.followersCount,
        mainImage: data.mainImage,
        coverImage: data.coverImage,
        gallery: data.gallery,
        socialLinks: data.socialLinks,
      },
      create: {
        userId: user.id,
        bio: data.bio,
        styles: data.styles,
        portfolioUrl: data.portfolioUrl,
        location: data.location,
        priceRange: data.priceRange,
        followersCount: data.followersCount,
        mainImage: data.mainImage,
        coverImage: data.coverImage,
        gallery: data.gallery,
        socialLinks: data.socialLinks,
      },
    });

    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false, error: "Không thể cập nhật hồ sơ" };
  }
}