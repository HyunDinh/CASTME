// src/app/(auth)/login/page.js
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { loginAction } from "../actions"; // Import Action trực tiếp

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    
    // Gọi trực tiếp hàm đăng nhập xử lý trên Server!
    const result = await loginAction(formData);

    if (result.error) {
      setError(result.error);
      setLoading(false);
    } else {
      // Khi login thành công, Cookie bảo mật đã được set tự động từ Server
      if (result.role === "SHOP") {
        router.push("/shop-dashboard");
      } else if (result.role === "CREATOR") {
        router.push("/creator-dashboard");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <div className="text-center mb-8">
          <Link href="/" className="text-3xl font-black text-purple-600 tracking-wider">castme.</Link>
          <h2 className="mt-4 text-xl font-bold text-gray-900">Chào mừng bạn quay trở lại</h2>
        </div>

        {error && <div className="mb-4 p-3 text-sm text-red-600 bg-red-50 rounded-lg">{error}</div>}

        <form onSubmit={handleFormSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Địa chỉ Email</label>
            <input type="email" name="email" required className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-purple-500" placeholder="name@example.com" />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Mật khẩu</label>
            <input type="password" name="password" required className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-purple-500" placeholder="••••••••" />
          </div>

          <button type="submit" disabled={loading} className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-xl shadow-md transition disabled:bg-gray-400 mt-2">
            {loading ? "Đang xác thực..." : "Đăng nhập vào hệ thống"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          Chưa có tài khoản? <Link href="/register" className="text-purple-600 font-medium hover:underline">Đăng ký ngay</Link>
        </p>
      </div>
    </div>
  );
}