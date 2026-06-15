"use client";

import { useState, useEffect } from "react";
import { getCreatorProfile, updateCreatorProfile } from "#/app/(creator)/profile/actions";
import { Camera, Image as ImageIcon, Loader2, Plus, X, Save, CheckCircle2, AlertCircle } from "lucide-react";
import { CldUploadWidget } from 'next-cloudinary';

export default function CreatorProfileEditor() {
  const [activeTab, setActiveTab] = useState("portfolio");
  const [loading, setLoading] = useState(true);
  
  // Trạng thái lưu từng phần
  const [savingField, setSavingField] = useState(null);
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });
  
  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast(prev => ({ ...prev, show: false })), 3000);
  };
  
  // Current edited states
  const [name, setName] = useState("Tên của bạn"); // Thường lấy từ User session
  const [bio, setBio] = useState("");
  const [selectedStyles, setSelectedStyles] = useState([]);
  const [location, setLocation] = useState("");
  const [priceRange, setPriceRange] = useState("");
  const [followersCount, setFollowersCount] = useState("");
  const [mainImage, setMainImage] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [gallery, setGallery] = useState([]);
  
  // Socials structure
  const [socialLinks, setSocialLinks] = useState({
    tiktok: "", instagram: "", facebook: ""
  });

  // Lưu trữ dữ liệu gốc để so sánh (cho các ô text)
  const [savedData, setSavedData] = useState({});

  // UI States
  const [newImageLink, setNewImageLink] = useState("");
  const [isAddingImage, setIsAddingImage] = useState(false);
  const [imageToDelete, setImageToDelete] = useState(null);
  const [isEditingCover, setIsEditingCover] = useState(false);
  const [coverInput, setCoverInput] = useState("");
  const [socialModal, setSocialModal] = useState({ isOpen: false, platform: null, link: "" });
  const [avatarModal, setAvatarModal] = useState({ isOpen: false, link: "" });

  const stylePool = ["Streetwear", "Vintage", "Minimalism", "Y2K", "Hàn Quốc", "Cá tính", "GenZ", "Beauty", "Lifestyle"];

  useEffect(() => {
    async function fetchProfile() {
      const result = await getCreatorProfile();
      if (result.success) {
        const d = result.data;
        setName(d.name || "Tên của bạn");
        setBio(d.bio || "");
        setSelectedStyles(d.styles || []);
        setLocation(d.location || "");
        setPriceRange(d.priceRange || "");
        setFollowersCount(d.followersCount || "");
        setMainImage(d.mainImage || "https://ui-avatars.com/api/?name=Creator&background=random");
        setCoverImage(d.coverImage || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop");
        setGallery(d.gallery || []);
        setSocialLinks(d.socialLinks || { tiktok: "", instagram: "", facebook: "" });

        setSavedData({
          name: d.name || "Tên của bạn",
          bio: d.bio || "",
          location: d.location || "",
          priceRange: d.priceRange || "",
          followersCount: d.followersCount || "",
          styles: d.styles || []
        });
      }
      setLoading(false);
    }
    fetchProfile();
  }, []);

  const handlePartialSave = async (fieldName, updates) => {
    setSavingField(fieldName);
    
    const payload = {
      name, bio, styles: selectedStyles, location, priceRange, followersCount, mainImage, coverImage, gallery, socialLinks,
      ...updates // overwrite with the specific update
    };

    const result = await updateCreatorProfile(payload);
    
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
        className="ml-2 px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-bold rounded-md shadow-sm transition flex items-center gap-1 shrink-0"
      >
        {savingField === fieldKey ? <Loader2 className="w-3 h-3 animate-spin" /> : <Save className="w-3 h-3" />}
        Lưu
      </button>
    );
  };

  // Immediate save handlers for images and tags
  const toggleStyle = (style) => {
    let newStyles;
    if (selectedStyles.includes(style)) newStyles = selectedStyles.filter(s => s !== style);
    else newStyles = [...selectedStyles, style];
    
    setSelectedStyles(newStyles);
  };

  const handleUpdateCover = async () => {
    setCoverImage(coverInput);
    setIsEditingCover(false);
    await handlePartialSave('cover', { coverImage: coverInput });
  };

  const handleUpdateAvatar = async () => {
    setMainImage(avatarModal.link);
    setAvatarModal({ isOpen: false, link: "" });
    await handlePartialSave('avatar', { mainImage: avatarModal.link });
  };

  const handleAddGalleryImage = async () => {
    if (newImageLink.trim() !== "") {
      const newGallery = [newImageLink.trim(), ...gallery];
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
    const newLinks = { ...socialLinks, [socialModal.platform]: socialModal.link };
    setSocialLinks(newLinks);
    setSocialModal({ isOpen: false, platform: null, link: "" });
    await handlePartialSave('social', { socialLinks: newLinks });
  };


  if (loading) {
    return (
      <div className="w-full max-w-5xl mx-auto h-screen flex flex-col items-center justify-center">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-gray-500 font-medium">Đang tải trình chỉnh sửa...</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto pb-24 relative">
      
      {/* Toast Notification */}
      <div className={`fixed top-6 right-6 z-[200] transition-all duration-300 transform ${toast.show ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0 pointer-events-none'}`}>
        <div className={`flex items-center gap-3 px-5 py-4 rounded-2xl shadow-2xl font-bold text-sm text-white ${toast.type === 'success' ? 'bg-gray-900 border border-gray-700' : 'bg-red-600'}`}>
          {toast.type === 'success' ? <CheckCircle2 className="w-5 h-5 text-green-400" /> : <AlertCircle className="w-5 h-5" />}
          {toast.message}
        </div>
      </div>

      <div className="mb-6 flex justify-between items-center">
        <span className="text-sm font-semibold text-gray-500">Chế độ xem trước & Chỉnh sửa trực tiếp</span>
      </div>

      {/* 2. HERO SECTION */}
      <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 relative group">
        {/* Cover Image */}
        <div className="h-64 md:h-80 w-full relative group/cover">
          <img src={coverImage} alt="Cover" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
          
          {/* Nút Chỉnh Ảnh Bìa */}
          {!isEditingCover && (
            <button 
              onClick={() => { setCoverInput(coverImage); setIsEditingCover(true); }}
              className="absolute bottom-4 right-4 bg-black/40 hover:bg-black/60 backdrop-blur-md px-4 py-2.5 rounded-xl text-white font-bold text-sm transition flex items-center gap-2 opacity-0 group-hover/cover:opacity-100 shadow-lg cursor-pointer z-10"
            >
              <Camera className="w-4 h-4" /> Chỉnh ảnh bìa
            </button>
          )}

          {/* Form Chỉnh Ảnh Bìa */}
          {isEditingCover && (
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-20">
              <div className="bg-white p-6 rounded-2xl w-[90%] max-w-md shadow-2xl flex flex-col gap-4">
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <ImageIcon className="w-5 h-5 text-blue-500" /> Cập nhật ảnh bìa
                </h3>
                
                <input 
                  autoFocus
                  type="url" 
                  value={coverInput} 
                  onChange={e => setCoverInput(e.target.value)} 
                  placeholder="Dán link Ảnh Bìa vào đây..."
                  className="w-full p-3 text-sm border border-gray-300 rounded-xl outline-none focus:border-blue-500 bg-gray-50"
                  onKeyDown={(e) => {
                    if(e.key === 'Enter') handleUpdateCover();
                  }}
                />
                
                <div className="w-full flex items-center gap-2">
                  <div className="h-px bg-gray-200 flex-1"></div>
                  <span className="text-[10px] text-gray-400 font-medium uppercase">hoặc</span>
                  <div className="h-px bg-gray-200 flex-1"></div>
                </div>
                
                <CldUploadWidget 
                  onSuccess={(result) => { 
                    if(result.info && result.info.secure_url) {
                      setCoverInput(result.info.secure_url);
                    }
                  }}
                  uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "default_preset"}
                  options={{ maxFiles: 1, resourceType: "image" }}
                >
                  {({ open }) => (
                    <button 
                      type="button"
                      onClick={(e) => { e.preventDefault(); open(); }}
                      className="w-full bg-blue-50 hover:bg-blue-100 text-blue-600 border border-blue-200 text-sm font-bold py-3 rounded-xl transition flex items-center justify-center gap-2"
                    >
                      <Camera className="w-4 h-4" />
                      <span>Tải ảnh từ máy (Cloudinary)</span>
                    </button>
                  )}
                </CldUploadWidget>

                <div className="flex gap-2 mt-2">
                  <button onClick={() => setIsEditingCover(false)} className="flex-1 bg-gray-100 text-gray-700 font-bold py-3 rounded-xl hover:bg-gray-200 transition cursor-pointer">
                    Hủy
                  </button>
                  <button onClick={handleUpdateCover} className="flex-1 bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition cursor-pointer flex items-center justify-center gap-2">
                    {savingField === 'cover' ? <Loader2 className="w-4 h-4 animate-spin" /> : "Lưu Ảnh Bìa"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Info Box over Cover */}
        <div className="absolute top-4 right-4 flex gap-2">
          <button className="bg-white/20 backdrop-blur-md p-2.5 rounded-full text-white cursor-default">🔗</button>
          <button className="bg-white/20 backdrop-blur-md p-2.5 rounded-full text-white cursor-default">❤️</button>
        </div>

        {/* Profile Details Container */}
        <div className="px-6 md:px-10 pb-10 relative -mt-20 flex flex-col md:flex-row gap-6 items-end">
          {/* Avatar */}
          <div className="w-32 h-32 md:w-40 md:h-40 rounded-3xl p-1.5 bg-white shadow-xl flex-shrink-0 z-10 relative group/avatar">
            <img src={mainImage} alt="Avatar" className="w-full h-full object-cover rounded-2xl" />
            <div 
              onClick={() => setAvatarModal({ isOpen: true, link: mainImage })}
              className="absolute inset-1.5 rounded-2xl bg-black/50 opacity-0 group-hover/avatar:opacity-100 transition-opacity flex flex-col items-center justify-center cursor-pointer"
            >
              <Camera className="w-8 h-8 text-white mb-1" />
              <span className="text-white text-xs font-bold">Chỉnh sửa</span>
            </div>
          </div>

          {/* Name & Basic Info */}
          <div className="flex-1 mb-2 relative z-10 translate-y-[3px]">
            <div className="flex items-center gap-3 mb-2">
              <input 
                type="text" 
                value={name} 
                onChange={e => setName(e.target.value)} 
                placeholder="Nhập tên của bạn..."
                className="text-3xl md:text-4xl font-black text-gray-900 bg-transparent border-b-2 border-transparent hover:border-gray-200 focus:border-blue-500 outline-none w-full max-w-sm transition-colors"
              />
              {renderSaveButton('name', name)}
            </div>
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 font-medium">
              <span className="flex items-center gap-1 group/loc relative">
                📍 
                <input 
                  type="text" 
                  value={location} 
                  onChange={e => setLocation(e.target.value)} 
                  placeholder="Nhập địa điểm..."
                  className="bg-transparent border-b border-transparent hover:border-gray-300 focus:border-blue-500 outline-none w-32 transition-colors"
                />
                {renderSaveButton('location', location)}
              </span>
              <span className="flex items-center gap-1 bg-yellow-50 text-yellow-700 px-2.5 py-1 rounded-lg border border-yellow-200">
                ⭐ 5.0 (0 đánh giá)
              </span>
            </div>
          </div>

          {/* Call to action (Mock) */}
          <div className="w-full md:w-auto flex flex-col sm:flex-row gap-3 mt-4 md:mt-0 opacity-50 pointer-events-none">
            <button className="px-6 py-3 bg-gray-100 text-gray-900 font-bold rounded-xl">💬 Nhắn tin</button>
            <button className="px-8 py-3 bg-blue-600 text-white font-bold rounded-xl shadow-lg">Gửi lời mời Casting</button>
          </div>
        </div>
      </div>

      {/* 3. MAIN CONTENT (STATS & BIO) */}
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column (Stats & Sidebar info) */}
        <div className="flex flex-col gap-6">
          {/* Stats Box */}
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm grid grid-cols-2 gap-4 text-center">
            <div className="p-4 bg-gray-50 rounded-2xl group/stat relative">
              <input 
                type="text" 
                value={followersCount} 
                onChange={e => setFollowersCount(e.target.value)} 
                placeholder="VD: 1.2M"
                className="w-full text-center bg-transparent border-b border-transparent hover:border-gray-300 focus:border-blue-500 outline-none text-2xl font-black text-blue-600"
              />
              <div className="text-xs text-gray-500 font-semibold uppercase mt-1 flex justify-center items-center gap-2">
                Người theo dõi
                {renderSaveButton('followersCount', followersCount)}
              </div>
            </div>
            <div className="p-4 bg-gray-50 rounded-2xl opacity-70">
              <div className="text-2xl font-black text-gray-900">0</div>
              <div className="text-xs text-gray-500 font-semibold uppercase mt-1">Job hoàn thành</div>
            </div>
            <div className="p-4 bg-gray-50 rounded-2xl col-span-2">
              <input 
                type="text" 
                value={priceRange} 
                onChange={e => setPriceRange(e.target.value)} 
                placeholder="VD: 1tr - 3tr"
                className="w-full text-center bg-transparent border-b border-transparent hover:border-gray-300 focus:border-blue-500 outline-none text-lg font-black text-gray-900"
              />
              <div className="text-xs text-gray-500 font-semibold uppercase mt-1 flex justify-center items-center gap-2">
                Ngân sách tham khảo
                {renderSaveButton('priceRange', priceRange)}
              </div>
            </div>
          </div>

          {/* Social Links */}
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm relative">
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">Kênh truyền thông</h3>
            {savingField === 'social' && <div className="absolute top-6 right-6"><Loader2 className="w-4 h-4 text-blue-500 animate-spin" /></div>}
            <div className="flex flex-col gap-3">
              {[
                { key: 'tiktok', icon: '🎵', name: 'TikTok' },
                { key: 'instagram', icon: '📸', name: 'Instagram' },
                { key: 'facebook', icon: '📘', name: 'Facebook' }
              ].map((s) => {
                const currentLink = socialLinks[s.key];
                return (
                  <div 
                    key={s.key} 
                    onClick={() => setSocialModal({ isOpen: true, platform: s.key, link: currentLink || "" })}
                    className="flex items-center justify-between p-3 rounded-xl bg-gray-50 border border-transparent hover:border-gray-200 transition group cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{s.icon}</span>
                      <span className="font-semibold text-gray-700">{s.name}</span>
                    </div>
                    {currentLink ? (
                      <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-lg">Đã liên kết (Sửa)</span>
                    ) : (
                      <button className="text-xs font-bold text-gray-500 group-hover:text-blue-600 transition flex items-center gap-1">
                        <Plus className="w-3 h-3" /> Thêm link
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Styles */}
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm relative">
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 flex justify-between items-center">
              Phong cách
              <span className="text-xs text-blue-500 font-normal normal-case">Bấm để chọn</span>
            </h3>
            <div className="flex flex-wrap gap-2">
              {stylePool.map((style) => (
                <button 
                  key={style}
                  onClick={() => toggleStyle(style)}
                  disabled={savingField === 'styles'}
                  className={`px-3 py-1.5 font-bold text-xs rounded-lg border transition-all ${
                    selectedStyles.includes(style) 
                    ? "bg-blue-50 text-blue-700 border-blue-200" 
                    : "bg-white text-gray-400 border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  {style}
                </button>
              ))}
            </div>
            {JSON.stringify([...selectedStyles].sort()) !== JSON.stringify([...(savedData.styles || [])].sort()) && (
              <div className="mt-4 flex justify-end">
                <button 
                  onClick={() => handlePartialSave('styles', { styles: selectedStyles })}
                  disabled={savingField === 'styles'}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md transition flex items-center gap-2"
                >
                  {savingField === 'styles' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  Lưu thay đổi
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right Column (Tabs: Portfolio & Reviews) */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          
          {/* Bio */}
          <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm relative">
            <h2 className="text-xl font-black text-gray-900 mb-4 flex items-center justify-between">
              Giới thiệu
              <span className="text-xs font-normal text-gray-400">Click để sửa</span>
            </h2>
            <textarea 
              rows={4}
              value={bio}
              onChange={e => setBio(e.target.value)}
              placeholder="Xin chào, tôi là..."
              className="w-full text-gray-600 leading-relaxed bg-transparent resize-none outline-none border border-transparent hover:border-gray-200 focus:border-blue-500 rounded-xl p-3 -mx-3 transition-colors"
            />
            {savedData.bio !== bio && (
              <div className="absolute bottom-4 right-4">
                <button 
                  onClick={() => handlePartialSave('bio', { bio })}
                  disabled={savingField === 'bio'}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md transition flex items-center gap-2"
                >
                  {savingField === 'bio' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  Lưu thay đổi
                </button>
              </div>
            )}
          </div>

          {/* Tabs Container */}
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden relative">
            {savingField === 'gallery' && <div className="absolute top-4 right-4 z-10 bg-white/80 backdrop-blur rounded-full p-1"><Loader2 className="w-5 h-5 text-blue-500 animate-spin" /></div>}
            
            {/* Tab Headers */}
            <div className="flex border-b border-gray-100">
              <button 
                onClick={() => setActiveTab("portfolio")}
                className={`flex-1 py-4 text-sm font-bold uppercase tracking-wider transition ${activeTab === 'portfolio' ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/30' : 'text-gray-500 hover:bg-gray-50'}`}
              >
                Portfolio & Hình ảnh
              </button>
              <button 
                onClick={() => setActiveTab("reviews")}
                className={`flex-1 py-4 text-sm font-bold uppercase tracking-wider transition ${activeTab === 'reviews' ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/30' : 'text-gray-500 hover:bg-gray-50'}`}
              >
                Đánh giá từ Shop (0)
              </button>
            </div>

            {/* Tab Content */}
            <div className="p-8">
              
              {/* PORTFOLIO TAB */}
              {activeTab === "portfolio" && (
                <div>
                  <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
                    {/* Block Add Image (Luôn hiển thị đầu tiên) */}
                    <div 
                      className="group relative rounded-2xl overflow-hidden aspect-square border-2 border-dashed border-gray-300 hover:border-blue-500 bg-gray-50 flex flex-col items-center justify-center cursor-pointer transition"
                      onClick={() => !isAddingImage && setIsAddingImage(true)}
                    >
                      {isAddingImage ? (
                        <div className="p-4 w-full flex flex-col gap-2 items-center text-center">
                          <input 
                            autoFocus
                            type="url" 
                            value={newImageLink} 
                            onChange={(e) => setNewImageLink(e.target.value)} 
                            placeholder="Dán link ảnh..."
                            className="w-full p-2 text-xs border border-gray-300 rounded-lg outline-none focus:border-blue-500 bg-white"
                            onClick={(e) => e.stopPropagation()}
                            onKeyDown={(e) => {
                              if(e.key === 'Enter') handleAddGalleryImage();
                              if(e.key === 'Escape') setIsAddingImage(false);
                            }}
                          />
                          
                          <div className="w-full flex items-center gap-2 my-1">
                            <div className="h-px bg-gray-200 flex-1"></div>
                            <span className="text-[10px] text-gray-400 font-medium uppercase">hoặc</span>
                            <div className="h-px bg-gray-200 flex-1"></div>
                          </div>
                          
                          <CldUploadWidget 
                            onSuccess={(result) => { 
                              if(result.info && result.info.secure_url) {
                                setNewImageLink(result.info.secure_url);
                              }
                            }}
                            uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "default_preset"}
                            options={{ maxFiles: 1, resourceType: "image" }}
                          >
                            {({ open }) => (
                              <button 
                                type="button"
                                onClick={(e) => { e.preventDefault(); e.stopPropagation(); open(); }}
                                className="w-full bg-blue-50 hover:bg-blue-100 text-blue-600 border border-blue-200 text-xs font-bold py-1.5 rounded-lg transition flex items-center justify-center"
                              >
                                <span>Tải ảnh lên (Cloudinary)</span>
                              </button>
                            )}
                          </CldUploadWidget>

                          <div className="flex gap-2 w-full mt-1">
                            <button onClick={(e) => { e.stopPropagation(); handleAddGalleryImage(); }} className="flex-1 bg-blue-600 text-white text-xs font-bold py-1.5 rounded-lg hover:bg-blue-700 transition">Lưu link</button>
                            <button onClick={(e) => { e.stopPropagation(); setIsAddingImage(false); }} className="flex-1 bg-gray-200 text-gray-700 text-xs font-bold py-1.5 rounded-lg hover:bg-gray-300 transition">Hủy</button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <Plus className="w-10 h-10 text-gray-400 group-hover:text-blue-500 mb-2 transition-colors" />
                          <span className="text-sm font-bold text-gray-500 group-hover:text-blue-500 transition-colors">Thêm ảnh</span>
                        </>
                      )}
                    </div>

                    {/* Danh sách ảnh hiện tại */}
                    {gallery.map((img, idx) => (
                      <div key={idx} className="group relative rounded-2xl overflow-hidden aspect-square border border-gray-100">
                        <img src={img} alt={`Gallery ${idx}`} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" onError={(e) => {e.target.src='https://placehold.co/400?text=Lỗi+Ảnh'}} />
                        <button 
                          onClick={(e) => { e.stopPropagation(); setImageToDelete(idx); }}
                          className="absolute top-3 right-3 w-8 h-8 bg-black/50 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition hover:bg-red-500 backdrop-blur-sm"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* REVIEWS TAB */}
              {activeTab === "reviews" && (
                <div className="flex flex-col items-center justify-center py-10 text-center opacity-50">
                  <span className="text-4xl mb-4">⭐</span>
                  <p className="text-gray-500 font-medium">Chưa có đánh giá nào (Tab này chỉ xem)</p>
                </div>
              )}

            </div>
          </div>

        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {imageToDelete !== null && (
        <div className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-sm w-full shadow-2xl transform transition-all">
            <h3 className="text-xl font-bold text-gray-900 mb-2">Xóa hình ảnh?</h3>
            <p className="text-gray-500 mb-6 text-sm">Bạn có chắc chắn muốn xóa hình ảnh này khỏi Portfolio? Hành động này sẽ được lưu ngay lập tức.</p>
            <div className="flex gap-3">
              <button 
                onClick={() => setImageToDelete(null)}
                className="flex-1 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl transition cursor-pointer"
              >
                Hủy
              </button>
              <button 
                onClick={handleDeleteGalleryImage}
                className="flex-1 px-4 py-3 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl shadow-lg shadow-red-500/30 transition cursor-pointer flex justify-center items-center gap-2"
              >
                {savingField === 'gallery' ? <Loader2 className="w-4 h-4 animate-spin" /> : "Đồng ý xóa"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Social Link Modal */}
      {socialModal.isOpen && (
        <div className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-sm w-full shadow-2xl transform transition-all">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
               Cập nhật link {socialModal.platform === 'tiktok' ? 'TikTok' : socialModal.platform === 'instagram' ? 'Instagram' : 'Facebook'}
            </h3>
            <input 
              autoFocus
              type="url"
              value={socialModal.link}
              onChange={e => setSocialModal({...socialModal, link: e.target.value})}
              placeholder="https://..."
              className="w-full p-3 text-sm border border-gray-300 rounded-xl outline-none focus:border-blue-500 bg-gray-50 mb-6"
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleUpdateSocial();
              }}
            />
            <div className="flex gap-3">
              <button 
                onClick={() => setSocialModal({ isOpen: false, platform: null, link: "" })}
                className="flex-1 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl transition cursor-pointer"
              >
                Hủy
              </button>
              <button 
                onClick={handleUpdateSocial}
                className="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-500/30 transition cursor-pointer flex justify-center items-center gap-2"
              >
                {savingField === 'social' ? <Loader2 className="w-4 h-4 animate-spin" /> : "Xác nhận"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Avatar Modal */}
      {avatarModal.isOpen && (
        <div className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-sm w-full shadow-2xl transform transition-all">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
               <Camera className="w-5 h-5 text-blue-500" /> Cập nhật Ảnh Đại Diện
            </h3>
            
            <input 
              autoFocus
              type="url"
              value={avatarModal.link}
              onChange={e => setAvatarModal({...avatarModal, link: e.target.value})}
              placeholder="Dán link ảnh vào đây..."
              className="w-full p-3 text-sm border border-gray-300 rounded-xl outline-none focus:border-blue-500 bg-gray-50"
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleUpdateAvatar();
              }}
            />
            
            <div className="w-full flex items-center gap-2 my-4">
              <div className="h-px bg-gray-200 flex-1"></div>
              <span className="text-[10px] text-gray-400 font-medium uppercase">hoặc</span>
              <div className="h-px bg-gray-200 flex-1"></div>
            </div>
            
            <CldUploadWidget 
              onSuccess={(result) => { 
                if(result.info && result.info.secure_url) {
                  setAvatarModal({...avatarModal, link: result.info.secure_url});
                }
              }}
              uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "default_preset"}
              options={{ maxFiles: 1, resourceType: "image" }}
            >
              {({ open }) => (
                <button 
                  type="button"
                  onClick={(e) => { e.preventDefault(); open(); }}
                  className="w-full bg-blue-50 hover:bg-blue-100 text-blue-600 border border-blue-200 text-sm font-bold py-3 rounded-xl transition flex items-center justify-center gap-2 mb-6"
                >
                  <Camera className="w-4 h-4" />
                  <span>Tải ảnh từ máy (Cloudinary)</span>
                </button>
              )}
            </CldUploadWidget>

            <div className="flex gap-3">
              <button 
                onClick={() => setAvatarModal({ isOpen: false, link: "" })}
                className="flex-1 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl transition cursor-pointer"
              >
                Hủy
              </button>
              <button 
                onClick={handleUpdateAvatar}
                className="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-500/30 transition cursor-pointer flex justify-center items-center gap-2"
              >
                {savingField === 'avatar' ? <Loader2 className="w-4 h-4 animate-spin" /> : "Xác nhận"}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}