"use client";

import React, { useState, useEffect } from "react";
import JobCard from "#/components/JobCard";
import { useRouter } from "next/navigation";
import { getMyCastingJobs } from "#/app/(shop)/my-casting/actions";
import {
  TrendingUp,
  Zap,
  Users,
  Eye,
  ArrowUpRight,
  Sparkles,
  ChevronRight,
  Plus,
} from "lucide-react";

/* ── Metric Card ── */
function MetricCard({ label, value, trend, isUp, icon: Icon, color }) {
  return (
    <div className="metric-card">
      <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", marginBottom:"1rem" }}>
        <div style={{
          width:"40px", height:"40px",
          background: `${color}18`,
          borderRadius:"var(--radius-md)",
          display:"flex", alignItems:"center", justifyContent:"center",
        }}>
          <Icon size={18} color={color} strokeWidth={2} />
        </div>
        <span style={{
          display:"inline-flex", alignItems:"center", gap:"3px",
          fontSize:"0.6875rem", fontWeight:700,
          padding:"0.2rem 0.5rem",
          borderRadius:"var(--radius-full)",
          background: isUp ? "var(--success-light)" : "var(--error-light)",
          color: isUp ? "var(--success)" : "var(--error)",
        }}>
          <ArrowUpRight size={11} strokeWidth={2.5} style={{ transform: isUp ? "none" : "rotate(90deg)" }} />
          {trend}
        </span>
      </div>
      <div style={{ fontFamily:"var(--font-heading)", fontSize:"1.625rem", fontWeight:800, color:"var(--slate)", marginBottom:"0.25rem", letterSpacing:"-0.02em" }}>
        {value}
      </div>
      <div style={{ fontSize:"0.8125rem", color:"var(--muted)", fontWeight:500 }}>{label}</div>
    </div>
  );
}

/* ── KOC Match Card ── */
function KocCard({ koc, onInvite, onView }) {
  const matchColor = koc.matchRate >= 95 ? "var(--success)" : koc.matchRate >= 85 ? "var(--warning)" : "var(--muted)";

  return (
    <div style={{
      background:"rgba(255,255,255,0.07)",
      border:"1px solid rgba(255,255,255,0.10)",
      borderRadius:"var(--radius-md)",
      padding:"0.875rem",
      backdropFilter:"blur(8px)",
      transition:"background 0.2s",
    }}
      onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.12)"}
      onMouseLeave={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.07)"}
    >
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:"0.75rem" }}>
        <div style={{ display:"flex", alignItems:"center", gap:"0.625rem" }}>
          <div style={{
            width:"38px", height:"38px",
            background:"linear-gradient(135deg, var(--primary-light), var(--rose-light))",
            borderRadius:"50%",
            display:"flex", alignItems:"center", justifyContent:"center",
            fontSize:"1.1rem",
            border:"2px solid rgba(255,255,255,0.30)",
            fontWeight:700, color:"var(--primary)",
          }}>
            {koc.avatar || koc.name[0]}
          </div>
          <div>
            <div style={{ fontFamily:"var(--font-heading)", fontWeight:700, color:"white", fontSize:"0.875rem", lineHeight:1.2 }}>{koc.name}</div>
            <div style={{ fontSize:"0.625rem", color:"rgba(196,181,253,0.70)", marginTop:"2px" }}>
              #{koc.vibe} · {koc.channel} · {koc.followers}
            </div>
          </div>
        </div>
        <div style={{
          background: koc.matchRate >= 95 ? "linear-gradient(135deg, var(--success), #059669)" : "rgba(255,255,255,0.15)",
          color: "white",
          fontWeight:900, fontSize:"0.6875rem",
          padding:"0.25rem 0.625rem",
          borderRadius:"var(--radius-sm)",
          boxShadow: koc.matchRate >= 95 ? "0 2px 8px rgba(16,185,129,0.40)" : "none",
        }}>
          🎯 {koc.matchRate}%
        </div>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0.5rem" }}>
        <button
          onClick={() => onView(koc)}
          style={{
            padding:"0.5rem",
            background:"rgba(255,255,255,0.10)",
            border:"1px solid rgba(255,255,255,0.12)",
            borderRadius:"var(--radius-sm)",
            color:"rgba(255,255,255,0.80)",
            fontSize:"0.75rem", fontWeight:600,
            cursor:"pointer", transition:"all 0.18s",
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.18)"}
          onMouseLeave={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.10)"}
        >
          Xem Profile
        </button>
        <button
          onClick={() => onInvite(koc)}
          style={{
            padding:"0.5rem",
            background:"linear-gradient(135deg, var(--primary) 0%, #9333EA 100%)",
            border:"none",
            borderRadius:"var(--radius-sm)",
            color:"white",
            fontSize:"0.75rem", fontWeight:700,
            cursor:"pointer", transition:"all 0.18s",
            boxShadow:"0 2px 8px rgba(124,58,237,0.40)",
          }}
          onMouseEnter={(e) => e.currentTarget.style.opacity = "0.9"}
          onMouseLeave={(e) => e.currentTarget.style.opacity = "1"}
        >
          Mời hợp tác
        </button>
      </div>
    </div>
  );
}

export default function ShopDashboard() {
  const router = useRouter();

  const metrics = [
    { label: "Tổng ngân sách đã chi", value: "45.5M₫", trend: "+12.5%", isUp: true, icon: TrendingUp, color: "var(--primary)" },
    { label: "Chiến dịch đang chạy", value: "3", trend: "Ổn định", isUp: true, icon: Zap, color: "var(--warning)" },
    { label: "KOC đang hợp tác", value: "12", trend: "+2", isUp: true, icon: Users, color: "var(--success)" },
    { label: "Tổng lượt tiếp cận", value: "1.2M", trend: "+450K", isUp: true, icon: Eye, color: "var(--rose)" },
  ];

  const recommendedKocs = [
    { id: "koc-1", name: "Thảo Vy Review", avatar: "T", vibe: "Minimalism", channel: "TikTok", followers: "125K", matchRate: 98 },
    { id: "koc-2", name: "Khoa Style", avatar: "K", vibe: "Streetwear", channel: "Instagram", followers: "89K", matchRate: 95 },
    { id: "koc-3", name: "Mai Matcha", avatar: "M", vibe: "GenZ", channel: "TikTok", followers: "300K", matchRate: 91 },
  ];

  const [inProgressJobs, setInProgressJobs] = useState([]);
  const [loadingJobs, setLoadingJobs] = useState(true);

  useEffect(() => {
    async function fetchJobs() {
      setLoadingJobs(true);
      const res = await getMyCastingJobs();
      if (res.success) setInProgressJobs(res.data.filter((j) => j.status === "in-progress"));
      setLoadingJobs(false);
    }
    fetchJobs();
  }, []);

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:"2rem", animation:"fadeIn 0.4s ease" }}>

      {/* ── Page Header ── */}
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:"1rem" }}>
        <div>
          <h1 style={{ fontFamily:"var(--font-heading)", fontSize:"1.625rem", fontWeight:800, color:"var(--slate)", letterSpacing:"-0.02em", marginBottom:"0.25rem" }}>
            Tổng quan Shop
          </h1>
          <p style={{ fontSize:"0.875rem", color:"var(--muted)" }}>
            Xem tổng quan hoạt động và khám phá creator phù hợp.
          </p>
        </div>
        <button
          onClick={() => router.push("/my-casting")}
          className="btn btn-primary"
          style={{ fontSize:"0.875rem", padding:"0.625rem 1.25rem", cursor:"pointer" }}
        >
          <Plus size={16} strokeWidth={2.5} />
          Tạo chiến dịch mới
        </button>
      </div>

      {/* ── Metrics Row ── */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(210px, 1fr))", gap:"1rem" }}>
        {metrics.map((m, i) => <MetricCard key={i} {...m} />)}
      </div>

      {/* ── Main Grid ── */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 340px", gap:"1.5rem" }} className="dashboard-grid">

        {/* LEFT — Active campaigns */}
        <div style={{ display:"flex", flexDirection:"column", gap:"1.25rem" }}>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
            <h2 style={{ fontFamily:"var(--font-heading)", fontSize:"1.125rem", fontWeight:800, color:"var(--slate)", letterSpacing:"-0.01em" }}>
              Dự án đang thực hiện
            </h2>
            <button
              onClick={() => router.push("/my-casting")}
              style={{ display:"flex", alignItems:"center", gap:"0.25rem", fontSize:"0.8125rem", fontWeight:700, color:"var(--primary)", background:"none", border:"none", cursor:"pointer", padding:0 }}
            >
              Quản lý tất cả
              <ChevronRight size={14} />
            </button>
          </div>

          {loadingJobs ? (
            <div style={{ display:"flex", alignItems:"center", justifyContent:"center", padding:"3rem", background:"var(--surface)", borderRadius:"var(--radius-lg)", border:"1px solid var(--border)" }}>
              <div style={{ width:"32px", height:"32px", border:"3px solid var(--primary-muted)", borderTopColor:"var(--primary)", borderRadius:"50%", animation:"spinSlow 0.8s linear infinite" }} />
            </div>
          ) : inProgressJobs.length === 0 ? (
            <div style={{
              background:"var(--surface)",
              border:"1.5px dashed var(--border)",
              borderRadius:"var(--radius-lg)",
              padding:"3rem",
              textAlign:"center",
            }}>
              <div style={{ fontSize:"2rem", marginBottom:"0.75rem" }}>📋</div>
              <p style={{ color:"var(--muted)", fontSize:"0.9rem", marginBottom:"1.25rem" }}>
                Chưa có dự án nào đang thực hiện.
              </p>
              <button
                onClick={() => router.push("/my-casting")}
                className="btn btn-outline-primary"
                style={{ fontSize:"0.875rem", cursor:"pointer" }}
              >
                <Plus size={15} /> Tạo chiến dịch ngay
              </button>
            </div>
          ) : (
            <div style={{ display:"flex", flexDirection:"column", gap:"0.875rem" }}>
              {inProgressJobs.map((campaign) => (
                <JobCard
                  key={campaign.id}
                  job={campaign}
                  role="shop"
                  onAction={(job) => router.push(`/my-casting?jobId=${job.id}`)}
                />
              ))}
            </div>
          )}
        </div>

        {/* RIGHT — AI Matching Panel */}
        <div>
          <div style={{
            background:"linear-gradient(160deg, #0F0520 0%, #2D1060 40%, #4C1D95 75%, #7C1F5A 100%)",
            borderRadius:"var(--radius-xl)",
            padding:"1.5rem",
            boxShadow:"0 20px 60px -10px rgba(124,58,237,0.45)",
            position:"relative",
            overflow:"hidden",
          }}>
            {/* Glow orbs */}
            <div style={{ position:"absolute", top:"-60px", right:"-60px", width:"200px", height:"200px", borderRadius:"50%", background:"radial-gradient(circle, rgba(244,63,142,0.20) 0%, transparent 70%)", pointerEvents:"none" }} />
            <div style={{ position:"absolute", bottom:"-40px", left:"-40px", width:"160px", height:"160px", borderRadius:"50%", background:"radial-gradient(circle, rgba(124,58,237,0.25) 0%, transparent 70%)", pointerEvents:"none" }} />

            <div style={{ position:"relative" }}>
              {/* Header */}
              <div style={{ display:"flex", alignItems:"center", gap:"0.5rem", marginBottom:"0.375rem" }}>
                <Sparkles size={14} color="var(--primary-muted)" />
                <span style={{ fontSize:"0.625rem", fontWeight:800, color:"var(--primary-muted)", textTransform:"uppercase", letterSpacing:"0.1em" }}>
                  AI Match
                </span>
                <span style={{ marginLeft:"auto", fontSize:"0.5625rem", fontWeight:800, background:"var(--success)", color:"white", padding:"0.15rem 0.5rem", borderRadius:"99px" }}>LIVE</span>
              </div>
              <h3 style={{ fontFamily:"var(--font-heading)", fontWeight:800, color:"white", fontSize:"1rem", lineHeight:1.25, marginBottom:"1.25rem" }}>
                KOC phù hợp nhất<br />với shop của bạn
              </h3>

              {/* KOC Cards */}
              <div style={{ display:"flex", flexDirection:"column", gap:"0.625rem" }}>
                {recommendedKocs.map((koc) => (
                  <KocCard
                    key={koc.id}
                    koc={koc}
                    onView={(k) => router.push(`/creator/${k.id}`)}
                    onInvite={(k) => router.push(`/messages?to=${k.id}`)}
                  />
                ))}
              </div>

              {/* See more */}
              <button
                onClick={() => router.push("/search-creator")}
                style={{
                  marginTop:"1rem", width:"100%",
                  padding:"0.625rem",
                  background:"rgba(255,255,255,0.10)",
                  border:"1px solid rgba(255,255,255,0.15)",
                  borderRadius:"var(--radius-md)",
                  color:"rgba(255,255,255,0.80)",
                  fontSize:"0.8125rem", fontWeight:600,
                  cursor:"pointer", transition:"background 0.2s",
                  display:"flex", alignItems:"center", justifyContent:"center", gap:"0.375rem",
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.18)"}
                onMouseLeave={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.10)"}
              >
                Xem tất cả Creator <ChevronRight size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 1100px) {
          .dashboard-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
