import React from "react";
import { ArrowUpRight, ArrowDownRight, RefreshCcw, Lock } from "lucide-react";

const getTypeStyles = (type) => {
  switch (type) {
    case "deposit":
      return { bg: "bg-emerald-50", text: "text-emerald-700", icon: <ArrowDownRight size={14} />, label: "Nạp tiền" };
    case "escrow":
      return { bg: "bg-amber-50", text: "text-amber-700", icon: <Lock size={14} />, label: "Ký quỹ" };
    case "payment":
      return { bg: "bg-blue-50", text: "text-blue-700", icon: <ArrowUpRight size={14} />, label: "Thanh toán" };
    case "refund":
      return { bg: "bg-red-50", text: "text-red-700", icon: <RefreshCcw size={14} />, label: "Hoàn tiền" };
    default:
      return { bg: "bg-gray-50", text: "text-gray-700", icon: null, label: "Khác" };
  }
};

const getStatusStyles = (status) => {
  switch (status) {
    case "success":
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    case "pending":
      return "bg-amber-50 text-amber-700 border-amber-200";
    case "failed":
      return "bg-red-50 text-red-700 border-red-200";
    default:
      return "bg-gray-50 text-gray-700 border-gray-200";
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

const getAmountColor = (type) => {
  if (type === "deposit" || type === "refund") return "text-emerald-600";
  return "text-gray-900"; // escrow and payment are technically negative to balance
};

const formatAmount = (amount, type) => {
  const prefix = (type === "deposit" || type === "refund") ? "+" : "-";
  return `${prefix}${Math.abs(amount).toLocaleString()}đ`;
};

export default function TransactionTable({ transactions }) {
  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-xs overflow-hidden animate-in fade-in duration-500">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[900px]">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100 text-[11px] text-gray-500 font-bold uppercase tracking-wider">
              <th className="p-5 pl-6">Mã Giao Dịch</th>
              <th className="p-5">Loại Giao Dịch</th>
              <th className="p-5">Đối tác / Chiến dịch</th>
              <th className="p-5 text-right">Số Tiền</th>
              <th className="p-5 pr-6 text-right">Trạng Thái</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {transactions.map((txn) => {
              const typeStyle = getTypeStyles(txn.type);
              
              return (
                <tr key={txn.id} className="hover:bg-gray-50/50 transition-colors group">
                  
                  {/* Mã GD & Thời gian */}
                  <td className="p-5 pl-6">
                    <p className="font-bold text-gray-900 text-sm group-hover:text-blue-600 transition-colors cursor-pointer">
                      {txn.id}
                    </p>
                    <p className="text-xs text-gray-500 mt-1 font-medium">{txn.date}</p>
                  </td>

                  {/* Loại GD */}
                  <td className="p-5">
                    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold ${typeStyle.bg} ${typeStyle.text}`}>
                      {typeStyle.icon}
                      {typeStyle.label}
                    </div>
                  </td>

                  {/* KOC & Campaign */}
                  <td className="p-5">
                    {txn.kocName ? (
                      <div>
                        <p className="font-bold text-gray-900 text-sm">{txn.kocName}</p>
                        <p className="text-[11px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full w-max mt-1 border border-indigo-100">
                          {txn.campaign}
                        </p>
                      </div>
                    ) : (
                      <p className="text-sm font-medium text-gray-500 italic">Giao dịch hệ thống</p>
                    )}
                  </td>

                  {/* Số tiền */}
                  <td className="p-5 text-right">
                    <p className={`font-black text-base ${getAmountColor(txn.type)}`}>
                      {formatAmount(txn.amount, txn.type)}
                    </p>
                  </td>

                  {/* Trạng thái */}
                  <td className="p-5 pr-6 text-right">
                    <span className={`inline-block px-3 py-1.5 rounded-xl text-xs font-bold border ${getStatusStyles(txn.status)}`}>
                      {getStatusLabel(txn.status)}
                    </span>
                  </td>

                </tr>
              );
            })}
          </tbody>
        </table>

        {transactions.length === 0 && (
          <div className="py-20 text-center flex flex-col items-center justify-center bg-gray-50/50">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-3xl mb-4 shadow-sm border border-gray-100">📭</div>
            <h3 className="text-lg font-bold text-gray-900">Không có giao dịch nào</h3>
            <p className="text-gray-500 mt-1 text-sm">Thử thay đổi bộ lọc để tìm kiếm lại.</p>
          </div>
        )}
      </div>
    </div>
  );
}
