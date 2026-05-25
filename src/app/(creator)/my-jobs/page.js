// src/app/(creator)/my-jobs/page.js
"use client";
import React, { useState, useEffect } from "react";
import { getMyAppliedJobs } from "#/app/(creator)/actions";
import CreatorJobDetails from "#/components/campaigns/CreatorJobDetails";

export default function MyJobsPage() {
  const [activeTab, setActiveTab] = useState("PROCESSING"); // APPLYING, PROCESSING, COMPLETED
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

  const filteredJobs = myJobs.filter(job => job.uiStatus === activeTab);

  if (selectedJob) {
    return <CreatorJobDetails job={selectedJob} onBack={() => setSelectedJob(null)} />;
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div>
        <h1 className="text-2xl font-black text-gray-950">Quản lý công việc</h1>
        <p className="text-xs text-gray-500 mt-1">Theo dõi trạng thái các hợp đồng quảng cáo và tiến độ giải ngân dòng tiền.</p>
      </div>

      {/* THANH ĐIỀU HƯỚNG TAB */}
      <div className="flex border-b border-gray-200 gap-6">
        <button 
          onClick={() => setActiveTab("APPLYING")}
          className={`pb-3 text-sm font-semibold transition relative cursor-pointer ${activeTab === "APPLYING" ? "text-purple-600 font-bold" : "text-gray-500 hover:text-gray-900"}`}
        >
          Đang ứng tuyển ({myJobs.filter(j => j.uiStatus === "APPLYING").length})
          {activeTab === "APPLYING" && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-600 rounded-full" />}
        </button>
        <button 
          onClick={() => setActiveTab("PROCESSING")}
          className={`pb-3 text-sm font-semibold transition relative cursor-pointer ${activeTab === "PROCESSING" ? "text-purple-600 font-bold" : "text-gray-500 hover:text-gray-900"}`}
        >
          Đang thực hiện ({myJobs.filter(j => j.uiStatus === "PROCESSING").length})
          {activeTab === "PROCESSING" && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-600 rounded-full" />}
        </button>
        <button 
          onClick={() => setActiveTab("COMPLETED")}
          className={`pb-3 text-sm font-semibold transition relative cursor-pointer ${activeTab === "COMPLETED" ? "text-purple-600 font-bold" : "text-gray-500 hover:text-gray-900"}`}
        >
          Đã hoàn thành ({myJobs.filter(j => j.uiStatus === "COMPLETED").length})
          {activeTab === "COMPLETED" && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-600 rounded-full" />}
        </button>
      </div>

      {/* DANH SÁCH CÁC JOB THEO TAB */}
      {loading ? (
        <div className="py-20 text-center flex justify-center">
          <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
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
                      job.uiStatus === "PROCESSING" ? "bg-amber-50 text-amber-700 border border-amber-200" :
                      job.uiStatus === "COMPLETED" ? "bg-green-50 text-green-700 border border-green-200" : "bg-blue-50 text-blue-700 border border-blue-200"
                    }`}>
                      {job.uiStatus === "APPLYING" ? "Đang chờ duyệt hồ sơ" : 
                       job.uiStatus === "PROCESSING" ? "Đang làm việc" : "Hoàn thành"}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-gray-900">{job.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed max-w-2xl line-clamp-2">{job.notes}</p>
                </div>

                {/* Khối Thù lao & Action */}
                <div className="md:w-48 flex flex-row md:flex-col justify-between md:justify-center items-center md:items-end gap-3 border-t md:border-t-0 md:border-l border-gray-100 pt-4 md:pt-0 md:pl-6 shrink-0">
                  <div className="text-left md:text-right">
                    <span className="block text-[11px] text-gray-400 font-semibold uppercase">Thù lao</span>
                    <span className="text-lg font-black text-purple-600">{job.budget}</span>
                  </div>

                  {job.uiStatus === "PROCESSING" && (
                    <button
                      onClick={() => setSelectedJob(job)}
                      className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl transition shadow-md shadow-purple-50 cursor-pointer w-full"
                    >
                      🚀 Xem tiến độ & Làm bài
                    </button>
                  )}
                  {job.uiStatus === "APPLYING" && (
                    <button className="px-4 py-2 bg-gray-100 text-gray-400 font-bold text-xs rounded-xl cursor-not-allowed w-full" disabled>
                      Đang xếp hàng
                    </button>
                  )}
                </div>

              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}