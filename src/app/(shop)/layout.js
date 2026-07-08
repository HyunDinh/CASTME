// src/app/(shop)/layout.js
"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Store,
  Megaphone,
  MessageSquare,
  CreditCard,
  Search,
  Bell,
  LogOut,
  Wallet,
  ChevronRight,
  Sparkles,
  X,
} from "lucide-react";

const STATIC_STYLES = [
  { type: "style", name: "Food Review", icon: "🍔" },
  { type: "style", name: "Model", icon: "👗" },
  { type: "style", name: "Beauty", icon: "💄" },
  { type: "style", name: "Tech", icon: "💻" },
  { type: "style", name: "Travel", icon: "✈️" },
];

const menuItems = [
  { name: "Tổng quan Shop", path: "/shop-dashboard", icon: LayoutDashboard },
  { name: "Hồ sơ Cửa Hàng", path: "/shop-profile", icon: Store },
  { name: "Quản lý Casting", path: "/my-casting", icon: Megaphone },
  { name: "Tin nhắn", path: "/messages", icon: MessageSquare },
  { name: "Lịch sử giao dịch", path: "/transactions", icon: CreditCard },
];

export default function ShopLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [searchCreator, setSearchCreator] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const [creatorSuggestions, setCreatorSuggestions] = useState([]);
  const searchContainerRef = useRef(null);

  /* ── Debounce search ── */
  useEffect(() => {
    const fetchCreators = async () => {
      if (searchCreator.trim() === "") { setCreatorSuggestions([]); return; }
      setLoading(true);
      try {
        const res = await fetch(`/api/creators/search?q=${encodeURIComponent(searchCreator)}`);
        const result = await res.json();
        if (result.success) {
          setCreatorSuggestions(result.data.map((creator) => ({
            ...creator,
            type: "creator",
            style: creator.styles?.length > 0 ? creator.styles.join(", ") : "Chưa cập nhật",
          })));
        }
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    };
    const t = setTimeout(fetchCreators, 300);
    return () => clearTimeout(t);
  }, [searchCreator]);

  const styleSuggestions = searchCreator.trim() === ""
    ? []
    : STATIC_STYLES.filter((i) => i.name.toLowerCase().includes(searchCreator.toLowerCase()));
  const filteredSuggestions = [...styleSuggestions, ...creatorSuggestions];

  useEffect(() => {
    const handler = (e) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target)) setShowDropdown(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSelectSuggestion = (s) => {
    setSearchCreator(s.name);
    setShowDropdown(false);
    router.push(s.type === "style" ? `/search-creator?style=${encodeURIComponent(s.name)}` : `/search-creator?q=${encodeURIComponent(s.name)}`);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && searchCreator.trim()) {
      setShowDropdown(false);
      router.push(`/search-creator?q=${encodeURIComponent(searchCreator.trim())}`);
    }
  };

  /* ── Inline styles ── */
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
    body: { display: "flex", flex: 1, minHeight: 0 },
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
        {/* Logo + Search */}
        <div style={{ display:"flex", alignItems:"center", gap:"1.25rem", flex:1, minWidth:0 }}>
          <Link href="/shop-dashboard" style={S.logo}>castme.</Link>

          {/* Search Bar */}
          <div ref={searchContainerRef} style={{ position:"relative", maxWidth:"340px", width:"100%" }}>
            <div style={{
              display:"flex", alignItems:"center",
              background:"var(--bg)", border:"1.5px solid var(--border)",
              borderRadius:"var(--radius-md)",
              padding:"0.5rem 0.875rem",
              gap:"0.5rem",
              transition:"border-color 0.2s, box-shadow 0.2s",
            }}
              onFocusCapture={(e) => { e.currentTarget.style.borderColor = "var(--primary)"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(124,58,237,0.10)"; }}
              onBlurCapture={(e) => { if (!e.currentTarget.contains(e.relatedTarget)) { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.boxShadow = "none"; } }}
            >
              <Search size={15} color="var(--subtle)" strokeWidth={2} />
              <input
                type="text"
                placeholder="Tìm KOL/Creator (vibe, style...)"
                style={{ background:"transparent", border:"none", outline:"none", fontSize:"0.875rem", color:"var(--slate)", width:"100%", fontFamily:"var(--font-body)" }}
                value={searchCreator}
                onChange={(e) => { setSearchCreator(e.target.value); setShowDropdown(true); }}
                onFocus={() => { if (searchCreator.trim()) setShowDropdown(true); }}
                onKeyDown={handleKeyDown}
              />
              {searchCreator && (
                <button onClick={() => { setSearchCreator(""); setShowDropdown(false); }} style={{ background:"none", border:"none", cursor:"pointer", color:"var(--subtle)", padding:0, display:"flex" }}>
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Search Dropdown */}
            {showDropdown && searchCreator.trim() && (
              <div style={{
                position:"absolute", top:"calc(100% + 8px)", left:0, right:0,
                background:"var(--surface)",
                borderRadius:"var(--radius-md)",
                border:"1px solid var(--border)",
                boxShadow:"var(--shadow-lg)",
                overflow:"hidden",
                maxHeight:"380px",
                overflowY:"auto",
                zIndex:999,
              }}>
                {loading ? (
                  <div style={{ padding:"2rem", textAlign:"center" }}>
                    <div style={{ width:"24px", height:"24px", border:"2.5px solid var(--primary)", borderTopColor:"transparent", borderRadius:"50%", animation:"spinSlow 0.8s linear infinite", margin:"0 auto 0.5rem" }} />
                    <span style={{ fontSize:"0.8125rem", color:"var(--muted)" }}>Đang tìm kiếm...</span>
                  </div>
                ) : filteredSuggestions.length > 0 ? (
                  <div style={{ padding:"0.5rem 0" }}>
                    {filteredSuggestions.filter((s) => s.type === "style").length > 0 && (
                      <div>
                        <div style={{ padding:"0.5rem 1rem", fontSize:"0.625rem", fontWeight:700, color:"var(--subtle)", textTransform:"uppercase", letterSpacing:"0.1em", background:"var(--bg)" }}>
                          Phong cách / Ngành hàng
                        </div>
                        {filteredSuggestions.filter((s) => s.type === "style").map((item, i) => (
                          <div key={`s-${i}`} onClick={() => handleSelectSuggestion(item)}
                            style={{ padding:"0.75rem 1rem", display:"flex", alignItems:"center", gap:"0.75rem", cursor:"pointer", transition:"background 0.15s" }}
                            onMouseEnter={(e) => e.currentTarget.style.background = "var(--primary-light)"}
                            onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                          >
                            <span style={{ width:"32px", height:"32px", background:"var(--bg)", borderRadius:"var(--radius-sm)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"1rem" }}>{item.icon}</span>
                            <span style={{ fontSize:"0.875rem", fontWeight:500, color:"var(--slate)" }}>{item.name}</span>
                          </div>
                        ))}
                      </div>
                    )}
                    {filteredSuggestions.filter((s) => s.type === "creator").length > 0 && (
                      <div>
                        <div style={{ padding:"0.5rem 1rem", fontSize:"0.625rem", fontWeight:700, color:"var(--subtle)", textTransform:"uppercase", letterSpacing:"0.1em", background:"var(--bg)", borderTop:"1px solid var(--border)" }}>
                          Creator / KOL
                        </div>
                        {filteredSuggestions.filter((s) => s.type === "creator").map((item, i) => (
                          <div key={`c-${i}`} onClick={() => handleSelectSuggestion(item)}
                            style={{ padding:"0.75rem 1rem", display:"flex", alignItems:"center", gap:"0.75rem", cursor:"pointer", transition:"background 0.15s" }}
                            onMouseEnter={(e) => e.currentTarget.style.background = "var(--primary-light)"}
                            onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                          >
                            <div style={{ width:"36px", height:"36px", background:"var(--primary-light)", borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"0.75rem", fontWeight:700, color:"var(--primary)", flexShrink:0, overflow:"hidden" }}>
                              {item.avatar && item.avatar.length > 1 ? <img src={item.avatar} alt={item.name} style={{ width:"100%", height:"100%", objectFit:"cover" }} /> : item.avatar}
                            </div>
                            <div>
                              <div style={{ fontSize:"0.875rem", fontWeight:600, color:"var(--slate)" }}>{item.name}</div>
                              <div style={{ fontSize:"0.6875rem", color:"var(--muted)" }}>{item.style}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <div style={{ padding:"2rem", textAlign:"center" }}>
                    <div style={{ fontSize:"1.5rem", marginBottom:"0.5rem" }}>🔍</div>
                    <div style={{ fontSize:"0.875rem", color:"var(--muted)" }}>Không tìm thấy kết quả cho &ldquo;{searchCreator}&rdquo;</div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right Actions */}
        <div style={{ display:"flex", alignItems:"center", gap:"0.625rem", flexShrink:0 }}>
          {/* Notification Bell */}
          <button style={{ width:"38px", height:"38px", display:"flex", alignItems:"center", justifyContent:"center", background:"none", border:"none", cursor:"pointer", borderRadius:"var(--radius-md)", position:"relative", transition:"background 0.2s" }}
            onMouseEnter={(e) => e.currentTarget.style.background = "var(--bg)"}
            onMouseLeave={(e) => e.currentTarget.style.background = "none"}
          >
            <Bell size={18} color="var(--muted)" />
            <span style={{ position:"absolute", top:"6px", right:"6px", width:"7px", height:"7px", background:"var(--rose)", borderRadius:"50%", border:"1.5px solid white" }} />
          </button>

          {/* Divider */}
          <div style={{ width:"1px", height:"28px", background:"var(--border)" }} />

          {/* User pill */}
          <div style={{ display:"flex", alignItems:"center", gap:"0.625rem", cursor:"pointer", padding:"0.375rem 0.75rem 0.375rem 0.375rem", borderRadius:"var(--radius-full)", border:"1px solid var(--border)", background:"var(--bg)", transition:"all 0.2s" }}
            onClick={() => router.push("/shop-profile")}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--primary-muted)"; e.currentTarget.style.background = "var(--primary-light)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.background = "var(--bg)"; }}
          >
            <div style={{ width:"30px", height:"30px", background:"linear-gradient(135deg, var(--primary) 0%, var(--rose) 100%)", borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", color:"white", fontWeight:800, fontSize:"0.8125rem" }}>B</div>
            <div>
              <div style={{ fontSize:"0.8125rem", fontWeight:700, color:"var(--slate)", lineHeight:1.2 }}>Brand Name</div>
              <div style={{ fontSize:"0.625rem", fontWeight:700, color:"var(--primary)" }}>SHOP</div>
            </div>
          </div>
        </div>
      </header>

      {/* ── BODY ── */}
      <div style={S.body}>
        {/* Sidebar */}
        <aside style={S.sidebar} className="castme-sidebar">
          <p style={S.sidebarLabel}>Menu Shop</p>

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
            <LogOut size={16} strokeWidth={2} />
            Đăng xuất
          </button>

          {/* Wallet Card */}
          <div style={{
            marginTop:"auto",
            background:"rgba(255,255,255,0.08)",
            border:"1px solid rgba(255,255,255,0.12)",
            borderRadius:"var(--radius-lg)",
            padding:"1rem",
          }}>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:"0.5rem" }}>
              <div style={{ display:"flex", alignItems:"center", gap:"0.375rem" }}>
                <Wallet size={14} color="rgba(196,181,253,0.80)" />
                <span style={{ fontSize:"0.75rem", fontWeight:600, color:"rgba(196,181,253,0.80)" }}>Số dư ví</span>
              </div>
              <span style={{ fontSize:"0.9375rem", fontWeight:800, color:"white" }}>1.5M</span>
            </div>
            <p style={{ fontSize:"0.6875rem", color:"rgba(196,181,253,0.60)", lineHeight:1.5, marginBottom:"0.75rem" }}>
              Dùng để đăng thêm chiến dịch hoặc mở khóa thông tin KOL.
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
              + Nạp thêm tiền
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main
          style={{
            flex: 1,
            minWidth: 0,
            ...(pathname.startsWith("/messages")
              ? { overflow: "hidden", display: "flex", flexDirection: "column" }
              : { padding: "2rem", overflowY: "auto" }),
          }}
        >
          {children}
        </main>
      </div>

      <style>{`
        @media (max-width: 1024px) {
          .castme-sidebar { display: none !important; }
        }
      `}</style>
    </div>
  );
}
