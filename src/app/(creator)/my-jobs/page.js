// src/app/(creator)/my-job/page.js
"use client";
import { useState } from "react";

export default function MyJobsPage() {
  const [activeTab, setActiveTab] = useState("PROCESSING"); // APPLYING, PROCESSING, COMPLETED

  // Dữ liệu giả lập các công việc của Creator
  const [myJobs, setMyJobs] = useState([
    {
      id: "app-1",
      shopName: "Savage Studio ✨",
      title: "Tuyển KOC chụp lookbook bộ sưu tập Hè Y2K",
      budget: "3,500,000đ",
      status: "PROCESSING", // Đang thực hiện
      escrowStatus: "Đã đóng băng an toàn 🔒",
      deadline: "25/05/2026",
      notes: "Shop đã gửi sản phẩm mẫu qua bưu điện. Bạn cần chụp 10 ảnh fit-tool phối đồ và gửi bản nháp trước deadline."
    },
    {
      id: "app-2",
      shopName: "An Nhiên Trà Quán 🍃",
      title: "Video Review trải nghiệm không gian trà đạo",
      budget: "1,800,000đ",
      status: "COMPLETED", // Đã hoàn thành
      escrowStatus: "Đã giải ngân (+97% sau phí) ✅",
      deadline: "12/05/2026",
      notes: "Video đạt 25k views trên TikTok. Giao dịch kết thúc thành công."
    },
    {
      id: "app-3",
      shopName: "Retro Garage 🏎️",
      title: "Tuyển Creator quay video phối đồ Unisex Retro cổ điển",
      budget: "5,000,000đ",
      status: "APPLYING", // Đang ứng tuyển
      escrowStatus: "Đang chờ duyệt hồ sơ ⏳",
      deadline: "N/A",
      notes: "Hồ sơ của bạn (Match Rate: 88%) đang xếp hàng đợi chủ shop duyệt."
    }
  ]);

  const filteredJobs = myJobs.filter(job => job.status === activeTab);

  const handleCompleteJob = (id) => {
    alert(`Gửi yêu cầu nghiệm thu cho Job này. Hệ thống sẽ thông báo cho Shop kiểm tra sản phẩm để mở khóa số tiền đóng băng!`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-gray-950">Quản lý công việc</h1>
        <p className="text-xs text-gray-500">Theo dõi trạng thái các hợp đồng quảng cáo và tiến độ giải ngân dòng tiền.</p>
      </div>

      {/* THANH ĐIỀU HƯỚNG TAB */}
      <div className="flex border-b border-gray-200 gap-6">
        <button 
          onClick={() => setActiveTab("APPLYING")}
          className={`pb-3 text-sm font-semibold transition relative cursor-pointer ${activeTab === "APPLYING" ? "text-purple-600 font-bold" : "text-gray-500 hover:text-gray-900"}`}
        >
          Đang ứng tuyển ({myJobs.filter(j => j.status === "APPLYING").length})
          {activeTab === "APPLYING" && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-600 rounded-full" />}
        </button>
        <button 
          onClick={() => setActiveTab("PROCESSING")}
          className={`pb-3 text-sm font-semibold transition relative cursor-pointer ${activeTab === "PROCESSING" ? "text-purple-600 font-bold" : "text-gray-500 hover:text-gray-900"}`}
        >
          Đang thực hiện ({myJobs.filter(j => j.status === "PROCESSING").length})
          {activeTab === "PROCESSING" && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-600 rounded-full" />}
        </button>
        <button 
          onClick={() => setActiveTab("COMPLETED")}
          className={`pb-3 text-sm font-semibold transition relative cursor-pointer ${activeTab === "COMPLETED" ? "text-purple-600 font-bold" : "text-gray-500 hover:text-gray-900"}`}
        >
          Đã hoàn thành ({myJobs.filter(j => j.status === "COMPLETED").length})
          {activeTab === "COMPLETED" && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-600 rounded-full" />}
        </button>
      </div>

      {/* DANH SÁCH CÁC JOB THEO TAB */}
      <div className="grid grid-cols-1 gap-4">
        {filteredJobs.length === 0 ? (
          <div className="bg-white rounded-2xl border border-dashed border-gray-200 p-12 text-center text-gray-400 text-sm">
            Không có công việc nào trong danh mục này.
          </div>
        ) : (
          filteredJobs.map((job) => (
            <div key={job.id} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-xs hover:shadow-sm transition flex flex-col md:flex-row justify-between gap-6">
              
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="text-xs font-bold text-gray-700 bg-gray-50 px-2.5 py-0.5 border border-gray-200 rounded-md">
                    🏪 {job.shopName}
                  </span>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-md ${
                    job.status === "PROCESSING" ? "bg-amber-50 text-amber-700 border border-amber-200" :
                    job.status === "COMPLETED" ? "bg-green-50 text-green-700 border border-green-200" : "bg-blue-50 text-blue-700 border border-blue-200"
                  }`}>
                    {job.escrowStatus}
                  </span>
                </div>
                <h3 className="text-base font-bold text-gray-900">{job.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{job.notes}</p>
                {job.deadline !== "N/A" && (
                  <p className="text-xs text-red-500 font-medium pt-1">⏰ Hạn chót nộp sản phẩm: {job.deadline}</p>
                )}
              </div>

              {/* Khối Thù lao & Action */}
              <div className="md:w-48 flex flex-row md:flex-col justify-between md:justify-center items-center md:items-end gap-3 border-t md:border-t-0 md:border-l border-gray-100 pt-4 md:pt-0 md:pl-6 shrink-0">
                <div className="text-left md:text-right">
                  <span className="block text-[11px] text-gray-400 font-semibold uppercase">Thù lao</span>
                  <span className="text-lg font-black text-purple-600">{job.budget}</span>
                </div>

                {job.status === "PROCESSING" && (
                  <button
                    onClick={() => handleCompleteJob(job.id)}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition shadow-md shadow-emerald-50 cursor-pointer"
                  >
                    🚀 Báo cáo hoàn thành
                  </button>
                )}
                {job.status === "APPLYING" && (
                  <button className="px-4 py-2 bg-gray-100 text-gray-400 font-bold text-xs rounded-xl cursor-not-allowed" disabled>
                    Đang xếp hàng
                  </button>
                )}
              </div>

            </div>
          ))
        )}
      </div>
    </div>
  );
}