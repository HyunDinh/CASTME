// src/app/(landing)/page.js
import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="scroll-smooth">
      
      {/* 1. HERO SECTION */}
      <section className="relative px-6 py-20 sm:py-32 text-center max-w-4xl mx-auto flex flex-col items-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-xs font-semibold mb-6 animate-pulse">
          ✨ Trải nghiệm AI Độc Quyền tại Việt Nam
        </div>
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-gray-900 leading-tight">
          Kết nối <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-500">Shop & KOC/KOL</span> <br />
          Chuẩn Xác Theo Đúng "Vibe" của bạn
        </h1>
        <p className="mt-6 text-lg text-gray-600 max-w-2xl">
          Nền tảng đầu tiên ứng dụng AI thông minh tự động đọc hiểu bài tuyển dụng, quét phong cách cá nhân để gợi ý công việc phù hợp với tỷ lệ khớp lệnh lên tới 99%.
        </p>
        <div className="mt-10 flex flex-wrap gap-4 justify-center">
          <Link href="/register" className="px-8 py-4 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-full shadow-lg shadow-purple-200 transition transform hover:-translate-y-0.5">
            Bắt đầu 1 tháng dùng thử miễn phí
          </Link>
          <a href="#pricing" className="px-8 py-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-full transition">
            Xem bảng giá gói
          </a>
        </div>
      </section>

      {/* 2. FEATURES SECTION (Dành cho hai đối tượng khách hàng) */}
      <section id="features" className="py-20 bg-gray-50 border-y border-gray-100 px-6 sm:px-12">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-gray-900">Một Nền Tảng - Hai Giao Diện Tối Ưu</h2>
            <p className="text-gray-500 mt-2">Dù bạn là thương hiệu đi tìm gương mặt đại diện hay creator đi tìm job, Castme đều có không gian riêng cho bạn.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            {/* Hộp tính năng dành cho Shop */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition">
              <div className="w-12 h-12 bg-purple-100 text-purple-600 flex items-center justify-center rounded-xl text-xl font-bold mb-6">🏪</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Dành cho Shop & Nhãn hàng</h3>
              <ul className="space-y-3 text-gray-600 text-sm">
                <li className="flex items-center gap-2">✅ <strong>My Casting:</strong> Quản lý bài đăng tuyển dụng dễ dàng.</li>
                <li className="flex items-center gap-2">✅ <strong>Tìm kiếm theo Vibe:</strong> Bộ lọc thông minh thay vì tìm kiếm từ khóa khô khan.</li>
                <li className="flex items-center gap-2">✅ <strong>AI Matching:</strong> Tự động hiển thị danh sách "Người phù hợp với shop bạn".</li>
                <li className="flex items-center gap-2">✅ <strong>Recent Applications:</strong> Duyệt nhanh danh sách các creator vừa apply.</li>
              </ul>
            </div>

            {/* Hộp tính năng dành cho KOC/KOL */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition">
              <div className="w-12 h-12 bg-pink-100 text-pink-600 flex items-center justify-center rounded-xl text-xl font-bold mb-6">📸</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Dành cho KOC / KOL</h3>
              <ul className="space-y-3 text-gray-600 text-sm">
                <li className="flex items-center gap-2">✅ <strong>My Job:</strong> Theo dõi tiến độ các chiến dịch, công việc đã nhận.</li>
                <li className="flex items-center gap-2">✅ <strong>Portfolio & Feedback:</strong> Hồ sơ năng lực sạch đẹp tích hợp đánh giá từ Brand.</li>
                <li className="flex items-center gap-2">✅ <strong>AI Matching:</strong> Gợi ý "Shop có thể phù hợp với phong cách của bạn".</li>
                <li className="flex items-center gap-2">✅ <strong>Doanh thu minh bạch:</strong> Quản lý dòng tiền, rút tiền nhanh chóng.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 3. AI MATCHING DETAIL */}
      <section id="ai-matching" className="py-20 px-6 max-w-5xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Cơ chế AI Matching <br />Hoạt động như thế nào?
            </h2>
            <p className="mt-4 text-gray-600">
              Mỗi khi một KOL/KOC tạo tài khoản, hệ thống sẽ yêu cầu mô tả ngắn về bản thân (Phong cách yêu thích, Vibe chụp ảnh, tệp fan...).
            </p>
            <p className="mt-2 text-gray-600">
              Khi Shop đăng tuyển chiến dịch mới, AI của chúng tôi sẽ <strong>chạy ngầm tóm tắt nội dung bài tuyển dụng</strong>, sau đó so khớp dữ liệu theo thời gian thực. Kết quả hiển thị trực quan bằng <strong>tỷ lệ % phù hợp</strong> ngay trên màn hình của bạn.
            </p>
          </div>
          {/* Giả lập Giao diện AI Matching bằng CSS */}
          <div className="bg-gradient-to-tr from-purple-900 to-indigo-900 p-6 rounded-2xl text-white shadow-xl">
            <div className="flex justify-between items-center border-b border-white/10 pb-4 mb-4">
              <span className="text-xs text-purple-300">HỆ THỐNG ĐANG GỢI Ý JOB</span>
              <span className="bg-green-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">ACTIVE</span>
            </div>
            <div className="bg-white/10 p-4 rounded-xl border border-white/10 relative overflow-hidden">
              <div className="absolute top-3 right-3 bg-pink-500 text-white font-bold text-xs px-2 py-1 rounded-md">
                🎯 96% Khớp Vibe
              </div>
              <h4 className="font-bold text-lg">Chiến dịch BST Mùa Hè - Streetwear</h4>
              <p className="text-xs text-gray-300 mt-1">Shop: "Savage Studio"</p>
              <div className="mt-4 flex gap-2">
                <span className="text-[11px] bg-white/10 px-2 py-1 rounded">Minimalist</span>
                <span className="text-[11px] bg-white/10 px-2 py-1 rounded">Cá tính</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. PRICING SECTION */}
      <section id="pricing" className="py-20 bg-gray-50 border-t border-gray-100 px-6 sm:px-12">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-gray-900">Chi phí minh bạch, tối ưu dòng tiền</h2>
            <p className="text-gray-500 mt-2">Đăng ký ngay hôm nay để nhận 1 tháng dùng thử miễn phí đầy đủ tính năng.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 items-start">
            
            {/* Gói FREE - 1 tháng trải nghiệm */}
            <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm flex flex-col justify-between h-full">
              <div>
                <h3 className="text-lg font-bold text-gray-700">Trải Nghiệm Đầu</h3>
                <div className="mt-4 mb-2"><span className="text-4xl font-extrabold text-gray-900">0đ</span> <span className="text-gray-500">/tháng</span></div>
                <p className="text-xs text-purple-600 font-semibold mb-6">Miễn phí 1 tháng đầu tiên cho tài khoản mới</p>
                <ul className="space-y-3 text-sm text-gray-600 border-t border-gray-100 pt-6">
                  <li>• Thử nghiệm toàn bộ tính năng</li>
                  <li>• Nhận đề xuất AI Matching cơ bản</li>
                  <li>• Phí trung gian giao dịch: <strong>3%</strong></li>
                </ul>
              </div>
              <Link href="/register" className="mt-8 block text-center py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-xl transition">
                Đăng ký thử ngay
              </Link>
            </div>

            {/* Gói PRO - Tối ưu hiển thị */}
            <div className="bg-white p-8 rounded-2xl border-2 border-purple-600 shadow-md relative flex flex-col justify-between h-full">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-purple-600 text-white px-3 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider">
                Phổ biến nhất
              </div>
              <div>
                <h3 className="text-lg font-bold text-purple-700">Gói Pro</h3>
                <div className="mt-4 mb-2"><span className="text-4xl font-extrabold text-gray-900">49k</span> <span className="text-gray-500">/gói</span></div>
                <p className="text-xs text-gray-500 mb-6">Dành cho cá nhân và thương hiệu vừa nhỏ</p>
                <ul className="space-y-3 text-sm text-gray-600 border-t border-gray-100 pt-6">
                  <li>• <strong>Mở khóa bộ lọc nâng cao (Filter)</strong> thay thế hiển thị mặc định</li>
                  <li>• Nhận ngay <strong>20 lượt connect</strong> chiến dịch</li>
                  <li>• Phí trung gian giao dịch: <strong>3%</strong></li>
                </ul>
              </div>
              <Link href="/register" className="mt-8 block text-center py-3 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-xl transition shadow-md shadow-purple-100">
                Nâng cấp Pro
              </Link>
            </div>

            {/* Gói ULTRA - Đột phá chiến dịch */}
            <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm flex flex-col justify-between h-full">
              <div>
                <h3 className="text-lg font-bold text-gray-700">Gói Ultra</h3>
                <div className="mt-4 mb-2"><span className="text-4xl font-extrabold text-gray-900">99k</span> <span className="text-gray-500">/gói</span></div>
                <p className="text-xs text-gray-500 mb-6">Dành cho các chiến dịch bùng nổ liên tục</p>
                <ul className="space-y-3 text-sm text-gray-600 border-t border-gray-100 pt-6">
                  <li>• <strong>Mở khóa bộ lọc nâng cao (Filter)</strong> tối đa</li>
                  <li>• Nhận ngay <strong>50 lượt connect</strong> chiến dịch</li>
                  <li>• Ưu tiên hiển thị thuật toán AI</li>
                  <li>• Phí trung gian giao dịch: <strong>3%</strong></li>
                </ul>
              </div>
              <Link href="/register" className="mt-8 block text-center py-3 bg-gray-900 hover:bg-gray-800 text-white font-medium rounded-xl transition">
                Nâng cấp Ultra
              </Link>
            </div>

          </div>

          {/* Quy định về Tiền tệ phụ (Tim/Connect) */}
          <div className="mt-16 bg-purple-50 rounded-2xl p-6 md:p-8 max-w-3xl mx-auto border border-purple-100 text-center">
            <h4 className="font-bold text-purple-900 text-lg flex items-center justify-center gap-1">
              💖 Hệ thống Tim & Lượt Connect nội bộ
            </h4>
            <p className="text-sm text-purple-800/80 mt-2 max-w-xl mx-auto">
              Khi hết lượt connect có sẵn trong các gói, bạn có thể bổ sung bằng trái tim. Mỗi lượt kết nối (connect) sẽ tiêu hao <strong>5 trái tim</strong>.
            </p>
            <div className="mt-4 inline-block bg-white px-4 py-2 rounded-xl text-sm font-bold text-purple-700 border border-purple-200">
              Mức giá nạp tim cực hời: 5 tim / 3.000đ <span className="text-xs text-gray-400 font-normal">(Áp dụng cho mỗi đơn nạp trên 15.000đ)</span>
            </div>
          </div>

        </div>
      </section>

    </div>
  );
}