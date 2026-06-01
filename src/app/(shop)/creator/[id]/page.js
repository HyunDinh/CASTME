"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";

export default function CreatorProfilePage() {
  const router = useRouter();
  const params = useParams();
  const [activeTab, setActiveTab] = useState("portfolio");
  
  const [creator, setCreator] = useState(null);
  const [loading, setLoading] = useState(true);

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
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-gray-500 font-medium">Đang tải hồ sơ...</p>
      </div>
    );
  }

  if (!creator) {
    return (
      <div className="w-full max-w-5xl mx-auto h-screen flex flex-col items-center justify-center">
        <span className="text-6xl mb-4">😢</span>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Không tìm thấy Creator</h2>
        <p className="text-gray-500 mb-6">Hồ sơ này không tồn tại hoặc đã bị xóa.</p>
        <button onClick={() => router.back()} className="px-6 py-2 bg-blue-600 text-white font-bold rounded-xl shadow-lg">
          Quay lại
        </button>
      </div>
    );

  return (
    <div className="w-full max-w-5xl mx-auto pb-20">
      
      {/* 1. Nút Back */}
      <button 
        onClick={() => router.back()}
        className="mb-6 flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-gray-900 transition-colors"
      >
        ← Quay lại
      </button>

      {/* 2. HERO SECTION */}
      <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 relative">
        {/* Cover Image */}
        <div className="h-64 md:h-80 w-full relative">
          <img src={creator.coverImage} alt="Cover" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        </div>

        {/* Info Box over Cover */}
        <div className="absolute top-4 right-4 flex gap-2">
          <button className="bg-white/20 hover:bg-white/40 backdrop-blur-md p-2.5 rounded-full text-white transition">
            🔗
          </button>
          <button className="bg-white/20 hover:bg-white/40 backdrop-blur-md p-2.5 rounded-full text-white transition">
            ❤️
          </button>
        </div>

        {/* Profile Details Container */}
        <div className="px-6 md:px-10 pb-10 relative -mt-20 flex flex-col md:flex-row gap-6 items-end">
          {/* Avatar */}
          <div className="w-32 h-32 md:w-40 md:h-40 rounded-3xl p-1.5 bg-white shadow-xl flex-shrink-0 z-10">
            <img src={creator.avatar} alt={creator.name} className="w-full h-full object-cover rounded-2xl" />
          </div>

          {/* Name & Basic Info */}
          <div className="flex-1 mb-2">
            <h1 className="text-3xl md:text-4xl font-black text-gray-900 mb-2">{creator.name}</h1>
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 font-medium">
              <span className="flex items-center gap-1">📍 {creator.location}</span>
              <span className="flex items-center gap-1 bg-yellow-50 text-yellow-700 px-2.5 py-1 rounded-lg border border-yellow-200">
                ⭐ {creator.stats.averageRating} ({creator.stats.reviewCount} đánh giá)
              </span>
            </div>
          </div>

          {/* Call to action */}
          <div className="w-full md:w-auto flex flex-col sm:flex-row gap-3 mt-4 md:mt-0">
            <button className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-900 font-bold rounded-xl transition cursor-pointer">
              💬 Nhắn tin
            </button>
            <button className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-200 transition cursor-pointer">
              Gửi lời mời Casting
            </button>
          </div>
        </div>
      </div>

      {/* 3. MAIN CONTENT (STATS & BIO) */}
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column (Stats & Sidebar info) */}
        <div className="flex flex-col gap-6">
          {/* Stats Box */}
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm grid grid-cols-2 gap-4 text-center">
            <div className="p-4 bg-gray-50 rounded-2xl">
              <div className="text-2xl font-black text-blue-600">{creator.stats.followers}</div>
              <div className="text-xs text-gray-500 font-semibold uppercase mt-1">Người theo dõi</div>
            </div>
            <div className="p-4 bg-gray-50 rounded-2xl">
              <div className="text-2xl font-black text-gray-900">{creator.stats.jobsCompleted}</div>
              <div className="text-xs text-gray-500 font-semibold uppercase mt-1">Job hoàn thành</div>
            </div>
            <div className="p-4 bg-gray-50 rounded-2xl col-span-2">
              <div className="text-lg font-black text-gray-900">{creator.priceRange}</div>
              <div className="text-xs text-gray-500 font-semibold uppercase mt-1">Ngân sách tham khảo</div>
            </div>
          </div>

          {/* Social Links */}
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">Kênh truyền thông</h3>
            <div className="flex flex-col gap-3">
              {creator.socials.map((s, i) => (
                <a key={i} href={s.link} className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 border border-transparent hover:border-gray-100 transition group">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{s.icon}</span>
                    <span className="font-semibold text-gray-700 group-hover:text-blue-600 transition">{s.platform}</span>
                  </div>
                  <span className="text-sm font-bold text-gray-900">{s.followers}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Styles */}
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">Phong cách & Ngành hàng</h3>
            <div className="flex flex-wrap gap-2">
              {creator.styles.map((style, idx) => (
                <span key={idx} className="px-3 py-1.5 bg-blue-50 text-blue-700 font-bold text-xs rounded-lg border border-blue-100">
                  {style}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column (Tabs: Portfolio & Reviews) */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          
          {/* Bio */}
          <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
            <h2 className="text-xl font-black text-gray-900 mb-4">Giới thiệu</h2>
            <p className="text-gray-600 leading-relaxed">
              {creator.bio}
            </p>
          </div>

          {/* Tabs Container */}
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
            {/* Tab Headers */}
            <div className="flex border-b border-gray-100">
              <button 
                onClick={() => setActiveTab("portfolio")}
                className={`flex-1 py-4 text-sm font-bold uppercase tracking-wider transition cursor-pointer ${activeTab === 'portfolio' ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/30' : 'text-gray-500 hover:bg-gray-50'}`}
              >
                Portfolio & Hình ảnh
              </button>
              <button 
                onClick={() => setActiveTab("reviews")}
                className={`flex-1 py-4 text-sm font-bold uppercase tracking-wider transition cursor-pointer ${activeTab === 'reviews' ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/30' : 'text-gray-500 hover:bg-gray-50'}`}
              >
                Đánh giá từ Shop ({creator.stats.reviewCount})
              </button>
            </div>

            {/* Tab Content */}
            <div className="p-8">
              
              {/* PORTFOLIO TAB */}
              {activeTab === "portfolio" && (
                <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
                  {creator.gallery.map((img, idx) => (
                    <div key={idx} className="group relative rounded-2xl overflow-hidden aspect-square border border-gray-100 cursor-pointer">
                      <img src={img} alt={`Gallery ${idx}`} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition duration-300"></div>
                    </div>
                  ))}
                  {/* Nếu portfolioUrl là video hoặc link ngoài, có thể thêm vào đây */}
                </div>
              )}

              {/* REVIEWS TAB */}
              {activeTab === "reviews" && (
                <div className="flex flex-col gap-6">
                  {creator.reviews.map((review) => (
                    <div key={review.id} className="pb-6 border-b border-gray-100 last:border-0 last:pb-0">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-xl">
                            {review.shopAvatar}
                          </div>
                          <div>
                            <h4 className="font-bold text-gray-900">{review.shopName}</h4>
                            <span className="text-xs text-gray-400">{review.createdAt}</span>
                          </div>
                        </div>
                        <div className="flex gap-1 text-yellow-400 text-sm">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <span key={i} className={i < review.rating ? "opacity-100" : "opacity-30 grayscale"}>⭐</span>
                          ))}
                        </div>
                      </div>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        "{review.content}"
                      </p>
                    </div>
                  ))}
                  
                  <button className="w-full py-3 bg-gray-50 hover:bg-gray-100 text-gray-700 font-bold rounded-xl transition cursor-pointer">
                    Xem thêm đánh giá
                  </button>
                </div>
              )}

            </div>
          </div>

        </div>
      </div>

    </div>
  );
}
