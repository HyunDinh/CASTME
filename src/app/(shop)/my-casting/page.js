"use client";

import React, { useState, Suspense } from "react";
import JobList from "#/components/campaigns/JobList";
import JobDetails from "#/components/campaigns/JobDetails";
import { useRouter } from "next/navigation";

function MyCastingContent() {
  const router = useRouter();
  const [activeView, setActiveView] = useState("list"); // 'list' | 'details'
  const [selectedJob, setSelectedJob] = useState(null);

  const handleViewDetails = (job) => {
    setSelectedJob(job);
    setActiveView("details");
  };

  const handleBackToList = () => {
    setSelectedJob(null);
    setActiveView("list");
    // Xoá query parameter jobId khỏi URL để không tự động mở lại
    router.replace("/my-casting", undefined, { shallow: true });
  };

  return (
    <>
      {activeView === "list" ? (
        <JobList onViewDetails={handleViewDetails} />
      ) : (
        <JobDetails job={selectedJob} onBack={handleBackToList} />
      )}
    </>
  );
}

export default function MyCastingPage() {
  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto w-full">
      <Suspense fallback={<div className="py-20 text-center flex justify-center"><div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div></div>}>
        <MyCastingContent />
      </Suspense>
    </div>
  );
}