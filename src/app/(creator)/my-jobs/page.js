"use client";
import React, { useState, useEffect } from "react";
import { getMyAppliedJobs } from "#/app/(creator)/actions";
import CreatorJobDetails from "#/components/campaigns/CreatorJobDetails";
import { useSearchParams, useRouter } from "next/navigation";
import { Suspense } from "react";
import { Store, Zap, Clock, CheckCircle2, FileText, Calendar, Briefcase, Search } from "lucide-react";

function formatBudget(budget) {
  if (!budget) return "0";
  const cleanNum = String(budget).replace(/[^0-9]/g, "");
  if (!cleanNum) return budget;
  const parsed = parseInt(cleanNum, 10);
  return new Intl.NumberFormat("vi-VN").format(parsed);
}

export default function MyJobsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    }>
      <MyJobsPageContent />
    </Suspense>
  );
}

function MyJobsPageContent() {
  const [activeTab, setActiveTab] = useState("PROCESSING");
  const [myJobs, setMyJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState(null);

  useEffect(() => {
    async function fetchJobs() {
      setLoading(true);
      const res = await getMyAppliedJobs();
      if (res.success) {
        setMyJobs(res.data);
      }
      setLoading(false);
    }
    fetchJobs();
  }, []);

  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    setSearchQuery(searchParams.get("q") || "");
  }, [searchParams]);

  const handleSearchChange = (val) => {
    setSearchQuery(val);
  };

  const filteredJobs = myJobs
    .filter(job => job.uiStatus === activeTab)
    .filter(job =>
      !searchQuery ||
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.shopName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (job.notes && job.notes.toLowerCase().includes(searchQuery.toLowerCase()))
    );

  const tabConfig = [
    {
      key: "APPLYING",
      label: "Đang ứng tuyển",
      icon: Clock,
      color: "blue",
      gradient: "from-blue-500 to-indigo-500"
    },
    {
      key: "PROCESSING",
      label: "Đang thực hiện",
      icon: Zap,
      color: "amber",
      gradient: "from-amber-500 to-orange-500"
    },
    {
      key: "COMPLETED",
      label: "Đã hoàn thành",
      icon: CheckCircle2,
      color: "emerald",
      gradient: "from-emerald-500 to-green-500"
    }
  ];

  if (selectedJob) {
    return <CreatorJobDetails job={selectedJob} onBack={() => setSelectedJob(null)} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 pt-6">

        {/* HEADER TEXT */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-700 p-8 md:p-12 shadow-xl">
          <div className="absolute -right-20 -top-20 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute -left-20 -bottom-20 w-64 h-64 bg-indigo-400/10 rounded-full blur-3xl" />

          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-1.5 rounded-full mb-4">
              <Briefcase size={14} className="text-white" />
              <span className="text-xs font-semibold text-white/90">Workspace</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-white mb-3 tracking-tight">
              Quản lý công việc
            </h1>
            <p className="text-sm text-purple-100 max-w-2xl leading-relaxed">
              Theo dõi tiến độ, quản lý deadline và hoàn thành các công việc đã nhận từ các chiến dịch.
            </p>
          </div>
        </div>

        {/* SEARCH BAR */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
          <div className="relative flex items-center">
            <input
              type="text"
              placeholder="Tìm kiếm công việc của tôi (tên shop, dự án...)"
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full px-4 py-2.5 pl-11 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-600/20 focus:border-purple-600 transition-all"
            />
            <Search
              size={16}
              className="text-gray-400 absolute left-4 pointer-events-none"
            />
          </div>
        </div>

        {/* TABS NAVIGATION */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-2">
          <div className="grid grid-cols-3 gap-2">
            {tabConfig.map((tab) => {
              const count = myJobs.filter(j => j.uiStatus === tab.key).length;
              const isActive = activeTab === tab.key;
              const Icon = tab.icon;

              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`
                    relative px-4 py-3 md:py-4 rounded-xl font-semibold text-sm md:text-base
                    transition-all duration-300 cursor-pointer
                    ${isActive
                      ? `bg-gradient-to-r ${tab.gradient} text-white shadow-lg shadow-${tab.color}-500/25`
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }
                  `}
                >
                  <div className="flex items-center justify-center gap-2">
                    <Icon size={16} className={isActive ? "animate-pulse" : ""} />
                    <span className="hidden md:inline">{tab.label}</span>
                    <span className="md:hidden">{tab.label.split(' ')[0]}</span>
                    <span className={`
                      inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full text-xs font-bold
                      ${isActive ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-600'}
                    `}>
                      {count}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* JOB CARDS */}
        {loading ? (
          <div className="py-32 flex flex-col items-center justify-center gap-4">
            <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-sm text-gray-500">Đang tải công việc...</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredJobs.length === 0 ? (
              <div className="bg-white rounded-3xl border-2 border-dashed border-gray-200 p-16 text-center">
                <div className="w-20 h-20 rounded-full bg-gray-50 flex items-center justify-center mx-auto mb-4">
                  <FileText size={32} className="text-gray-300" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  Chưa có công việc nào
                </h3>
                <p className="text-sm text-gray-500 max-w-md mx-auto">
                  {activeTab === "APPLYING" && "Bạn chưa ứng tuyển công việc nào. Hãy khám phá các chiến dịch mới!"}
                  {activeTab === "PROCESSING" && "Không có công việc đang thực hiện. Hãy hoàn thành hồ sơ ứng tuyển!"}
                  {activeTab === "COMPLETED" && "Bạn chưa hoàn thành công việc nào. Tiếp tục phấn đấu!"}
                </p>
              </div>
            ) : (
              filteredJobs.map((job) => {
                const statusConfig = {
                  APPLYING: {
                    badge: "Chờ duyệt hồ sơ",
                    badgeColor: "bg-blue-50 text-blue-700 border-blue-200",
                    icon: Clock,
                    iconColor: "text-blue-500"
                  },
                  PROCESSING: {
                    badge: "Đang làm việc",
                    badgeColor: "bg-amber-50 text-amber-700 border-amber-200",
                    icon: Zap,
                    iconColor: "text-amber-500"
                  },
                  COMPLETED: {
                    badge: "Hoàn thành",
                    badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
                    icon: CheckCircle2,
                    iconColor: "text-emerald-500"
                  }
                };

                const status = statusConfig[job.uiStatus];
                const StatusIcon = status.icon;

                return (
                  <div
                    key={job.id}
                    className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg hover:border-gray-200 transition-all duration-300 overflow-hidden group"
                  >
                    <div className="p-6 md:p-8">
                      <div className="flex flex-col lg:flex-row gap-6">

                        {/* Left: Job Info */}
                        <div className="flex-1 space-y-4">

                          {/* Top badges */}
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-700 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-200">
                              <Store size={14} className="text-gray-500" />
                              {job.shopName}
                            </span>
                            <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg border ${status.badgeColor}`}>
                              <StatusIcon size={14} />
                              {status.badge}
                            </span>
                          </div>

                          {/* Title */}
                          <h3 className="text-xl font-bold text-gray-900 group-hover:text-purple-600 transition-colors leading-snug">
                            {job.title}
                          </h3>

                          {/* Description */}
                          <p className="text-sm text-gray-600 leading-relaxed line-clamp-2">
                            {job.notes || "Không có mô tả chi tiết"}
                          </p>

                          {/* Meta info */}
                          {job.deadline && (
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                              <Calendar size={14} />
                              <span>Deadline: {job.deadline}</span>
                            </div>
                          )}
                        </div>

                        {/* Right: Budget & Action */}
                        <div className="lg:w-64 flex flex-row lg:flex-col justify-between lg:justify-center items-center lg:items-end gap-4 border-t lg:border-t-0 lg:border-l border-gray-100 pt-6 lg:pt-0 lg:pl-8">

                          {/* Budget */}
                          <div className="text-left lg:text-right">
                            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
                              Thù lao
                            </p>
                            <div className="flex items-baseline gap-1 lg:justify-end">
                              <span className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-pink-500">
                                {formatBudget(job.budget)}
                              </span>
                              <span className="text-lg font-bold text-gray-400">đ</span>
                            </div>
                          </div>

                          {/* Action Button */}
                          <div className="w-full lg:w-auto">
                            {job.uiStatus === "PROCESSING" && (
                              <button
                                onClick={() => setSelectedJob(job)}
                                className="w-full lg:w-48 px-5 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold text-sm rounded-xl transition-all duration-300 shadow-lg shadow-purple-500/30 hover:shadow-xl hover:shadow-purple-500/40 hover:-translate-y-0.5 flex items-center justify-center gap-2 cursor-pointer"
                              >
                                <Zap size={16} className="fill-current" />
                                Xem tiến độ
                              </button>
                            )}
                            {job.uiStatus === "APPLYING" && (
                              <div className="w-full lg:w-48 px-5 py-3 bg-gray-50 text-gray-500 font-semibold text-sm rounded-xl border-2 border-dashed border-gray-200 text-center flex items-center justify-center gap-2">
                                <Clock size={16} />
                                Đang xếp hàng
                              </div>
                            )}
                            {job.uiStatus === "COMPLETED" && (
                              <div className="w-full lg:w-48 px-5 py-3 bg-gradient-to-r from-emerald-50 to-green-50 text-emerald-700 font-bold text-sm rounded-xl border border-emerald-200 text-center flex items-center justify-center gap-2">
                                <CheckCircle2 size={16} />
                                Đã hoàn thành
                              </div>
                            )}
                          </div>
                        </div>

                      </div>
                    </div>

                    {/* Progress bar cho PROCESSING jobs */}
                    {job.uiStatus === "PROCESSING" && job.progress !== undefined && (
                      <div className="h-1.5 bg-gray-100">
                        <div
                          className="h-full bg-gradient-to-r from-amber-500 to-orange-500 transition-all duration-500"
                          style={{ width: `${job.progress || 0}%` }}
                        />
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        )}

      </div>
    </div>
  );
}