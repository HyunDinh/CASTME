"use client";
import { useState } from "react";

export default function RevenuePage() {
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [bankInfo, setBankInfo] = useState({
    bank: "MBBank",
    account: "0987654321",
    name: "NGUYEN VAN A"
  });

  const wallet = {
    available: 4850000,
    escrow: 3500000,
    totalEarned: 8350000,
  };

  const [transactions, setTransactions] = useState([
    {
      id: "TX-9901",
      jobTitle: "Video Review trải nghiệm không gian trà đạo",
      shopName: "An Nhiên Trà Quán",
      grossAmount: 1800000,
      fee: 1800000 * 0.03,
      netAmount: 1746000,
      type: "RECEIVE",
      status: "SUCCESS",
      date: "12/05/2026",
    },
    {
      id: "TX-9852",
      jobTitle: "Rút tiền về tài khoản ngân hàng",
      shopName: "Hệ thống Castme",
      grossAmount: 2000000,
      fee: 0,
      netAmount: 2000000,
      type: "WITHDRAW",
      status: "SUCCESS",
      date: "05/05/2026",
    },
  ]);

  const handleWithdrawSubmit = (e) => {
    e.preventDefault();
    if (Number(withdrawAmount) > wallet.available) {
      alert("Số tiền rút vượt quá số dư khả dụng hiện có!");
      return;
    }
    alert(`Yêu cầu rút ${Number(withdrawAmount).toLocaleString()}đ đã được gửi lên hệ thống. Castme sẽ chuyển khoản đến số tài khoản ${bankInfo.account} trong vòng 5-10 phút!`);
    setShowWithdrawModal(false);
    setWithdrawAmount("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 pt-6">

        {/* HEADER */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-700 p-8 md:p-12 shadow-xl">
          <div className="absolute -right-20 -top-20 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute -left-20 -bottom-20 w-64 h-64 bg-indigo-400/10 rounded-full blur-3xl" />

          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-1.5 rounded-full mb-4">
              <span className="text-xs font-semibold text-white/90">💼 Quản lý tài chính</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-white mb-3 tracking-tight">
              Ví doanh thu
            </h1>
            <p className="text-sm text-purple-100 max-w-2xl leading-relaxed">
              Theo dõi thu nhập, quản lý dòng tiền bảo hiểm và thực hiện rút tiền nhanh chóng, an toàn.
            </p>
          </div>
        </div>

        {/* WALLET CARDS */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Số dư khả dụng */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-300">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                  Số dư khả dụng
                </p>
                <h2 className="text-4xl font-black text-gray-900 mb-1">
                  {wallet.available.toLocaleString()}
                  <span className="text-2xl ml-1">đ</span>
                </h2>
              </div>
              <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center">
                <span className="text-2xl">💰</span>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100">
              <button
                onClick={() => setShowWithdrawModal(true)}
                className="w-full py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-bold text-sm rounded-xl shadow-lg shadow-emerald-500/20 transition-all duration-300 hover:shadow-xl hover:shadow-emerald-500/30 hover:-translate-y-0.5"
              >
                Rút tiền về ngân hàng →
              </button>
            </div>
          </div>

          {/* Đang giữ trung gian */}
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl shadow-sm border border-amber-100 p-6 hover:shadow-md transition-shadow duration-300">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <p className="text-xs font-bold text-amber-700 uppercase tracking-wider">
                    Đang giữ trung gian
                  </p>
                  <span
                    className="text-amber-600 cursor-help"
                    title="Tiền Shop đã nạp và được Castme đóng băng an toàn"
                  >
                    🔒
                  </span>
                </div>
                <h2 className="text-4xl font-black text-amber-600 mb-1">
                  {wallet.escrow.toLocaleString()}
                  <span className="text-2xl ml-1">đ</span>
                </h2>
              </div>
              <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center">
                <span className="text-2xl">🔐</span>
              </div>
            </div>

            <div className="pt-4 border-t border-amber-200/50">
              <p className="text-xs text-amber-800 leading-relaxed flex items-start gap-2">
                <span className="text-sm flex-shrink-0">ℹ️</span>
                <span>Dòng tiền được bảo đảm an toàn 100% từ Shop trước khi bạn bắt đầu sản xuất.</span>
              </p>
            </div>
          </div>

          {/* Tổng thu nhập */}
          <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl shadow-sm border border-purple-100 p-6 hover:shadow-md transition-shadow duration-300">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-xs font-bold text-purple-700 uppercase tracking-wider mb-2">
                  Tổng thu nhập tích lũy
                </p>
                <h2 className="text-4xl font-black text-purple-600 mb-1">
                  {wallet.totalEarned.toLocaleString()}
                  <span className="text-2xl ml-1">đ</span>
                </h2>
              </div>
              <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center">
                <span className="text-2xl">📊</span>
              </div>
            </div>

            <div className="pt-4 border-t border-purple-200/50">
              <p className="text-xs text-purple-800 leading-relaxed flex items-start gap-2">
                <span className="text-sm flex-shrink-0">💡</span>
                <span>Phí vận hành cố định 3% trên mỗi giao dịch thành công.</span>
              </p>
            </div>
          </div>
        </div>

        {/* LỊCH SỬ GIAO DỊCH */}
        <section className="space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-gray-900">Lịch sử giao dịch</h3>
            <span className="text-sm text-gray-500">{transactions.length} giao dịch</span>
          </div>

          {/* Desktop Table */}
          <div className="hidden md:block bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr className="border-b border-gray-200">
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                      Mã GD
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                      Chi tiết
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-bold text-gray-600 uppercase tracking-wider">
                      Số tiền gốc
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-bold text-gray-600 uppercase tracking-wider">
                      Phí (3%)
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-bold text-gray-600 uppercase tracking-wider">
                      Thực nhận
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {transactions.map((tx) => (
                    <tr key={tx.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="space-y-1">
                          <p className="font-mono text-sm font-semibold text-gray-900">{tx.id}</p>
                          <p className="text-xs text-gray-500">{tx.date}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1 max-w-md">
                          <p className="text-sm font-semibold text-gray-900 line-clamp-1">
                            {tx.jobTitle}
                          </p>
                          <p className="text-xs text-gray-500">
                            <span className="inline-flex items-center gap-1">
                              🏪 {tx.shopName}
                            </span>
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="text-sm font-medium text-gray-700">
                          {tx.grossAmount.toLocaleString()}đ
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="text-sm font-medium text-red-500">
                          {tx.fee > 0 ? `-${tx.fee.toLocaleString()}đ` : "—"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className={`text-sm font-bold ${tx.type === "RECEIVE" ? "text-emerald-600" : "text-gray-900"
                          }`}>
                          {tx.type === "RECEIVE" ? "+" : "−"}{tx.netAmount.toLocaleString()}đ
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden space-y-4">
            {transactions.map((tx) => (
              <div
                key={tx.id}
                className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <p className="font-mono text-xs font-semibold text-gray-900">{tx.id}</p>
                    <p className="text-xs text-gray-500">{tx.date}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${tx.type === "RECEIVE"
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-gray-100 text-gray-700"
                    }`}>
                    {tx.type === "RECEIVE" ? "Nhận tiền" : "Rút tiền"}
                  </span>
                </div>

                <div className="space-y-1">
                  <p className="text-sm font-semibold text-gray-900">{tx.jobTitle}</p>
                  <p className="text-xs text-gray-500">🏪 {tx.shopName}</p>
                </div>

                <div className="pt-3 border-t border-gray-100 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Số tiền gốc:</span>
                    <span className="font-medium text-gray-900">{tx.grossAmount.toLocaleString()}đ</span>
                  </div>
                  {tx.fee > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Phí sàn (3%):</span>
                      <span className="font-medium text-red-500">−{tx.fee.toLocaleString()}đ</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm pt-2 border-t border-gray-100">
                    <span className="font-semibold text-gray-900">Thực nhận:</span>
                    <span className={`font-bold ${tx.type === "RECEIVE" ? "text-emerald-600" : "text-gray-900"
                      }`}>
                      {tx.type === "RECEIVE" ? "+" : "−"}{tx.netAmount.toLocaleString()}đ
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* MODAL RÚT TIỀN */}
        {showWithdrawModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-gray-200 animate-in zoom-in-95 duration-200">

              {/* Header */}
              <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
                    <span className="text-xl">💳</span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">Tạo lệnh rút tiền</h3>
                </div>
                <button
                  onClick={() => setShowWithdrawModal(false)}
                  className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <span className="text-xl">✕</span>
                </button>
              </div>

              {/* Body */}
              <div className="px-6 py-5 space-y-5">

                {/* Thông tin tài khoản */}
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100 space-y-2.5">
                  <p className="text-xs font-bold text-blue-900 uppercase tracking-wider mb-2">
                    Tài khoản nhận tiền
                  </p>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <span className="text-blue-600">🏦</span>
                      <span className="text-gray-600">Ngân hàng:</span>
                      <span className="font-bold text-gray-900 ml-auto">{bankInfo.bank}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-blue-600">🔢</span>
                      <span className="text-gray-600">Số tài khoản:</span>
                      <span className="font-mono font-bold text-gray-900 ml-auto">{bankInfo.account}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-blue-600">👤</span>
                      <span className="text-gray-600">Chủ tài khoản:</span>
                      <span className="font-bold text-gray-900 ml-auto">{bankInfo.name}</span>
                    </div>
                  </div>
                </div>

                {/* Form nhập số tiền */}
                <form onSubmit={handleWithdrawSubmit} className="space-y-5">
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-900">
                      Số tiền muốn rút
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        required
                        placeholder="Nhập số tiền"
                        value={withdrawAmount}
                        onChange={(e) => setWithdrawAmount(e.target.value)}
                        className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-base font-medium focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-50 transition-all"
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium">
                        đ
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-500">Số dư khả dụng:</span>
                      <span className="font-bold text-emerald-600">{wallet.available.toLocaleString()}đ</span>
                    </div>
                  </div>

                  {/* Quick amount buttons */}
                  <div className="grid grid-cols-3 gap-2">
                    {[500000, 1000000, wallet.available].map((amount) => (
                      <button
                        key={amount}
                        type="button"
                        onClick={() => setWithdrawAmount(amount.toString())}
                        className="px-3 py-2 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg text-xs font-semibold text-gray-700 transition-colors"
                      >
                        {amount >= wallet.available ? 'Tất cả' : `${(amount / 1000000).toFixed(1)}M`}
                      </button>
                    ))}
                  </div>

                  {/* Action buttons */}
                  <div className="flex gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowWithdrawModal(false)}
                      className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-sm rounded-xl transition-colors"
                    >
                      Hủy bỏ
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-bold text-sm rounded-xl shadow-lg shadow-emerald-500/30 transition-all hover:shadow-xl hover:shadow-emerald-500/40"
                    >
                      Xác nhận rút tiền
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}