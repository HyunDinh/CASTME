import React, { useState } from "react";
import { Wallet, Lock, TrendingUp, Plus, Info } from "lucide-react";
import DepositModal from "./DepositModal";

export default function WalletSummary() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        
        {/* Thẻ 1: Số dư khả dụng */}
        <div className="bg-gray-900 rounded-3xl p-6 shadow-xl relative overflow-hidden group">
          {/* Background decoration */}
          <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/5 rounded-full blur-2xl group-hover:bg-white/10 transition-colors"></div>
          
          <div className="relative z-10 flex flex-col h-full justify-between">
            <div className="flex items-center gap-3 text-white/80 mb-6">
              <div className="p-2 bg-white/10 rounded-xl">
                <Wallet size={20} className="text-white" />
              </div>
              <span className="text-sm font-bold uppercase tracking-wider">Số dư khả dụng</span>
            </div>
            
            <div className="mb-6">
              <span className="text-3xl lg:text-4xl font-black text-white">45,000,000</span>
              <span className="text-lg font-bold text-white/60 ml-2">VND</span>
            </div>
            
            <button
              onClick={() => setIsModalOpen(true)}
              className="w-full py-3.5 bg-blue-500 hover:bg-blue-600 text-white font-bold text-sm rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-blue-500/30"
            >
              <Plus size={18} /> Nạp Tiền Vào Ví
            </button>
          </div>
        </div>

        {/* Thẻ 2: Tiền đang đóng băng (Escrow) */}
        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-6">
            <div className="flex items-center gap-3 text-gray-500">
              <div className="p-2 bg-orange-50 rounded-xl">
                <Lock size={20} className="text-orange-500" />
              </div>
              <span className="text-sm font-bold uppercase tracking-wider">Tạm khóa ký quỹ</span>
            </div>
            <div className="group relative cursor-help">
              <Info size={16} className="text-gray-300 hover:text-gray-500 transition-colors" />
              <div className="absolute right-0 bottom-full mb-2 w-48 bg-gray-900 text-white text-[10px] p-2 rounded-lg hidden group-hover:block z-10">
                Số tiền đang được giữ an toàn để chờ chi trả cho các KOC đang làm việc trong Pipeline.
              </div>
            </div>
          </div>
          
          <div>
            <span className="text-3xl lg:text-4xl font-black text-gray-900">12,500,000</span>
            <span className="text-lg font-bold text-gray-400 ml-2">VND</span>
          </div>
          
          <div className="mt-4 pt-4 border-t border-gray-50 flex items-center gap-2 text-xs font-medium text-gray-500">
            <span className="w-2 h-2 rounded-full bg-orange-400"></span>
            Đang giữ cho 3 chiến dịch
          </div>
        </div>

        {/* Thẻ 3: Tổng chi tiêu tháng */}
        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 text-gray-500 mb-6">
            <div className="p-2 bg-emerald-50 rounded-xl">
              <TrendingUp size={20} className="text-emerald-500" />
            </div>
            <span className="text-sm font-bold uppercase tracking-wider">Tổng chi tiêu (Tháng này)</span>
          </div>
          
          <div>
            <span className="text-3xl lg:text-4xl font-black text-gray-900">28,000,000</span>
            <span className="text-lg font-bold text-gray-400 ml-2">VND</span>
          </div>
          
          <div className="mt-4 pt-4 border-t border-gray-50 flex items-center gap-2 text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg w-max">
            <TrendingUp size={14} /> +15% so với tháng trước
          </div>
        </div>

      </div>

      <DepositModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}
