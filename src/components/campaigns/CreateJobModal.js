import React, { useState } from "react";
import { X } from "lucide-react";
import { createJobAction } from "#/app/(shop)/my-casting/actions";

export default function CreateJobModal({ isOpen, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    title: "",
    vibe: "",
    budget: "",
    description: "",
  });

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Tạm thời hardcode ID giống như trong JobList của bạn. 
    // (Thực tế bạn phải lấy ID thật của user đang đăng nhập nhé)
    const currentShopId = "shop-user-id-123";

    // 4. GỌI SERVER ACTION Ở ĐÂY
    const result = await createJobAction({
      ...formData,
      shopId: currentShopId
    });

    if (result.success) {
      alert("Tạo bài tuyển dụng thành công thật rồi nhé!");

      // Reset form sau khi tạo
      setFormData({ title: "", vibe: "", budget: "", description: "" });

      // Báo cho JobList biết để gọi lại Database
      if (onSuccess) onSuccess();

      onClose();
    } else {
      alert("Tạo thất bại: " + result.error);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-xl font-extrabold text-gray-900">Tạo bài tuyển dụng mới</h2>
          <button
            onClick={onClose}
            className="p-2 bg-gray-50 hover:bg-gray-100 text-gray-500 hover:text-gray-900 rounded-full transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="space-y-1.5">
            <label className="text-sm font-bold text-gray-700">Tên bài tuyển dụng</label>
            <input
              type="text"
              required
              placeholder="VD: Review BST Hè 2026..."
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-sm font-medium"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-gray-700">Vibe yêu cầu (Tags)</label>
              <input
                type="text"
                required
                placeholder="VD: #GenZ, #Streetwear..."
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-sm font-medium"
                value={formData.vibe}
                onChange={(e) => setFormData({ ...formData, vibe: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-gray-700">Ngân sách dự kiến</label>
              <input
                type="text"
                required
                placeholder="VD: 5,000,000 VND"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-sm font-medium"
                value={formData.budget}
                onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-bold text-gray-700">Mô tả công việc</label>
            <textarea
              required
              rows={4}
              placeholder="Mô tả chi tiết nội dung cần làm, yêu cầu kênh..."
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-sm font-medium resize-none"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-sm rounded-xl transition-colors cursor-pointer"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl shadow-md transition-colors cursor-pointer"
            >
              Đăng tuyển dụng
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
