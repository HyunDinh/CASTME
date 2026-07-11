"use client";

import { useState, useEffect, useRef } from "react";
import { getCreatorProfile, updateCreatorProfile } from "#/app/(creator)/profile/actions";
import { Camera, Image as ImageIcon, Loader2, Plus, X, Save, CheckCircle2, AlertCircle, Bookmark, MoreHorizontal, MessageSquare, Mail, Calendar, Clock, Award, Users, User, ChevronDown, Check, Star, Youtube, Instagram, Facebook, Link2, MapPin } from "lucide-react";
import { CldUploadWidget } from 'next-cloudinary';

const skillPool = ["Makeup", "Model", "Review", "UGC", "Photography", "Content Creator", "Video Editing", "Livestream"];
const stylePool = ["Streetwear", "Vintage", "Minimalism", "Y2K", "Hàn Quốc", "Cá tính", "GenZ", "Beauty", "Lifestyle"];

const premiumPlaceholders = [
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?q=80&w=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?q=80&w=600&auto=format&fit=crop"
];

export default function CreatorProfileEditor() {
  const [activeTab, setActiveTab] = useState("all");
  const [loading, setLoading] = useState(true);
  const [savingField, setSavingField] = useState(null);
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });
  const uploadedUrlsRef = useRef([]);

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast(prev => ({ ...prev, show: false })), 3000);
  };

  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [selectedStyles, setSelectedStyles] = useState([]);
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [location, setLocation] = useState("");
  const [followersCount, setFollowersCount] = useState("");
  const [mainImage, setMainImage] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [gallery, setGallery] = useState([]);
  const [reviews, setReviews] = useState([]);

  const [photoPrice, setPhotoPrice] = useState("");
  const [shortVideoPrice, setShortVideoPrice] = useState("");
  const [longVideoPrice, setLongVideoPrice] = useState("");
  const [livestreamPrice, setLivestreamPrice] = useState("");

  const [socialLinks, setSocialLinks] = useState({ tiktok: "", instagram: "", facebook: "", youtube: "" });
  const [socialFollowers, setSocialFollowers] = useState({ tiktok: "", instagram: "", facebook: "", youtube: "" });
  const [savedData, setSavedData] = useState({});

  const [newImageLink, setNewImageLink] = useState("");
  const [isAddingImage, setIsAddingImage] = useState(false);
  const [imageToDelete, setImageToDelete] = useState(null);
  const [isEditingCover, setIsEditingCover] = useState(false);
  const [coverInput, setCoverInput] = useState("");
  const [socialModal, setSocialModal] = useState({ isOpen: false, platform: null, link: "", followers: "" });
  const [avatarModal, setAvatarModal] = useState({ isOpen: false, link: "" });
  const [isViewAllOpen, setIsViewAllOpen] = useState(false);
  const [bioExpanded, setBioExpanded] = useState(false);
  const [lightboxImage, setLightboxImage] = useState(null);

  useEffect(() => {
    async function fetchProfile() {
      const result = await getCreatorProfile();
      if (result.success) {
        const d = result.data;
        setName(d.name || "");
        setBio(d.bio || "");
        const loadedStyles = d.styles || [];
        setSelectedStyles(loadedStyles.filter(s => stylePool.includes(s)));
        setSelectedSkills(loadedStyles.filter(s => skillPool.includes(s)));
        setLocation(d.location || "");
        setFollowersCount(d.followersCount || "");
        setMainImage(d.mainImage || "");
        setCoverImage(d.coverImage || "");
        setGallery(d.gallery || []);
        try {
          const prices = JSON.parse(d.priceRange);
          if (prices) {
            setPhotoPrice(prices.photo || "");
            setShortVideoPrice(prices.shortVideo || "");
            setLongVideoPrice(prices.longVideo || "");
            setLivestreamPrice(prices.livestream || "");
          }
        } catch { }
        const dbSocials = d.socialLinks;
        const mappedLinks = { tiktok: "", instagram: "", facebook: "", youtube: "" };
        const mappedFollowers = { tiktok: "", instagram: "", facebook: "", youtube: "" };
        if (Array.isArray(dbSocials)) {
          dbSocials.forEach(s => {
            const key = s.platform.toLowerCase();
            if (mappedLinks.hasOwnProperty(key)) {
              mappedLinks[key] = s.link || "";
              mappedFollowers[key] = s.followers || "";
            }
          });
        }
        setSocialLinks(mappedLinks);
        setSocialFollowers(mappedFollowers);
        setReviews(d.reviews || []);
        setSavedData({ name: d.name || "", bio: d.bio || "", location: d.location || "", priceRange: d.priceRange || "", followersCount: d.followersCount || "", styles: d.styles || [] });
      }
      setLoading(false);
    }
    fetchProfile();
  }, []);

  const handlePartialSave = async (fieldName, updates) => {
    setSavingField(fieldName);
    const stylesCombined = fieldName === 'styles' ? updates.styles : [...selectedStyles, ...selectedSkills];
    let finalSocialLinks = [];
    if (fieldName === 'social') {
      finalSocialLinks = updates.socialLinks;
    } else {
      finalSocialLinks = [
        { platform: "TikTok", link: socialLinks.tiktok, followers: socialFollowers.tiktok, icon: "🎵" },
        { platform: "Instagram", link: socialLinks.instagram, followers: socialFollowers.instagram, icon: "📸" },
        { platform: "Facebook", link: socialLinks.facebook, followers: socialFollowers.facebook, icon: "📘" },
        { platform: "YouTube", link: socialLinks.youtube, followers: socialFollowers.youtube, icon: "📺" }
      ];
    }
    const payload = {
      name, bio, styles: stylesCombined, location,
      priceRange: fieldName === 'priceRange' ? updates.priceRange : JSON.stringify({ photo: photoPrice, shortVideo: shortVideoPrice, longVideo: longVideoPrice, livestream: livestreamPrice }),
      followersCount, mainImage, coverImage, gallery, socialLinks: finalSocialLinks, ...updates
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
      <button onClick={() => handlePartialSave(fieldKey, { [fieldKey]: value })} disabled={savingField === fieldKey} className="ml-2 px-2.5 py-1 bg-indigo-600 hover:bg-indigo-700 text-white text-[10px] font-bold rounded-md shadow-sm transition flex items-center gap-1 shrink-0 cursor-pointer">
        {savingField === fieldKey ? <Loader2 className="w-3 h-3 animate-spin" /> : <Save className="w-3 h-3" />}
        Lưu
      </button>
    );
  };

  const toggleStyle = async (style) => {
    let newStyles = selectedStyles.includes(style) ? selectedStyles.filter(s => s !== style) : [...selectedStyles, style];
    setSelectedStyles(newStyles);
    await handlePartialSave('styles', { styles: [...newStyles, ...selectedSkills] });
  };

  const toggleSkill = async (skill) => {
    let newSkills = selectedSkills.includes(skill) ? selectedSkills.filter(s => s !== skill) : [...selectedSkills, skill];
    setSelectedSkills(newSkills);
    await handlePartialSave('styles', { styles: [...selectedStyles, ...newSkills] });
  };

  const handleUpdateCover = async (url) => {
    const finalUrl = url || coverInput;
    setCoverImage(finalUrl);
    setIsEditingCover(false);
    await handlePartialSave('coverImage', { coverImage: finalUrl });
  };

  const handleUpdateAvatar = async (url) => {
    const finalUrl = url || avatarModal.link;
    setMainImage(finalUrl);
    setAvatarModal({ isOpen: false, link: "" });
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
    const updatedLinks = { ...socialLinks, [socialModal.platform]: socialModal.link };
    const updatedFollowers = { ...socialFollowers, [socialModal.platform]: socialModal.followers };
    setSocialLinks(updatedLinks);
    setSocialFollowers(updatedFollowers);
    setSocialModal({ isOpen: false, platform: null, link: "", followers: "" });
    const arraySocials = [
      { platform: "TikTok", link: updatedLinks.tiktok, followers: updatedFollowers.tiktok, icon: "🎵" },
      { platform: "Instagram", link: updatedLinks.instagram, followers: updatedFollowers.instagram, icon: "📸" },
      { platform: "Facebook", link: updatedLinks.facebook, followers: updatedFollowers.facebook, icon: "📘" },
      { platform: "YouTube", link: updatedLinks.youtube, followers: updatedFollowers.youtube, icon: "📺" }
    ];
    await handlePartialSave('social', { socialLinks: arraySocials });
  };

  if (loading) {
    return (
      <div className="w-full max-w-5xl mx-auto h-screen flex flex-col items-center justify-center">
        <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-gray-500 font-medium">Đang tải trình chỉnh sửa...</p>
      </div>
    );
  }

  const displayGallery = gallery;

  return (
    <div className="w-full bg-gray-50 min-h-screen">
      <div className={`fixed top-6 right-6 z-[200] transition-all duration-300 transform ${toast.show ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0 pointer-events-none'}`}>
        <div className={`flex items-center gap-3 px-5 py-4 rounded-2xl shadow-2xl font-bold text-sm text-white ${toast.type === 'success' ? 'bg-gray-900 border border-gray-700' : 'bg-red-600'}`}>
          {toast.type === 'success' ? <CheckCircle2 className="w-5 h-5 text-green-400" /> : <AlertCircle className="w-5 h-5" />}
          {toast.message}
        </div>
      </div>

      <div className="relative w-full h-[280px] group/cover bg-gray-100">
        {coverImage ? (
          <img src={coverImage} alt="Cover" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-slate-800 to-indigo-950 flex items-center justify-center text-gray-400 text-sm font-semibold">
            Người dùng chưa tải lên ảnh bìa
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-gray-50 pointer-events-none"></div>
        {!isEditingCover && (
          <div className="absolute top-6 right-6 flex gap-2 z-10 transition-opacity duration-200 opacity-100 lg:opacity-0 lg:group-hover/cover:opacity-100">
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
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2"><ImageIcon className="w-5 h-5 text-indigo-500" /> Cập nhật ảnh bìa</h3>
              <input autoFocus type="url" value={coverInput} onChange={e => setCoverInput(e.target.value)} placeholder="Dán link Ảnh Bìa..." className="w-full p-3 text-sm border border-gray-300 rounded-xl outline-none focus:border-indigo-500 bg-gray-50" onKeyDown={(e) => { if (e.key === 'Enter') handleUpdateCover(); }} />
              <div className="flex gap-2 mt-2">
                <button onClick={() => setIsEditingCover(false)} className="flex-1 bg-gray-100 text-gray-700 font-bold py-3 rounded-xl hover:bg-gray-200 transition cursor-pointer">Hủy</button>
                <button onClick={handleUpdateCover} className="flex-1 bg-indigo-600 text-white font-bold py-3 rounded-xl hover:bg-indigo-700 transition cursor-pointer">{savingField === 'coverImage' ? <Loader2 className="w-4 h-4 animate-spin" /> : "Lưu"}</button>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="max-w-[1400px] mx-auto px-6 -mt-24 relative z-10 pb-12">
        <div className="bg-white rounded-3xl shadow-lg p-8 mb-6">
          <div className="flex flex-col lg:flex-row gap-8 items-center lg:items-start">
            {/* Avatar Column */}
            <div className="w-40 h-40 rounded-full p-1.5 bg-white shadow-xl flex-shrink-0 relative group/avatar border-4 border-white lg:-mt-20">
              {mainImage ? (
                <img src={mainImage} alt="Avatar" className="w-full h-full object-cover rounded-full" />
              ) : (
                <div className="w-full h-full rounded-full bg-gray-200 flex items-center justify-center text-gray-400">
                  <User className="w-16 h-16" />
                </div>
              )}
              <div className="absolute bottom-2 right-2 w-6 h-6 bg-green-500 border-4 border-white rounded-full"></div>
              <div className="absolute inset-1.5 rounded-full transition-opacity duration-200 flex flex-col items-center justify-center cursor-pointer opacity-100 bg-black/40 lg:opacity-0 lg:group-hover/avatar:opacity-100 lg:bg-black/50">
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
                      Tải ảnh đại diện
                    </button>
                  )}
                </CldUploadWidget>
                <button onClick={() => setAvatarModal({ isOpen: true, link: mainImage })} className="bg-transparent border-none text-white text-[9px] font-bold mt-1.5 cursor-pointer underline">
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
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Tên của bạn"
                    style={{ width: name ? `${name.length * 18 + 10}px` : '150px' }}
                    className="text-3xl font-black text-gray-900 bg-transparent border-b-2 border-transparent hover:border-gray-200 focus:border-indigo-500 outline-none transition-colors text-center lg:text-left"
                  />
                  <span className="inline-flex items-center justify-center w-6 h-6 bg-indigo-600 rounded-full text-white text-xs font-bold shrink-0 shadow-sm">✓</span>
                  {renderSaveButton('name', name)}
                </div>
                <div className="flex items-center gap-3 justify-center lg:justify-end flex-wrap">
                  <button className="px-5 py-3 border-2 border-gray-200 hover:bg-gray-50 text-gray-800 font-bold text-sm rounded-xl flex items-center gap-2 transition cursor-pointer whitespace-nowrap"><MessageSquare className="w-4 h-4" /> Nhắn tin</button>
                  <button className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-xl flex items-center gap-2 shadow-lg shadow-indigo-200 transition cursor-pointer whitespace-nowrap"><Mail className="w-4 h-4" /> Mời Casting</button>
                  <button className="p-3 border-2 border-gray-200 hover:bg-gray-50 rounded-xl transition cursor-pointer shrink-0"><Bookmark className="w-5 h-5 text-gray-500" /></button>
                  <button className="p-3 border-2 border-gray-200 hover:bg-gray-50 rounded-xl transition cursor-pointer shrink-0"><MoreHorizontal className="w-5 h-5 text-gray-500" /></button>
                </div>
              </div>

              {/* Row 2: Headline and Location */}
              <div className="flex flex-col lg:flex-row lg:items-center gap-4 text-center lg:text-left">
                <p className="text-sm font-semibold text-gray-500">Fashion & Lifestyle Creator</p>
                <span className="hidden lg:inline text-gray-300">|</span>
                <div className="flex items-center gap-2 text-sm text-gray-500 font-medium justify-center lg:justify-start">
                  <MapPin className="w-4 h-4 text-indigo-500" />
                  <input
                    type="text"
                    value={location}
                    onChange={e => setLocation(e.target.value)}
                    placeholder="Địa điểm..."
                    style={{ width: location ? `${location.length * 8 + 10}px` : '120px' }}
                    className="bg-transparent border-b border-transparent hover:border-gray-300 focus:border-indigo-500 outline-none transition-colors text-gray-600"
                  />
                  {renderSaveButton('location', location)}
                </div>
              </div>

              {/* Row 3: Stats and Tags */}
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pt-2 border-t border-gray-100 mt-2">
                <div className="flex items-center gap-6 justify-center lg:justify-start">
                  <div className="flex items-center gap-2 whitespace-nowrap">
                    <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                    <span className="text-lg font-black text-gray-900">
                      {reviews.length > 0 ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1) : "0.0"}
                    </span>
                    <span className="text-xs text-gray-400">({reviews.length} đánh giá)</span>
                  </div>
                  <div className="flex items-center gap-2 whitespace-nowrap">
                    <Users className="w-5 h-5 text-gray-400" />
                    <span className="text-lg font-black text-gray-900">{followersCount || "0"}</span>
                    <span className="text-xs text-gray-400">Followers</span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 justify-center lg:justify-start">
                  {selectedStyles.length > 0 ? (
                    selectedStyles.slice(0, 5).map((style, idx) => (
                      <span key={idx} className="px-3 py-1.5 bg-indigo-50 text-indigo-600 font-bold text-xs rounded-full border border-indigo-100 whitespace-nowrap">{style}</span>
                    ))
                  ) : (
                    <span className="text-xs text-gray-400 italic">Chưa chọn phong cách</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-x-6 gap-y-4">
          {/* Cột trái Hàng 1 */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl p-5 shadow-sm h-full flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Thông tin nhanh</h3>
                  <span className="bg-green-50 text-green-600 text-[10px] font-bold px-2 py-1 rounded-md flex items-center gap-1">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>Available
                  </span>
                </div>
                <p className="text-xs text-gray-400 mb-3">Có thể nhận job ngay</p>
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between text-xs"><span className="flex items-center gap-2 text-gray-500"><Clock className="w-4 h-4" /> Phản hồi</span><span className="font-bold text-gray-900">&lt; 2 giờ</span></div>
                  <div className="flex items-center justify-between text-xs"><span className="flex items-center gap-2 text-gray-500"><CheckCircle2 className="w-4 h-4" /> Tỉ lệ hoàn thành</span><span className="font-bold text-gray-900">98%</span></div>
                  <div className="flex items-center justify-between text-xs"><span className="flex items-center gap-2 text-gray-500"><MapPin className="w-4 h-4" /> Khu vực</span><span className="font-bold text-indigo-600">{location.split(',')[0]}</span></div>
                </div>
              </div>
            </div>
          </div>
          {/* Cột phải Hàng 1 */}
          <div className="lg:col-span-9">
            <div className="bg-white rounded-2xl p-6 shadow-sm h-full flex flex-col justify-between">
              <div>
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">Giới thiệu</h3>
                <textarea rows={bioExpanded ? 8 : 3} value={bio} onChange={e => setBio(e.target.value)} placeholder="Xin chào, tôi là..." className="w-full text-sm text-gray-700 leading-relaxed bg-transparent resize-none outline-none border border-transparent hover:border-gray-200 focus:border-indigo-500 rounded-xl p-3 transition-colors" />
              </div>
              <div className="flex justify-between items-center mt-3">
                <button onClick={() => setBioExpanded(!bioExpanded)} className="text-xs font-bold text-indigo-600 hover:text-indigo-700 cursor-pointer">{bioExpanded ? "Thu gọn" : "Xem thêm"}</button>
                {savedData.bio !== bio && (<button onClick={() => handlePartialSave('bio', { bio })} disabled={savingField === 'bio'} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-md transition flex items-center gap-2 cursor-pointer">{savingField === 'bio' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}Lưu thay đổi</button>)}
              </div>
            </div>
          </div>

          {/* Cột trái Hàng 2 */}
          <div className="lg:col-span-3">
            <div className="flex flex-col gap-4 h-full justify-between">
              <div className="bg-white rounded-2xl p-5 shadow-sm">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Mạng xã hội</h3>
                <div className="space-y-2">
                  {[{ key: 'tiktok', icon: '🎵', name: 'TikTok' }, { key: 'instagram', icon: '📸', name: 'Instagram' }, { key: 'facebook', icon: '📘', name: 'Facebook' }, { key: 'youtube', icon: '📺', name: 'YouTube' }].map((s) => {
                    const currentLink = socialLinks[s.key]; const followers = socialFollowers[s.key];
                    return (<div key={s.key} onClick={() => setSocialModal({ isOpen: true, platform: s.key, link: currentLink || "", followers: followers })} className="flex items-center justify-between py-1.5 px-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition group cursor-pointer">
                      <div className="flex items-center gap-3"><span className="text-base">{s.icon}</span><span className="font-bold text-xs text-gray-700">{s.name}</span></div>
                      <div className="flex items-center gap-2"><span className="text-xs font-black text-gray-900">{followers}</span>{currentLink ? <span className="text-[9px] font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded">Sửa</span> : <Plus className="w-4 h-4 text-gray-400 group-hover:text-indigo-600" />}</div>
                    </div>);
                  })}
                </div>
                <button className="w-full mt-3 py-2 bg-gray-50 hover:bg-gray-100 text-gray-600 text-xs font-bold rounded-xl transition flex items-center justify-center gap-2 cursor-pointer"><Link2 className="w-4 h-4" />Xem tất cả liên kết</button>
              </div>
              <div className="bg-white rounded-2xl p-5 shadow-sm">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 flex justify-between items-center">Kỹ năng<span className="text-[10px] text-gray-400 font-normal normal-case">Bấm để chọn</span></h3>
                <div className="flex flex-wrap gap-2">{skillPool.map((skill) => (<button key={skill} onClick={() => toggleSkill(skill)} disabled={savingField === 'styles'} className={`px-2.5 py-1 font-bold text-xs rounded-lg border transition-all cursor-pointer ${selectedSkills.includes(skill) ? "bg-indigo-50 text-indigo-600 border-indigo-200" : "bg-white text-gray-500 border-gray-200 hover:bg-gray-50"}`}>{skill}</button>))}</div>
              </div>
            </div>
          </div>

          {/* Cột phải Hàng 2 */}
          <div className="lg:col-span-9">
            <div className="bg-white rounded-2xl p-6 shadow-sm h-full flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-bold text-gray-900">Portfolio</h2>
                  <button onClick={() => setIsViewAllOpen(true)} className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 cursor-pointer">Xem tất cả <span>→</span></button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {displayGallery.slice(0, 8).map((img, idx) => (
                    <div key={idx} className="relative rounded-xl overflow-hidden aspect-[10/9] group/img bg-gray-100 border border-gray-200">
                      <img src={img} alt={`Gallery ${idx}`} className="w-full h-full object-cover group-hover/img:scale-105 transition duration-500 cursor-pointer" onClick={() => setLightboxImage(img)} />
                      {idx < 2 && (<div className="absolute bottom-2 left-2 bg-black/40 backdrop-blur-md w-7 h-7 rounded-full flex items-center justify-center text-white text-[10px] shadow-md pointer-events-none">▶</div>)}
                      <button 
                        onClick={(e) => { e.stopPropagation(); setImageToDelete(idx); }} 
                        className="absolute top-2 right-2 w-7 h-7 bg-red-600 hover:bg-red-700 text-white rounded-full flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition shadow-md cursor-pointer border-none z-10"
                      >
                        ✕
                      </button>
                      {idx === 7 && displayGallery.length > 8 && (
                        <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center text-white font-bold text-sm hover:bg-black/70 transition cursor-pointer z-20" onClick={() => setIsViewAllOpen(true)}>
                          <span className="text-xl">+{displayGallery.length - 7}</span>
                          <span className="text-[9px] font-semibold uppercase tracking-wider mt-1">Xem tất cả</span>
                        </div>
                      )}
                    </div>
                  ))}
                  {displayGallery.length === 0 && (
                    <div className="col-span-full py-8 border border-dashed border-gray-200 rounded-xl text-center text-gray-400 text-sm">
                      Chưa có hình ảnh nào trong Portfolio.
                    </div>
                  )}
                </div>
              </div>
              <div className="flex justify-end gap-2 items-center mt-4">
                <CldUploadWidget
                  uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "default_preset"}
                  options={{ multiple: true }}
                  onSuccess={(result) => {
                    if (result?.info?.secure_url) {
                      uploadedUrlsRef.current.push(result.info.secure_url);
                    }
                  }}
                  onQueuesEnd={(result, { widget }) => {
                    if (uploadedUrlsRef.current.length > 0) {
                      const newUrls = uploadedUrlsRef.current;
                      uploadedUrlsRef.current = [];
                      setGallery(prev => {
                        const updated = [...newUrls, ...prev];
                        handlePartialSave('gallery', { gallery: updated });
                        return updated;
                      });
                    }
                    widget.close();
                  }}
                >
                  {({ open }) => (
                    <button type="button" onClick={() => open()} className="text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 px-5 py-2.5 rounded-xl transition flex items-center gap-2 cursor-pointer border-none">
                      <Plus className="w-4 h-4" />Tải ảnh từ máy
                    </button>
                  )}
                </CldUploadWidget>
                <button onClick={() => setIsAddingImage(true)} className="text-xs font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-5 py-2.5 rounded-xl transition flex items-center gap-2 cursor-pointer border-none">
                  <Link2 className="w-4 h-4" />Thêm bằng Link
                </button>
              </div>
            </div>
          </div>

          {/* Cột trái Hàng 3 */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl p-5 shadow-sm h-full">
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 flex justify-between items-center">Phong cách<span className="text-[10px] text-gray-400 font-normal normal-case">Bấm để chọn</span></h3>
              <div className="flex flex-wrap gap-2">{stylePool.map((style) => (<button key={style} onClick={() => toggleStyle(style)} disabled={savingField === 'styles'} className={`px-2.5 py-1 font-bold text-xs rounded-lg border transition-all cursor-pointer ${selectedStyles.includes(style) ? "bg-indigo-50 text-indigo-600 border-indigo-200" : "bg-white text-gray-500 border-gray-200 hover:bg-gray-50"}`}>{style}</button>))}</div>
            </div>
          </div>

          {/* Cột phải Hàng 3 */}
          <div className="lg:col-span-9">
            <div className="bg-white rounded-2xl p-6 shadow-sm h-full flex flex-col justify-between">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Đánh giá của khách hàng</h3>
                <button className="text-xs font-bold text-indigo-600 hover:text-indigo-700 cursor-pointer">Xem tất cả →</button>
              </div>
              <div className="flex items-center gap-2 mb-4">
                {Array.from({ length: 5 }).map((_, i) => {
                  const avg = reviews.length > 0 ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length : 0;
                  return (
                    <Star key={i} className={`w-5 h-5 ${i < Math.round(avg) ? "text-yellow-400 fill-yellow-400" : "text-gray-200"}`} />
                  );
                })}
                <span className="text-sm font-black text-gray-900 ml-1">
                  {reviews.length > 0 ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1) : "0.0"}
                </span>
                <span className="text-xs text-gray-400">({reviews.length} đánh giá)</span>
              </div>
              <div className="space-y-4">
                {reviews.length > 0 ? (
                  reviews.map((rev) => (
                    <div key={rev.id} className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                      <p className="text-sm text-gray-700 italic mb-3 leading-relaxed">"{rev.content}"</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {rev.avatar ? (
                            <img src={rev.avatar} alt={rev.shopName} className="w-10 h-10 rounded-full object-cover" />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center font-black text-indigo-600 text-sm">
                              {rev.shopName.charAt(0)}
                            </div>
                          )}
                          <div>
                            <h4 className="text-xs font-bold text-gray-900">{rev.shopName}</h4>
                            <p className="text-[10px] text-gray-500">Đánh giá: {rev.rating} ★</p>
                          </div>
                        </div>
                        <span className="text-[10px] text-gray-400 font-medium">{rev.createdAt}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="py-8 text-center text-gray-400 text-sm">
                    Chưa có đánh giá nào từ khách hàng.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {imageToDelete !== null && (<div className="fixed inset-0 z-[250] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"><div className="bg-white rounded-3xl p-6 md:p-8 max-w-sm w-full shadow-2xl transform transition-all"><h3 className="text-lg font-bold text-gray-900 mb-2">Xóa hình ảnh?</h3><p className="text-gray-500 mb-6 text-sm leading-relaxed">Bạn có chắc chắn muốn xóa hình ảnh này khỏi Portfolio?</p><div className="flex gap-3"><button onClick={() => setImageToDelete(null)} className="flex-1 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-sm rounded-xl transition cursor-pointer">Hủy</button><button onClick={handleDeleteGalleryImage} className="flex-1 px-4 py-3 bg-red-500 hover:bg-red-600 text-white font-bold text-sm rounded-xl shadow-lg transition cursor-pointer flex justify-center items-center gap-2">{savingField === 'gallery' ? <Loader2 className="w-4 h-4 animate-spin" /> : "Đồng ý xóa"}</button></div></div></div>)}

      {socialModal.isOpen && (<div className="fixed inset-0 z-[120] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"><div className="bg-white rounded-3xl p-6 md:p-8 max-w-sm w-full shadow-2xl transform transition-all space-y-4"><h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">Liên kết {socialModal.platform === 'tiktok' ? 'TikTok' : socialModal.platform === 'instagram' ? 'Instagram' : socialModal.platform === 'facebook' ? 'Facebook' : 'YouTube'}</h3><div className="space-y-1"><label className="text-[10px] font-bold text-gray-500 uppercase">Link URL</label><input autoFocus type="url" value={socialModal.link} onChange={e => setSocialModal({ ...socialModal, link: e.target.value })} placeholder="https://..." className="w-full p-3 text-sm border border-gray-300 rounded-xl outline-none focus:border-indigo-500 bg-gray-50" /></div><div className="space-y-1"><label className="text-[10px] font-bold text-gray-500 uppercase">Số lượng Followers</label><input type="text" value={socialModal.followers} onChange={e => setSocialModal({ ...socialModal, followers: e.target.value })} placeholder="10K, 250K..." className="w-full p-3 text-sm border border-gray-300 rounded-xl outline-none focus:border-indigo-500 bg-gray-50" onKeyDown={(e) => { if (e.key === 'Enter') handleUpdateSocial(); }} /></div><div className="flex gap-3 pt-2"><button onClick={() => setSocialModal({ isOpen: false, platform: null, link: "", followers: "" })} className="flex-1 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-sm rounded-xl transition cursor-pointer">Hủy</button><button onClick={handleUpdateSocial} className="flex-1 px-4 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-xl shadow-lg transition cursor-pointer flex justify-center items-center gap-2">{savingField === 'social' ? <Loader2 className="w-4 h-4 animate-spin" /> : "Xác nhận"}</button></div></div></div>)}

      {avatarModal.isOpen && (<div className="fixed inset-0 z-[120] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"><div className="bg-white rounded-3xl p-6 md:p-8 max-w-sm w-full shadow-2xl transform transition-all"><h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2"><Camera className="w-5 h-5 text-indigo-500" />Cập nhật Ảnh Đại Diện</h3><input autoFocus type="url" value={avatarModal.link} onChange={e => setAvatarModal({ ...avatarModal, link: e.target.value })} placeholder="Dán link ảnh..." className="w-full p-3 text-sm border border-gray-300 rounded-xl outline-none focus:border-indigo-500 bg-gray-50 mb-4" onKeyDown={(e) => { if (e.key === 'Enter') handleUpdateAvatar(); }} /><div className="flex gap-3"><button onClick={() => setAvatarModal({ isOpen: false, link: "" })} className="flex-1 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-sm rounded-xl transition cursor-pointer">Hủy</button><button onClick={handleUpdateAvatar} className="flex-1 px-4 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-xl shadow-lg transition cursor-pointer flex justify-center items-center gap-2">{savingField === 'mainImage' ? <Loader2 className="w-4 h-4 animate-spin" /> : "Xác nhận"}</button></div></div></div>)}

      {isViewAllOpen && (<div className="fixed inset-0 z-[120] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"><div className="bg-white rounded-3xl p-6 md:p-8 max-w-5xl w-full shadow-2xl transform transition-all flex flex-col max-h-[85vh]"><div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-4"><div><h3 className="text-lg font-bold text-gray-900">Tất cả hình ảnh</h3><p className="text-xs text-gray-500 mt-1">Tổng cộng {gallery.length} hình ảnh</p></div><button onClick={() => setIsViewAllOpen(false)} className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center text-gray-500 hover:text-gray-900 transition cursor-pointer"><X className="w-5 h-5" /></button></div><div className="flex-1 overflow-y-auto pr-1"><div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3"><div className="group relative rounded-2xl overflow-hidden aspect-square border-2 border-dashed border-gray-300 hover:border-indigo-500 bg-gray-50 flex flex-col items-center justify-center cursor-pointer transition-colors" onClick={() => setIsAddingImage(true)}><Plus className="w-6 h-6 text-gray-400 group-hover:text-indigo-500 mb-1 transition-colors" /><span className="text-[10px] font-bold text-gray-400 group-hover:text-indigo-500 transition-colors">Thêm ảnh</span></div>{gallery.map((img, idx) => (<div key={idx} className="group relative rounded-2xl overflow-hidden aspect-square border border-gray-100 bg-gray-50"><img src={img} alt={`Gallery ${idx}`} className="w-full h-full object-cover group-hover:scale-105 transition duration-500 cursor-pointer" onClick={() => setLightboxImage(img)} onError={(e) => { e.target.src = 'https://placehold.co/400?text=Lỗi+Ảnh' }} /><button onClick={(e) => { e.stopPropagation(); setImageToDelete(idx); }} className="absolute top-2 right-2 w-7 h-7 bg-black/60 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition hover:bg-red-500 backdrop-blur-sm cursor-pointer"><X className="w-4 h-4" /></button></div>))}</div></div><div className="border-t border-gray-100 pt-4 mt-4 flex justify-end"><button onClick={() => setIsViewAllOpen(false)} className="px-5 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-xl shadow-md transition cursor-pointer">Hoàn tất</button></div></div></div>)}

      {isAddingImage && (<div className="fixed inset-0 z-[130] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"><div className="bg-white rounded-3xl p-6 md:p-8 max-w-sm w-full shadow-2xl transform transition-all space-y-4"><h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">Thêm hình ảnh mới</h3><input autoFocus type="url" value={newImageLink} onChange={e => setNewImageLink(e.target.value)} placeholder="Dán link hình ảnh..." className="w-full p-3 text-sm border border-gray-300 rounded-xl outline-none focus:border-indigo-500 bg-gray-50" onKeyDown={(e) => { if (e.key === 'Enter') handleAddGalleryImage(); }} /><div className="flex gap-3 pt-2"><button onClick={() => { setIsAddingImage(false); setNewImageLink(""); }} className="flex-1 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-sm rounded-xl transition cursor-pointer">Hủy</button><button onClick={handleAddGalleryImage} className="flex-1 px-4 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-xl shadow-lg transition cursor-pointer flex justify-center items-center gap-2">{savingField === 'gallery' ? <Loader2 className="w-4 h-4 animate-spin" /> : "Xác nhận"}</button></div></div></div>)}

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