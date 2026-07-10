"use client";
import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Plus, Search, Megaphone, Clock, Rocket, Zap, CheckCircle2, FileText, LayoutGrid } from "lucide-react";
import JobCard from "#/components/JobCard";
import CreateJobModal from "./CreateJobModal";
import { getMyCastingJobs } from "#/app/(shop)/my-casting/actions";

const tabConfig = [
  { id: "all", label: "Tất cả", icon: LayoutGrid, gradient: "from-purple-500 to-indigo-500", color: "purple" },
  { id: "DRAFT", label: "Bản nháp", icon: FileText, gradient: "from-amber-500 to-orange-500", color: "amber" },
  { id: "RECRUITING", label: "Đang tuyển", icon: Clock, gradient: "from-blue-500 to-indigo-500", color: "blue" },
  { id: "IN_PROGRESS", label: "Đang làm", icon: Zap, gradient: "from-purple-500 to-pink-500", color: "purple" },
  { id: "COMPLETED", label: "Kết thúc", icon: CheckCircle2, gradient: "from-emerald-500 to-green-500", color: "emerald" },
];

export default function JobList({ onViewDetails }) {
  const [activeTab, setActiveTab] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

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

  const filteredJobs = jobs
    .filter((job) =>
      activeTab === "all" ? true : job.status?.toLowerCase().replace('-', '_') === activeTab.toLowerCase()
    )
    .filter((job) =>
      !searchQuery ||
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (job.description && job.description.toLowerCase().includes(searchQuery.toLowerCase()))
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
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* ── HEADER BANNER ── */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-700 p-8 md:p-12 shadow-xl">
        <div className="absolute -right-20 -top-20 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute -left-20 -bottom-20 w-64 h-64 bg-indigo-400/10 rounded-full blur-3xl" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-1.5 rounded-full">
              <Megaphone size={14} className="text-white animate-bounce" />
              <span className="text-xs font-semibold text-white/90">Workspace</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">
              Quản lý Casting & Tuyển dụng
            </h1>
            <p className="text-sm text-purple-100 max-w-2xl leading-relaxed">
              Theo dõi chiến dịch tuyển dụng KOC, phê duyệt hồ sơ ứng cử viên và quản lý tiến độ bàn giao sản phẩm.
            </p>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="px-6 py-3.5 bg-white hover:bg-purple-50 text-purple-700 font-bold text-sm rounded-xl shadow-lg transition-all duration-300 hover:-translate-y-0.5 flex items-center justify-center gap-2 cursor-pointer border-none flex-shrink-0"
          >
            <Plus size={18} />
            Tạo bài tuyển dụng mới
          </button>
        </div>
      </div>

      {/* ── SEARCH BAR ── */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
        <div className="relative flex items-center">
          <input
            type="text"
            placeholder="Tìm kiếm chiến dịch casting (theo tên, từ khóa mô tả...)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2.5 pl-11 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-600/20 focus:border-purple-600 transition-all"
          />
          <Search
            size={16}
            className="text-gray-400 absolute left-4 pointer-events-none"
          />
        </div>
      </div>

      {/* ── TABS NAVIGATION ── */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-2 overflow-x-auto">
        <div className="flex gap-2 min-w-max">
          {tabConfig.map((tab) => {
            const count = tab.id === "all"
              ? jobs.length
              : jobs.filter(j => j.status?.toLowerCase().replace('-', '_') === tab.id.toLowerCase()).length;
            const isActive = activeTab === tab.id;
            const Icon = tab.icon;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  relative px-5 py-3 rounded-xl font-semibold text-sm transition-all duration-300 cursor-pointer border-none flex items-center gap-2
                  ${isActive
                    ? `bg-gradient-to-r ${tab.gradient} text-white shadow-md`
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 bg-transparent'
                  }
                `}
              >
                <Icon size={15} />
                <span>{tab.label}</span>
                <span className={`
                  inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full text-xs font-bold
                  ${isActive ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-600'}
                `}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── GRID & LOADING ── */}
      {loading ? (
        <div className="py-32 flex flex-col items-center justify-center gap-4">
          <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm text-gray-500">Đang tải chiến dịch...</p>
        </div>
      ) : filteredJobs.length > 0 ? (
        <div className="flex flex-col gap-6">
          {filteredJobs.map((job) => (
            <JobCard
              key={job.id}
              job={job}
              role="shop"
              actionLabel="Chi tiết ứng viên & Tiến độ"
              onAction={() => onViewDetails(job)}
              onRefresh={fetchJobs}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-3xl border-2 border-dashed border-gray-200 p-16 text-center">
          <div className="w-20 h-20 rounded-full bg-gray-50 flex items-center justify-center mx-auto mb-4">
            <Megaphone size={32} className="text-gray-300" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">
            Không có bài tuyển dụng nào
          </h3>
          <p className="text-sm text-gray-500 max-w-md mx-auto">
            {activeTab === "all" ? "Shop của bạn chưa đăng tải chiến dịch nào." : `Không tìm thấy chiến dịch nào trong trạng thái này.`}
          </p>
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