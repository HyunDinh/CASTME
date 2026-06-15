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
    const profile = await prisma.creatorProfile.findUnique({
      where: { userId: user.id },
    });

    return {
      success: true,
      data: {
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