// src/app/(landing)/layout.js
import Link from 'next/link';

export default function LandingLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-900 antialiased selection:bg-purple-500 selection:text-white">
      {/* HEADER / NAVBAR */}
      <header className="border-b border-gray-100 px-6 sm:px-12 py-4 flex justify-between items-center fixed w-full bg-white/80 backdrop-blur-md z-50 transition-all">
        {/* Logo */}
        <Link href="/" className="text-2xl font-black text-purple-600 tracking-wider flex items-center gap-1">
          castme<span className="text-pink-500">.</span>
        </Link>

        {/* Menu nhanh để người dùng kéo xuống xem */}
        <nav className="hidden md:flex items-center space-x-8 text-sm font-medium text-gray-600">
          <a href="#features" className="hover:text-purple-600 transition">Tính năng</a>
          <a href="#ai-matching" className="hover:text-purple-600 transition">AI Matching</a>
          <a href="#pricing" className="hover:text-purple-600 transition">Bảng giá</a>
        </nav>

        {/* Cụm nút Auth */}
        <div className="flex items-center space-x-4">
          <Link href="/login" className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-purple-600 transition">
            Đăng nhập
          </Link>
          <Link href="/register" className="px-5 py-2 text-sm font-medium text-white bg-purple-600 rounded-full hover:bg-purple-700 transition shadow-sm hover:shadow-purple-200">
            Dùng thử miễn phí
          </Link>
        </div>
      </header>

      {/* NỘI DUNG CHÍNH CỦA PAGE */}
      <main className="flex-1 pt-16">
        {children}
      </main>

      {/* FOOTER */}
      <footer className="bg-gray-50 border-t border-gray-100 py-8 px-6 text-center text-sm text-gray-500">
        <p>© 2026 Castme Inc. Hệ thống kết nối thông minh giữa Shop và Creators.</p>
      </footer>
    </div>
  );
}