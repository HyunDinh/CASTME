// src/app/(creator)/layout.js
"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import RechargeHeartsModal from "./RechargeHeartsModal";
import { getUserHearts } from "#/app/(creator)/actions";
import {
  Compass,
  Briefcase,
  DollarSign,
  User,
  Bell,
  LogOut,
  Heart,
  Search,
  ChevronDown,
  Menu,
  X,
  Sparkles,
  MessageSquare
} from "lucide-react";
import { logoutAction, getSessionAction } from "../(auth)/actions";

const menuItems = [
  { name: "TRANG CHỦ", path: "/home", icon: Compass },
  { name: "KHÁM PHÁ JOB", path: "/creator-dashboard", icon: Compass },
  { name: "PORTFOLIO", path: "/profile", icon: User },
  { name: "VIỆC CỦA TÔI", path: "/my-jobs", icon: Briefcase },
  { name: "TIN NHẮN", path: "/creator-messages", icon: MessageSquare },
  { name: "DOANH THU", path: "/revenue", icon: DollarSign },
  { name: "GIỚI THIỆU", path: "/" },
];

export default function CreatorLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();

  const [session, setSession] = useState(null);
  const [hearts, setHearts] = useState(0);
  const [showRechargeModal, setShowRechargeModal] = useState(false);
  const [loadingHearts, setLoadingHearts] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setSearchQuery(params.get("q") || "");
  }, [pathname]);

  const handleSearchChange = (val) => {
    setSearchQuery(val);
    const params = new URLSearchParams(window.location.search);
    if (val.trim()) {
      params.set("q", val);
    } else {
      params.delete("q");
    }
    const targetPath = (pathname === "/creator-dashboard" || pathname === "/my-jobs" || pathname === "/search")
      ? pathname
      : "/creator-dashboard";
    router.replace(`${targetPath}?${params.toString()}`);
  };

  useEffect(() => {
    async function loadSession() {
      const s = await getSessionAction();
      if (s) setSession(s);
    }
    loadSession();
  }, []);

  const fetchHearts = async () => {
    const result = await getUserHearts();
    if (result.success) setHearts(result.data.hearts);
    setLoadingHearts(false);
  };

  useEffect(() => { fetchHearts(); }, []);

  const handleLogout = async () => {
    const res = await logoutAction();
    if (res.success) {
      router.push("/");
      router.refresh();
    }
  };

  useEffect(() => {
    if (!showUserDropdown) return;
    const handleOutsideClick = (e) => {
      const container = document.getElementById("creator-profile-dropdown");
      if (container && !container.contains(e.target)) {
        setShowUserDropdown(false);
      }
    };
    document.addEventListener("click", handleOutsideClick);
    return () => document.removeEventListener("click", handleOutsideClick);
  }, [showUserDropdown]);

  const getPageTitle = () => {
    const activeItem = menuItems.find(item => item.path === pathname);
    return activeItem ? activeItem.name : "CREATOR SPACE";
  };

  const showSearch = pathname === "/creator-dashboard" || pathname === "/my-jobs" || pathname === "/search" || pathname === "/home";

  return (
    <div className="creator-workspace" style={{
      height: pathname.startsWith("/creator-messages") ? "100vh" : "auto",
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      fontFamily: "var(--font-body)",
      overflow: pathname.startsWith("/creator-messages") ? "hidden" : "visible"
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

        {/* Left: Brand Logo */}
        <div style={{ display: "flex", alignItems: "center", flex: "1 1 0%", justifyContent: "flex-start", minWidth: 0 }}>
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: "0.625rem", textDecoration: "none" }}>
            <div style={{
              width: "28px", height: "28px",
              background: "var(--electric)",
              borderRadius: "var(--radius-sm)",
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "var(--electric-shine)"
            }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
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
            }}>CREATOR</span>
          </Link>
        </div>

        {/* Center: Navigation Capsule Menu */}
        <nav className="landing-nav-capsule glass-capsule-nav desktop-nav-menu" style={{ display: "flex", alignItems: "center", gap: "0.25rem", flexShrink: 0 }}>
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

        {/* Right: User actions & settings */}
        <div style={{ display: "flex", alignItems: "center", gap: "1.125rem", flex: "1 1 0%", justifyContent: "flex-end", minWidth: 0 }}>
          {/* Search bar inside header (only if explore or jobs or search or home)
          {showSearch && (
            <div style={{ position: "relative", display: "flex", alignItems: "center" }} className="hidden-mobile">
              <input
                type="text"
                placeholder="Tìm tin tuyển dụng..."
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                style={{
                  padding: "0.45rem 1rem 0.45rem 2.25rem",
                  fontSize: "0.8125rem",
                  borderRadius: "var(--radius-full)",
                  border: "1.5px solid var(--border)",
                  outline: "none",
                  width: "180px",
                  background: "rgba(255, 255, 255, 0.55)",
                  transition: "all 0.2s",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "var(--electric)";
                  e.target.style.background = "white";
                  e.target.style.width = "220px";
                  e.target.style.boxShadow = "0 0 0 3px rgba(37, 99, 235, 0.1)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "var(--border)";
                  e.target.style.background = "rgba(255, 255, 255, 0.55)";
                  e.target.style.width = "180px";
                  e.target.style.boxShadow = "none";
                }}
              />
              <Search
                size={14}
                color="var(--ash)"
                style={{ position: "absolute", left: "0.875rem", pointerEvents: "none" }}
              />
            </div>
          )} */}


          {/* Hearts Status */}
          <div
            id="header-hearts-trigger"
            onClick={() => setShowRechargeModal(true)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.45rem",
              padding: "0.42rem 0.875rem",
              background: "rgba(255, 255, 255, 0.35)",
              border: "1.2px solid rgba(37, 99, 235, 0.25)",
              borderRadius: "var(--radius-full)",
              cursor: "pointer",
              fontSize: "0.8125rem",
              fontWeight: 700,
              color: "var(--charcoal)",
              transition: "all 0.2s",
              userSelect: "none",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--electric)"; e.currentTarget.style.background = "rgba(255, 255, 255, 0.45)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(17, 70, 214, 0.25)"; e.currentTarget.style.background = "rgba(255, 255, 255, 0.35)"; }}
          >
            <Heart size={14} fill="#f43f5e" stroke="#f43f5e" />
            <span>{loadingHearts ? "..." : hearts}</span>
            <span style={{ fontSize: "0.6875rem", color: "var(--electric)", fontWeight: 800 }}>Nạp</span>
          </div>

          {/* Notification bell */}
          <button style={{ width: "36px", height: "36px", borderRadius: "50%", background: "rgba(255, 255, 255, 0.25)", border: "1px solid rgba(255, 255, 255, 0.4)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "var(--ash)", position: "relative" }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255, 255, 255, 0.45)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255, 255, 255, 0.25)"; }}
          >
            <Bell size={15} />
            <span style={{ position: "absolute", top: "8px", right: "8px", width: "6px", height: "6px", background: "var(--electric)", borderRadius: "50%" }} />
          </button>

          {/* Profile Dropdown */}
          <div id="creator-profile-dropdown" style={{ position: "relative" }}>
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
                background: "var(--parchment)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "0.6875rem",
                fontWeight: 700,
                color: "var(--charcoal)",
              }}>
                {session?.name ? session.name[0].toUpperCase() : "C"}
              </div>
              <span style={{ maxWidth: "80px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {session?.name || "CREATOR"}
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
                <Link href="/profile" style={{ display: "block", padding: "0.625rem 1rem", fontSize: "0.8125rem", color: "#e2e8f0", textDecoration: "none", fontWeight: 600, transition: "all 0.15s" }} onMouseEnter={(e) => { e.target.style.background = "rgba(255,255,255,0.05)"; e.target.style.color = "#dfc39d"; }} onMouseLeave={(e) => { e.target.style.background = "transparent"; e.target.style.color = "#e2e8f0"; }}>📸 Portfolio</Link>
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
        <div id="header-hearts-trigger-mobile" onClick={() => setShowRechargeModal(true)} style={{ display: "flex", alignItems: "center", gap: "0.25rem", background: "var(--electric-light)", padding: "0.3rem 0.625rem", borderRadius: "99px", color: "var(--electric)", fontSize: "0.75rem", fontWeight: 800, cursor: "pointer" }}>
          <Heart size={12} fill="var(--electric)" stroke="var(--electric)" />
          <span>{hearts}</span>
        </div>
      </header>

      {/* MOBILE DRAWER SIDEBAR */}
      {sidebarOpen && (
        <div style={{ position: "fixed", inset: 0, zIndex: 100, display: "flex" }}>
          {/* Overlay */}
          <div onClick={() => setSidebarOpen(false)} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)" }} />

          {/* Menu Drawer */}
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
        ...(pathname.startsWith("/creator-messages") ? { height: "calc(100vh - 72px)", overflow: "hidden" } : {})
      }} className={`creator-workspace ${pathname.startsWith("/creator-messages") ? "messages-bg-override" : ""}`}>



        {/* ── WORKSPACE CONTENT ── */}
        <main style={{
          flex: 1,
          padding: pathname.startsWith("/creator-messages") ? "0" : "0.75rem 2.5rem 2rem 2.5rem",
          boxSizing: "border-box",
          marginTop: "72px", // Fixed space for the desktop top navbar
          marginLeft: "auto",
          marginRight: "auto",
          marginBottom: 0,
          maxWidth: pathname.startsWith("/creator-messages") ? "100%" : "1200px",
          width: "100%",
          ...(pathname.startsWith("/creator-messages") ? { display: "flex", flexDirection: "column", overflow: "hidden", height: "100%" } : {})
        }} className={`creator-workspace-content ${pathname.startsWith("/creator-messages") ? "messages-active" : ""}`}>
          {children}
        </main>
      </div>

      {/* Recharge Modal */}
      <RechargeHeartsModal
        isOpen={showRechargeModal}
        onClose={() => { setShowRechargeModal(false); fetchHearts(); }}
      />

      <style>{`
        .show-mobile { display: none !important; }
        .creator-workspace-content { zoom: 0.9; }
        .creator-workspace-content.messages-active {
          height: calc((100vh - 72px) / 0.9);
        }
        /* Override workspace background image for messages page */
        .creator-workspace.messages-bg-override {
          background-color: transparent !important;
        }
        @media (max-width: 1280px) {
          .desktop-header {
            padding: 0 1.5rem !important;
          }
          .desktop-nav-menu {
            gap: 0.15rem !important;
          }
          .desktop-nav-link {
            font-size: 0.75rem !important;
            padding: 0.35rem 0.75rem !important;
          }
        }
        @media (max-width: 1120px) {
          .desktop-nav-link {
            font-size: 0.72rem !important;
            padding: 0.3rem 0.55rem !important;
          }
        }
        @media (max-width: 1024px) {
          .hidden-mobile { display: none !important; }
          .show-mobile { display: flex !important; }
          .creator-workspace { margin-left: 0 !important; }
          .creator-workspace-content { padding: 1.5rem 1.25rem !important; margin-top: 0 !important; zoom: 1 !important; }
          .creator-workspace-content.messages-active {
            height: calc(100vh - 64px) !important;
          }
        }
      `}</style>
    </div>
  );
}