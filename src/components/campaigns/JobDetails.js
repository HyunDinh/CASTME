import React, { useState } from "react";
import { ArrowLeft } from "lucide-react";
import ApplicantTable from "./ApplicantTable";
import KanbanBoard from "./KanbanBoard";

export default function JobDetails({ job, onBack }) {
  const [currentTab, setCurrentTab] = useState("applicants"); // 'applicants' | 'pipeline'

  if (!job) return null;

  return (
    <div className="space-y-6 animate-in slide-in-from-right-8 duration-300">
      
      {/* SECONDARY NAVIGATION */}
      <div className="flex flex-col gap-4">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-sm font-bold text-gray-500 hover:text-gray-900 transition-colors w-max cursor-pointer"
        >
          <ArrowLeft size={16} />
          Quay lại danh sách
        </button>
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900">{job.title}</h1>
            <p className="text-sm text-gray-500 mt-1 max-w-2xl line-clamp-1">{job.description}</p>
          </div>
          <span className="px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-black uppercase tracking-wider rounded-lg w-max shrink-0">
            {job.status === "recruiting" ? "Đang mở tuyển" : job.status === "in-progress" ? "Đang thực hiện" : "Trạng thái khác"}
          </span>
        </div>
      </div>

      {/* INTERNAL TABS */}
      <div className="flex items-center gap-2 border-b border-gray-100">
        <button
          onClick={() => setCurrentTab("applicants")}
          className={`px-5 py-3 text-sm font-bold border-b-2 transition-colors cursor-pointer ${
            currentTab === "applicants"
              ? "border-blue-600 text-blue-600 bg-blue-50/50 rounded-t-xl"
              : "border-transparent text-gray-500 hover:text-gray-900 hover:bg-gray-50 rounded-t-xl"
          }`}
        >
          Duyệt ứng viên
          <span className="ml-2 bg-gray-100 text-gray-600 text-[10px] font-black px-1.5 py-0.5 rounded-full">{job.applicantsCount || 0}</span>
        </button>
        <button
          onClick={() => setCurrentTab("pipeline")}
          className={`px-5 py-3 text-sm font-bold border-b-2 transition-colors cursor-pointer ${
            currentTab === "pipeline"
              ? "border-blue-600 text-blue-600 bg-blue-50/50 rounded-t-xl"
              : "border-transparent text-gray-500 hover:text-gray-900 hover:bg-gray-50 rounded-t-xl"
          }`}
        >
          Tiến độ công việc
          <span className="ml-2 bg-gray-100 text-gray-600 text-[10px] font-black px-1.5 py-0.5 rounded-full">{job.activeWorkersCount || 0}</span>
        </button>
      </div>

      {/* CONTENT PORTAL */}
      <div className="pt-2">
        {currentTab === "applicants" ? (
          <ApplicantTable />
        ) : (
          <KanbanBoard />
        )}
      </div>

    </div>
  );
}
