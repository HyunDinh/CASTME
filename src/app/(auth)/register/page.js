// src/app/(auth)/register/page.js
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { registerAction } from "../actions"; // Import Action trực tiếp

export default function RegisterPage() {
  const router = useRouter();
  const [role, setRole] = useState("SHOP");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false); // State điều khiển Modal

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    formData.append("role", role);

    // Gọi trực tiếp hàm Backend qua Server Action
    const result = await registerAction(formData);

    if (result.error) {
      setError(result.error);
      setLoading(false);
    } else {
      setLoading(false);
      setShowSuccessModal(true); // Bật modal thông báo thành công thay vì dùng alert()
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12 relative">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <div className="text-center mb-8">
          <Link href="/" className="text-3xl font-black text-purple-600 tracking-wider">castme.</Link>
          <h2 className="mt-4 text-xl font-bold text-gray-900">Tạo tài khoản trải nghiệm 1 tháng free</h2>
        </div>

        {error && <div className="mb-4 p-3 text-sm text-red-600 bg-red-50 rounded-lg">{error}</div>}

        <form onSubmit={handleFormSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Tên hiển thị / Tên Shop</label>
            <input type="text" name="name" required className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-purple-500" placeholder="Nguyễn Văn A / Savage Studio" />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Địa chỉ Email</label>
            <input type="email" name="email" required className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-purple-500" placeholder="name@example.com" />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Mật khẩu</label>
            <input type="password" name="password" required className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-purple-500" placeholder="••••••••" />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Bạn tham gia với vai trò nào?</label>
            <div className="grid grid-cols-2 gap-4 mt-1">
              <button type="button" className={`py-3 text-sm font-medium rounded-xl border text-center transition ${role === "SHOP" ? "border-purple-600 bg-purple-50 text-purple-700 font-bold" : "border-gray-200 text-gray-600 hover:bg-gray-50"}`} onClick={() => setRole("SHOP")}>
                🏪 Chủ Shop / Brand
              </button>
              <button type="button" className={`py-3 text-sm font-medium rounded-xl border text-center transition ${role === "CREATOR" ? "border-purple-600 bg-purple-50 text-purple-700 font-bold" : "border-gray-200 text-gray-600 hover:bg-gray-50"}`} onClick={() => setRole("CREATOR")}>
                📸 KOC / KOL
              </button>
            </div>
          </div>

          <button type="submit" disabled={loading} className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-xl shadow-md transition disabled:bg-gray-400 mt-6 cursor-pointer">
            {loading ? "Đang xử lý..." : "Đăng ký tài khoản"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          Đã có tài khoản? <Link href="/login" className="text-purple-600 font-medium hover:underline">Đăng nhập</Link>
        </p>
      </div>

      {/* --- CẤU TRÚC MODAL THÔNG BÁO THÀNH CÔNG --- */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 text-center shadow-xl border border-gray-100 scale-up">
            <div className="w-16 h-16 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto text-3xl mb-4">
              ✓
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Đăng ký thành công!</h3>
            <p className="text-sm text-gray-500 mb-6">
              Tài khoản của bạn đã được khởi tạo trên Castme. Chào mừng bạn đến với chương trình trải nghiệm 1 tháng miễn phí!
            </p>
            <button
              onClick={() => router.push("/login")}
              className="w-full py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-xl transition shadow-md cursor-pointer"
            >
              Đi tới Đăng nhập
            </button>
          </div>
        </div>
      )}
    </div>
  );
}