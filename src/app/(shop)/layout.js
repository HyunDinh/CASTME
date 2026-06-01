// src/app/(shop)/layout.js
"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

// Static styles for suggestion
const STATIC_STYLES = [
  { type: 'style', name: 'Food Review', icon: '🍔' },
  { type: 'style', name: 'Model', icon: '👗' },
  { type: 'style', name: 'Beauty', icon: '💄' },
  { type: 'style', name: 'Tech', icon: '💻' },
  { type: 'style', name: 'Travel', icon: '✈️' },
];

export default function ShopLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  
  const [searchCreator, setSearchCreator] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const [creatorSuggestions, setCreatorSuggestions] = useState([]);
  const searchContainerRef = useRef(null);

  // Debounce API call for searching creators
  useEffect(() => {
    const fetchCreators = async () => {
      if (searchCreator.trim() === "") {
        setCreatorSuggestions([]);
        return;
      }

      setLoading(true);
      try {
        const res = await fetch(`/api/creators/search?q=${encodeURIComponent(searchCreator)}`);
        const result = await res.json();
        if (result.success) {
          setCreatorSuggestions(result.data.map(creator => ({
            ...creator,
            type: 'creator',
            style: creator.styles?.length > 0 ? creator.styles.join(', ') : 'Chưa cập nhật'
          })));
        }
      } catch (error) {
        console.error("Error fetching creators:", error);
      } finally {
        setLoading(false);
      }
    };

    const debounceTimer = setTimeout(() => {
      fetchCreators();
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchCreator]);

  const styleSuggestions = searchCreator.trim() === "" 
    ? [] 
    : STATIC_STYLES.filter(item => 
        item.name.toLowerCase().includes(searchCreator.toLowerCase())
      );

  const filteredSuggestions = [...styleSuggestions, ...creatorSuggestions];

  useEffect(() => {
    function handleClickOutside(event) {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelectSuggestion = (suggestion) => {
    setSearchCreator(suggestion.name);
    setShowDropdown(false);
    if (suggestion.type === 'style') {
      router.push(`/search-creator?style=${encodeURIComponent(suggestion.name)}`);
    } else {
      router.push(`/search-creator?q=${encodeURIComponent(suggestion.name)}`);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && searchCreator.trim() !== "") {
      setShowDropdown(false);
      router.push(`/search-creator?q=${encodeURIComponent(searchCreator.trim())}`);
    }
  };

  // Menu theo yêu cầu của bạn
  const menuItems = [
    { name: "📊 Tổng quan Shop", path: "/shop-dashboard" },
    { name: "📝 Hồ sơ Cửa Hàng", path: "/shop-profile" },
    { name: "�📢 Quản lý Casting", path: "/my-casting" },
    { name: "💬 Tin nhắn", path: "/messages" },
    { name: "💳 Lịch sử giao dịch", path: "/transactions" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col antialiased text-gray-900">
      {/* 1. TOP NAVBAR */}
      <header className="sticky top-0 z-40 w-full bg-white border-b border-gray-100 px-6 py-3 flex items-center justify-between shadow-xs">
        {/* Logo */}
        <div className="flex items-center gap-8">
          <Link href="/shop-dashboard" className="text-2xl font-black text-blue-600 tracking-wider">
            castme.
          </Link>
          
          {/* Thanh tìm kiếm Creator */}
          <div ref={searchContainerRef} className="relative hidden md:block w-80 z-50">
            <div className="flex items-center bg-gray-50 border border-gray-200 rounded-xl px-3 py-1.5 focus-within:border-blue-500 focus-within:bg-white transition-all">
              <span className="text-gray-400 text-sm mr-2">🔍</span>
              <input
                type="text"
                placeholder="Tìm KOL/Creator (vđ: food review, model...)"
                className="bg-transparent text-sm w-full focus:outline-none"
                value={searchCreator}
                onChange={(e) => {
                  setSearchCreator(e.target.value);
                  setShowDropdown(true);
                }}
                onFocus={() => {
                  if (searchCreator.trim() !== "") setShowDropdown(true);
                }}
                onKeyDown={handleKeyDown}
              />
              {searchCreator && (
                <button 
                  onClick={() => {
                    setSearchCreator("");
                    setShowDropdown(false);
                  }}
                  className="text-gray-400 hover:text-gray-600 focus:outline-none ml-2"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Dropdown Kết quả */}
            {showDropdown && searchCreator.trim() !== "" && (
              <div className="absolute top-full mt-2 w-full bg-white rounded-xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)] border border-gray-100 overflow-hidden max-h-[400px] overflow-y-auto">
                {loading ? (
                  <div className="px-4 py-8 text-center text-gray-500 text-sm flex flex-col items-center">
                    <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mb-2"></div>
                    Đang tìm kiếm...
                  </div>
                ) : filteredSuggestions.length > 0 ? (
                  <div className="py-2">
                    {/* Phân nhóm gợi ý Style */}
                    {filteredSuggestions.filter(s => s.type === 'style').length > 0 && (
                      <div className="mb-2">
                        <div className="px-4 py-2 text-[10px] font-bold text-gray-400 uppercase tracking-wider bg-gray-50/50">
                          Phong cách / Ngành hàng
                        </div>
                        {filteredSuggestions.filter(s => s.type === 'style').map((item, idx) => (
                          <div 
                            key={`style-${idx}`}
                            onClick={() => handleSelectSuggestion(item)}
                            className="px-4 py-2.5 hover:bg-blue-50 flex items-center gap-3 cursor-pointer transition-colors"
                          >
                            <span className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-lg">
                              {item.icon}
                            </span>
                            <span className="text-sm font-medium text-gray-700">{item.name}</span>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    {/* Phân nhóm gợi ý Creator */}
                    {filteredSuggestions.filter(s => s.type === 'creator').length > 0 && (
                      <div>
                        <div className="px-4 py-2 text-[10px] font-bold text-gray-400 uppercase tracking-wider bg-gray-50/50 border-t border-gray-50">
                          Creator / KOL
                        </div>
                        {filteredSuggestions.filter(s => s.type === 'creator').map((item, idx) => (
                          <div 
                            key={`creator-${idx}`}
                            onClick={() => handleSelectSuggestion(item)}
                            className="px-4 py-2.5 hover:bg-blue-50 flex items-center gap-3 cursor-pointer transition-colors"
                          >
                            <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold shrink-0 overflow-hidden">
                              {item.avatar && item.avatar.length > 1 ? (
                                <img src={item.avatar} alt={item.name} className="w-full h-full object-cover" />
                              ) : (
                                item.avatar
                              )}
                            </div>
                            <div className="flex flex-col">
                              <span className="text-sm font-medium text-gray-900">{item.name}</span>
                              <span className="text-[11px] text-gray-500 line-clamp-1">{item.style}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="px-4 py-8 text-center text-gray-500 text-sm flex flex-col items-center">
                    <span className="text-3xl mb-3">🤔</span>
                    Không tìm thấy kết quả nào phù hợp với <br/> <strong className="text-gray-900 mt-1">"{searchCreator}"</strong>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Cụm Action bên phải */}
        <div className="flex items-center gap-4">
          {/* Thông báo */}
          <button className="p-2 hover:bg-gray-100 rounded-xl relative cursor-pointer transition">
            <span className="text-xl">🔔</span>
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          {/* Cài đặt tài khoản Shop */}
          <button 
            onClick={() => router.push("/shop-settings")}
            className="p-2 hover:bg-gray-100 rounded-xl text-xl cursor-pointer transition"
            title="Cài đặt thông tin Shop"
          >
            ⚙️
          </button>

          {/* Avatar & Gói cước Shop */}
          <div className="flex items-center gap-3 border-l border-gray-200 pl-4">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-bold text-gray-900">Brand Name</p>
              <span className="inline-block text-[10px] font-bold px-1.5 py-0.5 bg-blue-50 text-blue-700 rounded border border-blue-200">
                DOANH NGHIỆP
              </span>
            </div>
            <div className="w-9 h-9 bg-blue-100 text-blue-600 font-bold flex items-center justify-center rounded-xl border border-blue-200 text-sm shadow-xs">
              B
            </div>
          </div>
        </div>
      </header>

      {/* 2. MAIN BODY (SIDEBAR + CONTENT) */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r border-gray-100 p-4 flex flex-col gap-1 hidden lg:flex">
          <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400 px-3 mb-2">Menu Shop</p>
          {menuItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <Link
                key={item.path}
                href={item.path}
                className={`flex items-center px-4 py-3 text-sm font-medium rounded-xl transition ${
                  isActive
                    ? "bg-blue-600 text-white font-bold shadow-md shadow-blue-100"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                {item.name}
              </Link>
            );
          })}
          
          {/* NÚT ĐĂNG XUẤT ĐƯỢC THÊM VÀO ĐÂY */}
          <button
            onClick={() => {
              // TODO: Gọi logic xóa token/cookie hoặc signOut() tại đây
              console.log("Shop đang đăng xuất...");
              router.push("/login");
            }}
            className="flex items-center px-4 py-3 text-sm font-medium rounded-xl text-red-600 hover:bg-red-50 hover:text-red-700 transition cursor-pointer mt-2"
          >
            🚪 Đăng xuất
          </button>

          {/* Ví Số dư (Thay cho Quỹ trái tim của Creator) */}
          <div className="mt-auto bg-blue-50 rounded-2xl p-4 border border-blue-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-blue-800">Số dư ví</span>
              <span className="text-sm font-black text-blue-700">💎 1.5M</span>
            </div>
            <p className="text-[11px] text-blue-600/80 mb-3 leading-relaxed">
              Dùng để đăng thêm chiến dịch Casting hoặc mở khóa thông tin liên hệ KOL.
            </p>
            <button className="w-full py-2 bg-white text-blue-600 hover:bg-blue-100 text-xs font-bold rounded-xl border border-blue-200 shadow-xs transition cursor-pointer text-center">
              + Nạp thêm tiền
            </button>
          </div>
        </aside>

        {/* Nội dung trang con thay đổi */}
        <main 
          className={`flex-1 w-full ${
            pathname.startsWith("/messages")
              ? "overflow-hidden flex flex-col"
              : "p-6 md:p-8 max-w-7xl mx-auto overflow-y-auto"
          }`}
        >
          {children}
        </main>
      </div>
    </div>
  );
}