import "./globals.css";

export const metadata = {
  title: "Castme - KOC & Shop Matching Platform",
  description: "Nền tảng kết nối Shop và KOC/KOL tối ưu bằng AI",
};

export default function RootLayout({ children }) {
  return (
    <html lang="vi">
      <body className="antialiased">
        {/* children ở đây chính là nội dung động của các trang con */}
        {children}
      </body>
    </html>
  );
}