import React from "react";
import { MessageSquare, Check, X } from "lucide-react";

// MOCK DATA: Applicants
const mockApplicants = [
  {
    id: "app-1",
    koc: {
      name: "Thảo Vy Review",
      avatar: "👩🏻",
      vibe: "#GenZ",
      channelUrl: "tiktok.com/@thaovy",
      followers: "125K",
    },
    metrics: {
      engagementRate: "4.5%",
      avgViews: "45K",
    },
    proposal: {
      message: "Chào shop, mình rất thích BST mới và phong cách GenZ của mình rất hợp với brand. Mong được hợp tác!",
      budget: "4,000,000đ",
    },
  },
  {
    id: "app-2",
    koc: {
      name: "Khoa Style",
      avatar: "🧑🏻‍🎤",
      vibe: "#Streetwear",
      channelUrl: "instagram.com/khoa.style",
      followers: "89K",
    },
    metrics: {
      engagementRate: "6.2%",
      avgViews: "12K",
    },
    proposal: {
      message: "Mình có thế mạnh chụp ảnh lookbook và quay reels. Hiện đang trống lịch tuần tới.",
      budget: "3,500,000đ",
    },
  },
];

export default function ApplicantTable() {
  const handleApprove = (name) => {
    alert(`Đã duyệt KOC ${name} vào danh sách làm việc!`);
  };

  const handleReject = (name) => {
    const reason = prompt(`Nhập lý do từ chối KOC ${name}:`);
    if (reason) {
      alert(`Đã từ chối ${name} với lý do: ${reason}`);
    }
  };

  const handleMessage = (name) => {
    alert(`Đang mở hộp thoại nhắn tin với ${name}...`);
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-xs overflow-hidden animate-in fade-in duration-300">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100 text-xs text-gray-500 font-bold uppercase tracking-wider">
              <th className="p-4 pl-6">Người sáng tạo</th>
              <th className="p-4">Chỉ số kênh</th>
              <th className="p-4 w-1/3">Đề xuất từ KOC</th>
              <th className="p-4 pr-6 text-right">Hành động</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {mockApplicants.map((app) => (
              <tr key={app.id} className="hover:bg-gray-50/50 transition-colors">
                
                {/* 1. Người sáng tạo */}
                <td className="p-4 pl-6 align-top">
                  <div className="flex gap-3">
                    <div className="w-12 h-12 bg-indigo-50 rounded-full flex items-center justify-center text-2xl border border-indigo-100 shrink-0">
                      {app.koc.avatar}
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 text-sm">{app.koc.name}</h4>
                      <div className="flex flex-col gap-1 mt-1">
                        <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-100 w-max">
                          {app.koc.vibe}
                        </span>
                        <a href={`https://${app.koc.channelUrl}`} target="_blank" rel="noreferrer" className="text-[11px] text-blue-600 hover:underline">
                          {app.koc.channelUrl} • {app.koc.followers} Fl
                        </a>
                      </div>
                    </div>
                  </div>
                </td>

                {/* 2. Chỉ số kênh */}
                <td className="p-4 align-top">
                  <div className="space-y-1">
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-xs text-gray-500">Tương tác:</span>
                      <span className="text-xs font-bold text-gray-900">{app.metrics.engagementRate}</span>
                    </div>
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-xs text-gray-500">View TB:</span>
                      <span className="text-xs font-bold text-gray-900">{app.metrics.avgViews}</span>
                    </div>
                  </div>
                </td>

                {/* 3. Đề xuất từ KOC */}
                <td className="p-4 align-top">
                  <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                    <p className="text-xs text-gray-600 leading-relaxed italic mb-2">"{app.proposal.message}"</p>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold text-gray-400 uppercase">Mong muốn:</span>
                      <span className="text-xs font-black text-purple-600">{app.proposal.budget}</span>
                    </div>
                  </div>
                </td>

                {/* 4. Hành động */}
                <td className="p-4 pr-6 align-top">
                  <div className="flex flex-col gap-2 items-end">
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => handleReject(app.koc.name)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-100 cursor-pointer" 
                        title="Từ chối"
                      >
                        <X size={18} />
                      </button>
                      <button 
                        onClick={() => handleApprove(app.koc.name)}
                        className="px-4 py-2 bg-emerald-50 text-emerald-700 hover:bg-emerald-500 hover:text-white text-xs font-bold rounded-lg transition-colors border border-emerald-200 hover:border-emerald-500 flex items-center gap-1.5 cursor-pointer shadow-sm"
                      >
                        <Check size={16} /> Duyệt vào chiến dịch
                      </button>
                    </div>
                    <button 
                      onClick={() => handleMessage(app.koc.name)}
                      className="flex items-center gap-1.5 text-xs font-bold text-gray-600 hover:text-blue-600 px-2 py-1 rounded-md hover:bg-blue-50 transition-colors cursor-pointer"
                    >
                      <MessageSquare size={14} /> Nhắn tin
                    </button>
                  </div>
                </td>

              </tr>
            ))}
          </tbody>
        </table>
        {mockApplicants.length === 0 && (
           <div className="py-20 text-center flex flex-col items-center justify-center bg-white">
            <h3 className="text-lg font-bold text-gray-900">Không có ứng viên nào</h3>
            <p className="text-gray-500 mt-1 text-sm">Chưa có ai ứng tuyển vào bài đăng này.</p>
          </div>
        )}
      </div>
    </div>
  );
}
