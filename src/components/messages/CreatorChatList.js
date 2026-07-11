import React, { useState } from "react";
import { Search } from "lucide-react";

export default function CreatorChatList({ chats, selectedChatId, onSelectChat }) {
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filters = [
    { id: "all", label: "Tất cả" },
    { id: "waiting", label: "Đang chờ" },
    { id: "collaborating", label: "Đang hợp tác" },
  ];

  const filteredChats = chats.filter((chat) => {
    const matchesSearch = chat.shopName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filter === "all" ? true : chat.status === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="flex flex-col h-full bg-white/70 backdrop-blur-md border-r border-gray-200/40 w-full sm:w-[350px] lg:w-[400px] shrink-0 overflow-hidden">
      
      {/* HEADER & LỌC */}
      <div className="p-4 border-b border-gray-100 space-y-4">
        <h2 className="text-xl font-extrabold text-gray-900">Tin nhắn</h2>
        
        {/* Search */}
        <div className="relative">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
            <Search size={16} />
          </span>
          <input
            type="text"
            placeholder="Tìm kiếm Shop..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-sm"
          />
        </div>

        {/* Filter */}
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
          {filters.map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg whitespace-nowrap transition-colors ${
                filter === f.id
                  ? "bg-gray-900 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* DANH SÁCH CHAT */}
      <div className="flex-1 overflow-y-auto scrollbar-hide">
        {filteredChats.map((chat) => {
          const isSelected = chat.id === selectedChatId;
          return (
            <div
              key={chat.id}
              onClick={() => onSelectChat(chat.id)}
              className={`p-4 border-b border-gray-50 cursor-pointer transition-colors flex items-start gap-3 hover:bg-gray-50/80 ${
                isSelected ? "bg-blue-50/50 hover:bg-blue-50/80" : ""
              }`}
            >
              <div className="relative shrink-0">
                <div className="w-12 h-12 bg-indigo-50 rounded-full flex items-center justify-center text-2xl border border-indigo-100">
                  {chat.shopAvatar}
                </div>
                {chat.isOnline && (
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start mb-0.5">
                  <h4 className={`text-sm truncate pr-2 ${chat.unreadCount > 0 ? "font-extrabold text-gray-900" : "font-bold text-gray-700"}`}>
                    {chat.shopName}
                  </h4>
                  <span className={`text-[10px] whitespace-nowrap ${chat.unreadCount > 0 ? "font-bold text-blue-600" : "text-gray-400"}`}>
                    {chat.lastMessageTime}
                  </span>
                </div>
                
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-[9px] font-bold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded truncate max-w-full">
                    {chat.campaignName}
                  </span>
                </div>

                <div className="flex justify-between items-center gap-2">
                  <p className={`text-xs truncate ${chat.unreadCount > 0 ? "font-bold text-gray-900" : "text-gray-500"}`}>
                    {chat.lastMessage}
                  </p>
                  {chat.unreadCount > 0 && (
                    <span className="w-4 h-4 bg-blue-600 text-white text-[9px] font-black rounded-full flex items-center justify-center shrink-0">
                      {chat.unreadCount}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
        {filteredChats.length === 0 && (
          <div className="p-8 text-center text-gray-500 text-sm">
            Không tìm thấy hội thoại nào.
          </div>
        )}
      </div>

    </div>
  );
}
