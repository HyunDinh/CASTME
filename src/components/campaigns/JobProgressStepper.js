"use client";
import React, { useState, useEffect } from "react";
import { CheckCircle, Circle, Clock, MessageSquare, AlertCircle, FileText, Video, Link as LinkIcon, DollarSign, Send } from "lucide-react";
import { getJobMilestones, approveMilestone, rejectMilestone } from "#/app/(shop)/my-casting/applications.actions";
import { submitMilestone } from "#/app/(creator)/actions";

export default function JobProgressStepper({ job, role = "shop" }) {
  const [milestones, setMilestones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionValue, setSubmissionValue] = useState("");
  const [feedbackValue, setFeedbackValue] = useState("");

  const fetchMilestones = async () => {
    if (!job?.id) return;
    setLoading(true);
    const res = await getJobMilestones(job.id);
    if (res.success) {
      setMilestones(res.data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchMilestones();
  }, [job]);

  const handleCreatorSubmit = async (milestoneId) => {
    if (!submissionValue.trim()) return alert("Vui lòng nhập nội dung trước khi nộp!");
    setIsSubmitting(true);
    const res = await submitMilestone(milestoneId, submissionValue);
    setIsSubmitting(false);
    if (res.success) {
      setSubmissionValue("");
      fetchMilestones();
    } else {
      alert(res.error || "Lỗi khi nộp bài");
    }
  };

  const handleShopApprove = async (milestoneId) => {
    setIsSubmitting(true);
    const res = await approveMilestone(milestoneId);
    setIsSubmitting(false);
    if (res.success) {
      fetchMilestones();
    } else {
      alert(res.error || "Lỗi khi duyệt");
    }
  };

  const handleShopReject = async (milestoneId) => {
    if (!feedbackValue.trim()) return alert("Vui lòng nhập lý do từ chối để KOC sửa lại!");
    setIsSubmitting(true);
    const res = await rejectMilestone(milestoneId, feedbackValue);
    setIsSubmitting(false);
    if (res.success) {
      setFeedbackValue("");
      fetchMilestones();
    } else {
      alert(res.error || "Lỗi khi từ chối");
    }
  };

  if (loading) {
    return (
      <div className="py-20 flex justify-center">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (milestones.length === 0) {
    return (
      <div className="py-20 text-center bg-gray-50 rounded-2xl border border-dashed border-gray-200">
        <div className="text-3xl mb-4">📭</div>
        <h3 className="text-lg font-bold text-gray-900">Chưa có tiến độ nào</h3>
        <p className="text-gray-500 text-sm">Hệ thống chưa tạo lộ trình công việc cho Job này.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-xs p-6 md:p-8 max-w-3xl mx-auto animate-in fade-in duration-300">
      <div className="mb-8 border-b border-gray-100 pb-4">
        <h2 className="text-xl font-extrabold text-gray-900">Lộ trình công việc</h2>
        <p className="text-sm text-gray-500 mt-1">Cập nhật và theo dõi tiến độ chi tiết của chiến dịch.</p>
      </div>

      <div className="relative space-y-8 before:absolute before:inset-0 before:ml-[1.1rem] before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-gray-200 before:to-transparent">
        {milestones.map((milestone, idx) => {
          const isCompleted = milestone.status === "COMPLETED";
          const isInProgress = milestone.status === "IN_PROGRESS" || milestone.status === "REJECTED"; // KOC needs to act
          const isReviewing = milestone.status === "REVIEWING"; // Shop needs to act
          const isPending = milestone.status === "PENDING";
          const isRejected = milestone.status === "REJECTED";

          return (
            <div key={milestone.id} className="relative flex items-start justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
              
              {/* Cột 1: Thông tin Icon (Giữa) */}
              <div className={`flex items-center justify-center w-9 h-9 rounded-full border-4 border-white shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-sm z-10 ${
                isCompleted ? 'bg-emerald-500 text-white' : 
                isInProgress ? 'bg-blue-600 text-white animate-pulse' : 
                isReviewing ? 'bg-purple-500 text-white animate-bounce' : 'bg-gray-100 text-gray-400'
              }`}>
                {milestone.type === "SCRIPT" ? <FileText size={16} /> :
                 milestone.type === "VIDEO" ? <Video size={16} /> :
                 milestone.type === "LINK" ? <LinkIcon size={16} /> :
                 <DollarSign size={16} />}
              </div>

              {/* Cột 2: Nội dung */}
              <div className={`w-[calc(100%-3rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border transition-all ${
                isCompleted ? 'bg-emerald-50 border-emerald-100' : 
                isInProgress ? 'bg-blue-50/50 border-blue-200 shadow-md ring-4 ring-blue-50' : 
                isReviewing ? 'bg-purple-50 border-purple-200 shadow-md' : 'bg-gray-50 border-gray-100 opacity-60'
              }`}>
                
                <div className="flex flex-col gap-1">
                  <div className="flex justify-between items-center">
                    <span className={`text-[10px] font-black tracking-wider uppercase 
                      ${isCompleted ? 'text-emerald-600' : isInProgress ? 'text-blue-600' : isReviewing ? 'text-purple-600' : 'text-gray-500'}`}>
                      Bước {idx + 1} • {milestone.type}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      isCompleted ? "bg-emerald-100 text-emerald-700" :
                      isInProgress && !isRejected ? "bg-blue-100 text-blue-700" :
                      isRejected ? "bg-red-100 text-red-700" :
                      isReviewing ? "bg-purple-100 text-purple-700" : "bg-gray-200 text-gray-500"
                    }`}>
                      {isCompleted ? "HOÀN THÀNH" : isRejected ? "CẦN SỬA LẠI" : isReviewing ? "CHỜ DUYỆT" : isInProgress ? "ĐANG LÀM" : "CHƯA TỚI"}
                    </span>
                  </div>
                  <h3 className="font-bold text-gray-900">{milestone.title}</h3>
                </div>

                {/* Nội dung Creator đã nộp */}
                {milestone.submission && (
                  <div className="mt-3 p-3 bg-white rounded-lg text-sm text-gray-800 border border-gray-200 shadow-sm overflow-hidden break-words">
                    <span className="block text-[10px] font-bold text-gray-400 mb-1">NỘI DUNG ĐÃ NỘP:</span>
                    {milestone.type === "SCRIPT" ? (
                      <p className="whitespace-pre-wrap">{milestone.submission}</p>
                    ) : (
                      <a href={milestone.submission} target="_blank" rel="noreferrer" className="text-blue-600 font-medium underline break-all">
                        {milestone.submission}
                      </a>
                    )}
                  </div>
                )}

                {/* Lý do từ chối (Feedback của Shop) */}
                {milestone.feedback && (
                  <div className="mt-3 p-3 bg-red-50 text-red-700 rounded-lg text-sm border border-red-100 flex items-start gap-2">
                    <AlertCircle size={16} className="shrink-0 mt-0.5" />
                    <div>
                      <span className="block text-[10px] font-bold uppercase mb-0.5">YÊU CẦU SỬA:</span>
                      {milestone.feedback}
                    </div>
                  </div>
                )}

                {/* HÀNH ĐỘNG CỦA CREATOR */}
                {role === "creator" && isInProgress && milestone.type !== "PAYMENT" && (
                  <div className="mt-4 flex flex-col gap-2">
                    {milestone.type === "SCRIPT" ? (
                      <textarea
                        className="w-full text-sm p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                        rows={4}
                        placeholder="Nhập nội dung kịch bản vào đây..."
                        value={submissionValue}
                        onChange={(e) => setSubmissionValue(e.target.value)}
                      />
                    ) : (
                      <input
                        type="url"
                        className="w-full text-sm p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                        placeholder="Dán link (Google Drive, TikTok...)"
                        value={submissionValue}
                        onChange={(e) => setSubmissionValue(e.target.value)}
                      />
                    )}
                    <button 
                      onClick={() => handleCreatorSubmit(milestone.id)}
                      disabled={isSubmitting}
                      className="py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl transition flex justify-center items-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      <Send size={16} /> Nộp bài
                    </button>
                  </div>
                )}

                {/* HÀNH ĐỘNG CỦA SHOP */}
                {role === "shop" && isReviewing && milestone.type !== "PAYMENT" && (
                  <div className="mt-4 flex flex-col gap-2">
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleShopApprove(milestone.id)}
                        disabled={isSubmitting}
                        className="flex-1 py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold rounded-xl transition shadow-md shadow-emerald-100 cursor-pointer disabled:opacity-50"
                      >
                        ✅ Duyệt bài
                      </button>
                    </div>
                    <div className="flex flex-col gap-2 mt-2 pt-2 border-t border-gray-200">
                      <input
                        type="text"
                        className="w-full text-sm p-2.5 border border-red-200 bg-red-50/30 rounded-lg focus:ring-1 focus:ring-red-500 outline-none placeholder:text-red-300"
                        placeholder="Nhập lý do nếu muốn yêu cầu sửa..."
                        value={feedbackValue}
                        onChange={(e) => setFeedbackValue(e.target.value)}
                      />
                      <button 
                        onClick={() => handleShopReject(milestone.id)}
                        disabled={isSubmitting}
                        className="w-full py-2 bg-white border border-red-200 hover:bg-red-50 text-red-600 text-xs font-bold rounded-lg transition cursor-pointer disabled:opacity-50"
                      >
                        ❌ Yêu cầu làm lại
                      </button>
                    </div>
                  </div>
                )}

                {/* HÀNH ĐỘNG CỦA SHOP DÀNH RIÊNG CHO PAYMENT */}
                {role === "shop" && isInProgress && milestone.type === "PAYMENT" && (
                  <div className="mt-4">
                    <button 
                      onClick={() => handleShopApprove(milestone.id)}
                      disabled={isSubmitting}
                      className="w-full py-3 px-3 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold rounded-xl transition shadow-md shadow-emerald-100 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      <CheckCircle size={18} /> Xác nhận đã Thanh toán
                    </button>
                  </div>
                )}

                {/* TRẠNG THÁI CHỜ SHOP (DÀNH CHO CREATOR KHI ĐÃ NỘP BÀI) */}
                {role === "creator" && isReviewing && (
                  <div className="mt-4 p-3 bg-purple-50 text-purple-700 rounded-lg text-sm border border-purple-100 font-medium flex justify-center items-center gap-2">
                    <Clock size={16} className="animate-spin" /> Đang đợi Shop duyệt...
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
