"use client";
import React, { useState } from "react";
import {
  X,
  MapPin,
  Store,
  Users,
  Clock,
  CheckCircle2,
  Phone,
  Sparkles,
  Star,
  Globe,
  Instagram,
  Link2
} from "lucide-react";

export default function ShopProfileModal({ isOpen, onClose, loading, shopProfile }) {
  const [lightboxImage, setLightboxImage] = useState(null);

  if (!isOpen) return null;

  const getRatingStars = (rating) => {
    const stars = [];
    const rounded = Math.round(rating || 0);
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star
          key={i}
          className={`w-4 h-4 ${
            i <= rounded ? "text-yellow-400 fill-yellow-400" : "text-gray-200"
          }`}
        />
      );
    }
    return stars;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="absolute inset-0 bg-transparent" 
        onClick={onClose} 
      />
      <div className="relative max-w-6xl w-full bg-gray-50 rounded-3xl overflow-hidden shadow-2xl z-10 max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-gray-150 flex items-center justify-between bg-white z-20 shrink-0">
          <h3 className="font-bold text-gray-900 flex items-center gap-2">
            <Store className="w-5 h-5 text-purple-600" />
            Thông tin đối tác thương hiệu
          </h3>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center bg-gray-100 hover:bg-red-50 hover:text-red-600 text-gray-500 rounded-full font-bold text-sm transition cursor-pointer border-none"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Scrollable Content */}
        <div className="flex-1 overflow-y-auto pb-12">
          {loading ? (
            <div className="py-32 text-center flex flex-col items-center justify-center">
              <div className="w-10 h-10 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mb-4" />
              <p className="text-sm text-gray-500 font-medium">Đang đồng bộ dữ liệu cửa hàng...</p>
            </div>
          ) : shopProfile ? (
            <div className="w-full">
              {/* Cover Image */}
              <div className="relative w-full h-[240px] bg-gray-100">
                {shopProfile.coverImage ? (
                  <img
                    src={shopProfile.coverImage}
                    alt="Cover"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-r from-slate-800 to-purple-950 flex items-center justify-center text-gray-400 text-sm font-semibold">
                    Nhãn hàng chưa tải lên ảnh bìa
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-gray-50 pointer-events-none"></div>
              </div>

              {/* Main Content Area */}
              <div className="max-w-[1400px] mx-auto px-6 relative z-10">
                {/* Shop Card */}
                <div className="bg-white rounded-3xl shadow-lg p-6 lg:p-8 mb-6 relative z-10 -mt-20 border border-gray-100">
                  <div className="flex flex-col lg:flex-row gap-8 items-center lg:items-start">
                    {/* Logo/Avatar */}
                    <div className="w-36 h-36 rounded-full p-1.5 bg-white shadow-xl flex-shrink-0 relative border-4 border-white lg:-mt-20 overflow-hidden bg-gray-100 flex items-center justify-center">
                      {shopProfile.mainImage ? (
                        <img
                          src={shopProfile.mainImage}
                          alt="Logo"
                          className="w-full h-full object-cover rounded-full"
                        />
                      ) : (
                        <Store className="w-14 h-14 text-gray-400" />
                      )}
                    </div>

                    {/* Info Column */}
                    <div className="flex-1 flex flex-col gap-4 w-full">
                      {/* Name */}
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                        <div className="flex items-center gap-2 justify-center lg:justify-start">
                          <h2 className="text-3xl font-black text-gray-900 text-center lg:text-left leading-none">
                            {shopProfile.shopName}
                          </h2>
                          <span className="inline-flex items-center justify-center w-6 h-6 bg-purple-600 rounded-full text-white text-xs font-bold shrink-0 shadow-sm">✓</span>
                        </div>
                      </div>

                      {/* Plan and Location */}
                      <div className="flex flex-col lg:flex-row lg:items-center gap-4 text-center lg:text-left">
                        <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
                          {shopProfile.plan === "FREE"
                            ? "🆓 Gói Thành viên Miễn phí"
                            : "💎 Đối tác liên kết Premium"}
                        </p>
                        <span className="hidden lg:inline text-gray-300">|</span>
                        <div className="flex items-center gap-2 text-sm text-gray-500 font-medium justify-center lg:justify-start">
                          <MapPin className="w-4 h-4 text-purple-500" />
                          <span>{shopProfile.address || "Chưa cập nhật địa chỉ"}</span>
                        </div>
                      </div>

                      {/* Row 3: Stats and Badges */}
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pt-4 border-t border-gray-100 mt-2">
                        <div className="flex items-center gap-6 justify-center lg:justify-start">
                          <div className="flex items-center gap-1.5 whitespace-nowrap">
                            {getRatingStars(shopProfile.averageRating)}
                            <span className="text-lg font-black text-gray-900 ml-1">
                              {shopProfile.averageRating
                                ? shopProfile.averageRating.toFixed(1)
                                : "0.0"}
                            </span>
                            <span className="text-xs text-gray-400">
                              ({shopProfile.totalJobs || 0} đánh giá)
                            </span>
                          </div>
                          <div className="flex items-center gap-2 whitespace-nowrap">
                            <Users className="w-5 h-5 text-gray-400" />
                            <span className="text-lg font-black text-gray-900">
                              {shopProfile.connects || 0}
                            </span>
                            <span className="text-xs text-gray-400">Kết nối</span>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2 justify-center lg:justify-start">
                          {shopProfile.categories?.length > 0 ? (
                            shopProfile.categories.map((cat, idx) => (
                              <span
                                key={idx}
                                className="px-3 py-1.5 bg-purple-50 text-purple-600 font-bold text-xs rounded-full border border-purple-100 whitespace-nowrap"
                              >
                                {cat}
                              </span>
                            ))
                          ) : (
                            <span className="text-xs text-gray-400 italic">Chưa chọn danh mục</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2-Column Responsive Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-x-6 gap-y-4">
                  {/* Left Column: Quick Info */}
                  <div className="lg:col-span-3">
                    <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm h-full flex flex-col justify-between gap-4">
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                            Thông tin nhãn hàng
                          </h3>
                          <span className="bg-green-50 text-green-600 text-[10px] font-bold px-2 py-1 rounded-md flex items-center gap-1 border border-green-200">
                            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                            Active
                          </span>
                        </div>
                        <p className="text-[10px] text-gray-400 mb-3">
                          Thông số hệ thống cập nhật tự động
                        </p>
                        <div className="space-y-2.5">
                          <div className="flex items-center justify-between text-xs">
                            <span className="flex items-center gap-2 text-gray-500">
                              <Clock className="w-4 h-4" /> Trái Tim
                            </span>
                            <span className="font-bold text-gray-900">
                              {shopProfile.hearts || 0} ❤️
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-xs">
                            <span className="flex items-center gap-2 text-gray-500">
                              <CheckCircle2 className="w-4 h-4" /> Chiến dịch
                            </span>
                            <span className="font-bold text-gray-900">
                              {shopProfile.totalJobs || 0} bài
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-xs">
                            <span className="flex items-center gap-2 text-gray-500">
                              <Phone className="w-4 h-4" /> Điện thoại
                            </span>
                            <span className="font-bold text-purple-600">
                              {shopProfile.phone || "Chưa cập nhật"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Bio description */}
                  <div className="lg:col-span-9">
                    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm h-full flex flex-col justify-between gap-2">
                      <div>
                        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                          Giới thiệu nhãn hàng & Sản phẩm
                        </h3>
                        <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                          {shopProfile.description || "Thương hiệu chưa cập nhật phần mô tả."}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Left Column 2: Social media */}
                  <div className="lg:col-span-3">
                    <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm space-y-4 h-full">
                      <div>
                        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
                          Liên kết Shop
                        </h3>
                        <div className="space-y-2">
                          {[
                            { key: "website", icon: "🌐", name: "Website URL", value: shopProfile.website },
                            { key: "instagram", icon: "📸", name: "Instagram", value: shopProfile.instagram },
                            { key: "phone", icon: "📞", name: "Số điện thoại", value: shopProfile.phone }
                          ].map((s) => (
                            <div
                              key={s.key}
                              className="flex items-center justify-between py-1.5 px-3 rounded-xl bg-gray-50 transition group"
                            >
                              <div className="flex items-center gap-3">
                                <span className="text-base">{s.icon}</span>
                                <span className="font-bold text-xs text-gray-700">{s.name}</span>
                              </div>
                              <div>
                                {s.value ? (
                                  <a
                                    href={
                                      s.key === "website"
                                        ? s.value
                                        : s.key === "instagram"
                                        ? s.value.startsWith("http")
                                          ? s.value
                                          : `https://instagram.com/${s.value.replace("@", "")}`
                                        : `tel:${s.value}`
                                    }
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-[10px] font-bold text-purple-600 bg-purple-50 px-2.5 py-1 rounded hover:bg-purple-100 transition no-underline"
                                  >
                                    Xem
                                  </a>
                                ) : (
                                  <span className="text-[10px] text-gray-400 font-bold">Chưa có</span>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Column 2: Gallery Showroom */}
                  <div className="lg:col-span-9">
                    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm h-full flex flex-col justify-between gap-4">
                      <div>
                        <h2 className="text-lg font-bold text-gray-950">
                          Bộ sưu tập hình ảnh & Showroom
                        </h2>
                        <p className="text-xs text-gray-400 mt-1 mb-4">
                          Showroom, văn phòng, nhà xưởng hoặc ảnh sản phẩm nổi bật
                        </p>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                          {shopProfile.gallery?.slice(0, 8).map((img, idx) => (
                            <div
                              key={idx}
                              className="relative rounded-xl overflow-hidden aspect-[10/9] group bg-gray-100 border border-gray-200 cursor-zoom-in"
                              onClick={() => setLightboxImage(img)}
                            >
                              <img
                                src={img}
                                alt={`Gallery ${idx}`}
                                className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                              />
                            </div>
                          ))}
                          {(!shopProfile.gallery || shopProfile.gallery.length === 0) && (
                            <div className="col-span-full py-8 border border-dashed border-gray-200 rounded-xl text-center text-gray-400 text-sm">
                              Chưa có hình ảnh nào trong bộ sưu tập.
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Left Column 3: Vibe */}
                  <div className="lg:col-span-3">
                    <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm h-full flex flex-col justify-between gap-4">
                      <div>
                        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                          <Sparkles size={14} className="text-purple-500" /> Vibe & Sáng Tạo
                        </h3>
                        <p className="text-xs text-gray-700 leading-relaxed font-semibold">
                          {shopProfile.vibeText || "Chưa cập nhật phong cách sáng tạo."}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Right Column 3: Reviews */}
                  <div className="lg:col-span-9">
                    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm h-full flex flex-col justify-between gap-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                          Đánh giá từ KOC / KOL
                        </h3>
                      </div>
                      <div className="flex items-center gap-2">
                        {getRatingStars(shopProfile.averageRating)}
                        <span className="text-sm font-black text-gray-900 ml-1">
                          {shopProfile.averageRating ? shopProfile.averageRating.toFixed(1) : "0.0"}
                        </span>
                        <span className="text-xs text-gray-400">
                          ({shopProfile.totalJobs || 0} đánh giá)
                        </span>
                      </div>
                      <div className="space-y-4">
                        <div className="py-8 text-center text-gray-400 text-sm">
                          Chưa có đánh giá nào từ KOC / KOL.
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="py-20 text-center text-sm text-gray-500 font-semibold">
              Lỗi: Không tìm thấy thông tin cửa hàng.
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-gray-150 bg-gray-50 flex justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-white border border-gray-200 text-gray-700 text-sm font-bold rounded-xl hover:bg-gray-100 transition cursor-pointer"
          >
            Đóng lại
          </button>
        </div>
      </div>

      {/* Gallery Image Lightbox */}
      {lightboxImage && (
        <div
          className="fixed inset-0 z-[300] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 cursor-zoom-out"
          onClick={() => setLightboxImage(null)}
        >
          <button
            className="absolute top-6 right-6 w-12 h-12 bg-white/10 hover:bg-white/20 text-white rounded-full flex items-center justify-center transition backdrop-blur-md cursor-pointer border-none"
            onClick={() => setLightboxImage(null)}
          >
            <X className="w-6 h-6" />
          </button>
          <img
            src={lightboxImage}
            alt="Lightbox Preview"
            className="max-w-full max-h-[90vh] object-contain rounded-2xl shadow-2xl cursor-default"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
}
