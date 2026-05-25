"use client";

import React, { useState } from "react";
import ChatList from "#/components/messages/ChatList";
import ChatWindow from "#/components/messages/ChatWindow";

// --- MOCK DATA ---
const initialChats = [
  {
    id: "c-1",
    kocName: "Thảo Vy Review",
    kocAvatar: "👩🏻",
    campaignName: "Review BST Mùa Hè 2026",
    status: "collaborating", // waiting, collaborating
    isOnline: true,
    lastMessage: "Chốt nhé shop ơi, mai mình quay!",
    lastMessageTime: "10:30",
    unreadCount: 0,
    originalBudget: "5,000,000đ",
  },
  {
    id: "c-2",
    kocName: "Khoa Style",
    kocAvatar: "🧑🏻‍🎤",
    campaignName: "Chụp Lookbook Đường Phố",
    status: "waiting",
    isOnline: false,
    lastMessage: "Shop xem qua mẫu hợp đồng mình gửi nhé.",
    lastMessageTime: "Hôm qua",
    unreadCount: 2,
    originalBudget: "3,500,000đ",
  },
  {
    id: "c-3",
    kocName: "Linh Đan",
    kocAvatar: "👱🏻‍♀️",
    campaignName: "Quay TikTok Dance",
    status: "waiting",
    isOnline: true,
    lastMessage: "Video này mình cần makeup đậm hay nhạt ạ?",
    lastMessageTime: "T3",
    unreadCount: 0,
    originalBudget: "4,000,000đ",
  },
];

const initialMessages = {
  "c-1": [
    { type: "text", content: "Chào Thảo Vy, cảm ơn bạn đã ứng tuyển!", sender: "shop", timestamp: "09:00" },
    { type: "text", content: "Chào shop, mình rất thích sản phẩm đợt này.", sender: "koc", timestamp: "09:05" },
    { type: "image", content: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&h=300&fit=crop", sender: "shop", timestamp: "09:10" },
    { type: "text", content: "Đây là mẫu áo chủ đạo nhé. Mình gửi Thẻ hợp đồng để bạn chốt điều khoản nhé.", sender: "shop", timestamp: "09:11" },
    { 
      type: "proposal", 
      content: { taskName: "Review BST Mùa Hè 2026", videoCount: "2", deadline: "15/06/2026", budget: "5,000,000" }, 
      sender: "shop", 
      timestamp: "09:15",
      status: "accepted" 
    },
    { type: "text", content: "Chốt nhé shop ơi, mai mình quay!", sender: "koc", timestamp: "10:30" },
  ],
  "c-2": [
    { type: "text", content: "Chào shop, mức ngân sách 3.5M cho 1 ngày chụp là hợp lý. Tuy nhiên mình cần thêm tiền di chuyển.", sender: "koc", timestamp: "Hôm qua" },
    { type: "text", content: "Shop xem qua mẫu hợp đồng mình gửi nhé.", sender: "koc", timestamp: "Hôm qua" },
  ],
  "c-3": [
    { type: "text", content: "Chào Linh Đan!", sender: "shop", timestamp: "T3" },
    { type: "text", content: "Video này mình cần makeup đậm hay nhạt ạ?", sender: "koc", timestamp: "T3" },
  ],
};

export default function MessagesPage() {
  const [chats, setChats] = useState(initialChats);
  const [messagesDB, setMessagesDB] = useState(initialMessages);
  const [selectedChatId, setSelectedChatId] = useState(null);

  const activeChat = chats.find(c => c.id === selectedChatId) || null;
  const activeMessages = selectedChatId ? messagesDB[selectedChatId] || [] : [];

  const handleSelectChat = (chatId) => {
    setSelectedChatId(chatId);
    // Mark as read
    setChats(prev => prev.map(c => c.id === chatId ? { ...c, unreadCount: 0 } : c));
  };

  const handleSendMessage = (chatId, messageObj) => {
    setMessagesDB(prev => ({
      ...prev,
      [chatId]: [...(prev[chatId] || []), messageObj]
    }));
    // Update last message in chat list
    setChats(prev => prev.map(c => 
      c.id === chatId ? { ...c, lastMessage: messageObj.content, lastMessageTime: "Vừa xong" } : c
    ));
  };

  const handleSendProposal = (chatId, proposalObj) => {
    setMessagesDB(prev => ({
      ...prev,
      [chatId]: [...(prev[chatId] || []), proposalObj]
    }));
    setChats(prev => prev.map(c => 
      c.id === chatId ? { ...c, lastMessage: "[Đã gửi Thẻ Hợp Đồng]", lastMessageTime: "Vừa xong" } : c
    ));
  };

  return (
    // Sử dụng chiều cao 100vh trừ đi header/topbar nếu có (VD: h-[calc(100vh-80px)])
    <div className="flex h-full w-full bg-white overflow-hidden animate-in fade-in duration-500">
      
      {/* Cột trái: Chat List */}
      <ChatList 
        chats={chats} 
        selectedChatId={selectedChatId} 
        onSelectChat={handleSelectChat} 
      />

      {/* Cột phải: Chat Window */}
      <ChatWindow 
        chat={activeChat} 
        messages={activeMessages} 
        onSendMessage={handleSendMessage}
        onSendProposal={handleSendProposal}
      />

    </div>
  );
}
