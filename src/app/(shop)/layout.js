// src/app/(shop)/layout.js
"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

export default function ShopLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  
  // Thay vì tìm vibe, Shop sẽ tìm kiếm Creator/KOL
  const [searchCreator, setSearchCreator] = useState("");

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
          <div className="hidden md:flex items-center bg-gray-50 border border-gray-200 rounded-xl px-3 py-1.5 w-80 focus-within:border-blue-500 focus-within:bg-white transition-all">
            <span className="text-gray-400 text-sm mr-2">🔍</span>
            <input
              type="text"
              placeholder="Tìm KOL/Creator (vđ: food review, model...)"
              className="bg-transparent text-sm w-full focus:outline-none"
              value={searchCreator}
              onChange={(e) => setSearchCreator(e.target.value)}
            />
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