"use client";
import React, { useState, useEffect } from "react";
import { CheckCircle, Circle, Clock, MessageSquare, AlertCircle, FileText, Video, Link as LinkIcon, DollarSign, Send, Maximize2 } from "lucide-react";
import { getJobMilestones, approveMilestone, rejectMilestone, getAcceptedApplication, syncContractStatus } from "#/app/(shop)/my-casting/applications.actions";
import { submitMilestone } from "#/app/(creator)/actions";
import ScriptEditorModal from "./ScriptEditorModal";
import ScriptViewerModal from "./ScriptViewerModal";

export default function JobProgressStepper({ job, role = "shop" }) {
  const [milestones, setMilestones] = useState([]);
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionValue, setSubmissionValue] = useState("");
  const [feedbackValue, setFeedbackValue] = useState("");
  const [isScriptModalOpen, setIsScriptModalOpen] = useState(false);
  const [currentMilestoneId, setCurrentMilestoneId] = useState(null);
  
  // Viewer Modal State
  const [isViewerModalOpen, setIsViewerModalOpen] = useState(false);
  const [viewerContent, setViewerContent] = useState("");

  const fetchMilestones = async () => {
    if (!job?.id) return;
    setLoading(true);
    const res = await getJobMilestones(job.id);
    if (res.success) {
      setMilestones(res.data);
    }
    const appRes = await getAcceptedApplication(job.id);
    if (appRes.success) {
      setApplication(appRes.data);
    }
    setLoading(false);
  };

  const handleCheckSignature = async () => {
    if (!application?.id) return;
    setIsSubmitting(true);
    const res = await syncContractStatus(application.id);
    setIsSubmitting(false);
    
    if (res.success) {
      if (res.status === "COMPLETED") {
        alert("Hợp đồng đã được các bên ký thành công!");
        fetchMilestones();
      } else {
        alert("Hợp đồng vẫn đang chờ các bên hoàn tất chữ ký. Vui lòng kiểm tra lại sau.");
      }
    } else {
      alert(res.error || "Lỗi khi kiểm tra trạng thái");
    }
  };

  useEffect(() => {
    fetchMilestones();
  }, [job]);

  const handleCreatorSubmit = async (milestoneId, customContent = null) => {
    const content = customContent !== null ? customContent : submissionValue;
    if (!content.trim()) return alert("Vui lòng nhập nội dung trước khi nộp!");
    setIsSubmitting(true);
    const res = await submitMilestone(milestoneId, content);
    setIsSubmitting(false);
    if (res.success) {
      setSubmissionValue("");
      setIsScriptModalOpen(false);
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

      {/* KHỐI HIỂN THỊ HỢP ĐỒNG */}
      {application?.contractStatus === "PENDING" && (
        <div className="mb-8 p-6 bg-amber-50 border border-amber-200 rounded-2xl flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mb-4">
            <FileText size={32} className="text-amber-600" />
          </div>
          <h3 className="text-lg font-bold text-amber-900 mb-2">Chờ ký hợp đồng điện tử</h3>
          <p className="text-amber-700 text-sm max-w-lg mb-4">
            Hệ thống đã gửi email yêu cầu ký hợp đồng điện tử đến Shop và KOC qua SignNow. Vui lòng kiểm tra hộp thư và hoàn tất chữ ký để bắt đầu công việc.
          </p>
          <div className="flex gap-3 flex-wrap justify-center">
            {application.contractUrl && (
              <a
                href={`https://docs.google.com/viewer?url=${encodeURIComponent(application.contractUrl)}&embedded=true`}
                target="_blank"
                rel="noreferrer"
                className="px-5 py-2.5 bg-white border border-amber-300 text-amber-800 rounded-xl text-sm font-bold shadow-sm hover:bg-amber-100 transition flex items-center gap-2"
              >
                <FileText size={16} /> Xem hợp đồng nháp
              </a>
            )}
             <button 
               onClick={handleCheckSignature} 
               disabled={isSubmitting}
               className="px-5 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-bold shadow-md hover:bg-blue-700 transition cursor-pointer disabled:opacity-50 flex items-center gap-2"
             >
               {isSubmitting ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <CheckCircle size={16} />}
               Cập nhật trạng thái ký
             </button>
          </div>
        </div>
      )}

      {application?.contractStatus === "COMPLETED" && (
        <div className="mb-8 p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <CheckCircle size={24} className="text-emerald-600" />
            <div>
              <h4 className="font-bold text-emerald-900 text-sm">Hợp đồng điện tử đã hoàn tất</h4>
              <p className="text-emerald-700 text-xs">Các bên đã ký xác nhận có giá trị pháp lý.</p>
            </div>
          </div>
          <div className="flex gap-2">
             {application.contractUrl && (
               <a
                 href={`https://docs.google.com/viewer?url=${encodeURIComponent(application.contractUrl)}&embedded=true`}
                 target="_blank"
                 rel="noreferrer"
                 className="px-4 py-2 bg-white border border-emerald-200 text-emerald-700 text-xs font-bold rounded-lg hover:bg-emerald-100 transition shadow-sm"
               >
                 Xem hợp đồng
               </a>
             )}
             {application.auditTrailUrl && (
               <a href={application.auditTrailUrl} target="_blank" rel="noreferrer" className="px-4 py-2 bg-white border border-emerald-200 text-emerald-700 text-xs font-bold rounded-lg hover:bg-emerald-100 transition shadow-sm hidden sm:block">
                 Biên bản Audit
               </a>
             )}
          </div>
        </div>
      )}

      <div className={`relative space-y-8 before:absolute before:inset-0 before:ml-[1.1rem] before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-gray-200 before:to-transparent ${application?.contractStatus === 'PENDING' ? 'opacity-40 pointer-events-none select-none grayscale' : ''}`}>
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
                  <div className="mt-3 p-3 bg-white rounded-lg text-sm text-gray-800 border border-gray-200 shadow-sm overflow-hidden break-words tiptap-editor relative group/submission">
                    <span className="block text-[10px] font-bold text-gray-400 mb-1">NỘI DUNG ĐÃ NỘP:</span>
                    {milestone.type === "SCRIPT" ? (
                      <>
                        <div className="max-h-24 overflow-hidden relative">
                          {milestone.submission.startsWith('<') ? (
                            <div dangerouslySetInnerHTML={{ __html: milestone.submission }} className="leading-relaxed opacity-70" />
                          ) : milestone.submission.startsWith('http') ? (
                             <a href={milestone.submission} target="_blank" rel="noreferrer" className="text-blue-600 font-medium underline break-all">
                               {milestone.submission}
                             </a>
                          ) : (
                            <p className="whitespace-pre-wrap opacity-70">{milestone.submission}</p>
                          )}
                          <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-white to-transparent pointer-events-none"></div>
                        </div>
                        <button 
                          onClick={() => {
                            setViewerContent(milestone.submission);
                            setIsViewerModalOpen(true);
                          }}
                          className="mt-2 w-full py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 text-xs font-bold rounded-lg border border-gray-200 flex items-center justify-center gap-2 transition cursor-pointer"
                        >
                          <Maximize2 size={14} /> Xem kịch bản chi tiết
                        </button>
                      </>
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
                      <button 
                        onClick={() => {
                          setCurrentMilestoneId(milestone.id);
                          setIsScriptModalOpen(true);
                        }}
                        className="w-full text-sm p-4 border-2 border-dashed border-gray-300 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition text-gray-600 font-bold flex justify-center items-center gap-2 cursor-pointer bg-gray-50/50"
                      >
                        <FileText size={18} className="text-blue-500" /> Nhấn để Soạn thảo hoặc Nộp Kịch Bản
                      </button>
                    ) : (
                      <>
                        <input
                          type="url"
                          className="w-full text-sm p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                          placeholder="Dán link (Google Drive, TikTok...)"
                          value={submissionValue}
                          onChange={(e) => setSubmissionValue(e.target.value)}
                        />
                        <button 
                          onClick={() => handleCreatorSubmit(milestone.id)}
                          disabled={isSubmitting}
                          className="py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl transition flex justify-center items-center gap-2 cursor-pointer disabled:opacity-50"
                        >
                          <Send size={16} /> Nộp bài
                        </button>
                      </>
                    )}
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
      
      <ScriptEditorModal 
        isOpen={isScriptModalOpen} 
        onClose={() => setIsScriptModalOpen(false)} 
        onSubmit={(content) => handleCreatorSubmit(currentMilestoneId, content)} 
      />

      <ScriptViewerModal
        isOpen={isViewerModalOpen}
        onClose={() => setIsViewerModalOpen(false)}
        content={viewerContent}
      />
    </div>
  );
}
