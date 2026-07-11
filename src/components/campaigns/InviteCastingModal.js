"use client";
import React, { useState, useEffect } from "react";
import { X, Briefcase, ChevronRight, CheckCircle2 } from "lucide-react";
import { getShopActiveJobs, inviteCreatorToJob } from "#/app/(shop)/search-creator/actions";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function InviteCastingModal({ isOpen, onClose, creatorId, creatorName }) {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [invitingId, setInvitingId] = useState(null);

  useEffect(() => {
    if (isOpen) {
      fetchJobs();
    }
  }, [isOpen]);

  const fetchJobs = async () => {
    setLoading(true);
    const res = await getShopActiveJobs();
    if (res.success) {
      setJobs(res.data);
    }
    setLoading(false);
  };

  const handleInvite = async (jobId) => {
    setInvitingId(jobId);
    const res = await inviteCreatorToJob(creatorId, jobId);
    setInvitingId(null);
    
    if (res.success) {
      toast.success(`Đã gửi lời mời hợp tác thành công!`, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      setTimeout(() => {
        onClose();
      }, 1500);
    } else {
      toast.error(res.error || "Có lỗi xảy ra", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        {/* Backdrop */}
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose}></div>
        
        {/* Modal content */}
        <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[85vh] animate-in fade-in zoom-in duration-200">
          {/* Header */}
          <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-gray-50/80">
            <div>
              <h3 className="text-xl font-bold text-gray-900">Mời hợp tác</h3>
              <p className="text-sm text-gray-500 mt-1">Gửi lời mời casting đến <span className="font-semibold text-indigo-600">{creatorName}</span></p>
            </div>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-gray-200 rounded-full transition-colors text-gray-500"
            >
              <X size={20} />
            </button>
          </div>

          {/* Body */}
          <div className="p-6 overflow-y-auto flex-1">
            <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-4">Chọn chiến dịch của bạn</h4>
            
            {loading ? (
              <div className="flex justify-center py-8">
                <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : jobs.length === 0 ? (
              <div className="text-center py-8 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                <Briefcase className="w-10 h-10 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600 font-medium">Bạn chưa có chiến dịch nào đang mở.</p>
                <p className="text-sm text-gray-400 mt-1">Hãy tạo chiến dịch mới để mời KOL nhé.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {jobs.map(job => (
                  <div key={job.id} className="group border border-gray-200 hover:border-indigo-300 hover:bg-indigo-50/50 rounded-2xl p-4 transition-all flex items-center justify-between gap-4 cursor-pointer" onClick={() => !invitingId && handleInvite(job.id)}>
                    <div className="flex-1">
                      <h5 className="font-bold text-gray-900 group-hover:text-indigo-700 transition-colors line-clamp-1">{job.title}</h5>
                      <p className="text-sm text-gray-500 mt-1">Ngân sách: <span className="font-semibold text-gray-700">{job.budget}</span></p>
                    </div>
                    <button 
                      disabled={invitingId === job.id}
                      className="shrink-0 px-4 py-2 bg-indigo-100 hover:bg-indigo-600 text-indigo-700 hover:text-white font-semibold text-sm rounded-xl transition-colors disabled:opacity-50 flex items-center gap-2"
                    >
                      {invitingId === job.id ? (
                        <div className="w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                      ) : "Mời"}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      <ToastContainer />
    </>
  );
}
