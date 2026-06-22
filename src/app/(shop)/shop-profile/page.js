"use client";
import React, { useState, useEffect } from "react";
import { getShopProfile, updateShopProfile } from "#/app/(shop)/shop-profile/actions";
import { CldUploadWidget } from "next-cloudinary";

export default function ShopProfilePage() {
  // State thông tin cơ bản
  const [shopName, setShopName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [vibeText, setVibeText] = useState("");
  const [website, setWebsite] = useState("");
  const [instagram, setInstagram] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  // State thông số hệ thống
  const [plan, setPlan] = useState("FREE");
  const [hearts, setHearts] = useState(0);
  const [connects, setConnects] = useState(0);
  const [averageRating, setAverageRating] = useState(0);
  const [totalJobs, setTotalJobs] = useState(0);

  // ─── STATE MỚI CHO HÌNH ẢNH ───
  const [mainImage, setMainImage] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [gallery, setGallery] = useState([]);
  const [newImageLink, setNewImageLink] = useState(""); // Dành cho input dán link thủ công
  const [imageToDelete, setImageToDelete] = useState(null); // Quản lý index ảnh cần xóa
  const [savingField, setSavingField] = useState(null); // Quản lý trạng thái đang lưu của từng phần ('cover', 'main', 'gallery')

  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const categoryPool = [
    "Thời trang", "Mỹ phẩm", "Phụ kiện", "Điện tử",
    "Gia dụng", "Thực phẩm", "Mẹ & Bé", "Thể thao", "Sách", "Khác"
  ];

  const fetchProfile = async () => {
    setIsLoading(true);
    const result = await getShopProfile();

    if (result.success) {
      setShopName(result.data.shopName || "");
      setDescription(result.data.description || "");
      setSelectedCategories(result.data.categories || []);
      
      // 👇 SỬA DÒNG NÀY: Bỏ đoạn "vibeText &&" ở đầu đi
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
      
      // Đổ dữ liệu ảnh từ DB vào State
      setMainImage(result.data.mainImage || "");
      setCoverImage(result.data.coverImage || "");
      setGallery(result.data.gallery || []);
    } else {
      console.error(result.error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  // Hàm tự động lưu riêng phần hình ảnh ngay khi upload xong
  const handlePartialSave = async (fieldName, updates) => {
    setSavingField(fieldName);

    // Cập nhật State cục bộ ngay lập tức trước khi gửi để Form tổng đồng bộ
    if (updates.mainImage) setMainImage(updates.mainImage);
    if (updates.coverImage) setCoverImage(updates.coverImage);
    if (updates.gallery) setGallery(updates.gallery);

    const payload = {
      shopName, description, categories: selectedCategories, vibeText, website, instagram, phone, address,
      mainImage, coverImage, gallery, // State cũ
      ...updates // Đè dữ liệu ảnh mới lên
    };

    const result = await updateShopProfile(payload);
    if (!result.success) {
      alert(`❌ Lỗi khi lưu ảnh: ${result.error}`);
    } else {
      // Nếu thành công, gọi lại fetchProfile() để nạp data chuẩn từ DB về Client State cho chắc chắn
      await fetchProfile();
    }
    setSavingField(null);
  };

  // Thêm ảnh vào bộ sưu tập
  const handleAddGalleryImage = async (url) => {
    const cleanUrl = url || newImageLink.trim();
    if (!cleanUrl) return;

    const newGallery = [cleanUrl, ...gallery];
    setGallery(newGallery);
    setNewImageLink("");
    await handlePartialSave("gallery", { gallery: newGallery });
  };

  // Xác nhận xóa ảnh trong bộ sưu tập
  const handleDeleteGalleryImage = async () => {
    if (imageToDelete === null) return;
    const newGallery = gallery.filter((_, idx) => idx !== imageToDelete);
    setGallery(newGallery);
    setImageToDelete(null);
    await handlePartialSave("gallery", { gallery: newGallery });
  };

  const toggleCategory = (category) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter((c) => c !== category));
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  };

  // Lưu form tổng (Cho các trường text/chữ thông thường)
  // Sửa lại hàm này trong page.js của Shop:
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    // Gửi chính xác các State ảnh hiện tại lên để tránh bị ghi đè chuỗi rỗng
    const result = await updateShopProfile({
      shopName,
      description,
      categories: selectedCategories,
      vibeText,
      website,
      instagram,
      phone,
      address,
      mainImage,   // 👈 Đảm bảo truyền đúng State đang hiển thị
      coverImage,  // 👈 Đảm bảo truyền đúng State đang hiển thị
      gallery      // 👈 Đảm bảo truyền đúng State đang hiển thị
    });

    if (result.success) {
      alert("✅ Hồ sơ cửa hàng đã được cập nhật! Hệ thống AI đang đồng bộ lại Matching.");
      // Tải lại dữ liệu chuẩn từ DB để đồng bộ hoàn toàn State
      await fetchProfile();
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
      if (i <= Math.round(rating)) stars.push("⭐");
    }
    return stars.join("") || "Chưa có đánh giá";
  };

  return (
    <div className="max-w-4xl space-y-8 relative pb-12">

      {/* ─── KHU VỰC QUẢN LÝ ẢNH BÌA & ẢNH ĐẠI DIỆN ─── */}
      <div className="relative rounded-2xl overflow-hidden border border-gray-100 bg-gray-100">
        {/* Ảnh bìa */}
        <div className="h-48 md:h-64 bg-slate-200 relative group">
          {coverImage ? (
            <img src={coverImage} alt="Cover" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">Chưa có ảnh bìa</div>
          )}

          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2">
            <CldUploadWidget
              uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "default_preset"}
              onSuccess={(result) => {
                const url = result?.info?.secure_url;
                setCoverImage(url);
                handlePartialSave("cover", { coverImage: url });
              }}
            >
              {({ open }) => (
                <button type="button" onClick={() => open()} className="px-4 py-2 bg-white/90 hover:bg-white text-gray-800 font-semibold rounded-xl text-xs shadow-xs cursor-pointer">
                  {savingField === "cover" ? "🔄 Đang lưu..." : "📷 Đổi ảnh bìa"}
                </button>
              )}
            </CldUploadWidget>
          </div>
        </div>

        {/* Khối chứa ảnh đại diện nằm đè lên góc ảnh bìa */}
        <div className="px-6 pb-6 pt-16 relative flex flex-col md:flex-row md:items-end justify-between gap-4 bg-white">
          <div className="absolute -top-16 left-6 w-28 h-28 md:w-32 md:h-32 rounded-2xl border-4 border-white bg-gray-50 overflow-hidden shadow-md group">
            {mainImage ? (
              <img src={mainImage} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-300 text-xs text-center p-2 bg-gray-100">Chưa có Logo</div>
            )}
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
              <CldUploadWidget
                uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "default_preset"}
                onSuccess={(result) => {
                  const url = result?.info?.secure_url;
                  setMainImage(url);
                  handlePartialSave("main", { mainImage: url });
                }}
              >
                {({ open }) => (
                  <button type="button" onClick={() => open()} className="text-[10px] bg-white text-gray-900 px-2 py-1 rounded-md font-bold cursor-pointer">
                    {savingField === "main" ? "..." : "Thay ảnh"}
                  </button>
                )}
              </CldUploadWidget>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-black text-gray-900">{shopName || "Tên Cửa Hàng Của Bạn"}</h2>
            <p className="text-xs text-purple-600 font-semibold mt-0.5">{plan === "FREE" ? "🆓 Thành viên miễn phí" : "💎 Đối tác liên kết Premium"}</p>
          </div>
        </div>
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

      {/* ─── KHU VỰC BỘ SƯU TẬP ẢNH SHOP (GALLERY) ─── */}
      <div className="bg-white border border-gray-100 rounded-2xl p-6 md:p-8 space-y-4">
        <div>
          <h3 className="text-base font-bold text-gray-900">Bộ Sưu Tập Không Gian & Sản Phẩm</h3>
          <p className="text-xs text-gray-400 mt-1">Đăng tải hình ảnh về showroom, văn phòng làm việc hoặc sản phẩm mẫu để tạo uy tín với Creator.</p>
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            value={newImageLink}
            onChange={(e) => setNewImageLink(e.target.value)}
            placeholder="Dán URL hình ảnh vào đây hoặc bấm Tải ảnh lên..."
            className="flex-1 text-sm px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-purple-500"
          />
          <button type="button" onClick={() => handleAddGalleryImage(null)} className="px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white rounded-xl text-sm font-semibold cursor-pointer">
            Thêm Link
          </button>

          <CldUploadWidget
            uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "default_preset"}
            onSuccess={(result) => {
              const url = result?.info?.secure_url;
              handleAddGalleryImage(url);
            }}
          >
            {({ open }) => (
              <button type="button" onClick={() => open()} className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-sm font-semibold cursor-pointer">
                {savingField === "gallery" ? "🔄 Đang lưu..." : "📤 Tải ảnh lên"}
              </button>
            )}
          </CldUploadWidget>
        </div>

        {/* Lưới ảnh hiển thị bộ sưu tập */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 pt-2">
          {gallery.map((imgUrl, index) => (
            <div key={index} className="aspect-square rounded-xl bg-gray-50 border border-gray-100 overflow-hidden relative group">
              <img src={imgUrl} alt={`Gallery-${index}`} className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => setImageToDelete(index)}
                className="absolute top-2 right-2 w-7 h-7 bg-red-600 text-white font-bold rounded-full text-xs opacity-0 group-hover:opacity-100 transition shadow-md flex items-center justify-center cursor-pointer"
              >
                ✕
              </button>
            </div>
          ))}
          {gallery.length === 0 && (
            <div className="col-span-full py-8 border border-dashed border-gray-200 rounded-xl text-center text-gray-400 text-sm">
              Chưa có hình ảnh nào trong bộ sưu tập.
            </div>
          )}
        </div>
      </div>

      {/* Main Form (Thông tin chữ cơ bản) */}
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
                  className={`px-4 py-2 text-sm font-medium rounded-2xl border transition cursor-pointer ${isSelected
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

        {/* Nút lưu thông tin cơ bản */}
        <button
          type="submit"
          disabled={isSaving}
          className="w-full py-3.5 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-2xl transition disabled:bg-gray-400"
        >
          {isSaving ? "Đang cập nhật & Đồng bộ AI..." : "Lưu Hồ Sơ & Đồng Bộ AI"}
        </button>
      </form>

      {/* ─── MODAL XÁC NHẬN XÓA ẢNH TRONG GALLERY ─── */}
      {imageToDelete !== null && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl space-y-4">
            <h4 className="text-base font-bold text-gray-900">Xác nhận xóa hình ảnh?</h4>
            <p className="text-xs text-gray-500">Hành động này không thể hoàn tác và ảnh sẽ bị xóa khỏi bộ sưu tập profile.</p>
            <div className="flex justify-end gap-2 text-sm font-semibold">
              <button type="button" onClick={() => setImageToDelete(null)} className="px-4 py-2 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 cursor-pointer">
                Hủy
              </button>
              <button type="button" onClick={handleDeleteGalleryImage} className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl cursor-pointer">
                Xác nhận xóa
              </button>
            </div>
          </div>
        </div>
      )}

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