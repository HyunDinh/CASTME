// src/app/(auth)/login/page.js
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { loginAction } from "../actions";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const result = await loginAction(formData);
    if (result.error) {
      setError(result.error);
      setLoading(false);
    } else {
      if (result.role === "SHOP") router.push("/shop-dashboard");
      else if (result.role === "CREATOR") router.push("/creator-dashboard");
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      fontFamily: "var(--font-body)",
    }} className="auth-grid">
      {/* ── LEFT PANEL — Brand Visual ── */}
      <div style={{
        background: "linear-gradient(145deg, #0F0520 0%, #2D1060 45%, #4C1D95 75%, #7C1F5A 100%)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "2.5rem",
        position: "relative",
        overflow: "hidden",
      }} className="auth-left">
        {/* Decorative blobs */}
        <div style={{
          position: "absolute", top: "-80px", right: "-80px",
          width: "320px", height: "320px", borderRadius: "50%",
          background: "radial-gradient(circle, rgba(244,63,142,0.25) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />
        <div style={{
          position: "absolute", bottom: "-60px", left: "-60px",
          width: "280px", height: "280px", borderRadius: "50%",
          background: "radial-gradient(circle, rgba(124,58,237,0.30) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />

        {/* Logo */}
        <div style={{
          fontFamily: "var(--font-heading)",
          fontSize: "1.75rem",
          fontWeight: 800,
          color: "white",
          letterSpacing: "-0.03em",
          position: "relative",
        }}>
          castme<span style={{ color: "var(--rose)" }}>.</span>
        </div>

        {/* Center Content */}
        <div style={{ position: "relative" }}>
          <div style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
            padding: "0.375rem 1rem",
            background: "rgba(255,255,255,0.10)",
            border: "1px solid rgba(255,255,255,0.15)",
            borderRadius: "var(--radius-full)",
            fontSize: "0.75rem",
            fontWeight: 700,
            color: "rgba(255,255,255,0.80)",
            marginBottom: "1.5rem",
          }}>
            ⚡ AI Matching Engine
          </div>
          <h2 style={{
            fontFamily: "var(--font-heading)",
            fontSize: "2.25rem",
            fontWeight: 800,
            color: "white",
            lineHeight: 1.15,
            letterSpacing: "-0.03em",
            marginBottom: "1.25rem",
          }}>
            Kết nối đúng vibe.<br />
            <span style={{
              background: "linear-gradient(90deg, #C4B5FD 0%, var(--rose) 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}>Mọi chiến dịch.</span>
          </h2>
          <p style={{ color: "rgba(196,181,253,0.75)", lineHeight: 1.7, fontSize: "0.9375rem", maxWidth: "340px" }}>
            Đăng nhập để tiếp tục xây dựng hợp tác creator — thông minh, nhanh chóng và đáng tin cậy.
          </p>

          {/* Floating match card */}
          <div style={{
            marginTop: "2rem",
            background: "rgba(255,255,255,0.08)",
            border: "1px solid rgba(255,255,255,0.12)",
            borderRadius: "var(--radius-lg)",
            padding: "1.125rem 1.25rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            maxWidth: "360px",
            backdropFilter: "blur(8px)",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <div style={{
                width: "40px", height: "40px",
                background: "linear-gradient(135deg, var(--primary-light), var(--rose-light))",
                borderRadius: "50%",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "1.1rem",
                fontWeight: 700, color: "var(--primary)",
              }}>T</div>
              <div>
                <div style={{ fontWeight: 700, color: "white", fontSize: "0.875rem" }}>Thảo Vy Review</div>
                <div style={{ fontSize: "0.6875rem", color: "rgba(196,181,253,0.70)" }}>Minimalism · 125K followers</div>
              </div>
            </div>
            <div style={{
              background: "linear-gradient(135deg, var(--success), #059669)",
              color: "white",
              fontWeight: 900,
              fontSize: "0.75rem",
              padding: "0.3rem 0.7rem",
              borderRadius: "var(--radius-sm)",
              boxShadow: "0 2px 8px rgba(16,185,129,0.40)",
            }}>🎯 98%</div>
          </div>
        </div>

        {/* Bottom quote */}
        <div style={{ position: "relative" }}>
          <p style={{ fontSize: "0.8125rem", color: "rgba(196,181,253,0.60)", fontStyle: "italic", lineHeight: 1.6 }}>
            "Castme giúp mình tìm được những chiến dịch phù hợp với phong cách mà không cần mày mò mãi."
          </p>
          <p style={{ fontSize: "0.75rem", color: "rgba(196,181,253,0.50)", marginTop: "0.5rem", fontWeight: 600 }}>
            — Khoa Style, KOC · 89K followers
          </p>
        </div>
      </div>

      {/* ── RIGHT PANEL — Form ── */}
      <div style={{
        background: "var(--surface)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "2.5rem 2rem",
      }}>
        <div style={{ width: "100%", maxWidth: "420px" }}>
          {/* Header */}
          <div style={{ marginBottom: "2.5rem" }}>
            <h1 style={{
              fontFamily: "var(--font-heading)",
              fontSize: "1.75rem",
              fontWeight: 800,
              color: "var(--slate)",
              letterSpacing: "-0.02em",
              marginBottom: "0.5rem",
            }}>
              Chào mừng trở lại 👋
            </h1>
            <p style={{ fontSize: "0.9375rem", color: "var(--muted)", lineHeight: 1.6 }}>
              Đăng nhập để tiếp tục kết nối với thế giới creator.
            </p>
          </div>

          {/* Error */}
          {error && (
            <div style={{
              marginBottom: "1.25rem",
              padding: "0.875rem 1rem",
              background: "var(--error-light)",
              border: "1px solid rgba(239,68,68,0.20)",
              borderRadius: "var(--radius-md)",
              fontSize: "0.875rem",
              color: "var(--error)",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
            }}>
              ⚠️ {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleFormSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            {/* Email */}
            <div>
              <label style={{
                display: "block",
                fontSize: "0.8125rem",
                fontWeight: 600,
                color: "var(--slate)",
                marginBottom: "0.5rem",
              }}>
                Địa chỉ Email
              </label>
              <input
                type="email"
                name="email"
                required
                placeholder="name@example.com"
                className="input"
              />
            </div>

            {/* Password */}
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                <label style={{ fontSize: "0.8125rem", fontWeight: 600, color: "var(--slate)" }}>
                  Mật khẩu
                </label>
                <a href="#" style={{ fontSize: "0.8125rem", color: "var(--primary)", textDecoration: "none", fontWeight: 500 }}>
                  Quên mật khẩu?
                </a>
              </div>
              <div style={{ position: "relative" }}>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  required
                  placeholder="••••••••"
                  className="input"
                  style={{ paddingRight: "3rem" }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: "absolute",
                    right: "0.875rem",
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    fontSize: "1rem",
                    color: "var(--subtle)",
                    padding: 0,
                  }}
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
              style={{
                width: "100%",
                padding: "0.875rem",
                borderRadius: "var(--radius-md)",
                fontSize: "0.9375rem",
                marginTop: "0.25rem",
                opacity: loading ? 0.7 : 1,
                cursor: loading ? "not-allowed" : "pointer",
              }}
            >
              {loading ? (
                <span style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <span style={{
                    width: "16px", height: "16px",
                    border: "2.5px solid rgba(255,255,255,0.4)",
                    borderTopColor: "white",
                    borderRadius: "50%",
                    display: "inline-block",
                    animation: "spinSlow 0.8s linear infinite",
                  }} />
                  Đang xác thực...
                </span>
              ) : (
                "Đăng nhập →"
              )}
            </button>
          </form>

          {/* Divider */}
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "1rem",
            margin: "2rem 0",
          }}>
            <div style={{ flex: 1, height: "1px", background: "var(--border)" }} />
            <span style={{ fontSize: "0.8125rem", color: "var(--subtle)", fontWeight: 500 }}>hoặc</span>
            <div style={{ flex: 1, height: "1px", background: "var(--border)" }} />
          </div>

          {/* Register CTA */}
          <p style={{ textAlign: "center", fontSize: "0.9375rem", color: "var(--muted)" }}>
            Chưa có tài khoản?{" "}
            <Link href="/register" style={{
              color: "var(--primary)",
              fontWeight: 700,
              textDecoration: "none",
            }}>
              Đăng ký miễn phí ✨
            </Link>
          </p>

          {/* Back to landing */}
          <div style={{ textAlign: "center", marginTop: "2rem" }}>
            <Link href="/" style={{
              fontSize: "0.8125rem",
              color: "var(--subtle)",
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
              gap: "0.375rem",
            }}>
              ← Về trang chủ
            </Link>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .auth-grid { grid-template-columns: 1fr !important; }
          .auth-left { display: none !important; }
        }
      `}</style>
    </div>
  );
}