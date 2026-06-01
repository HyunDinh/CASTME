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
      },
      take: 20, 
      orderBy: {
        createdAt: "desc",
      },
    });

    const formattedCreators = creators.map((creator) => ({
      id: creator.id,
      name: creator.name,
      avatar: creator.creatorProfile?.mainImage || creator.name.charAt(0).toUpperCase(),
      bio: creator.creatorProfile?.bio || "",
      styles: creator.creatorProfile?.styles || [],
      portfolioUrl: creator.creatorProfile?.portfolioUrl || "",
      gallery: creator.creatorProfile?.gallery || [],
    }));

    return NextResponse.json({ success: true, data: formattedCreators });
  } catch (error) {
    console.error("Error searching creators:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
