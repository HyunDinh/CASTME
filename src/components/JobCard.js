import React from 'react';

export default function JobCard({ job, role = "koc", onAction, actionLabel }) {
  const isShop = role === "shop";

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-xs hover:shadow-md transition-all flex flex-col md:flex-row justify-between gap-6">
      {/* Cột thông tin bài tuyển */}
      <div className="flex-1 space-y-3">
        <div className="flex flex-wrap items-center gap-3">
          {/* Tag Nhãn hiệu hoặc Trạng thái tuỳ vào Role */}
          {isShop ? (
            <span className="text-sm font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-lg flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Đang tuyển
            </span>
          ) : (
            <span className="text-sm font-bold text-gray-800 bg-gray-50 border border-gray-200 px-2.5 py-0.5 rounded-lg">
              🏪 {job.shopName}
            </span>
          )}

          {/* AI Match chỉ hiện cho KOC */}
          {!isShop && job.matchRate && (
            <span
              className={`text-xs font-extrabold px-2 py-0.5 rounded-lg ${
                job.matchRate >= 85
                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                  : "bg-purple-50 text-purple-700 border border-purple-200"
              }`}
            >
              🤖 AI Match: {job.matchRate}%
            </span>
          )}

          {/* Số lượng ứng viên và KOC đang làm việc chỉ hiện cho Shop */}
          {isShop && (
            <div className="flex gap-2">
              {job.applicantsCount !== undefined && (
                <span className="text-xs font-bold px-2 py-0.5 rounded-lg bg-blue-50 text-blue-700 border border-blue-200">
                  👥 {job.applicantsCount} Ứng viên
                </span>
              )}
              {job.activeWorkersCount !== undefined && (
                <span className="text-xs font-bold px-2 py-0.5 rounded-lg bg-purple-50 text-purple-700 border border-purple-200">
                  🏃‍♂️ {job.activeWorkersCount} KOC
                </span>
              )}
            </div>
          )}
        </div>

        <h3 className="text-lg font-bold text-gray-900 hover:text-purple-600 transition cursor-pointer">
          {job.title}
        </h3>

        <p className="text-sm text-gray-600 leading-relaxed max-w-3xl line-clamp-2">
          {job.description}
        </p>

        <div className="flex flex-wrap gap-1.5 pt-1">
          {job.vibeTags?.map((tag) => (
            <span
              key={tag}
              className="text-xs font-medium bg-gray-100 text-gray-600 px-2.5 py-1 rounded-lg"
            >
              #{tag}
            </span>
          ))}
        </div>
      </div>

      {/* Cột Chi phí & Nút Hành động bên phải */}
      <div className="md:w-52 flex flex-row md:flex-col justify-between md:justify-center items-center md:items-end gap-4 border-t md:border-t-0 md:border-l border-gray-100 pt-4 md:pt-0 md:pl-6 shrink-0">
        <div className="text-left md:text-right">
          <span className="block text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Thù lao đề xuất
          </span>
          <span className="text-xl font-black text-purple-600">
            {job.budget}
          </span>
        </div>

        <button
          onClick={() => onAction && onAction(job.id)}
          className={`w-full md:w-auto px-5 py-2.5 font-bold text-sm rounded-xl shadow-md transition cursor-pointer flex items-center justify-center gap-2 ${
            isShop
              ? "bg-gray-900 hover:bg-gray-800 text-white shadow-gray-200"
              : "bg-purple-600 hover:bg-purple-700 text-white shadow-purple-100"
          }`}
        >
          {isShop ? (
            <>⚙️ {actionLabel || "Quản Lý Bài Tuyển"}</>
          ) : (
            <>
              ⚡ Gửi Connect
              {job.heartsRequired && (
                <span className="text-xs opacity-80">({job.heartsRequired}❤️)</span>
              )}
            </>
          )}
        </button>
      </div>
    </div>
  );
}
