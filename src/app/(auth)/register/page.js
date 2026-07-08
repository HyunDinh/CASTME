// src/app/(auth)/register/page.js
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { registerAction } from "../actions";

export default function RegisterPage() {
  const router = useRouter();
  const [role, setRole] = useState("SHOP");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    formData.append("role", role);
    const result = await registerAction(formData);
    if (result.error) {
      setError(result.error);
      setLoading(false);
    } else {
      setLoading(false);
      setShowSuccessModal(true);
    }
  };

  const roles = [
    {
      key: "SHOP",
      icon: "🏪",
      title: "Shop / Brand",
      desc: "Tìm creator phù hợp cho chiến dịch",
    },
    {
      key: "CREATOR",
      icon: "📸",
      title: "KOC / KOL",
      desc: "Nhận job phù hợp với phong cách",
    },
  ];

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        fontFamily: "var(--font-body)",
      }}
      className="auth-grid"
    >
      {/* ── LEFT PANEL ── */}
      <div
        style={{
          background:
            "linear-gradient(145deg, #0F0520 0%, #2D1060 45%, #4C1D95 75%, #7C1F5A 100%)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "2.5rem",
          position: "relative",
          overflow: "hidden",
        }}
        className="auth-left"
      >
        {/* Blobs */}
        <div style={{ position:"absolute", top:"-80px", right:"-80px", width:"300px", height:"300px", borderRadius:"50%", background:"radial-gradient(circle, rgba(244,63,142,0.22) 0%, transparent 70%)", pointerEvents:"none" }} />
        <div style={{ position:"absolute", bottom:"-60px", left:"-60px", width:"250px", height:"250px", borderRadius:"50%", background:"radial-gradient(circle, rgba(124,58,237,0.28) 0%, transparent 70%)", pointerEvents:"none" }} />

        {/* Logo */}
        <div style={{ fontFamily:"var(--font-heading)", fontSize:"1.75rem", fontWeight:800, color:"white", letterSpacing:"-0.03em", position:"relative" }}>
          castme<span style={{ color:"var(--rose)" }}>.</span>
        </div>

        {/* Center */}
        <div style={{ position: "relative" }}>
          <h2 style={{
            fontFamily: "var(--font-heading)",
            fontSize: "2rem",
            fontWeight: 800,
            color: "white",
            lineHeight: 1.15,
            letterSpacing: "-0.03em",
            marginBottom: "1rem",
          }}>
            Gia nhập cộng đồng<br />
            <span style={{ background:"linear-gradient(90deg, #C4B5FD 0%, var(--rose) 100%)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text" }}>
              Creator Economy
            </span>
          </h2>
          <p style={{ color:"rgba(196,181,253,0.75)", lineHeight:1.7, fontSize:"0.9375rem", maxWidth:"320px", marginBottom:"2rem" }}>
            Nền tảng đầu tiên kết nối Shop & KOL/KOC theo đúng vibe. 1 tháng dùng thử miễn phí — không cần thẻ.
          </p>

          {/* Stats */}
          <div style={{ display:"flex", gap:"1.25rem", flexWrap:"wrap" }}>
            {[["500+", "Creators"], ["200+", "Shop/Brand"], ["98%", "AI Accuracy"]].map(([v, l]) => (
              <div key={l} style={{
                background:"rgba(255,255,255,0.08)",
                border:"1px solid rgba(255,255,255,0.12)",
                borderRadius:"var(--radius-md)",
                padding:"0.75rem 1rem",
                backdropFilter:"blur(8px)",
              }}>
                <div style={{ fontFamily:"var(--font-heading)", fontSize:"1.25rem", fontWeight:800, color:"white" }}>{v}</div>
                <div style={{ fontSize:"0.6875rem", color:"rgba(196,181,253,0.65)", fontWeight:500 }}>{l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Testimonial */}
        <div style={{ position:"relative" }}>
          <p style={{ fontSize:"0.8125rem", color:"rgba(196,181,253,0.60)", fontStyle:"italic", lineHeight:1.6 }}>
            "Mình tìm được shop hợp vibe ngay tuần đầu tiên trên Castme."
          </p>
          <p style={{ fontSize:"0.75rem", color:"rgba(196,181,253,0.50)", marginTop:"0.5rem", fontWeight:600 }}>
            — Mai Matcha, KOC · 300K followers
          </p>
        </div>
      </div>

      {/* ── RIGHT PANEL ── */}
      <div style={{ background:"var(--surface)", display:"flex", alignItems:"center", justifyContent:"center", padding:"2.5rem 2rem" }}>
        <div style={{ width:"100%", maxWidth:"420px" }}>
          {/* Header */}
          <div style={{ marginBottom:"2rem" }}>
            <h1 style={{
              fontFamily: "var(--font-heading)",
              fontSize: "1.75rem",
              fontWeight: 800,
              color: "var(--slate)",
              letterSpacing: "-0.02em",
              marginBottom: "0.5rem",
            }}>
              Tạo tài khoản ✨
            </h1>
            <p style={{ fontSize:"0.9375rem", color:"var(--muted)", lineHeight:1.6 }}>
              1 tháng trải nghiệm miễn phí toàn bộ tính năng.
            </p>
          </div>

          {/* Error */}
          {error && (
            <div style={{
              marginBottom:"1.25rem",
              padding:"0.875rem 1rem",
              background:"var(--error-light)",
              border:"1px solid rgba(239,68,68,0.20)",
              borderRadius:"var(--radius-md)",
              fontSize:"0.875rem",
              color:"var(--error)",
            }}>
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleFormSubmit} style={{ display:"flex", flexDirection:"column", gap:"1.25rem" }}>
            {/* Role selector */}
            <div>
              <label style={{ display:"block", fontSize:"0.8125rem", fontWeight:600, color:"var(--slate)", marginBottom:"0.625rem" }}>
                Bạn tham gia với vai trò nào?
              </label>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0.75rem" }}>
                {roles.map(({ key, icon, title, desc }) => {
                  const active = role === key;
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setRole(key)}
                      style={{
                        padding:"1rem",
                        borderRadius:"var(--radius-md)",
                        border: active ? "2px solid var(--primary)" : "1.5px solid var(--border)",
                        background: active ? "var(--primary-light)" : "var(--surface)",
                        cursor:"pointer",
                        textAlign:"left",
                        transition:"all 0.2s ease",
                        boxShadow: active ? "var(--shadow-glow)" : "none",
                      }}
                    >
                      <div style={{ fontSize:"1.375rem", marginBottom:"0.375rem" }}>{icon}</div>
                      <div style={{ fontFamily:"var(--font-heading)", fontWeight:700, fontSize:"0.875rem", color: active ? "var(--primary)" : "var(--slate)", marginBottom:"0.25rem" }}>{title}</div>
                      <div style={{ fontSize:"0.6875rem", color: active ? "var(--primary)" : "var(--muted)", lineHeight:1.4 }}>{desc}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Name */}
            <div>
              <label style={{ display:"block", fontSize:"0.8125rem", fontWeight:600, color:"var(--slate)", marginBottom:"0.5rem" }}>
                {role === "SHOP" ? "Tên Shop / Thương hiệu" : "Tên hiển thị / Nickname"}
              </label>
              <input
                type="text"
                name="name"
                required
                placeholder={role === "SHOP" ? "Savage Studio" : "Thảo Vy Review"}
                className="input"
              />
            </div>

            {/* Email */}
            <div>
              <label style={{ display:"block", fontSize:"0.8125rem", fontWeight:600, color:"var(--slate)", marginBottom:"0.5rem" }}>
                Địa chỉ Email
              </label>
              <input type="email" name="email" required placeholder="name@example.com" className="input" />
            </div>

            {/* Password */}
            <div>
              <label style={{ display:"block", fontSize:"0.8125rem", fontWeight:600, color:"var(--slate)", marginBottom:"0.5rem" }}>
                Mật khẩu
              </label>
              <input type="password" name="password" required placeholder="Tối thiểu 8 ký tự" className="input" />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
              style={{
                width:"100%",
                padding:"0.875rem",
                borderRadius:"var(--radius-md)",
                fontSize:"0.9375rem",
                marginTop:"0.25rem",
                opacity: loading ? 0.7 : 1,
                cursor: loading ? "not-allowed" : "pointer",
              }}
            >
              {loading ? (
                <span style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:"0.5rem" }}>
                  <span style={{ width:"16px", height:"16px", border:"2.5px solid rgba(255,255,255,0.4)", borderTopColor:"white", borderRadius:"50%", display:"inline-block", animation:"spinSlow 0.8s linear infinite" }} />
                  Đang tạo tài khoản...
                </span>
              ) : (
                `Tạo tài khoản ${role === "SHOP" ? "Shop" : "Creator"} →`
              )}
            </button>
          </form>

          {/* Login CTA */}
          <p style={{ textAlign:"center", fontSize:"0.9375rem", color:"var(--muted)", marginTop:"1.75rem" }}>
            Đã có tài khoản?{" "}
            <Link href="/login" style={{ color:"var(--primary)", fontWeight:700, textDecoration:"none" }}>
              Đăng nhập
            </Link>
          </p>
          <div style={{ textAlign:"center", marginTop:"1.25rem" }}>
            <Link href="/" style={{ fontSize:"0.8125rem", color:"var(--subtle)", textDecoration:"none" }}>
              ← Về trang chủ
            </Link>
          </div>
        </div>
      </div>

      {/* ── SUCCESS MODAL ── */}
      {showSuccessModal && (
        <div style={{
          position:"fixed", inset:0,
          background:"rgba(0,0,0,0.50)",
          backdropFilter:"blur(6px)",
          display:"flex", alignItems:"center", justifyContent:"center",
          zIndex:50, padding:"1rem",
          animation:"fadeIn 0.3s ease",
        }}>
          <div className="animate-scale-in" style={{
            background:"var(--surface)",
            borderRadius:"var(--radius-xl)",
            maxWidth:"400px", width:"100%",
            padding:"2.5rem 2rem",
            textAlign:"center",
            boxShadow:"var(--shadow-lg)",
          }}>
            <div style={{
              width:"64px", height:"64px",
              background:"var(--success-light)",
              borderRadius:"50%",
              display:"flex", alignItems:"center", justifyContent:"center",
              margin:"0 auto 1.25rem",
              fontSize:"1.75rem",
            }}>✅</div>
            <h3 style={{ fontFamily:"var(--font-heading)", fontSize:"1.375rem", fontWeight:800, color:"var(--slate)", marginBottom:"0.625rem" }}>
              Đăng ký thành công!
            </h3>
            <p style={{ fontSize:"0.9rem", color:"var(--muted)", lineHeight:1.7, marginBottom:"2rem" }}>
              Tài khoản của bạn đã được khởi tạo. Chào mừng bạn đến với <strong style={{ color:"var(--primary)" }}>1 tháng trải nghiệm miễn phí</strong> trên Castme!
            </p>
            <button
              onClick={() => router.push("/login")}
              className="btn btn-primary"
              style={{ width:"100%", padding:"0.875rem", borderRadius:"var(--radius-md)", fontSize:"0.9375rem", cursor:"pointer" }}
            >
              Đi tới Đăng nhập →
            </button>
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .auth-grid { grid-template-columns: 1fr !important; }
          .auth-left { display: none !important; }
        }
      `}</style>
    </div>
  );
}