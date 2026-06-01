import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q") || "";
    const style = searchParams.get("style") || "";

    const whereClause = {
      role: "CREATOR",
    };

    if (q) {
      whereClause.name = {
        contains: q,
        mode: "insensitive", 
      };
    }

    if (style) {
      whereClause.creatorProfile = {
        styles: {
          has: style,
        },
      };
    }

    const creators = await prisma.user.findMany({
      where: whereClause,
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
          },
        },
        receivedReviews: {
          select: {
            rating: true,
          }
        },
      },
      take: 20, 
      orderBy: {
        createdAt: "desc",
      },
    });

    const formattedCreators = creators.map((creator) => {
      const reviewCount = creator.receivedReviews?.length || 0;
      const averageRating = reviewCount > 0 
        ? (creator.receivedReviews.reduce((sum, rev) => sum + rev.rating, 0) / reviewCount).toFixed(1) 
        : 0;

      return {
        id: creator.id,
        name: creator.name,
        avatar: creator.creatorProfile?.mainImage || creator.name.charAt(0).toUpperCase(),
        bio: creator.creatorProfile?.bio || "",
        styles: creator.creatorProfile?.styles || [],
        portfolioUrl: creator.creatorProfile?.portfolioUrl || "",
        gallery: creator.creatorProfile?.gallery || [],
        averageRating: Number(averageRating),
        reviewCount: reviewCount,
      };
    });

    return NextResponse.json({ success: true, data: formattedCreators });
  } catch (error) {
    console.error("Error searching creators:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
