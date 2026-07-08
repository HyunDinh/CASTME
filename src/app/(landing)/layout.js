// src/app/(landing)/layout.js
"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function LandingLayout({ children }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navLinks = [
    { label: "Tính năng", href: "#features" },
    { label: "AI Matching", href: "#ai-matching" },
    { label: "Bảng giá", href: "#pricing" },
  ];

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        background: "var(--bg)",
        color: "var(--slate)",
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
          height: "68px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          transition: "all 0.3s ease",
          background: scrolled
            ? "rgba(250,250,249,0.90)"
            : "rgba(250,250,249,0.60)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderBottom: scrolled
            ? "1px solid rgba(226,232,240,0.8)"
            : "1px solid transparent",
          boxShadow: scrolled ? "0 2px 20px -4px rgba(124,58,237,0.08)" : "none",
        }}
      >
        {/* Logo */}
        <Link
          href="/"
          style={{
            fontFamily: "var(--font-heading)",
            fontSize: "1.5rem",
            fontWeight: 800,
            textDecoration: "none",
            background: "linear-gradient(135deg, var(--primary) 0%, var(--rose) 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            letterSpacing: "-0.03em",
          }}
        >
          castme
          <span style={{ WebkitTextFillColor: "var(--rose)", fontWeight: 900 }}>.</span>
        </Link>

        {/* Desktop Nav */}
        <nav
          style={{
            display: "flex",
            alignItems: "center",
            gap: "2rem",
          }}
          className="hidden-mobile"
        >
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "0.875rem",
                fontWeight: 500,
                color: "var(--muted)",
                textDecoration: "none",
                transition: "color 0.2s",
                letterSpacing: "0.01em",
              }}
              onMouseEnter={(e) => (e.target.style.color = "var(--primary)")}
              onMouseLeave={(e) => (e.target.style.color = "var(--muted)")}
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Auth CTA */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <Link
            href="/login"
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "0.875rem",
              fontWeight: 500,
              color: "var(--muted)",
              textDecoration: "none",
              padding: "0.5rem 1rem",
              borderRadius: "var(--radius-full)",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "var(--primary)";
              e.currentTarget.style.background = "var(--primary-light)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "var(--muted)";
              e.currentTarget.style.background = "transparent";
            }}
          >
            Đăng nhập
          </Link>

          <Link
            href="/register"
            className="btn btn-primary"
            style={{ fontSize: "0.875rem", padding: "0.5625rem 1.25rem" }}
          >
            Dùng thử miễn phí ✨
          </Link>
        </div>
      </header>

      {/* MAIN */}
      <main style={{ flex: 1, paddingTop: "68px" }}>{children}</main>

      {/* ── FOOTER ── */}
      <footer
        style={{
          borderTop: "1px solid var(--border)",
          padding: "3rem 2rem 2rem",
          background: "var(--surface)",
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
                background: "linear-gradient(135deg, var(--primary) 0%, var(--rose) 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                marginBottom: "0.75rem",
                letterSpacing: "-0.03em",
              }}
            >
              castme.
            </div>
            <p style={{ fontSize: "0.8125rem", color: "var(--muted)", lineHeight: 1.7, maxWidth: "220px" }}>
              Nền tảng kết nối thông minh giữa Shop & Creators tại Việt Nam.
            </p>
          </div>

          {/* Platform */}
          <div>
            <p style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--slate)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "0.75rem" }}>
              Nền tảng
            </p>
            {["Tính năng", "AI Matching", "Bảng giá", "Đăng ký"].map((item) => (
              <div key={item} style={{ marginBottom: "0.4rem" }}>
                <a href="#" style={{ fontSize: "0.875rem", color: "var(--muted)", textDecoration: "none", transition: "color 0.2s" }}
                  onMouseEnter={(e) => (e.target.style.color = "var(--primary)")}
                  onMouseLeave={(e) => (e.target.style.color = "var(--muted)")}
                >{item}</a>
              </div>
            ))}
          </div>

          {/* Resources */}
          <div>
            <p style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--slate)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "0.75rem" }}>
              Hỗ trợ
            </p>
            {["Hướng dẫn sử dụng", "Câu hỏi thường gặp", "Liên hệ", "Blog"].map((item) => (
              <div key={item} style={{ marginBottom: "0.4rem" }}>
                <a href="#" style={{ fontSize: "0.875rem", color: "var(--muted)", textDecoration: "none", transition: "color 0.2s" }}
                  onMouseEnter={(e) => (e.target.style.color = "var(--primary)")}
                  onMouseLeave={(e) => (e.target.style.color = "var(--muted)")}
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
            borderTop: "1px solid var(--border)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "0.5rem",
          }}
        >
          <p style={{ fontSize: "0.8125rem", color: "var(--subtle)" }}>
            © 2026 Castme Inc. All rights reserved.
          </p>
          <p style={{ fontSize: "0.8125rem", color: "var(--subtle)" }}>
            Được làm với ❤️ tại Việt Nam
          </p>
        </div>
      </footer>

      <style>{`
        @media (max-width: 768px) {
          .hidden-mobile { display: none !important; }
        }
      `}</style>
    </div>
  );
}