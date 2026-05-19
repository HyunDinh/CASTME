// src/app/(creator)/creator-dashboard/page.js
"use client";
import { useState } from "react";
import JobCard from "#/components/JobCard";

export default function CreatorDashboard() {
  // Dữ liệu giả lập các bài đăng tuyển của Shop
  const [jobs, setJobs] = useState([
    {
      id: "job-1",
      shopName: "Savage Studio ✨",
      title: "Tuyển KOC chụp lookbook bộ sưu tập Hè Y2K",
      description:
        "Cần tìm 2 bạn mẫu ảnh phong cách năng động, cá tính, chụp mẫu quần jean bách khoa và áo croptop theo phong cách đường phố những năm 2000. Chụp tại studio Quận 3.",
      budget: "3,500,000đ",
      matchRate: 94,
      vibeTags: ["Y2K", "Streetwear", "Cá tính"],
      heartsRequired: 5,
    },
    {
      id: "job-2",
      shopName: "An Nhiên Trà Quán 🍃",
      title: "Video Review trải nghiệm không gian trà đạo tĩnh lặng",
      description:
        "Cần tìm KOL mảng chữa lành, phong cách mộc mạc, nhẹ nhàng, quay 1 video ngắn Reels/TikTok thời lượng dưới 1 phút review không gian quán và sản phẩm trà sen mới.",
      budget: "1,800,000đ",
      matchRate: 72,
      vibeTags: ["Vintage", "Mộc mạc", "Chữa lành"],
      heartsRequired: 5,
    },
    {
      id: "job-3",
      shopName: "Retro Garage 🏎️",
      title: "Tuyển Creator quay video phối đồ Unisex Retro cổ điển",
      description:
        "Yêu cầu các bạn có gu phối đồ Vintage, Retro tốt, tự lên kịch bản phối đồ Unisex Đông Xuân. Quay ngoại cảnh phong cách香港 cổ điển.",
      budget: "5,000,000đ",
      matchRate: 88,
      vibeTags: ["Retro", "Vintage", "Unisex"],
      heartsRequired: 5,
    },
  ]);

  const handleConnect = (jobId, currentHearts) => {
    alert(
      `Xác nhận dùng 5 Trái Tim để ứng tuyển và kết nối trực tiếp với bài tuyển dụng mã: ${jobId}`,
    );
  };

  return (
    <div className="space-y-8">
      {/* KHỐI AI MATCHING GỢI Ý TOP */}
      <section className="bg-linear-to-r from-purple-900 to-indigo-900 text-white rounded-3xl p-6 md:p-8 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 bottom-0 text-9xl opacity-10 pointer-events-none select-none">
          🤖
        </div>
        <div className="max-w-xl">
          <span className="inline-block px-3 py-1 bg-purple-500/30 border border-purple-400/20 text-purple-200 text-xs font-bold rounded-full mb-3 uppercase tracking-wider">
            Castme AI Matching Engine
          </span>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight mb-2">
            Shop phù hợp nhất với Vibe của bạn
          </h1>
          <p className="text-purple-200 text-sm leading-relaxed mb-6">
            Hệ thống AI vừa quét bản tóm tắt hồ sơ phong cách cá nhân của bạn và
            tìm thấy những nhãn hàng có độ tương thích cao nhất về sản phẩm lẫn
            hình ảnh chiến dịch.
          </p>
        </div>

        {/* Danh sách thẻ AI gợi ý */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          {jobs
            .filter((j) => j.matchRate >= 85)
            .map((aiJob) => (
              <div
                key={`ai-${aiJob.id}`}
                className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/10 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-purple-300">
                      {aiJob.shopName}
                    </span>
                    <span className="text-xs font-black bg-emerald-500 text-white px-2 py-0.5 rounded-lg animate-pulse">
                      🔥 {aiJob.matchRate}% Phù hợp
                    </span>
                  </div>
                  <h3 className="font-bold text-sm line-clamp-1 text-white mb-2">
                    {aiJob.title}
                  </h3>
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {aiJob.vibeTags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] bg-white/5 border border-white/10 px-2 py-0.5 rounded-md text-purple-200"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex items-center justify-between border-t border-white/10 pt-3">
                  <span className="text-sm font-bold text-amber-300">
                    {aiJob.budget}
                  </span>
                  <button
                    onClick={() => handleConnect(aiJob.id)}
                    className="px-3 py-1.5 bg-white text-purple-900 font-bold text-xs rounded-xl hover:bg-purple-100 transition shadow-sm cursor-pointer"
                  >
                    Kết nối ngay
                  </button>
                </div>
              </div>
            ))}
        </div>
      </section>

      {/* DANH SÁCH TẤT CẢ BÀI ĐĂNG TUYỂN DỤNG CỦA SHOP */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-extrabold text-gray-950">
              Tin tuyển dụng đang mở
            </h2>
            <p className="text-xs text-gray-500">
              Tìm kiếm các cơ hội hợp tác quảng cáo phù hợp với thế mạnh của bạn
            </p>
          </div>
          <button className="text-sm font-bold text-purple-600 hover:underline cursor-pointer">
            Bộ lọc nâng cao 🔍
          </button>
        </div>

        {/* Vòng lặp danh sách bài đăng */}
        <div className="grid grid-cols-1 gap-4">
          {jobs.map((job) => (
            <JobCard 
              key={job.id} 
              job={job} 
              role="koc" 
              onAction={(id) => handleConnect(id)}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
