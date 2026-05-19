import React from "react";
import { Search, Filter, Calendar } from "lucide-react";

export default function TransactionFilter({ filterData, setFilterData }) {
  const handleChange = (field, value) => {
    setFilterData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row items-center gap-4 animate-in fade-in duration-500 mb-6">
      
      {/* Search Input */}
      <div className="relative flex-1 w-full">
        <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-400">
          <Search size={18} />
        </span>
        <input
          type="text"
          placeholder="Tìm theo Mã giao dịch, Tên KOC..."
          className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-sm font-medium"
          value={filterData.search}
          onChange={(e) => handleChange("search", e.target.value)}
        />
      </div>

      {/* Lọc loại giao dịch */}
      <div className="relative w-full md:w-auto shrink-0">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
          <Filter size={16} />
        </div>
        <select
          className="w-full md:w-auto pl-10 pr-8 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm font-bold text-gray-700 cursor-pointer appearance-none"
          value={filterData.type}
          onChange={(e) => handleChange("type", e.target.value)}
        >
          <option value="all">Tất cả loại giao dịch</option>
          <option value="deposit">Nạp tiền ví</option>
          <option value="escrow">Tạm khóa ký quỹ</option>
          <option value="payment">Thanh toán hoàn tất</option>
          <option value="refund">Hoàn tiền (Refund)</option>
        </select>
      </div>

      {/* Lọc thời gian */}
      <div className="relative w-full md:w-auto shrink-0">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
          <Calendar size={16} />
        </div>
        <select
          className="w-full md:w-auto pl-10 pr-8 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm font-bold text-gray-700 cursor-pointer appearance-none"
          value={filterData.time}
          onChange={(e) => handleChange("time", e.target.value)}
        >
          <option value="this-month">Tháng này</option>
          <option value="last-month">Tháng trước</option>
          <option value="all-time">Tất cả thời gian</option>
        </select>
      </div>

    </div>
  );
}
