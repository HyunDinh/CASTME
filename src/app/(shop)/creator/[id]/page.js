"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import {
  Camera,
  Image as ImageIcon,
  Loader2,
  Plus,
  X,
  Bookmark,
  MoreHorizontal,
  MessageSquare,
  Mail,
  Calendar,
  Clock,
  Award,
  Users,
  Star,
  Link2,
  MapPin,
  CheckCircle2
} from "lucide-react";

import { checkHasInvited } from "#/app/(shop)/search-creator/actions";
import InviteCastingModal from "#/components/campaigns/InviteCastingModal";

const skillPool = ["Makeup", "Model", "Review", "UGC", "Photography", "Content Creator", "Video Editing", "Livestream"];
const stylePool = ["Streetwear", "Vintage", "Minimalism", "Y2K", "Hàn Quốc", "Cá tính", "GenZ", "Beauty", "Lifestyle"];

export default function CreatorProfilePage() {
  const router = useRouter();
  const params = useParams();
  
  const [creator, setCreator] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hasInvited, setHasInvited] = useState(false);
  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [isViewAllOpen, setIsViewAllOpen] = useState(false);
  const [lightboxImage, setLightboxImage] = useState(null);

  useEffect(() => {
    async function fetchCreator() {
      try {
        const res = await fetch(`/api/creators/${params.id}`);
        const result = await res.json();

        if (result.success) {
          setCreator(result.data);
        } else {
          console.error("Failed to load creator:", result.error);
        }
        
        const inviteRes = await checkHasInvited(params.id);
        if (inviteRes.success) {
          setHasInvited(inviteRes.data);
        }
      } catch (error) {
        console.error("Error fetching creator:", error);
      } finally {
        setLoading(false);
      }
    }

    if (params?.id) {
      fetchCreator();
    }
  }, [params?.id]);

  if (loading) {
    return (
      <div className="w-full max-w-5xl mx-auto h-screen flex flex-col items-center justify-center">
        <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-gray-500 font-medium">Đang tải hồ sơ...</p>
      </div>
    );
  }

  if (!creator) {
    return (
      <div className="w-full max-w-5xl mx-auto h-screen flex flex-col items-center justify-center">
        <span className="text-6xl mb-4">😢</span>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Không tìm thấy Creator
        </h2>
        <p className="text-gray-500 mb-6">
          Hồ sơ này không tồn tại hoặc đã bị xóa.
        </p>
        <button
          onClick={() => router.back()}
          className="px-6 py-2 bg-indigo-600 text-white font-bold rounded-xl shadow-lg cursor-pointer"
        >
          Quay lại
        </button>
      </div>
    );
  }

  const selectedStyles = creator.styles?.filter(s => stylePool.includes(s)) || [];
  const selectedSkills = creator.styles?.filter(s => skillPool.includes(s)) || [];
  const displayGallery = creator.gallery || [];

  const getSocialInfo = (platformName) => {
    const s = creator.socials?.find(item => item.platform.toLowerCase() === platformName.toLowerCase());
    return {
      link: s?.link || "",
      followers: s?.followers || "—"
    };
  };

  const socialConfig = [
    { key: 'tiktok', icon: '🎵', name: 'TikTok' },
    { key: 'instagram', icon: '📸', name: 'Instagram' },
    { key: 'facebook', icon: '📘', name: 'Facebook' },
    { key: 'youtube', icon: '📺', name: 'YouTube' }
  ];

  return (
    <div className="w-full bg-gray-50 min-h-screen">
      {/* Banner Cover Image */}
      <div className="relative w-full h-[280px]">
        <img src={creator.coverImage} alt="Cover" className="w-full h-full object-cover cursor-zoom-in" onClick={() => setLightboxImage(creator.coverImage)} />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-gray-50"></div>
        
        {/* Quay lại button */}
        <button
          onClick={() => router.back()}
          className="absolute top-6 left-6 bg-black/40 hover:bg-black/60 backdrop-blur-md px-4 py-2 rounded-xl text-white font-bold text-xs transition flex items-center gap-1.5 shadow-lg cursor-pointer z-10"
        >
          ← Quay lại
        </button>
      </div>

      <div className="max-w-[1400px] mx-auto px-6 -mt-24 relative z-10 pb-12">
        {/* Main Info Card */}
        <div className="bg-white rounded-3xl shadow-lg p-8 mb-6">
          <div className="flex flex-col lg:flex-row gap-8 items-center lg:items-start">
            {/* Avatar Column */}
            <div className="w-40 h-40 rounded-full p-1.5 bg-white shadow-xl flex-shrink-0 relative border-4 border-white lg:-mt-20 overflow-hidden">
              <div className="w-full h-full rounded-full overflow-hidden bg-indigo-50 flex items-center justify-center font-black text-4xl text-indigo-600">
                {creator.avatar && creator.avatar.length > 1 ? (
                  <img src={creator.avatar} alt={creator.name} className="w-full h-full object-cover cursor-zoom-in" onClick={() => setLightboxImage(creator.avatar)} />
                ) : (
                  creator.avatar
                )}
              </div>
              <div className="absolute bottom-2 right-2 w-6 h-6 bg-green-500 border-4 border-white rounded-full"></div>
            </div>

            {/* Info and Actions Column */}
            <div className="flex-1 flex flex-col gap-4 w-full">
              {/* Row 1: Name and Action Buttons */}
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex items-center gap-2 justify-center lg:justify-start">
                  <h1 className="text-3xl font-black text-gray-900 text-center lg:text-left">
                    {creator.name}
                  </h1>
                  <span className="inline-flex items-center justify-center w-6 h-6 bg-indigo-600 rounded-full text-white text-xs font-bold shrink-0 shadow-sm">✓</span>
                </div>
                <div className="flex items-center gap-3 justify-center lg:justify-end flex-wrap">
                  {hasInvited ? (
                    <Link
                      href={`/messages?userId=${params.id}`}
                      className="px-5 py-3 border-2 border-gray-200 hover:bg-gray-50 text-gray-800 font-bold text-sm rounded-xl flex items-center gap-2 transition cursor-pointer whitespace-nowrap text-center text-decoration-none"
                    >
                      <MessageSquare className="w-4 h-4 text-gray-500" /> Nhắn tin
                    </Link>
                  ) : (
                    <button
                      onClick={() => setInviteModalOpen(true)}
                      className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-xl flex items-center gap-2 shadow-lg shadow-indigo-200 transition cursor-pointer whitespace-nowrap text-center text-decoration-none"
                    >
                      <Mail className="w-4 h-4" /> Mời Casting
                    </button>
                  )}
                  
                  <button className="p-3 border-2 border-gray-200 hover:bg-gray-50 rounded-xl transition cursor-pointer shrink-0">
                    <Bookmark className="w-5 h-5 text-gray-500" />
                  </button>
                  <button className="p-3 border-2 border-gray-200 hover:bg-gray-50 rounded-xl transition cursor-pointer shrink-0">
                    <MoreHorizontal className="w-5 h-5 text-gray-500" />
                  </button>
                </div>
              </div>

              {/* Row 2: Headline and Location */}
              <div className="flex flex-col lg:flex-row lg:items-center gap-4 text-center lg:text-left">
                <p className="text-sm font-semibold text-gray-500">
                  {selectedStyles[0] || "Fashion"} & {selectedSkills[0] || "Lifestyle"} Creator
                </p>
                <span className="hidden lg:inline text-gray-300">|</span>
                <div className="flex items-center gap-2 text-sm text-gray-500 font-medium justify-center lg:justify-start">
                  <MapPin className="w-4 h-4 text-indigo-500" />
                  <span>{creator.location}</span>
                </div>
              </div>

              {/* Row 3: Stats and Tags */}
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pt-2 border-t border-gray-100 mt-2">
                <div className="flex items-center gap-6 justify-center lg:justify-start">
                  <div className="flex items-center gap-2 whitespace-nowrap">
                    <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                    <span className="text-lg font-black text-gray-900">
                      {creator.stats.averageRating > 0 ? creator.stats.averageRating : "—"}
                    </span>
                    <span className="text-xs text-gray-400">({creator.stats.reviewCount} đánh giá)</span>
                  </div>
                  <div className="flex items-center gap-2 whitespace-nowrap">
                    <Users className="w-5 h-5 text-gray-400" />
                    <span className="text-lg font-black text-gray-900">{creator.stats.followers}</span>
                    <span className="text-xs text-gray-400">Người theo dõi</span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 justify-center lg:justify-start">
                  {selectedStyles.slice(0, 5).map((style, idx) => (
                    <span key={idx} className="px-3 py-1.5 bg-indigo-50 text-indigo-600 font-bold text-xs rounded-full border border-indigo-100 whitespace-nowrap">
                      {style}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Lower Info Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-x-6 gap-y-4">
          
          {/* Cột trái Hàng 1 (Thông tin nhanh) */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl p-5 shadow-sm h-full flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Thông tin nhanh</h3>
                  <span className="bg-green-50 text-green-600 text-[10px] font-bold px-2 py-1 rounded-md flex items-center gap-1">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>Sẵn sàng
                  </span>
                </div>
                <p className="text-xs text-gray-400 mb-3 font-medium">Có thể nhận job ngay</p>
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="flex items-center gap-2 text-gray-500"><Clock className="w-4 h-4" /> Phản hồi</span>
                    <span className="font-bold text-gray-900">&lt; 2 giờ</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="flex items-center gap-2 text-gray-500"><CheckCircle2 className="w-4 h-4" /> Hoàn thành</span>
                    <span className="font-bold text-gray-900">98%</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="flex items-center gap-2 text-gray-500"><Calendar className="w-4 h-4" /> Casting hoàn tất</span>
                    <span className="font-bold text-gray-900">{creator.stats.jobsCompleted} chiến dịch</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="flex items-center gap-2 text-gray-500"><MapPin className="w-4 h-4" /> Địa bàn</span>
                    <span className="font-bold text-indigo-600">{creator.location?.split(',')[0]}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Cột phải Hàng 1 (Giới thiệu) */}
          <div className="lg:col-span-9">
            <div className="bg-white rounded-2xl p-6 shadow-sm h-full flex flex-col justify-between min-h-[160px]">
              <div>
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Giới thiệu</h3>
                <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line font-medium">
                  {creator.bio}
                </p>
              </div>
            </div>
          </div>

          {/* Cột trái Hàng 2 (Mạng xã hội & Kỹ năng) */}
          <div className="lg:col-span-3">
            <div className="flex flex-col gap-4 h-full">
              <div className="bg-white rounded-2xl p-5 shadow-sm">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Mạng xã hội</h3>
                <div className="space-y-2">
                  {socialConfig.map((s) => {
                    const currentSocial = getSocialInfo(s.key);
                    const hasLink = !!currentSocial.link;
                    
                    return (
                      <a
                        key={s.key}
                        href={hasLink ? currentSocial.link : undefined}
                        target={hasLink ? "_blank" : undefined}
                        rel="noopener noreferrer"
                        className={`flex items-center justify-between py-1.5 px-3 rounded-xl transition group ${hasLink ? 'bg-gray-50 hover:bg-gray-100 cursor-pointer' : 'bg-gray-50/50 opacity-60 pointer-events-none'}`}
                        style={{ textDecoration: 'none' }}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-base">{s.icon}</span>
                          <span className="font-bold text-xs text-gray-700">{s.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-black text-gray-900">{currentSocial.followers}</span>
                          {hasLink && <Link2 className="w-3.5 h-3.5 text-gray-400 group-hover:text-indigo-600 transition" />}
                        </div>
                      </a>
                    );
                  })}
                </div>
              </div>
              
              <div className="bg-white rounded-2xl p-5 shadow-sm">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Kỹ năng</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedSkills.length > 0 ? (
                    selectedSkills.map((skill) => (
                      <span key={skill} className="px-2.5 py-1 font-bold text-xs rounded-lg border bg-indigo-50 text-indigo-600 border-indigo-200">
                        {skill}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-gray-400 italic">Chưa cập nhật</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Cột phải Hàng 2 (Portfolio Gallery) */}
          <div className="lg:col-span-9">
            <div className="bg-white rounded-2xl p-6 shadow-sm h-full flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-bold text-gray-900">Portfolio & Hình ảnh</h2>
                  {displayGallery.length > 0 && (
                    <button onClick={() => setIsViewAllOpen(true)} className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 cursor-pointer">
                      Xem tất cả <span>→</span>
                    </button>
                  )}
                </div>
                
                {displayGallery.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {displayGallery.slice(0, 8).map((img, idx) => (
                      <div key={idx} className="relative rounded-xl overflow-hidden aspect-[10/9] group/img bg-gray-100 border border-gray-200">
                        <img
                          src={img}
                          alt={`Gallery ${idx}`}
                          className="w-full h-full object-cover group-hover/img:scale-105 transition duration-500 cursor-zoom-in"
                          onClick={() => setLightboxImage(img)}
                        />
                        {idx < 2 && (
                          <div className="absolute bottom-2 left-2 bg-black/40 backdrop-blur-md w-7 h-7 rounded-full flex items-center justify-center text-white text-[10px] shadow-md pointer-events-none">
                            ▶
                          </div>
                        )}
                        {idx === 7 && displayGallery.length > 8 && (
                          <div
                            className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center text-white font-bold text-sm hover:bg-black/70 transition cursor-pointer"
                            onClick={() => setIsViewAllOpen(true)}
                          >
                            <span className="text-xl">+{displayGallery.length - 7}</span>
                            <span className="text-[9px] font-semibold uppercase tracking-wider mt-1">Xem tất cả</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-10 bg-gray-50/50 rounded-2xl border border-dashed border-gray-200">
                    <span className="text-3xl mb-2">📷</span>
                    <p className="text-sm text-gray-500 font-semibold">Chưa có ảnh</p>
                    <p className="text-xs text-gray-400 mt-0.5">Creator này chưa đăng tải hình ảnh nào trong Portfolio.</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Cột trái Hàng 3 (Phong cách) */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl p-5 shadow-sm h-full">
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Phong cách</h3>
              <div className="flex flex-wrap gap-2">
                {selectedStyles.length > 0 ? (
                  selectedStyles.map((style) => (
                    <span key={style} className="px-2.5 py-1 font-bold text-xs rounded-lg border bg-indigo-50 text-indigo-600 border-indigo-200">
                      {style}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-gray-400 italic">Chưa cập nhật</span>
                )}
              </div>
            </div>
          </div>

          {/* Cột phải Hàng 3 (Đánh giá từ khách hàng) */}
          <div className="lg:col-span-9">
            <div className="bg-white rounded-2xl p-6 shadow-sm h-full flex flex-col justify-between">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Đánh giá từ các Shop</h3>
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  <span className="text-sm font-black text-gray-900">{creator.stats.averageRating > 0 ? creator.stats.averageRating : "—"}</span>
                  <span className="text-xs text-gray-400">({creator.stats.reviewCount} đánh giá)</span>
                </div>
              </div>
              
              <div className="space-y-4">
                {creator.reviews && creator.reviews.length > 0 ? (
                  creator.reviews.map((review) => (
                    <div key={review.id} className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                      <p className="text-sm text-gray-700 italic mb-3 leading-relaxed">
                        "{review.content}"
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center font-black text-indigo-600 text-sm">
                            {review.shopAvatar}
                          </div>
                          <div>
                            <h4 className="text-xs font-bold text-gray-900">{review.shopName}</h4>
                            <p className="text-[10px] text-gray-500">Đánh giá vào {review.createdAt}</p>
                          </div>
                        </div>
                        <div className="flex gap-0.5 text-yellow-400">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star 
                              key={i} 
                              size={12} 
                              fill={i < review.rating ? "#eab308" : "none"} 
                              color="#eab308" 
                              style={{ opacity: i < review.rating ? 1 : 0.25 }}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-400 italic text-center py-6">
                    KOL/KOC này chưa có đánh giá nào từ các Shop đã hợp tác.
                  </p>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* View All Gallery Images Modal */}
      {isViewAllOpen && (
        <div className="fixed inset-0 z-[120] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-5xl w-full shadow-2xl transform transition-all flex flex-col max-h-[85vh]">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-4">
              <div>
                <h3 className="text-lg font-bold text-gray-900">Tất cả hình ảnh</h3>
                <p className="text-xs text-gray-500 mt-1">Tổng cộng {displayGallery.length} hình ảnh</p>
              </div>
              <button onClick={() => setIsViewAllOpen(false)} className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center text-gray-500 hover:text-gray-900 transition cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto pr-1">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                {displayGallery.map((img, idx) => (
                  <div key={idx} className="group relative rounded-2xl overflow-hidden aspect-square border border-gray-100 bg-gray-50">
                    <img
                      src={img}
                      alt={`Gallery ${idx}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500 cursor-zoom-in"
                      onClick={() => setLightboxImage(img)}
                      onError={(e) => { e.target.src = 'https://placehold.co/400?text=Lỗi+Ảnh' }}
                    />
                  </div>
                ))}
              </div>
            </div>
            <div className="border-t border-gray-100 pt-4 mt-4 flex justify-end">
              <button onClick={() => setIsViewAllOpen(false)} className="px-5 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-xl shadow-md transition cursor-pointer">
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Lightbox Preview Modal */}
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

      <InviteCastingModal
        isOpen={inviteModalOpen}
        onClose={() => {
          setInviteModalOpen(false);
          // Refresh invite status
          checkHasInvited(params.id).then(res => {
            if (res.success) setHasInvited(res.data);
          });
        }}
        creatorId={params.id}
        creatorName={creator?.name}
      />
    </div>
  );
}
