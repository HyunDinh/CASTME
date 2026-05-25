"use client";
import React, { useState, useEffect } from "react";
import { getCreatorProfile, updateCreatorProfile } from "#/app/(creator)/profile/actions";

export default function PortfolioPage() {
  const [bio, setBio] = useState("");
  const [selectedStyles, setSelectedStyles] = useState([]);
  const [portfolioUrl, setPortfolioUrl] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const stylePool = [
    "Streetwear", "Y2K", "Vintage", "Retro", "Minimalism", 
    "Chữa lành", "Mộc mạc", "Unisex", "Hàn Quốc", "Cá tính", "GenZ"
  ];

  // Lấy dữ liệu profile từ backend
  const fetchProfile = async () => {
    setIsLoading(true);
    const result = await getCreatorProfile();
    
    if (result.success) {
      setBio(result.data.bio || "");
      setSelectedStyles(result.data.styles || []);
      setPortfolioUrl(result.data.portfolioUrl || "");
    } else {
      console.error(result.error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const toggleStyle = (style) => {
    if (selectedStyles.includes(style)) {
      setSelectedStyles(selectedStyles.filter((s) => s !== style));
    } else {
      setSelectedStyles([...selectedStyles, style]);
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    const result = await updateCreatorProfile({
      bio,
      styles: selectedStyles,
      portfolioUrl,
    });

    if (result.success) {
      alert("✅ Hồ sơ đã được cập nhật! Hệ thống AI đang đồng bộ lại Matching.");
    } else {
      alert(`❌ ${result.error}`);
    }

    setIsSaving(false);
  };

  if (isLoading) {
    return (
      <div className="max-w-3xl py-20 text-center">
        <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="mt-4 text-gray-500">Đang tải hồ sơ...</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl space-y-8">
      <div>
        <h1 className="text-2xl font-black text-gray-950">Hồ sơ năng lực (Portfolio)</h1>
        <p className="text-xs text-gray-500">Cập nhật gu thời trang và mạng xã hội để AI tối ưu hóa việc matching công việc.</p>
      </div>

      <form onSubmit={handleSaveProfile} className="bg-white border border-gray-100 rounded-2xl p-6 md:p-8 shadow-xs space-y-6">
        {/* Mô tả bản thân */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider">
            Mô tả bản thân & Gu sáng tạo
          </label>
          <textarea
            rows={5}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 bg-gray-50/50"
            placeholder="Hãy viết đoạn giới thiệu phong cách của bạn..."
            required
          />
        </div>

        {/* Phong cách */}
        <div className="space-y-3">
          <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider">
            Định hình phong cách (Vibe của bạn)
          </label>
          <p className="text-xs text-gray-400">Chọn các tag thể hiện đúng bản sắc nhất</p>
          
          <div className="flex flex-wrap gap-2">
            {stylePool.map((style) => {
              const isSelected = selectedStyles.includes(style);
              return (
                <button
                  key={style}
                  type="button"
                  onClick={() => toggleStyle(style)}
                  className={`px-4 py-2 text-sm font-medium rounded-2xl border transition cursor-pointer ${
                    isSelected
                      ? "bg-purple-600 border-purple-600 text-white"
                      : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  {isSelected ? `✓ ${style}` : style}
                </button>
              );
            })}
          </div>
        </div>

        {/* Portfolio URL */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider">
            Link Portfolio / Kênh MXH
          </label>
          <div className="flex bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus-within:border-purple-500 focus-within:bg-white transition">
            <span className="text-gray-400 mr-2">🔗</span>
            <input
              type="text"
              value={portfolioUrl}
              onChange={(e) => setPortfolioUrl(e.target.value)}
              className="bg-transparent w-full focus:outline-none text-sm"
              placeholder="instagram.com/username hoặc tiktok.com/@username"
              required
            />
          </div>
        </div>

        {/* Feedback (tạm giữ mock) */}
        <div className="space-y-3 pt-4 border-t border-gray-100">
          <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider">
            Đánh giá từ đối tác
          </label>
          <div className="bg-gray-50 border border-gray-100 rounded-xl p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold">🏪 Savage Studio</span>
              <span className="text-amber-500 font-bold">⭐⭐⭐⭐⭐</span>
            </div>
            <p className="text-sm text-gray-600 italic">
              "KOL làm việc rất chuyên nghiệp, hình ảnh đẹp và đúng deadline."
            </p>
          </div>
        </div>

        <button
          type="submit"
          disabled={isSaving}
          className="w-full py-3.5 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-2xl transition disabled:bg-gray-400"
        >
          {isSaving ? "Đang cập nhật & Đồng bộ AI..." : "Cập nhật hồ sơ & Đồng bộ AI"}
        </button>
      </form>
    </div>
  );
}