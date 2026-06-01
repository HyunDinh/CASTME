"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";

function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const q = searchParams.get("q") || "";
  const style = searchParams.get("style") || "";
  
  const [creators, setCreators] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams();
        if (q) queryParams.append("q", q);
        if (style) queryParams.append("style", style);

        const res = await fetch(`/api/creators/search?${queryParams.toString()}`);
        const result = await res.json();
        
        if (result.success) {
          setCreators(result.data);
        }
      } catch (error) {
        console.error("Lỗi khi tìm kiếm:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [q, style]);

  return (
    <div className="w-full">
      {/* HEADER SECTION */}
      <div className="mb-8 bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-2xl font-black text-gray-900 mb-2">Kết quả tìm kiếm</h1>
          <p className="text-gray-500 text-sm">
            {q && style ? (
              <span>Tìm kiếm cho từ khoá <strong className="text-blue-600">"{q}"</strong> và ngành hàng <strong className="text-blue-600">{style}</strong></span>
            ) : q ? (
              <span>Tìm kiếm cho từ khoá <strong className="text-blue-600">"{q}"</strong></span>
            ) : style ? (
              <span>Khám phá các Creator thuộc ngành hàng <strong className="text-blue-600">{style}</strong></span>
            ) : (
              <span>Tất cả Creator</span>
            )}
          </p>
        </div>
        
        {/* Nút quay lại hoặc xoá bộ lọc */}
        {(q || style) && (
          <button 
            onClick={() => router.push('/search-creator')}
            className="px-4 py-2 bg-gray-100 text-gray-700 hover:bg-gray-200 text-sm font-semibold rounded-xl transition-colors whitespace-nowrap cursor-pointer"
          >
            Xoá bộ lọc ✕
          </button>
        )}
      </div>

      {/* RESULTS SECTION */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-500 font-medium">Đang tải dữ liệu...</p>
        </div>
      ) : creators.length > 0 ? (
        <div className="flex flex-col gap-6">
          {creators.map((creator) => (
            <div 
              key={creator.id} 
              className="group bg-white rounded-3xl p-6 shadow-sm border border-gray-200 hover:shadow-md hover:border-blue-200 transition-all flex flex-col sm:flex-row items-start sm:items-center gap-6"
            >
              {/* Avatar Box */}
              <div className="relative shrink-0">
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center text-3xl font-black text-gray-400 shadow-sm border border-gray-100">
                  {creator.avatar && creator.avatar.length > 1 ? (
                    <img src={creator.avatar} alt={creator.name} className="w-full h-full object-cover" />
                  ) : (
                    creator.avatar
                  )}
                </div>
                {/* Online Indicator */}
                <div className="absolute bottom-1 right-3 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
              </div>
              
              {/* Content Box */}
              <div className="flex-1 w-full flex flex-col sm:flex-row gap-4 justify-between sm:items-center">
                
                {/* Info (Left) */}
                <div className="flex flex-col gap-3 max-w-2xl">
                  <div className="flex flex-wrap items-center gap-3">
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-700 transition-colors">
                      {creator.name}
                    </h3>
                    {creator.reviewCount > 0 && (
                      <div className="flex items-center gap-1 bg-yellow-50 px-2.5 py-0.5 rounded-full border border-yellow-200">
                        <span className="text-xs">⭐</span>
                        <span className="text-xs font-bold text-yellow-700">{creator.averageRating}</span>
                        <span className="text-[10px] text-yellow-600">({creator.reviewCount})</span>
                      </div>
                    )}
                  </div>
                  
                  {/* Styles Badges */}
                  <div className="flex flex-wrap gap-2">
                    {creator.styles && creator.styles.length > 0 ? (
                      creator.styles.map((s, idx) => (
                        <span key={idx} className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-blue-600 rounded-full">
                          {s}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-gray-400 italic">Chưa cập nhật phong cách</span>
                    )}
                  </div>
                  
                  <p className="text-sm text-gray-600 leading-relaxed line-clamp-2">
                    {creator.bio || "Creator này chưa cập nhật mô tả bản thân. Hãy nhấp để xem chi tiết hơn."}
                  </p>
                </div>
                
                {/* Actions (Right) */}
                <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between gap-6 shrink-0 mt-2 sm:mt-0">
                  <button className="text-gray-300 hover:text-red-500 transition-colors flex items-center justify-center cursor-pointer" title="Lưu Creator">
                    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
                    </svg>
                  </button>
                  
                  <Link 
                    href={`/creator/${creator.id}`}
                    className="flex items-center gap-1.5 text-sm font-bold text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    Xem hồ sơ <span className="text-lg">→</span>
                  </Link>
                </div>
                
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 flex flex-col items-center justify-center shadow-sm">
          <span className="text-6xl mb-6">🔍</span>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Không tìm thấy Creator nào</h3>
          <p className="text-gray-500 max-w-md mx-auto mb-8">
            Rất tiếc, chúng tôi không tìm thấy KOL/KOC nào phù hợp với yêu cầu tìm kiếm của bạn. Vui lòng thử lại với một từ khóa khác.
          </p>
          <button 
            onClick={() => router.push('/search-creator')}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-200 transition-all transform hover:scale-105 cursor-pointer"
          >
            Khám phá tất cả Creator
          </button>
        </div>
      )}
    </div>
  );
}

export default function SearchCreatorPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center py-20">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    }>
      <SearchContent />
    </Suspense>
  );
}
