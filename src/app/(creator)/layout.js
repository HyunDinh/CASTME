"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import RechargeHeartsModal from "./RechargeHeartsModal";
import { getUserHearts } from "#/app/(creator)/actions";

export default function CreatorLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();

  const [hearts, setHearts] = useState(0);
  const [showRechargeModal, setShowRechargeModal] = useState(false);
  const [loadingHearts, setLoadingHearts] = useState(true);

  const fetchHearts = async () => {
    const result = await getUserHearts();
    if (result.success) {
      setHearts(result.data.hearts);
    }
    setLoadingHearts(false);
  };

  useEffect(() => {
    fetchHearts();
  }, []);

  const menuItems = [
    { name: "🏠 Khám phá Job", path: "/creator-dashboard" },
    { name: "💼 Việc của tôi", path: "/my-jobs" },
    { name: "💰 Doanh thu", path: "/revenue" },
    { name: "📂 Portfolio", path: "/profile" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col antialiased text-gray-900">
      {/* TOP NAVBAR */}
      <header className="sticky top-0 z-40 w-full bg-white border-b border-gray-100 px-6 py-3 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-8">
          <Link href="/creator-dashboard" className="text-2xl font-black text-purple-600 tracking-wider">
            castme.
          </Link>
          <div className="hidden md:flex items-center bg-gray-50 border border-gray-200 rounded-xl px-3 py-1.5 w-80 focus-within:border-purple-500 focus-within:bg-white transition-all">
            <span className="text-gray-400 text-sm mr-2">🔮</span>
            <input
              type="text"
              placeholder="Tìm kiếm theo vibe (ví dụ: phố cổ, găng tơ...)"
              className="bg-transparent text-sm w-full focus:outline-none"
            />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button className="p-2 hover:bg-gray-100 rounded-xl relative cursor-pointer transition">
            <span className="text-xl">🔔</span>
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          <button
            onClick={() => router.push("/profile")}
            className="p-2 hover:bg-gray-100 rounded-xl text-xl cursor-pointer transition"
            title="Portfolio"
          >
            ⚙️
          </button>

          {/* Ví Trái Tim */}
          <div 
            onClick={() => setShowRechargeModal(true)}
            className="flex items-center gap-2 bg-purple-50 border border-purple-100 hover:bg-purple-100 px-4 py-2 rounded-2xl cursor-pointer transition"
          >
            <span className="text-xl">❤️</span>
            <div className="text-right">
              <p className="text-sm font-bold text-purple-700">
                {loadingHearts ? "..." : hearts} Tim
              </p>
              <p className="text-[10px] text-purple-600">Nạp thêm</p>
            </div>
          </div>

          <div className="w-9 h-9 bg-purple-100 text-purple-600 font-bold flex items-center justify-center rounded-xl border border-purple-200 text-sm shadow-xs cursor-pointer">
            K
          </div>
        </div>
      </header>

      {/* MAIN BODY */}
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

          {/* NÚT ĐĂNG XUẤT - ĐÃ KHÔI PHỤC */}
          <button
            onClick={() => {
              console.log("Đăng xuất...");
              router.push("/login");
            }}
            className="flex items-center px-4 py-3 text-sm font-medium rounded-xl text-red-600 hover:bg-red-50 hover:text-red-700 transition cursor-pointer mt-6"
          >
            🚪 Đăng xuất
          </button>

          {/* Ví Trái Tim trong Sidebar */}
          <div 
            onClick={() => setShowRechargeModal(true)}
            className="mt-auto bg-purple-50 rounded-2xl p-4 border border-purple-100 cursor-pointer hover:bg-purple-100 transition"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-purple-800">Quỹ Trái tim</span>
              <span className="text-sm font-black text-purple-700">❤️ {hearts}</span>
            </div>
            <p className="text-[11px] text-purple-600/80 mb-3 leading-relaxed">
              Mỗi lượt kết nối ứng tuyển với Shop sẽ tiêu tốn 5 trái tim.
            </p>
            <button className="w-full py-2 bg-white text-purple-600 hover:bg-purple-100 text-xs font-bold rounded-xl border border-purple-200 shadow-xs transition cursor-pointer text-center">
              + Nạp thêm Tim
            </button>
          </div>
        </aside>

        {/* Nội dung trang */}
        <main className="flex-1 p-6 md:p-8 max-w-7xl mx-auto w-full overflow-y-auto">
          {children}
        </main>
      </div>

      {/* Modal Nạp Tim */}
      <RechargeHeartsModal 
        isOpen={showRechargeModal} 
        onClose={() => {
          setShowRechargeModal(false);
          window.location.reload(); // Refresh để cập nhật số Tim
        }} 
      />
    </div>
  );
}