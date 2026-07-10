"use client";
import React, { useState } from "react";
import { 
  Wallet, 
  Lock, 
  TrendingUp, 
  Plus, 
  Info, 
  Search, 
  ArrowUpRight, 
  ArrowDownRight, 
  RefreshCcw, 
  X, 
  QrCode, 
  CreditCard, 
  Building2, 
  Copy, 
  CheckCircle2, 
  Calendar,
  Filter
} from "lucide-react";

// MOCK DATA
const mockTransactions = [
  {
    id: "TXN-2026-8941",
    date: "15/05/2026 14:30",
    type: "deposit",
    kocName: null,
    campaign: null,
    amount: 15000000,
    status: "success",
  },
  {
    id: "TXN-2026-8942",
    date: "14/05/2026 09:15",
    type: "escrow",
    kocName: "Thảo Vy Review",
    campaign: "Review BST Mùa Hè 2026",
    amount: 5000000,
    status: "success",
  },
  {
    id: "TXN-2026-8943",
    date: "12/05/2026 16:45",
    type: "payment",
    kocName: "Hoàng Phong",
    campaign: "Quay Video TikTok Dance",
    amount: 3000000,
    status: "success",
  },
  {
    id: "TXN-2026-8944",
    date: "10/05/2026 10:00",
    type: "deposit",
    kocName: null,
    campaign: null,
    amount: 20000000,
    status: "failed",
  },
  {
    id: "TXN-2026-8945",
    date: "08/05/2026 11:20",
    type: "refund",
    kocName: "Linh Đan",
    campaign: "Chụp Lookbook Mùa Thu",
    amount: 4000000,
    status: "success",
  },
  {
    id: "TXN-2026-8946",
    date: "Hôm nay 08:00",
    type: "escrow",
    kocName: "Khoa Style",
    campaign: "Chụp ảnh sản phẩm mới",
    amount: 2500000,
    status: "pending",
  },
];

export default function TransactionsPage() {
  const [filterData, setFilterData] = useState({
    search: "",
    type: "all",
    time: "all-time",
  });
  
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [depositAmount, setDepositAmount] = useState("");
  const [depositMethod, setDepositMethod] = useState("qr"); // 'qr' | 'card'
  const [copied, setCopied] = useState(false);

  const wallet = {
    available: 45000000,
    escrow: 12500000,
    totalSpent: 28000000,
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDepositSubmit = (e) => {
    e.preventDefault();
    alert(`Yêu cầu nạp ${Number(depositAmount.replace(/[^0-9]/g, "")).toLocaleString()}đ đã được gửi lên hệ thống. Đang chờ xác nhận giao dịch!`);
    setShowDepositModal(false);
    setDepositAmount("");
  };

  // Filter logic
  const filteredTransactions = mockTransactions.filter((txn) => {
    const searchLower = filterData.search.toLowerCase();
    const matchesSearch = 
      txn.id.toLowerCase().includes(searchLower) ||
      (txn.kocName && txn.kocName.toLowerCase().includes(searchLower)) ||
      (txn.campaign && txn.campaign.toLowerCase().includes(searchLower));

    const matchesType = filterData.type === "all" || txn.type === filterData.type;

    let matchesTime = true;
    if (filterData.time === "this-month") {
      matchesTime = txn.date.includes("05/2026") || txn.date.includes("Hôm nay");
    } else if (filterData.time === "last-month") {
      matchesTime = txn.date.includes("04/2026");
    }

    return matchesSearch && matchesType && matchesTime;
  });

  const getTypeStyles = (type) => {
    switch (type) {
      case "deposit":
        return { bg: "bg-emerald-50 text-emerald-700 border-emerald-100", icon: <ArrowDownRight size={13} />, label: "Nạp tiền" };
      case "escrow":
        return { bg: "bg-amber-50 text-amber-700 border-amber-100", icon: <Lock size={13} />, label: "Ký quỹ" };
      case "payment":
        return { bg: "bg-blue-50 text-blue-700 border-blue-100", icon: <ArrowUpRight size={13} />, label: "Thanh toán" };
      case "refund":
        return { bg: "bg-red-50 text-red-700 border-red-100", icon: <RefreshCcw size={13} />, label: "Hoàn tiền" };
      default:
        return { bg: "bg-gray-50 text-gray-700 border-gray-100", icon: null, label: "Khác" };
    }
  };

  const getStatusStyles = (status) => {
    switch (status) {
      case "success": return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "pending": return "bg-amber-50 text-amber-700 border-amber-200";
      case "failed": return "bg-red-50 text-red-700 border-red-200";
      default: return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case "success": return "Thành công 🟢";
      case "pending": return "Đang xử lý 🟡";
      case "failed": return "Thất bại 🔴";
      default: return status;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 pt-6">

        {/* ── HEADER BANNER ── */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-700 p-8 md:p-12 shadow-xl">
          <div className="absolute -right-20 -top-20 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute -left-20 -bottom-20 w-64 h-64 bg-indigo-400/10 rounded-full blur-3xl" />

          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-1.5 rounded-full mb-4">
              <span className="text-xs font-semibold text-white/90">💼 Quản lý tài chính Shop</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-white mb-3 tracking-tight">
              Ví & Lịch sử giao dịch
            </h1>
            <p className="text-sm text-purple-100 max-w-2xl leading-relaxed">
              Quản lý dòng tiền bảo hiểm ký quỹ, nạp tiền vào tài khoản và kiểm soát ngân sách chi trả cho KOC.
            </p>
          </div>
        </div>

        {/* ── WALLET CARDS ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Card 1: Số dư khả dụng */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-300 flex flex-col justify-between">
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
              <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center">
                <span className="text-2xl">💰</span>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100">
              <button
                onClick={() => setShowDepositModal(true)}
                className="w-full py-3 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-bold text-sm rounded-xl shadow-lg shadow-purple-500/20 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/30 hover:-translate-y-0.5 border-none cursor-pointer"
              >
                Nạp tiền vào ví →
              </button>
            </div>
          </div>

          {/* Card 2: Đang ký quỹ */}
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl shadow-sm border border-amber-100 p-6 hover:shadow-md transition-shadow duration-300 flex flex-col justify-between">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <p className="text-xs font-bold text-amber-700 uppercase tracking-wider">
                    Tạm khóa ký quỹ (Escrow)
                  </p>
                  <span className="text-amber-600 cursor-help" title="Tiền đang đóng băng để bảo đảm chi trả cho Creator">🔒</span>
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
                <span>Dòng tiền được bảo chứng an toàn để KOC yên tâm bắt đầu thực hiện sản xuất video.</span>
              </p>
            </div>
          </div>

          {/* Card 3: Tổng chi tiêu */}
          <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl shadow-sm border border-purple-100 p-6 hover:shadow-md transition-shadow duration-300 flex flex-col justify-between">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-xs font-bold text-purple-700 uppercase tracking-wider mb-2">
                  Tổng chi tiêu (Tháng này)
                </p>
                <h2 className="text-4xl font-black text-purple-600 mb-1">
                  {wallet.totalSpent.toLocaleString()}
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
                <span>Chi phí giao dịch cực ưu đãi, hỗ trợ nhãn hàng tối đa hóa doanh thu tiếp thị.</span>
              </p>
            </div>
          </div>

        </div>

        {/* ── FILTER & TRANSACTIONS TABLE ── */}
        <section className="space-y-5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <h3 className="text-xl font-bold text-gray-900">Lịch sử giao dịch</h3>
            <span className="text-sm text-gray-500 font-semibold">{filteredTransactions.length} giao dịch được tìm thấy</span>
          </div>

          {/* Filters Row */}
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search Input */}
            <div className="relative flex items-center">
              <input
                type="text"
                placeholder="Tìm mã giao dịch, tên KOC..."
                value={filterData.search}
                onChange={(e) => setFilterData({ ...filterData, search: e.target.value })}
                className="w-full px-4 py-2.5 pl-10 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-600/20 focus:border-purple-600"
              />
              <Search size={16} className="text-gray-400 absolute left-3.5" />
            </div>

            {/* Type Filter */}
            <div className="relative flex items-center">
              <select
                value={filterData.type}
                onChange={(e) => setFilterData({ ...filterData, type: e.target.value })}
                className="w-full px-4 py-2.5 pl-10 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-600/20 focus:border-purple-600 appearance-none bg-white"
              >
                <option value="all">Tất cả loại giao dịch</option>
                <option value="deposit">Nạp tiền</option>
                <option value="escrow">Ký quỹ</option>
                <option value="payment">Thanh toán</option>
                <option value="refund">Hoàn tiền</option>
              </select>
              <Filter size={15} className="text-gray-400 absolute left-3.5 pointer-events-none" />
            </div>

            {/* Time Filter */}
            <div className="relative flex items-center">
              <select
                value={filterData.time}
                onChange={(e) => setFilterData({ ...filterData, time: e.target.value })}
                className="w-full px-4 py-2.5 pl-10 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-600/20 focus:border-purple-600 appearance-none bg-white"
              >
                <option value="all-time">Tất cả thời gian</option>
                <option value="this-month">Tháng này (05/2026)</option>
                <option value="last-month">Tháng trước (04/2026)</option>
              </select>
              <Calendar size={15} className="text-gray-400 absolute left-3.5 pointer-events-none" />
            </div>
          </div>

          {/* Desktop Table View */}
          <div className="hidden md:block bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-gray-50">
                  <tr className="border-b border-gray-200 text-[11px] text-gray-500 font-bold uppercase tracking-wider">
                    <th className="px-6 py-4 pl-8">Mã GD / Ngày</th>
                    <th className="px-6 py-4">Loại GD</th>
                    <th className="px-6 py-4">Đối tác / Chiến dịch</th>
                    <th className="px-6 py-4 text-right">Số tiền</th>
                    <th className="px-6 py-4 text-right pr-8">Trạng thái</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredTransactions.map((txn) => {
                    const typeStyle = getTypeStyles(txn.type);
                    const isPlus = txn.type === "deposit" || txn.type === "refund";
                    return (
                      <tr key={txn.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap pl-8">
                          <div className="space-y-1">
                            <p className="font-mono text-sm font-semibold text-gray-900">{txn.id}</p>
                            <p className="text-xs text-gray-500">{txn.date}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold border ${typeStyle.bg}`}>
                            {typeStyle.icon}
                            {typeStyle.label}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          {txn.kocName ? (
                            <div className="space-y-1">
                              <p className="text-sm font-bold text-gray-900">{txn.kocName}</p>
                              <p className="text-xs text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full w-max border border-purple-100 font-semibold">{txn.campaign}</p>
                            </div>
                          ) : (
                            <p className="text-sm font-medium text-gray-400 italic">Hệ thống Castme</p>
                          )}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <span className={`text-base font-black ${isPlus ? "text-emerald-600" : "text-gray-900"}`}>
                            {isPlus ? "+" : "-"}{txn.amount.toLocaleString()}đ
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right pr-8">
                          <span className={`inline-block px-3 py-1.5 rounded-xl text-xs font-bold border ${getStatusStyles(txn.status)}`}>
                            {getStatusLabel(txn.status)}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                  {filteredTransactions.length === 0 && (
                    <tr>
                      <td colSpan={5} className="py-20 text-center">
                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-3xl mx-auto mb-4 border border-dashed border-gray-200">📭</div>
                        <h3 className="text-lg font-bold text-gray-900">Không có giao dịch nào</h3>
                        <p className="text-gray-500 text-sm">Thử đổi từ khóa hoặc bộ lọc khác.</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile Cards View */}
          <div className="md:hidden space-y-4">
            {filteredTransactions.map((txn) => {
              const typeStyle = getTypeStyles(txn.type);
              const isPlus = txn.type === "deposit" || txn.type === "refund";
              return (
                <div key={txn.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-mono text-xs font-semibold text-gray-900">{txn.id}</p>
                      <p className="text-[10px] text-gray-400 mt-0.5">{txn.date}</p>
                    </div>
                    <span className={`px-2.5 py-1 rounded-lg text-xs font-bold border ${typeStyle.bg}`}>
                      {typeStyle.label}
                    </span>
                  </div>

                  {txn.kocName ? (
                    <div className="space-y-1">
                      <p className="text-sm font-bold text-gray-950">{txn.kocName}</p>
                      <p className="text-[11px] text-purple-600 bg-purple-50 px-2 py-0.5 rounded-md border border-purple-100 w-max font-semibold">{txn.campaign}</p>
                    </div>
                  ) : (
                    <p className="text-xs text-gray-400 italic">Hệ thống Castme</p>
                  )}

                  <div className="pt-3 border-t border-gray-50 flex items-center justify-between">
                    <span className={`text-lg font-black ${isPlus ? "text-emerald-600" : "text-gray-950"}`}>
                      {isPlus ? "+" : "-"}{txn.amount.toLocaleString()}đ
                    </span>
                    <span className={`inline-block px-2.5 py-1 rounded-lg text-xs font-bold border ${getStatusStyles(txn.status)}`}>
                      {getStatusLabel(txn.status)}
                    </span>
                  </div>
                </div>
              );
            })}
            {filteredTransactions.length === 0 && (
              <div className="bg-white rounded-2xl border border-dashed border-gray-200 py-16 text-center">
                <span className="text-3xl">📭</span>
                <p className="text-sm text-gray-500 mt-2 font-medium">Không tìm thấy giao dịch nào phù hợp.</p>
              </div>
            )}
          </div>
        </section>

        {/* ── DEPOSIT MODAL ── */}
        {showDepositModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
              
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gray-50/50">
                <h2 className="text-xl font-extrabold text-gray-900">Nạp tiền vào ví</h2>
                <button
                  onClick={() => setShowDepositModal(false)}
                  className="p-2 bg-white hover:bg-gray-100 text-gray-500 rounded-full transition-colors cursor-pointer shadow-sm border border-gray-200 flex items-center justify-center"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Body */}
              <form onSubmit={handleDepositSubmit} className="p-6 space-y-6">
                
                {/* Chọn số tiền */}
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">Số tiền cần nạp (VND)</label>
                  <input
                    type="text"
                    required
                    placeholder="VD: 5,000,000"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-lg font-bold text-gray-900"
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(e.target.value)}
                  />
                  <div className="flex gap-2 mt-2">
                    {[1000000, 2000000, 5000000, 10000000].map(val => (
                      <button 
                        type="button"
                        key={val}
                        onClick={() => setDepositAmount(val.toLocaleString())}
                        className="px-3 py-1.5 bg-purple-50 text-purple-600 hover:bg-purple-100 text-xs font-bold rounded-lg transition-colors cursor-pointer border-none"
                      >
                        {val.toLocaleString()}đ
                      </button>
                    ))}
                  </div>
                </div>

                {/* Chọn phương thức */}
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">Phương thức thanh toán</label>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() => setDepositMethod("qr")}
                      className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all cursor-pointer border-solid bg-transparent ${
                        depositMethod === "qr" ? "border-purple-600 bg-purple-50/50" : "border-gray-100 hover:border-gray-200"
                      }`}
                    >
                      <div className={`p-3 rounded-full ${depositMethod === "qr" ? "bg-purple-100 text-purple-600" : "bg-gray-100 text-gray-500"}`}>
                        <QrCode size={24} />
                      </div>
                      <span className={`text-sm font-bold ${depositMethod === "qr" ? "text-purple-700" : "text-gray-600"}`}>Chuyển khoản QR</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setDepositMethod("card")}
                      className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all cursor-pointer border-solid bg-transparent ${
                        depositMethod === "card" ? "border-purple-600 bg-purple-50/50" : "border-gray-100 hover:border-gray-200"
                      }`}
                    >
                      <div className={`p-3 rounded-full ${depositMethod === "card" ? "bg-purple-100 text-purple-600" : "bg-gray-100 text-gray-500"}`}>
                        <CreditCard size={24} />
                      </div>
                      <span className={`text-sm font-bold ${depositMethod === "card" ? "text-purple-700" : "text-gray-600"}`}>Thẻ Visa/Master</span>
                    </button>
                  </div>
                </div>

                {/* Hiển thị chi tiết phương thức */}
                {depositMethod === "qr" && (
                  <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100 flex flex-col items-center gap-4">
                    <div className="w-32 h-32 bg-white rounded-xl border border-gray-200 p-2 shadow-sm flex items-center justify-center">
                      <QrCode size={80} className="text-gray-800" />
                    </div>
                    <div className="w-full space-y-2">
                      <div className="flex justify-between items-center bg-white p-2.5 rounded-lg border border-gray-200">
                        <span className="text-xs text-gray-500">Ngân hàng</span>
                        <span className="text-sm font-bold text-gray-900 flex items-center gap-1.5"><Building2 size={14}/> MBBank</span>
                      </div>
                      <div className="flex justify-between items-center bg-white p-2.5 rounded-lg border border-gray-200">
                        <span className="text-xs text-gray-500">Số tài khoản</span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-gray-900">0987654321</span>
                          <button type="button" onClick={() => handleCopy("0987654321")} className="text-purple-600 hover:text-purple-800 cursor-pointer border-none bg-transparent flex">
                            {copied ? <CheckCircle2 size={16} className="text-green-500"/> : <Copy size={16} />}
                          </button>
                        </div>
                      </div>
                      <p className="text-[11px] text-center text-red-500 font-medium italic mt-2">
                        * Nội dung chuyển khoản: Tên Shop + CASTME nạp tiền
                      </p>
                    </div>
                  </div>
                )}

                {depositMethod === "card" && (
                  <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100 text-center space-y-3">
                    <CreditCard size={48} className="mx-auto text-gray-400" />
                    <p className="text-sm text-gray-600">Bạn sẽ được chuyển hướng đến cổng thanh toán bảo mật 3D-Secure.</p>
                  </div>
                )}

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowDepositModal(false)}
                    className="flex-1 py-3.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-sm rounded-xl transition-colors border-none cursor-pointer"
                  >
                    Hủy bỏ
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3.5 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-bold text-sm rounded-xl shadow-md transition-colors border-none cursor-pointer"
                  >
                    Xác nhận đã chuyển
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