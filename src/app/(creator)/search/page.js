"use client";
import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { AdvancedSearchAction, getPublicShopProfile, applyToJobAction } from "#/app/(creator)/actions";

function SearchResultsContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";

  const [activeTab, setActiveTab] = useState("jobs"); // jobs | shops
  const [loading, setLoading] = useState(true);
  const [jobs, setJobs] = useState([]);
  const [shops, setShops] = useState([]);
  const [applyingId, setApplyingId] = useState(null);

  // States quản lý Modal xem hồ sơ shop giống dashboard
  const [shopModalOpen, setShopModalOpen] = useState(false);
  const [shopProfile, setShopProfile] = useState(null);
  const [loadingShop, setLoadingShop] = useState(false);

  useEffect(() => {
    const executeSearch = async () => {
      if (!query) return;
      setLoading(true);
      const result = await AdvancedSearchAction(query);
      if (result.success) {
        setJobs(result.jobs || []);
        setShops(result.shops || []);
      }
      setLoading(false);
    };
    executeSearch();
  }, [query]);

  const handleConnect = async (jobId) => {
    if (applyingId) return;
    const confirmApply = window.confirm("Xác nhận dùng 5 Trái Tim để ứng tuyển công việc này?");
    if (!confirmApply) return;

    setApplyingId(jobId);
    const result = await applyToJobAction(jobId);
    if (result.success) {
      alert("✅ Ứng tuyển thành công!");
    } else {
      alert(`❌ ${result.error}`);
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
      setShopModalOpen(false);
    }
    setLoadingShop(false);
  };

  return (
    <div className="space-y-6">
      {/* Khối tiêu đề */}
      <div>
        <h1 className="text-2xl font-black text-gray-900">Kết quả tìm kiếm</h1>
        <p className="text-sm text-gray-500 mt-1">
          Tìm thấy <span className="font-bold text-purple-600">{jobs.length}</span> tin tuyển dụng và{" "}
          <span className="font-bold text-purple-600">{shops.length}</span> thương hiệu cho từ khóa "{query}"
        </p> 
      </div>

      {/* Bộ lọc Tabs thanh nhã */}
      <div className="flex border-b border-gray-200 gap-6 text-sm">
        <button
          onClick={() => setActiveTab("jobs")}
          className={`pb-3 font-bold transition cursor-pointer ${
            activeTab === "jobs" ? "text-purple-600 border-b-2 border-purple-600" : "text-gray-400"
          }`}
        >
          💼 Tin tuyển dụng ({jobs.length})
        </button>
        <button
          onClick={() => setActiveTab("shops")}
          className={`pb-3 font-bold transition cursor-pointer ${
            activeTab === "shops" ? "text-purple-600 border-b-2 border-purple-600" : "text-gray-400"
          }`}
        >
          🏪 Thương hiệu đối tác ({shops.length})
        </button>
      </div>

      {/* Vùng render danh sách nội dung */}
      {loading ? (
        <div className="py-20 text-center">
          <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm text-gray-500 mt-4">Đang lọc dữ liệu phù hợp...</p>
        </div>
      ) : activeTab === "jobs" ? (
        /* TAB 1: DANH SÁCH JOBS TÌM ĐƯỢC */
        <div className="grid grid-cols-1 gap-4">
          {jobs.length > 0 ? (
            jobs.map((job) => (
              <div key={job.id} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-xs flex flex-col md:flex-row justify-between gap-6">
                <div className="flex-1 space-y-2">
                  <span className="inline-block text-xs font-bold text-gray-700 bg-gray-50 px-2.5 py-0.5 rounded-lg border border-gray-200">
                    🏪 {job.shopName}
                  </span>
                  <h3 className="text-lg font-bold text-gray-900">{job.title}</h3>
                  <p className="text-sm text-gray-600 line-clamp-2">{job.description}</p>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {job.vibeTags.map(t => (
                      <span key={t} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-md">#{t}</span>
                    ))}
                  </div>
                </div>
                <div className="md:w-48 flex flex-col justify-between md:items-end gap-3 border-t md:border-t-0 md:border-l border-gray-100 pt-3 md:pt-0 md:pl-4">
                  <div className="text-left md:text-right">
                    <span className="block text-[10px] uppercase font-bold text-gray-400">Thù lao</span>
                    <span className="text-xl font-black text-purple-600">{job.budget}</span>
                  </div>
                  <div className="flex flex-col gap-1.5 w-full">
                    <button onClick={() => viewShopProfile(job.shopId)} className="w-full px-3 py-1.5 bg-white border border-gray-200 text-gray-800 text-xs font-semibold rounded-lg hover:bg-gray-50 transition cursor-pointer">
                      👀 Xem hồ sơ shop
                    </button>
                    <button onClick={() => handleConnect(job.id)} disabled={applyingId === job.id} className="w-full px-3 py-1.5 bg-purple-600 text-white text-xs font-bold rounded-lg hover:bg-purple-700 transition disabled:opacity-70">
                      {applyingId === job.id ? "Đang xử lý..." : "Kết nối"}
                    </button>
                  </div>
                </div>
              </div>
            ))  
          ) : (
            <p className="text-sm text-gray-500 italic py-8">Không tìm thấy tin tuyển dụng nào phù hợp.</p>
          )}
        </div>
      ) : (
        /* TAB 2: DANH SÁCH SHOPS TÌM ĐƯỢC */
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {shops.length > 0 ? (
            shops.map((shop) => (
              <div key={shop.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-xs flex flex-col justify-between">
                <div>
                  <div className="h-24 bg-purple-100 relative">
                    {shop.coverImage && <img src={shop.coverImage} className="w-full h-full object-cover" alt="cover" />}
                    <div className="absolute -bottom-6 left-4 w-12 h-12 rounded-xl border-2 border-white overflow-hidden bg-white shadow-xs">
                      {shop.mainImage ? <img src={shop.mainImage} className="w-full h-full object-cover" alt="logo" /> : <div className="w-full h-full bg-purple-600 text-white flex items-center justify-center font-bold">{shop.shopName.charAt(0)}</div>}
                    </div>
                  </div>
                  <div className="pt-8 px-4 pb-4 space-y-2">
                    <h3 className="font-bold text-gray-900 text-base">{shop.shopName}</h3>
                    <p className="text-xs text-gray-500 line-clamp-3">{shop.description || "Chưa có bài giới thiệu."}</p>
                    <div className="flex flex-wrap gap-1">
                      {shop.categories.slice(0, 3).map(c => (
                        <span key={c} className="text-[10px] bg-purple-50 text-purple-700 px-2 py-0.5 rounded-md">{c}</span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="p-4 border-t border-gray-50 bg-gray-50/50 flex items-center justify-between">
                  <span className="text-xs text-amber-600 font-bold">⭐ {shop.averageRating || "0.0"} Đánh giá</span>
                  <button
                    onClick={() => viewShopProfile(shop.id)}
                    className="px-4 py-2 bg-white border border-gray-200 text-xs font-bold text-purple-600 rounded-xl hover:bg-purple-50 shadow-xs transition cursor-pointer"
                  >
                    🏪 Xem hồ sơ
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500 italic py-8 col-span-2">Không tìm thấy shop thương hiệu nào phù hợp.</p>
          )}
        </div>
      )}

      {/* MODAL HIỂN THỊ CHI TIẾT HỒ SƠ SHOP (TÁI SỬ DỤNG LOGO/COVER/GALLERY) */}
      {shopModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-xs" onClick={() => setShopModalOpen(false)} />
          <div className="relative max-w-2xl w-full bg-white rounded-3xl overflow-hidden shadow-2xl z-10 max-h-[90vh] flex flex-col">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-white z-20">
              <h3 className="font-bold text-gray-900">Thông tin đối tác thương hiệu</h3>
              <button onClick={() => setShopModalOpen(false)} className="w-8 h-8 flex items-center justify-center bg-gray-100 hover:bg-gray-200 text-gray-500 rounded-full font-bold text-sm transition cursor-pointer">✕</button>
            </div>
            <div className="flex-1 overflow-y-auto">
              {loadingShop ? (
                <div className="py-20 text-center">
                  <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto" />
                  <p className="mt-3 text-sm text-gray-500">Đang đồng bộ dữ liệu cửa hàng...</p>
                </div>
              ) : shopProfile ? (
                <div>
                  <div className="relative bg-gray-100">
                    <div className="h-40 w-full bg-slate-200 relative">
                      {shopProfile.coverImage ? <img src={shopProfile.coverImage} alt="Cover" className="w-full h-full object-cover" /> : <div className="w-full h-full bg-gradient-to-r from-purple-100 to-indigo-100" />}
                    </div>
                    <div className="absolute -bottom-10 left-6 w-20 h-20 rounded-2xl border-4 border-white bg-gray-50 overflow-hidden shadow-md">
                      {shopProfile.mainImage ? <img src={shopProfile.mainImage} alt="Logo" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center bg-purple-600 text-white font-bold text-xl">{shopProfile.shopName?.charAt(0).toUpperCase()}</div>}
                    </div>
                  </div>
                  <div className="pt-14 px-6 pb-6 space-y-6">
                    <div>
                      <h2 className="text-xl font-black text-gray-900">{shopProfile.shopName}</h2>
                      <p className="text-xs text-gray-400 mt-0.5">Người đại diện: {shopProfile.ownerName || "Chưa cập nhật"}</p>
                    </div>
                    {shopProfile.categories?.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {shopProfile.categories.map(c => <span key={c} className="text-[11px] bg-purple-50 text-purple-700 border border-purple-100 px-2.5 py-0.5 rounded-lg font-medium">{c}</span>)}
                      </div>
                    )}
                    <div className="bg-gray-50/50 rounded-2xl p-4 border border-gray-100">
                      <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Giới thiệu thương hiệu</h4>
                      <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">{shopProfile.description || "Cửa hàng chưa cập nhật phần mô tả."}</p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                      <div className="space-y-1">
                        <span className="block text-xs font-bold text-gray-400 uppercase">🎯 Định hướng Vibe sáng tạo</span>
                        <p className="text-gray-700 bg-gray-50 p-3 rounded-xl border border-gray-100 text-xs leading-relaxed">{shopProfile.vibeText || "Chưa có định hướng cụ thể từ AI"}</p>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="bg-amber-50/50 border border-amber-100 rounded-xl p-3 text-center">
                          <span className="block text-[10px] font-bold text-amber-600 uppercase">Đánh giá</span>
                          <span className="text-base font-black text-amber-700 mt-1 block">{shopProfile.averageRating ? `${shopProfile.averageRating} ⭐` : "Chưa có"}</span>
                        </div>
                        <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-3 text-center">
                          <span className="block text-[10px] font-bold text-blue-600 uppercase">Chiến dịch</span>
                          <span className="text-base font-black text-blue-700 mt-1 block">{shopProfile.totalJobs || 0} đã mở</span>
                        </div>
                      </div>
                    </div>
                    <div className="border-t border-gray-100 pt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-gray-600">
                      <div className="flex items-center gap-2 bg-gray-50 p-2.5 rounded-xl border border-gray-100">
                        <span>🌐</span><span className="font-semibold text-gray-400">Website:</span>
                        {shopProfile.website ? <a href={shopProfile.website} target="_blank" rel="noreferrer" className="text-purple-600 hover:underline font-medium truncate flex-1">{shopProfile.website}</a> : <span>-</span>}
                      </div>
                      <div className="flex items-center gap-2 bg-gray-50 p-2.5 rounded-xl border border-gray-100">
                        <span>📸</span><span className="font-semibold text-gray-400">Instagram:</span>
                        {shopProfile.instagram ? <a href={shopProfile.instagram.startsWith('http') ? shopProfile.instagram : `https://instagram.com/${shopProfile.instagram.replace('@','')}`} target="_blank" rel="noreferrer" className="text-purple-600 hover:underline font-medium truncate flex-1">{shopProfile.instagram}</a> : <span>-</span>}
                      </div>
                    </div>
                    <div className="border-t border-gray-100 pt-4 space-y-2">
                      <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Không gian & Sản phẩm nổi bật</h4>
                      {shopProfile.gallery?.length > 0 ? (
                        <div className="grid grid-cols-3 gap-2">
                          {shopProfile.gallery.map((img, i) => (
                            <a key={i} href={img} target="_blank" rel="noreferrer" className="aspect-square rounded-xl overflow-hidden bg-gray-100 border border-gray-200 block group">
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
                <div className="py-12 text-center text-sm text-gray-500">Lỗi dữ liệu.</div>
              )}
            </div>
            <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex justify-end">
              <button onClick={() => setShopModalOpen(false)} className="px-5 py-2.5 bg-white border border-gray-200 text-gray-700 text-sm font-semibold rounded-xl hover:bg-gray-50 transition cursor-pointer">Đóng lại</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdvancedSearchPage() {
  return (
    <Suspense fallback={<div className="py-20 text-center text-sm text-gray-500">Đang khởi tạo tìm kiếm...</div>}>
      <SearchResultsContent />
    </Suspense>
  );
}