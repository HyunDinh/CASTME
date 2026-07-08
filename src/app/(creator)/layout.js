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
  BookOpen,
  Bell,
  Settings,
  LogOut,
  Heart,
  Search,
} from "lucide-react";

const menuItems = [
  { name: "Khám phá Job", path: "/creator-dashboard", icon: Compass },
  { name: "Việc của tôi", path: "/my-jobs", icon: Briefcase },
  { name: "Doanh thu", path: "/revenue", icon: DollarSign },
  { name: "Portfolio", path: "/profile", icon: BookOpen },
];

export default function CreatorLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();

  const [hearts, setHearts] = useState(0);
  const [showRechargeModal, setShowRechargeModal] = useState(false);
  const [loadingHearts, setLoadingHearts] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchHearts = async () => {
    const result = await getUserHearts();
    if (result.success) setHearts(result.data.hearts);
    setLoadingHearts(false);
  };

  useEffect(() => { fetchHearts(); }, []);

  const S = {
    wrap: {
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      background: "var(--bg)",
      fontFamily: "var(--font-body)",
    },
    topbar: {
      position: "sticky",
      top: 0,
      zIndex: 40,
      height: "64px",
      background: "var(--surface)",
      borderBottom: "1px solid var(--border)",
      padding: "0 1.5rem",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: "1rem",
      boxShadow: "0 1px 8px rgba(0,0,0,0.04)",
    },
    logo: {
      fontFamily: "var(--font-heading)",
      fontSize: "1.375rem",
      fontWeight: 800,
      textDecoration: "none",
      background: "linear-gradient(135deg, var(--primary) 0%, var(--rose) 100%)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      backgroundClip: "text",
      letterSpacing: "-0.03em",
      flexShrink: 0,
    },
    sidebar: {
      width: "240px",
      flexShrink: 0,
      background: "linear-gradient(180deg, #1E0845 0%, #2D1060 50%, #4C1D95 100%)",
      display: "flex",
      flexDirection: "column",
      padding: "1.25rem 0.875rem",
      gap: "2px",
    },
    sidebarLabel: {
      fontSize: "0.6875rem",
      fontWeight: 700,
      textTransform: "uppercase",
      letterSpacing: "0.1em",
      color: "rgba(196,181,253,0.50)",
      padding: "0 0.5rem 0.5rem",
      marginBottom: "0.25rem",
      marginTop: "0.5rem",
    },
  };

  return (
    <div style={S.wrap}>
      {/* ── TOP BAR ── */}
      <header style={S.topbar}>
        <div style={{ display:"flex", alignItems:"center", gap:"1.25rem", flex:1, minWidth:0 }}>
          <Link href="/creator-dashboard" style={S.logo}>castme.</Link>

          {/* Search */}
          <div style={{
            display:"flex", alignItems:"center",
            background:"var(--bg)", border:"1.5px solid var(--border)",
            borderRadius:"var(--radius-md)",
            padding:"0.5rem 0.875rem",
            gap:"0.5rem",
            maxWidth:"320px", width:"100%",
            transition:"border-color 0.2s, box-shadow 0.2s",
          }}
            onFocusCapture={(e) => { e.currentTarget.style.borderColor = "var(--primary)"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(124,58,237,0.10)"; }}
            onBlurCapture={(e) => { if (!e.currentTarget.contains(e.relatedTarget)) { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.boxShadow = "none"; } }}
          >
            <Search size={15} color="var(--subtle)" strokeWidth={2} />
            <input
              type="text"
              placeholder="Tìm kiếm theo tên, tag, vibe..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && searchQuery.trim()) router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
              }}
              style={{ background:"transparent", border:"none", outline:"none", fontSize:"0.875rem", color:"var(--slate)", width:"100%", fontFamily:"var(--font-body)" }}
            />
          </div>
        </div>

        {/* Right Actions */}
        <div style={{ display:"flex", alignItems:"center", gap:"0.625rem", flexShrink:0 }}>
          {/* Bell */}
          <button style={{ width:"38px", height:"38px", display:"flex", alignItems:"center", justifyContent:"center", background:"none", border:"none", cursor:"pointer", borderRadius:"var(--radius-md)", position:"relative", transition:"background 0.2s" }}
            onMouseEnter={(e) => e.currentTarget.style.background = "var(--bg)"}
            onMouseLeave={(e) => e.currentTarget.style.background = "none"}
          >
            <Bell size={18} color="var(--muted)" />
            <span style={{ position:"absolute", top:"6px", right:"6px", width:"7px", height:"7px", background:"var(--rose)", borderRadius:"50%", border:"1.5px solid white" }} />
          </button>

          {/* Hearts Wallet */}
          <div
            onClick={() => setShowRechargeModal(true)}
            style={{
              display:"flex", alignItems:"center", gap:"0.5rem",
              padding:"0.375rem 0.875rem 0.375rem 0.625rem",
              background:"var(--primary-light)",
              border:"1px solid var(--primary-muted)",
              borderRadius:"var(--radius-full)",
              cursor:"pointer",
              transition:"all 0.2s",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "var(--primary)"; e.currentTarget.style.borderColor = "var(--primary)"; Array.from(e.currentTarget.querySelectorAll("*")).forEach(el => { el.style.color = "white"; }); }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "var(--primary-light)"; e.currentTarget.style.borderColor = "var(--primary-muted)"; Array.from(e.currentTarget.querySelectorAll("*")).forEach(el => { el.style.color = ""; }); }}
          >
            <Heart size={14} color="var(--rose)" fill="var(--rose)" />
            <span style={{ fontSize:"0.8125rem", fontWeight:800, color:"var(--primary)" }}>
              {loadingHearts ? "..." : hearts}
            </span>
            <span style={{ fontSize:"0.6875rem", color:"var(--primary)", opacity:0.7 }}>Tim</span>
          </div>

          <div style={{ width:"1px", height:"28px", background:"var(--border)" }} />

          {/* User pill */}
          <div style={{ display:"flex", alignItems:"center", gap:"0.625rem", cursor:"pointer", padding:"0.375rem 0.75rem 0.375rem 0.375rem", borderRadius:"var(--radius-full)", border:"1px solid var(--border)", background:"var(--bg)", transition:"all 0.2s" }}
            onClick={() => router.push("/profile")}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--primary-muted)"; e.currentTarget.style.background = "var(--primary-light)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.background = "var(--bg)"; }}
          >
            <div style={{ width:"30px", height:"30px", background:"linear-gradient(135deg, var(--rose) 0%, var(--primary) 100%)", borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", color:"white", fontWeight:800, fontSize:"0.8125rem" }}>K</div>
            <div>
              <div style={{ fontSize:"0.8125rem", fontWeight:700, color:"var(--slate)", lineHeight:1.2 }}>Creator</div>
              <div style={{ fontSize:"0.625rem", fontWeight:700, color:"var(--rose)" }}>KOC/KOL</div>
            </div>
          </div>
        </div>
      </header>

      {/* ── BODY ── */}
      <div style={{ display:"flex", flex:1, minHeight:0 }}>
        {/* Sidebar */}
        <aside style={S.sidebar} className="castme-sidebar">
          <p style={S.sidebarLabel}>Menu Creator</p>

          {menuItems.map(({ name, path, icon: Icon }) => {
            const active = pathname === path;
            return (
              <Link key={path} href={path}
                style={{
                  display:"flex", alignItems:"center", gap:"0.625rem",
                  padding:"0.625rem 0.875rem",
                  borderRadius:"var(--radius-md)",
                  textDecoration:"none",
                  fontSize:"0.875rem",
                  fontWeight: active ? 700 : 500,
                  color: active ? "white" : "rgba(255,255,255,0.60)",
                  background: active ? "rgba(255,255,255,0.15)" : "transparent",
                  border: active ? "1px solid rgba(255,255,255,0.15)" : "1px solid transparent",
                  boxShadow: active ? "inset 0 1px 0 rgba(255,255,255,0.10)" : "none",
                  transition:"all 0.18s ease",
                }}
                onMouseEnter={(e) => { if (!active) { e.currentTarget.style.background = "rgba(255,255,255,0.08)"; e.currentTarget.style.color = "white"; } }}
                onMouseLeave={(e) => { if (!active) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "rgba(255,255,255,0.60)"; } }}
              >
                <Icon size={16} strokeWidth={active ? 2.5 : 2} />
                {name}
              </Link>
            );
          })}

          {/* Logout */}
          <button
            onClick={() => router.push("/login")}
            style={{
              display:"flex", alignItems:"center", gap:"0.625rem",
              padding:"0.625rem 0.875rem", marginTop:"0.5rem",
              borderRadius:"var(--radius-md)",
              background:"none", border:"none", cursor:"pointer",
              fontSize:"0.875rem", fontWeight:500,
              color:"rgba(255,100,100,0.75)",
              width:"100%", textAlign:"left",
              transition:"all 0.18s ease",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(239,68,68,0.12)"; e.currentTarget.style.color = "#FF8080"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "none"; e.currentTarget.style.color = "rgba(255,100,100,0.75)"; }}
          >
            <LogOut size={16} />
            Đăng xuất
          </button>

          {/* Hearts Card */}
          <div
            onClick={() => setShowRechargeModal(true)}
            style={{
              marginTop:"auto",
              background:"rgba(255,255,255,0.08)",
              border:"1px solid rgba(255,255,255,0.12)",
              borderRadius:"var(--radius-lg)",
              padding:"1rem",
              cursor:"pointer",
              transition:"background 0.2s",
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.14)"}
            onMouseLeave={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.08)"}
          >
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:"0.5rem" }}>
              <div style={{ display:"flex", alignItems:"center", gap:"0.375rem" }}>
                <Heart size={14} color="rgba(251,207,232,0.80)" fill="rgba(251,207,232,0.40)" />
                <span style={{ fontSize:"0.75rem", fontWeight:600, color:"rgba(251,207,232,0.80)" }}>Quỹ Trái Tim</span>
              </div>
              <span style={{ fontSize:"0.9375rem", fontWeight:800, color:"white" }}>❤️ {loadingHearts ? "..." : hearts}</span>
            </div>
            <p style={{ fontSize:"0.6875rem", color:"rgba(196,181,253,0.60)", lineHeight:1.5, marginBottom:"0.75rem" }}>
              Mỗi lượt ứng tuyển với Shop tiêu tốn 5 trái tim.
            </p>
            <button style={{
              width:"100%", padding:"0.5rem",
              background:"rgba(255,255,255,0.12)",
              border:"1px solid rgba(255,255,255,0.15)",
              borderRadius:"var(--radius-sm)",
              color:"white", fontWeight:700, fontSize:"0.75rem",
              cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:"0.375rem",
              transition:"background 0.2s",
            }}
              onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.20)"}
              onMouseLeave={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.12)"}
            >
              ❤️ Nạp thêm Tim
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main style={{ flex:1, minWidth:0, padding:"2rem", overflowY:"auto" }}>
          {children}
        </main>
      </div>

      {/* Recharge Modal */}
      <RechargeHeartsModal
        isOpen={showRechargeModal}
        onClose={() => { setShowRechargeModal(false); window.location.reload(); }}
      />

      <style>{`
        @media (max-width: 1024px) {
          .castme-sidebar { display: none !important; }
        }
      `}</style>
    </div>
  );
}