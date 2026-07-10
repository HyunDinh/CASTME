import React, { useState } from "react";
import { Package, Video, CheckCircle, Award, PlayCircle } from "lucide-react";

// MOCK DATA: Kanban Board Items
const initialBoard = {
  todo: [
    { id: "k-1", name: "Minh Châu", avatar: "👩🏻", address: "Q7, TP.HCM", phone: "0901234567" },
  ],
  inProgress: [
    { id: "k-2", name: "Linh Đan", avatar: "👱🏻‍♀️", deadline: "12/06/2026" },
  ],
  review: [
    { id: "k-3", name: "Thảo Vy", avatar: "🙋🏻‍♀️", videoUrl: "tiktok.com/@thaovy/video/123", submittedAt: "Hôm qua" },
  ],
  done: [
    { id: "k-4", name: "Hoàng Phong", avatar: "🧑🏻", views: "12.5K", likes: "1.2K", payout: "5,000,000đ" },
  ],
};

export default function KanbanBoard() {
  const [board, setBoard] = useState(initialBoard);

  const handleShip = (kocName) => {
    alert(`Đã cập nhật mã vận đơn và thông báo cho KOC ${kocName}.`);
  };

  const handleWatchVideo = (url) => {
    alert(`Đang mở Modal phát video từ link: ${url}`);
  };

  const handleApproveVideo = (kocName) => {
    alert(`Đã duyệt video của ${kocName}! KOC có thể đăng lên kênh.`);
  };

  const handleRejectVideo = (kocName) => {
    const reason = prompt(`Nhập lý do yêu cầu sửa video cho ${kocName}:`);
    if (reason) alert(`Đã gửi yêu cầu sửa video tới ${kocName}: ${reason}`);
  };

  const handleRequestPayout = (kocName) => {
    alert(`Đã gửi yêu cầu thanh toán cho ${kocName} lên hệ thống kế toán.`);
  };

  return (
    <div className="flex gap-6 overflow-x-auto pb-6 snap-x animate-in fade-in slide-in-from-bottom-4 duration-500">

      {/* CỘT 1: CHỜ GỬI HÀNG */}
      <div className="w-80 shrink-0 snap-start flex flex-col h-full bg-gray-50 rounded-2xl p-4 border border-gray-100">
        <div className="flex items-center gap-2 mb-4">
          <div className="p-1.5 bg-orange-100 text-orange-600 rounded-lg"><Package size={16} /></div>
          <h3 className="font-bold text-gray-900">Chờ gửi hàng</h3>
          <span className="ml-auto bg-gray-200 text-gray-700 text-xs font-bold px-2 py-0.5 rounded-full">{board.todo.length}</span>
        </div>
        <div className="flex flex-col gap-3">
          {board.todo.map(koc => (
            <div key={koc.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-xl">{koc.avatar}</div>
                <div>
                  <h4 className="font-bold text-sm text-gray-900">{koc.name}</h4>
                  <p className="text-[11px] text-gray-500">{koc.phone}</p>
                </div>
              </div>
              <p className="text-xs text-gray-600 bg-gray-50 p-2 rounded-lg break-words">{koc.address}</p>
              <input type="text" placeholder="Nhập mã vận đơn..." className="w-full text-xs px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500" />
              <button onClick={() => handleShip(koc.name)} className="w-full py-2 bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer">
                Đã gửi hàng
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* CỘT 2: ĐANG LÀM CLIP */}
      <div className="w-80 shrink-0 snap-start flex flex-col h-full bg-gray-50 rounded-2xl p-4 border border-gray-100">
        <div className="flex items-center gap-2 mb-4">
          <div className="p-1.5 bg-blue-100 text-blue-600 rounded-lg"><Video size={16} /></div>
          <h3 className="font-bold text-gray-900">Đang làm clip</h3>
          <span className="ml-auto bg-gray-200 text-gray-700 text-xs font-bold px-2 py-0.5 rounded-full">{board.inProgress.length}</span>
        </div>
        <div className="flex flex-col gap-3">
          {board.inProgress.map(koc => (
            <div key={koc.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-xl">{koc.avatar}</div>
                <h4 className="font-bold text-sm text-gray-900">{koc.name}</h4>
              </div>
              <div className="bg-blue-50 text-blue-700 text-xs font-bold p-2 rounded-lg text-center border border-blue-100">
                Deadline: {koc.deadline}
              </div>
              <p className="text-[11px] text-center text-gray-500 italic">KOC đã nhận được hàng và đang tiến hành quay dựng.</p>
            </div>
          ))}
        </div>
      </div>

      {/* CỘT 3: CHỜ DUYỆT CLIP */}
      <div className="w-80 shrink-0 snap-start flex flex-col h-full bg-gray-50 rounded-2xl p-4 border border-gray-100">
        <div className="flex items-center gap-2 mb-4">
          <div className="p-1.5 bg-purple-100 text-purple-600 rounded-lg"><PlayCircle size={16} /></div>
          <h3 className="font-bold text-gray-900">Chờ duyệt clip</h3>
          <span className="ml-auto bg-gray-200 text-gray-700 text-xs font-bold px-2 py-0.5 rounded-full">{board.review.length}</span>
        </div>
        <div className="flex flex-col gap-3">
          {board.review.map(koc => (
            <div key={koc.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-xl">{koc.avatar}</div>
                  <div>
                    <h4 className="font-bold text-sm text-gray-900">{koc.name}</h4>
                    <p className="text-[10px] text-gray-400">Nộp: {koc.submittedAt}</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <input type="text" readOnly value={koc.videoUrl} className="flex-1 text-xs px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-500 outline-none" />
                <button onClick={() => handleWatchVideo(koc.videoUrl)} className="p-2 bg-gray-100 hover:bg-purple-100 hover:text-purple-600 rounded-lg transition-colors cursor-pointer text-gray-600" title="Xem thử">
                  <PlayCircle size={16} />
                </button>
              </div>
              <div className="flex gap-2 pt-1">
                <button onClick={() => handleRejectVideo(koc.name)} className="flex-1 py-2 bg-gray-100 hover:bg-red-50 hover:text-red-600 text-gray-600 text-xs font-bold rounded-lg transition-colors cursor-pointer">Sửa bài</button>
                <button onClick={() => handleApproveVideo(koc.name)} className="flex-1 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer shadow-sm shadow-purple-200">Duyệt & Đăng</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CỘT 4: ĐÃ HOÀN THÀNH */}
      <div className="w-80 shrink-0 snap-start flex flex-col h-full bg-gray-50 rounded-2xl p-4 border border-gray-100">
        <div className="flex items-center gap-2 mb-4">
          <div className="p-1.5 bg-emerald-100 text-emerald-600 rounded-lg"><Award size={16} /></div>
          <h3 className="font-bold text-gray-900">Đã hoàn thành</h3>
          <span className="ml-auto bg-gray-200 text-gray-700 text-xs font-bold px-2 py-0.5 rounded-full">{board.done.length}</span>
        </div>
        <div className="flex flex-col gap-3">
          {board.done.map(koc => (
            <div key={koc.id} className="bg-white p-4 rounded-xl shadow-sm border border-emerald-100 space-y-3 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-16 h-16 bg-emerald-50 rounded-bl-full -z-0"></div>
              <div className="flex items-center gap-3 relative z-10">
                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-xl">{koc.avatar}</div>
                <div>
                  <h4 className="font-bold text-sm text-gray-900">{koc.name}</h4>
                  <p className="text-xs font-bold text-emerald-600 mt-0.5">Thù lao: {koc.payout}</p>
                </div>
              </div>
              <div className="flex justify-between bg-emerald-50/50 p-2 rounded-lg border border-emerald-50">
                <div className="text-center w-1/2 border-r border-emerald-100">
                  <p className="text-[10px] text-emerald-600/80 font-bold uppercase mb-0.5">Views</p>
                  <p className="text-sm font-black text-emerald-700">{koc.views}</p>
                </div>
                <div className="text-center w-1/2">
                  <p className="text-[10px] text-emerald-600/80 font-bold uppercase mb-0.5">Likes</p>
                  <p className="text-sm font-black text-emerald-700">{koc.likes}</p>
                </div>
              </div>
              <button onClick={() => handleRequestPayout(koc.name)} className="w-full py-2 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-700 text-xs font-bold rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-2">
                <CheckCircle size={14} /> Yêu cầu thanh toán
              </button>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
