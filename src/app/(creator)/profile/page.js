// src/app/(creator)/portfolio/page.js
"use client";
import { useState } from "react";

export default function PortfolioPage() {
  const [bio, setBio] = useState(
    "Mình là một KOC mảng thời trang đường phố (Streetwear). Thế mạnh là tự phối đồ phối cảnh, có gu chụp ảnh ngoại cảnh đô thị bụi bặm và làm short-video reels TikTok bắt trend cực nhanh."
  );
  const [selectedStyles, setSelectedStyles] = useState(["Streetwear", "Y2K", "Cá tính"]);
  const [portfolioUrl, setPortfolioUrl] = useState("instagram.com/koc_savage_9x");
  const [isSaving, setIsSaving] = useState(false);

  const stylePool = ["Streetwear", "Y2K", "Vintage", "Retro", "Minimalism", "Chữa lành", "Mộc mạc", "Unisex", "Hàn Quốc"];

  const toggleStyle = (style) => {
    if (selectedStyles.includes(style)) {
      setSelectedStyles(selectedStyles.filter((s) => s !== style));
    } else {
      setSelectedStyles([...selectedStyles, style]);
    }
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      alert("Hồ sơ phong cách đã được lưu! Hệ thống AI đang cập nhật lại tỷ lệ Matching của bạn với tất cả các Job hiện hành.");
    }, 1000);
  };

  return (
    <div className="max-w-3xl space-y-8">
      <div>
        <h1 className="text-2xl font-black text-gray-950">Hồ sơ năng lực (Portfolio)</h1>
        <p className="text-xs text-gray-500">Cập nhật gu thời trang, mạng xã hội để AI tối ưu hóa tỷ lệ phân phối công việc tương thích.</p>
      </div>

      <form onSubmit={handleSaveProfile} className="bg-white border border-gray-100 rounded-2xl p-6 md:p-8 shadow-xs space-y-6">
        {/* Phần 1: Giới thiệu bản thân */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider">Mô tả bản thân & Gu sáng tạo</label>
          <textarea
            rows={4}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 bg-gray-50/50"
            placeholder="Hãy viết một đoạn ngắn giới thiệu phong cách độc bản của bạn để AI đọc..."
            required
          />
        </div>

        {/* Phần 2: Gắn thẻ phong cách chủ đạo (AI MATCH DATA) */}
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider">Định hình phong cách (Vibe của bạn)</label>
            <p className="text-xs text-gray-400 mt-0.5">Chọn các tag thể hiện đúng bản sắc của bạn nhất (AI dùng để matching với Shop).</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {stylePool.map((style) => {
              const isSelected = selectedStyles.includes(style);
              return (
                <button
                  key={style}
                  type="button"
                  onClick={() => toggleStyle(style)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-xl border transition cursor-pointer ${
                    isSelected
                      ? "bg-purple-600 border-purple-600 text-white font-bold shadow-xs shadow-purple-200"
                      : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  {isSelected ? `✓ ${style}` : style}
                </button>
              );
            })}
          </div>
        </div>

        {/* Phần 3: Liên kết Portfolio thực tế */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider">Link Kênh MXH hoặc Portfolio (Instagram / TikTok)</label>
          <div className="flex bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 focus-within:border-purple-500 focus-within:bg-white transition">
            <span className="text-gray-400 text-sm mr-2 select-none">🔗</span>
            <input
              type="text"
              value={portfolioUrl}
              onChange={(e) => setPortfolioUrl(e.target.value)}
              className="bg-transparent text-sm w-full focus:outline-none"
              placeholder="instagram.com/username"
              required
            />
          </div>
        </div>

        <hr className="border-gray-100" />

        {/* Phần 4: Đánh giá (Feedback) từ các Shop (Chế độ chỉ đọc) */}
        <div className="space-y-3">
          <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider">Đánh giá từ đối tác (Feedback)</label>
          <div className="bg-gray-50 border border-gray-100 rounded-xl p-4">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-sm font-bold text-gray-800">🏪 Savage Studio</span>
              <span className="text-xs text-amber-500 font-bold">⭐⭐⭐⭐⭐ 5/5</span>
            </div>
            <p className="text-xs text-gray-600 italic leading-relaxed">
              "KOL làm việc cực kỳ đúng giờ, sản phẩm hình ảnh nét và lên đồ chuẩn phong cách Y2K bụi bặm bên mình yêu cầu. Sẽ tiếp tục booking dài hạn!"
            </p>
          </div>
        </div>

        {/* Nút bấm lưu cấu hình */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isSaving}
            className="w-full md:w-auto px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold text-sm rounded-xl shadow-md shadow-purple-100 transition cursor-pointer disabled:bg-gray-400"
          >
            {isSaving ? "Đang xử lý AI..." : "Cập nhật hồ sơ & Đồng bộ AI"}
          </button>
        </div>
      </form>
    </div>
  );
}