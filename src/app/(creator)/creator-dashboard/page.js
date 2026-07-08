"use client";
import React, { useState, useEffect } from "react";
import { getAvailableJobs, applyToJobAction, getPublicShopProfile } from "#/app/(creator)/actions";
import {
  Sparkles,
  Store,
  Zap,
  X,
  ChevronRight,
  SlidersHorizontal,
  DollarSign,
  ExternalLink,
  Globe,
  Instagram,
  Star,
  Briefcase,
} from "lucide-react";

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
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [applyingId, setApplyingId] = useState(null);
  const [shopModalOpen, setShopModalOpen] = useState(false);
  const [shopProfile, setShopProfile] = useState(null);
  const [loadingShop, setLoadingShop] = useState(false);

  const fetchJobs = async () => {
    setLoading(true);
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
      }));
      setJobs(formatted);
    } catch (error) {
      console.error("Lỗi khi tải job:", error);
    } finally {
      setLoading(false);
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
      alert("✅ Ứng tuyển thành công! Shop sẽ xem hồ sơ của bạn sớm.");
    } else {
      alert(`❌ ${result.error || "Không thể ứng tuyển lúc này"}`);
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

  const topMatches = jobs.filter((j) => (j.matchRate || 0) >= 85).slice(0, 4);
  const allJobs = jobs;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2rem", animation: "fadeIn 0.4s ease" }}>

      {/* ── Page Header ── */}
      <div>
        <h1 style={{ fontFamily:"var(--font-heading)", fontSize:"1.625rem", fontWeight:800, color:"var(--slate)", letterSpacing:"-0.02em", marginBottom:"0.25rem" }}>
          Khám phá Chiến dịch
        </h1>
        <p style={{ fontSize:"0.875rem", color:"var(--muted)" }}>
          AI đã tìm thấy {topMatches.length} shop phù hợp với phong cách của bạn.
        </p>
      </div>

      {/* ═══ AI MATCHING BANNER ═══ */}
      <section style={{
        background: "linear-gradient(135deg, #0F0520 0%, #2D1060 40%, #4C1D95 75%, #7C1F5A 100%)",
        borderRadius: "var(--radius-xl)",
        padding: "2rem",
        position: "relative",
        overflow: "hidden",
        boxShadow: "0 20px 60px -10px rgba(124,58,237,0.45)",
      }}>
        {/* Glow orbs */}
        <div style={{ position:"absolute", top:"-80px", right:"-80px", width:"280px", height:"280px", borderRadius:"50%", background:"radial-gradient(circle, rgba(244,63,142,0.22) 0%, transparent 70%)", pointerEvents:"none" }} />
        <div style={{ position:"absolute", bottom:"-60px", left:"20%", width:"200px", height:"200px", borderRadius:"50%", background:"radial-gradient(circle, rgba(124,58,237,0.20) 0%, transparent 70%)", pointerEvents:"none" }} />

        <div style={{ position:"relative" }}>
          {/* Header */}
          <div style={{ display:"flex", alignItems:"center", gap:"0.5rem", marginBottom:"0.5rem" }}>
            <Sparkles size={14} color="var(--primary-muted)" />
            <span style={{ fontSize:"0.625rem", fontWeight:800, color:"var(--primary-muted)", textTransform:"uppercase", letterSpacing:"0.1em" }}>
              Castme AI Matching Engine
            </span>
            <span style={{ marginLeft:"0.5rem", fontSize:"0.5625rem", fontWeight:800, background:"var(--rose)", color:"white", padding:"0.15rem 0.5rem", borderRadius:"99px" }}>LIVE</span>
          </div>
          <h2 style={{
            fontFamily: "var(--font-heading)",
            fontSize: "clamp(1.125rem, 3vw, 1.5rem)",
            fontWeight: 800, color: "white",
            letterSpacing: "-0.02em",
            marginBottom: "0.5rem",
          }}>
            Shop phù hợp nhất với Vibe của bạn
          </h2>
          <p style={{ color:"rgba(196,181,253,0.75)", fontSize:"0.875rem", lineHeight:1.6, marginBottom:"1.5rem", maxWidth:"480px" }}>
            Hệ thống AI đã quét hồ sơ phong cách của bạn và tìm thấy các nhãn hàng tương thích nhất hôm nay.
          </p>

          {/* AI Match Cards */}
          {loading ? (
            <div style={{ display:"flex", justifyContent:"center", padding:"2rem 0" }}>
              <div style={{ width:"32px", height:"32px", border:"3px solid rgba(196,181,253,0.40)", borderTopColor:"var(--primary-muted)", borderRadius:"50%", animation:"spinSlow 0.8s linear infinite" }} />
            </div>
          ) : topMatches.length > 0 ? (
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
              gap: "0.875rem",
            }}>
              {topMatches.map((job) => (
                <div key={`ai-${job.id}`} style={{
                  background: "rgba(255,255,255,0.08)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  borderRadius: "var(--radius-lg)",
                  padding: "1.25rem",
                  backdropFilter: "blur(10px)",
                  display: "flex", flexDirection: "column", justifyContent: "space-between",
                  gap: "1rem",
                  transition: "background 0.2s",
                }}
                  onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.14)"}
                  onMouseLeave={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.08)"}
                >
                  <div>
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:"0.625rem" }}>
                      <div style={{ display:"flex", alignItems:"center", gap:"0.5rem" }}>
                        <div style={{ width:"28px", height:"28px", background:"linear-gradient(135deg, var(--primary-light), var(--rose-light))", borderRadius:"var(--radius-sm)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"0.75rem", fontWeight:700, color:"var(--primary)" }}>
                          {job.shopName[0]}
                        </div>
                        <span style={{ fontSize:"0.75rem", fontWeight:700, color:"rgba(196,181,253,0.80)" }}>{job.shopName}</span>
                      </div>
                      <MatchBadge rate={job.matchRate} small />
                    </div>
                    <h3 style={{ fontFamily:"var(--font-heading)", fontWeight:700, color:"white", fontSize:"0.9375rem", lineHeight:1.3, marginBottom:"0.625rem" }}>
                      {job.title}
                    </h3>
                    <div style={{ display:"flex", flexWrap:"wrap", gap:"0.375rem" }}>
                      {job.vibeTags.slice(0, 3).map((tag) => (
                        <span key={tag} style={{ fontSize:"0.625rem", background:"rgba(255,255,255,0.10)", color:"rgba(255,255,255,0.75)", padding:"0.2rem 0.5rem", borderRadius:"var(--radius-full)", border:"1px solid rgba(255,255,255,0.10)" }}>#{tag}</span>
                      ))}
                    </div>
                  </div>

                  <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", borderTop:"1px solid rgba(255,255,255,0.08)", paddingTop:"0.875rem" }}>
                    <span style={{ fontFamily:"var(--font-heading)", fontSize:"1rem", fontWeight:800, color:"#FCD34D" }}>{job.budget}</span>
                    <div style={{ display:"flex", gap:"0.5rem" }}>
                      <button
                        onClick={() => viewShopProfile(job.shopId)}
                        style={{
                          padding:"0.4rem 0.875rem",
                          background:"rgba(255,255,255,0.10)",
                          border:"1px solid rgba(255,255,255,0.15)",
                          borderRadius:"var(--radius-sm)",
                          color:"rgba(255,255,255,0.80)",
                          fontSize:"0.75rem", fontWeight:600,
                          cursor:"pointer",
                        }}
                      >
                        Xem hồ sơ
                      </button>
                      <button
                        onClick={() => handleConnect(job.id)}
                        disabled={applyingId === job.id}
                        style={{
                          padding:"0.4rem 0.875rem",
                          background:"white",
                          border:"none",
                          borderRadius:"var(--radius-sm)",
                          color:"var(--primary)",
                          fontSize:"0.75rem", fontWeight:800,
                          cursor: applyingId === job.id ? "not-allowed" : "pointer",
                          opacity: applyingId === job.id ? 0.7 : 1,
                        }}
                      >
                        {applyingId === job.id ? "..." : "Kết nối ngay"}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ color:"rgba(196,181,253,0.60)", fontSize:"0.875rem" }}>Chưa có gợi ý phù hợp. Hãy cập nhật hồ sơ phong cách của bạn!</p>
          )}
        </div>
      </section>

      {/* ═══ ALL JOBS LIST ═══ */}
      <section style={{ display:"flex", flexDirection:"column", gap:"1.25rem" }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:"0.75rem" }}>
          <div>
            <h2 style={{ fontFamily:"var(--font-heading)", fontSize:"1.125rem", fontWeight:800, color:"var(--slate)", letterSpacing:"-0.01em" }}>
              Tất cả tin tuyển dụng
            </h2>
            <p style={{ fontSize:"0.8125rem", color:"var(--muted)" }}>Các cơ hội hợp tác phù hợp với bạn</p>
          </div>
          <button style={{
            display:"flex", alignItems:"center", gap:"0.5rem",
            padding:"0.5rem 1rem",
            background:"var(--surface)",
            border:"1.5px solid var(--border)",
            borderRadius:"var(--radius-full)",
            fontSize:"0.875rem", fontWeight:600, color:"var(--slate)",
            cursor:"pointer",
            transition:"all 0.2s",
          }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--primary-muted)"; e.currentTarget.style.color = "var(--primary)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.color = "var(--slate)"; }}
          >
            <SlidersHorizontal size={14} />
            Bộ lọc nâng cao
          </button>
        </div>

        {loading ? (
          <div style={{ display:"flex", alignItems:"center", justifyContent:"center", padding:"3rem", background:"var(--surface)", borderRadius:"var(--radius-lg)", border:"1px solid var(--border)" }}>
            <div style={{ width:"32px", height:"32px", border:"3px solid var(--primary-muted)", borderTopColor:"var(--primary)", borderRadius:"50%", animation:"spinSlow 0.8s linear infinite" }} />
          </div>
        ) : allJobs.length > 0 ? (
          <div style={{ display:"flex", flexDirection:"column", gap:"0.875rem" }}>
            {allJobs.map((job) => (
              <div key={job.id} className="card" style={{
                padding: "1.5rem",
                display: "flex",
                gap: "1.5rem",
                alignItems: "flex-start",
              }}>
                {/* Shop avatar */}
                <div style={{
                  width: "48px", height: "48px", flexShrink: 0,
                  background: "linear-gradient(135deg, var(--primary-light), var(--rose-light))",
                  borderRadius: "var(--radius-md)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "1.25rem", fontWeight: 800, color: "var(--primary)",
                  border: "1px solid var(--primary-muted)",
                }}>
                  {job.shopName[0]}
                </div>

                {/* Content */}
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:"0.625rem", flexWrap:"wrap", marginBottom:"0.375rem" }}>
                    <span style={{
                      display:"flex", alignItems:"center", gap:"0.25rem",
                      fontSize:"0.8125rem", fontWeight:700, color:"var(--muted)",
                    }}>
                      <Store size={13} />
                      {job.shopName}
                    </span>
                    <MatchBadge rate={job.matchRate} small />
                  </div>
                  <h3 style={{
                    fontFamily:"var(--font-heading)",
                    fontSize:"1.0625rem",
                    fontWeight:800,
                    color:"var(--slate)",
                    marginBottom:"0.5rem",
                    lineHeight:1.3,
                  }}>
                    {job.title}
                  </h3>
                  <p style={{ fontSize:"0.875rem", color:"var(--muted)", lineHeight:1.65, marginBottom:"0.75rem", display:"-webkit-box", WebkitLineClamp:2, WebkitBoxOrient:"vertical", overflow:"hidden" }}>
                    {job.description}
                  </p>
                  <div style={{ display:"flex", flexWrap:"wrap", gap:"0.375rem" }}>
                    {job.vibeTags.map((tag) => <VibeTag key={tag} tag={tag} />)}
                  </div>
                </div>

                {/* Right panel */}
                <div style={{
                  flexShrink:0,
                  display:"flex", flexDirection:"column",
                  alignItems:"flex-end", justifyContent:"space-between",
                  gap:"1rem", minWidth:"160px",
                }}>
                  <div style={{ textAlign:"right" }}>
                    <span style={{ display:"block", fontSize:"0.6875rem", fontWeight:600, color:"var(--subtle)", textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:"0.25rem" }}>
                      Thù lao
                    </span>
                    <span style={{
                      fontFamily:"var(--font-heading)",
                      fontSize:"1.25rem",
                      fontWeight:800,
                      color:"var(--primary)",
                    }}>
                      {job.budget}
                    </span>
                  </div>
                  <div style={{ display:"flex", flexDirection:"column", gap:"0.5rem", width:"100%" }}>
                    <button
                      onClick={() => viewShopProfile(job.shopId)}
                      className="btn btn-ghost"
                      style={{ width:"100%", padding:"0.5rem", fontSize:"0.8125rem", cursor:"pointer" }}
                    >
                      <Store size={13} />
                      Xem hồ sơ
                    </button>
                    <button
                      onClick={() => handleConnect(job.id)}
                      disabled={applyingId === job.id}
                      className="btn btn-primary"
                      style={{
                        width:"100%",
                        padding:"0.625rem",
                        fontSize:"0.875rem",
                        cursor: applyingId === job.id ? "not-allowed" : "pointer",
                        opacity: applyingId === job.id ? 0.7 : 1,
                      }}
                    >
                      <Zap size={14} />
                      {applyingId === job.id ? "Đang ứng tuyển..." : "Kết nối ngay"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{
            background:"var(--surface)",
            border:"1.5px dashed var(--border)",
            borderRadius:"var(--radius-lg)",
            padding:"3rem",
            textAlign:"center",
          }}>
            <div style={{ fontSize:"2rem", marginBottom:"0.75rem" }}>🔍</div>
            <p style={{ color:"var(--muted)", fontSize:"0.9rem" }}>Hiện chưa có tin tuyển dụng nào đang mở.</p>
          </div>
        )}
      </section>

      {/* ═══ SHOP PROFILE MODAL ═══ */}
      {shopModalOpen && (
        <div style={{
          position:"fixed", inset:0,
          background:"rgba(15,5,32,0.70)",
          backdropFilter:"blur(8px)",
          display:"flex", alignItems:"center", justifyContent:"center",
          zIndex:50, padding:"1rem",
          animation:"fadeIn 0.25s ease",
        }}
          onClick={(e) => { if (e.target === e.currentTarget) setShopModalOpen(false); }}
        >
          <div className="animate-scale-in" style={{
            background:"var(--surface)",
            borderRadius:"var(--radius-xl)",
            maxWidth:"680px", width:"100%",
            maxHeight:"90vh",
            display:"flex", flexDirection:"column",
            boxShadow:"var(--shadow-lg)",
            overflow:"hidden",
          }}>
            {/* Modal Header */}
            <div style={{
              padding:"1.25rem 1.5rem",
              borderBottom:"1px solid var(--border)",
              display:"flex", alignItems:"center", justifyContent:"space-between",
              background:"var(--surface)",
              flexShrink:0,
            }}>
              <h3 style={{ fontFamily:"var(--font-heading)", fontWeight:800, color:"var(--slate)", fontSize:"1rem" }}>
                Thông tin đối tác thương hiệu
              </h3>
              <button
                onClick={() => setShopModalOpen(false)}
                style={{
                  width:"32px", height:"32px",
                  display:"flex", alignItems:"center", justifyContent:"center",
                  background:"var(--bg)",
                  border:"1px solid var(--border)",
                  borderRadius:"50%",
                  cursor:"pointer",
                  transition:"all 0.2s",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "var(--error-light)"; e.currentTarget.style.borderColor = "var(--error)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "var(--bg)"; e.currentTarget.style.borderColor = "var(--border)"; }}
              >
                <X size={14} color="var(--muted)" />
              </button>
            </div>

            {/* Modal Body */}
            <div style={{ flex:1, overflowY:"auto" }}>
              {loadingShop ? (
                <div style={{ padding:"4rem", textAlign:"center" }}>
                  <div style={{ width:"36px", height:"36px", border:"3px solid var(--primary-muted)", borderTopColor:"var(--primary)", borderRadius:"50%", animation:"spinSlow 0.8s linear infinite", margin:"0 auto 1rem" }} />
                  <p style={{ fontSize:"0.875rem", color:"var(--muted)" }}>Đang đồng bộ dữ liệu cửa hàng...</p>
                </div>
              ) : shopProfile ? (
                <div>
                  {/* Cover + Avatar */}
                  <div style={{ position:"relative" }}>
                    <div style={{ height:"140px", background:"linear-gradient(135deg, var(--primary-light), var(--rose-light))", overflow:"hidden" }}>
                      {shopProfile.coverImage && <img src={shopProfile.coverImage} alt="Cover" style={{ width:"100%", height:"100%", objectFit:"cover" }} />}
                    </div>
                    <div style={{
                      position:"absolute", bottom:"-24px", left:"1.5rem",
                      width:"56px", height:"56px",
                      borderRadius:"var(--radius-md)",
                      border:"3px solid white",
                      background:"var(--surface)",
                      overflow:"hidden",
                      boxShadow:"var(--shadow-md)",
                    }}>
                      {shopProfile.mainImage
                        ? <img src={shopProfile.mainImage} alt="Logo" style={{ width:"100%", height:"100%", objectFit:"cover" }} />
                        : <div style={{ width:"100%", height:"100%", background:"linear-gradient(135deg, var(--primary), var(--rose))", display:"flex", alignItems:"center", justifyContent:"center", color:"white", fontWeight:800, fontSize:"1.25rem" }}>{shopProfile.shopName?.charAt(0)}</div>
                      }
                    </div>
                  </div>

                  <div style={{ padding:"2.5rem 1.5rem 1.5rem" }}>
                    <h2 style={{ fontFamily:"var(--font-heading)", fontSize:"1.25rem", fontWeight:800, color:"var(--slate)", marginBottom:"0.25rem" }}>
                      {shopProfile.shopName}
                    </h2>
                    <p style={{ fontSize:"0.8125rem", color:"var(--muted)", marginBottom:"1rem" }}>
                      Người đại diện: {shopProfile.ownerName || "Chưa cập nhật"}
                    </p>

                    {/* Categories */}
                    {shopProfile.categories?.length > 0 && (
                      <div style={{ display:"flex", flexWrap:"wrap", gap:"0.375rem", marginBottom:"1.25rem" }}>
                        {shopProfile.categories.map((c) => (
                          <span key={c} className="badge badge-primary">{c}</span>
                        ))}
                      </div>
                    )}

                    {/* Description */}
                    <div style={{ background:"var(--bg)", borderRadius:"var(--radius-md)", padding:"1rem 1.125rem", border:"1px solid var(--border)", marginBottom:"1.25rem" }}>
                      <p style={{ fontSize:"0.625rem", fontWeight:700, color:"var(--subtle)", textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:"0.5rem" }}>Giới thiệu thương hiệu</p>
                      <p style={{ fontSize:"0.875rem", color:"var(--muted)", lineHeight:1.7, whiteSpace:"pre-line" }}>
                        {shopProfile.description || "Cửa hàng chưa cập nhật phần mô tả."}
                      </p>
                    </div>

                    {/* Stats */}
                    <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(130px, 1fr))", gap:"0.75rem", marginBottom:"1.25rem" }}>
                      <div style={{ background:"var(--warning-light)", border:"1px solid rgba(245,158,11,0.20)", borderRadius:"var(--radius-md)", padding:"0.875rem", textAlign:"center" }}>
                        <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:"0.25rem", marginBottom:"0.25rem" }}>
                          <Star size={12} color="var(--warning)" fill="var(--warning)" />
                          <span style={{ fontSize:"0.625rem", fontWeight:700, color:"var(--warning)", textTransform:"uppercase" }}>Đánh giá</span>
                        </div>
                        <span style={{ fontFamily:"var(--font-heading)", fontSize:"1.25rem", fontWeight:800, color:"var(--warning)" }}>
                          {shopProfile.averageRating ? `${shopProfile.averageRating}` : "—"}
                        </span>
                      </div>
                      <div style={{ background:"var(--primary-light)", border:"1px solid var(--primary-muted)", borderRadius:"var(--radius-md)", padding:"0.875rem", textAlign:"center" }}>
                        <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:"0.25rem", marginBottom:"0.25rem" }}>
                          <Briefcase size={12} color="var(--primary)" />
                          <span style={{ fontSize:"0.625rem", fontWeight:700, color:"var(--primary)", textTransform:"uppercase" }}>Chiến dịch</span>
                        </div>
                        <span style={{ fontFamily:"var(--font-heading)", fontSize:"1.25rem", fontWeight:800, color:"var(--primary)" }}>
                          {shopProfile.totalJobs || 0}
                        </span>
                      </div>
                    </div>

                    {/* Vibe */}
                    {shopProfile.vibeText && (
                      <div style={{ background:"var(--bg)", borderRadius:"var(--radius-md)", padding:"1rem", border:"1px solid var(--border)", marginBottom:"1.25rem" }}>
                        <p style={{ fontSize:"0.625rem", fontWeight:700, color:"var(--subtle)", textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:"0.5rem" }}>🎯 Định hướng Vibe sáng tạo</p>
                        <p style={{ fontSize:"0.875rem", color:"var(--muted)", lineHeight:1.6 }}>{shopProfile.vibeText}</p>
                      </div>
                    )}

                    {/* Links */}
                    <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0.625rem", marginBottom:"1.25rem" }}>
                      {shopProfile.website && (
                        <a href={shopProfile.website} target="_blank" rel="noreferrer" style={{
                          display:"flex", alignItems:"center", gap:"0.5rem",
                          padding:"0.625rem", background:"var(--bg)", border:"1px solid var(--border)",
                          borderRadius:"var(--radius-md)", textDecoration:"none", fontSize:"0.8125rem",
                          color:"var(--primary)", fontWeight:500, transition:"all 0.2s",
                        }}>
                          <Globe size={14} /> Website <ExternalLink size={11} />
                        </a>
                      )}
                      {shopProfile.instagram && (
                        <a href={shopProfile.instagram.startsWith("http") ? shopProfile.instagram : `https://instagram.com/${shopProfile.instagram.replace("@", "")}`}
                          target="_blank" rel="noreferrer" style={{
                            display:"flex", alignItems:"center", gap:"0.5rem",
                            padding:"0.625rem", background:"var(--rose-light)", border:"1px solid var(--rose-muted)",
                            borderRadius:"var(--radius-md)", textDecoration:"none", fontSize:"0.8125rem",
                            color:"var(--rose)", fontWeight:500, transition:"all 0.2s",
                          }}>
                          <Instagram size={14} /> Instagram <ExternalLink size={11} />
                        </a>
                      )}
                    </div>

                    {/* Gallery */}
                    {shopProfile.gallery?.length > 0 && (
                      <div>
                        <p style={{ fontSize:"0.625rem", fontWeight:700, color:"var(--subtle)", textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:"0.75rem" }}>
                          Không gian & Sản phẩm nổi bật
                        </p>
                        <div style={{ display:"grid", gridTemplateColumns:"repeat(3, 1fr)", gap:"0.5rem" }}>
                          {shopProfile.gallery.map((img, i) => (
                            <a key={i} href={img} target="_blank" rel="noreferrer" style={{ aspectRatio:"1", display:"block", borderRadius:"var(--radius-md)", overflow:"hidden", background:"var(--bg)", border:"1px solid var(--border)" }}>
                              <img src={img} alt={`Gallery-${i}`} style={{ width:"100%", height:"100%", objectFit:"cover", transition:"transform 0.3s" }}
                                onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.05)"}
                                onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
                              />
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div style={{ padding:"3rem", textAlign:"center", color:"var(--muted)", fontSize:"0.875rem" }}>
                  Lỗi: Không tìm thấy dữ liệu hồ sơ này.
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div style={{
              padding:"1rem 1.5rem",
              borderTop:"1px solid var(--border)",
              background:"var(--bg)",
              display:"flex", justifyContent:"flex-end",
              flexShrink:0,
            }}>
              <button
                onClick={() => setShopModalOpen(false)}
                className="btn btn-ghost"
                style={{ fontSize:"0.875rem", cursor:"pointer" }}
              >
                Đóng lại
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}