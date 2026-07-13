"use client";
import { useState, useEffect } from "react";
import { getCreatorRevenue, getCreatorBankInfo, updateCreatorBankInfo, requestFullWithdraw } from "./actions";

export default function RevenuePage() {
  const [revenue, setRevenue] = useState(null);
  const [bankInfo, setBankInfo] = useState({ bankName: "", bankAccount: "", bankOwner: "", qrCodeUrl: "" });
  const [loading, setLoading] = useState(true);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [showBankModal, setShowBankModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadRevenueData = async () => {
    setLoading(true);
    const [revRes, bankRes] = await Promise.all([
      getCreatorRevenue(),
      getCreatorBankInfo(),
    ]);

    if (revRes.success) setRevenue(revRes.data);
    if (bankRes.success) setBankInfo(bankRes.data || {});

    setLoading(false);
  };

  useEffect(() => {
    void loadRevenueData();
  }, []);

  if (loading) return <div className="p-10 text-center">Đang tải...</div>;

  const wallet = {
    available: revenue?.available || 0,
    pendingWithdraw: revenue?.pendingWithdraw || 0,
    withdrawn: revenue?.withdrawn || 0,
    totalEarned: revenue?.totalEarned || 0,
    pendingWithdrawCount: revenue?.pendingWithdrawCount || 0,
  };

  const transactions = revenue?.transactions || [];

  const handleFullWithdraw = async () => {
    if (wallet.pendingWithdrawCount > 0) {
      alert("Bạn đã có yêu cầu rút tiền đang chờ admin xác nhận.");
      setShowWithdrawModal(false);
      return;
    }

    if (wallet.available <= 0) {
      alert("Số dư không đủ để rút!");
      return;
    }

    if (!confirm(`Bạn chắc chắn muốn gửi yêu cầu rút toàn bộ ${wallet.available.toLocaleString()}đ?`)) return;

    setIsSubmitting(true);
    const res = await requestFullWithdraw();
    setIsSubmitting(false);

    if (res.success) {
      alert(res.message);
      await loadRevenueData();
    } else {
      alert(res.error);
    }
    setShowWithdrawModal(false);
  };

  // Cập nhật thông tin ngân hàng
  const handleBankSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const res = await updateCreatorBankInfo(bankInfo);
    setIsSubmitting(false);

    if (res.success) {
      alert(res.message);
      setShowBankModal(false);
    } else {
      alert(res.error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 pt-6">

        {/* Header */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-700 p-8 md:p-12 shadow-xl">
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-1.5 rounded-full mb-4">
              <span className="text-xs font-semibold text-white/90">💼 Quản lý tài chính</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-white mb-3 tracking-tight">Ví doanh thu</h1>
            <p className="text-sm text-purple-100">Theo dõi thu nhập và quản lý rút tiền</p>
          </div>
        </div>

        {wallet.pendingWithdrawCount > 0 && (
          <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            Bạn đang có {wallet.pendingWithdrawCount} yêu cầu rút tiền đang chờ admin xác nhận.
          </div>
        )}

        {/* Wallet Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <p className="text-xs font-bold text-gray-500 mb-2">SỐ DƯ KHẢ DỤNG</p>
            <h2 className="text-4xl font-black text-gray-900">
              {wallet.available.toLocaleString()} <span className="text-2xl">đ</span>
            </h2>
            <button
              onClick={() => setShowWithdrawModal(true)}
              disabled={wallet.pendingWithdrawCount > 0 || wallet.available <= 0}
              className="mt-6 w-full py-3 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold rounded-xl"
            >
              {wallet.pendingWithdrawCount > 0 ? "Đang chờ duyệt" : "Rút toàn bộ →"}
            </button>
          </div>

          <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl shadow-sm border border-amber-100 p-6">
            <p className="text-xs font-bold text-amber-700 mb-2">ĐANG CHỜ DUYỆT</p>
            <h2 className="text-4xl font-black text-amber-600">
              {wallet.pendingWithdraw.toLocaleString()} <span className="text-2xl">đ</span>
            </h2>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl shadow-sm border border-purple-100 p-6">
            <p className="text-xs font-bold text-purple-700 mb-2">TỔNG THU NHẬP</p>
            <h2 className="text-4xl font-black text-purple-600">
              {wallet.totalEarned.toLocaleString()} <span className="text-2xl">đ</span>
            </h2>
          </div>

          <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl shadow-sm border border-slate-200 p-6">
            <p className="text-xs font-bold text-slate-700 mb-2">ĐÃ RÚT</p>
            <h2 className="text-4xl font-black text-slate-700">
              {wallet.withdrawn.toLocaleString()} <span className="text-2xl">đ</span>
            </h2>
          </div>
        </div>

        {/* Thông tin ngân hàng */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold">Thông tin rút tiền</h3>
            <button
              onClick={() => setShowBankModal(true)}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              ✏️ Chỉnh sửa
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div><strong>Ngân hàng:</strong> {bankInfo.bankName || "Chưa cập nhật"}</div>
            <div><strong>Số tài khoản:</strong> {bankInfo.bankAccount || "Chưa cập nhật"}</div>
            <div><strong>Chủ tài khoản:</strong> {bankInfo.bankOwner || "Chưa cập nhật"}</div>
            {bankInfo.qrCodeUrl && (
              <div><strong>QR Code:</strong> <a href={bankInfo.qrCodeUrl} target="_blank" className="text-blue-600">Xem QR</a></div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold">Lịch sử giao dịch</h3>
          </div>

          {transactions.length === 0 ? (
            <p className="text-sm text-gray-500">Chưa có giao dịch nào.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 text-left text-gray-500">
                    <th className="pb-3 pr-3">Ngày</th>
                    <th className="pb-3 pr-3">Mô tả</th>
                    <th className="pb-3 pr-3">Loại</th>
                    <th className="pb-3 pr-3">Số tiền</th>
                    <th className="pb-3">Trạng thái</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((item) => (
                    <tr key={item.id} className="border-b border-gray-100">
                      <td className="py-3 pr-3 text-gray-600">{item.date}</td>
                      <td className="py-3 pr-3 text-gray-800">{item.jobTitle}</td>
                      <td className="py-3 pr-3 text-gray-600">{item.type === "WITHDRAW" ? "Rút tiền" : "Nhận thanh toán"}</td>
                      <td className="py-3 pr-3 font-semibold text-gray-900">{item.netAmount.toLocaleString("vi-VN")}đ</td>
                      <td className="py-3">
                        <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${item.status === "SUCCESS" ? "bg-emerald-100 text-emerald-700" : item.status === "PENDING" ? "bg-amber-100 text-amber-700" : "bg-rose-100 text-rose-700"}`}>
                          {item.status === "SUCCESS" ? "Thành công" : item.status === "PENDING" ? "Chờ duyệt" : "Từ chối"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Modal Rút Toàn Bộ */}
        {showWithdrawModal && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 text-center">
              <h3 className="text-2xl font-bold mb-2">Rút toàn bộ số dư</h3>
              <p className="text-4xl font-black text-emerald-600 mb-6">
                {wallet.available.toLocaleString()} đ
              </p>
              <p className="text-gray-600 mb-6">Yêu cầu rút sẽ được gửi cho admin để xác nhận trước khi tiền được chuyển.</p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowWithdrawModal(false)}
                  className="flex-1 py-3 border rounded-xl"
                >
                  Hủy
                </button>
                <button
                  onClick={handleFullWithdraw}
                  disabled={isSubmitting || wallet.pendingWithdrawCount > 0}
                  className="flex-1 py-3 bg-emerald-600 text-white rounded-xl disabled:opacity-70"
                >
                  {isSubmitting ? "Đang xử lý..." : wallet.pendingWithdrawCount > 0 ? "Đang chờ duyệt" : "Xác nhận rút toàn bộ"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal Chỉnh Thông Tin Ngân Hàng */}
        {showBankModal && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-lg w-full p-6">
              <h3 className="text-xl font-bold mb-4">Cập nhật thông tin ngân hàng</h3>
              <form onSubmit={handleBankSubmit} className="space-y-4">
                <input
                  type="text"
                  placeholder="Tên ngân hàng"
                  value={bankInfo.bankName || ""}
                  onChange={(e) => setBankInfo({ ...bankInfo, bankName: e.target.value })}
                  className="w-full border p-3 rounded-xl"
                  required
                />
                <input
                  type="text"
                  placeholder="Số tài khoản"
                  value={bankInfo.bankAccount || ""}
                  onChange={(e) => setBankInfo({ ...bankInfo, bankAccount: e.target.value })}
                  className="w-full border p-3 rounded-xl"
                  required
                />
                <input
                  type="text"
                  placeholder="Tên chủ tài khoản"
                  value={bankInfo.bankOwner || ""}
                  onChange={(e) => setBankInfo({ ...bankInfo, bankOwner: e.target.value })}
                  className="w-full border p-3 rounded-xl"
                  required
                />
                <input
                  type="text"
                  placeholder="Link QR Code (nếu có)"
                  value={bankInfo.qrCodeUrl || ""}
                  onChange={(e) => setBankInfo({ ...bankInfo, qrCodeUrl: e.target.value })}
                  className="w-full border p-3 rounded-xl"
                />
                <div className="flex gap-3 pt-4">
                  <button type="button" onClick={() => setShowBankModal(false)} className="flex-1 py-3 border rounded-xl">
                    Hủy
                  </button>
                  <button type="submit" disabled={isSubmitting} className="flex-1 py-3 bg-blue-600 text-white rounded-xl">
                    {isSubmitting ? "Đang lưu..." : "Lưu thông tin"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}