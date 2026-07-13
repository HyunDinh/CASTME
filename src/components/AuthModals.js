"use client";
import { useState, useEffect, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { X, Mail, Lock, User, Check } from "lucide-react";
import { loginAction, registerAction } from "../app/(auth)/actions";

export default function AuthModals() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const authType = searchParams.get("auth"); // "login" or "register"

  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Login fields
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Register fields
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regRole, setRegRole] = useState("SHOP"); // "SHOP" or "CREATOR"

  useEffect(() => {
    // Reset status when modal changes
    setError("");
    setSuccess("");
  }, [authType]);

  if (!authType || (authType !== "login" && authType !== "register")) {
    return null;
  }

  const handleClose = () => {
    router.replace("/");
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!loginEmail || !loginPassword) {
      setError("Vui lòng điền đầy đủ email và mật khẩu");
      return;
    }

    startTransition(async () => {
      const formData = new FormData();
      formData.append("email", loginEmail);
      formData.append("password", loginPassword);

      const res = await loginAction(formData);
      if (res?.error) {
        setError(res.error);
      } else if (res?.success) {
        setSuccess("Đăng nhập thành công! Đang chuyển hướng...");
        setTimeout(() => {
          if (res.role === "ADMIN") {
            window.location.href = "/admin";
          } else if (res.role === "SHOP") {
            window.location.href = "/shop-dashboard";
          } else {
            window.location.href = "/creator-dashboard";
          }
        }, 1000);
      }
    });
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!regName || !regEmail || !regPassword || !regRole) {
      setError("Vui lòng điền đầy đủ thông tin");
      return;
    }

    startTransition(async () => {
      const formData = new FormData();
      formData.append("name", regName);
      formData.append("email", regEmail);
      formData.append("password", regPassword);
      formData.append("role", regRole);

      const res = await registerAction(formData);
      if (res?.error) {
        setError(res.error);
      } else if (res?.success) {
        setSuccess("Đăng ký tài khoản thành công! Đang chuyển sang đăng nhập...");
        setTimeout(() => {
          router.replace("/?auth=login");
        }, 1500);
      }
    });
  };

  return (
    <div style={{
      position: "fixed",
      inset: 0,
      zIndex: 9999,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "1rem",
      background: "rgba(9, 10, 15, 0.45)",
      backdropFilter: "blur(8px)",
      WebkitBackdropFilter: "blur(8px)",
    }}>
      {/* Background click close */}
      <div
        onClick={handleClose}
        style={{
          position: "absolute",
          inset: 0,
          cursor: "pointer",
        }}
      />

      {/* Modal card */}
      <div style={{
        background: "#ffffff",
        border: "1px solid rgba(0, 0, 0, 0.08)",
        borderRadius: "var(--radius-xl)",
        padding: "2.5rem 2rem",
        width: "100%",
        maxWidth: "460px",
        boxShadow: "0 25px 60px -15px rgba(0, 0, 0, 0.12)",
        position: "relative",
        zIndex: 10,
        color: "#1a2b4a",
        display: "flex",
        flexDirection: "column",
        gap: "1.5rem",
      }}>
        {/* Close Button */}
        <button
          onClick={handleClose}
          type="button"
          style={{
            position: "absolute",
            top: "1.25rem",
            right: "1.25rem",
            background: "rgba(0, 0, 0, 0.05)",
            border: "none",
            borderRadius: "50%",
            width: "32px",
            height: "32px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            color: "#5a6b82",
            transition: "all 0.2s ease",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(0, 0, 0, 0.1)"; e.currentTarget.style.color = "#1a2b4a"; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(0, 0, 0, 0.05)"; e.currentTarget.style.color = "#5a6b82"; }}
        >
          <X size={16} />
        </button>

        {/* Logo/Badge */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <div style={{
            width: "24px", height: "24px",
            background: "#2563eb",
            borderRadius: "6px",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <span style={{ color: "white", fontSize: "12px", fontWeight: "bold" }}>✓</span>
          </div>
          <span style={{ fontFamily: "var(--font-heading)", fontSize: "1.1rem", fontWeight: 800, letterSpacing: "0.04em" }}>
            CASTME
          </span>
        </div>

        {/* Heading */}
        <div>
          <h2 style={{
            fontFamily: "var(--font-heading)",
            fontSize: "1.5rem",
            fontWeight: 800,
            color: "#1a2b4a",
            marginBottom: "0.35rem",
          }}>
            {authType === "login" ? "Chào mừng quay lại" : "Tạo tài khoản mới"}
          </h2>
          <p style={{ fontSize: "0.8125rem", color: "#5a6b82" }}>
            {authType === "login"
              ? "Đăng nhập để kết nối với các chiến dịch chuẩn vibe"
              : "Bắt đầu mở rộng tầm ảnh hưởng của bạn ngay hôm nay"}
          </p>
        </div>

        {/* Messages */}
        {error && (
          <div style={{
            padding: "0.75rem 1rem",
            background: "rgba(239, 68, 68, 0.08)",
            border: "1px solid rgba(239, 68, 68, 0.2)",
            borderRadius: "var(--radius-md)",
            fontSize: "0.8125rem",
            color: "#ef4444",
            fontWeight: 600,
            textAlign: "center",
          }}>
            ⚠️ {error}
          </div>
        )}

        {success && (
          <div style={{
            padding: "0.75rem 1rem",
            background: "rgba(16, 185, 129, 0.08)",
            border: "1px solid rgba(16, 185, 129, 0.2)",
            borderRadius: "var(--radius-md)",
            fontSize: "0.8125rem",
            color: "#10b981",
            fontWeight: 600,
            textAlign: "center",
          }}>
            🎉 {success}
          </div>
        )}

        {/* Form Container */}
        {authType === "login" ? (
          /* LOGIN FORM */
          <form onSubmit={handleLoginSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.125rem" }}>
            <div>
              <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: "#5a6b82", marginBottom: "0.375rem" }}>
                Email của bạn
              </label>
              <div style={{ position: "relative" }}>
                <span style={{ position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)", color: "#7a8b9f", display: "flex" }}>
                  <Mail size={16} />
                </span>
                <input
                  type="email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="name@example.com"
                  disabled={isPending}
                  required
                  style={{
                    width: "100%",
                    padding: "0.75rem 1rem 0.75rem 2.5rem",
                    fontSize: "0.875rem",
                    color: "#1a2b4a",
                    background: "#ffffff",
                    border: "1.5px solid rgba(37, 99, 235, 0.15)",
                    borderRadius: "var(--radius-md)",
                    outline: "none",
                    transition: "all 0.2s",
                  }}
                  onFocus={(e) => e.target.style.borderColor = "#2563eb"}
                  onBlur={(e) => e.target.style.borderColor = "rgba(37, 99, 235, 0.15)"}
                />
              </div>
            </div>

            <div>
              <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: "#5a6b82", marginBottom: "0.375rem" }}>
                Mật khẩu
              </label>
              <div style={{ position: "relative" }}>
                <span style={{ position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)", color: "#7a8b9f", display: "flex" }}>
                  <Lock size={16} />
                </span>
                <input
                  type="password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="••••••••"
                  disabled={isPending}
                  required
                  style={{
                    width: "100%",
                    padding: "0.75rem 1rem 0.75rem 2.5rem",
                    fontSize: "0.875rem",
                    color: "#1a2b4a",
                    background: "#ffffff",
                    border: "1.5px solid rgba(37, 99, 235, 0.15)",
                    borderRadius: "var(--radius-md)",
                    outline: "none",
                    transition: "all 0.2s",
                  }}
                  onFocus={(e) => e.target.style.borderColor = "#2563eb"}
                  onBlur={(e) => e.target.style.borderColor = "rgba(37, 99, 235, 0.15)"}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isPending}
              style={{
                background: "linear-gradient(135deg, #ffb07a 0%, #ff7eb3 55%, #ff6b9d 100%)",
                color: "white",
                fontWeight: 800,
                border: "none",
                borderRadius: "var(--radius-full)",
                padding: "0.875rem",
                cursor: isPending ? "not-allowed" : "pointer",
                transition: "all 0.3s ease",
                width: "100%",
                boxShadow: "0 8px 24px rgba(255, 120, 150, 0.3)",
                fontSize: "0.9rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.5rem",
                marginTop: "0.5rem",
              }}
              onMouseEnter={(e) => { if (!isPending) e.currentTarget.style.transform = "translateY(-1px)"; }}
              onMouseLeave={(e) => { if (!isPending) e.currentTarget.style.transform = "none"; }}
            >
              {isPending ? "Đang xử lý..." : "Đăng nhập ngay →"}
            </button>
          </form>
        ) : (
          /* REGISTER FORM */
          <form onSubmit={handleRegisterSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div>
              <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: "#5a6b82", marginBottom: "0.375rem" }}>
                Họ và tên
              </label>
              <div style={{ position: "relative" }}>
                <span style={{ position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)", color: "#7a8b9f", display: "flex" }}>
                  <User size={16} />
                </span>
                <input
                  type="text"
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  placeholder="Nguyễn Văn A"
                  disabled={isPending}
                  required
                  style={{
                    width: "100%",
                    padding: "0.75rem 1rem 0.75rem 2.5rem",
                    fontSize: "0.875rem",
                    color: "#1a2b4a",
                    background: "#ffffff",
                    border: "1.5px solid rgba(37, 99, 235, 0.15)",
                    borderRadius: "var(--radius-md)",
                    outline: "none",
                    transition: "all 0.2s",
                  }}
                  onFocus={(e) => e.target.style.borderColor = "#2563eb"}
                  onBlur={(e) => e.target.style.borderColor = "rgba(37, 99, 235, 0.15)"}
                />
              </div>
            </div>

            <div>
              <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: "#5a6b82", marginBottom: "0.375rem" }}>
                Email
              </label>
              <div style={{ position: "relative" }}>
                <span style={{ position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)", color: "#7a8b9f", display: "flex" }}>
                  <Mail size={16} />
                </span>
                <input
                  type="email"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  placeholder="name@example.com"
                  disabled={isPending}
                  required
                  style={{
                    width: "100%",
                    padding: "0.75rem 1rem 0.75rem 2.5rem",
                    fontSize: "0.875rem",
                    color: "#1a2b4a",
                    background: "#ffffff",
                    border: "1.5px solid rgba(37, 99, 235, 0.15)",
                    borderRadius: "var(--radius-md)",
                    outline: "none",
                    transition: "all 0.2s",
                  }}
                  onFocus={(e) => e.target.style.borderColor = "#2563eb"}
                  onBlur={(e) => e.target.style.borderColor = "rgba(37, 99, 235, 0.15)"}
                />
              </div>
            </div>

            <div>
              <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: "#5a6b82", marginBottom: "0.375rem" }}>
                Mật khẩu
              </label>
              <div style={{ position: "relative" }}>
                <span style={{ position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)", color: "#7a8b9f", display: "flex" }}>
                  <Lock size={16} />
                </span>
                <input
                  type="password"
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  placeholder="Tối thiểu 6 ký tự"
                  disabled={isPending}
                  required
                  minLength={6}
                  style={{
                    width: "100%",
                    padding: "0.75rem 1rem 0.75rem 2.5rem",
                    fontSize: "0.875rem",
                    color: "#1a2b4a",
                    background: "#ffffff",
                    border: "1.5px solid rgba(37, 99, 235, 0.15)",
                    borderRadius: "var(--radius-md)",
                    outline: "none",
                    transition: "all 0.2s",
                  }}
                  onFocus={(e) => e.target.style.borderColor = "#2563eb"}
                  onBlur={(e) => e.target.style.borderColor = "rgba(37, 99, 235, 0.15)"}
                />
              </div>
            </div>

            {/* Role Custom Select Cards */}
            <div>
              <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: "#5a6b82", marginBottom: "0.5rem" }}>
                Bạn tham gia với vai trò
              </label>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                {/* Shop Option */}
                <div
                  onClick={() => !isPending && setRegRole("SHOP")}
                  style={{
                    padding: "0.875rem 0.75rem",
                    borderRadius: "var(--radius-md)",
                    background: regRole === "SHOP" ? "rgba(37, 99, 235, 0.05)" : "transparent",
                    border: regRole === "SHOP" ? "2px solid #2563eb" : "1.5px solid rgba(37, 99, 235, 0.15)",
                    cursor: isPending ? "not-allowed" : "pointer",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "0.25rem",
                    textAlign: "center",
                    position: "relative",
                    transition: "all 0.2s",
                  }}
                >
                  {regRole === "SHOP" && (
                    <span style={{ position: "absolute", top: "4px", right: "4px", background: "#2563eb", borderRadius: "50%", width: "14px", height: "14px", display: "flex", alignItems: "center", justifyContent: "center", color: "white" }}>
                      <Check size={8} strokeWidth={4} />
                    </span>
                  )}
                  <span style={{ fontSize: "1.25rem" }}>🏪</span>
                  <span style={{ fontSize: "0.8125rem", fontWeight: 700, color: "#1a2b4a" }}>Shop / Brand</span>
                  <span style={{ fontSize: "0.625rem", color: "#5a6b82" }}>Tìm kiếm KOL/KOC</span>
                </div>

                {/* Creator Option */}
                <div
                  onClick={() => !isPending && setRegRole("CREATOR")}
                  style={{
                    padding: "0.875rem 0.75rem",
                    borderRadius: "var(--radius-md)",
                    background: regRole === "CREATOR" ? "rgba(255, 107, 157, 0.05)" : "transparent",
                    border: regRole === "CREATOR" ? "2px solid #ff6b9d" : "1.5px solid rgba(37, 99, 235, 0.15)",
                    cursor: isPending ? "not-allowed" : "pointer",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "0.25rem",
                    textAlign: "center",
                    position: "relative",
                    transition: "all 0.2s",
                  }}
                >
                  {regRole === "CREATOR" && (
                    <span style={{ position: "absolute", top: "4px", right: "4px", background: "#ff6b9d", borderRadius: "50%", width: "14px", height: "14px", display: "flex", alignItems: "center", justifyContent: "center", color: "white" }}>
                      <Check size={8} strokeWidth={4} />
                    </span>
                  )}
                  <span style={{ fontSize: "1.25rem" }}>📸</span>
                  <span style={{ fontSize: "0.8125rem", fontWeight: 700, color: "#1a2b4a" }}>KOL / Creator</span>
                  <span style={{ fontSize: "0.625rem", color: "#5a6b82" }}>Nhận job phù hợp</span>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isPending}
              style={{
                background: "linear-gradient(135deg, #ffb07a 0%, #ff7eb3 55%, #ff6b9d 100%)",
                color: "white",
                fontWeight: 800,
                border: "none",
                borderRadius: "var(--radius-full)",
                padding: "0.875rem",
                cursor: isPending ? "not-allowed" : "pointer",
                transition: "all 0.3s ease",
                width: "100%",
                boxShadow: "0 8px 24px rgba(255, 120, 150, 0.3)",
                fontSize: "0.9rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.5rem",
                marginTop: "0.5rem",
              }}
              onMouseEnter={(e) => { if (!isPending) e.currentTarget.style.transform = "translateY(-1px)"; }}
              onMouseLeave={(e) => { if (!isPending) e.currentTarget.style.transform = "none"; }}
            >
              {isPending ? "Đang xử lý..." : "Đăng ký tài khoản →"}
            </button>
          </form>
        )}

        {/* Footer Link */}
        <div style={{
          textAlign: "center",
          fontSize: "0.8125rem",
          color: "#5a6b82",
          borderTop: "1px solid rgba(0, 0, 0, 0.05)",
          paddingTop: "1rem",
        }}>
          {authType === "login" ? (
            <>
              Bạn chưa có tài khoản?{" "}
              <button
                onClick={() => router.replace("/?auth=register")}
                disabled={isPending}
                style={{
                  background: "none",
                  border: "none",
                  color: "#2563eb",
                  fontWeight: 700,
                  cursor: isPending ? "not-allowed" : "pointer",
                  padding: 0,
                  fontSize: "0.8125rem",
                }}
              >
                Đăng ký ngay
              </button>
            </>
          ) : (
            <>
              Bạn đã có tài khoản rồi?{" "}
              <button
                onClick={() => router.replace("/?auth=login")}
                disabled={isPending}
                style={{
                  background: "none",
                  border: "none",
                  color: "#2563eb",
                  fontWeight: 700,
                  cursor: isPending ? "not-allowed" : "pointer",
                  padding: 0,
                  fontSize: "0.8125rem",
                }}
              >
                Đăng nhập
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
