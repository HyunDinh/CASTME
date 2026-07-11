"use client";
import React, { useState, useEffect } from "react";
import { getAvailableJobs, applyToJobAction, getPublicShopProfile, getPublicShops } from "#/app/(creator)/actions";
import { useSearchParams, useRouter } from "next/navigation";
import { Suspense } from "react";
import ShopProfileModal from "#/components/ShopProfileModal";
import {
  Sparkles,
  Store,
  Zap,
  X,
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
  DollarSign,
  ExternalLink,
  Globe,
  Instagram,
  Star,
  Briefcase,
  Search,
} from "lucide-react";

/* ── Peach Blossom SVG (Premium Floating Flower Decor) ── */
function PeachBlossom({ size = 48, style = {} }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      style={{
        filter: "drop-shadow(0 4px 10px rgba(244, 63, 94, 0.15))",
        pointerEvents: "none",
        ...style,
      }}
    >
      <defs>
        <radialGradient id="petalGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fff0f2" />
          <stop offset="60%" stopColor="#fda4af" />
          <stop offset="100%" stopColor="#f43f5e" />
        </radialGradient>
        <radialGradient id="centerGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fde047" />
          <stop offset="70%" stopColor="#eab308" />
          <stop offset="100%" stopColor="#ca8a04" />
        </radialGradient>
      </defs>
      {/* 5 Petals */}
      <path d="M50 50 C40 22 22 22 36 42 C43 49 48 50 50 50 Z" fill="url(#petalGrad)" opacity="0.95" />
      <path d="M50 50 C78 42 78 22 58 36 C51 43 50 48 50 50 Z" fill="url(#petalGrad)" opacity="0.95" />
      <path d="M50 50 C78 68 64 82 54 68 C49 61 50 52 50 50 Z" fill="url(#petalGrad)" opacity="0.95" />
      <path d="M50 50 C22 68 32 82 42 64 C47 57 48 52 50 50 Z" fill="url(#petalGrad)" opacity="0.95" />
      <path d="M50 50 C18 42 18 22 36 32 C43 39 48 48 50 50 Z" fill="url(#petalGrad)" opacity="0.95" />
      {/* Stamens center */}
      <circle cx="50" cy="50" r="7" fill="url(#centerGrad)" />
      <circle cx="47" cy="47" r="1" fill="#fff" opacity="0.8" />
      <circle cx="53" cy="48" r="0.8" fill="#fff" opacity="0.8" />
      <circle cx="50" cy="53" r="0.8" fill="#fff" opacity="0.8" />
    </svg>
  );
}

/* ── Falling Petal SVG ── */
function Petal({ size = 20, style = {} }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 50 50"
      style={{
        filter: "drop-shadow(0 2px 5px rgba(244, 63, 94, 0.12))",
        pointerEvents: "none",
        ...style,
      }}
    >
      <defs>
        <linearGradient id="singlePetalGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fff" />
          <stop offset="100%" stopColor="#fecdd3" />
        </linearGradient>
      </defs>
      <path d="M25 5 C38 12 45 28 35 42 C25 48 12 38 15 25 C17 12 20 8 25 5 Z" fill="url(#singlePetalGrad)" opacity="0.9" />
    </svg>
  );
}

/* ── Sparkle Star SVG ── */
function SparkleIcon({ size = 24, style = {} }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      style={{
        pointerEvents: "none",
        ...style,
      }}
    >
      <path
        d="M12 0 C12 6.6 17.4 12 24 12 C17.4 12 12 17.4 12 24 C12 17.4 6.6 12 0 12 C6.6 12 12 6.6 12 0 Z"
        fill="white"
        stroke="rgba(37, 99, 235, 0.12)"
        strokeWidth="1.2"
      />
    </svg>
  );
}

/* ── Image Slider (Sleek auto-sliding carousel at the top) ── */
function ImageSlider() {
  const [current, setCurrent] = useState(0);
  const slides = [
    { image: "/hero_slide_1.jpg", title: "", desc: "" },
    { image: "/hero_slide_2.jpg", title: "", desc: "" },
    { image: "/hero_slide_3.jpg", title: "", desc: "" }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent(prev => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [slides.length]);

  return (
    <div style={{
      width: "100%",
      height: "420px",
      borderRadius: "var(--radius-xl)",
      overflow: "hidden",
      position: "relative",
      boxShadow: "0 10px 30px rgba(37, 99, 235, 0.04)",
      marginBottom: "0.5rem",
      background: "#426d65ff"
    }}>
      {/* Slides */}
      {slides.map((slide, idx) => (
        <div
          key={idx}
          style={{
            position: "absolute",
            inset: 0,
            opacity: idx === current ? 1 : 0,
            transition: "opacity 0.8s ease-in-out",
            zIndex: idx === current ? 1 : 0,
          }}
        >
          {/* Dark overlay for readability - only if text exists */}
          {(slide.title || slide.desc) && (
            <div style={{
              position: "absolute",
              inset: 0,
              background: "linear-gradient(180deg, rgba(0,0,0,0) 30%, rgba(0,0,0,0.6) 100%)",
              zIndex: 2
            }} />
          )}
          <img
            src={slide.image}
            alt="slide"
            style={{ width: "100%", height: "100%", objectFit: "contain", objectPosition: "center" }}
          />
          {/* Overlay Text */}
          {(slide.title || slide.desc) && (
            <div style={{
              position: "absolute",
              bottom: "2rem",
              left: "2rem",
              right: "2rem",
              color: "white",
              zIndex: 3,
              textShadow: "0 1px 3px rgba(0,0,0,0.3)"
            }}>
              {slide.title && (
                <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "1.375rem", fontWeight: 800, marginBottom: "0.25rem" }}>
                  {slide.title}
                </h2>
              )}
              {slide.desc && (
                <p style={{ fontSize: "0.8125rem", opacity: 0.9, fontWeight: 500 }}>
                  {slide.desc}
                </p>
              )}
            </div>
          )}
        </div>
      ))}

      {/* Dots pagination */}
      <div style={{
        position: "absolute",
        bottom: "1rem",
        right: "2.5rem",
        display: "flex",
        gap: "0.4rem",
        zIndex: 5
      }}>
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrent(idx)}
            style={{
              width: idx === current ? "20px" : "6px",
              height: "6px",
              borderRadius: "99px",
              background: idx === current ? "#ffffff" : "rgba(255,255,255,0.4)",
              border: "none",
              cursor: "pointer",
              transition: "all 0.3s ease",
              padding: 0
            }}
          />
        ))}
      </div>
    </div>
  );
}

/* ── Vibe Tag ── */
function VibeTag({ tag }) {
  return (
    <span style={{
      fontSize: "0.6875rem",
      fontWeight: 600,
      padding: "0.2rem 0.625rem",
      background: "var(--primary-light)",
      color: "var(--primary)",
      borderRadius: "var(--radius-full)",
      border: "1px solid var(--primary-muted)",
    }}>
      #{tag}
    </span>
  );
}

/* ── Match Badge ── */
function MatchBadge({ rate, small }) {
  const color = rate >= 90 ? "var(--success)" : rate >= 75 ? "var(--warning)" : "var(--muted)";
  const bg = rate >= 90 ? "var(--success-light)" : rate >= 75 ? "var(--warning-light)" : "#F1F5F9";
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: "3px",
      fontSize: small ? "0.625rem" : "0.75rem",
      fontWeight: 800,
      padding: small ? "0.2rem 0.5rem" : "0.3rem 0.7rem",
      background: bg, color,
      borderRadius: "var(--radius-full)",
      border: `1px solid ${color}30`,
    }}>
      🎯 {rate}%
    </span>
  );
}

export default function CreatorDashboard() {
  return (
    <Suspense fallback={<div style={{ padding: "4rem", textAlign: "center", color: "var(--muted)", display: "flex", justifyContent: "center" }}><div style={{ width: "32px", height: "32px", border: "3px solid var(--primary-muted)", borderTopColor: "var(--primary)", borderRadius: "50%", animation: "spinSlow 0.8s linear infinite" }} /></div>}>
      <CreatorDashboardContent />
    </Suspense>
  );
}

function CreatorDashboardContent() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [shops, setShops] = useState([]);
  const [loadingShops, setLoadingShops] = useState(true);
  const [applyingId, setApplyingId] = useState(null);
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast(prev => ({ ...prev, show: false })), 3000);
  };
  const [shopModalOpen, setShopModalOpen] = useState(false);
  const [shopProfile, setShopProfile] = useState(null);
  const [loadingShop, setLoadingShop] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [expanded, setExpanded] = useState(false);
  const [selectedShopInfo, setSelectedShopInfo] = useState(null);
  const [loadingSelectedShop, setLoadingSelectedShop] = useState(false);

  const carouselRef = React.useRef(null);

  const scroll = (direction) => {
    if (carouselRef.current) {
      const { clientWidth } = carouselRef.current;
      // Scroll by one card width (on desktop it is 1/3 of the container width)
      const cardWidth = clientWidth / 3;
      const scrollAmount = direction === "left" ? -cardWidth : cardWidth;
      carouselRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };
  const isDown = React.useRef(false);
  const startX = React.useRef(0);
  const scrollLeftState = React.useRef(0);

  const handleMouseDown = (e) => {
    isDown.current = true;
    if (carouselRef.current) {
      carouselRef.current.style.cursor = "grabbing";
      startX.current = e.pageX - carouselRef.current.offsetLeft;
      scrollLeftState.current = carouselRef.current.scrollLeft;
    }
  };

  const handleMouseLeave = () => {
    isDown.current = false;
    if (carouselRef.current) {
      carouselRef.current.style.cursor = "grab";
    }
  };

  const handleMouseUp = () => {
    isDown.current = false;
    if (carouselRef.current) {
      carouselRef.current.style.cursor = "grab";
    }
  };

  const handleMouseMove = (e) => {
    if (!isDown.current || !carouselRef.current) return;
    e.preventDefault();
    const x = e.pageX - carouselRef.current.offsetLeft;
    const walk = (x - startX.current) * 1.5;
    carouselRef.current.scrollLeft = scrollLeftState.current - walk;
  };

  const getProjectName = (title) => {
    let clean = title.replace(/tuyển koc\/kol review/i, "").trim();
    clean = clean.split(/[–-]/)[0].trim();
    return clean || "Chiến dịch chính";
  };

  const fetchJobs = async () => {
    setLoading(true);
    setLoadingShops(true);
    try {
      const data = await getAvailableJobs();
      const formatted = data.map((job) => ({
        id: job.id,
        shopId: job.shop?.id || null,
        shopName: job.shop?.name || "Unknown Shop",
        title: job.title,
        description: job.description,
        budget: job.budget,
        vibeTags: job.vibeTags || [],
        matchRate: job.matchRate || Math.floor(Math.random() * 30) + 70,
        aiSummary: job.aiSummary || null,
      }));
      setJobs(formatted);

      const shopsRes = await getPublicShops();
      if (shopsRes.success) {
        setShops(shopsRes.data);
      }
    } catch (error) {
      console.error("Lỗi khi tải dữ liệu dashboard:", error);
    } finally {
      setLoading(false);
      setLoadingShops(false);
    }
  };

  useEffect(() => { fetchJobs(); }, []);

  const handleConnect = async (jobId) => {
    if (applyingId) return;
    const confirmApply = window.confirm("Xác nhận dùng 5 Trái Tim để ứng tuyển công việc này?");
    if (!confirmApply) return;
    setApplyingId(jobId);
    const result = await applyToJobAction(jobId);
    if (result.success) {
      showToast("✅ Ứng tuyển thành công! Shop sẽ xem hồ sơ của bạn sớm.");
      setJobs(prev => prev.filter(j => j.id !== jobId));
    } else {
      showToast(`❌ ${result.error || "Không thể ứng tuyển lúc này"}`, "error");
    }
    setApplyingId(null);
  };

  const viewShopProfile = async (shopId) => {
    if (!shopId) return alert("Không tìm thấy cửa hàng");
    setShopProfile(null);
    setLoadingShop(true);
    setShopModalOpen(true);
    const result = await getPublicShopProfile(shopId);
    if (result.success) setShopProfile(result.data);
    else { alert(result.error || "Không thể tải hồ sơ cửa hàng"); setShopProfile(null); }
    setLoadingShop(false);
  };

  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    setSearchQuery(searchParams.get("q") || "");
  }, [searchParams]);

  useEffect(() => {
    async function loadShopInfo() {
      if (selectedJob && selectedJob.shopId) {
        setSelectedShopInfo(null);
        setLoadingSelectedShop(true);
        try {
          const result = await getPublicShopProfile(selectedJob.shopId);
          if (result.success) {
            setSelectedShopInfo(result.data);
          }
        } catch (err) {
          console.error("Error loading shop profile in modal:", err);
        } finally {
          setLoadingSelectedShop(false);
        }
      } else {
        setSelectedShopInfo(null);
      }
    }
    loadShopInfo();
  }, [selectedJob]);

  const handleSearchChange = (val) => {
    setSearchQuery(val);
  };

  const filteredJobs = jobs.filter(job =>
    !searchQuery ||
    job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    job.shopName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    job.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const allJobs = filteredJobs;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2.5rem", animation: "fadeIn 0.4s ease" }}>
      <style>{`
        .dashboard-container-card {
          background: #ffffffbe;
          border-radius: 24px;
          padding: 2.5rem;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.04);
          border: 1px solid rgba(0, 0, 0, 0.06);
          display: flex;
          flex-direction: column;
          gap: 2.5rem;
        }
        @media (max-width: 768px) {
          .dashboard-container-card {
            padding: 1.25rem;
            border-radius: 16px;
            gap: 1.75rem;
          }
        }
      `}</style>

      <div className="dashboard-container-card">
        {/* ── TOP IMAGE SLIDER ── */}
        <ImageSlider />

        {/* ── Page Header ── */}
        <div style={{ marginBottom: "-1rem" }}>
          <h1 style={{ fontFamily: "var(--font-heading)", fontSize: "1.5rem", fontWeight: 850, color: "var(--charcoal)", letterSpacing: "-0.03em", marginBottom: "0.25rem", textTransform: "uppercase" }}>
            Khám phá Chiến dịch
          </h1>
          <p style={{ fontSize: "0.8125rem", color: "var(--ash)", fontWeight: 500 }}>
            AI đã tìm thấy {shops.length} shop phù hợp với phong cách của bạn.
          </p>
        </div>

        {/* ═══ AI MATCHING BANNER (LIGHT GLASSMORPHIC REDESIGN) ═══ */}
        <section style={{
          background: "rgba(251, 251, 251, 0.14)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          border: "2.5px solid rgba(255, 107, 157, 0.35)",
          borderRadius: "var(--radius-xl)",
          padding: "2.25rem 2rem",
          position: "relative",
          overflow: "visible", // Allows the absolute flowers to spill out correctly
          boxShadow: "0 20px 48px -10px rgba(37, 99, 235, 0.05)",
        }}>
          {/* Floating Flowers & Petals Decorations (Peach Blossoms) */}
          <PeachBlossom size={70} style={{ position: "absolute", top: "-28px", left: "-28px", zIndex: 10, animation: "floatY 5.5s ease-in-out infinite" }} />
          <PeachBlossom size={90} style={{ position: "absolute", bottom: "-38px", left: "45%", zIndex: 10, animation: "floatY 6s ease-in-out infinite 0.4s" }} />

          {/* Falling Petals */}
          <Petal size={24} style={{ position: "absolute", top: "25px", right: "24%", zIndex: 10, transform: "rotate(35deg)", animation: "floatY 4s ease-in-out infinite 0.8s" }} />
          <Petal size={30} style={{ position: "absolute", top: "45%", right: "10%", zIndex: 10, transform: "rotate(110deg)", animation: "floatY 4.5s ease-in-out infinite 0.2s" }} />
          <Petal size={26} style={{ position: "absolute", bottom: "15px", right: "-12px", zIndex: 10, transform: "rotate(-45deg)", animation: "floatY 5s ease-in-out infinite 0.6s" }} />

          {/* Carousel Arrow Buttons */}
          {shops.length > 3 && (
            <>
              <button
                onClick={() => scroll("left")}
                style={{
                  position: "absolute",
                  left: "-20px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  background: "rgba(255, 255, 255, 1)",
                  border: "1px solid rgba(255, 255, 255, 0.9)",
                  boxShadow: "0 6px 16px rgba(37, 99, 235, 0.08)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  zIndex: 15,
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "white"; e.currentTarget.style.transform = "translateY(-50%) scale(1.05)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255, 255, 255, 0.85)"; e.currentTarget.style.transform = "translateY(-50%)"; }}
              >
                <ChevronLeft size={16} color="var(--ash)" />
              </button>

              <button
                onClick={() => scroll("right")}
                style={{
                  position: "absolute",
                  right: "-20px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  background: "rgba(255, 255, 255, 0.85)",
                  border: "1px solid rgba(255, 255, 255, 0.9)",
                  boxShadow: "0 6px 16px rgba(37, 99, 235, 0.08)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  zIndex: 15,
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "white"; e.currentTarget.style.transform = "translateY(-50%) scale(1.05)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255, 255, 255, 0.85)"; e.currentTarget.style.transform = "translateY(-50%)"; }}
              >
                <ChevronRight size={16} color="var(--ash)" />
              </button>
            </>
          )}

          <div style={{ position: "relative" }}>
            {/* Header */}
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
              <Sparkles size={14} color="var(--electric)" />
              <span style={{ fontSize: "0.625rem", fontWeight: 800, color: "var(--electric)", textTransform: "uppercase", letterSpacing: "0.1em" }}>
                Castme AI Matching Engine
              </span>
              <span style={{ marginLeft: "0.5rem", fontSize: "0.5625rem", fontWeight: 800, background: "#ff6b9d", color: "white", padding: "0.15rem 0.5rem", borderRadius: "99px" }}>LIVE</span>
            </div>
            <h2 style={{
              fontFamily: "var(--font-heading)",
              fontSize: "clamp(1.125rem, 3vw, 1.5rem)",
              fontWeight: 850, color: "var(--charcoal)",
              letterSpacing: "-0.02em",
              marginBottom: "0.5rem",
            }}>
              Shop phù hợp nhất với Vibe của bạn
            </h2>
            <p style={{ color: "var(--ash)", fontSize: "0.875rem", lineHeight: 1.6, marginBottom: "1.5rem", maxWidth: "480px", fontWeight: 500 }}>
              Hệ thống AI đã quét hồ sơ phong cách của bạn và tìm thấy các nhãn hàng tương thích nhất hôm nay.
            </p>

            {/* AI Match Cards */}
            {loadingShops ? (
              <div style={{ display: "flex", justifyContent: "center", padding: "2rem 0" }}>
                <div style={{ width: "32px", height: "32px", border: "3px solid rgba(37,99,235,0.15)", borderTopColor: "var(--electric)", borderRadius: "50%", animation: "spinSlow 0.8s linear infinite" }} />
              </div>
            ) : shops.length > 0 ? (
              <div
                className="carousel-container"
                ref={carouselRef}
                onMouseDown={handleMouseDown}
                onMouseLeave={handleMouseLeave}
                onMouseUp={handleMouseUp}
                onMouseMove={handleMouseMove}
                style={{ display: "flex", overflowX: "auto", gap: "0.875rem", paddingBottom: "1rem", userSelect: "none" }}
              >
                {shops.map((shop, index) => {
                  const rate = 98 - (index * 2) - Math.floor(Math.random() * 2);
                  return (
                    <div key={`ai-${shop.id}`} className="carousel-card" style={{
                      background: "rgba(253, 251, 251, 1)",
                      border: "2px solid rgba(255, 107, 157, 0.35)",
                      borderRadius: "14px",
                      padding: "1.25rem 1.4rem",
                      backdropFilter: "blur(12px)",
                      display: "flex", flexDirection: "column", justifyContent: "space-between",
                      gap: "1rem",
                      boxShadow: "0 10px 25px -5px rgba(37, 99, 235, 0.03)",
                      transition: "all 0.25s ease",
                      flex: "0 0 280px",
                      cursor: "pointer",
                    }}
                      onClick={() => viewShopProfile(shop.id)}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = "rgba(255, 255, 255, 0.95)";
                        e.currentTarget.style.transform = "translateY(-2px)";
                        e.currentTarget.style.boxShadow = "0 12px 30px rgba(37, 99, 235, 0.08)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = "rgba(255, 255, 255, 0.65)";
                        e.currentTarget.style.transform = "translateY(0)";
                        e.currentTarget.style.boxShadow = "0 10px 25px -5px rgba(37, 99, 235, 0.03)";
                      }}
                    >
                      <div>
                        {/* Brand Name & Match Rate Row */}
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.8rem" }}>
                          <h2 style={{
                            fontFamily: "var(--font-heading)",
                            fontSize: "1.125rem",
                            fontWeight: 900,
                            color: "var(--charcoal)",
                            letterSpacing: "-0.03em",
                            textTransform: "uppercase",
                            margin: 0,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                            maxWidth: "160px"
                          }} title={shop.shopName}>
                            {shop.shopName}
                          </h2>

                          {/* Match Rate Progress Circle */}
                          <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                            <div style={{
                              width: "30px",
                              height: "30px",
                              borderRadius: "50%",
                              background: `conic-gradient(#10B981 0deg, #34D399 ${rate * 3.6}deg, rgba(0, 0, 0, 0.06) ${rate * 3.6}deg)`,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              position: "relative",
                            }}>
                              <div style={{
                                width: "22px",
                                height: "22px",
                                borderRadius: "50%",
                                background: "white",
                              }} />
                            </div>
                            <span style={{ fontSize: "0.8125rem", fontWeight: 800, color: "var(--charcoal)", fontFamily: "var(--font-heading)" }}>{rate}%</span>
                          </div>
                        </div>

                        {/* Shop Main Info (Avatar and rating) */}
                        <div style={{ display: "flex", gap: "0.75rem", alignItems: "center", marginBottom: "0.5rem" }}>
                          {shop.mainImage ? (
                            <img src={shop.mainImage} alt={shop.shopName} style={{ width: "40px", height: "40px", borderRadius: "8px", objectFit: "cover", border: "1px solid rgba(0,0,0,0.06)" }} />
                          ) : (
                            <div style={{ width: "40px", height: "40px", borderRadius: "8px", background: "linear-gradient(135deg, #4f46e5, #7c3aed)", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: 800, fontSize: "1.1rem" }}>{shop.shopName.charAt(0)}</div>
                          )}
                          <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "2px" }}>
                              <span style={{ fontSize: "0.75rem", color: "var(--warning)" }}>★</span>
                              <span style={{ fontSize: "0.75rem", fontWeight: 800, color: "var(--charcoal)" }}>{shop.averageRating ? shop.averageRating.toFixed(1) : "0.0"}</span>
                            </div>
                            <p style={{ fontSize: "0.6875rem", color: "var(--ash)", margin: 0 }}>{shop.totalJobs || 0} chiến dịch</p>
                          </div>
                        </div>

                        {/* Description */}
                        <p style={{ fontSize: "0.75rem", color: "var(--ash)", height: "36px", overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", margin: "0.5rem 0", lineHeight: "1.4" }}>
                          {shop.description || "Nhãn hàng chưa cập nhật mô tả."}
                        </p>

                        {/* Divider Line */}
                        <div style={{ borderBottom: "1px solid rgba(0, 0, 0, 0.06)", marginBottom: "0.8rem" }} />
                      </div>

                      {/* Action Button */}
                      <button
                        onClick={(e) => { e.stopPropagation(); viewShopProfile(shop.id); }}
                        style={{
                          padding: "0.45rem 1.25rem",
                          background: "linear-gradient(135deg, #ff9a6c 0%, #ff6b9d 100%)",
                          border: "none",
                          borderRadius: "99px",
                          color: "white",
                          fontSize: "0.75rem", fontWeight: 800,
                          cursor: "pointer",
                          boxShadow: "0 4px 12px rgba(255, 107, 157, 0.2)",
                          transition: "all 0.15s",
                          alignSelf: "center",
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.transform = "scale(1.02)"; }}
                        onMouseLeave={(e) => { e.currentTarget.style.transform = "none"; }}
                      >
                        Xem hồ sơ nhãn hàng
                      </button>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p style={{ color: "var(--ash)", fontSize: "0.875rem" }}>Chưa có nhãn hàng nào trong hệ thống.</p>
            )}
          </div>
        </section>

        {/* ═══ ALL JOBS LIST (GLASSMORPHIC CONTAINER CARD) ═══ */}
        <section style={{
          background: "hsla(0, 0%, 100%, 0.23)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          border: "3px solid rgba(110, 143, 240, 0.6)",
          borderRadius: "var(--radius-xl)",
          padding: "2.25rem 2rem",
          boxShadow: "0 20px 48px -10px rgba(0, 0, 0, 0.03)",
          display: "flex",
          flexDirection: "column",
          gap: "1.5rem"
        }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "0.75rem", borderBottom: "1px solid rgba(0, 0, 0, 0.05)", paddingBottom: "1.25rem" }}>
            <div>
              <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "1.15rem", fontWeight: 850, color: "var(--charcoal)", letterSpacing: "-0.01em" }}>
                Tất cả tin tuyển dụng
              </h2>
              <p style={{ fontSize: "0.8125rem", color: "var(--ash)" }}>Các cơ hội hợp tác phù hợp với bạn</p>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap" }}>
              {/* Search Input Box */}
              <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                <input
                  type="text"
                  placeholder="Tìm tin tuyển dụng..."
                  value={searchQuery}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  style={{
                    padding: "0.5rem 1rem 0.5rem 2.25rem",
                    fontSize: "0.8125rem",
                    borderRadius: "var(--radius-full)",
                    border: "1.5px solid rgba(255, 107, 157, 0.25)",
                    outline: "none",
                    width: "220px",
                    background: "rgba(255, 255, 255, 0.94)",
                    transition: "all 0.2s",
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = "var(--electric)";
                    e.target.style.background = "white";
                    e.target.style.boxShadow = "0 0 0 3px rgba(37, 99, 235, 0.1)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "rgba(255, 107, 157, 0.25)";
                    e.target.style.background = "rgba(255, 255, 255, 0.8)";
                    e.target.style.boxShadow = "none";
                  }}
                />
                <Search
                  size={14}
                  color="var(--ash)"
                  style={{ position: "absolute", left: "0.875rem", pointerEvents: "none" }}
                />
              </div>
              <button style={{
                display: "flex", alignItems: "center", gap: "0.5rem",
                padding: "0.5rem 1.25rem",
                background: "rgba(255, 255, 255, 0.55)",
                border: "1px solid rgba(255, 255, 255, 0.8)",
                borderRadius: "var(--radius-full)",
                fontSize: "0.8125rem", fontWeight: 700, color: "var(--charcoal)",
                cursor: "pointer",
                boxShadow: "0 4px 12px rgba(120, 140, 180, 0.04)",
                transition: "all 0.2s",
              }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--electric)"; e.currentTarget.style.background = "white"; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.8)"; e.currentTarget.style.background = "rgba(255, 255, 255, 0.55)"; }}
              >
                <SlidersHorizontal size={14} color="var(--ash)" />
                Bộ lọc nâng cao
              </button>
            </div>
          </div>

          {loading ? (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "3rem", background: "rgba(255, 255, 255, 0.25)", borderRadius: "var(--radius-lg)", border: "1px solid var(--border)" }}>
              <div style={{ width: "32px", height: "32px", border: "3px solid rgba(37,99,235,0.15)", borderTopColor: "var(--electric)", borderRadius: "50%", animation: "spinSlow 0.8s linear infinite" }} />
            </div>
          ) : allJobs.length > 0 ? (
            <div>
              <style>{`
                @media (min-width: 1024px) {
                  .jobs-grid {
                    grid-template-columns: repeat(3, 1fr) !important;
                  }
                }
              `}</style>
              <div className="jobs-grid" style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                gap: "1.25rem"
              }}>
                {(expanded ? allJobs : allJobs.slice(0, 6)).map((job, idx) => (
                  <div key={job.id} className="card" style={{
                    padding: "1rem",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    background: "rgba(252, 252, 252, 1)",
                    backdropFilter: "blur(16px)",
                    border: "1px solid rgba(22, 133, 224, 0.65)",
                    borderRadius: "var(--radius-lg)",
                    boxShadow: "0 8px 32px rgba(120, 140, 180, 0.04)",
                    position: "relative",
                    transition: "all 0.2s ease",
                    height: "320px",
                    boxSizing: "border-box",
                    cursor: "pointer",
                  }}
                    onClick={() => setSelectedJob(job)}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translateY(-4px)";
                      e.currentTarget.style.borderColor = "rgba(79, 70, 229, 0.75)";
                      e.currentTarget.style.boxShadow = "0 12px 40px rgba(37, 99, 235, 0.08)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.borderColor = "rgba(110, 143, 240, 0.45)";
                      e.currentTarget.style.boxShadow = "0 8px 32px rgba(120, 140, 180, 0.04)";
                    }}
                  >
                    {/* Top content block (Fixed height to prevent button movement) */}
                    <div style={{ height: "185px", display: "flex", flexDirection: "column", justifyContent: "flex-start" }}>
                      {/* Shop Info & Match Badge */}
                      <div style={{ display: "flex", alignItems: "center", justifyBox: "space-between", gap: "0.5rem", marginBottom: "0.5rem" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                          <div style={{
                            width: "32px", height: "32px", flexShrink: 0,
                            background: "linear-gradient(135deg, rgba(37, 99, 235, 0.1), rgba(244, 63, 94, 0.1))",
                            borderRadius: "var(--radius-sm)",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            fontSize: "0.875rem", fontWeight: 800, color: "var(--electric)",
                            border: "1px solid rgba(37, 99, 235, 0.15)",
                          }}>
                            {job.shopName[0]}
                          </div>
                          <span style={{
                            fontSize: "0.8125rem",
                            fontWeight: 700,
                            color: "var(--charcoal)",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                            maxWidth: "110px",
                          }} title={job.shopName}>
                            {job.shopName}
                          </span>
                        </div>
                        <MatchBadge rate={job.matchRate} small />
                      </div>

                      {/* Variation Badges */}
                      <div style={{ display: "flex", gap: "0.25rem", marginBottom: "0.5rem" }}>
                        {idx === 0 && (
                          <span style={{ display: "inline-flex", alignItems: "center", gap: "4px", fontSize: "0.625rem", background: "rgba(16, 185, 129, 0.08)", color: "var(--success)", padding: "0.15rem 0.5rem", borderRadius: "99px", fontWeight: 700 }}>
                            <span style={{ width: "4px", height: "4px", background: "var(--success)", borderRadius: "50%" }} />
                            Online
                          </span>
                        )}
                        {idx === 1 && (
                          <span style={{ display: "inline-flex", alignItems: "center", gap: "3px", fontSize: "0.625rem", background: "rgba(245, 158, 11, 0.08)", color: "var(--warning)", padding: "0.15rem 0.5rem", borderRadius: "99px", fontWeight: 700 }}>
                            ⭐ 3 sao
                          </span>
                        )}
                        {idx === 2 && (
                          <span style={{ display: "inline-flex", alignItems: "center", gap: "4px", fontSize: "0.625rem", background: "rgba(37, 99, 235, 0.08)", color: "var(--electric)", padding: "0.15rem 0.5rem", borderRadius: "99px", fontWeight: 700 }}>
                            🛡️ Đã xác thực
                          </span>
                        )}
                      </div>

                      {/* Job Title */}
                      <h3 style={{
                        fontFamily: "var(--font-heading)",
                        fontSize: "0.95rem",
                        fontWeight: 800,
                        color: "var(--charcoal)",
                        marginBottom: "0.4rem",
                        lineHeight: 1.35,
                        height: "2.5rem",
                        overflow: "hidden",
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                      }}>
                        {job.title}
                      </h3>

                      {/* Job Description */}
                      <p style={{
                        fontSize: "0.75rem",
                        color: "var(--ash)",
                        lineHeight: 1.5,
                        marginBottom: "0.5rem",
                        height: "2.25rem",
                        overflow: "hidden",
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                      }}>
                        {job.description}
                      </p>

                      {/* Vibe Tags */}
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.375rem" }}>
                        {job.vibeTags.slice(0, 2).map((tag) => <VibeTag key={tag} tag={tag} />)}
                      </div>
                    </div>

                    {/* Bottom panel (Locked to bottom) */}
                    <div style={{ height: "85px", display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
                      <div style={{ height: "1px", background: "rgba(0,0,0,0.06)", marginBottom: "0.5rem" }} />
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                        <span style={{ fontSize: "0.6875rem", fontWeight: 600, color: "var(--ash)", textTransform: "uppercase" }}>Thù lao</span>
                        <span style={{ fontFamily: "var(--font-heading)", fontSize: "1.1rem", fontWeight: 850, color: "#c2410c" }}>{job.budget}</span>
                      </div>

                      <div style={{ display: "flex", gap: "0.375rem" }}>
                        <button
                          onClick={(e) => { e.stopPropagation(); setSelectedJob(job); }}
                          style={{
                            flex: 1,
                            padding: "0.45rem 0.5rem",
                            fontSize: "0.75rem",
                            fontWeight: 600,
                            background: "rgba(255, 255, 255, 0.65)",
                            border: "1.2px solid rgba(37, 99, 235, 0.15)",
                            borderRadius: "var(--radius-full)",
                            color: "var(--charcoal)",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "4px",
                            transition: "all 0.2s",
                          }}
                          onMouseEnter={(e) => { e.currentTarget.style.background = "white"; e.currentTarget.style.borderColor = "var(--electric)"; }}
                          onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255, 255, 255, 0.65)"; e.currentTarget.style.borderColor = "rgba(37, 99, 235, 0.15)"; }}
                        >
                          <Store size={12} color="var(--ash)" />
                          Chi tiết
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); handleConnect(job.id); }}
                          disabled={applyingId === job.id}
                          style={{
                            flex: 1.2,
                            padding: "0.45rem 0.5rem",
                            fontSize: "0.75rem",
                            fontWeight: 800,
                            background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
                            border: "none",
                            borderRadius: "var(--radius-full)",
                            color: "white",
                            cursor: applyingId === job.id ? "not-allowed" : "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "4px",
                            opacity: applyingId === job.id ? 0.7 : 1,
                            boxShadow: "0 4px 12px rgba(124, 58, 237, 0.15)",
                            transition: "all 0.2s",
                          }}
                          onMouseEnter={(e) => { if (applyingId !== job.id) e.currentTarget.style.transform = "translateY(-1px)"; }}
                          onMouseLeave={(e) => { e.currentTarget.style.transform = "none"; }}
                        >
                          <Zap size={11} />
                          {applyingId === job.id ? "Đang..." : "Ứng tuyển"}
                        </button>
                      </div>
                    </div>

                  </div>
                ))}
              </div>

              {allJobs.length > 6 && (
                <div style={{ display: "flex", justifyContent: "center", marginTop: "1.75rem" }}>
                  <button
                    onClick={() => setExpanded(!expanded)}
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: "0.8125rem",
                      fontWeight: 800,
                      color: "white",
                      background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
                      border: "none",
                      borderRadius: "var(--radius-full)",
                      padding: "0.65rem 2rem",
                      cursor: "pointer",
                      boxShadow: "0 4px 12px rgba(124, 58, 237, 0.2)",
                      transition: "all 0.2s",
                      display: "flex",
                      alignItems: "center",
                      gap: "4px"
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-1px)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.transform = "none"; }}
                  >
                    {expanded ? "Thu gọn bớt" : "Xem thêm tin tuyển dụng"}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div style={{
              background: "rgba(255, 255, 255, 0.25)",
              border: "1.5px dashed rgba(37, 99, 235, 0.15)",
              borderRadius: "var(--radius-lg)",
              padding: "3rem",
              textAlign: "center",
            }}>
              <div style={{ fontSize: "2rem", marginBottom: "0.75rem" }}>🔍</div>
              <p style={{ color: "var(--ash)", fontSize: "0.9rem" }}>Hiện chưa có tin tuyển dụng nào đang mở.</p>
            </div>
          )}
        </section>
      </div>

      {/* ═══ JOB DETAILS MODAL ═══ */}
      {selectedJob && (
        <div style={{
          position: "fixed", inset: 0,
          background: "rgba(15, 23, 42, 0.4)",
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
          display: "flex", alignItems: "center", justifyContent: "center",
          zIndex: 999, padding: "1rem",
          animation: "fadeIn 0.2s ease-out",
        }}
          onClick={(e) => { if (e.target === e.currentTarget) setSelectedJob(null); }}
        >
          <div className="animate-scale-in" style={{
            background: "rgba(255, 255, 255, 0.96)",
            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
            border: "1px solid rgba(255, 255, 255, 0.8)",
            borderRadius: "24px",
            maxWidth: "600px", width: "100%",
            maxHeight: "85vh",
            display: "flex", flexDirection: "column",
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.15)",
            overflow: "hidden",
            position: "relative",
            padding: "1.75rem 2rem 2rem 2rem",
            boxSizing: "border-box",
          }}>
            {/* Modal Close Button */}
            <button
              onClick={() => setSelectedJob(null)}
              style={{
                position: "absolute",
                top: "1.25rem",
                right: "1.25rem",
                width: "32px",
                height: "32px",
                display: "flex", alignItems: "center", justifyContent: "center",
                background: "rgba(0, 0, 0, 0.04)",
                border: "none",
                borderRadius: "50%",
                cursor: "pointer",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "#fee2e2"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(0, 0, 0, 0.04)"; }}
            >
              <X size={16} color="var(--ash)" />
            </button>

            {/* Modal Header / Job Title */}
            <div style={{ marginBottom: "1.5rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
                <span style={{ fontSize: "0.75rem", background: "rgba(79, 70, 229, 0.08)", color: "#4f46e5", padding: "0.2rem 0.625rem", borderRadius: "99px", fontWeight: 700 }}>
                  💼 Casting Job
                </span>
                <MatchBadge rate={selectedJob.matchRate} />
              </div>
              <h2 style={{
                fontFamily: "var(--font-heading)",
                fontSize: "1.5rem",
                fontWeight: 900,
                color: "var(--charcoal)",
                margin: "0.25rem 0 0.5rem 0",
                lineHeight: 1.3
              }}>
                {selectedJob.title}
              </h2>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.875rem", color: "var(--ash)" }}>
                <span>Thương hiệu:</span>
                <span
                  onClick={() => {
                    const shopId = selectedJob.shopId;
                    setSelectedJob(null);
                    viewShopProfile(shopId);
                  }}
                  style={{
                    fontWeight: 700,
                    color: "#4f46e5",
                    cursor: "pointer",
                    textDecoration: "underline"
                  }}
                >
                  {selectedJob.shopName}
                </span>
              </div>
            </div>

            {/* Scrollable Content */}
            <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: "1.25rem", paddingRight: "0.25rem" }}>
              {/* Shop basic info block */}
              <div style={{
                background: "rgba(248, 250, 252, 0.9)",
                border: "1px solid rgba(0, 0, 0, 0.06)",
                borderRadius: "20px",
                padding: "1rem",
                display: "flex",
                flexDirection: "column",
                gap: "0.75rem",
              }}>
                <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--ash)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  Thông tin đối tác
                </span>

                {loadingSelectedShop ? (
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.5rem 0" }}>
                    <div style={{ width: "16px", height: "16px", border: "2px solid rgba(79, 70, 229, 0.15)", borderTopColor: "#4f46e5", borderRadius: "50%", animation: "spinSlow 0.8s linear infinite" }} />
                    <span style={{ fontSize: "0.8125rem", color: "var(--ash)" }}>Đang tải thông tin shop...</span>
                  </div>
                ) : selectedShopInfo ? (
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                      {/* Shop Avatar */}
                      {selectedShopInfo.mainImage ? (
                        <img
                          src={selectedShopInfo.mainImage}
                          alt={selectedShopInfo.shopName}
                          style={{ width: "44px", height: "44px", borderRadius: "12px", objectFit: "cover", border: "1px solid rgba(0,0,0,0.06)" }}
                        />
                      ) : (
                        <div style={{
                          width: "44px",
                          height: "44px",
                          borderRadius: "12px",
                          background: "linear-gradient(135deg, #4f46e5, #7c3aed)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "white",
                          fontSize: "1.1rem",
                          fontWeight: 900
                        }}>
                          {selectedShopInfo.shopName ? selectedShopInfo.shopName.charAt(0).toUpperCase() : "?"}
                        </div>
                      )}

                      {/* Shop Details */}
                      <div style={{ display: "flex", flexDirection: "column", gap: "0.2rem", flex: 1, minWidth: 0 }}>
                        <h4 style={{ fontSize: "0.95rem", fontWeight: 800, color: "var(--charcoal)", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {selectedShopInfo.shopName}
                        </h4>

                        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" }}>
                          {selectedShopInfo.averageRating > 0 && (
                            <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--warning)" }}>
                              ⭐ {selectedShopInfo.averageRating} / 5.0
                            </span>
                          )}
                          {selectedShopInfo.categories?.length > 0 && (
                            <span style={{ fontSize: "0.75rem", color: "var(--ash)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                              Danh mục: {selectedShopInfo.categories.join(", ")}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {selectedShopInfo.description && (
                      <p style={{ fontSize: "0.75rem", color: "var(--muted)", margin: 0, lineHeight: 1.4, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                        {selectedShopInfo.description}
                      </p>
                    )}

                    <button
                      onClick={() => {
                        const shopId = selectedJob.shopId;
                        setSelectedJob(null);
                        viewShopProfile(shopId);
                      }}
                      style={{
                        alignSelf: "flex-start",
                        padding: "0.35rem 0.85rem",
                        fontSize: "0.75rem",
                        fontWeight: 700,
                        background: "white",
                        border: "1px solid rgba(79, 70, 229, 0.3)",
                        color: "#4f46e5",
                        borderRadius: "8px",
                        cursor: "pointer",
                        transition: "all 0.2s",
                        display: "flex",
                        alignItems: "center",
                        gap: "4px"
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(79, 70, 229, 0.04)"; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = "white"; }}
                    >
                      <Store size={12} />
                      Xem hồ sơ shop
                    </button>
                  </div>
                ) : (
                  <span style={{ fontSize: "0.8125rem", color: "var(--ash)" }}>Không tìm thấy thông tin chi tiết của shop.</span>
                )}
              </div>

              {/* Vibe tags */}
              <div>
                <h4 style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--ash)", textTransform: "uppercase", marginBottom: "0.5rem", letterSpacing: "0.05em" }}>Tags phong cách</h4>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.375rem" }}>
                  {selectedJob.vibeTags.map((tag) => <VibeTag key={tag} tag={tag} />)}
                </div>
              </div>

              {/* Detailed Description */}
              <div>
                <h4 style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--ash)", textTransform: "uppercase", marginBottom: "0.5rem", letterSpacing: "0.05em" }}>Mô tả công việc</h4>
                <div style={{
                  fontSize: "0.875rem",
                  color: "var(--charcoal)",
                  lineHeight: 1.6,
                  whiteSpace: "pre-wrap",
                  background: "rgba(0,0,0,0.02)",
                  padding: "1rem",
                  borderRadius: "16px",
                  border: "1px solid rgba(0,0,0,0.04)"
                }}>
                  {selectedJob.description}
                </div>
              </div>

              {/* AI Smart Summary */}
              {selectedJob.aiSummary && (
                <div style={{
                  background: "linear-gradient(135deg, rgba(79, 70, 229, 0.05) 0%, rgba(124, 58, 237, 0.05) 100%)",
                  border: "1px solid rgba(124, 58, 237, 0.15)",
                  borderRadius: "16px",
                  padding: "1rem",
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.5rem"
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.375rem", fontSize: "0.75rem", fontWeight: 800, color: "#7c3aed" }}>
                    <span>✨</span>
                    <span>TÓM TẮT THÔNG MINH BẰNG AI</span>
                  </div>
                  <p style={{ fontSize: "0.8125rem", color: "#5b21b6", lineHeight: 1.5, margin: 0, fontWeight: 500 }}>
                    {selectedJob.aiSummary}
                  </p>
                </div>
              )}

              {/* Thù lao Card */}
              <div style={{
                background: "rgba(249, 115, 22, 0.05)",
                border: "1px solid rgba(249, 115, 22, 0.15)",
                borderRadius: "16px",
                padding: "1rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between"
              }}>
                <span style={{ fontSize: "0.8125rem", fontWeight: 700, color: "var(--ash)", textTransform: "uppercase" }}>Thù lao chi trả</span>
                <span style={{ fontFamily: "var(--font-heading)", fontSize: "1.35rem", fontWeight: 900, color: "#c2410c" }}>{selectedJob.budget}</span>
              </div>
            </div>

            {/* Modal Actions */}
            <div style={{
              display: "flex",
              gap: "0.75rem",
              marginTop: "1.5rem",
              paddingTop: "1.25rem",
              borderTop: "1px solid rgba(0, 0, 0, 0.05)",
              flexShrink: 0
            }}>
              <button
                onClick={() => setSelectedJob(null)}
                style={{
                  flex: 1,
                  padding: "0.75rem 0",
                  fontSize: "0.875rem",
                  fontWeight: 700,
                  background: "rgba(0, 0, 0, 0.05)",
                  border: "none",
                  borderRadius: "12px",
                  color: "var(--charcoal)",
                  cursor: "pointer",
                  transition: "all 0.15s",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(0, 0, 0, 0.1)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(0, 0, 0, 0.05)"; }}
              >
                Đóng
              </button>

              <button
                onClick={() => {
                  const jobId = selectedJob.id;
                  setSelectedJob(null);
                  handleConnect(jobId);
                }}
                disabled={applyingId === selectedJob.id}
                style={{
                  flex: 1.5,
                  padding: "0.75rem 0",
                  fontSize: "0.875rem",
                  fontWeight: 800,
                  background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
                  border: "none",
                  borderRadius: "12px",
                  color: "white",
                  cursor: applyingId === selectedJob.id ? "not-allowed" : "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "4px",
                  opacity: applyingId === selectedJob.id ? 0.7 : 1,
                  boxShadow: "0 4px 12px rgba(124, 58, 237, 0.15)",
                  transition: "all 0.15s",
                }}
              >
                <Zap size={14} />
                {applyingId === selectedJob.id ? "Đang ứng tuyển..." : "Ứng tuyển ngay"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ═══ SHOP PROFILE MODAL ═══ */}
      <ShopProfileModal
        isOpen={shopModalOpen}
        onClose={() => setShopModalOpen(false)}
        loading={loadingShop}
        shopProfile={shopProfile}
      />

      {/* Toast Notification */}
      {toast.show && (
        <>
          <style>{`
            @keyframes toastProgress {
              from { width: 100%; }
              to { width: 0%; }
            }
          `}</style>
          <div className="fixed top-24 right-6 z-50 w-[380px] overflow-hidden rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-gray-100 bg-white transition-all animate-in slide-in-from-top-5">
            <div className="px-5 py-4 flex items-start gap-4">
              <div className={`shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${toast.type === "success" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
                }`}>
                {toast.type === "success" ? (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" /></svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
                )}
              </div>
              <div className="pt-1 flex-1">
                <h4 className="text-[15px] font-bold text-gray-900 leading-none mb-1.5">
                  {toast.type === "success" ? "Thành công" : "Có lỗi xảy ra"}
                </h4>
                <div className="text-[13px] font-medium text-gray-500 leading-snug">{toast.message}</div>
              </div>
            </div>
            <div className="h-1 w-full bg-gray-50">
              <div
                className={`h-full ${toast.type === "success" ? "bg-green-500" : "bg-red-500"}`}
                style={{ animation: "toastProgress 3s linear forwards" }}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
}