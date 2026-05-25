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
      // Có thể reload page hoặc cập nhật state hearts
      window.location.reload();
    } else {
      alert(`❌ ${result.error}`);
    }

    setIsProcessing(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden">
        <div className="flex justify-between items-center border-b p-6">
          <h2 className="text-xl font-bold">Nạp Thêm Trái Tim</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={24} />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {packages.map((pkg) => (
            <div
              key={pkg.id}
              onClick={() => setSelectedPackage(pkg)}
              className={`border-2 rounded-2xl p-4 cursor-pointer transition-all ${
                selectedPackage?.id === pkg.id 
                  ? "border-purple-600 bg-purple-50" 
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <div className="flex justify-between items-center">
                <div>
                  <span className="text-2xl font-black text-purple-600">{pkg.hearts}</span>
                  <span className="text-lg font-semibold text-purple-600 ml-1">❤️</span>
                </div>
                {pkg.popular && (
                  <span className="text-xs font-bold bg-orange-100 text-orange-600 px-3 py-1 rounded-full">Phổ biến</span>
                )}
                <div className="text-right">
                  <p className="font-bold text-lg">{pkg.price.toLocaleString('vi-VN')}đ</p>
                  <p className="text-xs text-gray-500">≈ {(pkg.price / pkg.hearts).toFixed(0)}đ / Tim</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="p-6 border-t bg-gray-50">
          <button
            onClick={handleRecharge}
            disabled={!selectedPackage || isProcessing}
            className="w-full py-4 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white font-bold rounded-2xl transition"
          >
            {isProcessing ? "Đang xử lý..." : `Nạp ngay ${selectedPackage?.hearts || ''} Tim`}
          </button>
          <p className="text-center text-xs text-gray-500 mt-4">
            Thanh toán qua chuyển khoản / Ví điện tử
          </p>
        </div>
      </div>
    </div>
  );
}