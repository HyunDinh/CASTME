// src/app/(creator)/revenue/page.js
"use client";
import { useState } from "react";

export default function RevenuePage() {
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [bankInfo, setBankInfo] = useState({ bank: "MBBank", account: "0987654321", name: "NGUYEN VAN A" });

  // Dữ liệu giả lập ví tiền và lịch sử giao dịch
  const wallet = {
    available: 4850000,   // Số dư khả dụng (Có thể rút)
    escrow: 3500000,      // Số tiền đang đóng băng (Đang làm dự án)
    totalEarned: 8350000, // Tổng doanh thu tích lũy từ trước đến nay
  };

  const [transactions, setTransactions] = useState([
    {
      id: "TX-9901",
      jobTitle: "Video Review trải nghiệm không gian trà đạo",
      shopName: "An Nhiên Trà Quán",
      grossAmount: 1800000,
      fee: 1800000 * 0.03,
      netAmount: 1746000,
      type: "RECEIVE", // Nhận tiền từ Job
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
      type: "WITHDRAW", // Rút tiền ra
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
    <div className="space-y-8">
      {/* TIÊU ĐỀ TRANG */}
      <div>
        <h1 className="text-2xl font-black text-gray-950">Ví doanh thu</h1>
        <p className="text-xs text-gray-500">Quản lý thu nhập, theo dõi dòng tiền đóng băng bảo hiểm và thực hiện rút tiền.</p>
      </div>

      {/* KHỐI HIỂN THỊ SỐ DƯ (THẺ TÀI CHÍNH) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Số dư khả dụng */}
        <div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-xs flex flex-col justify-between">
          <div className="space-y-1">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Số dư khả dụng</span>
            <h2 className="text-3xl font-black text-purple-600">{wallet.available.toLocaleString()}đ</h2>
          </div>
          <button 
            onClick={() => setShowWithdrawModal(true)}
            className="mt-6 w-full py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl shadow-md shadow-purple-50 transition cursor-pointer text-center"
          >
            🏧 Rút tiền về Ngân hàng
          </button>
        </div>

        {/* Đang đóng băng bảo hiểm */}
        <div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-xs flex flex-col justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Đang giữ trung gian</span>
              <span className="text-xs cursor-help" title="Tiền Shop đã nạp và được Castme đóng băng an toàn, sẽ giải ngân ngay khi bạn hoàn thành Job">🔒</span>
            </div>
            <h2 className="text-3xl font-black text-amber-500">{wallet.escrow.toLocaleString()}đ</h2>
          </div>
          <p className="text-[11px] text-gray-400 leading-relaxed mt-6">
            Dòng tiền được bảo đảm an toàn 100% từ phía Chủ Shop trước khi bạn bắt đầu sản xuất nội dung.
          </p>
        </div>

        {/* Tổng thu nhập tích lũy */}
        <div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-xs flex flex-col justify-between">
          <div className="space-y-1">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Tổng thu nhập tích lũy</span>
            <h2 className="text-3xl font-black text-gray-900">{wallet.totalEarned.toLocaleString()}đ</h2>
          </div>
          <p className="text-[11px] text-emerald-600 font-semibold leading-relaxed mt-6">
            📈 Chiết khấu cố định 3% phí vận hành trên mỗi giao dịch thành công.
          </p>
        </div>
      </div>

      {/* DANH SÁCH LỊCH SỬ GIAO DỊCH */}
      <section className="space-y-4">
        <h3 className="text-base font-bold text-gray-950">Lịch sử giao dịch</h3>
        
        <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/70 border-b border-gray-100 text-[11px] font-bold uppercase tracking-wider text-gray-400">
                  <th className="p-4 pl-6">Mã GD / Ngày</th>
                  <th className="p-4">Nội dung chi tiết</th>
                  <th className="p-4 text-right">Số tiền gốc</th>
                  <th className="p-4 text-right">Phí sàn (3%)</th>
                  <th className="p-4 text-right pr-6">Thực nhận / Chi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 text-sm">
                {transactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-gray-50/40 transition">
                    {/* Mã GD & Ngày */}
                    <td className="p-4 pl-6 space-y-0.5">
                      <span className="font-mono text-xs font-bold text-gray-500 block">{tx.id}</span>
                      <span className="text-xs text-gray-400 block">{tx.date}</span>
                    </td>
                    
                    {/* Chi tiết nội dung */}
                    <td className="p-4 space-y-0.5 max-w-xs md:max-w-md">
                      <span className="font-semibold text-gray-900 block line-clamp-1">{tx.jobTitle}</span>
                      <span className="text-xs text-gray-400 block">Đối tác: {tx.shopName}</span>
                    </td>

                    {/* Tiền gốc */}
                    <td className="p-4 text-right text-gray-600 font-medium">
                      {tx.grossAmount.toLocaleString()}đ
                    </td>

                    {/* Phí 3% */}
                    <td className="p-4 text-right text-red-400 text-xs font-medium">
                      {tx.fee > 0 ? `-${tx.fee.toLocaleString()}đ` : "-"}
                    </td>

                    {/* Thực nhận */}
                    <td className={`p-4 text-right font-bold pr-6 ${tx.type === "RECEIVE" ? "text-emerald-600" : "text-gray-900"}`}>
                      {tx.type === "RECEIVE" ? "+" : "-"}{tx.netAmount.toLocaleString()}đ
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* --- MODAL RÚT TIỀN (POPUP) --- */}
      {showWithdrawModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-gray-100 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-gray-900">Tạo lệnh rút tiền</h3>
              <button onClick={() => setShowWithdrawModal(false)} className="text-gray-400 hover:text-gray-600 cursor-pointer text-lg">✕</button>
            </div>

            {/* Thông tin tài khoản mặc định */}
            <div className="bg-gray-50 p-3 rounded-xl border border-gray-200 text-xs space-y-1 text-gray-600">
              <p>🏦 Ngân hàng nhận: <span className="font-bold text-gray-900">{bankInfo.bank}</span></p>
              <p>🔢 Số tài khoản: <span className="font-bold text-gray-900">{bankInfo.account}</span></p>
              <p>👤 Chủ tài khoản: <span className="font-bold text-gray-900">{bankInfo.name}</span></p>
            </div>

            <form onSubmit={handleWithdrawSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-gray-600 uppercase">Số tiền muốn rút (đ)</label>
                <input 
                  type="number" 
                  required
                  placeholder="Ví dụ: 1000000"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-purple-500"
                />
                <span className="text-[11px] text-gray-400 block pt-0.5">Rút tối đa: {wallet.available.toLocaleString()}đ</span>
              </div>

              <div className="flex gap-3 pt-2">
                <button 
                  type="button" 
                  onClick={() => setShowWithdrawModal(false)} 
                  className="w-1/2 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold text-xs rounded-xl transition cursor-pointer"
                >
                  Hủy bỏ
                </button>
                <button 
                  type="submit" 
                  className="w-1/2 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl shadow-md transition cursor-pointer"
                >
                  Xác nhận rút
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}