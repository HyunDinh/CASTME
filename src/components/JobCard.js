import React from 'react';
import { updateJobStatus } from "#/app/(shop)/my-casting/actions";

export default function JobCard({ 
  job, 
  role = "koc", 
  onAction, 
  actionLabel, 
  onRefresh 
}) {
  const isShop = role === "shop";

  const handlePublish = async (e) => {
    e.stopPropagation();
    const result = await updateJobStatus(job.id, "RECRUITING");
    if (result.success && onRefresh) {
      onRefresh();
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-xs hover:shadow-md transition-all flex flex-col md:flex-row justify-between gap-6">
      {/* Phần thông tin */}
      <div className="flex-1 space-y-3">
        <div className="flex flex-wrap items-center gap-3">
          {isShop ? (
            <span className={`text-sm font-bold px-2.5 py-0.5 rounded-lg border flex items-center gap-1.5 ${
              job.status === "RECRUITING" ? "text-emerald-800 bg-emerald-50 border-emerald-200" :
              job.status === "IN_PROGRESS" ? "text-blue-800 bg-blue-50 border-blue-200" :
              job.status === "COMPLETED" ? "text-gray-800 bg-gray-100 border-gray-300" :
              job.status === "DRAFT" ? "text-amber-800 bg-amber-50 border-amber-200" :
              "text-gray-600 bg-gray-50 border-gray-200"
            }`}>
              <span className={`w-2 h-2 rounded-full ${
                job.status === "RECRUITING" ? "bg-emerald-500 animate-pulse" :
                job.status === "IN_PROGRESS" ? "bg-blue-500 animate-pulse" :
                job.status === "COMPLETED" ? "bg-gray-500" :
                "bg-gray-400"
              }`}></span>
              {job.status === "RECRUITING" ? "Đang tuyển" :
               job.status === "IN_PROGRESS" ? "Đang thực hiện" :
               job.status === "COMPLETED" ? "Đã kết thúc" :
               job.status === "DRAFT" ? "Bản nháp" : job.status}
            </span>
          ) : (
            <span className="text-sm font-bold text-gray-800 bg-gray-50 border border-gray-200 px-2.5 py-0.5 rounded-lg">
              🏪 {job.shopName}
            </span>
          )}

          {!isShop && job.matchRate && (
            <span className={`text-xs font-extrabold px-2 py-0.5 rounded-lg ${
              job.matchRate >= 85 ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : 
              "bg-purple-50 text-purple-700 border border-purple-200"
            }`}>
              🤖 AI Match: {job.matchRate}%
            </span>
          )}
        </div>

        <h3 className="text-lg font-bold text-gray-900">{job.title}</h3>
        <p className="text-sm text-gray-600 leading-relaxed max-w-3xl line-clamp-2">
          {job.description}
        </p>

        <div className="flex flex-wrap gap-1.5 pt-1">
          {job.vibeTags?.map((tag) => (
            <span key={tag} className="text-xs font-medium bg-gray-100 text-gray-600 px-2.5 py-1 rounded-lg">
              #{tag}
            </span>
          ))}
        </div>
      </div>

      {/* Phần bên phải: Nút hành động */}
      <div className="md:w-52 flex flex-col justify-center items-end gap-3 border-t md:border-t-0 md:border-l border-gray-100 pt-4 md:pt-0 md:pl-6 shrink-0">
        <div className="text-right">
          <span className="block text-xs font-semibold text-gray-400 uppercase tracking-wider">Thù lao</span>
          <span className="text-xl font-black text-purple-600">{job.budget}</span>
        </div>

        <div className="flex flex-col gap-2 w-full">
          {/* NÚT PUBLIC - DRAFT */}
          {isShop && job.status?.toUpperCase() === "DRAFT" && (
            <button
              onClick={handlePublish}
              className="w-full px-4 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition flex items-center justify-center gap-2"
            >
              🚀 Public / Đăng tuyển ngay
            </button>
          )}

          {/* NÚT XEM ỨNG VIÊN & TIẾN ĐỘ - ĐÃ PUBLIC */}
          {isShop && job.status?.toUpperCase() !== "DRAFT" && (
            <button
              onClick={() => onAction && onAction(job)}   // Truyền toàn bộ job object
              className="w-full px-5 py-3 bg-gray-900 hover:bg-gray-800 text-white font-bold rounded-xl transition flex items-center justify-center gap-2"
            >
              👀 {actionLabel || "Xem ứng viên & Tiến độ"}
            </button>
          )}

          {/* NÚT CHO CREATOR (KOC) */}
          {!isShop && (
            <button
              onClick={() => onAction && onAction(job.id)}
              className="w-full px-5 py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl transition flex items-center justify-center gap-2"
            >
              ⚡ {actionLabel || "Gửi Connect"}
              {job.heartsRequired && <span className="text-xs">({job.heartsRequired}❤️)</span>}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}