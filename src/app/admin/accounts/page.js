"use client";

import { useEffect, useState } from "react";
import { createAdminAccount, getAllUsersForAdmin } from "../actions";

export default function AdminAccountsPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [submitting, setSubmitting] = useState(false);

  const loadUsers = async () => {
    setLoading(true);
    const res = await getAllUsersForAdmin();
    if (res.success) {
      setUsers(res.data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    void loadUsers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const fd = new FormData();
    fd.set("name", form.name);
    fd.set("email", form.email);
    fd.set("password", form.password);

    const res = await createAdminAccount(fd);
    setSubmitting(false);

    if (res.success) {
      setForm({ name: "", email: "", password: "" });
      await loadUsers();
      alert(res.message || "Tạo tài khoản admin thành công");
    } else {
      alert(res.error || "Không thể tạo tài khoản admin");
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc", padding: 24, color: "#0f172a" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", display: "grid", gap: 20 }}>
        <div style={{ background: "white", borderRadius: 20, padding: 24, boxShadow: "0 8px 30px rgba(0,0,0,0.06)", color: "#0f172a" }}>
          <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8 }}>Quản lý tài khoản</h1>
          <p style={{ color: "#64748b" }}>Xem toàn bộ tài khoản trong hệ thống và tạo tài khoản admin mới.</p>
        </div>

        <div style={{ background: "white", borderRadius: 20, padding: 24, boxShadow: "0 8px 30px rgba(0,0,0,0.06)", color: "#0f172a" }}>
          <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 12 }}>Tạo admin mới</h2>
          <form onSubmit={handleSubmit} style={{ display: "grid", gap: 12, maxWidth: 500 }}>
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Tên admin" style={inputStyle} required />
            <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="Email" style={inputStyle} required />
            <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="Mật khẩu" style={inputStyle} required />
            <button type="submit" disabled={submitting} style={buttonStyle}>
              {submitting ? "Đang tạo..." : "Tạo tài khoản admin"}
            </button>
          </form>
        </div>

        <div style={{ background: "white", borderRadius: 20, padding: 24, boxShadow: "0 8px 30px rgba(0,0,0,0.06)", color: "#0f172a" }}>
          <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 12 }}>Danh sách tài khoản</h2>

          {loading ? (
            <div>Đang tải...</div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ textAlign: "left", color: "#64748b", borderBottom: "1px solid #e2e8f0" }}>
                    <th style={{ padding: "10px 8px" }}>Tên</th>
                    <th style={{ padding: "10px 8px" }}>Email</th>
                    <th style={{ padding: "10px 8px" }}>Vai trò</th>
                    <th style={{ padding: "10px 8px" }}>Số dư</th>
                    <th style={{ padding: "10px 8px" }}>Tim</th>
                    <th style={{ padding: "10px 8px" }}>Ngày tạo</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                      <td style={{ padding: "10px 8px", fontWeight: 700 }}>{user.name}</td>
                      <td style={{ padding: "10px 8px" }}>{user.email}</td>
                      <td style={{ padding: "10px 8px" }}>{user.role}</td>
                      <td style={{ padding: "10px 8px" }}>{user.balance?.toLocaleString("vi-VN")}đ</td>
                      <td style={{ padding: "10px 8px" }}>{user.hearts}</td>
                      <td style={{ padding: "10px 8px" }}>{new Date(user.createdAt).toLocaleDateString("vi-VN")}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const inputStyle = {
  padding: "10px 12px",
  borderRadius: 10,
  border: "1px solid #cbd5e1",
  fontSize: 14,
  background: "#ffffff",
  color: "#0f172a",
};

const buttonStyle = {
  padding: "10px 14px",
  borderRadius: 10,
  background: "#2563eb",
  color: "#ffffff",
  border: "none",
  fontWeight: 700,
  cursor: "pointer",
};
