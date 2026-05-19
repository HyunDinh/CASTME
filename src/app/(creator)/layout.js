// src/app/(creator)/layout.js
"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

export default function CreatorLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [searchVibe, setSearchVibe] = useState("");

  const menuItems = [
    { name: "🏠 Khám phá Job", path: "/creator-dashboard" },
    { name: "💼 Việc của tôi", path: "/my-jobs" },
    { name: "💰 Doanh thu", path: "/revenue" },
    { name: "📂 Portfolio", path: "/profile" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col antialiased text-gray-900">
      {/* 1. TOP NAVBAR */}
      <header className="sticky top-0 z-40 w-full bg-white border-b border-gray-100 px-6 py-3 flex items-center justify-between shadow-xs">
        {/* Logo */}
        <div className="flex items-center gap-8">
          <Link href="/creator-dashboard" className="text-2xl font-black text-purple-600 tracking-wider">
            castme.
          </Link>
          
          {/* Thanh tìm kiếm theo Vibe */}
          <div className="hidden md:flex items-center bg-gray-50 border border-gray-200 rounded-xl px-3 py-1.5 w-80 focus-within:border-purple-500 focus-within:bg-white transition-all">
            <span className="text-gray-400 text-sm mr-2">🔮</span>
            <input
              type="text"
              placeholder="Tìm kiếm theo vibe (vđ: phố cổ, găng tơ...)"
              className="bg-transparent text-sm w-full focus:outline-none"
              value={searchVibe}
              onChange={(e) => setSearchVibe(e.target.value)}
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

          {/* Cài đặt tài khoản */}
          <button 
            onClick={() => router.push("/portfolio")}
            className="p-2 hover:bg-gray-100 rounded-xl text-xl cursor-pointer transition"
            title="Cài đặt tài khoản & Portfolio"
          >
            ⚙️
          </button>

          {/* Avatar & Gói cước */}
          <div className="flex items-center gap-3 border-l border-gray-200 pl-4">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-bold text-gray-900">KOL Trải Nghiệm</p>
              <span className="inline-block text-[10px] font-bold px-1.5 py-0.5 bg-amber-50 text-amber-700 rounded border border-amber-200">
                PRO (20 Connects)
              </span>
            </div>
            <div className="w-9 h-9 bg-purple-100 text-purple-600 font-bold flex items-center justify-center rounded-xl border border-purple-200 text-sm shadow-xs">
              K
            </div>
          </div>
        </div>
      </header>

      {/* 2. MAIN BODY (SIDEBAR + CONTENT) */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r border-gray-100 p-4 flex flex-col gap-1 hidden lg:flex">
          <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400 px-3 mb-2">Menu Creator</p>
          {menuItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <Link
                key={item.path}
                href={item.path}
                className={`flex items-center px-4 py-3 text-sm font-medium rounded-xl transition ${
                  isActive
                    ? "bg-purple-600 text-white font-bold shadow-md shadow-purple-100"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                {item.name}
              </Link>
            );
          })}
          
          {/* Ví Trái tim */}
          <div className="mt-auto bg-purple-50 rounded-2xl p-4 border border-purple-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-purple-800">Quỹ Trái tim</span>
              <span className="text-sm font-black text-purple-700">❤️ 45</span>
            </div>
            <p className="text-[11px] text-purple-600/80 mb-3 leading-relaxed">
              Mỗi lượt kết nối ứng tuyển với Shop sẽ tiêu tốn 5 trái tim.
            </p>
            <button className="w-full py-2 bg-white text-purple-600 hover:bg-purple-100 text-xs font-bold rounded-xl border border-purple-200 shadow-xs transition cursor-pointer text-center">
              + Nạp thêm Tim
            </button>
          </div>
        </aside>

        {/* Nội dung trang con thay đổi */}
        <main className="flex-1 p-6 md:p-8 max-w-7xl mx-auto w-full overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}