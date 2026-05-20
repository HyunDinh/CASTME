import React, { useState } from "react";
import { X, QrCode, CreditCard, Building2, Copy, CheckCircle2 } from "lucide-react";

export default function DepositModal({ isOpen, onClose }) {
  const [method, setMethod] = useState("qr"); // 'qr' | 'card'
  const [amount, setAmount] = useState("");
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDeposit = (e) => {
    e.preventDefault();
    alert(`Đã gửi yêu cầu nạp ${amount} VND. Đang chờ hệ thống xử lý.`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gray-50/50">
          <h2 className="text-xl font-extrabold text-gray-900">Nạp tiền vào ví</h2>
          <button
            onClick={onClose}
            className="p-2 bg-white hover:bg-gray-100 text-gray-500 rounded-full transition-colors cursor-pointer shadow-sm border border-gray-200"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          
          {/* Chọn số tiền */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700">Số tiền cần nạp (VND)</label>
            <input
              type="text"
              placeholder="VD: 5,000,000"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg font-bold text-gray-900"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
            <div className="flex gap-2 mt-2">
              {[1000000, 2000000, 5000000].map(val => (
                <button 
                  key={val}
                  onClick={() => setAmount(val.toLocaleString())}
                  className="px-3 py-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 text-xs font-bold rounded-lg transition-colors cursor-pointer"
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
                onClick={() => setMethod("qr")}
                className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all cursor-pointer ${
                  method === "qr" ? "border-blue-600 bg-blue-50/50" : "border-gray-100 hover:border-gray-200"
                }`}
              >
                <div className={`p-3 rounded-full ${method === "qr" ? "bg-blue-100 text-blue-600" : "bg-gray-100 text-gray-500"}`}>
                  <QrCode size={24} />
                </div>
                <span className={`text-sm font-bold ${method === "qr" ? "text-blue-700" : "text-gray-600"}`}>Chuyển khoản QR</span>
              </button>
              <button
                onClick={() => setMethod("card")}
                className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all cursor-pointer ${
                  method === "card" ? "border-blue-600 bg-blue-50/50" : "border-gray-100 hover:border-gray-200"
                }`}
              >
                <div className={`p-3 rounded-full ${method === "card" ? "bg-blue-100 text-blue-600" : "bg-gray-100 text-gray-500"}`}>
                  <CreditCard size={24} />
                </div>
                <span className={`text-sm font-bold ${method === "card" ? "text-blue-700" : "text-gray-600"}`}>Thẻ Visa/Master</span>
              </button>
            </div>
          </div>

          {/* Hiển thị chi tiết phương thức */}
          {method === "qr" && (
            <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100 flex flex-col items-center gap-4">
              <div className="w-32 h-32 bg-white rounded-xl border border-gray-200 p-2 shadow-sm flex items-center justify-center">
                <QrCode size={80} className="text-gray-800" />
              </div>
              <div className="w-full space-y-2">
                <div className="flex justify-between items-center bg-white p-2.5 rounded-lg border border-gray-200">
                  <span className="text-xs text-gray-500">Ngân hàng</span>
                  <span className="text-sm font-bold text-gray-900 flex items-center gap-1.5"><Building2 size={14}/> Vietcombank</span>
                </div>
                <div className="flex justify-between items-center bg-white p-2.5 rounded-lg border border-gray-200">
                  <span className="text-xs text-gray-500">Số tài khoản</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-gray-900">0123456789</span>
                    <button onClick={() => handleCopy("0123456789")} className="text-blue-600 hover:text-blue-800 cursor-pointer">
                      {copied ? <CheckCircle2 size={16} className="text-green-500"/> : <Copy size={16} />}
                    </button>
                  </div>
                </div>
                <p className="text-[11px] text-center text-red-500 font-medium italic mt-2">
                  * Nội dung chuyển khoản: Tên Shop + CASTME
                </p>
              </div>
            </div>
          )}

          {method === "card" && (
            <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100 text-center space-y-3">
              <CreditCard size={48} className="mx-auto text-gray-400" />
              <p className="text-sm text-gray-600">Bạn sẽ được chuyển hướng đến cổng thanh toán an toàn của Stripe.</p>
            </div>
          )}

          <button
            onClick={handleDeposit}
            disabled={!amount}
            className="w-full py-3.5 bg-gray-900 hover:bg-gray-800 disabled:bg-gray-300 text-white font-bold text-sm rounded-xl shadow-md transition-colors cursor-pointer"
          >
            Xác nhận nạp tiền
          </button>
        </div>
      </div>
    </div>
  );
}
