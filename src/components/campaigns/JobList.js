"use client";
import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Plus } from "lucide-react";
import JobCard from "#/components/JobCard";
import CreateJobModal from "./CreateJobModal";
import { getMyCastingJobs } from "#/app/(shop)/my-casting/actions";

const tabs = [
  { id: "all", label: "Tất cả" },
  { id: "DRAFT", label: "Bản nháp" },
  { id: "RECRUITING", label: "Đang tuyển" },
  { id: "IN_PROGRESS", label: "Đang thực hiện" },
  { id: "COMPLETED", label: "Đã kết thúc" },
];

export default function JobList({ onViewDetails }) {
  const [activeTab, setActiveTab] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Hàm load danh sách job từ Server
  const fetchJobs = async () => {
    setLoading(true);
    const result = await getMyCastingJobs(); 
    if (result.success) {
      setJobs(result.data);
    } else {
      console.error("Lỗi khi tải dữ liệu:", result.error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const searchParams = useSearchParams();
  const jobIdFromQuery = searchParams.get("jobId");

  // Lọc job theo tab (đảm bảo id của tab khớp với giá trị status trong Database)
  const filteredJobs = jobs.filter((job) =>
    activeTab === "all" ? true : job.status?.toLowerCase().replace('-', '_') === activeTab.toLowerCase()
  );

  useEffect(() => {
    if (jobs.length > 0 && jobIdFromQuery) {
      const targetJob = jobs.find(j => j.id === jobIdFromQuery);
      if (targetJob) {
        onViewDetails(targetJob);
      }
    }
  }, [jobs, jobIdFromQuery, onViewDetails]);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">Tuyển dụng của tôi</h1>
          <p className="text-sm text-gray-500 mt-1">
            Bạn đang có <span className="font-bold text-gray-700">{filteredJobs.length}</span> bài tuyển dụng 
            {activeTab !== "all" && ` trong trạng thái ${activeTab}`}
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <Plus size={18} />
          Tạo bài tuyển dụng mới
        </button>
      </div>

      {/* TABS */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-gray-100">
        {tabs.map((tab) => {
          const count = tab.id === "all" 
            ? jobs.length 
            : jobs.filter(j => j.status?.toLowerCase().replace('-', '_') === tab.id.toLowerCase()).length;
            
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2.5 text-sm font-bold rounded-t-xl border-b-2 transition-colors whitespace-nowrap cursor-pointer flex items-center gap-2 ${
                activeTab === tab.id
                  ? "border-blue-600 text-blue-600 bg-blue-50/50"
                  : "border-transparent text-gray-500 hover:text-gray-900"
              }`}
            >
              {tab.label}
              <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                activeTab === tab.id 
                  ? "bg-blue-600 text-white" 
                  : "bg-gray-100 text-gray-600"
              }`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* GRID & LOADING */}
      {loading ? (
        <div className="py-20 text-center flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : filteredJobs.length > 0 ? (
        <div className="flex flex-col gap-6">
          {filteredJobs.map((job) => (
            <JobCard
              key={job.id}
              job={job}
              role="shop"
              actionLabel="Xem chi tiết ứng viên & Tiến độ"
              onAction={() => onViewDetails(job)}
              // Quan trọng: Truyền hàm fetchJobs vào để JobCard có thể gọi lại sau khi đổi trạng thái
              onRefresh={fetchJobs}
            />
          ))}
        </div>
      ) : (
        <div className="py-20 text-center bg-gray-50 rounded-2xl border border-dashed border-gray-200">
          <div className="text-3xl mb-4">📭</div>
          <h3 className="text-lg font-bold text-gray-900">Không có bài tuyển dụng nào</h3>
          <p className="text-gray-500 text-sm">Hãy tạo bài đăng mới để bắt đầu tuyển dụng!</p>
        </div>
      )}

      {/* MODAL */}
      <CreateJobModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={fetchJobs} 
      />
    </div>
  );
}