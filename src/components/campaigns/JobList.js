import React, { useState } from "react";
import { Plus } from "lucide-react";
import JobCard from "#/components/JobCard";
import CreateJobModal from "./CreateJobModal";

// MOCK DATA: JobList
const mockJobs = [
  {
    id: "job-1",
    title: "Review Bộ Sưu Tập Mùa Hè 2026",
    description: "Cần tìm 3 KOC phong cách GenZ năng động, quay video unbox và phối đồ với 3 sản phẩm mới nhất của shop.",
    budget: "5,000,000đ - 10,000,000đ",
    vibeTags: ["GenZ", "Thời trang", "Mùa hè"],
    applicantsCount: 24,
    activeWorkersCount: 5,
    status: "recruiting",
  },
  {
    id: "job-2",
    title: "Quay Video TikTok Dance Challenge",
    description: "KOC tham gia nhảy cover trên nền nhạc độc quyền của brand. Yêu cầu follower > 100k, vũ đạo tốt.",
    budget: "3,000,000đ",
    vibeTags: ["Dance", "Giải trí", "Trendy"],
    applicantsCount: 8,
    activeWorkersCount: 2,
    status: "in-progress",
  },
  {
    id: "job-3",
    title: "Chụp Lookbook BST Mùa Thu",
    description: "Tìm 2 bạn mẫu ảnh nữ, chiều cao > 1m60. Chụp tại studio Quận 1 trong 1 ngày.",
    budget: "8,000,000đ",
    vibeTags: ["Lookbook", "Chụp ảnh", "Minimalism"],
    applicantsCount: 0,
    activeWorkersCount: 0,
    status: "draft",
  },
];

const tabs = [
  { id: "all", label: "Tất cả" },
  { id: "draft", label: "Bản nháp" },
  { id: "recruiting", label: "Đang tuyển" },
  { id: "in-progress", label: "Đang thực hiện" },
  { id: "completed", label: "Đã kết thúc" },
];

export default function JobList({ onViewDetails }) {
  const [activeTab, setActiveTab] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredJobs = mockJobs.filter((job) =>
    activeTab === "all" ? true : job.status === activeTab
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">Tuyển dụng của tôi</h1>
          <p className="text-sm text-gray-500 mt-1">
            Bạn đang có <span className="font-bold text-gray-700">{mockJobs.length}</span> bài tuyển dụng
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl shadow-md shadow-blue-200 transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <Plus size={18} />
          Tạo bài tuyển dụng mới
        </button>
      </div>

      {/* TABS */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide border-b border-gray-100">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2.5 text-sm font-bold rounded-t-xl border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === tab.id
                ? "border-blue-600 text-blue-600 bg-blue-50/50"
                : "border-transparent text-gray-500 hover:text-gray-900 hover:bg-gray-50"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* GRID */}
      {filteredJobs.length > 0 ? (
        <div className="flex flex-col gap-6">
          {filteredJobs.map((job) => (
            <JobCard
              key={job.id}
              job={job}
              role="shop"
              actionLabel="Xem chi tiết ứng viên & Tiến độ"
              onAction={() => onViewDetails(job)}
            />
          ))}
        </div>
      ) : (
        <div className="py-20 text-center flex flex-col items-center justify-center bg-gray-50 rounded-2xl border border-dashed border-gray-200">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center text-3xl mb-4">📭</div>
          <h3 className="text-lg font-bold text-gray-900">Không có bài tuyển dụng nào</h3>
          <p className="text-gray-500 mt-1 text-sm">Chưa có bài tuyển dụng nào trong trạng thái này.</p>
        </div>
      )}

      {/* MODAL */}
      <CreateJobModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
