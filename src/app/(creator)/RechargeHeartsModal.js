"use client";
import React, { useState } from "react";
import { X } from "lucide-react";
import { rechargeHearts } from "#/app/(creator)/actions";

const packages = [
  { id: 1, hearts: 50, price: 150000, popular: false },
  { id: 2, hearts: 100, price: 280000, popular: true },
  { id: 3, hearts: 200, price: 520000, popular: false },
  { id: 4, hearts: 500, price: 1200000, popular: false },
];

export default function RechargeHeartsModal({ isOpen, onClose }) {
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleRecharge = async () => {
    if (!selectedPackage) return;

    setIsProcessing(true);
    const result = await rechargeHearts(selectedPackage.hearts, selectedPackage.price);

    if (result.success) {
      alert(`✅ Nạp thành công ${selectedPackage.hearts} Tim!`);
      onClose();
      window.location.reload();
    } else {
      alert(`❌ ${result.error}`);
    }

    setIsProcessing(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden border border-gray-100 shadow-2xl animate-scale-in">
        <div className="flex justify-between items-center border-b p-6">
          <h2 className="text-xl font-bold font-sans text-gray-800">Nạp Thêm Trái Tim</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors p-1 hover:bg-gray-100 rounded-full">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {packages.map((pkg) => (
            <div
              key={pkg.id}
              onClick={() => setSelectedPackage(pkg)}
              className={`border-2 rounded-2xl p-4 cursor-pointer transition-all ${
                selectedPackage?.id === pkg.id 
                  ? "border-blue-500 bg-blue-50/50" 
                  : "border-gray-100 hover:border-gray-200"
              }`}
            >
              <div className="flex justify-between items-center">
                <div>
                  <span className="text-2xl font-black text-blue-600">{pkg.hearts}</span>
                  <span className="text-lg font-semibold ml-1">❤️</span>
                </div>
                {pkg.popular && (
                  <span className="text-xs font-bold bg-blue-100 text-blue-600 px-3 py-1 rounded-full">Phổ biến</span>
                )}
                <div className="text-right">
                  <p className="font-bold text-lg text-gray-800">{pkg.price.toLocaleString('vi-VN')}đ</p>
                  <p className="text-xs text-gray-400">≈ {(pkg.price / pkg.hearts).toFixed(0)}đ / Tim</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="p-6 border-t bg-gray-50/50">
          <button
            onClick={handleRecharge}
            disabled={!selectedPackage || isProcessing}
            className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white font-bold rounded-2xl transition-all shadow-md shadow-blue-500/20 disabled:shadow-none"
          >
            {isProcessing ? "Đang xử lý..." : `Nạp ngay ${selectedPackage?.hearts || ''} Tim`}
          </button>
          <p className="text-center text-xs text-gray-400 mt-4">
            Thanh toán an toàn qua chuyển khoản ngân hàng
          </p>
        </div>
      </div>
    </div>
  );
}