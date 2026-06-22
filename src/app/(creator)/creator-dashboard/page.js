"use client";
import React, { useState, useEffect } from "react";
import { getAvailableJobs, applyToJobAction, getPublicShopProfile } from "#/app/(creator)/actions";

export default function CreatorDashboard() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [applyingId, setApplyingId] = useState(null);
  const [shopModalOpen, setShopModalOpen] = useState(false);
  const [shopProfile, setShopProfile] = useState(null);
  const [loadingShop, setLoadingShop] = useState(false);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const data = await getAvailableJobs();
      const formatted = data.map((job) => ({
        id: job.id,
        shopId: job.shop?.id || null,
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

  const viewShopProfile = async (shopId) => {
    if (!shopId) return alert("Không tìm thấy cửa hàng");
    setShopProfile(null);
    setLoadingShop(true);
    setShopModalOpen(true);

    const result = await getPublicShopProfile(shopId);
    if (result.success) {
      setShopProfile(result.data);
    } else {
      alert(result.error || "Không thể tải hồ sơ cửa hàng");
      setShopProfile(null);
    }

    setLoadingShop(false);
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
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleConnect(aiJob.id)}
                      disabled={applyingId === aiJob.id}
                      className="px-4 py-2 bg-white text-purple-900 font-bold text-sm rounded-xl hover:bg-purple-100 disabled:opacity-70"
                    >
                      {applyingId === aiJob.id ? "Đang xử lý..." : "Kết nối ngay"}
                    </button>
                    <button
                      onClick={() => viewShopProfile(aiJob.shopId)}
                      className="px-3 py-2 bg-white/10 border border-white/20 text-white text-sm rounded-xl hover:bg-white/20"
                    >
                      Xem hồ sơ
                    </button>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </section>

      {shopModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-xs" onClick={() => setShopModalOpen(false)} />
          <div className="relative max-w-2xl w-full bg-white rounded-3xl overflow-hidden shadow-2xl z-10 max-h-[90vh] flex flex-col">

            {/* TIÊU ĐỀ FIXED Ở TOP MODAL */}
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-white z-20">
              <h3 className="font-bold text-gray-900">Thông tin đối tác thương hiệu</h3>
              <button
                onClick={() => setShopModalOpen(false)}
                className="w-8 h-8 flex items-center justify-center bg-gray-100 hover:bg-gray-200 text-gray-500 rounded-full font-bold text-sm transition cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* VÙNG NỘI DUNG CHÍNH CÓ CUỘN (SCROLL) */}
            <div className="flex-1 overflow-y-auto option-scroll">
              {loadingShop ? (
                <div className="py-20 text-center">
                  <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
                  <p className="mt-3 text-sm text-gray-500">Đang đồng bộ dữ liệu cửa hàng...</p>
                </div>
              ) : shopProfile ? (
                <div>

                  {/* Cấu trúc Ảnh bìa (Cover) & Ảnh đại diện (MainImage) */}
                  <div className="relative bg-gray-100">
                    <div className="h-40 w-full bg-slate-200 relative">
                      {shopProfile.coverImage ? (
                        <img src={shopProfile.coverImage} alt="Cover" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-linear-to-r from-purple-100 to-indigo-100" />
                      )}
                    </div>

                    {/* Avatar Logo thương hiệu nằm đè */}
                    <div className="absolute -bottom-10 left-6 w-20 h-20 rounded-2xl border-4 border-white bg-gray-50 overflow-hidden shadow-md">
                      {shopProfile.mainImage ? (
                        <img src={shopProfile.mainImage} alt="Logo" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-purple-600 text-white font-bold text-xl">
                          {shopProfile.shopName?.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Thông tin chữ phía dưới khối ảnh */}
                  <div className="pt-14 px-6 pb-6 space-y-6">
                    <div>
                      <h2 className="text-xl font-black text-gray-900">{shopProfile.shopName}</h2>
                      <p className="text-xs text-gray-400 mt-0.5">Người đại diện: {shopProfile.ownerName || "Chưa cập nhật"}</p>
                    </div>

                    {/* Danh mục hoạt động */}
                    {shopProfile.categories?.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {shopProfile.categories.map((c) => (
                          <span key={c} className="text-[11px] bg-purple-50 text-purple-700 border border-purple-100 px-2.5 py-0.5 rounded-lg font-medium">
                            {c}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Khối mô tả chi tiết */}
                    <div className="bg-gray-50/50 rounded-2xl p-4 border border-gray-100">
                      <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Giới thiệu thương hiệu</h4>
                      <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                        {shopProfile.description || "Cửa hàng chưa cập nhật phần mô tả."}
                      </p>
                    </div>

                    {/* Các thông số khác */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                      <div className="space-y-1">
                        <span className="block text-xs font-bold text-gray-400 uppercase">🎯 Định hướng Vibe sáng tạo</span>
                        <p className="text-gray-700 bg-gray-50 p-3 rounded-xl border border-gray-100 text-xs leading-relaxed">
                          {shopProfile.vibeText || "Chưa có định hướng cụ thể từ AI"}
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div className="bg-amber-50/50 border border-amber-100 rounded-xl p-3 text-center">
                          <span className="block text-[10px] font-bold text-amber-600 uppercase">Đánh giá</span>
                          <span className="text-base font-black text-amber-700 mt-1 block">
                            {shopProfile.averageRating ? `${shopProfile.averageRating} ⭐` : "Chưa có"}
                          </span>
                        </div>
                        <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-3 text-center">
                          <span className="block text-[10px] font-bold text-blue-600 uppercase">Chiến dịch</span>
                          <span className="text-base font-black text-blue-700 mt-1 block">{shopProfile.totalJobs || 0} đã mở</span>
                        </div>
                      </div>
                    </div>

                    {/* 🌐 THÔNG TIN ĐƯỜNG LINK LIÊN HỆ */}
                    <div className="border-t border-gray-100 pt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-gray-600">
                      <div className="flex items-center gap-2 bg-gray-50 p-2.5 rounded-xl border border-gray-100">
                        <span className="text-base">🌐</span>
                        <span className="font-semibold text-gray-400">Website:</span>
                        {shopProfile.website ? (
                          <a href={shopProfile.website} target="_blank" rel="noreferrer" className="text-purple-600 hover:underline font-medium truncate flex-1">
                            {shopProfile.website}
                          </a>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </div>

                      <div className="flex items-center gap-2 bg-gray-50 p-2.5 rounded-xl border border-gray-100">
                        <span className="text-base">📸</span>
                        <span className="font-semibold text-gray-400">Instagram:</span>
                        {shopProfile.instagram ? (
                          <a
                            href={shopProfile.instagram.startsWith('http') ? shopProfile.instagram : `https://instagram.com/${shopProfile.instagram.replace('@', '')}`}
                            target="_blank"
                            rel="noreferrer"
                            className="text-purple-600 hover:underline font-medium truncate flex-1"
                          >
                            {shopProfile.instagram}
                          </a>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </div>
                    </div>

                    {/* 🖼️ KHU VỰC BỘ SƯU TẬP ẢNH (GALLERY) */}
                    <div className="border-t border-gray-100 pt-4 space-y-2">
                      <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Không gian & Sản phẩm nổi bật</h4>
                      {shopProfile.gallery?.length > 0 ? (
                        <div className="grid grid-cols-3 gap-2">
                          {shopProfile.gallery.map((img, i) => (
                            <a key={i} href={img} target="_blank" rel="noreferrer" className="aspect-square rounded-xl overflow-hidden bg-gray-100 border border-gray-200 block group relative">
                              <img src={img} alt={`Gallery-${i}`} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
                            </a>
                          ))}
                        </div>
                      ) : (
                        <p className="text-xs text-gray-400 italic">Thương hiệu chưa tải lên ảnh bộ sưu tập mẫu.</p>
                      )}
                    </div>

                  </div>
                </div>
              ) : (
                <div className="py-12 text-center text-sm text-gray-500">Lỗi: Không tìm thấy dữ liệu hồ sơ này.</div>
              )}
            </div>

            {/* THANH THAO TÁC FIXED Ở BOTTOM MODAL */}
            <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-2">
              <button
                onClick={() => setShopModalOpen(false)}
                className="px-5 py-2.5 bg-white border border-gray-200 text-gray-700 text-sm font-semibold rounded-xl hover:bg-gray-50 transition cursor-pointer"
              >
                Đóng lại
              </button>
            </div>

          </div>
        </div>
      )}

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

                  <div className="w-full md:w-auto flex flex-col gap-2">
                    <button
                      onClick={() => viewShopProfile(job.shopId)}
                      className="w-full md:w-auto px-4 py-2 bg-white border border-gray-200 text-gray-800 font-medium rounded-xl hover:bg-gray-50"
                    >
                      👀 Xem hồ sơ
                    </button>

                    <button
                      onClick={() => handleConnect(job.id)}
                      disabled={applyingId === job.id}
                      className="w-full md:w-auto px-6 py-3.5 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl transition disabled:opacity-70 flex items-center justify-center gap-2"
                    >
                      ⚡ {applyingId === job.id ? "Đang ứng tuyển..." : "Kết nối ngay"}
                    </button>
                  </div>
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