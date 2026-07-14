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
    <div className="admin-container">
      <div className="admin-card" style={{ padding: 24 }}>
        <h1 className="admin-title">Quản lý tài khoản</h1>
        <p className="admin-subtitle">Xem toàn bộ tài khoản trong hệ thống và tạo tài khoản admin mới.</p>
      </div>

      <div className="admin-stat-grid">
        <div className="admin-stat-card">
          <div className="admin-stat-label">Tổng tài khoản</div>
          <div className="admin-stat-value">{users.length}</div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-label">Admin hoạt động</div>
          <div className="admin-stat-value">{users.filter((user) => user.role === "ADMIN").length}</div>
        </div>
      </div>

      <div className="admin-card" style={{ padding: 24 }}>
        <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 12, color: "white" }}>Tạo admin mới</h2>
        <form onSubmit={handleSubmit} style={{ display: "grid", gap: 12, maxWidth: 500 }}>
          <input className="admin-input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Tên admin" required />
          <input className="admin-input" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="Email" required />
          <input className="admin-input" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="Mật khẩu" required />
          <button type="submit" disabled={submitting} className="admin-btn admin-btn-primary" style={{ width: "fit-content" }}>
            {submitting ? "Đang tạo..." : "Tạo tài khoản admin"}
          </button>
        </form>
      </div>

      <div className="admin-card" style={{ padding: 24 }}>
        <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 12, color: "white" }}>Danh sách tài khoản</h2>

        {loading ? (
          <div className="admin-empty">Đang tải...</div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Tên</th>
                  <th>Email</th>
                  <th>Vai trò</th>
                  <th>Số dư</th>
                  <th>Tim</th>
                  <th>Ngày tạo</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td style={{ fontWeight: 700, color: "white" }}>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.role}</td>
                    <td>{user.balance?.toLocaleString("vi-VN")}đ</td>
                    <td>{user.hearts}</td>
                    <td>{new Date(user.createdAt).toLocaleDateString("vi-VN")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
