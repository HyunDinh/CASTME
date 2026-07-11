"use server";
import { prisma } from "#/lib/prisma";
import { cookies } from "next/headers";

async function getAuthenticatedUser() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("castme_session");
  if (!sessionCookie) return null;
  try {
    return JSON.parse(sessionCookie.value);
  } catch (e) {
    return null;
  }
}

// Lấy danh sách hội thoại của người dùng hiện tại
export async function getConversations() {
  const user = await getAuthenticatedUser();
  if (!user) return { success: false, error: "Unauthorized" };

  try {
    const isShop = user.role === "SHOP";
    
    const conversations = await prisma.conversation.findMany({
      where: isShop ? { shopId: user.id } : { creatorId: user.id },
      include: {
        shop: { select: { id: true, name: true, shopProfile: { select: { mainImage: true } } } },
        creator: { select: { id: true, name: true, creatorProfile: { select: { mainImage: true } } } },
        job: { select: { id: true, title: true } },
        messages: {
          orderBy: { createdAt: "desc" },
          take: 1
        }
      },
      orderBy: { lastMessageAt: "desc" }
    });

    return { success: true, data: conversations };
  } catch (error) {
    console.error("getConversations error:", error);
    return { success: false, error: "Lỗi hệ thống" };
  }
}

// Lấy nội dung tin nhắn trong 1 hội thoại
export async function getMessages(conversationId) {
  const user = await getAuthenticatedUser();
  if (!user) return { success: false, error: "Unauthorized" };

  try {
    const conversation = await prisma.conversation.findUnique({
      where: { id: conversationId }
    });

    if (!conversation) return { success: false, error: "Not found" };
    if (conversation.shopId !== user.id && conversation.creatorId !== user.id) {
      return { success: false, error: "Forbidden" };
    }

    const messages = await prisma.message.findMany({
      where: { conversationId },
      orderBy: { createdAt: "asc" }
    });

    return { success: true, data: messages };
  } catch (error) {
    console.error("getMessages error:", error);
    return { success: false, error: "Lỗi hệ thống" };
  }
}

// Gửi tin nhắn mới
export async function sendMessage(conversationId, content) {
  const user = await getAuthenticatedUser();
  if (!user) return { success: false, error: "Unauthorized" };

  try {
    const conversation = await prisma.conversation.findUnique({
      where: { id: conversationId }
    });

    if (!conversation || (conversation.shopId !== user.id && conversation.creatorId !== user.id)) {
      return { success: false, error: "Forbidden" };
    }

    const newMessage = await prisma.message.create({
      data: {
        conversationId,
        senderId: user.id,
        content,
        messageType: "TEXT"
      }
    });

    // Cập nhật lastMessageAt
    await prisma.conversation.update({
      where: { id: conversationId },
      data: { lastMessageAt: new Date() }
    });

    return { success: true, data: newMessage };
  } catch (error) {
    console.error("sendMessage error:", error);
    return { success: false, error: "Lỗi hệ thống" };
  }
}

// Khởi tạo hoặc lấy hội thoại
export async function getOrCreateConversation(targetUserId, jobId = null) {
  const user = await getAuthenticatedUser();
  if (!user) return { success: false, error: "Unauthorized" };

  try {
    let shopId = user.role === "SHOP" ? user.id : targetUserId;
    let creatorId = user.role === "CREATOR" ? user.id : targetUserId;

    let conversation = await prisma.conversation.findFirst({
      where: { shopId, creatorId, jobId: jobId || null }
    });

    if (!conversation) {
      conversation = await prisma.conversation.create({
        data: {
          shopId,
          creatorId,
          jobId: jobId || null
        }
      });
    }

    return { success: true, data: conversation.id };
  } catch (error) {
    console.error("getOrCreateConversation error:", error);
    return { success: false, error: "Lỗi hệ thống" };
  }
}
