// src/app/(landing)/page.js
"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { getSessionAction } from "../(auth)/actions";

/* ── Tiny inline-safe stat for hero ── */
function StatPill({ value, label }) {
  return (
    <div style={{
      textAlign: "center",
      padding: "0.75rem 1.25rem",
      background: "rgba(255,255,255,0.85)",
      backdropFilter: "blur(12px)",
      border: "1px solid rgba(37, 99, 235, 0.25)",
      borderRadius: "var(--radius-lg)",
      minWidth: "100px",
    }}>
      <div style={{ fontFamily: "var(--font-heading)", fontSize: "1.375rem", fontWeight: 800, color: "#2563eb" }}>{value}</div>
      <div style={{ fontSize: "0.6875rem", color: "var(--muted)", fontWeight: 500 }}>{label}</div>
    </div>
  );
}

/* ── Feature check item ── */
function CheckItem({ children }) {
  return (
    <li style={{ display: "flex", alignItems: "flex-start", gap: "0.625rem", marginBottom: "0.75rem" }}>
      <span style={{
        flexShrink: 0,
        width: "20px", height: "20px",
        background: "rgba(37, 99, 235, 0.12)",
        borderRadius: "50%",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: "0.6875rem",
        color: "#2563eb",
        fontWeight: 700,
        marginTop: "1px",
      }}>✓</span>
      <span style={{ fontSize: "0.9rem", color: "#5a6b82", lineHeight: 1.55 }}>{children}</span>
    </li>
  );
}

/* ── Pricing Card ── */
function PricingCard({ tier, price, desc, features, cta, ctaHref, highlight }) {
  return (
    <div style={{
      background: highlight ? "linear-gradient(160deg, #2563eb 0%, #1d4ed8 100%)" : "var(--surface)",
      border: highlight ? "none" : "1.5px solid var(--border)",
      borderRadius: "var(--radius-xl)",
      padding: "2rem 1.75rem",
      position: "relative",
      boxShadow: highlight ? "0 20px 60px -10px rgba(37,99,235,0.30)" : "var(--shadow-sm)",
      display: "flex",
      flexDirection: "column",
      transition: "transform 0.2s ease, box-shadow 0.2s ease",
    }}>
      {highlight && (
        <div style={{
          position: "absolute",
          top: "-13px",
          left: "50%",
          transform: "translateX(-50%)",
          background: "linear-gradient(90deg, #dbeafe 0%, #2563eb 100%)",
          color: "#0F172A",
          fontSize: "0.6875rem",
          fontWeight: 800,
          padding: "0.25rem 0.875rem",
          borderRadius: "var(--radius-full)",
          letterSpacing: "0.06em",
          textTransform: "uppercase",
          boxShadow: "0 4px 12px rgba(37,99,235,0.25)",
        }}>
          ⭐ Phổ biến nhất
        </div>
      )}
      <div style={{ marginBottom: "1.5rem" }}>
        <h3 style={{
          fontFamily: "var(--font-heading)",
          fontSize: "1rem",
          fontWeight: 700,
          color: highlight ? "rgba(255,255,255,0.90)" : "var(--muted)",
          marginBottom: "0.5rem",
        }}>{tier}</h3>
        <div style={{ display: "flex", alignItems: "baseline", gap: "0.25rem", marginBottom: "0.5rem" }}>
          <span style={{
            fontFamily: "var(--font-heading)",
            fontSize: "2.5rem",
            fontWeight: 800,
            color: highlight ? "white" : "var(--slate)",
          }}>{price}</span>
          <span style={{ fontSize: "0.875rem", color: highlight ? "rgba(255,255,255,0.70)" : "var(--muted)" }}>/gói</span>
        </div>
        <p style={{ fontSize: "0.8125rem", color: highlight ? "rgba(255,255,255,0.80)" : "var(--muted)", lineHeight: 1.5 }}>{desc}</p>
      </div>

      <ul style={{ listStyle: "none", padding: 0, margin: "0 0 1.75rem", flex: 1 }}>
        {features.map((f, i) => (
          <li key={i} style={{
            display: "flex", alignItems: "flex-start", gap: "0.625rem",
            marginBottom: "0.625rem",
            fontSize: "0.875rem",
            color: highlight ? "rgba(255,255,255,0.90)" : "var(--muted)",
          }}>
            <span style={{
              flexShrink: 0,
              width: "18px", height: "18px",
              background: highlight ? "rgba(255,255,255,0.20)" : "rgba(37, 99, 235, 0.12)",
              borderRadius: "50%",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "0.6rem",
              color: highlight ? "white" : "#2563eb",
              fontWeight: 700,
              marginTop: "2px",
            }}>✓</span>
            {f}
          </li>
        ))}
      </ul>

      <Link href={ctaHref} style={{
        display: "block",
        textAlign: "center",
        padding: "0.875rem",
        borderRadius: "var(--radius-md)",
        fontWeight: 700,
        fontSize: "0.9rem",
        textDecoration: "none",
        transition: "all 0.2s ease",
        background: highlight ? "white" : "#2563eb",
        color: highlight ? "#2563eb" : "white",
        boxShadow: highlight ? "none" : "0 4px 14px rgba(37,99,235,0.25)",
      }}
        onMouseEnter={(e) => {
          if (!highlight) e.target.style.background = "#1d4ed8";
        }}
        onMouseLeave={(e) => {
          if (!highlight) e.target.style.background = "#2563eb";
        }}
      >
        {cta}
      </Link>
    </div>
  );
}

export default function LandingPage() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [session, setSession] = useState(null);

  useEffect(() => {
    async function loadSession() {
      const res = await getSessionAction();
      if (res) setSession(res);
    }
    loadSession();
  }, []);

  // Sync active slide to layout layout.js
  useEffect(() => {
    const event = new CustomEvent("activeSlideChange", { detail: activeSlide });
    window.dispatchEvent(event);
  }, [activeSlide]);

  const getCtaLink = (defaultPath) => {
    if (!session) return defaultPath;
    return session.role === "SHOP" ? "/shop-dashboard" : "/creator-dashboard";
  };

  const slides = [
    {
      image: "/hero_slide_creator.png",
      tag: "AI MATCHING ĐẦU TIÊN TẠI VIỆT NAM",
      title: "KẾT NỐI SHOP & CREATORS CHUẨN XÁC THEO VIBE",
      desc: "Nền tảng đầu tiên ứng dụng AI tự động đọc hiểu bài tuyển dụng, quét phong cách cá nhân để gợi ý công việc phù hợp với tỷ lệ khớp lên tới 99%.",
      btnText: "BẮT ĐẦU 1 THÁNG MIỄN PHÍ →",
      btnLink: "/register"
    },
    {
      image: "/hero_slide_brand_collab.png",
      tag: "GIẢI PHÁP TỐI ƯU CHIẾN DỊCH BRAND",
      title: "CHIẾN DỊCH BÙNG NỔ DOANH SỐ CÙNG KOL/KOC",
      desc: "Tìm đúng creator cho chiến dịch của bạn — định hình phong cách, kết nối chuyên nghiệp và tối ưu ngân sách quảng bá thương hiệu.",
      btnText: "TẠO CHIẾN DỊCH NGAY →",
      btnLink: "/register"
    },
    {
      image: "/hero_slide_group_creators.png",
      tag: "HỒ SƠ NĂNG LỰC ĐẰNG CẤP CHO CREATORS",
      title: "ĐỊNH HÌNH PHONG CÁCH - TỎA SÁNG PORTFOLIO",
      desc: "Hồ sơ năng lực cá nhân hóa giúp truyền tải chuẩn xác vibe độc bản của bạn đến hàng ngàn nhãn hàng lớn chuyên nghiệp nhất.",
      btnText: "THAM GIA CÙNG CASTME →",
      btnLink: "/register"
    }
  ];

  const kolProfiles = [
    { img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80", stats: "470 +51k", cat: "Fashion", activeColor: "#10b981" },
    { img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80", stats: "533 +31k", cat: "Tech", activeColor: "#10b981" },
    { img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80", stats: "355 +31k", cat: "Lifestyle", activeColor: "#a855f7" },
    { img: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80", stats: "410 +42k", cat: "Fashion", activeColor: "#10b981" },
    { img: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=100&auto=format&fit=crop&q=80", stats: "620 +50k", cat: "Reviewer", activeColor: "#f43f5e" },
    { img: "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=100&auto=format&fit=crop&q=80", stats: "290 +28k", cat: "Beauty", activeColor: "#10b981" },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slides.length);
    }, 6500);
    return () => clearInterval(timer);
  }, [slides.length]);

  const handlePrev = () => {
    setActiveSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const handleNext = () => {
    setActiveSlide((prev) => (prev + 1) % slides.length);
  };

  return (
    <div style={{
      background: "linear-gradient(180deg, #e8f0ff 0%, #f0e8ff 30%, #e8fff5 60%, #fff0f5 100%)",
      color: "#1a2b4a",
      position: "relative",
      overflow: "hidden"
    }}>
      {/* ── HERO SLIDER SECTION ── */}
      <section style={{
        position: "relative",
        minHeight: "100vh",
        width: "100%",
        overflow: "hidden",
        backgroundImage: "url('/landing_bg.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        paddingTop: "72px",
      }}>

        {/* ── FLOATING ELEMENTS (LEFT) ── */}
        <div className="hidden-floating glass-panel-light" style={{
          position: "absolute",
          top: "14%",
          left: "3%",
          width: "356px",
          zIndex: 10,
          borderRadius: "24px",
          padding: "16px",
          display: "flex",
          flexDirection: "column",
          gap: "14px",
        }}>
          {/* Tabs */}
          <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
            <span className="landing-tab-active" style={{
              padding: "4px 12px",
              borderRadius: "999px",
              fontSize: "10px",
              fontWeight: 700,
              letterSpacing: "0.03em",
            }}>Synth Wave</span>
            <span className="landing-tab-inactive" style={{
              padding: "4px 12px",
              borderRadius: "999px",
              fontSize: "10px",
              fontWeight: 600,
              letterSpacing: "0.03em",
            }}>Cyber Vinyl</span>
          </div>

          {/* Record Player Image */}
          <div style={{ width: "100%", height: "220px", borderRadius: "14px", overflow: "hidden", border: "1px solid rgba(255,255,255,0.5)" }}>
            <img src="/neon_record_player.png" style={{ width: "100%", height: "100%", objectFit: "cover" }} alt="Record Player" />
          </div>

          {/* Grid of KOL Profiles */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "10px" }}>
            {kolProfiles.map((kol, idx) => (
              <div key={idx} style={{
                display: "flex",
                flexDirection: "column",
                padding: "8px",
                borderRadius: "12px",
                background: "rgba(255,255,255,0.25)",
                border: `1px solid ${kol.activeColor}33`,
                fontSize: "10px",
                position: "relative"
              }}>
                <span style={{ position: "absolute", top: "6px", right: "6px", width: "6px", height: "6px", borderRadius: "50%", background: kol.activeColor, boxShadow: `0 0 6px ${kol.activeColor}` }} />
                <img src={kol.img} style={{ width: "100%", height: "70px", objectFit: "cover", borderRadius: "8px", marginBottom: "4px" }} alt={kol.cat} />
                <div style={{ fontWeight: 800, color: "#1a2b4a" }}>{kol.stats}</div>
                <div style={{ color: "#5a6b82", fontSize: "9px" }}>{kol.cat}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── FLOATING ELEMENTS (RIGHT) ── */}
        {/* Polaroid grid with rose-gold frame */}
        <div className="hidden-floating rose-gold-frame" style={{
          position: "absolute",
          top: "12%",
          right: "3%",
          width: "260px",
          zIndex: 10,
          animation: "floatY 5.5s ease-in-out infinite",
        }}>
          <div style={{
            width: "100%",
            height: "248px",
            overflow: "hidden",
            borderRadius: "16px",
            background: "white",
          }}>
            <img
              src="/polaroid_grid.png"
              alt="Polaroids Grid"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                objectPosition: "top",
              }}
            />
          </div>
        </div>

        {/* Fashion sketch card */}
        <div className="hidden-floating glass-panel-light" style={{
          position: "absolute",
          top: "38%",
          right: "14%",
          width: "72px",
          height: "110px",
          zIndex: 11,
          borderRadius: "16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "12px 8px",
          animation: "floatY 6s ease-in-out infinite 0.5s",
        }}>
          <svg width="48" height="80" viewBox="0 0 48 80" fill="none">
            <path d="M24 4 L8 16 L10 28 L6 76 L42 76 L38 28 L40 16 Z" stroke="#c9956a" strokeWidth="1.5" fill="none" strokeLinejoin="round" />
            <path d="M24 4 L24 76" stroke="#c9956a" strokeWidth="0.8" strokeDasharray="2 2" />
            <ellipse cx="24" cy="12" rx="8" ry="4" stroke="#c9956a" strokeWidth="1" fill="none" />
          </svg>
        </div>

        {/* Ring Light */}
        <div className="hidden-floating" style={{
          position: "absolute",
          top: "42%",
          right: "1%",
          width: "230px",
          zIndex: 9,
          animation: "floatY 7s ease-in-out infinite",
        }}>
          <img
            src="/ring_light.png"
            alt="Ring Light Studio"
            style={{
              width: "100%",
              borderRadius: "20px",
              boxShadow: "0 20px 50px rgba(120, 140, 180, 0.2)",
              border: "1px solid rgba(255,255,255,0.5)",
            }}
          />
        </div>

        {/* Timeline Widget */}
        <div className="hidden-floating glass-panel-light" style={{
          position: "absolute",
          bottom: "12%",
          right: "23%",
          width: "260px",
          padding: "16px",
          borderRadius: "20px",
          zIndex: 10,
          fontSize: "11px",
        }}>
          <div style={{ fontWeight: 700, color: "#1a2b4a", marginBottom: "8px", lineHeight: 1.35 }}>
            Timeline lvk of successful brand campaigns with motion graphics
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", paddingBottom: "10px" }}>
            {[
              "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=80&auto=format&fit=crop&q=80",
              "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=80&auto=format&fit=crop&q=80",
              "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=80&auto=format&fit=crop&q=80",
            ].map((src, i) => (
              <div key={i} style={{ position: "relative", width: "50px", height: "35px", borderRadius: "6px", overflow: "hidden", background: "#ddd", border: "1px solid rgba(255,255,255,0.6)" }}>
                <img src={src} style={{ width: "100%", height: "100%", objectFit: "cover" }} alt={`camp ${i + 1}`} />
                <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: "10px", background: "rgba(0,0,0,0.2)" }}>▶</div>
              </div>
            ))}
          </div>
          <div style={{ height: "4px", background: "rgba(255,255,255,0.4)", borderRadius: "999px", position: "relative", marginTop: "4px" }}>
            <div style={{ position: "absolute", top: 0, left: 0, width: "65%", height: "100%", background: "linear-gradient(90deg, #14b8a6, #2dd4bf)", borderRadius: "999px" }} />
            <div style={{ position: "absolute", top: "-2px", left: "65%", width: "8px", height: "8px", borderRadius: "50%", background: "#14b8a6", boxShadow: "0 0 6px #14b8a6" }} />
          </div>
        </div>

        {/* Campaign Performance widget */}
        <div className="hidden-floating glass-panel-light" style={{
          position: "absolute",
          bottom: "6%",
          right: "3%",
          width: "240px",
          padding: "16px",
          borderRadius: "20px",
          zIndex: 10,
          fontSize: "11px",
        }}>
          <div style={{ fontWeight: 700, color: "#1a2b4a", marginBottom: "12px", textTransform: "lowercase" }}>
            real-time campaign performance
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px", marginBottom: "12px" }}>
            <div>
              <div style={{ color: "#5a6b82", fontSize: "9px" }}>Impressions</div>
              <div style={{ fontWeight: 800, color: "#1a2b4a", fontSize: "12px" }}>5.58K</div>
              <div style={{ color: "#10b981", fontSize: "9px" }}>+12%</div>
            </div>
            <div>
              <div style={{ color: "#5a6b82", fontSize: "9px" }}>Connects</div>
              <div style={{ fontWeight: 800, color: "#1a2b4a", fontSize: "12px" }}>33.5K</div>
              <div style={{ color: "#10b981", fontSize: "9px" }}>+25%</div>
            </div>
            <div>
              <div style={{ color: "#5a6b82", fontSize: "9px" }}>Declined</div>
              <div style={{ fontWeight: 800, color: "#1a2b4a", fontSize: "12px" }}>30.0K</div>
              <div style={{ color: "#ef4444", fontSize: "9px" }}>-0.5%</div>
            </div>
          </div>
          <svg width="100%" height="40" viewBox="0 0 100 30" preserveAspectRatio="none">
            <path d="M0,25 Q15,5 30,18 T60,8 T90,20 L100,5" fill="none" stroke="#14b8a6" strokeWidth="2" strokeLinecap="round" />
            <path d="M0,25 Q15,5 30,18 T60,8 T90,20 L100,5 L100,30 L0,30 Z" fill="url(#chartGradLight)" opacity="0.15" />
            <defs>
              <linearGradient id="chartGradLight" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#14b8a6" />
                <stop offset="100%" stopColor="#14b8a6" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* Slides Wrapper */}
        {slides.map((slide, index) => {
          const isActive = index === activeSlide;
          return (
            <div
              key={index}
              style={{
                position: "absolute",
                inset: 0,
                opacity: isActive ? 1 : 0,
                visibility: isActive ? "visible" : "hidden",
                transition: "opacity 1s ease-in-out, visibility 1s ease-in-out",
                zIndex: isActive ? 5 : 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {/* Slide Content */}
              <div
                style={{
                  position: "relative",
                  zIndex: 6,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "0 1rem",
                  textAlign: "center",
                  maxWidth: "580px",
                  margin: "0 auto",
                }}
              >
                {/* Tag Badge */}
                <div
                  className="landing-tag-pill"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    padding: "0.35rem 1.0625rem",
                    borderRadius: "999px",
                    fontSize: "0.6875rem",
                    fontWeight: 800,
                    marginBottom: "1.75rem",
                    letterSpacing: "0.06em",
                    opacity: isActive ? 1 : 0,
                    transform: isActive ? "translateY(0)" : "translateY(15px)",
                    transition: "all 0.8s ease-out 0.2s",
                  }}
                >
                  # {slide.tag}
                </div>

                {/* Main Heading */}
                <h1
                  className="landing-headline"
                  style={{
                    fontFamily: "var(--font-serif)",
                    fontSize: "clamp(1.75rem, 3.8vw, 2.8rem)",
                    fontWeight: 900,
                    lineHeight: 1.15,
                    letterSpacing: "-0.02em",
                    marginBottom: "1.75rem",
                    opacity: isActive ? 1 : 0,
                    transform: isActive ? "translateY(0)" : "translateY(25px)",
                    transition: "all 0.8s ease-out 0.4s",
                    textTransform: "uppercase",
                    margin: "0 auto 1.75rem",
                  }}
                >
                  {slide.title}
                </h1>

                {/* Subtext */}
                <p
                  style={{
                    fontSize: "0.85rem",
                    color: "#5a6b82",
                    lineHeight: 1.65,
                    maxWidth: "520px",
                    margin: "0 auto 2rem",
                    opacity: isActive ? 1 : 0,
                    transform: isActive ? "translateY(0)" : "translateY(20px)",
                    transition: "all 0.8s ease-out 0.6s",
                  }}
                >
                  {slide.desc}
                </p>

                {/* CTA Button */}
                <div
                  style={{
                    opacity: isActive ? 1 : 0,
                    transform: isActive ? "translateY(0)" : "translateY(15px)",
                    transition: "all 0.8s ease-out 0.8s",
                    marginTop: "0.5rem",
                  }}
                >
                  <Link
                    href={getCtaLink(slide.btnLink)}
                    className="glow-btn-peach btn"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      padding: "0.875rem 2.25rem",
                      borderRadius: "999px",
                      fontWeight: 800,
                      fontSize: "0.8125rem",
                      textDecoration: "none",
                      letterSpacing: "0.06em",
                      justifyContent: "center",
                    }}
                  >
                    {slide.btnText}
                  </Link>
                </div>
              </div>
            </div>
          );
        })}

        {/* Right Arrow Control */}
        <button
          onClick={handleNext}
          className="hidden-floating glass-panel-light"
          style={{
            position: "absolute",
            right: "1.5rem",
            top: "50%",
            transform: "translateY(-50%)",
            width: "44px",
            height: "44px",
            borderRadius: "50%",
            color: "#1a2b4a",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            zIndex: 100,
            transition: "all 0.25s ease",
            border: "1px solid rgba(255,255,255,0.5)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow = "0 8px 24px rgba(255, 120, 150, 0.25)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = "none";
          }}
        >
          <ChevronRight size={18} />
        </button>

        {/* Dot Pagination indicators */}
        <div
          style={{
            position: "absolute",
            bottom: "3rem",
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            gap: "0.5rem",
            zIndex: 10,
            alignItems: "center",
          }}
        >
          {slides.map((_, index) => {
            const isActive = index === activeSlide;
            return (
              <button
                key={index}
                onClick={() => setActiveSlide(index)}
                className={isActive ? "landing-dot-active" : "landing-dot-inactive"}
                style={{
                  width: isActive ? "32px" : "8px",
                  height: "8px",
                  borderRadius: "999px",
                  border: "none",
                  cursor: "pointer",
                  padding: 0,
                  transition: "all 0.3s ease",
                }}
              />
            );
          })}
        </div>
      </section>

      {/* ── FEATURES SECTION ── */}
      <section id="features" style={{
        padding: "6rem 1.5rem",
        background: "rgba(255, 255, 255, 0.15)",
        position: "relative",
        overflow: "hidden",
        borderTop: "1px solid rgba(255,255,255,0.3)"
      }}>
        {/* Ambient Glows */}
        <div style={{
          position: "absolute",
          top: "20%",
          left: "-10%",
          width: "400px",
          height: "400px",
          background: "radial-gradient(circle, rgba(223, 195, 157, 0.03) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />
        <div style={{
          position: "absolute",
          bottom: "10%",
          right: "-10%",
          width: "400px",
          height: "400px",
          background: "radial-gradient(circle, rgba(59, 130, 246, 0.03) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "4rem" }}>
            <div className="badge badge-primary landing-tag-pill" style={{ marginBottom: "1rem" }}>
              MỘT NỀN TẢNG — HAI GIAO DIỆN
            </div>
            <h2 className="landing-headline" style={{
              fontFamily: "var(--font-heading)",
              fontSize: "clamp(1.75rem, 4vw, 2.5rem)",
              fontWeight: 800,
              letterSpacing: "-0.03em",
              marginBottom: "0.75rem",
            }}>
              Không gian riêng cho từng người dùng
            </h2>
            <p style={{ fontSize: "1rem", color: "#5a6b82", maxWidth: "550px", margin: "0 auto", lineHeight: 1.7 }}>
              Dù bạn là thương hiệu đi tìm gương mặt đại diện hay creator đi tìm job, Castme đều có giải pháp tối ưu cho bạn.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "2rem" }}>
            {/* Shop Card */}
            <div className="glass-panel-light" style={{ padding: "2.5rem 2rem", borderRadius: "24px" }}>
              <div style={{
                width: "52px", height: "52px",
                background: "rgba(255, 154, 108, 0.15)",
                borderRadius: "var(--radius-md)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "1.5rem",
                marginBottom: "1.25rem",
                border: "1px solid rgba(255, 154, 108, 0.3)",
              }}>🏪</div>
              <h3 style={{
                fontFamily: "var(--font-heading)",
                fontSize: "1.25rem",
                fontWeight: 800,
                color: "#1a2b4a",
                marginBottom: "0.5rem",
              }}>Dành cho Shop & Nhãn hàng</h3>
              <p style={{ fontSize: "0.875rem", color: "#5a6b82", marginBottom: "1.5rem", lineHeight: 1.6 }}>
                Tìm đúng creator cho chiến dịch của bạn — không cần mò mẫm, không cần lãng phí ngân sách quảng cáo.
              </p>
              <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                <CheckItem><strong>My Casting:</strong> Quản lý bài đăng tuyển dụng dễ dàng</CheckItem>
                <CheckItem><strong>Tìm kiếm theo Vibe:</strong> Bộ lọc thông minh thay vì tìm từ khóa khô khan</CheckItem>
                <CheckItem><strong>AI Matching:</strong> Tự động hiển thị danh sách người phù hợp</CheckItem>
                <CheckItem><strong>Recent Applications:</strong> Duyệt nhanh các creator vừa ứng tuyển</CheckItem>
              </ul>
              <Link href={getCtaLink("/register")} style={{
                display: "inline-block",
                marginTop: "1.75rem",
                padding: "0.625rem 1.5rem",
                background: "rgba(255, 154, 108, 0.15)",
                color: "#c2410c",
                borderRadius: "var(--radius-full)",
                fontSize: "0.875rem",
                fontWeight: 700,
                textDecoration: "none",
                transition: "all 0.2s",
                border: "1px solid rgba(255, 154, 108, 0.25)"
              }}
                onMouseEnter={(e) => {
                  e.target.style.background = "linear-gradient(135deg, #ffb07a, #ff7eb3)";
                  e.target.style.color = "white";
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = "rgba(255, 154, 108, 0.15)";
                  e.target.style.color = "#c2410c";
                }}
              >
                {session ? "Vào Dashboard Shop →" : "Đăng ký tài khoản Shop →"}
              </Link>
            </div>

            {/* Creator Card */}
            <div className="glass-panel-light" style={{ padding: "2.5rem 2rem", borderRadius: "24px" }}>
              <div style={{
                width: "52px", height: "52px",
                background: "rgba(255, 154, 108, 0.15)",
                borderRadius: "var(--radius-md)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "1.5rem",
                marginBottom: "1.25rem",
                border: "1px solid rgba(255, 154, 108, 0.3)",
              }}>📸</div>
              <h3 style={{
                fontFamily: "var(--font-heading)",
                fontSize: "1.25rem",
                fontWeight: 800,
                color: "#1a2b4a",
                marginBottom: "0.5rem",
              }}>Dành cho KOC / KOL</h3>
              <p style={{ fontSize: "0.875rem", color: "#5a6b82", marginBottom: "1.5rem", lineHeight: 1.6 }}>
                Nhận công việc phù hợp với phong cách cá nhân của bạn, xây dựng hồ sơ chuyên nghiệp thu hút Brand.
              </p>
              <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                <CheckItem><strong>My Job:</strong> Theo dõi tiến độ các chiến dịch đã nhận</CheckItem>
                <CheckItem><strong>Portfolio & Feedback:</strong> Hồ sơ năng lực đẹp tích hợp đánh giá từ Brand</CheckItem>
                <CheckItem><strong>AI Matching:</strong> Gợi ý shop phù hợp với phong cách của bạn</CheckItem>
                <CheckItem><strong>Doanh thu minh bạch:</strong> Quản lý dòng tiền, rút tiền nhanh chóng</CheckItem>
              </ul>
              <Link href={getCtaLink("/register")} style={{
                display: "inline-block",
                marginTop: "1.75rem",
                padding: "0.625rem 1.5rem",
                background: "rgba(255, 154, 108, 0.15)",
                color: "#c2410c",
                borderRadius: "var(--radius-full)",
                fontSize: "0.875rem",
                fontWeight: 700,
                textDecoration: "none",
                transition: "all 0.2s",
                border: "1px solid rgba(255, 154, 108, 0.25)"
              }}
                onMouseEnter={(e) => {
                  e.target.style.background = "linear-gradient(135deg, #ffb07a, #ff7eb3)";
                  e.target.style.color = "white";
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = "rgba(255, 154, 108, 0.15)";
                  e.target.style.color = "#c2410c";
                }}
              >
                {session ? "Vào Dashboard Creator →" : "Đăng ký tài khoản Creator →"}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── AI MATCHING SECTION ── */}
      <section id="ai-matching" style={{
        padding: "6rem 1.5rem",
        background: "transparent",
        position: "relative",
        overflow: "hidden",
        borderTop: "1px solid rgba(255,255,255,0.3)"
      }}>
        {/* Ambient Glows */}
        <div style={{
          position: "absolute",
          top: "10%",
          right: "-10%",
          width: "500px",
          height: "500px",
          background: "radial-gradient(circle, rgba(244, 63, 94, 0.02) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />
        <div style={{
          position: "absolute",
          bottom: "10%",
          left: "-10%",
          width: "450px",
          height: "450px",
          background: "radial-gradient(circle, rgba(223, 195, 157, 0.03) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />
        <div style={{ maxWidth: "1100px", margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "4rem", alignItems: "center" }}>
          <div>
            <div className="badge badge-primary landing-tag-pill" style={{ marginBottom: "1rem" }}>
              AI MATCHING ENGINE
            </div>
            <h2 style={{
              fontFamily: "var(--font-heading)",
              fontSize: "clamp(1.75rem, 4vw, 2.5rem)",
              fontWeight: 800,
              color: "#1a2b4a",
              letterSpacing: "-0.03em",
              marginBottom: "1rem",
              lineHeight: 1.15,
            }}>
              Cơ chế AI Matching<br />
              <span style={{ color: "#ff6b9d" }}>hoạt động như thế nào?</span>
            </h2>
            <p style={{ color: "#5a6b82", lineHeight: 1.75, marginBottom: "1rem" }}>
              Mỗi khi KOL/KOC tạo tài khoản, hệ thống yêu cầu mô tả ngắn về phong cách, vibe chụp ảnh và tệp fan của bạn.
            </p>
            <p style={{ color: "#5a6b82", lineHeight: 1.75, marginBottom: "2.5rem" }}>
              Khi Shop đăng tuyển chiến dịch mới, AI sẽ <strong style={{ color: "#1a2b4a" }}>tóm tắt và so khớp nội dung theo thời gian thực</strong>. Kết quả hiển thị trực quan bằng <strong style={{ color: "#ff6b9d" }}>tỷ lệ % phù hợp</strong>.
            </p>

            {/* Steps */}
            {[
              { icon: "📝", title: "Mô tả phong cách", desc: "Creator nhập vibe, style và tệp nội dung của mình" },
              { icon: "🤖", title: "AI phân tích", desc: "Hệ thống tóm tắt và vector hóa bài tuyển dụng của Shop" },
              { icon: "🎯", title: "Match & Gợi ý", desc: "Hiển thị danh sách phù hợp kèm tỷ lệ % khớp" },
            ].map((step, i) => (
              <div key={i} style={{ display: "flex", gap: "1rem", marginBottom: "1.25rem" }}>
                <div style={{
                  width: "40px", height: "40px", flexShrink: 0,
                  background: "rgba(223, 195, 157, 0.05)",
                  borderRadius: "var(--radius-md)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "1.1rem",
                  border: "1px solid rgba(223, 195, 157, 0.25)",
                }}>{step.icon}</div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: "0.9rem", color: "#1a2b4a", marginBottom: "0.25rem" }}>{step.title}</div>
                  <div style={{ fontSize: "0.8125rem", color: "#5a6b82", lineHeight: 1.5 }}>{step.desc}</div>
                </div>
              </div>
            ))}
          </div>

          {/* AI Panel Visual */}
          <div className="glass-panel-light" style={{
            borderRadius: "var(--radius-xl)",
            padding: "2rem 1.75rem",
            position: "relative",
            overflow: "hidden",
          }}>
            <div style={{
              position: "absolute",
              top: "-80px", left: "-80px",
              width: "250px", height: "250px",
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(223, 195, 157, 0.1) 0%, transparent 70%)",
            }} />
            <div style={{
              position: "absolute",
              bottom: "-60px", right: "-60px",
              width: "200px", height: "200px",
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(255,255,255,0.02) 0%, transparent 70%)",
            }} />

            <div style={{ position: "relative" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
                <span style={{ fontSize: "0.6875rem", color: "#5a6b82", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em" }}>
                  Hệ thống đang gợi ý Job
                </span>
                <span style={{
                  background: "linear-gradient(135deg, #ffb07a, #ff7eb3)",
                  color: "white",
                  fontSize: "0.625rem",
                  fontWeight: 800,
                  padding: "0.2rem 0.6rem",
                  borderRadius: "var(--radius-full)",
                }}>● ACTIVE</span>
              </div>

              <div style={{
                background: "rgba(255,255,255,0.35)",
                border: "1px solid rgba(255,255,255,0.5)",
                borderRadius: "var(--radius-lg)",
                padding: "1.25rem",
                marginBottom: "0.75rem",
                position: "relative",
              }}>
                <div style={{
                  position: "absolute", top: "0.875rem", right: "0.875rem",
                  background: "linear-gradient(135deg, #ffb07a, #ff7eb3)",
                  color: "white",
                  fontSize: "0.6875rem",
                  fontWeight: 800,
                  padding: "0.25rem 0.625rem",
                  borderRadius: "var(--radius-sm)",
                }}>🎯 96% Khớp Vibe</div>
                <h4 style={{ fontFamily: "var(--font-heading)", fontWeight: 700, color: "#1a2b4a", fontSize: "1rem", marginBottom: "0.25rem" }}>
                  BST Mùa Hè — Streetwear
                </h4>
                <p style={{ fontSize: "0.75rem", color: "#5a6b82", marginBottom: "0.875rem" }}>Shop: Savage Studio</p>
                <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                  {["Minimalist", "Cá tính", "GenZ"].map((tag) => (
                    <span key={tag} style={{
                      fontSize: "0.6875rem",
                      background: "rgba(255,255,255,0.4)",
                      color: "#1a2b4a",
                      padding: "0.2rem 0.625rem",
                      borderRadius: "var(--radius-full)",
                      border: "1px solid rgba(255,255,255,0.5)",
                    }}>{tag}</span>
                  ))}
                </div>
              </div>

              {/* Score bar */}
              <div style={{ background: "rgba(255,255,255,0.25)", borderRadius: "var(--radius-md)", padding: "1rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                  <span style={{ fontSize: "0.75rem", color: "#5a6b82" }}>Mức độ phù hợp</span>
                  <span style={{ fontSize: "0.75rem", fontWeight: 800, color: "#ff6b9d" }}>Rất cao</span>
                </div>
                <div style={{ height: "6px", background: "rgba(255,255,255,0.4)", borderRadius: "999px", overflow: "hidden" }}>
                  <div style={{
                    height: "100%", width: "96%",
                    background: "linear-gradient(90deg, #ffb07a 0%, #ff6b9d 100%)",
                    borderRadius: "999px",
                  }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SOCIAL PROOF ── */}
      <section style={{ padding: "4rem 1.5rem", background: "rgba(255,255,255,0.1)", borderTop: "1px solid rgba(255,255,255,0.3)" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto", textAlign: "center" }}>
          <p style={{ fontSize: "0.8125rem", color: "#5a6b82", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "2rem" }}>
            Đã được tin tưởng bởi các nhãn hàng
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "1.5rem", alignItems: "center" }}>
            {["Savage Studio", "Bloom Beauty", "TechVibe Store", "Urban Closet", "Fresh Café"].map((brand) => (
              <div key={brand} style={{
                padding: "0.625rem 1.5rem",
                background: "rgba(255,255,255,0.3)",
                border: "1px solid rgba(255,255,255,0.5)",
                borderRadius: "var(--radius-full)",
                fontSize: "0.875rem",
                fontWeight: 600,
                color: "#5a6b82",
                transition: "all 0.25s ease",
                cursor: "default",
              }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#ff6b9d"; e.currentTarget.style.color = "#1a2b4a"; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.5)"; e.currentTarget.style.color = "#5a6b82"; }}
              >{brand}</div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING SECTION ── */}
      <section id="pricing" style={{
        padding: "6rem 1.5rem",
        background: "transparent",
        position: "relative",
        overflow: "hidden",
        borderTop: "1px solid rgba(255,255,255,0.3)"
      }}>
        {/* Ambient Glows */}
        <div style={{
          position: "absolute",
          top: "20%",
          left: "50%",
          transform: "translateX(-50%)",
          width: "600px",
          height: "600px",
          background: "radial-gradient(circle, rgba(37, 99, 235, 0.03) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "4rem" }}>
            <div className="badge badge-primary landing-tag-pill" style={{ marginBottom: "1rem" }}>BẢNG GIÁ</div>
            <h2 className="landing-headline" style={{
              fontFamily: "var(--font-heading)",
              fontSize: "clamp(1.75rem, 4vw, 2.5rem)",
              fontWeight: 800,
              letterSpacing: "-0.03em",
              marginBottom: "0.75rem",
            }}>
              Chi phí minh bạch, tối ưu dòng tiền
            </h2>
            <p style={{ color: "#5a6b82", maxWidth: "480px", margin: "0 auto", lineHeight: 1.7 }}>
              Đăng ký ngay hôm nay để nhận <strong style={{ color: "#ff6b9d" }}>1 tháng dùng thử miễn phí</strong> đầy đủ tính năng.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "2rem", alignItems: "start" }}>
            <PricingCard
              tier="Trải Nghiệm Đầu"
              price="0đ"
              desc="Miễn phí 1 tháng đầu tiên cho tài khoản mới"
              features={[
                "Thử nghiệm toàn bộ tính năng",
                "Nhận đề xuất AI Matching cơ bản",
                "Phí trung gian giao dịch: 3%",
              ]}
              cta={session ? "Vào Dashboard" : "Đăng ký thử ngay"}
              ctaHref={getCtaLink("/register")}
              highlight={false}
            />
            <PricingCard
              tier="Gói Pro"
              price="49k"
              desc="Dành cho cá nhân và thương hiệu vừa nhỏ"
              features={[
                "Mở khóa bộ lọc nâng cao (Filter)",
                "Nhận ngay 20 lượt connect chiến dịch",
                "AI Matching ưu tiên cao hơn",
                "Phí trung gian giao dịch: 3%",
              ]}
              cta={session ? "Sử dụng Gói Pro" : "Nâng cấp Pro"}
              ctaHref={getCtaLink("/register")}
              highlight={true}
            />
            <PricingCard
              tier="Gói Ultra"
              price="99k"
              desc="Dành cho các chiến dịch bùng nổ liên tục"
              features={[
                "Mở khóa bộ lọc nâng cao tối đa",
                "Nhận ngay 50 lượt connect chiến dịch",
                "Ưu tiên hiển thị thuật toán AI",
                "Phí trung gian giao dịch: 3%",
              ]}
              cta={session ? "Sử dụng Gói Ultra" : "Nâng cấp Ultra"}
              ctaHref={getCtaLink("/register")}
              highlight={false}
            />
          </div>

          {/* Hearts Info */}
          <div className="glass-panel-light" style={{
            marginTop: "3rem",
            borderRadius: "var(--radius-xl)",
            padding: "2rem",
            textAlign: "center",
            maxWidth: "640px",
            margin: "3rem auto 0",
          }}>
            <div style={{
              fontSize: "1.5rem",
              marginBottom: "0.5rem",
              animation: "floatY 3s ease-in-out infinite",
              display: "inline-block",
            }}>💖</div>
            <h4 style={{
              fontFamily: "var(--font-heading)",
              fontWeight: 800,
              fontSize: "1.1rem",
              color: "#ff6b9d",
              marginBottom: "0.5rem",
            }}>
              Hệ thống Tim & Lượt Connect nội bộ
            </h4>
            <p style={{ fontSize: "0.875rem", color: "var(--muted)", lineHeight: 1.6, marginBottom: "1.25rem" }}>
              Khi hết lượt connect, bạn có thể bổ sung bằng trái tim. Mỗi lượt kết nối tiêu hao <strong style={{ color: "#ff6b9d" }}>5 trái tim</strong>.
            </p>
            <div style={{
              display: "inline-block",
              background: "rgba(255, 255, 255, 0.5)",
              border: "1px solid rgba(255, 107, 157, 0.3)",
              borderRadius: "var(--radius-md)",
              padding: "0.5rem 1.5rem",
              fontSize: "0.875rem",
              fontWeight: 800,
              color: "#ff6b9d",
            }}>
              Mức giá nạp cực hời: 5 tim / 3.000đ{" "}
              <span style={{ fontSize: "0.75rem", fontWeight: 400, color: "var(--subtle)" }}>
                (áp dụng đơn từ 15.000đ)
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ── 6. CTA BOTTOM BANNER ── */}
      <section style={{
        padding: "6rem 1.5rem",
        background: "rgba(255, 255, 255, 0.2)",
        textAlign: "center",
        position: "relative",
        overflow: "hidden",
        borderTop: "1px solid rgba(255,255,255,0.3)"
      }}>
        <div style={{ position: "relative" }}>
          <h2 className="landing-headline" style={{
            fontFamily: "var(--font-heading)",
            fontSize: "clamp(1.75rem, 4vw, 2.75rem)",
            fontWeight: 800,
            letterSpacing: "-0.03em",
            marginBottom: "1rem",
          }}>
            Sẵn sàng tìm đúng người — đúng vibe?
          </h2>
          <p style={{ color: "#5a6b82", fontSize: "1rem", marginBottom: "2.5rem", lineHeight: 1.7 }}>
            Tham gia cùng hàng trăm Shop và Creator đang xây dựng<br />chiến dịch thành công trên Castme.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem", justifyContent: "center" }}>
            <Link href={getCtaLink("/register")} className="glow-btn-peach btn" style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.9375rem 2.25rem",
              borderRadius: "var(--radius-full)",
              fontWeight: 800,
              fontSize: "1rem",
              textDecoration: "none",
            }}>
              {session ? "Đi tới Dashboard →" : "Bắt đầu miễn phí 1 tháng →"}
            </Link>
            <Link href="/login" style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.9375rem 2.25rem",
              background: "rgba(255,255,255,0.35)",
              color: "#1a2b4a",
              borderRadius: "var(--radius-full)",
              fontWeight: 700,
              fontSize: "1rem",
              textDecoration: "none",
              border: "1.5px solid rgba(255,255,255,0.5)",
              transition: "all 0.2s ease",
            }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#ff6b9d"; e.currentTarget.style.color = "#ff6b9d"; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.5)"; e.currentTarget.style.color = "#1a2b4a"; }}
            >
              Đã có tài khoản
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}