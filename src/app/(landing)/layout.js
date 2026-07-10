// src/app/(landing)/layout.js
"use client";
import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { getSessionAction } from "../(auth)/actions";
import AuthModals from "../../components/AuthModals";

export default function LandingLayout({ children }) {
  const [scrolled, setScrolled] = useState(false);
  const [session, setSession] = useState(null);

  useEffect(() => {
    async function loadSession() {
      const res = await getSessionAction();
      if (res) setSession(res);
    }
    loadSession();
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navLinks = [
    { label: "Trang Chủ", href: "/" },
    { label: "Tính Năng", href: "#features" },
    { label: "AI Matching", href: "#ai-matching" },
    { label: "Bảng Giá", href: "#pricing" },
    { label: "Tin Tức", href: "#news" },
    { label: "Liên Hệ", href: "#contact" },
  ];

  return (
    <div
      className="landing-light"
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        background: "transparent",
        fontFamily: "var(--font-body)",
      }}
    >
      {/* ── NAVBAR ── */}
      <header
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          padding: "0 2rem",
          height: "72px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          transition: "all 0.3s ease",
          background: scrolled
            ? "rgba(255, 255, 255, 0.85)"
            : "transparent",
          backdropFilter: scrolled ? "blur(20px)" : "none",
          WebkitBackdropFilter: scrolled ? "blur(20px)" : "none",
          borderBottom: scrolled
            ? "1px solid rgba(226,232,240,0.8)"
            : "1px solid transparent",
          boxShadow: scrolled ? "0 4px 20px -4px rgba(120,140,180,0.08)" : "none",
        }}
      >
        {/* Logo */}
        <Link
          href="/"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            textDecoration: "none",
          }}
        >
          <div
            style={{
              width: "28px",
              height: "28px",
              background: "#2563eb",
              borderRadius: "6px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 2px 8px rgba(37,99,235,0.2)",
            }}
          >
            <span style={{ color: "white", fontSize: "14px", fontWeight: "bold" }}>✓</span>
          </div>
          <span
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: "1.25rem",
              fontWeight: 800,
              letterSpacing: "0.04em",
              color: "#1a2b4a",
            }}
          >
            CASTME
          </span>
        </Link>

        {/* Desktop Nav - Pill Shape Capsule */}
        <nav
          className="hidden-mobile glass-capsule-nav"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            padding: "0.35rem 0.5rem",
          }}
        >
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "0.8125rem",
                fontWeight: 600,
                color: "#5a6b82",
                textDecoration: "none",
                transition: "all 0.2s",
                padding: "0.5rem 1rem",
                borderRadius: "999px",
              }}
              onMouseEnter={(e) => {
                e.target.style.color = "#2563eb";
                e.target.style.background = "rgba(255, 255, 255, 0.4)";
              }}
              onMouseLeave={(e) => {
                e.target.style.color = "#5a6b82";
                e.target.style.background = "transparent";
              }}
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Auth CTA */}
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          {session ? (
            <Link
              href={session.role === "SHOP" ? "/shop-dashboard" : "/creator-dashboard"}
              className="glow-btn-peach"
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "0.875rem",
                fontWeight: 700,
                padding: "0.5625rem 1.5rem",
                textDecoration: "none",
              }}
            >
              Vào Dashboard
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "0.875rem",
                  fontWeight: 600,
                  color: "#5a6b82",
                  textDecoration: "none",
                  padding: "0.5rem 1rem",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = "#2563eb";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = "#5a6b82";
                }}
              >
                Đăng nhập
              </Link>

              <Link
                href="/register"
                className="glow-btn-peach"
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "0.875rem",
                  fontWeight: 700,
                  padding: "0.5625rem 1.5rem",
                  textDecoration: "none",
                }}
              >
                Đăng ký
              </Link>
            </>
          )}
        </div>
      </header>

      {/* MAIN */}
      <main style={{ flex: 1 }}>{children}</main>

      {/* ── FOOTER ── */}
      <footer
        style={{
          borderTop: "1px solid rgba(255,255,255,0.45)",
          padding: "3rem 2rem 2rem",
          background: "rgba(255, 255, 255, 0.15)",
          backdropFilter: "blur(10px)",
        }}
      >
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "2rem",
          }}
        >
          {/* Brand */}
          <div>
            <div
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "1.25rem",
                fontWeight: 800,
                color: "#1a2b4a",
                marginBottom: "0.75rem",
                letterSpacing: "-0.03em",
              }}
            >
              castme.
            </div>
            <p style={{ fontSize: "0.8125rem", color: "#5a6b82", lineHeight: 1.7, maxWidth: "220px" }}>
              Nền tảng kết nối thông minh giữa Shop & Creators tại Việt Nam.
            </p>
          </div>

          {/* Platform */}
          <div>
            <p style={{ fontSize: "0.75rem", fontWeight: 700, color: "#2d4263", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "0.75rem" }}>
              Nền tảng
            </p>
            {["Tính năng", "AI Matching", "Bảng giá", "Đăng ký"].map((item) => (
              <div key={item} style={{ marginBottom: "0.4rem" }}>
                <a href="#" style={{ fontSize: "0.875rem", color: "#5a6b82", textDecoration: "none", transition: "color 0.2s" }}
                  onMouseEnter={(e) => (e.target.style.color = "#2563eb")}
                  onMouseLeave={(e) => (e.target.style.color = "#5a6b82")}
                >{item}</a>
              </div>
            ))}
          </div>

          {/* Resources */}
          <div>
            <p style={{ fontSize: "0.75rem", fontWeight: 700, color: "#2d4263", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "0.75rem" }}>
              Hỗ trợ
            </p>
            {["Hướng dẫn sử dụng", "Câu hỏi thường gặp", "Liên hệ", "Blog"].map((item) => (
              <div key={item} style={{ marginBottom: "0.4rem" }}>
                <a href="#" style={{ fontSize: "0.875rem", color: "#5a6b82", textDecoration: "none", transition: "color 0.2s" }}
                  onMouseEnter={(e) => (e.target.style.color = "#2563eb")}
                  onMouseLeave={(e) => (e.target.style.color = "#5a6b82")}
                >{item}</a>
              </div>
            ))}
          </div>
        </div>

        <div
          style={{
            maxWidth: "1200px",
            margin: "2rem auto 0",
            paddingTop: "1.5rem",
            borderTop: "1px solid rgba(255,255,255,0.25)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "0.5rem",
          }}
        >
          <p style={{ fontSize: "0.8125rem", color: "#7a8b9f" }}>
            © 2026 Castme Inc. All rights reserved.
          </p>
          <p style={{ fontSize: "0.8125rem", color: "#7a8b9f" }}>
            Được làm với ❤️ tại Việt Nam
          </p>
        </div>
      </footer>

      <style>{`
        @media (max-width: 768px) {
          .hidden-mobile { display: none !important; }
        }
      `}</style>

      <Suspense fallback={null}>
        <AuthModals />
      </Suspense>
    </div>
  );
}