import React, { useState, useRef, useEffect } from "react";
import { Send, Paperclip, FileText, FileBadge, Info, AlertCircle, CheckCircle } from "lucide-react";
import ProposalDealModal from "./ProposalDealModal";

export default function ChatWindow({ chat, messages, onSendMessage, onSendProposal }) {
  const [inputText, setInputText] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const scrollRef = useRef(null);

  // Auto scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  if (!chat) {
    return (
      <div className="flex-1 h-full bg-white/50 backdrop-blur-md flex flex-col items-center justify-center p-8 text-center border-l border-gray-200/40 shrink-0 min-w-0">
        <div className="w-20 h-20 bg-white/60 rounded-full flex items-center justify-center text-4xl shadow-sm mb-4 border border-gray-200/40">
          💬
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">Tin nhắn & Thương lượng</h3>
        <p className="text-gray-500 text-sm max-w-sm">
          Chọn một cuộc hội thoại từ danh sách bên trái để xem tin nhắn và quản lý hợp đồng thông minh.
        </p>
      </div>
    );
  }

  const handleSendText = (e) => {
    e.preventDefault();
    if (inputText.trim()) {
      onSendMessage(chat.id, {
        type: "text",
        content: inputText,
        sender: "shop",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      });
      setInputText("");
    }
  };

  const handleProposalSubmit = (data) => {
    onSendProposal(chat.id, {
      type: "proposal",
      content: data,
      sender: "shop",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: "pending",
    });
  };

  const handleAcceptProposal = () => {
    alert("Đã chấp nhận điều khoản! Trạng thái hợp đồng đã được cập nhật.");
  };

  const handleNegotiate = () => {
    alert("Vui lòng mở tạo lại Thẻ hợp đồng mới để thương lượng lại.");
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-white/50 backdrop-blur-md relative min-w-0 overflow-hidden">
      
      {/* 1. CHAT HEADER */}
      <div className="h-20 border-b border-gray-200/40 flex items-center justify-between px-6 bg-white/60 backdrop-blur-sm shrink-0">
        {/* KOC Info */}
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-12 h-12 bg-indigo-50 rounded-full flex items-center justify-center text-2xl border border-indigo-100">
              {chat.kocAvatar}
            </div>
            {chat.isOnline && (
              <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full"></div>
            )}
          </div>
          <div>
            <h2 className="text-base font-extrabold text-gray-900">{chat.kocName}</h2>
            <p className="text-xs font-medium text-gray-500">
              {chat.isOnline ? "Đang hoạt động" : "Hoạt động 2 giờ trước"}
            </p>
          </div>
        </div>

        {/* Deal Info */}
        <div className="hidden lg:flex items-center gap-6">
          <div className="text-right">
            <p className="text-[10px] font-bold text-gray-400 uppercase mb-0.5">Chiến dịch</p>
            <p className="text-sm font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-lg border border-indigo-100">
              {chat.campaignName}
            </p>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-bold text-gray-400 uppercase mb-0.5">Ngân sách gốc</p>
            <p className="text-sm font-black text-gray-900">{chat.originalBudget}</p>
          </div>
          <button className="px-4 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 text-xs font-bold rounded-xl transition-colors border border-gray-200 cursor-pointer flex items-center gap-2">
            <Info size={14} /> Xem Profile
          </button>
        </div>
      </div>

      {/* 2. MESSAGE FEED */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 bg-transparent">
        {messages.map((msg, idx) => {
          const isShop = msg.sender === "shop";
          
          return (
            <div key={idx} className={`flex flex-col ${isShop ? "items-end" : "items-start"}`}>
              
              {/* Tin nhắn Text thông thường */}
              {msg.type === "text" && (
                <div className={`max-w-[75%] px-4 py-3 rounded-2xl text-sm shadow-xs ${
                  isShop 
                    ? "bg-blue-600 text-white rounded-tr-sm" 
                    : "bg-gray-100 border border-gray-200/60 text-gray-800 rounded-tl-sm"
                }`}>
                  {msg.content}
                </div>
              )}

              {/* Tin nhắn đính kèm Hình ảnh */}
              {msg.type === "image" && (
                <div className={`max-w-[60%] p-1.5 rounded-2xl shadow-xs border ${
                  isShop ? "bg-blue-600 border-blue-700 rounded-tr-sm" : "bg-white border-gray-100 rounded-tl-sm"
                }`}>
                  <img src={msg.content} alt="Attachment" className="rounded-xl w-full object-cover" />
                </div>
              )}

              {/* THẺ HỢP ĐỒNG THÔNG MINH (Proposal Deal Card) */}
              {msg.type === "proposal" && (
                <div className={`w-full max-w-sm mt-2 mb-2 bg-white rounded-2xl border border-blue-100 shadow-md overflow-hidden ${isShop ? "rounded-tr-sm" : "rounded-tl-sm"}`}>
                  <div className="bg-linear-to-r from-blue-600 to-indigo-600 p-4 text-white flex items-center gap-3">
                    <FileBadge size={24} />
                    <div>
                      <h4 className="font-extrabold text-sm">Thẻ Hợp Đồng Dịch Vụ</h4>
                      <p className="text-[10px] text-blue-100 font-medium">Gửi từ {isShop ? "Shop" : "KOC"}</p>
                    </div>
                  </div>
                  <div className="p-5 space-y-4">
                    <div className="space-y-1">
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Tên công việc</p>
                      <p className="text-sm font-bold text-gray-900">{msg.content.taskName}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Số lượng</p>
                        <p className="text-sm font-bold text-gray-900">{msg.content.videoCount} Video</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Hạn nộp</p>
                        <p className="text-sm font-bold text-gray-900">{msg.content.deadline}</p>
                      </div>
                    </div>
                    <div className="space-y-1 bg-gray-50 p-3 rounded-xl border border-gray-100">
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Mức thù lao chốt cuối</p>
                      <p className="text-lg font-black text-purple-600">{msg.content.budget} VND</p>
                    </div>

                    {/* Nút thao tác trực tiếp trên Card */}
                    <div className="flex gap-2 pt-2">
                      <button 
                        onClick={handleNegotiate}
                        className="flex-1 py-2.5 bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-700 text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <AlertCircle size={14} /> Thương lượng
                      </button>
                      <button 
                        onClick={handleAcceptProposal}
                        className="flex-1 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white shadow-sm shadow-emerald-200 text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <CheckCircle size={14} /> Chấp nhận
                      </button>
                    </div>
                  </div>
                </div>
              )}

              <span className="text-[10px] text-gray-400 mt-1 font-medium">{msg.timestamp}</span>
            </div>
          );
        })}
      </div>

      {/* 3. CHAT INPUT BAR */}
      <div className="p-4 bg-white/60 backdrop-blur-sm border-t border-gray-200/40 shrink-0">
        <form onSubmit={handleSendText} className="flex items-end gap-3 max-w-5xl mx-auto">
          {/* Nút Tạo thẻ Hợp đồng nhanh */}
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="p-3 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-xl transition-colors shrink-0 flex items-center justify-center group relative cursor-pointer"
          >
            <FileText size={20} />
            {/* Tooltip */}
            <span className="absolute bottom-full mb-2 hidden group-hover:block w-max bg-gray-900 text-white text-xs font-bold px-2 py-1 rounded shadow-lg">
              Tạo Hợp Đồng Nhanh
            </span>
          </button>

          {/* Đính kèm */}
          <button type="button" className="p-3 text-gray-400 hover:bg-gray-50 rounded-xl transition-colors shrink-0 cursor-pointer">
            <Paperclip size={20} />
          </button>

          {/* Input text */}
          <div className="flex-1 bg-gray-50 border border-gray-200 rounded-2xl flex items-center px-4 py-2 focus-within:ring-2 focus-within:ring-blue-500 focus-within:bg-white transition-all">
            <input
              type="text"
              placeholder="Nhập tin nhắn..."
              className="w-full bg-transparent border-none focus:outline-none text-sm py-1.5"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
            />
          </div>

          {/* Gửi */}
          <button 
            type="submit"
            disabled={!inputText.trim()}
            className="p-3 bg-blue-600 disabled:bg-blue-300 hover:bg-blue-700 text-white rounded-xl shadow-md transition-colors shrink-0 cursor-pointer"
          >
            <Send size={20} />
          </button>
        </form>
      </div>

      {/* Modal Tạo Proposal */}
      <ProposalDealModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSubmit={handleProposalSubmit}
        kocName={chat.kocName}
      />

    </div>
  );
}
