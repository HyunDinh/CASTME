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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {creators.map((creator) => (
            <div 
              key={creator.id} 
              className="group bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl hover:border-blue-200 transition-all duration-300 transform hover:-translate-y-1 flex flex-col"
            >
              <div className="h-24 bg-gradient-to-r from-blue-100 to-indigo-100 relative">
                {/* Avatar */}
                <div className="absolute -bottom-8 left-6 w-16 h-16 bg-white rounded-2xl p-1 shadow-md">
                  <div className="w-full h-full bg-blue-600 text-white rounded-xl flex items-center justify-center text-2xl font-black overflow-hidden">
                    {creator.avatar && creator.avatar.length > 1 ? (
                      <img src={creator.avatar} alt={creator.name} className="w-full h-full object-cover" />
                    ) : (
                      creator.avatar
                    )}
                  </div>
                </div>
              </div>
              
              <div className="pt-12 p-6 flex-1 flex flex-col">
                <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                  {creator.name}
                </h3>
                
                {/* Styles Badges */}
                <div className="flex flex-wrap gap-2 mt-3">
                  {creator.styles && creator.styles.length > 0 ? (
                    creator.styles.slice(0, 3).map((s, idx) => (
                      <span key={idx} className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide bg-blue-50 text-blue-600 rounded-lg">
                        {s}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-gray-400 italic">Chưa cập nhật phong cách</span>
                  )}
                  {creator.styles && creator.styles.length > 3 && (
                    <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide bg-gray-100 text-gray-600 rounded-lg">
                      +{creator.styles.length - 3}
                    </span>
                  )}
                </div>
                
                <p className="text-sm text-gray-500 mt-4 line-clamp-3 leading-relaxed flex-1">
                  {creator.bio || "Creator này chưa cập nhật mô tả bản thân. Bạn có thể xem hồ sơ chi tiết để biết thêm."}
                </p>
                
                {/* Actions */}
                <div className="mt-6 pt-4 border-t border-gray-50 flex items-center justify-between">
                  <Link 
                    href={`/creator/${creator.id}`}
                    className="text-sm font-bold text-blue-600 hover:text-blue-700"
                  >
                    Xem hồ sơ →
                  </Link>
                  <button className="w-8 h-8 rounded-full bg-gray-50 hover:bg-gray-100 flex items-center justify-center text-gray-500 transition-colors cursor-pointer" title="Lưu Creator">
                    ❤️
                  </button>
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
