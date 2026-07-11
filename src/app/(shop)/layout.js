// src/app/(shop)/layout.js
"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Store,
  Megaphone,
  MessageSquare,
  CreditCard,
  Bell,
  LogOut,
  Wallet,
  ChevronDown,
  Menu,
  X,
} from "lucide-react";
import { logoutAction, getSessionAction } from "../(auth)/actions";

const menuItems = [
  { name: "TRANG CHỦ", path: "/shop-dashboard", icon: LayoutDashboard },
  { name: "KHÁM PHÁ", path: "/search-creator" },
  { name: "HỒ SƠ CỬA HÀNG", path: "/shop-profile", icon: Store },
  { name: "QUẢN LÝ CASTING", path: "/my-casting", icon: Megaphone },
  { name: "TIN NHẮN", path: "/messages", icon: MessageSquare },
  { name: "GIAO DỊCH", path: "/transactions", icon: CreditCard },
  { name: "GIỚI THIỆU", path: "/" },
];

export default function ShopLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [session, setSession] = useState(null);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    async function loadSession() {
      const s = await getSessionAction();
      if (s) setSession(s);
    }
    loadSession();
  }, []);

  useEffect(() => {
    if (!showUserDropdown) return;
    const handleOutsideClick = (e) => {
      const container = document.getElementById("shop-profile-dropdown");
      if (container && !container.contains(e.target)) {
        setShowUserDropdown(false);
      }
    };
    document.addEventListener("click", handleOutsideClick);
    return () => document.removeEventListener("click", handleOutsideClick);
  }, [showUserDropdown]);

  const handleLogout = async () => {
    const res = await logoutAction();
    if (res.success) {
      router.push("/login");
      router.refresh();
    }
  };

  return (
    <div className={`shop-workspace ${pathname.startsWith("/messages") ? "messages-bg-override" : ""}`} style={{
      height: pathname.startsWith("/messages") ? "100vh" : "auto",
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      fontFamily: "var(--font-body)",
      overflow: pathname.startsWith("/messages") ? "hidden" : "visible"
    }}>
      {/* ── DESKTOP HORIZONTAL HEADER (TOP NAV) ── */}
      <header style={{
        position: "fixed",
        top: 0, left: 0, right: 0,
        height: "72px",
        background: "rgba(255, 255, 255, 0.85)",
        borderBottom: "1px solid var(--border)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        zIndex: 100,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "0 2.5rem",
      }} className="desktop-header hidden-mobile">

        {/* Left: Brand Logo (Cố định chiều rộng, không tự co giãn bừa bãi) */}
        <div style={{ display: "flex", alignItems: "center", gap: "1.5rem", flex: "1", justifyContent: "flex-start", whiteSpace: "nowrap" }}>
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: "0.625rem", textDecoration: "none" }}>
            {/* Khung bọc ảnh logo */}
            <div style={{
              width: "36px",
              height: "36px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "50%",      // Bo tròn 100% thành hình tròn
              overflow: "hidden",       // Cắt bỏ phần ảnh dư thừa ra ngoài viền tròn
              border: "1px solid var(--border)" // Tùy chọn: Thêm viền mảnh nếu muốn
            }}>
              <img
                src="/logo.png"
                alt="CASTME Logo"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover" // Đổi từ contain sang cover để ảnh lấp đầy hình tròn
                }}
              />
            </div>
            <span style={{
              fontFamily: "var(--font-heading)",
              fontSize: "1.25rem",
              fontWeight: 800,
              letterSpacing: "0.04em",
              color: "var(--charcoal)",
            }}>CASTME</span>
            <span style={{
              fontSize: "0.55rem",
              fontWeight: 800,
              background: "rgba(37, 99, 235, 0.08)",
              color: "var(--electric)",
              padding: "0.15rem 0.5rem",
              borderRadius: "99px",
              marginLeft: "0.25rem",
              letterSpacing: "0.06em",
            }}>SHOP</span>
          </Link>
        </div>

        {/* Center: Navigation Capsule Menu (Tạo vùng đệm cách ly an toàn ở 2 đầu) */}
        <nav className="landing-nav-capsule glass-capsule-nav desktop-nav-menu" style={{
          display: "flex",
          alignItems: "center",
          gap: "0.25rem",
          flex: "0 1 auto",         // CHỈNH Ở ĐÂY: Thay "1 1 auto" thành "0 1 auto" để menu không bị phình to vô lý
          margin: "0 auto",         // CHỈNH Ở ĐÂY: Tự động căn giữa toàn bộ khối menu và đẩy đều khoảng trống sang 2 bên
          padding: "0.375rem",      // Tạo khoảng đệm nhẹ bên trong thanh capsule
          minWidth: 0,
        }}>
          {menuItems.map((item) => {
            const active = pathname === item.path;
            return (
              <Link
                key={item.path}
                href={item.path}
                className="desktop-nav-link"
                style={{
                  fontFamily: "var(--font-heading)",
                  fontSize: "0.8125rem",
                  fontWeight: active ? 700 : 600,
                  color: active ? "#c2410c" : "var(--charcoal)",
                  textDecoration: "none",
                  transition: "all 0.2s ease",
                  letterSpacing: "0.01em",
                  padding: "0.4375rem 1.125rem",
                  borderRadius: "999px",
                  whiteSpace: "nowrap",
                  ...(active ? {
                    background: "linear-gradient(135deg, rgba(255, 183, 130, 0.55) 0%, rgba(255, 140, 170, 0.4) 100%)",
                    border: "1px solid rgba(255, 154, 108, 0.35)",
                  } : {})
                }}
                onMouseEnter={(e) => {
                  if (!active) e.currentTarget.style.background = "rgba(255, 255, 255, 0.35)";
                }}
                onMouseLeave={(e) => {
                  if (!active) e.currentTarget.style.background = "transparent";
                }}
              >
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Right: User actions & settings (Cố định bên phải, không co kéo làm đè menu) */}
        <div style={{ display: "flex", alignItems: "center", gap: "1.125rem", flex: "1", justifyContent: "flex-end", whiteSpace: "nowrap" }}>
          {/* Wallet Status (Chỉ hiển thị số dư, đã bỏ nút Nạp) */}


          {/* Notification bell */}
          <button style={{ width: "36px", height: "36px", borderRadius: "50%", background: "rgba(255, 255, 255, 0.25)", border: "1px solid rgba(255, 255, 255, 0.4)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "var(--ash)", position: "relative" }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255, 255, 255, 0.45)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255, 255, 255, 0.25)"; }}
          >
            <Bell size={15} />
            <span style={{ position: "absolute", top: "8px", right: "8px", width: "6px", height: "6px", background: "var(--primary)", borderRadius: "50%" }} />
          </button>

          {/* Profile Dropdown */}
          <div id="shop-profile-dropdown" style={{ position: "relative" }}>
            <button
              onClick={() => setShowUserDropdown(!showUserDropdown)}
              style={{
                display: "flex", alignItems: "center", gap: "0.5rem",
                padding: "0.45rem 0.875rem", borderRadius: "var(--radius-full)",
                background: "rgba(255, 255, 255, 0.35)", border: "1.5px solid var(--charcoal)",
                fontSize: "0.8125rem", fontWeight: 700, color: "var(--charcoal)", cursor: "pointer",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255, 255, 255, 0.55)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255, 255, 255, 0.35)"; }}
            >
              <div style={{
                width: "20px", height: "20px",
                borderRadius: "50%",
                background: "linear-gradient(135deg, var(--primary) 0%, #9333ea 100%)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "0.6875rem",
                fontWeight: 700,
                color: "white",
              }}>
                {session?.name ? session.name[0].toUpperCase() : "B"}
              </div>
              <span style={{ maxWidth: "80px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {session?.name || "Brand Name"}
              </span>
              <ChevronDown size={12} style={{ transform: showUserDropdown ? "rotate(180deg)" : "none", transition: "transform 0.2s" }} />
            </button>
            {showUserDropdown && (
              <div className="animate-slide-down" style={{
                position: "absolute", top: "calc(100% + 8px)", right: 0,
                background: "rgba(15, 23, 42, 0.95)", border: "1px solid rgba(255, 255, 255, 0.08)",
                borderRadius: "var(--radius-lg)", boxShadow: "var(--shadow-lg)",
                padding: "0.5rem 0", minWidth: "180px", zIndex: 110,
                backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)"
              }}>
                <Link href="/shop-profile" style={{ display: "block", padding: "0.625rem 1rem", fontSize: "0.8125rem", color: "#e2e8f0", textDecoration: "none", fontWeight: 600, transition: "all 0.15s" }} onMouseEnter={(e) => { e.target.style.background = "rgba(255,255,255,0.05)"; e.target.style.color = "#dfc39d"; }} onMouseLeave={(e) => { e.target.style.background = "transparent"; e.target.style.color = "#e2e8f0"; }}>🏪 Hồ sơ Shop</Link>
                <Link href="/transactions" style={{ display: "block", padding: "0.625rem 1rem", fontSize: "0.8125rem", color: "#e2e8f0", textDecoration: "none", fontWeight: 600, transition: "all 0.15s" }} onMouseEnter={(e) => { e.target.style.background = "rgba(255,255,255,0.05)"; e.target.style.color = "#dfc39d"; }} onMouseLeave={(e) => { e.target.style.background = "transparent"; e.target.style.color = "#e2e8f0"; }}>💳 Lịch sử giao dịch</Link>
                <div style={{ height: "1px", background: "rgba(255, 255, 255, 0.08)", margin: "0.25rem 0" }} />
                <button onClick={handleLogout} style={{ display: "block", width: "100%", textAlign: "left", padding: "0.625rem 1rem", fontSize: "0.8125rem", color: "var(--error)", background: "none", border: "none", cursor: "pointer", fontWeight: 600, transition: "all 0.15s" }} onMouseEnter={(e) => e.target.style.background = "rgba(239, 68, 68, 0.08)"} onMouseLeave={(e) => e.target.style.background = "transparent"}>🚪 Đăng xuất</button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* ── MOBILE NAVBAR (TOP) ── */}
      <header style={{
        height: "64px",
        background: "rgba(255, 255, 255, 0.85)",
        borderBottom: "1px solid var(--border)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        position: "fixed",
        top: 0, right: 0, left: 0,
        zIndex: 95,
        padding: "0 1.25rem",
        alignItems: "center",
        justifyContent: "space-between",
      }} className="show-mobile">
        <button onClick={() => setSidebarOpen(true)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--charcoal)" }}>
          <Menu size={22} />
        </button>
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: "0.5rem", textDecoration: "none" }}>
          <span style={{ fontFamily: "var(--font-display)", fontSize: "1.15rem", fontWeight: 700, color: "var(--charcoal)" }}>CASTME</span>
        </Link>
        <div id="header-wallet-trigger-mobile" onClick={() => router.push("/transactions")} style={{ display: "flex", alignItems: "center", gap: "0.25rem", background: "rgba(124, 58, 237, 0.1)", padding: "0.3rem 0.625rem", borderRadius: "99px", color: "var(--primary)", fontSize: "0.75rem", fontWeight: 800, cursor: "pointer" }}>
          <Wallet size={12} color="var(--primary)" strokeWidth={2.5} />
          <span>1.5M₫</span>
        </div>
      </header>

      {/* MOBILE DRAWER SIDEBAR */}
      {sidebarOpen && (
        <div style={{ position: "fixed", inset: 0, zIndex: 100, display: "flex" }}>
          <div onClick={() => setSidebarOpen(false)} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)" }} />
          <div style={{
            position: "relative",
            width: "270px",
            background: "var(--chalk)",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            animation: "slideUp 0.3s ease",
            padding: "1.5rem",
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
              <span style={{ fontFamily: "var(--font-display)", fontSize: "1.25rem", fontWeight: 700 }}>CASTME</span>
              <button onClick={() => setSidebarOpen(false)} style={{ background: "none", border: "none", color: "var(--charcoal)", cursor: "pointer" }}>
                <X size={20} />
              </button>
            </div>

            <nav style={{ flex: 1, display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              {menuItems.map((item) => {
                const Icon = item.icon;
                const active = pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    href={item.path}
                    onClick={() => setSidebarOpen(false)}
                    className={`sidebar-nav-item ${active ? "active" : ""}`}
                  >
                    {Icon && <Icon size={16} />}
                    {item.name}
                  </Link>
                );
              })}
            </nav>

            <div style={{ borderTop: "1px solid var(--border)", paddingTop: "1rem", marginBottom: "1rem" }}>
              <div style={{ display: "flex", alignItems: "center", justifyBox: "space-between", padding: "0.5rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <Wallet size={16} color="var(--primary)" />
                  <span style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--charcoal)" }}>Số dư ví:</span>
                </div>
                <span style={{ fontSize: "1rem", fontWeight: 800, color: "var(--primary)" }}>1.5M₫</span>
              </div>
            </div>

            <div style={{ borderTop: "1px solid var(--border)", paddingTop: "1.5rem", marginTop: "auto" }}>
              <button onClick={() => { setSidebarOpen(false); handleLogout(); }} style={{ display: "flex", alignItems: "center", gap: "0.5rem", width: "100%", padding: "0.75rem", color: "var(--error)", border: "none", background: "none", fontWeight: 600, fontSize: "0.875rem", cursor: "pointer" }}>
                <LogOut size={16} />
                Đăng xuất
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── MAIN WORKSPACE AREA ── */}
      <div style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        marginLeft: 0,
        minWidth: 0,
        ...(pathname.startsWith("/messages") ? { height: "calc(100vh - 72px)", overflow: "hidden" } : {})
      }} className={`shop-workspace ${pathname.startsWith("/messages") ? "messages-bg-override" : ""}`}>
        {/* ── WORKSPACE CONTENT ── */}
        <main style={{
          flex: 1,
          padding: pathname.startsWith("/messages") ? "0" : "0.75rem 2.5rem 2rem 2.5rem",
          boxSizing: "border-box",
          marginTop: "72px",
          marginLeft: "auto",
          marginRight: "auto",
          marginBottom: 0,
          maxWidth: pathname.startsWith("/messages") ? "100%" : "1200px",
          width: "100%",
          ...(pathname.startsWith("/messages") ? { display: "flex", flexDirection: "column", overflow: "hidden", height: "100%" } : {})
        }} className={`shop-workspace-content ${pathname.startsWith("/messages") ? "messages-active" : ""}`}>
          {children}
        </main>
      </div>

      {/* STYLES OVERRIDES */}
      <style>{`
        .show-mobile { display: none !important; }
        .shop-workspace-content { zoom: 0.9; }
        .shop-workspace-content.messages-active {
          height: calc((100vh - 72px) / 0.9);
        }
        .shop-workspace.messages-bg-override {
          background-color: transparent !important;
        }
        @media (max-width: 1280px) {
          .desktop-header { padding: 0 1.5rem !important; }
          .desktop-nav-menu { gap: 0.15rem !important; }
          .desktop-nav-link { font-size: 0.75rem !important; padding: 0.35rem 0.75rem !important; }
        }
        @media (max-width: 1120px) {
          .desktop-nav-link { font-size: 0.72rem !important; padding: 0.3rem 0.55rem !important; }
        }
        @media (max-width: 1024px) {
          .hidden-mobile { display: none !important; }
          .show-mobile { display: flex !important; }
          .shop-workspace { margin-left: 0 !important; }
          .shop-workspace-content { padding: 1.5rem 1.25rem !important; margin-top: 0 !important; zoom: 1 !important; }
          .shop-workspace-content.messages-active { height: calc(100vh - 64px) !important; }
        }
      `}</style>
    </div>
  );
}