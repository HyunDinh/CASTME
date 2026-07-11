"use client";
import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { AdvancedSearchAction, getPublicShopProfile, applyToJobAction } from "#/app/(creator)/actions";
import ShopProfileModal from "#/components/ShopProfileModal";

function SearchResultsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const query = searchParams.get("q") || "";

  const [searchVal, setSearchVal] = useState(query);

  useEffect(() => {
    setSearchVal(query);
  }, [query]);

  const handleSearch = (val) => {
    const params = new URLSearchParams(window.location.search);
    if (val.trim()) {
      params.set("q", val);
    } else {
      params.delete("q");
    }
    router.replace(`/search?${params.toString()}`);
  };

  const [activeTab, setActiveTab] = useState("jobs"); // jobs | shops
  const [loading, setLoading] = useState(true);
  const [jobs, setJobs] = useState([]);
  const [shops, setShops] = useState([]);
  const [applyingId, setApplyingId] = useState(null);
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast(prev => ({ ...prev, show: false })), 3000);
  };

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
      showToast("✅ Ứng tuyển thành công!");
      setJobs(prev => prev.filter(j => j.id !== jobId));
    } else {
      showToast(`❌ ${result.error}`, "error");
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

      {/* Khối tìm kiếm */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-white p-4 rounded-2xl border border-gray-100 shadow-xs">
        <div className="relative w-full sm:max-w-md flex items-center">
          <input
            type="text"
            placeholder="Tìm kiếm tin tuyển dụng, thương hiệu..."
            value={searchVal}
            onChange={(e) => setSearchVal(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSearch(searchVal);
              }
            }}
            className="w-full px-4 py-2.5 pl-11 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-600/20 focus:border-purple-600 transition-all"
          />
          <svg
            className="w-4 h-4 text-gray-400 absolute left-4 pointer-events-none"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <button
          onClick={() => handleSearch(searchVal)}
          className="w-full sm:w-auto px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white text-sm font-bold rounded-xl transition cursor-pointer"
        >
          Tìm kiếm
        </button>
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
      <ShopProfileModal
        isOpen={shopModalOpen}
        onClose={() => setShopModalOpen(false)}
        loading={loadingShop}
        shopProfile={shopProfile}
      />

      {/* Toast Notification */}
      {toast.show && (
        <>
          <style>{`
            @keyframes toastProgress {
              from { width: 100%; }
              to { width: 0%; }
            }
          `}</style>
          <div className="fixed top-24 right-6 z-50 w-[380px] overflow-hidden rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-gray-100 bg-white transition-all animate-in slide-in-from-top-5">
            <div className="px-5 py-4 flex items-start gap-4">
              <div className={`shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                toast.type === "success" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
              }`}>
                {toast.type === "success" ? (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" /></svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
                )}
              </div>
              <div className="pt-1 flex-1">
                <h4 className="text-[15px] font-bold text-gray-900 leading-none mb-1.5">
                  {toast.type === "success" ? "Thành công" : "Có lỗi xảy ra"}
                </h4>
                <div className="text-[13px] font-medium text-gray-500 leading-snug">{toast.message}</div>
              </div>
            </div>
            <div className="h-1 w-full bg-gray-50">
              <div 
                className={`h-full ${toast.type === "success" ? "bg-green-500" : "bg-red-500"}`} 
                style={{ animation: "toastProgress 3s linear forwards" }}
              />
            </div>
          </div>
        </>
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