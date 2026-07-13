"use client";

import React, { useState, Suspense, useEffect } from "react";
import JobList from "#/components/campaigns/JobList";
import JobDetails from "#/components/campaigns/JobDetails";
import { useRouter, useSearchParams } from "next/navigation";
import { getMyCastingJobs } from "#/app/(shop)/my-casting/actions";

function MyCastingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeView, setActiveView] = useState("list"); // 'list' | 'details'
  const [selectedJob, setSelectedJob] = useState(null);

  useEffect(() => {
    const jobId = searchParams.get("jobId");
    if (!jobId) return;

    const loadSelectedJob = async () => {
      const res = await getMyCastingJobs();
      if (res.success) {
        const matchedJob = res.data.find((job) => job.id === jobId);
        if (matchedJob) {
          setSelectedJob(matchedJob);
          setActiveView("details");
        }
      }
    };

    void loadSelectedJob();
  }, [searchParams]);

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