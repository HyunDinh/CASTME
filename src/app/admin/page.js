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
    <div style={{ minHeight: "100vh", background: "#f8fafc", padding: 24, color: "#0f172a" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", display: "grid", gap: 16 }}>
        <div style={{ background: "white", borderRadius: 20, padding: 24, boxShadow: "0 8px 30px rgba(0,0,0,0.06)", color: "#0f172a" }}>
          <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8 }}>Admin • Quản lý rút tiền</h1>
          <p style={{ color: "#64748b", marginBottom: 12 }}>Xem các yêu cầu rút tiền của KOL và xử lý nhanh chóng.</p>
          <Link href="/admin/accounts" style={{ color: "#2563eb", fontWeight: 700, textDecoration: "none" }}>
            → Quản lý tài khoản
          </Link>
        </div>

        {loading ? (
          <div style={{ padding: 24, background: "white", borderRadius: 16, color: "#0f172a" }}>Đang tải...</div>
        ) : requests.length === 0 ? (
          <div style={{ padding: 24, background: "white", borderRadius: 16, color: "#0f172a" }}>Không có yêu cầu rút tiền nào.</div>
        ) : (
          <div style={{ display: "grid", gap: 16 }}>
            {requests.map((request) => (
              <div key={request.id} style={{ background: "white", borderRadius: 18, padding: 20, boxShadow: "0 8px 30px rgba(0,0,0,0.06)", color: "#0f172a" }}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
                  <div>
                    <div style={{ fontSize: 18, fontWeight: 700 }}>{request.user?.name}</div>
                    <div style={{ color: "#64748b", fontSize: 14 }}>{request.user?.email}</div>
                  </div>
                  <div style={{ fontSize: 18, fontWeight: 800, color: "#2563eb" }}>
                    {request.netAmount?.toLocaleString("vi-VN")}đ
                  </div>
                </div>

                <div style={{ marginTop: 14, display: "grid", gap: 8, color: "#334155" }}>
                  <div><strong>Số dư hiện tại:</strong> {request.user?.balance?.toLocaleString("vi-VN")}đ</div>
                  <div><strong>Ngân hàng:</strong> {request.user?.bankName || "—"}</div>
                  <div><strong>Số tài khoản:</strong> {request.user?.bankAccount || "—"}</div>
                  <div><strong>Chủ tài khoản:</strong> {request.user?.bankOwner || "—"}</div>
                  <div><strong>Mô tả:</strong> {request.description || "—"}</div>
                  <div><strong>Ngày tạo:</strong> {new Date(request.createdAt).toLocaleString("vi-VN")}</div>
                </div>

                {request.user?.qrCodeUrl && (
                  <div style={{ marginTop: 12 }}>
                    <img src={request.user.qrCodeUrl} alt="QR" style={{ width: 140, height: 140, objectFit: "contain", borderRadius: 12, border: "1px solid #e2e8f0" }} />
                  </div>
                )}

                <div style={{ marginTop: 16, display: "flex", gap: 10, flexWrap: "wrap" }}>
                  <button
                    onClick={() => handleAction(request.id, "APPROVE")}
                    disabled={actioningId === request.id}
                    style={{ padding: "10px 14px", borderRadius: 10, background: "#16a34a", color: "white", fontWeight: 700, border: "none", cursor: "pointer" }}
                  >
                    {actioningId === request.id ? "Đang xử lý..." : "Đã chuyển"}
                  </button>

                  <button
                    onClick={() => setSelectedId(selectedId === request.id ? null : request.id)}
                    style={{ padding: "10px 14px", borderRadius: 10, background: "#dc2626", color: "white", fontWeight: 700, border: "none", cursor: "pointer" }}
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
                      style={{ minHeight: 90, padding: 10, borderRadius: 10, border: "1px solid #cbd5e1" }}
                    />
                    <button
                      onClick={() => handleAction(request.id, "REJECT")}
                      disabled={actioningId === request.id}
                      style={{ padding: "10px 14px", borderRadius: 10, background: "#7c2d12", color: "white", fontWeight: 700, border: "none", cursor: "pointer" }}
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
    </div>
  );
}
