import { NextResponse } from "next/server";
import { prisma } from "#/lib/prisma";

export async function GET(request, { params }) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Creator ID is required" },
        { status: 400 },
      );
    }

    const creator = await prisma.user.findUnique({
      where: {
        id: id,
        role: "CREATOR",
      },
      select: {
        id: true,
        name: true,
        creatorProfile: {
          select: {
            bio: true,
            styles: true,
            portfolioUrl: true,
            mainImage: true,
            gallery: true,
            coverImage: true,
            location: true,
            priceRange: true,
            followersCount: true,
            socialLinks: true,
          },
        },
        receivedReviews: {
          select: {
            id: true,
            rating: true,
            content: true,
            createdAt: true,
            shop: {
              select: {
                name: true,
                shopProfile: {
                  select: {
                    shopName: true,
                  },
                },
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        },
        _count: {
          select: {
            applications: {
              where: {
                status: "ACCEPTED", // Or whatever status implies completed jobs
              },
            },
          },
        },
      },
    });

    if (!creator) {
      return NextResponse.json(
        { success: false, error: "Creator not found" },
        { status: 404 },
      );
    }

    // Prepare data
    const profile = creator.creatorProfile || {};
    const reviewCount = creator.receivedReviews?.length || 0;
    const averageRating =
      reviewCount > 0
        ? Number(
            (
              creator.receivedReviews.reduce(
                (sum, rev) => sum + rev.rating,
                0,
              ) / reviewCount
            ).toFixed(1),
          )
        : 0;

    const formattedCreator = {
      id: creator.id,
      name: creator.name,
      coverImage:
        profile.coverImage ||
        "https://images.unsplash.com/photo-1498661694102-0a3793edbe74?q=80&w=2000&auto=format&fit=crop", // Fallback
      avatar: profile.mainImage || creator.name.charAt(0).toUpperCase(),
      bio: profile.bio || "Creator này chưa cập nhật tiểu sử.",
      location: profile.location || "Chưa cập nhật",
      priceRange: (() => {
        try {
          const prices = JSON.parse(profile.priceRange);
          if (prices && prices.photo) {
            return `${prices.photo} - ${prices.livestream}`;
          }
        } catch {}
        return profile.priceRange || "Thỏa thuận";
      })(),
      styles: profile.styles || [],
      stats: {
        followers: profile.followersCount || "0",
        jobsCompleted: creator._count.applications || 0,
        averageRating: averageRating,
        reviewCount: reviewCount,
      },
      socials: Array.isArray(profile.socialLinks) ? profile.socialLinks : [],
      gallery: profile.gallery || [],
      reviews: creator.receivedReviews.map((review) => ({
        id: review.id,
        shopName:
          review.shop?.shopProfile?.shopName || review.shop?.name || "Ẩn danh",
        shopAvatar: (
          review.shop?.shopProfile?.shopName ||
          review.shop?.name ||
          "A"
        )
          .charAt(0)
          .toUpperCase(),
        rating: review.rating,
        content: review.content,
        // Dùng toLocaleDateString() ở frontend hoặc map đơn giản
        createdAt: new Date(review.createdAt).toLocaleDateString("vi-VN", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        }),
      })),
    };

    return NextResponse.json({ success: true, data: formattedCreator });
  } catch (error) {
    console.error("Error fetching creator details:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
