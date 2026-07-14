"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getAdminWithdrawRequests, handleWithdrawRequest } from "./actions";

export default function AdminPage() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState(null);
  const [reason, setReason] = useState("");
  const [actioningId, setActioningId] = useState(null);

  const loadRequests = async () => {
    setLoading(true);
    const res = await getAdminWithdrawRequests();
    if (res.success) {
      setRequests(res.data);
    }
    setLoading(false);
  };

  useEffect(() => {
    void loadRequests();
  }, []);

  const handleAction = async (requestId, action) => {
    if (action === "REJECT" && !reason.trim()) {
      alert("Vui lòng nhập lý do từ chối");
      return;
    }

    setActioningId(requestId);
    const res = await handleWithdrawRequest(requestId, action, reason);
    setActioningId(null);

    if (res.success) {
      setReason("");
      setSelectedId(null);
      await loadRequests();
    } else {
      alert(res.error || "Không thể xử lý yêu cầu");
    }
  };

  return (
    <div className="admin-container">
      <div className="admin-card" style={{ padding: 24 }}>
        <div className="admin-heading">
          <div>
            <h1 className="admin-title">Admin • Quản lý rút tiền</h1>
            <p className="admin-subtitle">Xem các yêu cầu rút tiền của KOL và xử lý nhanh chóng.</p>
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <div className="admin-pill">⏳ {requests.length} chờ duyệt</div>
            <Link href="/admin/accounts" className="admin-btn admin-btn-ghost">
              → Quản lý tài khoản
            </Link>
          </div>
        </div>
      </div>

      <div className="admin-stat-grid">
        <div className="admin-stat-card">
          <div className="admin-stat-label">Yêu cầu đang chờ</div>
          <div className="admin-stat-value">{requests.length}</div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-label">Tổng giá trị</div>
          <div className="admin-stat-value">{requests.reduce((sum, item) => sum + Number(item.netAmount || 0), 0).toLocaleString("vi-VN")}đ</div>
        </div>
      </div>

      {loading ? (
        <div className="admin-card admin-empty">Đang tải...</div>
      ) : requests.length === 0 ? (
        <div className="admin-card admin-empty">Không có yêu cầu rút tiền nào.</div>
      ) : (
        <div style={{ display: "grid", gap: 16 }}>
          {requests.map((request) => (
            <div key={request.id} className="admin-card" style={{ padding: 20 }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                    <div style={{ width: 42, height: 42, borderRadius: "50%", background: "linear-gradient(135deg, var(--primary) 0%, #9333ea 100%)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800 }}>
                      {request.user?.name?.[0] || "K"}
                    </div>
                    <div>
                      <div style={{ fontSize: 18, fontWeight: 700, color: "white" }}>{request.user?.name}</div>
                      <div style={{ color: "rgba(226, 232, 240, 0.72)", fontSize: 14 }}>{request.user?.email}</div>
                    </div>
                  </div>
                </div>
                <div className="admin-pill admin-pill-rose">{request.netAmount?.toLocaleString("vi-VN")}đ</div>
              </div>

              <div style={{ marginTop: 14, display: "grid", gap: 8, color: "rgba(226, 232, 240, 0.92)" }}>
                <div><strong>Số dư hiện tại:</strong> {request.user?.balance?.toLocaleString("vi-VN")}đ</div>
                <div><strong>Ngân hàng:</strong> {request.user?.bankName || "—"}</div>
                <div><strong>Số tài khoản:</strong> {request.user?.bankAccount || "—"}</div>
                <div><strong>Chủ tài khoản:</strong> {request.user?.bankOwner || "—"}</div>
                <div><strong>Mô tả:</strong> {request.description || "—"}</div>
                <div><strong>Ngày tạo:</strong> {new Date(request.createdAt).toLocaleString("vi-VN")}</div>
              </div>

              {request.user?.qrCodeUrl && (
                <div style={{ marginTop: 12 }}>
                  <img src={request.user.qrCodeUrl} alt="QR" style={{ width: 140, height: 140, objectFit: "contain", borderRadius: 12, border: "1px solid rgba(255,255,255,0.12)" }} />
                </div>
              )}

              <div style={{ marginTop: 16, display: "flex", gap: 10, flexWrap: "wrap" }}>
                <button
                  onClick={() => handleAction(request.id, "APPROVE")}
                  disabled={actioningId === request.id}
                  className="admin-btn admin-btn-primary"
                >
                  {actioningId === request.id ? "Đang xử lý..." : "Đã chuyển"}
                </button>

                <button
                  onClick={() => setSelectedId(selectedId === request.id ? null : request.id)}
                  className="admin-btn admin-btn-danger"
                >
                  Từ chối
                </button>
              </div>

              {selectedId === request.id && (
                <div style={{ marginTop: 12, display: "grid", gap: 8 }}>
                  <textarea
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="Nhập lý do từ chối..."
                    className="admin-input"
                    style={{ minHeight: 90 }}
                  />
                  <button
                    onClick={() => handleAction(request.id, "REJECT")}
                    disabled={actioningId === request.id}
                    className="admin-btn admin-btn-danger"
                  >
                    Xác nhận từ chối
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
