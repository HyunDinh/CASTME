"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getSessionAction } from "../../(auth)/actions";
import { getMyCastingJobs } from "#/app/(shop)/my-casting/actions";
import {
  Sparkles,
  Heart,
  Briefcase,
  DollarSign,
  TrendingUp,
  Store,
  ArrowRight,
  Zap,
  CheckCircle,
  Clock,
  Award,
  ChevronRight,
  Play,
  Activity,
  FileText,
  Users,
  Eye
} from "lucide-react";

export default function ShopDashboard() {
  const router = useRouter();
  const [session, setSession] = useState(null);
  const [inProgressJobs, setInProgressJobs] = useState([]);
  const [loadingJobs, setLoadingJobs] = useState(true);

  // Thống kê giả lập
  const metricsData = {
    budgetSpent: 45500000,
    activeCampaigns: 3,
    cooperatingKocs: 12,
    totalReach: "1.2M",
  };

  useEffect(() => {
    async function loadData() {
      try {
        const s = await getSessionAction();
        if (s) setSession(s);

        const jobsRes = await getMyCastingJobs();
        if (jobsRes.success) {
          setInProgressJobs(jobsRes.data.filter((j) => j.status === "IN_PROGRESS" || j.status === "in-progress"));
        }
      } catch (err) {
        console.error("Lỗi khi tải dữ liệu tổng quan shop:", err);
      } finally {
        setLoadingJobs(false);
      }
    }
    loadData();
  }, []);

  const getGreeting = () => {
    const hr = new Date().getHours();
    if (hr < 12) return "Chào buổi sáng ☀️";
    if (hr < 18) return "Chào buổi chiều 🌤️";
    return "Chào buổi tối 🌙";
  };

  return (
    <div className="landing-light" style={{ display: "flex", flexDirection: "column", gap: "2rem", animation: "fadeIn 0.5s ease" }}>

      {/* ── HERO BANNER SECTION ── */}
      <section style={{
        position: "relative",
        backgroundImage: "url('/hello.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        border: "1px solid rgba(0, 0, 0, 0.08)",
        borderRadius: "24px",
        padding: "3.5rem 3rem",
        overflow: "hidden",
        boxShadow: "0 12px 32px rgba(120, 140, 180, 0.06)"
      }}>
        <div style={{ position: "relative", zIndex: 2, display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
            background: "#f8fafc",
            border: "1px solid rgba(0, 0, 0, 0.06)",
            padding: "0.45rem 1.15rem",
            borderRadius: "99px",
            color: "#2563eb",
            fontSize: "0.75rem",
            fontWeight: 800,
            width: "fit-content",
            textTransform: "uppercase",
            letterSpacing: "0.05em",
            boxShadow: "0 2px 8px rgba(37, 99, 235, 0.04)"
          }}>
            <Sparkles size={12} fill="#2563eb" />
            HỆ THỐNG AI MATCHING THEO PHONG CÁCH
          </div>

          <h1 style={{
            fontFamily: "var(--font-heading)",
            fontSize: "2.65rem",
            fontWeight: 900,
            color: "#1a2b4a",
            margin: 0,
            lineHeight: 1.25,
            letterSpacing: "-0.01em"
          }}>
            {getGreeting()}
          </h1>

          <p style={{
            color: "#3a2937ff",
            fontSize: "0.98rem",
            maxWidth: "400px",
            lineHeight: 1.6,
            margin: 0
          }}>
            Nền tảng của Castme đã phân tích cá tính, vibe thương hiệu và đề xuất các KOC/KOL phù hợp nhất với tỉ lệ kết nối khớp chuẩn xác lên đến 99%.
          </p>

          <div style={{ marginTop: "0.5rem" }}>
            <button
              onClick={() => router.push("/search-creator")}
              className="glow-btn-peach"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.75rem 1.75rem",
                fontWeight: 700,
                fontSize: "0.875rem",
                textDecoration: "none",
                cursor: "pointer",
                border: "none"
              }}
            >
              Khám Phá KOC/KOL Ngay
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </section>

      {/* ── STATS METRICS GRID ── */}
      <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))", gap: "1.25rem" }}>

        {/* CARD 1: TỔNG NGÂN SÁCH ĐÃ CHI */}
        <div
          style={{
            background: "white",
            border: "1px solid rgba(0, 0, 0, 0.08)",
            boxShadow: "0 8px 32px rgba(120, 140, 180, 0.06)",
            borderRadius: "20px",
            padding: "1.5rem",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            transition: "all 0.3s ease"
          }}
          onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-4px)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem" }}>
            <div>
              <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.03em" }}>Tổng ngân sách đã chi</span>
              <h2 style={{ fontSize: "1.625rem", fontWeight: 900, color: "#1a2b4a", margin: "0.45rem 0 0 0" }}>
                {metricsData.budgetSpent.toLocaleString("vi-VN")} <span style={{ fontSize: "1rem" }}>đ</span>
              </h2>
            </div>
            <div style={{
              width: "42px",
              height: "42px",
              borderRadius: "12px",
              background: "rgba(16, 185, 129, 0.12)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "inset 0 1px 0 rgba(255,255,255,0.4)"
            }}>
              <DollarSign size={20} color="#10b981" />
            </div>
          </div>
          <div style={{ borderTop: "1px solid rgba(37, 99, 235, 0.08)", paddingTop: "0.75rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: "0.75rem", color: "var(--subtle)" }}>Bảo chứng dòng tiền an toàn</span>
            <Link href="/transactions" style={{ fontSize: "0.75rem", fontWeight: 800, color: "#2563eb", textDecoration: "none", display: "flex", alignItems: "center", gap: "2px" }}>
              Chi tiết ví <ArrowRight size={10} />
            </Link>
          </div>
        </div>

        {/* CARD 2: CHIẾN DỊCH ĐANG CHẠY */}
        <div
          style={{
            background: "white",
            border: "1px solid rgba(0, 0, 0, 0.08)",
            boxShadow: "0 8px 32px rgba(120, 140, 180, 0.06)",
            borderRadius: "20px",
            padding: "1.5rem",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            transition: "all 0.3s ease"
          }}
          onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-4px)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem" }}>
            <div>
              <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.03em" }}>Chiến dịch đang chạy</span>
              <h2 style={{ fontSize: "2.25rem", fontWeight: 900, color: "#1a2b4a", margin: "0.25rem 0 0 0" }}>
                {metricsData.activeCampaigns}
              </h2>
            </div>
            <div style={{
              width: "42px",
              height: "42px",
              borderRadius: "12px",
              background: "rgba(37, 99, 235, 0.12)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "inset 0 1px 0 rgba(255,255,255,0.4)"
            }}>
              <Briefcase size={20} color="#2563eb" />
            </div>
          </div>
          <div style={{ borderTop: "1px solid rgba(37, 99, 235, 0.08)", paddingTop: "0.75rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: "0.75rem", color: "var(--subtle)" }}>Cập nhật phản hồi từ KOC</span>
            <Link href="/my-casting" style={{ fontSize: "0.75rem", fontWeight: 800, color: "#2563eb", textDecoration: "none", display: "flex", alignItems: "center", gap: "2px" }}>
              Xem danh sách <ArrowRight size={10} />
            </Link>
          </div>
        </div>

        {/* CARD 3: KOC ĐANG HỢP TÁC */}
        <div
          style={{
            background: "white",
            border: "1px solid rgba(0, 0, 0, 0.08)",
            boxShadow: "0 8px 32px rgba(120, 140, 180, 0.06)",
            borderRadius: "20px",
            padding: "1.5rem",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            transition: "all 0.3s ease"
          }}
          onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-4px)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem" }}>
            <div>
              <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.03em" }}>KOC đang hợp tác</span>
              <h2 style={{ fontSize: "2.25rem", fontWeight: 900, color: "#1a2b4a", margin: "0.25rem 0 0 0" }}>
                {metricsData.cooperatingKocs}
              </h2>
            </div>
            <div style={{
              width: "42px",
              height: "42px",
              borderRadius: "12px",
              background: "rgba(168, 85, 247, 0.12)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "inset 0 1px 0 rgba(255,255,255,0.4)"
            }}>
              <Users size={20} color="#a855f7" />
            </div>
          </div>
          <div style={{ borderTop: "1px solid rgba(37, 99, 235, 0.08)", paddingTop: "0.75rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: "0.75rem", color: "var(--subtle)" }}>Tiến độ sản xuất nội dung</span>
            <Link href="/my-casting" style={{ fontSize: "0.75rem", fontWeight: 800, color: "#2563eb", textDecoration: "none", display: "flex", alignItems: "center", gap: "2px" }}>
              Quản lý <ArrowRight size={10} />
            </Link>
          </div>
        </div>

        {/* CARD 4: TỔNG LƯỢT TIẾP CẬN */}
        <div
          style={{
            background: "white",
            border: "1px solid rgba(0, 0, 0, 0.08)",
            boxShadow: "0 8px 32px rgba(120, 140, 180, 0.06)",
            borderRadius: "20px",
            padding: "1.5rem",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            transition: "all 0.3s ease"
          }}
          onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-4px)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem" }}>
            <div>
              <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.03em" }}>Tổng lượt tiếp cận</span>
              <h2 style={{ fontSize: "2.25rem", fontWeight: 900, color: "#1a2b4a", margin: "0.25rem 0 0 0" }}>
                {metricsData.totalReach}
              </h2>
            </div>
            <div style={{
              width: "42px",
              height: "42px",
              borderRadius: "12px",
              background: "rgba(244, 63, 94, 0.12)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "inset 0 1px 0 rgba(255,255,255,0.4)"
            }}>
              <Award size={20} color="#f43f5e" />
            </div>
          </div>
          <div style={{ borderTop: "1px solid rgba(37, 99, 235, 0.08)", paddingTop: "0.75rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: "0.75rem", color: "var(--subtle)" }}>Tăng trưởng độ phủ thương hiệu</span>
            <Link href="/shop-profile" style={{ fontSize: "0.75rem", fontWeight: 800, color: "#2563eb", textDecoration: "none", display: "flex", alignItems: "center", gap: "2px" }}>
              Xem hồ sơ <ArrowRight size={10} />
            </Link>
          </div>
        </div>

      </section>

      {/* ── TWO-COLUMN INTERACTIVE HUB ── */}
      <section style={{ display: "grid", gridTemplateColumns: "1.1fr 1.3fr", gap: "2rem" }} className="interactive-grid">

        {/* ── LEFT COLUMN: VIBE PANEL & QUICK LINKS ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>

          {/* Vibe cá tính thương hiệu */}
          <div style={{ borderRadius: "24px", padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1.25rem", background: "white", border: "1px solid rgba(0, 0, 0, 0.08)", boxShadow: "0 8px 32px rgba(120, 140, 180, 0.06)" }}>

            {/* Header Tabs */}
            <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
              <span className="landing-tab-active" style={{
                padding: "6px 14px",
                borderRadius: "999px",
                fontSize: "11px",
                fontWeight: 800,
                letterSpacing: "0.03em",
                cursor: "default"
              }}>Vibe Nhãn Hàng</span>
              <span style={{
                padding: "6px 14px",
                borderRadius: "999px",
                fontSize: "11px",
                fontWeight: 600,
                color: "#5a6b82",
                letterSpacing: "0.03em",
                cursor: "pointer",
                background: "transparent"
              }} onClick={() => router.push("/search-creator")}>Creator Gợi Ý</span>
            </div>

            {/* Record Player Cover Container */}
            <div style={{
              width: "100%",
              height: "230px",
              borderRadius: "16px",
              overflow: "hidden",
              border: "1px solid rgba(0, 0, 0, 0.06)",
              position: "relative",
              boxShadow: "0 10px 25px rgba(120, 140, 180, 0.04)"
            }}>
              <img src="/neon_record_player.png" style={{ width: "100%", height: "100%", objectFit: "cover" }} alt="Record Player Vibe" />

              {/* Floating tags */}
              <div style={{ position: "absolute", bottom: "12px", left: "12px", display: "flex", gap: "6px" }}>
                <span style={{
                  background: "linear-gradient(135deg, #2563eb 0%, #a855f7 100%)",
                  color: "white",
                  padding: "4px 10px",
                  borderRadius: "99px",
                  fontSize: "9px",
                  fontWeight: 800,
                  textTransform: "uppercase"
                }}>Minimalism</span>
                <span style={{
                  background: "rgba(26, 43, 74, 0.75)",
                  color: "white",
                  padding: "4px 10px",
                  borderRadius: "99px",
                  fontSize: "9px",
                  fontWeight: 700,
                  backdropFilter: "blur(4px)",
                  textTransform: "uppercase"
                }}>Gen Z Vibe</span>
              </div>
            </div>

            {/* Top matching creators inside capsules */}
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                KOC Phù hợp cao nhất (AI Vibe Match)
              </span>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.5rem" }}>

                {/* Creator 1 */}
                <div style={{
                  background: "#f8fafc",
                  border: "1px solid rgba(0, 0, 0, 0.05)",
                  borderRadius: "16px",
                  padding: "0.75rem 0.5rem",
                  textAlign: "center",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "0.25rem",
                  boxShadow: "0 4px 12px rgba(120, 140, 180, 0.01)"
                }}>
                  <div style={{ width: "24px", height: "24px", borderRadius: "50%", background: "linear-gradient(135deg, #3b82f6, #9333ea)", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: "9px", fontWeight: 900, lineHeight: 1 }}>T</div>
                  <span style={{ fontSize: "0.75rem", fontWeight: 800, color: "#1a2b4a", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", width: "100%" }}>Thảo Vy</span>
                  <span style={{ fontSize: "0.625rem", fontWeight: 800, color: "#10b981", background: "rgba(16,185,129,0.08)", padding: "1px 6px", borderRadius: "99px" }}>98%</span>
                </div>

                {/* Creator 2 */}
                <div style={{
                  background: "#f8fafc",
                  border: "1px solid rgba(0, 0, 0, 0.05)",
                  borderRadius: "16px",
                  padding: "0.75rem 0.5rem",
                  textAlign: "center",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "0.25rem",
                  boxShadow: "0 4px 12px rgba(120, 140, 180, 0.01)"
                }}>
                  <div style={{ width: "24px", height: "24px", borderRadius: "50%", background: "linear-gradient(135deg, #ec4899, #f43f5e)", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: "9px", fontWeight: 900, lineHeight: 1 }}>K</div>
                  <span style={{ fontSize: "0.75rem", fontWeight: 800, color: "#1a2b4a", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", width: "100%" }}>Khoa Style</span>
                  <span style={{ fontSize: "0.625rem", fontWeight: 800, color: "#10b981", background: "rgba(16,185,129,0.08)", padding: "1px 6px", borderRadius: "99px" }}>95%</span>
                </div>

                {/* Creator 3 */}
                <div style={{
                  background: "#f8fafc",
                  border: "1px solid rgba(0, 0, 0, 0.05)",
                  borderRadius: "16px",
                  padding: "0.75rem 0.5rem",
                  textAlign: "center",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "0.25rem",
                  boxShadow: "0 4px 12px rgba(120, 140, 180, 0.01)"
                }}>
                  <div style={{ width: "24px", height: "24px", borderRadius: "50%", background: "linear-gradient(135deg, #10b981, #06b6d4)", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: "9px", fontWeight: 900, lineHeight: 1 }}>M</div>
                  <span style={{ fontSize: "0.75rem", fontWeight: 800, color: "#1a2b4a", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", width: "100%" }}>Mai Matcha</span>
                  <span style={{ fontSize: "0.625rem", fontWeight: 800, color: "#10b981", background: "rgba(16,185,129,0.08)", padding: "1px 6px", borderRadius: "99px" }}>92%</span>
                </div>

              </div>
            </div>

          </div>

          {/* Lối tắt nhanh */}
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "1.1rem", fontWeight: 800, color: "#1a2b4a", margin: 0 }}>
              ⚡ Lối tắt nhanh
            </h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "0.85rem" }}>

              <Link href="/my-casting" style={{ textDecoration: "none", color: "inherit" }}>
                <div
                  style={{
                    background: "white",
                    border: "1px solid rgba(0, 0, 0, 0.08)",
                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.02)",
                    borderRadius: "16px",
                    padding: "1rem 1.25rem",
                    cursor: "pointer",
                    transition: "all 0.25s ease",
                    display: "flex",
                    alignItems: "center",
                    gap: "1rem"
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.transform = "translateX(6px)"; e.currentTarget.style.borderColor = "#2563eb"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = "translateX(0)"; e.currentTarget.style.borderColor = "rgba(0, 0, 0, 0.08)"; }}
                >
                  <div style={{ width: "38px", height: "38px", borderRadius: "50%", background: "linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Sparkles size={16} color="#2563eb" />
                  </div>
                  <div style={{ flex: 1 }}>
                    <h4 style={{ fontSize: "0.875rem", fontWeight: 800, color: "#1a2b4a", margin: 0 }}>Khám phá KOL/KOC</h4>
                    <p style={{ fontSize: "0.75rem", color: "var(--muted)", margin: 0 }}>Tìm kiếm theo vibe và lọc tài năng</p>
                  </div>
                  <ChevronRight size={16} color="#7a8b9f" />
                </div>
              </Link>

              <Link href="/shop-profile" style={{ textDecoration: "none", color: "inherit" }}>
                <div
                  style={{
                    background: "white",
                    border: "1px solid rgba(0, 0, 0, 0.08)",
                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.02)",
                    borderRadius: "16px",
                    padding: "1rem 1.25rem",
                    cursor: "pointer",
                    transition: "all 0.25s ease",
                    display: "flex",
                    alignItems: "center",
                    gap: "1rem"
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.transform = "translateX(6px)"; e.currentTarget.style.borderColor = "#ff6b9d"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = "translateX(0)"; e.currentTarget.style.borderColor = "rgba(0, 0, 0, 0.08)"; }}
                >
                  <div style={{ width: "38px", height: "38px", borderRadius: "50%", background: "linear-gradient(135deg, #ffe4e6 0%, #fecdd3 100%)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Store size={16} color="#ff6b9d" />
                  </div>
                  <div style={{ flex: 1 }}>
                    <h4 style={{ fontSize: "0.875rem", fontWeight: 800, color: "#1a2b4a", margin: 0 }}>Thiết lập hồ sơ Shop</h4>
                    <p style={{ fontSize: "0.75rem", color: "var(--muted)", margin: 0 }}>Cập nhật hình ảnh showroom, logo, danh mục</p>
                  </div>
                  <ChevronRight size={16} color="#7a8b9f" />
                </div>
              </Link>

              <Link href="/transactions" style={{ textDecoration: "none", color: "inherit" }}>
                <div
                  style={{
                    background: "white",
                    border: "1px solid rgba(0, 0, 0, 0.08)",
                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.02)",
                    borderRadius: "16px",
                    padding: "1rem 1.25rem",
                    cursor: "pointer",
                    transition: "all 0.25s ease",
                    display: "flex",
                    alignItems: "center",
                    gap: "1rem"
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.transform = "translateX(6px)"; e.currentTarget.style.borderColor = "#10b981"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = "translateX(0)"; e.currentTarget.style.borderColor = "rgba(0, 0, 0, 0.08)"; }}
                >
                  <div style={{ width: "38px", height: "38px", borderRadius: "50%", background: "linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <DollarSign size={16} color="#10b981" />
                  </div>
                  <div style={{ flex: 1 }}>
                    <h4 style={{ fontSize: "0.875rem", fontWeight: 800, color: "#1a2b4a", margin: 0 }}>Ví & Nạp Tiền</h4>
                    <p style={{ fontSize: "0.75rem", color: "var(--muted)", margin: 0 }}>Kiểm tra số dư khả dụng và lịch sử chi tiêu</p>
                  </div>
                  <ChevronRight size={16} color="#7a8b9f" />
                </div>
              </Link>

            </div>
          </div>

        </div>

        {/* ── RIGHT COLUMN: PERFORMANCE CHART & TIMELINES ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>

          {/* Real-time campaign performance card */}
          <div style={{ borderRadius: "24px", padding: "1.75rem", display: "flex", flexDirection: "column", gap: "1.25rem", background: "white", border: "1px solid rgba(0, 0, 0, 0.08)", boxShadow: "0 8px 32px rgba(120, 140, 180, 0.06)" }}>

            <div>
              <span style={{ fontSize: "0.6875rem", fontWeight: 800, color: "var(--muted)", textTransform: "lowercase", letterSpacing: "0.07em" }}>
                real-time campaign performance
              </span>
              <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "1.25rem", fontWeight: 800, color: "#1a2b4a", margin: "0.15rem 0 0 0" }}>
                Hiệu suất chiến dịch của bạn
              </h3>
            </div>

            {/* Performance Stats Metrics Row */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem", borderBottom: "1px solid rgba(37,99,235,0.06)", paddingBottom: "1rem" }}>
              <div>
                <span style={{ fontSize: "0.6875rem", fontWeight: 700, color: "var(--subtle)" }}>Impressions</span>
                <div style={{ display: "flex", alignItems: "baseline", gap: "4px" }}>
                  <span style={{ fontSize: "1.25rem", fontWeight: 800, color: "#1a2b4a" }}>5.58K</span>
                  <span style={{ fontSize: "0.6875rem", fontWeight: 700, color: "#10b981" }}>+12%</span>
                </div>
              </div>
              <div>
                <span style={{ fontSize: "0.6875rem", fontWeight: 700, color: "var(--subtle)" }}>Connects</span>
                <div style={{ display: "flex", alignItems: "baseline", gap: "4px" }}>
                  <span style={{ fontSize: "1.25rem", fontWeight: 800, color: "#1a2b4a" }}>33.5K</span>
                  <span style={{ fontSize: "0.6875rem", fontWeight: 700, color: "#10b981" }}>+25%</span>
                </div>
              </div>
              <div>
                <span style={{ fontSize: "0.6875rem", fontWeight: 700, color: "var(--subtle)" }}>Declined</span>
                <div style={{ display: "flex", alignItems: "baseline", gap: "4px" }}>
                  <span style={{ fontSize: "1.25rem", fontWeight: 800, color: "#1a2b4a" }}>30.0K</span>
                  <span style={{ fontSize: "0.6875rem", fontWeight: 700, color: "#ef4444" }}>-0.5%</span>
                </div>
              </div>
            </div>

            {/* SVG Interactive Chart Curve */}
            <div style={{ width: "100%", padding: "0.5rem 0" }}>
              <svg viewBox="0 0 500 150" style={{ width: "100%", height: "auto", overflow: "visible" }}>
                <defs>
                  <linearGradient id="chartGradLight" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity="0.22" />
                    <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                {/* Horizontal Gridlines */}
                <line x1="0" y1="20" x2="500" y2="20" stroke="rgba(37, 99, 235, 0.05)" strokeWidth="1" strokeDasharray="3 3" />
                <line x1="0" y1="60" x2="500" y2="60" stroke="rgba(37, 99, 235, 0.05)" strokeWidth="1" strokeDasharray="3 3" />
                <line x1="0" y1="100" x2="500" y2="100" stroke="rgba(37, 99, 235, 0.05)" strokeWidth="1" strokeDasharray="3 3" />
                <line x1="0" y1="140" x2="500" y2="140" stroke="rgba(37, 99, 235, 0.05)" strokeWidth="1" />

                {/* Shaded Area Under Curve */}
                <path
                  d="M 0 120 Q 80 80 160 95 T 320 50 T 440 100 T 500 70 L 500 140 L 0 140 Z"
                  fill="url(#chartGradLight)"
                />

                {/* Main Trend Line */}
                <path
                  d="M 0 120 Q 80 80 160 95 T 320 50 T 440 100 T 500 70"
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                />

                {/* Highlight Indicator Dots */}
                <circle cx="320" cy="50" r="5" fill="#10b981" stroke="#ffffff" strokeWidth="2.5" />
                <circle cx="500" cy="70" r="5" fill="#10b981" stroke="#ffffff" strokeWidth="2.5" />
              </svg>
            </div>

          </div>

          {/* Timeline looking campaigns element */}
          <div style={{ borderRadius: "24px", padding: "1.75rem", display: "flex", flexDirection: "column", gap: "1.25rem", background: "white", border: "1px solid rgba(0, 0, 0, 0.08)", boxShadow: "0 8px 32px rgba(120, 140, 180, 0.06)" }}>

            <div>
              <span style={{ fontSize: "0.6875rem", fontWeight: 800, color: "var(--muted)", textTransform: "lowercase", letterSpacing: "0.07em" }}>
                timeline of active campaigns
              </span>
              <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "1.25rem", fontWeight: 800, color: "#1a2b4a", margin: "0.15rem 0 0 0" }}>
                Lịch trình chiến dịch hoàn tất
              </h3>
            </div>

            {/* Campaign Video/Motion Graphics Thumbnails */}
            <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>

              {/* Thumbnail 1 */}
              <div style={{ position: "relative", width: "76px", height: "56px", borderRadius: "10px", overflow: "hidden", border: "1px solid rgba(255, 255, 255, 0.6)", boxShadow: "0 4px 10px rgba(0,0,0,0.06)" }}>
                <img src="/polaroid_grid.png" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                <div style={{ position: "absolute", inset: 0, background: "rgba(26, 43, 74, 0.25)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <div style={{ width: "20px", height: "20px", borderRadius: "50%", background: "rgba(255,255,255,0.85)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Play size={8} fill="#1a2b4a" color="#1a2b4a" style={{ marginLeft: "1.5px" }} />
                  </div>
                </div>
              </div>

              {/* Thumbnail 2 */}
              <div style={{ position: "relative", width: "76px", height: "56px", borderRadius: "10px", overflow: "hidden", border: "1px solid rgba(255, 255, 255, 0.6)", boxShadow: "0 4px 10px rgba(0,0,0,0.06)" }}>
                <img src="/ring_light.png" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                <div style={{ position: "absolute", inset: 0, background: "rgba(26, 43, 74, 0.25)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <div style={{ width: "20px", height: "20px", borderRadius: "50%", background: "rgba(255,255,255,0.85)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Play size={8} fill="#1a2b4a" color="#1a2b4a" style={{ marginLeft: "1.5px" }} />
                  </div>
                </div>
              </div>

              {/* Thumbnail 3 */}
              <div style={{ position: "relative", width: "76px", height: "56px", borderRadius: "10px", overflow: "hidden", border: "1px solid rgba(255, 255, 255, 0.6)", boxShadow: "0 4px 10px rgba(0,0,0,0.06)" }}>
                <img src="/neon_record_player.png" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                <div style={{ position: "absolute", inset: 0, background: "rgba(26, 43, 74, 0.25)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <div style={{ width: "20px", height: "20px", borderRadius: "50%", background: "rgba(255,255,255,0.85)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Play size={8} fill="#1a2b4a" color="#1a2b4a" style={{ marginLeft: "1.5px" }} />
                  </div>
                </div>
              </div>

            </div>

            {/* Campaign Slider Line Indicator */}
            <div style={{ display: "flex", flexDirection: "column", gap: "6px", width: "100%", marginTop: "0.25rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", fontWeight: 700, color: "var(--muted)" }}>
                <span>Đang triển khai</span>
                <span>70% Hoàn thành</span>
              </div>
              <div style={{ width: "100%", height: "5px", background: "rgba(37,99,235,0.08)", borderRadius: "99px", overflow: "hidden", position: "relative" }}>
                <div style={{ width: "70%", height: "100%", background: "linear-gradient(90deg, #10b981 0%, #34d399 100%)", borderRadius: "99px" }} />
              </div>
            </div>

          </div>

        </div>

      </section>

      {/* ── TIPS & TRICKS SECTION ── */}
      <section style={{
        borderRadius: "24px",
        padding: "2rem",
        display: "flex",
        flexDirection: "column",
        gap: "1.25rem",
        background: "white",
        border: "1px solid rgba(0, 0, 0, 0.08)",
        boxShadow: "0 10px 30px rgba(120, 140, 180, 0.03)"
      }}>
        <div>
          <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "1.25rem", fontWeight: 800, color: "#1a2b4a", marginBottom: "0.25rem" }}>
            💡 Mẹo giúp Shop kết nối Creator tốt hơn
          </h2>
          <p style={{ fontSize: "0.78rem", color: "var(--ash)", margin: 0 }}>
            Tối ưu hóa khả năng hiển thị và điểm vibe match với các Creator hàng đầu bằng cách làm theo các gợi ý bên dưới.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.25rem" }}>

          <div style={{ background: "#f8fafc", padding: "1.25rem", borderRadius: "16px", border: "1px solid rgba(0,0,0,0.04)", borderLeft: "4px solid #10b981", boxShadow: "0 4px 12px rgba(120, 140, 180, 0.01)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
              <CheckCircle size={16} color="#10b981" />
              <h3 style={{ fontSize: "0.875rem", fontWeight: 800, color: "#1a2b4a", margin: 0 }}>Định hình Vibe rõ ràng</h3>
            </div>
            <p style={{ fontSize: "0.78rem", color: "var(--muted)", lineHeight: 1.5, margin: 0 }}>
              AI sẽ quét các tags phong cách trên hồ sơ Shop và mô tả chiến dịch (như #Minimalist, #Streetwear). Định hình vibe chính xác sẽ tăng độ phù hợp matching lên tới 98%.
            </p>
          </div>

          <div style={{ background: "#f8fafc", padding: "1.25rem", borderRadius: "16px", border: "1px solid rgba(0,0,0,0.04)", borderLeft: "4px solid #2563eb", boxShadow: "0 4px 12px rgba(120, 140, 180, 0.01)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
              <Clock size={16} color="#2563eb" />
              <h3 style={{ fontSize: "0.875rem", fontWeight: 800, color: "#1a2b4a", margin: 0 }}>Yêu cầu công việc rõ ràng</h3>
            </div>
            <p style={{ fontSize: "0.78rem", color: "var(--muted)", lineHeight: 1.5, margin: 0 }}>
              Mô tả chi tiết quyền lợi, thù lao, thể lệ và kịch bản mẫu. Cung cấp đầy đủ thông tin giúp các Creator chất lượng cao dễ dàng ứng tuyển và chuẩn bị tốt hơn.
            </p>
          </div>

          <div style={{ background: "#f8fafc", padding: "1.25rem", borderRadius: "16px", border: "1px solid rgba(0,0,0,0.04)", borderLeft: "4px solid #f59e0b", boxShadow: "0 4px 12px rgba(120, 140, 180, 0.01)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
              <Award size={16} color="#f59e0b" />
              <h3 style={{ fontSize: "0.875rem", fontWeight: 800, color: "#1a2b4a", margin: 0 }}>Phản hồi ứng tuyển nhanh</h3>
            </div>
            <p style={{ fontSize: "0.78rem", color: "var(--muted)", lineHeight: 1.5, margin: 0 }}>
              Duy trì tương tác và phản hồi hồ sơ ứng cử từ các Creator nhanh chóng. Điều này giúp nâng điểm uy tín của Shop trên hệ thống Castme và giữ chân các creator tốt nhất.
            </p>
          </div>

        </div>
      </section>

      {/* Custom responsive media styles for current layout */}
      <style>{`
        @media (max-width: 992px) {
          .interactive-grid {
            grid-template-columns: 1fr !important;
            gap: 1.5rem !important;
          }
        }
      `}</style>

    </div>
  );
}
