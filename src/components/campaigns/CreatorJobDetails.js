"use client";
import React, { useState } from "react";
import { ArrowLeft } from "lucide-react";
import JobProgressStepper from "./JobProgressStepper";

export default function CreatorJobDetails({ job, onBack }) {
  if (!job) return null;

  return (
    <div className="space-y-6 animate-in slide-in-from-right-8 duration-300">
      
      {/* SECONDARY NAVIGATION */}
      <div className="flex flex-col gap-4">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-sm font-bold text-gray-500 hover:text-gray-900 transition-colors w-max cursor-pointer"
        >
          <ArrowLeft size={16} />
          Quay lại danh sách
        </button>
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900">{job.title}</h1>
            <p className="text-sm text-gray-500 mt-1 max-w-2xl line-clamp-1">{job.notes}</p>
          </div>
          <span className={`px-3 py-1 text-xs font-black uppercase tracking-wider rounded-lg w-max shrink-0 border ${
            job.uiStatus === "PROCESSING" ? "bg-blue-50 text-blue-700 border-blue-200" :
            job.uiStatus === "COMPLETED" ? "bg-gray-100 text-gray-700 border-gray-300" :
            "bg-gray-50 text-gray-700 border-gray-200"
          }`}>
            {job.uiStatus === "PROCESSING" ? "Đang thực hiện" : 
             job.uiStatus === "COMPLETED" ? "Đã kết thúc" : job.uiStatus}
          </span>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500 font-medium">Đối tác</p>
          <p className="font-bold text-gray-900">{job.shopName}</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500 font-medium">Thù lao</p>
          <p className="font-black text-xl text-purple-600">{job.budget}</p>
        </div>
      </div>

      {/* CONTENT PORTAL */}
      <div className="pt-2">
         <JobProgressStepper job={job} role="creator" />
      </div>
    </div>
  );
}
