"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Search, X, Star, MessageSquare, ArrowRight, SlidersHorizontal, Mail } from "lucide-react";
import InviteCastingModal from "#/components/campaigns/InviteCastingModal";

// List of available categories for filter chips
const STATIC_STYLES = [
  { name: "Food Review" },
  { name: "Model" },
  { name: "Beauty" },
  { name: "Tech" },
  { name: "Travel" },
];

function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const q = searchParams.get("q") || "";
  const style = searchParams.get("style") || "";

  // State để lưu Creator đang được chọn mời casting
  const [inviteCreator, setInviteCreator] = useState(null);
  const [creators, setCreators] = useState([]);
  const [loading, setLoading] = useState(true);
  const [inputValue, setInputValue] = useState(q);

  // Sync input value with URL search param changes
  useEffect(() => {
    setInputValue(q);
  }, [q]);

  // Debounced search input that updates the URL query parameter
  useEffect(() => {
    const handler = setTimeout(() => {
      const params = new URLSearchParams();
      if (inputValue.trim()) {
        params.set("q", inputValue.trim());
      }
      if (style) {
        params.set("style", style);
      }
      router.replace(`/search-creator?${params.toString()}`, { scroll: false });
    }, 300);

    return () => clearTimeout(handler);
  }, [inputValue, router, style]);

  // Fetch results when URL query parameters change
  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams();
        if (q) queryParams.append("q", q);
        if (style) queryParams.append("style", style);

        const res = await fetch(`/api/creators/search?${queryParams.toString()}`);
        const result = await res.json();

        if (result.success) {
          setCreators(result.data);
        }
      } catch (error) {
        console.error("Lỗi khi tìm kiếm:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [q, style]);

  // Handlers for interactive actions
  const handleStyleSelect = (selectedStyle) => {
    const params = new URLSearchParams();
    if (inputValue.trim()) params.set("q", inputValue.trim());
    if (selectedStyle) params.set("style", selectedStyle);
    router.replace(`/search-creator?${params.toString()}`, { scroll: false });
  };

  const handleClearFilters = () => {
    setInputValue("");
    router.replace("/search-creator", { scroll: false });
  };

  return (
    <div className="landing-light w-full flex flex-col gap-8 animate-fade-in" style={{
      animation: "fadeIn 0.5s ease",
      fontFamily: "var(--font-body)",
      color: "var(--charcoal)",
    }}>

      {/* ── HEADER BANNER ── */}
      <section style={{
        position: "relative",
        backgroundImage: "url('/hello.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        border: "1px solid rgba(0, 0, 0, 0.08)",
        borderRadius: "24px",
        padding: "3rem 2.5rem",
        overflow: "hidden",
        boxShadow: "0 12px 32px rgba(120, 140, 180, 0.06)",
        display: "flex",
        flexDirection: "column",
        gap: "0.75rem",
      }}>
        <div style={{ position: "relative", zIndex: 2, display: "flex", flexDirection: "column", gap: "0.5rem" }}>
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
            <SlidersHorizontal size={12} />
            <span>Khám phá cộng đồng</span>
          </div>

          <h1 style={{
            fontFamily: "var(--font-heading)",
            fontSize: "2.25rem",
            fontWeight: 850,
            color: "var(--charcoal)",
            letterSpacing: "-0.02em",
            margin: "0.25rem 0 0.5rem 0"
          }}>
            Tìm kiếm & Kết nối KOL/KOC
          </h1>

          <p style={{
            fontSize: "0.9375rem",
            color: "var(--ash)",
            maxWidth: "600px",
            lineHeight: 1.6,
            fontWeight: 500,
            margin: 0
          }}>
            Sử dụng thanh tìm kiếm và bộ lọc để khám phá các nhà sáng tạo nội dung phù hợp với phong cách và định hướng thương hiệu của bạn.
          </p>
        </div>
      </section>

      {/* ── SEARCH & CHIPS BAR ── */}
      <div style={{
        background: "rgba(255, 255, 255, 0.35)",
        backdropFilter: "blur(14px) saturate(140%)",
        WebkitBackdropFilter: "blur(14px) saturate(140%)",
        border: "1px solid rgba(255, 255, 255, 0.5)",
        borderRadius: "24px",
        padding: "1.5rem",
        boxShadow: "0 8px 32px rgba(120, 140, 180, 0.06)",
        display: "flex",
        flexDirection: "column",
        gap: "1.25rem",
      }}>
        {/* Search input container */}
        <div style={{
          display: "flex",
          alignItems: "center",
          background: "rgba(255, 255, 255, 0.65)",
          border: "1.5px solid rgba(37, 99, 235, 0.15)",
          borderRadius: "var(--radius-md)",
          padding: "0.75rem 1.25rem",
          gap: "0.75rem",
          boxShadow: "var(--shadow-sm)",
          transition: "all 0.2s ease-in-out",
        }}
          onFocusCapture={(e) => {
            e.currentTarget.style.borderColor = "#2563eb";
            e.currentTarget.style.boxShadow = "var(--electric-glow)";
            e.currentTarget.style.background = "#ffffff";
          }}
          onBlurCapture={(e) => {
            if (!e.currentTarget.contains(e.relatedTarget)) {
              e.currentTarget.style.borderColor = "rgba(37, 99, 235, 0.15)";
              e.currentTarget.style.boxShadow = "var(--shadow-sm)";
              e.currentTarget.style.background = "rgba(255, 255, 255, 0.65)";
            }
          }}
        >
          <Search size={18} color="var(--ash)" strokeWidth={2.5} />
          <input
            type="text"
            placeholder="Nhập tên KOL, KOC hoặc từ khoá cần tìm..."
            style={{
              background: "transparent",
              border: "none",
              outline: "none",
              fontSize: "0.9375rem",
              color: "var(--charcoal)",
              width: "100%",
              fontFamily: "var(--font-body)",
              fontWeight: 500,
            }}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
          {inputValue && (
            <button
              onClick={() => setInputValue("")}
              style={{
                background: "rgba(0,0,0,0.04)",
                border: "none",
                borderRadius: "50%",
                width: "20px",
                height: "20px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                color: "var(--ash)",
                padding: 0,
                transition: "background 0.2s",
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = "rgba(0,0,0,0.08)"}
              onMouseLeave={(e) => e.currentTarget.style.background = "rgba(0,0,0,0.04)"}
            >
              <X size={12} strokeWidth={3} />
            </button>
          )}
        </div>

        {/* Filter chips */}
        <div style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          gap: "0.625rem",
        }}>
          <span style={{
            fontSize: "0.8125rem",
            fontWeight: 700,
            color: "var(--ash)",
            marginRight: "0.25rem",
            textTransform: "uppercase",
            letterSpacing: "0.05em",
          }}>Phong cách:</span>

          <button
            onClick={() => handleStyleSelect("")}
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "0.8125rem",
              fontWeight: style === "" ? 700 : 600,
              padding: "0.45rem 1.15rem",
              borderRadius: "99px",
              cursor: "pointer",
              transition: "all 0.2s ease",
              border: style === "" ? "1.5px solid #2563eb" : "1.5px solid rgba(0,0,0,0.05)",
              background: style === "" ? "rgba(37, 99, 235, 0.08)" : "rgba(255, 255, 255, 0.55)",
              color: style === "" ? "#2563eb" : "var(--ash)",
            }}
            onMouseEnter={(e) => {
              if (style !== "") {
                e.currentTarget.style.background = "rgba(255, 255, 255, 0.85)";
                e.currentTarget.style.borderColor = "rgba(37, 99, 235, 0.2)";
              }
            }}
            onMouseLeave={(e) => {
              if (style !== "") {
                e.currentTarget.style.background = "rgba(255, 255, 255, 0.55)";
                e.currentTarget.style.borderColor = "rgba(0,0,0,0.05)";
              }
            }}
          >
            🔥 Tất cả
          </button>

          {STATIC_STYLES.map((item) => {
            const active = style === item.name;
            return (
              <button
                key={item.name}
                onClick={() => handleStyleSelect(item.name)}
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "0.8125rem",
                  fontWeight: active ? 700 : 600,
                  padding: "0.45rem 1.15rem",
                  borderRadius: "99px",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  border: active ? "1.5px solid #2563eb" : "1.5px solid rgba(0,0,0,0.05)",
                  background: active ? "rgba(37, 99, 235, 0.08)" : "rgba(255, 255, 255, 0.55)",
                  color: active ? "#2563eb" : "var(--ash)",
                }}
                onMouseEnter={(e) => {
                  if (!active) {
                    e.currentTarget.style.background = "rgba(255, 255, 255, 0.85)";
                    e.currentTarget.style.borderColor = "rgba(37, 99, 235, 0.2)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!active) {
                    e.currentTarget.style.background = "rgba(255, 255, 255, 0.55)";
                    e.currentTarget.style.borderColor = "rgba(0,0,0,0.05)";
                  }
                }}
              >
                {item.name}
              </button>
            );
          })}

          {(inputValue || style) && (
            <button
              onClick={handleClearFilters}
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "0.8125rem",
                fontWeight: 700,
                color: "#ef4444",
                background: "rgba(239, 68, 68, 0.06)",
                border: "1.5px solid rgba(239, 68, 68, 0.15)",
                padding: "0.45rem 1.15rem",
                borderRadius: "99px",
                cursor: "pointer",
                marginLeft: "auto",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(239, 68, 68, 0.1)";
                e.currentTarget.style.borderColor = "#ef4444";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(239, 68, 68, 0.06)";
                e.currentTarget.style.borderColor = "rgba(239, 68, 68, 0.15)";
              }}
            >
              Đặt lại bộ lọc
            </button>
          )}
        </div>
      </div>

      {/* ── RESULTS SECTION ── */}
      {loading ? (
        <div style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "6rem 0",
          background: "rgba(255,255,255,0.2)",
          borderRadius: "24px",
          border: "1px dashed rgba(0,0,0,0.08)",
        }}>
          <div style={{
            width: "36px",
            height: "36px",
            border: "3.5px solid #2563eb",
            borderTopColor: "transparent",
            borderRadius: "50%",
            animation: "spin 0.8s linear infinite",
            marginBottom: "1rem"
          }} />
          <p style={{ fontSize: "0.875rem", color: "var(--ash)", fontWeight: 600 }}>Đang cập nhật danh sách KOL...</p>
        </div>
      ) : creators.length > 0 ? (
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
          gap: "1.5rem"
        }}>
          {creators.map((creator) => (
            <div
              key={creator.id}
              className="card-hover-effect"
              style={{
                background: "rgba(255, 255, 255, 0.55)",
                backdropFilter: "blur(12px)",
                WebkitBackdropFilter: "blur(12px)",
                border: "1px solid rgba(255, 255, 255, 0.6)",
                borderRadius: "24px",
                padding: "1.5rem",
                boxShadow: "0 8px 24px rgba(120, 140, 180, 0.04)",
                display: "flex",
                flexDirection: "column",
                gap: "1rem",
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                position: "relative",
              }}
            >
              {/* Header row of card (Avatar + Name & Rating) */}
              <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
                {/* Avatar container */}
                <div style={{ position: "relative", flexShrink: 0 }}>
                  <div style={{
                    width: "72px",
                    height: "72px",
                    borderRadius: "50%",
                    overflow: "hidden",
                    background: "rgba(124, 58, 237, 0.08)",
                    border: "2px solid #ffffff",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "1.5rem",
                    fontWeight: 800,
                    color: "#7c3aed",
                  }}>
                    {creator.avatar && creator.avatar.length > 1 ? (
                      <img src={creator.avatar} alt={creator.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    ) : (
                      creator.avatar
                    )}
                  </div>
                  {/* Status dot */}
                  <div style={{
                    position: "absolute",
                    bottom: "2px",
                    right: "2px",
                    width: "12px",
                    height: "12px",
                    backgroundColor: "#10b981",
                    border: "2px solid #ffffff",
                    borderRadius: "50%",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
                  }} />
                </div>

                {/* Name, rating & location */}
                <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
                  <h3 style={{
                    fontFamily: "var(--font-heading)",
                    fontSize: "1.2rem",
                    fontWeight: 800,
                    color: "var(--charcoal)",
                    margin: 0,
                    lineHeight: 1.2
                  }}>
                    {creator.name}
                  </h3>

                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    {creator.averageRating > 0 ? (
                      <div style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.25rem",
                        background: "rgba(245, 158, 11, 0.08)",
                        padding: "0.15rem 0.5rem",
                        borderRadius: "6px",
                        border: "1.5px solid rgba(245, 158, 11, 0.15)",
                      }}>
                        <Star size={11} fill="#f59e0b" color="#f59e0b" />
                        <span style={{ fontSize: "0.75rem", fontWeight: 800, color: "#d97706" }}>{creator.averageRating}</span>
                        <span style={{ fontSize: "0.7rem", color: "#b45309", opacity: 0.85 }}>({creator.reviewCount})</span>
                      </div>
                    ) : (
                      <span style={{ fontSize: "0.75rem", color: "var(--ash)", fontWeight: 500 }}>Chưa có đánh giá</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Styles tags section */}
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.375rem" }}>
                {creator.styles && creator.styles.length > 0 ? (
                  creator.styles.map((s, idx) => (
                    <span
                      key={idx}
                      style={{
                        fontSize: "0.6875rem",
                        fontWeight: 700,
                        textTransform: "uppercase",
                        letterSpacing: "0.04em",
                        background: "rgba(37, 99, 235, 0.06)",
                        color: "#2563eb",
                        padding: "0.25rem 0.625rem",
                        borderRadius: "99px",
                        border: "1px solid rgba(37, 99, 235, 0.1)",
                      }}
                    >
                      {s}
                    </span>
                  ))
                ) : (
                  <span style={{ fontSize: "0.75rem", color: "var(--ash)", fontStyle: "italic" }}>
                    Chưa cập nhật phong cách
                  </span>
                )}
              </div>

              {/* Bio snippet */}
              <p style={{
                fontSize: "0.8125rem",
                color: "var(--ash)",
                lineHeight: 1.5,
                margin: 0,
                fontWeight: 500,
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
                textOverflow: "ellipsis",
                minHeight: "2.4rem",
              }}>
                {creator.bio || "Creator này chưa cập nhật mô tả bản thân. Hãy nhấp để xem chi tiết hơn."}
              </p>

              {/* Footer row with Action Buttons */}
              <div style={{
                display: "flex",
                gap: "0.75rem",
                marginTop: "auto",
                paddingTop: "0.75rem",
                borderTop: "1.5px solid rgba(0,0,0,0.03)"
              }}>
                <button
                  onClick={() => setInviteCreator(creator)}
                  style={{
                    flex: 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "0.375rem",
                    fontFamily: "var(--font-body)",
                    fontSize: "0.8125rem",
                    fontWeight: 700,
                    color: "var(--charcoal)",
                    background: "rgba(255,255,255,0.7)",
                    border: "1.5px solid rgba(0,0,0,0.06)",
                    borderRadius: "12px",
                    padding: "0.55rem 0",
                    transition: "all 0.15s ease",
                    cursor: "pointer"
                  }}
                  className="btn-light-action"
                >
                  <Mail size={13} />
                  Mời casting
                </button>

                <Link
                  href={`/creator/${creator.id}`}
                  style={{
                    flex: 1.2,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "0.375rem",
                    fontFamily: "var(--font-body)",
                    fontSize: "0.8125rem",
                    fontWeight: 700,
                    textDecoration: "none",
                    color: "#ffffff",
                    background: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
                    borderRadius: "12px",
                    padding: "0.55rem 0",
                    transition: "all 0.15s ease",
                    boxShadow: "0 4px 12px rgba(37, 99, 235, 0.15)",
                  }}
                  className="btn-primary-action"
                >
                  Hồ sơ
                  <ArrowRight size={13} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{
          background: "rgba(255, 255, 255, 0.45)",
          backdropFilter: "blur(14px)",
          WebkitBackdropFilter: "blur(14px)",
          border: "1px solid rgba(255, 255, 255, 0.5)",
          borderRadius: "24px",
          padding: "4rem 2rem",
          textAlign: "center",
          boxShadow: "0 8px 32px rgba(120, 140, 180, 0.05)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}>
          <span style={{ fontSize: "3.5rem", marginBottom: "1rem" }}>🔍</span>
          <h3 style={{
            fontFamily: "var(--font-heading)",
            fontSize: "1.35rem",
            fontWeight: 800,
            color: "var(--charcoal)",
            marginBottom: "0.5rem"
          }}>
            Không tìm thấy Creator nào
          </h3>
          <p style={{
            fontSize: "0.875rem",
            color: "var(--ash)",
            maxWidth: "400px",
            lineHeight: 1.6,
            fontWeight: 500,
            margin: "0 0 1.5rem 0"
          }}>
            Rất tiếc, chúng tôi không tìm thấy KOL/KOC nào phù hợp với yêu cầu tìm kiếm của bạn. Hãy thử dùng từ khoá khác hoặc xoá bộ lọc.
          </p>
          <button
            onClick={handleClearFilters}
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "0.8125rem",
              fontWeight: 700,
              color: "#ffffff",
              background: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
              border: "none",
              borderRadius: "12px",
              padding: "0.75rem 1.5rem",
              boxShadow: "0 4px 12px rgba(37, 99, 235, 0.15)",
              cursor: "pointer",
              transition: "all 0.2s",
            }}
          >
            Khám phá tất cả Creator
          </button>
        </div>
      )}

      {/* Global component styling (injecting styles into page head for hover micro-animations) */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        .card-hover-effect:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 32px rgba(120, 140, 180, 0.12) !important;
          border-color: rgba(37, 99, 235, 0.2) !important;
        }
        .btn-light-action:hover {
          background: rgba(255, 255, 255, 0.95) !important;
          border-color: rgba(0, 0, 0, 0.15) !important;
        }
        .btn-primary-action:hover {
          background: linear-gradient(135deg, #1d4ed8 0%, #1e40af 100%) !important;
          box-shadow: 0 6px 16px rgba(37, 99, 235, 0.25) !important;
        }
      `}</style>

      <InviteCastingModal
        isOpen={!!inviteCreator}
        onClose={() => setInviteCreator(null)}
        creatorId={inviteCreator?.id}
        creatorName={inviteCreator?.name}
      />
    </div>
  );
}

export default function SearchCreatorPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center py-20">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    }>
      <SearchContent />
    </Suspense>
  );
}
