"use client";

import React, { useState } from "react";
import JobList from "#/components/campaigns/JobList";
import JobDetails from "#/components/campaigns/JobDetails";

export default function MyCastingPage() {
  const [activeView, setActiveView] = useState("list"); // 'list' | 'details'
  const [selectedJob, setSelectedJob] = useState(null);

  const handleViewDetails = (job) => {
    setSelectedJob(job);
    setActiveView("details");
  };

  const handleBackToList = () => {
    setSelectedJob(null);
    setActiveView("list");
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto w-full">
      {activeView === "list" ? (
        <JobList onViewDetails={handleViewDetails} />
      ) : (
        <JobDetails job={selectedJob} onBack={handleBackToList} />
      )}
    </div>
  );
}