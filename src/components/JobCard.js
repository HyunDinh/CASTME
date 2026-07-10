import React from "react";
import { updateJobStatus } from "#/app/(shop)/my-casting/actions";
import { Store, Rocket, Eye, Zap } from "lucide-react";

/* Status config */
const STATUS_CONFIG = {
  RECRUITING: { label: "Đang tuyển", color: "var(--success)", bg: "var(--success-light)", dot: true },
  IN_PROGRESS: { label: "Đang thực hiện", color: "var(--primary)", bg: "var(--primary-light)", dot: true },
  COMPLETED: { label: "Đã kết thúc", color: "var(--muted)", bg: "#F1F5F9", dot: false },
  DRAFT: { label: "Bản nháp", color: "var(--warning)", bg: "var(--warning-light)", dot: false },
};

export default function JobCard({ job, role = "koc", onAction, actionLabel, onRefresh }) {
  const isShop = role === "shop";
  const statusKey = job.status?.toUpperCase();
  const statusCfg = STATUS_CONFIG[statusKey] || { label: job.status, color: "var(--muted)", bg: "#F1F5F9", dot: false };

  const handlePublish = async (e) => {
    e.stopPropagation();
    const result = await updateJobStatus(job.id, "RECRUITING");
    if (result.success && onRefresh) onRefresh();
  };

  return (
    <div style={{
      background: isShop ? "white" : "var(--surface)",
      border: "1px solid var(--border)",
      borderRadius: "var(--radius-lg)",
      padding: "1.375rem 1.5rem",
      display: "flex",
      gap: "1.25rem",
      alignItems: "flex-start",
      transition: "transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease",
      boxShadow: "var(--shadow-sm)",
    }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-2px)";
        e.currentTarget.style.boxShadow = "var(--shadow-md)";
        e.currentTarget.style.borderColor = "var(--primary-muted)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "none";
        e.currentTarget.style.boxShadow = "var(--shadow-sm)";
        e.currentTarget.style.borderColor = "var(--border)";
      }}
    >
      {/* Icon avatar */}
      <div style={{
        width: "44px", height: "44px", flexShrink: 0,
        background: isShop
          ? `linear-gradient(135deg, ${statusCfg.bg} 0%, ${statusCfg.color}18 100%)`
          : "linear-gradient(135deg, var(--primary-light), var(--rose-light))",
        borderRadius: "var(--radius-md)",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: "1.1rem", fontWeight: 800,
        color: isShop ? statusCfg.color : "var(--primary)",
        border: `1px solid ${isShop ? statusCfg.color : "var(--primary-muted)"}30`,
      }}>
        {isShop ? "📋" : (job.shopName?.[0] || "S")}
      </div>

      {/* Content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        {/* Badges row */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginBottom: "0.5rem", alignItems: "center" }}>
          {isShop ? (
            <span style={{
              display: "inline-flex", alignItems: "center", gap: "0.375rem",
              fontSize: "0.75rem", fontWeight: 700,
              padding: "0.2rem 0.625rem",
              background: statusCfg.bg,
              color: statusCfg.color,
              borderRadius: "var(--radius-full)",
              border: `1px solid ${statusCfg.color}30`,
            }}>
              {statusCfg.dot && (
                <span style={{
                  width: "6px", height: "6px",
                  borderRadius: "50%",
                  background: statusCfg.color,
                  animation: statusKey === "RECRUITING" || statusKey === "IN_PROGRESS" ? "pulseSlow 1.5s ease-in-out infinite" : "none",
                  flexShrink: 0,
                }} />
              )}
              {statusCfg.label}
            </span>
          ) : (
            <span style={{
              display: "inline-flex", alignItems: "center", gap: "0.25rem",
              fontSize: "0.75rem", fontWeight: 600,
              padding: "0.2rem 0.625rem",
              background: "var(--bg)",
              color: "var(--muted)",
              borderRadius: "var(--radius-full)",
              border: "1px solid var(--border)",
            }}>
              <Store size={11} strokeWidth={2} />
              {job.shopName}
            </span>
          )}

          {!isShop && job.matchRate && (
            <span style={{
              display: "inline-flex", alignItems: "center", gap: "3px",
              fontSize: "0.75rem", fontWeight: 800,
              padding: "0.2rem 0.625rem",
              background: job.matchRate >= 85 ? "var(--success-light)" : "var(--primary-light)",
              color: job.matchRate >= 85 ? "var(--success)" : "var(--primary)",
              borderRadius: "var(--radius-full)",
              border: `1px solid ${job.matchRate >= 85 ? "var(--success)" : "var(--primary)"}20`,
            }}>
              🎯 {job.matchRate}% Phù hợp
            </span>
          )}
        </div>

        <h3 style={{
          fontFamily: "var(--font-heading)",
          fontSize: "1rem",
          fontWeight: 800,
          color: "var(--slate)",
          marginBottom: "0.375rem",
          lineHeight: 1.35,
        }}>
          {job.title}
        </h3>
        <p style={{
          fontSize: "0.875rem",
          color: "var(--muted)",
          lineHeight: 1.65,
          marginBottom: "0.75rem",
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
        }}>
          {job.description}
        </p>

        {/* Vibe Tags */}
        {job.vibeTags?.length > 0 && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.375rem" }}>
            {job.vibeTags.map((tag) => (
              <span key={tag} style={{
                fontSize: "0.6875rem",
                fontWeight: 600,
                padding: "0.2rem 0.625rem",
                background: "var(--primary-light)",
                color: "var(--primary)",
                borderRadius: "var(--radius-full)",
                border: "1px solid var(--primary-muted)",
              }}>#{tag}</span>
            ))}
          </div>
        )}
      </div>

      {/* Right: Budget + Actions */}
      <div style={{
        flexShrink: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-end",
        justifyContent: "space-between",
        gap: "0.875rem",
        minWidth: "150px",
      }}>
        <div style={{ textAlign: "right" }}>
          <span style={{ display: "block", fontSize: "0.625rem", fontWeight: 700, color: "var(--subtle)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "0.2rem" }}>
            Thù lao
          </span>
          <span style={{ fontFamily: "var(--font-heading)", fontSize: "1.125rem", fontWeight: 800, color: "var(--primary)" }}>
            {job.budget}
          </span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", width: "100%" }}>
          {/* Publish DRAFT */}
          {isShop && statusKey === "DRAFT" && (
            <button
              onClick={handlePublish}
              style={{
                display: "flex", alignItems: "center", justifyContent: "center", gap: "0.375rem",
                padding: "0.5625rem 1rem",
                background: "linear-gradient(135deg, var(--success), #059669)",
                color: "white", fontWeight: 700, fontSize: "0.8125rem",
                border: "none", borderRadius: "var(--radius-md)",
                cursor: "pointer", width: "100%",
                transition: "opacity 0.2s",
                boxShadow: "0 2px 8px rgba(16,185,129,0.30)",
              }}
              onMouseEnter={(e) => e.currentTarget.style.opacity = "0.9"}
              onMouseLeave={(e) => e.currentTarget.style.opacity = "1"}
            >
              <Rocket size={14} />
              Đăng tuyển ngay
            </button>
          )}

          {/* View Applicants */}
          {isShop && statusKey !== "DRAFT" && (
            <button
              onClick={() => onAction && onAction(job)}
              style={{
                display: "flex", alignItems: "center", justifyContent: "center", gap: "0.375rem",
                padding: "0.5625rem 1rem",
                background: "var(--slate)",
                color: "white", fontWeight: 700, fontSize: "0.8125rem",
                border: "none", borderRadius: "var(--radius-md)",
                cursor: "pointer", width: "100%",
                transition: "opacity 0.2s",
              }}
              onMouseEnter={(e) => e.currentTarget.style.opacity = "0.85"}
              onMouseLeave={(e) => e.currentTarget.style.opacity = "1"}
            >
              <Eye size={14} />
              {actionLabel || "Xem ứng viên"}
            </button>
          )}

          {/* Connect (KOC) */}
          {!isShop && (
            <button
              onClick={() => onAction && onAction(job.id)}
              style={{
                display: "flex", alignItems: "center", justifyContent: "center", gap: "0.375rem",
                padding: "0.5625rem 1rem",
                background: "linear-gradient(135deg, var(--primary), #9333EA)",
                color: "white", fontWeight: 700, fontSize: "0.8125rem",
                border: "none", borderRadius: "var(--radius-md)",
                cursor: "pointer", width: "100%",
                transition: "opacity 0.2s",
                boxShadow: "0 2px 8px rgba(124,58,237,0.30)",
              }}
              onMouseEnter={(e) => e.currentTarget.style.opacity = "0.9"}
              onMouseLeave={(e) => e.currentTarget.style.opacity = "1"}
            >
              <Zap size={14} />
              {actionLabel || "Gửi Connect"}
              {job.heartsRequired && <span style={{ fontSize: "0.6875rem", opacity: 0.8 }}>({job.heartsRequired}❤️)</span>}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}