import React, { useState } from "react";
import { X, FileText } from "lucide-react";

export default function ProposalDealModal({ isOpen, onClose, onSubmit, kocName }) {
  const [formData, setFormData] = useState({
    taskName: "",
    videoCount: "1",
    budget: "",
    deadline: "",
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
    setFormData({ taskName: "", videoCount: "1", budget: "", deadline: "" });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-5 border-b border-gray-100 bg-gray-50/50">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-blue-100 text-blue-600 rounded-lg">
              <FileText size={18} />
            </div>
            <h2 className="text-lg font-extrabold text-gray-900">Tạo Hợp Đồng Nhanh</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-gray-200 text-gray-500 rounded-lg transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <p className="text-sm text-gray-500">
            Tạo thẻ hợp đồng để gửi cho <strong>{kocName}</strong> xác nhận điều khoản chốt.
          </p>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-700">Tên công việc</label>
            <input
              type="text"
              required
              placeholder="VD: Quay 1 video TikTok review son..."
              className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-medium"
              value={formData.taskName}
              onChange={(e) => setFormData({ ...formData, taskName: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-700">Số lượng Video</label>
              <input
                type="number"
                required
                min="1"
                className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-medium"
                value={formData.videoCount}
                onChange={(e) => setFormData({ ...formData, videoCount: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-700">Hạn nộp bài</label>
              <input
                type="date"
                required
                className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-medium"
                value={formData.deadline}
                onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-700">Mức thù lao chốt cuối (VND)</label>
            <input
              type="text"
              required
              placeholder="VD: 5,000,000"
              className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-medium"
              value={formData.budget}
              onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl shadow-md transition-colors cursor-pointer"
            >
              Tạo và Gửi Thẻ Hợp Đồng
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
