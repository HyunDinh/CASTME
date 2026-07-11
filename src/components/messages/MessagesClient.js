"use client";
import React, { useState, useEffect, useRef } from "react";
import { getConversations, getMessages, sendMessage } from "#/app/(shop)/messages/actions";
import { Send, Image as ImageIcon, Paperclip, MoreVertical, Search, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function MessagesClient({ currentUser }) {
  const [conversations, setConversations] = useState([]);
  const [activeConvId, setActiveConvId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  
  const messagesEndRef = useRef(null);

  // Lấy danh sách hội thoại
  const fetchConversations = async () => {
    const res = await getConversations();
    if (res.success) {
      setConversations(res.data);
      if (!activeConvId && res.data.length > 0) {
        // Tự động chọn hội thoại đầu tiên nếu chưa có
        setActiveConvId(res.data[0].id);
      }
    }
    setLoading(false);
  };

  // Lấy tin nhắn của hội thoại hiện tại
  const fetchMessages = async (convId) => {
    if (!convId) return;
    const res = await getMessages(convId);
    if (res.success) {
      setMessages(res.data);
      scrollToBottom();
    }
  };

  useEffect(() => {
    fetchConversations();
  }, []);

  useEffect(() => {
    if (activeConvId) {
      fetchMessages(activeConvId);
    }
  }, [activeConvId]);

  // Short Polling mỗi 3 giây
  useEffect(() => {
    const interval = setInterval(() => {
      fetchConversations(); // Cập nhật lại list ở cột trái
      if (activeConvId) {
        fetchMessages(activeConvId); // Cập nhật tin nhắn cột phải
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [activeConvId]);

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!inputText.trim() || !activeConvId || sending) return;

    setSending(true);
    const tempText = inputText;
    setInputText(""); // Xóa input ngay lập tức cho mượt
    
    // Thêm tin nhắn tạm vào giao diện
    const tempMsg = {
      id: "temp_" + Date.now(),
      content: tempText,
      senderId: currentUser.id,
      createdAt: new Date().toISOString()
    };
    setMessages(prev => [...prev, tempMsg]);
    scrollToBottom();

    const res = await sendMessage(activeConvId, tempText);
    if (res.success) {
      // Tin nhắn gửi thành công sẽ được tải lại ở vòng lặp polling kế tiếp
      // fetchMessages(activeConvId);
    }
    setSending(false);
  };

  const activeConv = conversations.find(c => c.id === activeConvId);

  // Tìm thông tin đối tác chat
  const getPartnerInfo = (conv) => {
    if (!conv) return null;
    if (currentUser.role === "SHOP") return conv.creator;
    return conv.shop;
  };

  if (loading) {
    return <div className="flex-1 flex items-center justify-center">Đang tải tin nhắn...</div>;
  }

  return (
    <div className="flex-1 max-w-[1400px] w-full mx-auto p-4 md:p-6 flex gap-6 h-[calc(100vh-64px)]">
      {/* Cột trái: Danh sách hội thoại */}
      <div className="w-full md:w-[380px] bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col flex-shrink-0 h-full overflow-hidden">
        <div className="p-5 border-b border-gray-100">
          <h1 className="text-xl font-bold text-gray-900">Tin nhắn</h1>
          <div className="mt-4 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input 
              type="text" 
              placeholder="Tìm kiếm hội thoại..." 
              className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {conversations.length === 0 ? (
            <div className="p-8 text-center text-gray-500 text-sm">Chưa có cuộc trò chuyện nào</div>
          ) : (
            conversations.map(conv => {
              const partner = getPartnerInfo(conv);
              const lastMsg = conv.messages?.[0];
              const isActive = conv.id === activeConvId;

              return (
                <div 
                  key={conv.id}
                  onClick={() => setActiveConvId(conv.id)}
                  className={`p-4 border-b border-gray-50 flex gap-3 cursor-pointer transition-colors ${
                    isActive ? "bg-blue-50/50" : "hover:bg-gray-50"
                  }`}
                >
                  <div className="w-12 h-12 rounded-full bg-gray-200 flex-shrink-0 flex items-center justify-center text-xl overflow-hidden relative">
                    {partner?.shopProfile?.mainImage || partner?.creatorProfile?.mainImage ? (
                      <img src={partner.shopProfile?.mainImage || partner.creatorProfile?.mainImage} alt="" className="w-full h-full object-cover" />
                    ) : (
                      "👤"
                    )}
                    {/* Chấm xanh online (Mock) */}
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center mb-1">
                      <h3 className="font-semibold text-gray-900 truncate">{partner?.name || "Người dùng"}</h3>
                      {lastMsg && (
                        <span className="text-xs text-gray-400">
                          {new Date(lastMsg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      )}
                    </div>
                    {conv.job && (
                      <div className="text-[11px] font-medium text-blue-600 bg-blue-50 inline-block px-2 py-0.5 rounded-md mb-1 truncate max-w-full">
                        Job: {conv.job.title}
                      </div>
                    )}
                    <p className={`text-sm truncate ${isActive ? "text-gray-900 font-medium" : "text-gray-500"}`}>
                      {lastMsg ? (lastMsg.senderId === currentUser.id ? `Bạn: ${lastMsg.content}` : lastMsg.content) : "Bắt đầu cuộc trò chuyện"}
                    </p>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>

      {/* Cột phải: Khung Chat */}
      <div className="flex-1 bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col h-full overflow-hidden hidden md:flex">
        {activeConv ? (
          <>
            {/* Chat Header */}
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-white/80 backdrop-blur-md z-10 sticky top-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-lg overflow-hidden">
                  {getPartnerInfo(activeConv)?.shopProfile?.mainImage || getPartnerInfo(activeConv)?.creatorProfile?.mainImage ? (
                    <img src={getPartnerInfo(activeConv).shopProfile?.mainImage || getPartnerInfo(activeConv).creatorProfile?.mainImage} alt="" className="w-full h-full object-cover" />
                  ) : (
                    "👤"
                  )}
                </div>
                <div>
                  <h2 className="font-bold text-gray-900 flex items-center gap-2">
                    {getPartnerInfo(activeConv)?.name || "Người dùng"}
                    <CheckCircle2 className="w-4 h-4 text-blue-500" />
                  </h2>
                  {activeConv.job ? (
                    <Link href={`/jobs/${activeConv.job.id}`} className="text-xs text-blue-600 hover:underline">
                      Xem chi tiết Job: {activeConv.job.title}
                    </Link>
                  ) : (
                    <span className="text-xs text-green-500 font-medium">Đang hoạt động</span>
                  )}
                </div>
              </div>
              <button className="p-2 text-gray-400 hover:bg-gray-100 rounded-full transition-colors">
                <MoreVertical className="w-5 h-5" />
              </button>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-6 bg-gray-50/50">
              <div className="flex flex-col gap-4">
                {messages.length === 0 ? (
                  <div className="text-center text-gray-400 text-sm mt-10">Hãy gửi lời chào để bắt đầu trò chuyện!</div>
                ) : (
                  messages.map((msg, idx) => {
                    const isMe = msg.senderId === currentUser.id;
                    const showAvatar = !isMe && (idx === messages.length - 1 || messages[idx + 1]?.senderId === currentUser.id);

                    return (
                      <div key={msg.id} className={`flex gap-3 ${isMe ? "justify-end" : "justify-start"}`}>
                        {!isMe && (
                          <div className="w-8 h-8 rounded-full bg-gray-200 flex-shrink-0 overflow-hidden self-end mb-1">
                            {showAvatar ? (
                               getPartnerInfo(activeConv)?.shopProfile?.mainImage || getPartnerInfo(activeConv)?.creatorProfile?.mainImage ? (
                                <img src={getPartnerInfo(activeConv).shopProfile?.mainImage || getPartnerInfo(activeConv).creatorProfile?.mainImage} alt="" className="w-full h-full object-cover" />
                              ) : "👤"
                            ) : null}
                          </div>
                        )}
                        <div className="max-w-[70%]">
                          <div 
                            className={`px-4 py-2.5 rounded-2xl text-[15px] leading-relaxed shadow-sm ${
                              isMe 
                                ? "bg-blue-600 text-white rounded-br-sm" 
                                : "bg-white border border-gray-100 text-gray-800 rounded-bl-sm"
                            }`}
                          >
                            {msg.content}
                          </div>
                          <div className={`text-[11px] text-gray-400 mt-1 px-1 ${isMe ? "text-right" : "text-left"}`}>
                            {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Chat Input */}
            <div className="p-4 bg-white border-t border-gray-100">
              <form onSubmit={handleSend} className="flex items-end gap-3 bg-gray-50 border border-gray-200 p-2 rounded-2xl focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500 transition-all">
                <button type="button" className="p-2 text-gray-400 hover:text-gray-600 transition-colors shrink-0">
                  <Paperclip className="w-5 h-5" />
                </button>
                <button type="button" className="p-2 text-gray-400 hover:text-gray-600 transition-colors shrink-0 -ml-2">
                  <ImageIcon className="w-5 h-5" />
                </button>
                
                <textarea 
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSend(e);
                    }
                  }}
                  placeholder="Nhập tin nhắn..." 
                  className="flex-1 bg-transparent border-none focus:ring-0 resize-none max-h-32 min-h-[44px] py-2.5 text-[15px] placeholder-gray-400"
                  rows={1}
                />

                <button 
                  type="submit" 
                  disabled={!inputText.trim() || sending}
                  className="p-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shrink-0 shadow-sm"
                >
                  <Send className="w-5 h-5" />
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-400 bg-gray-50/50">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Send className="w-8 h-8 text-gray-300" />
            </div>
            <p>Chọn một hội thoại để bắt đầu nhắn tin</p>
          </div>
        )}
      </div>
    </div>
  );
}
