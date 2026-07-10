"use client";
import React, { useState, useEffect } from "react";
import { MessageSquare, Check, X } from "lucide-react";
import { getJobApplicants, approveApplicant, rejectApplicant } from "#/app/(shop)/my-casting/applications.actions";

export default function ApplicantTable({ job, onActionComplete }) {
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchApplicants = async () => {
    if (!job?.id) return;
    setLoading(true);
    const result = await getJobApplicants(job.id);
    if (result.success) {
      setApplicants(result.data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchApplicants();
  }, [job]);

  const handleApprove = async (appId, name) => {
    const confirm = window.confirm(`Bạn có chắc chắn muốn duyệt ${name}? Các ứng viên khác sẽ tự động bị từ chối.`);
    if (!confirm) return;

    const res = await approveApplicant(appId, job.id);
    if (res.success) {
      alert(`Đã duyệt KOC ${name}! Chiến dịch đã được chuyển sang trạng thái Đang Thực Hiện.`);
      fetchApplicants();
      if (onActionComplete) onActionComplete(); // Có thể dùng để quay lại danh sách hoặc tải lại trang
    } else {
      alert("Lỗi: " + res.error);
    }
  };

  const handleReject = async (appId, name) => {
    const reason = prompt(`Nhập lý do từ chối KOC ${name}:`);
    if (reason !== null) {
      const res = await rejectApplicant(appId);
      if (res.success) {
        alert(`Đã từ chối ${name}`);
        fetchApplicants();
      } else {
        alert("Lỗi: " + res.error);
      }
    }
  };

  const handleMessage = (name) => {
    alert(`Đang mở hộp thoại nhắn tin với ${name}...`);
  };

  if (loading) {
    return (
      <div className="py-20 flex justify-center">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Nếu job đã có người được nhận, các nút Duyệt/Từ chối có thể bị ẩn
  const isJobFilled = job?.status === "in-progress" || job?.status === "completed";

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-xs overflow-hidden animate-in fade-in duration-300">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100 text-xs text-gray-500 font-bold uppercase tracking-wider">
              <th className="p-4 pl-6">Người sáng tạo</th>
              <th className="p-4">Chỉ số kênh</th>
              <th className="p-4 w-1/3">Đề xuất từ KOC</th>
              <th className="p-4 pr-6 text-right">Trạng thái / Hành động</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {applicants.map((app) => (
              <tr key={app.id} className="hover:bg-gray-50/50 transition-colors">

                {/* 1. Người sáng tạo */}
                <td className="p-4 pl-6 align-top">
                  <div className="flex gap-3">
                    <div className="w-12 h-12 bg-indigo-50 rounded-full flex items-center justify-center text-2xl border border-indigo-100 shrink-0">
                      {app.creator.avatar}
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 text-sm">{app.creator.name}</h4>
                      <div className="flex flex-col gap-1 mt-1">
                        <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-100 w-max">
                          {app.creator.vibe}
                        </span>
                        <a href={`https://${app.creator.channelUrl}`} target="_blank" rel="noreferrer" className="text-[11px] text-blue-600 hover:underline">
                          {app.creator.channelUrl} • {app.creator.followers} Fl
                        </a>
                      </div>
                    </div>
                  </div>
                </td>

                {/* 2. Chỉ số kênh */}
                <td className="p-4 align-top">
                  <div className="space-y-1">
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-xs text-gray-500">Tương tác:</span>
                      <span className="text-xs font-bold text-gray-900">{app.metrics.engagementRate}</span>
                    </div>
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-xs text-gray-500">View TB:</span>
                      <span className="text-xs font-bold text-gray-900">{app.metrics.avgViews}</span>
                    </div>
                    {app.matchRate > 0 && (
                      <div className="mt-2 text-xs font-bold text-emerald-600">
                        🤖 AI Match: {app.matchRate}%
                      </div>
                    )}
                  </div>
                </td>

                {/* 3. Đề xuất từ KOC */}
                <td className="p-4 align-top">
                  <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                    <p className="text-xs text-gray-600 leading-relaxed italic mb-2">"{app.proposal.message}"</p>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold text-gray-400 uppercase">Mong muốn:</span>
                      <span className="text-xs font-black text-purple-600">{app.proposal.budget}</span>
                    </div>
                  </div>
                </td>

                {/* 4. Hành động */}
                <td className="p-4 pr-6 align-top">
                  <div className="flex flex-col gap-2 items-end">

                    {app.status === "PENDING" && !isJobFilled && (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleReject(app.id, app.creator.name)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-100 cursor-pointer"
                          title="Từ chối"
                        >
                          <X size={18} />
                        </button>
                        <button
                          onClick={() => handleApprove(app.id, app.creator.name)}
                          className="px-4 py-2 bg-emerald-50 text-emerald-700 hover:bg-emerald-500 hover:text-white text-xs font-bold rounded-lg transition-colors border border-emerald-200 hover:border-emerald-500 flex items-center gap-1.5 cursor-pointer shadow-sm"
                        >
                          <Check size={16} /> Duyệt vào chiến dịch
                        </button>
                      </div>
                    )}

                    {app.status === "ACCEPTED" && (
                      <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-lg border border-emerald-200">
                        ✅ Đã trúng tuyển
                      </span>
                    )}

                    {app.status === "REJECTED" && (
                      <span className="px-3 py-1 bg-red-50 text-red-600 text-xs font-bold rounded-lg border border-red-200">
                        ❌ Bị từ chối
                      </span>
                    )}

                    <button
                      onClick={() => handleMessage(app.creator.name)}
                      className="flex items-center gap-1.5 text-xs font-bold text-gray-600 hover:text-blue-600 px-2 py-1 rounded-md hover:bg-blue-50 transition-colors cursor-pointer mt-1"
                    >
                      <MessageSquare size={14} /> Nhắn tin
                    </button>
                  </div>
                </td>

              </tr>
            ))}
          </tbody>
        </table>
        {applicants.length === 0 && (
          <div className="py-20 text-center flex flex-col items-center justify-center bg-white">
            <h3 className="text-lg font-bold text-gray-900">Không có ứng viên nào</h3>
            <p className="text-gray-500 mt-1 text-sm">Chưa có ai ứng tuyển vào bài đăng này.</p>
          </div>
        )}
      </div>
    </div>
  );
}
