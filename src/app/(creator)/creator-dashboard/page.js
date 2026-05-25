"use client";
import React, { useState, useEffect } from "react";
import { getAvailableJobs, applyToJobAction } from "#/app/(creator)/creator-dashboard/actions";

export default function CreatorDashboard() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [applyingId, setApplyingId] = useState(null);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const data = await getAvailableJobs();
      const formatted = data.map((job) => ({
        id: job.id,
        shopName: job.shop?.name || "Unknown Shop",
        title: job.title,
        description: job.description,
        budget: job.budget,
        vibeTags: job.vibeTags || [],
        matchRate: job.matchRate || Math.floor(Math.random() * 30) + 70,
      }));
      setJobs(formatted);
    } catch (error) {
      console.error("Lỗi khi tải job:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleConnect = async (jobId) => {
    if (applyingId) return;

    const confirmApply = window.confirm("Xác nhận dùng 5 Trái Tim để ứng tuyển công việc này?");
    if (!confirmApply) return;

    setApplyingId(jobId);

    const result = await applyToJobAction(jobId);

    if (result.success) {
      alert("✅ Ứng tuyển thành công! Shop sẽ xem hồ sơ của bạn sớm.");
    } else {
      alert(`❌ ${result.error || "Không thể ứng tuyển lúc này"}`);
    }

    setApplyingId(null);
  };

  return (
    <div className="space-y-8">
      {/* KHỐI AI MATCHING GỢI Ý */}
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
            Hệ thống AI vừa quét bản tóm tắt hồ sơ phong cách cá nhân của bạn và tìm thấy những nhãn hàng phù hợp nhất.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          {jobs
            .filter((j) => (j.matchRate || 0) >= 85)
            .slice(0, 4)
            .map((aiJob) => (
              <div
                key={`ai-${aiJob.id}`}
                className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/10 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-purple-300">{aiJob.shopName}</span>
                    <span className="text-xs font-black bg-emerald-500 text-white px-2 py-0.5 rounded-lg animate-pulse">
                      🔥 {aiJob.matchRate}% Phù hợp
                    </span>
                  </div>
                  <h3 className="font-bold text-sm line-clamp-2 mb-3">{aiJob.title}</h3>
                  <div className="flex flex-wrap gap-1.5">
                    {aiJob.vibeTags.map((tag) => (
                      <span key={tag} className="text-[10px] bg-white/10 px-2 py-0.5 rounded-md">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex items-center justify-between border-t border-white/10 pt-4 mt-4">
                  <span className="text-sm font-bold text-amber-300">{aiJob.budget}</span>
                  <button
                    onClick={() => handleConnect(aiJob.id)}
                    disabled={applyingId === aiJob.id}
                    className="px-4 py-2 bg-white text-purple-900 font-bold text-sm rounded-xl hover:bg-purple-100 disabled:opacity-70"
                  >
                    {applyingId === aiJob.id ? "Đang xử lý..." : "Kết nối ngay"}
                  </button>
                </div>
              </div>
            ))}
        </div>
      </section>

      {/* DANH SÁCH TIN TUYỂN DỤNG ĐANG MỞ */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-extrabold text-gray-950">Tin tuyển dụng đang mở</h2>
            <p className="text-xs text-gray-500">Các cơ hội hợp tác quảng cáo phù hợp với bạn</p>
          </div>
          <button className="text-sm font-bold text-purple-600 hover:underline cursor-pointer">
            Bộ lọc nâng cao 🔍
          </button>
        </div>

        {loading ? (
          <div className="py-20 text-center">
            <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-sm text-gray-500 mt-4">Đang tải...</p>
          </div>
        ) : jobs.length > 0 ? (
          <div className="grid grid-cols-1 gap-4">
            {jobs.map((job) => (
              <div
                key={job.id}
                className="bg-white rounded-2xl p-6 border border-gray-100 shadow-xs hover:shadow-md transition-all flex flex-col md:flex-row justify-between gap-6"
              >
                {/* Phần trái - Thông tin */}
                <div className="flex-1 space-y-3">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold text-gray-800 bg-gray-50 border border-gray-200 px-2.5 py-0.5 rounded-lg">
                      🏪 {job.shopName}
                    </span>
                    {job.matchRate && (
                      <span className="text-xs font-bold px-2.5 py-1 bg-purple-50 text-purple-700 rounded-lg">
                        🤖 {job.matchRate}% Match
                      </span>
                    )}
                  </div>

                  <h3 className="text-lg font-bold text-gray-900 line-clamp-2">{job.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed line-clamp-3">
                    {job.description}
                  </p>

                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {job.vibeTags.map((tag) => (
                      <span key={tag} className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-lg">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Phần phải - Budget + Nút Kết nối */}
                <div className="md:w-56 flex flex-col justify-between md:items-end gap-4 border-t md:border-t-0 md:border-l border-gray-100 pt-4 md:pt-0 md:pl-6">
                  <div className="text-left md:text-right">
                    <span className="block text-xs font-semibold text-gray-400 uppercase tracking-wider">Thù lao</span>
                    <span className="text-2xl font-black text-purple-600">{job.budget}</span>
                  </div>

                  <button
                    onClick={() => handleConnect(job.id)}
                    disabled={applyingId === job.id}
                    className="w-full md:w-auto px-6 py-3.5 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl transition disabled:opacity-70 flex items-center justify-center gap-2"
                  >
                    ⚡ {applyingId === job.id ? "Đang ứng tuyển..." : "Kết nối ngay"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-20 text-center bg-gray-50 rounded-2xl border border-dashed border-gray-200">
            <p className="text-gray-500">Hiện chưa có tin tuyển dụng nào đang mở.</p>
          </div>
        )}
      </section>
    </div>
  );
}