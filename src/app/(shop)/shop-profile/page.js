"use client";
import React, { useState, useEffect } from "react";
import { getShopProfile, updateShopProfile } from "#/app/(shop)/shop-profile/actions";
import { CldUploadWidget } from "next-cloudinary";
import {
  Camera,
  Image as ImageIcon,
  Loader2,
  Plus,
  X,
  Save,
  CheckCircle2,
  AlertCircle,
  Bookmark,
  MoreHorizontal,
  MessageSquare,
  Mail,
  Calendar,
  Clock,
  Award,
  Users,
  ChevronDown,
  Check,
  Star,
  Instagram,
  Link2,
  MapPin,
  Phone,
  Globe,
  Store,
  Sparkles
} from "lucide-react";

export default function ShopProfilePage() {
  const [loading, setLoading] = useState(true);
  const [savingField, setSavingField] = useState(null);
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast(prev => ({ ...prev, show: false })), 3000);
  };

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

  // State hình ảnh
  const [mainImage, setMainImage] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [gallery, setGallery] = useState([]);

  // States Modals & Edit
  const [newImageLink, setNewImageLink] = useState("");
  const [isAddingImage, setIsAddingImage] = useState(false);
  const [imageToDelete, setImageToDelete] = useState(null);
  const [isEditingCover, setIsEditingCover] = useState(false);
  const [coverInput, setCoverInput] = useState("");
  const [isEditingAvatar, setIsEditingAvatar] = useState(false);
  const [avatarInput, setAvatarInput] = useState("");
  const [socialModal, setSocialModal] = useState({ isOpen: false, platform: null, link: "" });
  const [descExpanded, setDescExpanded] = useState(false);
  const [vibeExpanded, setVibeExpanded] = useState(false);
  const [savedData, setSavedData] = useState({});

  const categoryPool = [
    "Thời trang", "Mỹ phẩm", "Phụ kiện", "Điện tử",
    "Gia dụng", "Thực phẩm", "Mẹ & Bé", "Thể thao", "Sách", "Khác"
  ];

  const fetchProfile = async () => {
    const result = await getShopProfile();
    if (result.success) {
      const d = result.data;
      setShopName(d.shopName || "");
      setDescription(d.description || "");
      setSelectedCategories(d.categories || []);
      setVibeText(d.vibeText || "");
      setWebsite(d.website || "");
      setInstagram(d.instagram || "");
      setPhone(d.phone || "");
      setAddress(d.address || "");
      setPlan(d.plan || "FREE");
      setHearts(d.hearts || 0);
      setConnects(d.connects || 0);
      setAverageRating(d.averageRating || 0);
      setTotalJobs(d.totalJobs || 0);
      setMainImage(d.mainImage || "https://images.unsplash.com/photo-1531403009284-440f080d1e12?q=80&w=400");
      setCoverImage(d.coverImage || "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=1200");
      setGallery(d.gallery || []);

      setSavedData({
        shopName: d.shopName || "",
        description: d.description || "",
        categories: d.categories || [],
        vibeText: d.vibeText || "",
        website: d.website || "",
        instagram: d.instagram || "",
        phone: d.phone || "",
        address: d.address || "",
        mainImage: d.mainImage || "",
        coverImage: d.coverImage || "",
        gallery: d.gallery || []
      });
    } else {
      console.error(result.error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handlePartialSave = async (fieldName, updates) => {
    setSavingField(fieldName);
    
    // Merge states để tránh bị ghi đè dữ liệu cũ khi state React chưa update kịp
    const payload = {
      shopName: fieldName === 'shopName' ? updates.shopName : shopName,
      description: fieldName === 'description' ? updates.description : description,
      categories: fieldName === 'categories' ? updates.categories : selectedCategories,
      vibeText: fieldName === 'vibeText' ? updates.vibeText : vibeText,
      website: fieldName === 'website' ? updates.website : website,
      instagram: fieldName === 'instagram' ? updates.instagram : instagram,
      phone: fieldName === 'phone' ? updates.phone : phone,
      address: fieldName === 'address' ? updates.address : address,
      mainImage: fieldName === 'mainImage' ? updates.mainImage : mainImage,
      coverImage: fieldName === 'coverImage' ? updates.coverImage : coverImage,
      gallery: fieldName === 'gallery' ? updates.gallery : gallery,
      ...updates
    };

    const result = await updateShopProfile(payload);
    if (result.success) {
      setSavedData(prev => ({ ...prev, ...updates }));
      showToast("Đã lưu thay đổi thành công!", "success");
    } else {
      showToast("Lỗi khi lưu: " + result.error, "error");
    }
    setSavingField(null);
  };

  const renderSaveButton = (fieldKey, value) => {
    if (savedData[fieldKey] === value) return null;
    return (
      <button 
        onClick={() => handlePartialSave(fieldKey, { [fieldKey]: value })} 
        disabled={savingField === fieldKey} 
        className="ml-2 px-2.5 py-1 bg-purple-600 hover:bg-purple-700 text-white text-[10px] font-bold rounded-md shadow-sm transition flex items-center gap-1 shrink-0 cursor-pointer border-none"
      >
        {savingField === fieldKey ? <Loader2 className="w-3 h-3 animate-spin" /> : <Save className="w-3 h-3" />}
        Lưu
      </button>
    );
  };

  const toggleCategory = async (category) => {
    let newCategories = selectedCategories.includes(category) 
      ? selectedCategories.filter(c => c !== category) 
      : [...selectedCategories, category];
    setSelectedCategories(newCategories);
    await handlePartialSave('categories', { categories: newCategories });
  };

  const handleUpdateCover = async (url) => {
    const finalUrl = url || coverInput;
    setCoverImage(finalUrl);
    setIsEditingCover(false);
    await handlePartialSave('coverImage', { coverImage: finalUrl });
  };

  const handleUpdateAvatar = async (url) => {
    const finalUrl = url || avatarInput;
    setMainImage(finalUrl);
    setIsEditingAvatar(false);
    await handlePartialSave('mainImage', { mainImage: finalUrl });
  };

  const handleAddGalleryImage = async (url) => {
    const finalUrl = url || newImageLink.trim();
    if (finalUrl) {
      const newGallery = [finalUrl, ...gallery];
      setGallery(newGallery);
      setNewImageLink("");
      setIsAddingImage(false);
      await handlePartialSave('gallery', { gallery: newGallery });
    }
  };

  const handleDeleteGalleryImage = async () => {
    const newGallery = gallery.filter((_, i) => i !== imageToDelete);
    setGallery(newGallery);
    setImageToDelete(null);
    await handlePartialSave('gallery', { gallery: newGallery });
  };

  const handleUpdateSocial = async () => {
    let finalUpdate = {};
    if (socialModal.platform === "instagram") {
      setInstagram(socialModal.link);
      finalUpdate = { instagram: socialModal.link };
    } else if (socialModal.platform === "website") {
      setWebsite(socialModal.link);
      finalUpdate = { website: socialModal.link };
    } else if (socialModal.platform === "phone") {
      setPhone(socialModal.link);
      finalUpdate = { phone: socialModal.link };
    } else if (socialModal.platform === "address") {
      setAddress(socialModal.link);
      finalUpdate = { address: socialModal.link };
    }
    setSocialModal({ isOpen: false, platform: null, link: "" });
    await handlePartialSave(socialModal.platform, finalUpdate);
  };

  if (loading) {
    return (
      <div className="w-full max-w-5xl mx-auto h-screen flex flex-col items-center justify-center">
        <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-gray-500 font-medium">Đang tải hồ sơ cửa hàng...</p>
      </div>
    );
  }

  const getRatingStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(<Star key={i} className={`w-4 h-4 ${i <= Math.round(rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200'}`} />);
    }
    return stars;
  };

  return (
    <div className="w-full bg-gray-50 min-h-screen">
      {/* Toast Alert */}
      <div className={`fixed top-6 right-6 z-[200] transition-all duration-300 transform ${toast.show ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0 pointer-events-none'}`}>
        <div className={`flex items-center gap-3 px-5 py-4 rounded-2xl shadow-2xl font-bold text-sm text-white ${toast.type === 'success' ? 'bg-gray-900 border border-gray-700' : 'bg-red-600'}`}>
          {toast.type === 'success' ? <CheckCircle2 className="w-5 h-5 text-green-400" /> : <AlertCircle className="w-5 h-5" />}
          {toast.message}
        </div>
      </div>

      {/* Cover Image */}
      <div className="relative w-full h-[280px] group/cover">
        <img src={coverImage} alt="Cover" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-gray-50"></div>
        {!isEditingCover && (
          <div className="absolute bottom-6 right-6 flex gap-2 opacity-0 group-hover/cover:opacity-100 transition-opacity z-10">
            <CldUploadWidget
              uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "default_preset"}
              onSuccess={(result) => {
                const url = result?.info?.secure_url;
                handleUpdateCover(url);
              }}
            >
              {({ open }) => (
                <button type="button" onClick={() => open()} className="bg-black/40 hover:bg-black/60 backdrop-blur-md px-4 py-2.5 rounded-xl text-white font-bold text-sm transition flex items-center gap-2 shadow-lg cursor-pointer border-none">
                  <Camera className="w-4 h-4" /> Tải ảnh bìa
                </button>
              )}
            </CldUploadWidget>
            <button onClick={() => { setCoverInput(coverImage); setIsEditingCover(true); }} className="bg-black/45 hover:bg-black/65 backdrop-blur-md px-3 py-2.5 rounded-xl text-white font-bold text-sm transition flex items-center gap-1 shadow-lg cursor-pointer border-none">
              <Link2 className="w-4 h-4" /> Nhập Link
            </button>
          </div>
        )}
        {isEditingCover && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-20">
            <div className="bg-white p-6 rounded-2xl w-[90%] max-w-md shadow-2xl flex flex-col gap-4">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2"><ImageIcon className="w-5 h-5 text-purple-500" /> Cập nhật ảnh bìa</h3>
              <input autoFocus type="url" value={coverInput} onChange={e => setCoverInput(e.target.value)} placeholder="Dán link Ảnh Bìa..." className="w-full p-3 text-sm border border-gray-300 rounded-xl outline-none focus:border-purple-500 bg-gray-50" onKeyDown={(e) => { if (e.key === 'Enter') handleUpdateCover(); }} />
              <div className="flex gap-2 mt-2">
                <button onClick={() => setIsEditingCover(false)} className="flex-1 bg-gray-100 text-gray-700 font-bold py-3 rounded-xl hover:bg-gray-200 transition cursor-pointer border-none">Hủy</button>
                <button onClick={() => handleUpdateCover()} className="flex-1 bg-purple-600 text-white font-bold py-3 rounded-xl hover:bg-purple-700 transition cursor-pointer border-none">{savingField === 'coverImage' ? <Loader2 className="w-4 h-4 animate-spin" /> : "Lưu"}</button>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="max-w-[1400px] mx-auto px-6 -mt-24 relative z-10 pb-12">
        <div className="bg-white rounded-3xl shadow-lg p-8 mb-6">
          <div className="flex flex-col lg:flex-row gap-8 items-center lg:items-start">
            {/* Logo Shop Column */}
            <div className="w-40 h-40 rounded-full p-1.5 bg-white shadow-xl flex-shrink-0 relative group/avatar border-4 border-white lg:-mt-20">
              <img src={mainImage} alt="Avatar" className="w-full h-full object-cover rounded-full" />
              <div className="absolute bottom-2 right-2 w-6 h-6 bg-purple-500 border-4 border-white rounded-full"></div>
              <div className="absolute inset-1.5 rounded-full bg-black/50 opacity-0 group-hover/avatar:opacity-100 transition-opacity flex flex-col items-center justify-center cursor-pointer">
                <CldUploadWidget
                  uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "default_preset"}
                  onSuccess={(result) => {
                    const url = result?.info?.secure_url;
                    handleUpdateAvatar(url);
                  }}
                >
                  {({ open }) => (
                    <button type="button" onClick={() => open()} className="bg-transparent border-none text-white text-[10px] font-bold flex flex-col items-center cursor-pointer">
                      <Camera className="w-6 h-6 text-white mb-1" />
                      Tải Logo
                    </button>
                  )}
                </CldUploadWidget>
                <button onClick={() => { setAvatarInput(mainImage); setIsEditingAvatar(true); }} className="bg-transparent border-none text-white text-[9px] font-bold mt-1.5 cursor-pointer underline">
                  Nhập Link
                </button>
              </div>
            </div>

            {/* Info and Actions Column */}
            <div className="flex-1 flex flex-col gap-4 w-full">
              {/* Row 1: Name and Action Buttons */}
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex items-center gap-2 justify-center lg:justify-start">
                  <input
                    type="text"
                    value={shopName}
                    onChange={e => setShopName(e.target.value)}
                    placeholder="Tên Shop của bạn"
                    style={{ width: shopName ? `${shopName.length * 18 + 10}px` : '180px' }}
                    className="text-3xl font-black text-gray-900 bg-transparent border-b-2 border-transparent hover:border-gray-200 focus:border-purple-500 outline-none transition-colors text-center lg:text-left"
                  />
                  <span className="inline-flex items-center justify-center w-6 h-6 bg-purple-600 rounded-full text-white text-xs font-bold shrink-0 shadow-sm">✓</span>
                  {renderSaveButton('shopName', shopName)}
                </div>
                <div className="flex items-center gap-3 justify-center lg:justify-end flex-wrap">
                  <button onClick={() => window.location.href = "/my-casting"} className="px-5 py-3 border-2 border-gray-200 hover:bg-gray-50 text-gray-800 font-bold text-sm rounded-xl flex items-center gap-2 transition cursor-pointer whitespace-nowrap bg-white"><Plus className="w-4 h-4 text-purple-600" /> Tạo chiến dịch</button>
                  <button onClick={() => window.location.href = "/transactions"} className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold text-sm rounded-xl flex items-center gap-2 shadow-lg shadow-purple-200 transition cursor-pointer whitespace-nowrap border-none"><Mail className="w-4 h-4" /> Nạp tiền vào ví</button>
                  <button className="p-3 border-2 border-gray-200 hover:bg-gray-50 rounded-xl transition cursor-pointer shrink-0 bg-white"><Bookmark className="w-5 h-5 text-gray-500" /></button>
                  <button className="p-3 border-2 border-gray-200 hover:bg-gray-50 rounded-xl transition cursor-pointer shrink-0 bg-white"><MoreHorizontal className="w-5 h-5 text-gray-500" /></button>
                </div>
              </div>

              {/* Row 2: Headline and Plan */}
              <div className="flex flex-col lg:flex-row lg:items-center gap-4 text-center lg:text-left">
                <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
                  {plan === "FREE" ? "🆓 Gói Thành viên Miễn phí" : "💎 Đối tác liên kết Premium"}
                </p>
                <span className="hidden lg:inline text-gray-300">|</span>
                <div className="flex items-center gap-2 text-sm text-gray-500 font-medium justify-center lg:justify-start">
                  <MapPin className="w-4 h-4 text-purple-500" />
                  <input
                    type="text"
                    value={address}
                    onChange={e => setAddress(e.target.value)}
                    placeholder="Địa chỉ..."
                    style={{ width: address ? `${address.length * 8 + 10}px` : '150px' }}
                    className="bg-transparent border-b border-transparent hover:border-gray-300 focus:border-purple-500 outline-none transition-colors text-gray-600"
                  />
                  {renderSaveButton('address', address)}
                </div>
              </div>

              {/* Row 3: Stats and Tags */}
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pt-2 border-t border-gray-100 mt-2">
                <div className="flex items-center gap-6 justify-center lg:justify-start">
                  <div className="flex items-center gap-1.5 whitespace-nowrap">
                    {getRatingStars(averageRating)}
                    <span className="text-lg font-black text-gray-900 ml-1">{averageRating.toFixed(1)}</span>
                    <span className="text-xs text-gray-400">({totalJobs} đánh giá)</span>
                  </div>
                  <div className="flex items-center gap-2 whitespace-nowrap">
                    <Users className="w-5 h-5 text-gray-400" />
                    <span className="text-lg font-black text-gray-900">{connects}</span>
                    <span className="text-xs text-gray-400">Kết nối</span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 justify-center lg:justify-start">
                  {selectedCategories.slice(0, 5).map((cat, idx) => (
                    <span key={idx} className="px-3 py-1.5 bg-purple-50 text-purple-600 font-bold text-xs rounded-full border border-purple-100 whitespace-nowrap">{cat}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic profile columns */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-x-6 gap-y-4">
          {/* Left Column: Quick Info */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl p-5 shadow-sm h-full flex flex-col justify-between gap-4">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Thông tin nhãn hàng</h3>
                  <span className="bg-green-50 text-green-600 text-[10px] font-bold px-2 py-1 rounded-md flex items-center gap-1">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>Active
                  </span>
                </div>
                <p className="text-xs text-gray-400 mb-3">Thông số hệ thống cập nhật tự động</p>
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between text-xs"><span className="flex items-center gap-2 text-gray-500"><Clock className="w-4 h-4" /> Trái Tim</span><span className="font-bold text-gray-900">{hearts} ❤️</span></div>
                  <div className="flex items-center justify-between text-xs"><span className="flex items-center gap-2 text-gray-500"><CheckCircle2 className="w-4 h-4" /> Chiến dịch</span><span className="font-bold text-gray-900">{totalJobs} bài</span></div>
                  <div className="flex items-center justify-between text-xs"><span className="flex items-center gap-2 text-gray-500"><Calendar className="w-4 h-4" /> Ngày tham gia</span><span className="font-bold text-gray-900">Castme Shop</span></div>
                  <div className="flex items-center justify-between text-xs"><span className="flex items-center gap-2 text-gray-500"><Phone className="w-4 h-4" /> Điện thoại</span><span className="font-bold text-purple-600">{phone || "Chưa cập nhật"}</span></div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Bio description */}
          <div className="lg:col-span-9">
            <div className="bg-white rounded-2xl p-6 shadow-sm h-full flex flex-col justify-between gap-2">
              <div>
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Giới thiệu nhãn hàng & Sản phẩm</h3>
                <textarea rows={descExpanded ? 8 : 3} value={description} onChange={e => setDescription(e.target.value)} placeholder="Mô tả chi tiết về thương hiệu, sản phẩm và dịch vụ của shop..." className="w-full text-sm text-gray-700 leading-relaxed bg-transparent resize-none outline-none border border-transparent hover:border-gray-200 focus:border-purple-500 rounded-xl p-3 transition-colors" />
              </div>
              <div className="flex justify-between items-center mt-1">
                <button onClick={() => setDescExpanded(!descExpanded)} className="text-xs font-bold text-purple-600 hover:text-purple-700 cursor-pointer border-none bg-transparent">{descExpanded ? "Thu gọn" : "Xem thêm"}</button>
                {savedData.description !== description && (<button onClick={() => handlePartialSave('description', { description })} disabled={savingField === 'description'} className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl shadow-md transition flex items-center gap-2 cursor-pointer border-none">{savingField === 'description' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}Lưu giới thiệu</button>)}
              </div>
            </div>
          </div>

          {/* Left Column 2: Social media & Categories */}
          <div className="lg:col-span-3">
            <div className="flex flex-col gap-4 h-full justify-between">
              <div className="bg-white rounded-2xl p-5 shadow-sm">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Liên kết Shop</h3>
                <div className="space-y-2">
                  {[
                    { key: 'website', icon: '🌐', name: 'Website URL', value: website },
                    { key: 'instagram', icon: '📸', name: 'Instagram', value: instagram },
                    { key: 'phone', icon: '📞', name: 'Số điện thoại', value: phone }
                  ].map((s) => (
                    <div key={s.key} onClick={() => setSocialModal({ isOpen: true, platform: s.key, link: s.value || "" })} className="flex items-center justify-between py-1.5 px-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition group cursor-pointer">
                      <div className="flex items-center gap-3"><span className="text-base">{s.icon}</span><span className="font-bold text-xs text-gray-700">{s.name}</span></div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-gray-400 max-w-[80px] overflow-hidden text-overflow-ellipsis white-space-nowrap font-bold">
                          {s.value ? "Đã liên kết" : "Chưa có"}
                        </span>
                        <span className="text-[9px] font-bold text-purple-600 bg-purple-50 px-2 py-1 rounded">Sửa</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-2xl p-5 shadow-sm">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 flex justify-between items-center">Danh mục sản phẩm<span className="text-[10px] text-gray-400 font-normal normal-case">Bấm để chọn</span></h3>
                <div className="flex flex-wrap gap-2">
                  {categoryPool.map((cat) => (
                    <button key={cat} onClick={() => toggleCategory(cat)} disabled={savingField === 'categories'} className={`px-2.5 py-1 font-bold text-xs rounded-lg border transition-all cursor-pointer ${selectedCategories.includes(cat) ? "bg-purple-50 text-purple-600 border-purple-200" : "bg-white text-gray-500 border-gray-200 hover:bg-gray-50"}`}>{cat}</button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column 2: Gallery Showroom */}
          <div className="lg:col-span-9">
            <div className="bg-white rounded-2xl p-6 shadow-sm h-full flex flex-col justify-between gap-4">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-lg font-bold text-gray-900">Bộ sưu tập hình ảnh & Showroom</h2>
                    <p className="text-xs text-gray-400 mt-1">Đăng tải showroom, văn phòng, nhà xưởng hoặc ảnh sản phẩm nổi bật</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {gallery.slice(0, 8).map((img, idx) => (
                    <div key={idx} className="relative rounded-xl overflow-hidden aspect-[10/9] group/img bg-gray-100 border border-gray-200">
                      <img src={img} alt={`Gallery ${idx}`} className="w-full h-full object-cover group-hover/img:scale-105 transition duration-500" />
                      <button onClick={(e) => { e.stopPropagation(); setImageToDelete(idx); }} className="absolute top-2 right-2 w-7 h-7 bg-red-600 hover:bg-red-700 text-white rounded-full flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition shadow-md cursor-pointer border-none">
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
              <div className="flex justify-end gap-2 items-center">
                <CldUploadWidget
                  uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "default_preset"}
                  onSuccess={(result) => {
                    const url = result?.info?.secure_url;
                    handleAddGalleryImage(url);
                  }}
                >
                  {({ open }) => (
                    <button type="button" onClick={() => open()} className="text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 px-5 py-2.5 rounded-xl transition flex items-center gap-2 cursor-pointer border-none">
                      <Plus className="w-4 h-4" />Tải ảnh từ máy
                    </button>
                  )}
                </CldUploadWidget>
                <button onClick={() => setIsAddingImage(true)} className="text-xs font-bold text-purple-600 bg-purple-50 hover:bg-purple-100 px-5 py-2.5 rounded-xl transition flex items-center gap-2 cursor-pointer border-none">
                  <Link2 className="w-4 h-4" />Thêm bằng Link
                </button>
              </div>
            </div>
          </div>

          {/* Left Column 3: Vibe matching Creative Direction */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl p-5 shadow-sm h-full flex flex-col justify-between gap-4">
              <div>
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1.5"><Sparkles size={14} className="text-purple-500" /> Vibe & Sáng Tạo</h3>
                <textarea rows={vibeExpanded ? 8 : 4} value={vibeText} onChange={e => setVibeText(e.target.value)} placeholder="Tone giọng, phong cách ảnh, style video, v.v..." className="w-full text-xs text-gray-700 leading-relaxed bg-transparent resize-none outline-none border border-transparent hover:border-gray-200 focus:border-purple-500 rounded-xl p-2.5 transition-colors" />
              </div>
              <div className="flex justify-between items-center">
                <button onClick={() => setVibeExpanded(!vibeExpanded)} className="text-[10px] font-bold text-purple-600 hover:text-purple-700 cursor-pointer border-none bg-transparent">{vibeExpanded ? "Thu gọn" : "Xem thêm"}</button>
                {savedData.vibeText !== vibeText && (<button onClick={() => handlePartialSave('vibeText', { vibeText })} disabled={savingField === 'vibeText'} className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white text-[10px] font-bold rounded-lg shadow-sm transition flex items-center gap-1 cursor-pointer border-none">{savingField === 'vibeText' ? <Loader2 className="w-3 h-3 animate-spin" /> : <Save className="w-3 h-3" />}Lưu</button>)}
              </div>
            </div>
          </div>

          {/* Right Column 3: Creator Reviews */}
          <div className="lg:col-span-9">
            <div className="bg-white rounded-2xl p-6 shadow-sm h-full flex flex-col justify-between gap-4">
              <div className="flex items-center justify-between"><h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Đánh giá từ KOC / KOL</h3><button className="text-xs font-bold text-purple-600 hover:text-purple-700 cursor-pointer border-none bg-transparent">Xem tất cả →</button></div>
              <div className="flex items-center gap-2">{getRatingStars(averageRating)}<span className="text-sm font-black text-gray-900 ml-1">{averageRating.toFixed(1)}</span><span className="text-xs text-gray-400">({totalJobs} đánh giá)</span></div>
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <p className="text-sm text-gray-700 italic mb-3 leading-relaxed">"Shop hỗ trợ mẫu sản phẩm rất nhanh, thanh toán thù lao đúng hạn và kịch bản rõ ràng dễ quay. Rất thích hợp tác lâu dài!"</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center font-black text-purple-600 text-sm">B</div>
                      <div>
                        <h4 className="text-xs font-bold text-gray-900">Bảo Trân Creator</h4>
                        <p className="text-[10px] text-gray-500">Chiến dịch: Review sản phẩm mùa hè</p>
                      </div>
                    </div>
                    <span className="text-[10px] text-gray-400 font-medium">10/05/2026</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Gallery Image Delete Modal */}
      {imageToDelete !== null && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-sm w-full shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Xóa hình ảnh?</h3>
            <p className="text-gray-500 mb-6 text-sm leading-relaxed">Bạn có chắc chắn muốn xóa hình ảnh này khỏi Bộ sưu tập?</p>
            <div className="flex gap-3">
              <button onClick={() => setImageToDelete(null)} className="flex-1 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-sm rounded-xl transition cursor-pointer border-none">Hủy</button>
              <button onClick={handleDeleteGalleryImage} className="flex-1 px-4 py-3 bg-red-500 hover:bg-red-600 text-white font-bold text-sm rounded-xl shadow-lg transition cursor-pointer flex justify-center items-center gap-2 border-none">
                {savingField === 'gallery' ? <Loader2 className="w-4 h-4 animate-spin" /> : "Đồng ý xóa"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Avatar Modal */}
      {isEditingAvatar && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-sm w-full shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-gray-900 mb-2 flex items-center gap-2"><Camera className="w-5 h-5 text-purple-500" /> Cập nhật Logo Shop</h3>
            <input autoFocus type="url" value={avatarInput} onChange={e => setAvatarInput(e.target.value)} placeholder="Dán link ảnh Logo..." className="w-full p-3 text-sm border border-gray-300 rounded-xl outline-none focus:border-purple-500 bg-gray-50" onKeyDown={(e) => { if (e.key === 'Enter') handleUpdateAvatar(); }} />
            <div className="flex gap-3">
              <button onClick={() => setIsEditingAvatar(false)} className="flex-1 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-sm rounded-xl transition cursor-pointer border-none">Hủy</button>
              <button onClick={() => handleUpdateAvatar()} className="flex-1 px-4 py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold text-sm rounded-xl shadow-lg transition cursor-pointer border-none">{savingField === 'mainImage' ? <Loader2 className="w-4 h-4 animate-spin" /> : "Lưu"}</button>
            </div>
          </div>
        </div>
      )}

      {/* Social Links Modal */}
      {socialModal.isOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-sm w-full shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">Cập nhật {socialModal.platform === 'website' ? 'Website URL' : socialModal.platform === 'instagram' ? 'Instagram Username' : socialModal.platform === 'phone' ? 'Số điện thoại' : 'Địa chỉ'}</h3>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-500 uppercase">Liên kết / Giá trị</label>
              <input autoFocus type="text" value={socialModal.link} onChange={e => setSocialModal({ ...socialModal, link: e.target.value })} placeholder="https://... hoặc giá trị..." className="w-full p-3 text-sm border border-gray-300 rounded-xl outline-none focus:border-purple-500 bg-gray-50" onKeyDown={(e) => { if (e.key === 'Enter') handleUpdateSocial(); }} />
            </div>
            <div className="flex gap-3 pt-2">
              <button onClick={() => setSocialModal({ isOpen: false, platform: null, link: "" })} className="flex-1 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-sm rounded-xl transition cursor-pointer border-none">Hủy</button>
              <button onClick={handleUpdateSocial} className="flex-1 px-4 py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold text-sm rounded-xl shadow-lg transition cursor-pointer flex justify-center items-center gap-2 border-none">
                {savingField === socialModal.platform ? <Loader2 className="w-4 h-4 animate-spin" /> : "Xác nhận"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Gallery Image Link Modal */}
      {isAddingImage && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-sm w-full shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">Thêm hình ảnh bằng Link</h3>
            <input autoFocus type="url" value={newImageLink} onChange={e => setNewImageLink(e.target.value)} placeholder="Dán link hình ảnh..." className="w-full p-3 text-sm border border-gray-300 rounded-xl outline-none focus:border-purple-500 bg-gray-50" onKeyDown={(e) => { if (e.key === 'Enter') handleAddGalleryImage(); }} />
            <div className="flex gap-3 pt-2">
              <button onClick={() => { setIsAddingImage(false); setNewImageLink(""); }} className="flex-1 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-sm rounded-xl transition cursor-pointer border-none">Hủy</button>
              <button onClick={() => handleAddGalleryImage()} className="flex-1 px-4 py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold text-sm rounded-xl shadow-lg transition cursor-pointer flex justify-center items-center gap-2 border-none">
                {savingField === 'gallery' ? <Loader2 className="w-4 h-4 animate-spin" /> : "Xác nhận"}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}