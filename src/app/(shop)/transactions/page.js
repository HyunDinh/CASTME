"use client";

import React, { useState } from "react";
import WalletSummary from "#/components/transactions/WalletSummary";
import TransactionFilter from "#/components/transactions/TransactionFilter";
import TransactionTable from "#/components/transactions/TransactionTable";

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

  // Filter logic
  const filteredTransactions = mockTransactions.filter((txn) => {
    // 1. Search filter
    const searchLower = filterData.search.toLowerCase();
    const matchesSearch = 
      txn.id.toLowerCase().includes(searchLower) ||
      (txn.kocName && txn.kocName.toLowerCase().includes(searchLower));

    // 2. Type filter
    const matchesType = filterData.type === "all" || txn.type === filterData.type;

    // 3. Time filter (Giả lập đơn giản)
    let matchesTime = true;
    if (filterData.time === "this-month") {
      matchesTime = txn.date.includes("05/2026") || txn.date.includes("Hôm nay");
    } else if (filterData.time === "last-month") {
      matchesTime = txn.date.includes("04/2026");
    }

    return matchesSearch && matchesType && matchesTime;
  });

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto w-full space-y-6">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900">Giao dịch & Tài chính</h1>
        <p className="text-sm text-gray-500 mt-1">Quản lý số dư ví, nạp tiền và lịch sử dòng tiền của shop.</p>
      </div>

      {/* Wallet Summary */}
      <WalletSummary />

      {/* Lịch sử giao dịch */}
      <div>
        <h2 className="text-xl font-extrabold text-gray-900 mb-4">Lịch sử giao dịch</h2>
        <TransactionFilter filterData={filterData} setFilterData={setFilterData} />
        <TransactionTable transactions={filteredTransactions} />
      </div>

    </div>
  );
}