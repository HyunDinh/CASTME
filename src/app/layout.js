import "./globals.css";

export const metadata = {
  title: "Castme — Kết nối Shop & KOL/KOC bằng AI",
  description:
    "Nền tảng creator economy đầu tiên tại Việt Nam ứng dụng AI tự động gợi ý sự phù hợp về vibe, phong cách và nội dung giữa Shop và KOL/KOC.",
  keywords: "castme, KOL, KOC, creator economy, AI matching, influencer marketing",
  verification: {
    google: "l7nt-SpLW9_GYn7guALZkqCPELFtlTvjJ4bGUdwqp8A",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="vi">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,400&family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}