// src/app/(landing)/page.js
import Link from "next/link";

/* ── Tiny inline-safe stat for hero ── */
function StatPill({ value, label }) {
  return (
    <div style={{
      textAlign: "center",
      padding: "0.75rem 1.25rem",
      background: "rgba(255,255,255,0.70)",
      backdropFilter: "blur(12px)",
      border: "1px solid rgba(226,232,240,0.8)",
      borderRadius: "var(--radius-lg)",
      minWidth: "100px",
    }}>
      <div style={{ fontFamily: "var(--font-heading)", fontSize: "1.375rem", fontWeight: 800, color: "var(--primary)" }}>{value}</div>
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
        background: "var(--primary-light)",
        borderRadius: "50%",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: "0.6875rem",
        color: "var(--primary)",
        fontWeight: 700,
        marginTop: "1px",
      }}>✓</span>
      <span style={{ fontSize: "0.9rem", color: "var(--muted)", lineHeight: 1.55 }}>{children}</span>
    </li>
  );
}

/* ── Pricing Card ── */
function PricingCard({ tier, price, desc, features, cta, ctaHref, highlight }) {
  return (
    <div style={{
      background: highlight ? "linear-gradient(160deg, var(--primary) 0%, #9333EA 100%)" : "var(--surface)",
      border: highlight ? "none" : "1.5px solid var(--border)",
      borderRadius: "var(--radius-xl)",
      padding: "2rem 1.75rem",
      position: "relative",
      boxShadow: highlight ? "0 20px 60px -10px rgba(124,58,237,0.45)" : "var(--shadow-sm)",
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
          background: "linear-gradient(90deg, var(--rose) 0%, #9333EA 100%)",
          color: "white",
          fontSize: "0.6875rem",
          fontWeight: 800,
          padding: "0.25rem 0.875rem",
          borderRadius: "var(--radius-full)",
          letterSpacing: "0.06em",
          textTransform: "uppercase",
          boxShadow: "0 4px 12px rgba(244,63,142,0.40)",
        }}>
          ⭐ Phổ biến nhất
        </div>
      )}
      <div style={{ marginBottom: "1.5rem" }}>
        <h3 style={{
          fontFamily: "var(--font-heading)",
          fontSize: "1rem",
          fontWeight: 700,
          color: highlight ? "rgba(255,255,255,0.80)" : "var(--muted)",
          marginBottom: "0.5rem",
        }}>{tier}</h3>
        <div style={{ display: "flex", alignItems: "baseline", gap: "0.25rem", marginBottom: "0.5rem" }}>
          <span style={{
            fontFamily: "var(--font-heading)",
            fontSize: "2.5rem",
            fontWeight: 800,
            color: highlight ? "white" : "var(--slate)",
          }}>{price}</span>
          <span style={{ fontSize: "0.875rem", color: highlight ? "rgba(255,255,255,0.60)" : "var(--muted)" }}>/gói</span>
        </div>
        <p style={{ fontSize: "0.8125rem", color: highlight ? "rgba(255,255,255,0.65)" : "var(--muted)", lineHeight: 1.5 }}>{desc}</p>
      </div>

      <ul style={{ listStyle: "none", padding: 0, margin: "0 0 1.75rem", flex: 1 }}>
        {features.map((f, i) => (
          <li key={i} style={{
            display: "flex", alignItems: "flex-start", gap: "0.625rem",
            marginBottom: "0.625rem",
            fontSize: "0.875rem",
            color: highlight ? "rgba(255,255,255,0.85)" : "var(--muted)",
          }}>
            <span style={{
              flexShrink: 0,
              width: "18px", height: "18px",
              background: highlight ? "rgba(255,255,255,0.20)" : "var(--primary-light)",
              borderRadius: "50%",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "0.6rem",
              color: highlight ? "white" : "var(--primary)",
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
        background: highlight ? "white" : "var(--primary)",
        color: highlight ? "var(--primary)" : "white",
        boxShadow: highlight ? "none" : "0 4px 14px rgba(124,58,237,0.30)",
      }}>
        {cta}
      </Link>
    </div>
  );
}

export default function LandingPage() {
  return (
    <div>
      {/* ═══════════════════════════════════════════════
          1. HERO SECTION
      ═══════════════════════════════════════════════ */}
      <section style={{
        position: "relative",
        padding: "5rem 1.5rem 6rem",
        overflow: "hidden",
        textAlign: "center",
      }}>
        {/* Mesh background */}
        <div style={{
          position: "absolute", inset: 0,
          background: `
            radial-gradient(ellipse 60% 50% at 50% -10%, rgba(124,58,237,0.15) 0%, transparent 70%),
            radial-gradient(ellipse 40% 35% at 80% 60%, rgba(244,63,142,0.08) 0%, transparent 65%),
            radial-gradient(ellipse 30% 25% at 10% 80%, rgba(124,58,237,0.06) 0%, transparent 60%)
          `,
          pointerEvents: "none",
        }} />

        <div style={{ position: "relative", maxWidth: "860px", margin: "0 auto" }}>
          {/* Tag badge */}
          <div className="animate-fade-up" style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
            padding: "0.375rem 1rem",
            background: "var(--primary-light)",
            border: "1px solid var(--primary-muted)",
            borderRadius: "var(--radius-full)",
            fontSize: "0.75rem",
            fontWeight: 700,
            color: "var(--primary)",
            marginBottom: "1.75rem",
            letterSpacing: "0.01em",
          }}>
            <span style={{
              width: "6px", height: "6px",
              background: "var(--rose)",
              borderRadius: "50%",
              animation: "pulseSlow 2s ease-in-out infinite",
              display: "inline-block",
            }} />
            ✨ AI Matching đầu tiên tại Việt Nam
          </div>

          {/* Headline */}
          <h1 className="animate-fade-up delay-100" style={{
            fontFamily: "var(--font-heading)",
            fontSize: "clamp(2.25rem, 5.5vw, 4rem)",
            fontWeight: 800,
            lineHeight: 1.1,
            letterSpacing: "-0.03em",
            color: "var(--slate)",
            marginBottom: "1.5rem",
          }}>
            Kết nối{" "}
            <span className="gradient-text">Shop & KOL/KOC</span>
            <br />
            chuẩn xác theo{" "}
            <span style={{
              position: "relative",
              display: "inline-block",
            }}>
              &ldquo;Vibe&rdquo; của bạn
              <svg style={{ position: "absolute", bottom: "-6px", left: 0, width: "100%", height: "8px" }} viewBox="0 0 200 8" preserveAspectRatio="none">
                <path d="M0 6 Q50 0 100 5 Q150 10 200 4" stroke="var(--rose)" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
              </svg>
            </span>
          </h1>

          {/* Sub */}
          <p className="animate-fade-up delay-200" style={{
            fontSize: "clamp(1rem, 2vw, 1.1875rem)",
            color: "var(--muted)",
            lineHeight: 1.7,
            maxWidth: "600px",
            margin: "0 auto 2.5rem",
          }}>
            Nền tảng đầu tiên ứng dụng AI tự động đọc hiểu bài tuyển dụng, quét phong cách cá nhân để gợi ý công việc phù hợp với tỷ lệ khớp lên tới <strong style={{ color: "var(--primary)" }}>99%</strong>.
          </p>

          {/* CTAs */}
          <div className="animate-fade-up delay-300" style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "1rem",
            justifyContent: "center",
            marginBottom: "3.5rem",
          }}>
            <Link href="/register" className="btn btn-primary" style={{ fontSize: "1rem", padding: "0.875rem 2rem" }}>
              Bắt đầu 1 tháng miễn phí →
            </Link>
            <a href="#features" className="btn btn-ghost" style={{ fontSize: "1rem", padding: "0.875rem 2rem" }}>
              Xem tính năng
            </a>
          </div>

          {/* Stats */}
          <div className="animate-fade-up delay-400" style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "0.75rem",
            justifyContent: "center",
          }}>
            <StatPill value="500+" label="Creators đã tham gia" />
            <StatPill value="98%" label="Tỷ lệ khớp AI" />
            <StatPill value="200+" label="Shop & Nhãn hàng" />
            <StatPill value="0đ" label="1 tháng dùng thử" />
          </div>
        </div>

        {/* Floating AI match card */}
        <div className="animate-fade-up delay-500" style={{
          maxWidth: "560px",
          margin: "4rem auto 0",
          position: "relative",
        }}>
          <div style={{
            background: "linear-gradient(145deg, #1E0845 0%, #4C1D95 50%, #7C1F5A 100%)",
            borderRadius: "var(--radius-xl)",
            padding: "1.5rem",
            boxShadow: "0 32px 80px -12px rgba(124,58,237,0.50), 0 0 0 1px rgba(255,255,255,0.08) inset",
            position: "relative",
            overflow: "hidden",
          }}>
            <div style={{
              position: "absolute", top: "-60px", right: "-60px",
              width: "200px", height: "200px",
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(244,63,142,0.25) 0%, transparent 70%)",
            }} />

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
              <span style={{ fontSize: "0.6875rem", color: "rgba(196,181,253,0.80)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em" }}>
                ⚡ AI Đang gợi ý ngay bây giờ
              </span>
              <span style={{
                background: "var(--success)",
                color: "white",
                fontSize: "0.625rem",
                fontWeight: 800,
                padding: "0.2rem 0.6rem",
                borderRadius: "var(--radius-full)",
                letterSpacing: "0.05em",
              }}>LIVE</span>
            </div>

            {/* Match cards inside */}
            {[
              { name: "Thảo Vy Review", vibe: "Minimalism · TikTok", followers: "125K", match: 98 },
              { name: "Khoa Style", vibe: "Streetwear · Instagram", followers: "89K", match: 95 },
            ].map((koc) => (
              <div key={koc.name} style={{
                background: "rgba(255,255,255,0.08)",
                border: "1px solid rgba(255,255,255,0.12)",
                borderRadius: "var(--radius-md)",
                padding: "0.875rem 1rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "0.625rem",
                backdropFilter: "blur(8px)",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                  <div style={{
                    width: "38px", height: "38px",
                    background: "linear-gradient(135deg, var(--primary-light), var(--rose-light))",
                    borderRadius: "50%",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "1.1rem",
                    border: "2px solid rgba(255,255,255,0.20)",
                  }}>
                    {koc.name[0]}
                  </div>
                  <div>
                    <div style={{ fontFamily: "var(--font-heading)", fontWeight: 700, color: "white", fontSize: "0.875rem" }}>{koc.name}</div>
                    <div style={{ fontSize: "0.6875rem", color: "rgba(196,181,253,0.80)" }}>{koc.vibe} · {koc.followers} followers</div>
                  </div>
                </div>
                <div style={{
                  background: "linear-gradient(135deg, var(--success) 0%, #059669 100%)",
                  color: "white",
                  fontWeight: 900,
                  fontSize: "0.75rem",
                  padding: "0.3rem 0.7rem",
                  borderRadius: "var(--radius-sm)",
                  boxShadow: "0 2px 8px rgba(16,185,129,0.40)",
                }}>
                  🎯 {koc.match}%
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          2. FEATURES SECTION
      ═══════════════════════════════════════════════ */}
      <section id="features" style={{ padding: "5rem 1.5rem", background: "var(--surface)" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
            <div className="badge badge-primary" style={{ marginBottom: "1rem" }}>MỘT NỀN TẢNG — HAI GIAO DIỆN</div>
            <h2 style={{
              fontFamily: "var(--font-heading)",
              fontSize: "clamp(1.75rem, 4vw, 2.5rem)",
              fontWeight: 800,
              color: "var(--slate)",
              letterSpacing: "-0.03em",
              marginBottom: "0.75rem",
            }}>
              Không gian riêng cho từng người dùng
            </h2>
            <p style={{ fontSize: "1rem", color: "var(--muted)", maxWidth: "500px", margin: "0 auto", lineHeight: 1.7 }}>
              Dù bạn là thương hiệu đi tìm gương mặt đại diện hay creator đi tìm job, Castme đều có giải pháp cho bạn.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "1.5rem" }}>
            {/* Shop Card */}
            <div className="card" style={{ padding: "2rem" }}>
              <div style={{
                width: "52px", height: "52px",
                background: "linear-gradient(135deg, var(--primary-light) 0%, rgba(124,58,237,0.15) 100%)",
                borderRadius: "var(--radius-md)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "1.5rem",
                marginBottom: "1.25rem",
                border: "1px solid var(--primary-muted)",
              }}>🏪</div>
              <h3 style={{
                fontFamily: "var(--font-heading)",
                fontSize: "1.25rem",
                fontWeight: 800,
                color: "var(--slate)",
                marginBottom: "0.375rem",
              }}>Dành cho Shop & Nhãn hàng</h3>
              <p style={{ fontSize: "0.875rem", color: "var(--muted)", marginBottom: "1.5rem", lineHeight: 1.6 }}>
                Tìm đúng creator cho chiến dịch của bạn — không cần mò mẫm, không cần lãng phí ngân sách.
              </p>
              <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                <CheckItem><strong>My Casting:</strong> Quản lý bài đăng tuyển dụng dễ dàng</CheckItem>
                <CheckItem><strong>Tìm kiếm theo Vibe:</strong> Bộ lọc thông minh thay vì tìm từ khóa khô khan</CheckItem>
                <CheckItem><strong>AI Matching:</strong> Tự động hiển thị danh sách người phù hợp</CheckItem>
                <CheckItem><strong>Recent Applications:</strong> Duyệt nhanh các creator vừa apply</CheckItem>
              </ul>
              <Link href="/register" style={{
                display: "inline-block",
                marginTop: "1.5rem",
                padding: "0.625rem 1.25rem",
                background: "var(--primary-light)",
                color: "var(--primary)",
                borderRadius: "var(--radius-full)",
                fontSize: "0.875rem",
                fontWeight: 700,
                textDecoration: "none",
                transition: "all 0.2s",
              }}>
                Đăng ký tài khoản Shop →
              </Link>
            </div>

            {/* Creator Card */}
            <div className="card" style={{ padding: "2rem" }}>
              <div style={{
                width: "52px", height: "52px",
                background: "linear-gradient(135deg, var(--rose-light) 0%, rgba(244,63,142,0.12) 100%)",
                borderRadius: "var(--radius-md)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "1.5rem",
                marginBottom: "1.25rem",
                border: "1px solid var(--rose-muted)",
              }}>📸</div>
              <h3 style={{
                fontFamily: "var(--font-heading)",
                fontSize: "1.25rem",
                fontWeight: 800,
                color: "var(--slate)",
                marginBottom: "0.375rem",
              }}>Dành cho KOC / KOL</h3>
              <p style={{ fontSize: "0.875rem", color: "var(--muted)", marginBottom: "1.5rem", lineHeight: 1.6 }}>
                Nhận công việc phù hợp với phong cách của bạn, không phải cố gắng hợp với mọi thứ.
              </p>
              <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                <CheckItem><strong>My Job:</strong> Theo dõi tiến độ các chiến dịch đã nhận</CheckItem>
                <CheckItem><strong>Portfolio & Feedback:</strong> Hồ sơ năng lực đẹp tích hợp đánh giá từ Brand</CheckItem>
                <CheckItem><strong>AI Matching:</strong> Gợi ý shop phù hợp với phong cách của bạn</CheckItem>
                <CheckItem><strong>Doanh thu minh bạch:</strong> Quản lý dòng tiền, rút tiền nhanh chóng</CheckItem>
              </ul>
              <Link href="/register" style={{
                display: "inline-block",
                marginTop: "1.5rem",
                padding: "0.625rem 1.25rem",
                background: "var(--rose-light)",
                color: "var(--rose)",
                borderRadius: "var(--radius-full)",
                fontSize: "0.875rem",
                fontWeight: 700,
                textDecoration: "none",
                transition: "all 0.2s",
              }}>
                Đăng ký tài khoản Creator →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          3. AI MATCHING SECTION
      ═══════════════════════════════════════════════ */}
      <section id="ai-matching" style={{ padding: "5rem 1.5rem", background: "var(--bg)" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "4rem", alignItems: "center" }}>
          <div>
            <div className="badge badge-primary" style={{ marginBottom: "1rem" }}>AI MATCHING ENGINE</div>
            <h2 style={{
              fontFamily: "var(--font-heading)",
              fontSize: "clamp(1.75rem, 4vw, 2.5rem)",
              fontWeight: 800,
              color: "var(--slate)",
              letterSpacing: "-0.03em",
              marginBottom: "1rem",
              lineHeight: 1.15,
            }}>
              Cơ chế AI Matching<br />
              <span className="gradient-text">hoạt động như thế nào?</span>
            </h2>
            <p style={{ color: "var(--muted)", lineHeight: 1.75, marginBottom: "1rem" }}>
              Mỗi khi KOL/KOC tạo tài khoản, hệ thống yêu cầu mô tả ngắn về phong cách, vibe chụp ảnh và tệp fan của bạn.
            </p>
            <p style={{ color: "var(--muted)", lineHeight: 1.75, marginBottom: "2rem" }}>
              Khi Shop đăng tuyển chiến dịch mới, AI sẽ <strong style={{ color: "var(--slate)" }}>tóm tắt và so khớp nội dung theo thời gian thực</strong>. Kết quả hiển thị trực quan bằng <strong style={{ color: "var(--primary)" }}>tỷ lệ % phù hợp</strong>.
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
                  background: "var(--primary-light)",
                  borderRadius: "var(--radius-md)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "1.1rem",
                  border: "1px solid var(--primary-muted)",
                }}>{step.icon}</div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: "0.9rem", color: "var(--slate)", marginBottom: "0.25rem" }}>{step.title}</div>
                  <div style={{ fontSize: "0.8125rem", color: "var(--muted)", lineHeight: 1.5 }}>{step.desc}</div>
                </div>
              </div>
            ))}
          </div>

          {/* AI Panel Visual */}
          <div style={{
            background: "linear-gradient(145deg, #0F0520 0%, #2D1060 50%, #4C1D95 100%)",
            borderRadius: "var(--radius-xl)",
            padding: "1.75rem",
            boxShadow: "0 32px 80px -12px rgba(124,58,237,0.50)",
            position: "relative",
            overflow: "hidden",
          }}>
            <div style={{
              position: "absolute",
              top: "-80px", left: "-80px",
              width: "250px", height: "250px",
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(124,58,237,0.30) 0%, transparent 70%)",
            }} />
            <div style={{
              position: "absolute",
              bottom: "-60px", right: "-60px",
              width: "200px", height: "200px",
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(244,63,142,0.20) 0%, transparent 70%)",
            }} />

            <div style={{ position: "relative" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
                <span style={{ fontSize: "0.6875rem", color: "var(--primary-muted)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em" }}>
                  Hệ thống đang gợi ý Job
                </span>
                <span style={{
                  background: "var(--success)",
                  color: "white",
                  fontSize: "0.625rem",
                  fontWeight: 800,
                  padding: "0.2rem 0.6rem",
                  borderRadius: "var(--radius-full)",
                }}>● ACTIVE</span>
              </div>

              <div style={{
                background: "rgba(255,255,255,0.07)",
                border: "1px solid rgba(255,255,255,0.12)",
                borderRadius: "var(--radius-lg)",
                padding: "1.25rem",
                marginBottom: "0.75rem",
                position: "relative",
              }}>
                <div style={{
                  position: "absolute", top: "0.875rem", right: "0.875rem",
                  background: "linear-gradient(135deg, var(--rose) 0%, #C2185B 100%)",
                  color: "white",
                  fontSize: "0.6875rem",
                  fontWeight: 800,
                  padding: "0.25rem 0.625rem",
                  borderRadius: "var(--radius-sm)",
                  boxShadow: "0 2px 8px rgba(244,63,142,0.50)",
                }}>🎯 96% Khớp Vibe</div>
                <h4 style={{ fontFamily: "var(--font-heading)", fontWeight: 700, color: "white", fontSize: "1rem", marginBottom: "0.25rem" }}>
                  BST Mùa Hè — Streetwear
                </h4>
                <p style={{ fontSize: "0.75rem", color: "rgba(196,181,253,0.80)", marginBottom: "0.875rem" }}>Shop: Savage Studio</p>
                <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                  {["Minimalist", "Cá tính", "GenZ"].map((tag) => (
                    <span key={tag} style={{
                      fontSize: "0.6875rem",
                      background: "rgba(255,255,255,0.10)",
                      color: "rgba(255,255,255,0.80)",
                      padding: "0.2rem 0.625rem",
                      borderRadius: "var(--radius-full)",
                      border: "1px solid rgba(255,255,255,0.10)",
                    }}>{tag}</span>
                  ))}
                </div>
              </div>

              {/* Score bar */}
              <div style={{ background: "rgba(255,255,255,0.06)", borderRadius: "var(--radius-md)", padding: "1rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                  <span style={{ fontSize: "0.75rem", color: "rgba(196,181,253,0.80)" }}>Mức độ phù hợp</span>
                  <span style={{ fontSize: "0.75rem", fontWeight: 800, color: "var(--success)" }}>Rất cao</span>
                </div>
                <div style={{ height: "6px", background: "rgba(255,255,255,0.10)", borderRadius: "999px", overflow: "hidden" }}>
                  <div style={{
                    height: "100%", width: "96%",
                    background: "linear-gradient(90deg, var(--success) 0%, #34D399 100%)",
                    borderRadius: "999px",
                  }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          4. SOCIAL PROOF
      ═══════════════════════════════════════════════ */}
      <section style={{ padding: "4rem 1.5rem", background: "var(--surface)", borderTop: "1px solid var(--border)" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto", textAlign: "center" }}>
          <p style={{ fontSize: "0.8125rem", color: "var(--subtle)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "2rem" }}>
            Đã được tin tưởng bởi
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "1.5rem", alignItems: "center" }}>
            {["Savage Studio", "Bloom Beauty", "TechVibe Store", "Urban Closet", "Fresh Café"].map((brand) => (
              <div key={brand} style={{
                padding: "0.625rem 1.5rem",
                background: "var(--bg)",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius-full)",
                fontSize: "0.875rem",
                fontWeight: 600,
                color: "var(--muted)",
              }}>{brand}</div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          5. PRICING SECTION
      ═══════════════════════════════════════════════ */}
      <section id="pricing" style={{ padding: "5rem 1.5rem", background: "var(--bg)" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
            <div className="badge badge-primary" style={{ marginBottom: "1rem" }}>BẢNG GIÁ</div>
            <h2 style={{
              fontFamily: "var(--font-heading)",
              fontSize: "clamp(1.75rem, 4vw, 2.5rem)",
              fontWeight: 800,
              color: "var(--slate)",
              letterSpacing: "-0.03em",
              marginBottom: "0.75rem",
            }}>
              Chi phí minh bạch, tối ưu dòng tiền
            </h2>
            <p style={{ color: "var(--muted)", maxWidth: "480px", margin: "0 auto", lineHeight: 1.7 }}>
              Đăng ký ngay hôm nay để nhận <strong style={{ color: "var(--primary)" }}>1 tháng dùng thử miễn phí</strong> đầy đủ tính năng.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.5rem", alignItems: "start" }}>
            <PricingCard
              tier="Trải Nghiệm Đầu"
              price="0đ"
              desc="Miễn phí 1 tháng đầu tiên cho tài khoản mới"
              features={[
                "Thử nghiệm toàn bộ tính năng",
                "Nhận đề xuất AI Matching cơ bản",
                "Phí trung gian giao dịch: 3%",
              ]}
              cta="Đăng ký thử ngay"
              ctaHref="/register"
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
              cta="Nâng cấp Pro"
              ctaHref="/register"
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
              cta="Nâng cấp Ultra"
              ctaHref="/register"
              highlight={false}
            />
          </div>

          {/* Hearts Info */}
          <div style={{
            marginTop: "2.5rem",
            background: "linear-gradient(135deg, var(--primary-light) 0%, var(--rose-light) 100%)",
            border: "1px solid var(--primary-muted)",
            borderRadius: "var(--radius-xl)",
            padding: "1.75rem 2rem",
            textAlign: "center",
            maxWidth: "600px",
            margin: "2.5rem auto 0",
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
              fontSize: "1rem",
              color: "var(--primary)",
              marginBottom: "0.5rem",
            }}>
              Hệ thống Tim & Lượt Connect nội bộ
            </h4>
            <p style={{ fontSize: "0.875rem", color: "var(--muted)", lineHeight: 1.6, marginBottom: "1rem" }}>
              Khi hết lượt connect, bạn có thể bổ sung bằng trái tim. Mỗi lượt kết nối tiêu hao <strong style={{ color: "var(--primary)" }}>5 trái tim</strong>.
            </p>
            <div style={{
              display: "inline-block",
              background: "white",
              border: "1px solid var(--primary-muted)",
              borderRadius: "var(--radius-md)",
              padding: "0.5rem 1.25rem",
              fontSize: "0.875rem",
              fontWeight: 800,
              color: "var(--primary)",
            }}>
              Mức giá nạp cực hời: 5 tim / 3.000đ{" "}
              <span style={{ fontSize: "0.75rem", fontWeight: 400, color: "var(--subtle)" }}>
                (áp dụng mỗi đơn trên 15.000đ)
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          6. CTA BOTTOM BANNER
      ═══════════════════════════════════════════════ */}
      <section style={{
        padding: "5rem 1.5rem",
        background: "linear-gradient(135deg, #1E0845 0%, #4C1D95 50%, #7C1F5A 100%)",
        textAlign: "center",
        position: "relative",
        overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", top: "50%", left: "50%",
          transform: "translate(-50%, -50%)",
          width: "600px", height: "300px",
          background: "radial-gradient(ellipse, rgba(255,255,255,0.05) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />
        <div style={{ position: "relative" }}>
          <h2 style={{
            fontFamily: "var(--font-heading)",
            fontSize: "clamp(1.75rem, 4vw, 2.75rem)",
            fontWeight: 800,
            color: "white",
            letterSpacing: "-0.03em",
            marginBottom: "1rem",
          }}>
            Sẵn sàng tìm đúng người — đúng vibe?
          </h2>
          <p style={{ color: "rgba(196,181,253,0.80)", fontSize: "1rem", marginBottom: "2.5rem", lineHeight: 1.7 }}>
            Tham gia cùng hàng trăm Shop và Creator đang xây dựng<br />chiến dịch thành công trên Castme.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem", justifyContent: "center" }}>
            <Link href="/register" style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.9375rem 2rem",
              background: "white",
              color: "var(--primary)",
              borderRadius: "var(--radius-full)",
              fontWeight: 800,
              fontSize: "1rem",
              textDecoration: "none",
              transition: "all 0.2s ease",
              boxShadow: "0 8px 24px rgba(0,0,0,0.20)",
            }}>
              Bắt đầu miễn phí 1 tháng →
            </Link>
            <Link href="/login" style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.9375rem 2rem",
              background: "rgba(255,255,255,0.10)",
              color: "white",
              borderRadius: "var(--radius-full)",
              fontWeight: 700,
              fontSize: "1rem",
              textDecoration: "none",
              border: "1.5px solid rgba(255,255,255,0.25)",
              transition: "all 0.2s ease",
            }}>
              Đã có tài khoản
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}