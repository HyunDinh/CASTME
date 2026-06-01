"use client";
import React, { useState, useEffect } from "react";
import { getShopProfile, updateShopProfile } from "#/app/(shop)/shop-profile/actions";

export default function ShopProfilePage() {
  const [shopName, setShopName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [vibeText, setVibeText] = useState("");
  const [website, setWebsite] = useState("");
  const [instagram, setInstagram] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [plan, setPlan] = useState("FREE");
  const [hearts, setHearts] = useState(0);
  const [connects, setConnects] = useState(0);
  const [averageRating, setAverageRating] = useState(0);
  const [totalJobs, setTotalJobs] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const categoryPool = [
    "Thời trang", "Mỹ phẩm", "Phụ kiện", "Điện tử", 
    "Gia dụng", "Thực phẩm", "Mẹ & Bé", "Thể thao", "Sách", "Khác"
  ];

  // Lấy dữ liệu profile từ backend
  const fetchProfile = async () => {
    setIsLoading(true);
    const result = await getShopProfile();
    
    if (result.success) {
      setShopName(result.data.shopName || "");
      setDescription(result.data.description || "");
      setSelectedCategories(result.data.categories || []);
      setVibeText(result.data.vibeText || "");
      setWebsite(result.data.website || "");
      setInstagram(result.data.instagram || "");
      setPhone(result.data.phone || "");
      setAddress(result.data.address || "");
      setPlan(result.data.plan || "FREE");
      setHearts(result.data.hearts || 0);
      setConnects(result.data.connects || 0);
      setAverageRating(result.data.averageRating || 0);
      setTotalJobs(result.data.totalJobs || 0);
    } else {
      console.error(result.error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const toggleCategory = (category) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter((c) => c !== category));
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    const result = await updateShopProfile({
      shopName,
      description,
      categories: selectedCategories,
      vibeText,
      website,
      instagram,
      phone,
      address,
    });

    if (result.success) {
      alert("✅ Hồ sơ cửa hàng đã được cập nhật! Hệ thống AI đang đồng bộ lại Matching.");
    } else {
      alert(`❌ ${result.error}`);
    }

    setIsSaving(false);
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl py-20 text-center">
        <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="mt-4 text-gray-500">Đang tải hồ sơ cửa hàng...</p>
      </div>
    );
  }

  const getRatingStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= Math.round(rating)) {
        stars.push("⭐");
      } else if (i - rating < 1 && i - rating > 0) {
        stars.push("✨");
      }
    }
    return stars.join("") || "Chưa có đánh giá";
  };

  return (
    <div className="max-w-4xl space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black text-gray-950">Hồ sơ Cửa Hàng</h1>
        <p className="text-sm text-gray-500 mt-2">Cập nhật thông tin cửa hàng để Creator tìm kiếm và đề xuất công việc phù hợp với phong cách của bạn.</p>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-xl p-4">
          <div className="text-2xl font-bold text-purple-600">{hearts}</div>
          <p className="text-xs text-gray-600 mt-1">💜 Trái Tim</p>
        </div>
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-4">
          <div className="text-2xl font-bold text-blue-600">{connects}</div>
          <p className="text-xs text-gray-600 mt-1">🔗 Kết Nối</p>
        </div>
        <div className="bg-gradient-to-br from-amber-50 to-amber-100 border border-amber-200 rounded-xl p-4">
          <div className="text-2xl font-bold text-amber-600">{totalJobs}</div>
          <p className="text-xs text-gray-600 mt-1">📋 Công Việc</p>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-xl p-4">
          <div className="text-lg font-bold text-green-600">{getRatingStars(averageRating)}</div>
          <p className="text-xs text-gray-600 mt-1">⭐ Đánh Giá</p>
        </div>
      </div>

      {/* Main Form */}
      <form onSubmit={handleSaveProfile} className="bg-white border border-gray-100 rounded-2xl p-6 md:p-8 shadow-xs space-y-6">
        
        {/* Tên cửa hàng & Gói cước */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider">
              Tên Cửa Hàng *
            </label>
            <input
              type="text"
              value={shopName}
              onChange={(e) => setShopName(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 bg-gray-50/50"
              placeholder="Ví dụ: Savage Studio, Fashion Vibes..."
              required
            />
          </div>
          
          <div className="space-y-2">
            <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider">
              Gói Cước
            </label>
            <div className="bg-purple-50 border border-purple-200 rounded-xl px-4 py-3 text-sm font-semibold text-purple-700">
              {plan === "FREE" && "🆓 Gói Free"}
              {plan === "PRO" && "⭐ Gói Pro"}
              {plan === "ULTRA" && "💎 Gói Ultra"}
            </div>
          </div>
        </div>

        {/* Mô tả cửa hàng */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider">
            Mô Tả Cửa Hàng & Phong Cách *
          </label>
          <textarea
            rows={5}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 bg-gray-50/50"
            placeholder="Mô tả chi tiết về thương hiệu, phong cách sản phẩm, đối tượng khách hàng của bạn..."
            required
          />
        </div>

        {/* Vibe Text */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider">
            Vibe & Định Hướng Sáng Tạo
          </label>
          <textarea
            rows={3}
            value={vibeText}
            onChange={(e) => setVibeText(e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 bg-gray-50/50"
            placeholder="Nói về vibe mong muốn, style ảnh/video, tone chữ, v.v. (AI sẽ dùng để matching Creator phù hợp)"
          />
        </div>

        {/* Danh mục sản phẩm */}
        <div className="space-y-3">
          <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider">
            Danh Mục Sản Phẩm
          </label>
          <p className="text-xs text-gray-400">Chọn danh mục để Creator dễ tìm kiếm công việc phù hợp</p>
          
          <div className="flex flex-wrap gap-2">
            {categoryPool.map((category) => {
              const isSelected = selectedCategories.includes(category);
              return (
                <button
                  key={category}
                  type="button"
                  onClick={() => toggleCategory(category)}
                  className={`px-4 py-2 text-sm font-medium rounded-2xl border transition cursor-pointer ${
                    isSelected
                      ? "bg-purple-600 border-purple-600 text-white"
                      : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  {isSelected ? `✓ ${category}` : category}
                </button>
              );
            })}
          </div>
        </div>

        {/* Thông tin liên hệ */}
        <div className="space-y-3 pt-4 border-t border-gray-100">
          <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider">
            Thông Tin Liên Hệ & Liên Kết
          </label>
          
          <div className="space-y-4">
            {/* Phone */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-gray-600">📞 Số Điện Thoại</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 bg-gray-50/50"
                placeholder="Ví dụ: +84 123 456 789"
              />
            </div>

            {/* Address */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-gray-600">📍 Địa Chỉ</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 bg-gray-50/50"
                placeholder="Ví dụ: 123 Đường ABC, Quận 1, TP.HCM"
              />
            </div>

            {/* Website */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-gray-600">🌐 Website</label>
              <div className="flex bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus-within:border-purple-500 focus-within:bg-white transition">
                <span className="text-gray-400 mr-2">🔗</span>
                <input
                  type="url"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  className="bg-transparent w-full focus:outline-none text-sm"
                  placeholder="https://example.com"
                />
              </div>
            </div>

            {/* Instagram */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-gray-600">📸 Instagram</label>
              <div className="flex bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus-within:border-purple-500 focus-within:bg-white transition">
                <span className="text-gray-400 mr-2">@</span>
                <input
                  type="text"
                  value={instagram}
                  onChange={(e) => setInstagram(e.target.value)}
                  className="bg-transparent w-full focus:outline-none text-sm"
                  placeholder="instagram.com/username hoặc @username"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Nút lưu */}
        <button
          type="submit"
          disabled={isSaving}
          className="w-full py-3.5 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-2xl transition disabled:bg-gray-400"
        >
          {isSaving ? "Đang cập nhật & Đồng bộ AI..." : "Lưu Hồ Sơ & Đồng Bộ AI"}
        </button>
      </form>

      {/* Thông tin bổ sung */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-100 rounded-2xl p-6">
        <h3 className="font-bold text-gray-900 mb-3">💡 Mẹo Cập Nhật Hồ Sơ Tốt</h3>
        <ul className="space-y-2 text-sm text-gray-700">
          <li>✅ Mô tả chi tiết phong cách của cửa hàng sẽ giúp AI matching tốt hơn</li>
          <li>✅ Thêm link Instagram/Website để Creator có thể xem portfolio của bạn</li>
          <li>✅ Cập nhật Vibe sáng tạo để tìm Creator phù hợp nhất</li>
          <li>✅ Hệ thống sẽ tự động cập nhật Đánh Giá dựa trên feedback từ Creator</li>
        </ul>
      </div>
    </div>
  );
}
