"use client";

import React, { useState, useEffect } from "react";
import JobCard from "#/components/JobCard";
import { useRouter } from "next/navigation";
import { getMyCastingJobs } from "#/app/(shop)/my-casting/actions";

export default function ShopDashboard() {
  const router = useRouter();

  // MOCK DATA: Metrics
  const metrics = [
    { label: "Tổng ngân sách đã chi", value: "45,500,000đ", trend: "+12.5%", isUp: true },
    { label: "Chiến dịch đang chạy", value: "3", trend: "Ổn định", isUp: true },
    { label: "KOC đang hợp tác", value: "12", trend: "+2", isUp: true },
    { label: "Tổng lượt tiếp cận", value: "1.2M", trend: "+450K", isUp: true },
  ];

  // MOCK DATA: AI Matching KOCs
  const recommendedKocs = [
    {
      id: "koc-1",
      name: "Thảo Vy Review",
      avatar: "👩🏻",
      vibe: "Minimalism",
      channel: "TikTok",
      followers: "125K",
      matchRate: 98,
    },
    {
      id: "koc-2",
      name: "Khoa Style",
      avatar: "🧑🏻‍🎤",
      vibe: "Streetwear",
      channel: "Instagram",
      followers: "89K",
      matchRate: 95,
    },
    {
      id: "koc-3",
      name: "Mai Matcha",
      avatar: "🍵",
      vibe: "GenZ",
      channel: "TikTok",
      followers: "300K",
      matchRate: 91,
    },
  ];

  const [inProgressJobs, setInProgressJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchJobs() {
      setLoading(true);
      const res = await getMyCastingJobs();
      if (res.success) {
        // filter only jobs with "in-progress" status
        const filtered = res.data.filter(job => job.status === "in-progress");
        setInProgressJobs(filtered);
      }
      setLoading(false);
    }
    fetchJobs();
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* 1. KHỐI CHỈ SỐ TỔNG QUAN (Metrics) */}
      <section>
        <h2 className="text-xl font-extrabold text-gray-900 mb-4">Tổng quan hoạt động</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {metrics.map((metric, idx) => (
            <div key={idx} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-xs flex flex-col justify-between">
              <span className="text-sm font-semibold text-gray-500 mb-2">{metric.label}</span>
              <div className="flex items-end justify-between">
                <span className="text-2xl font-black text-gray-900">{metric.value}</span>
                <span className={`text-xs font-bold px-2 py-1 rounded-lg ${metric.isUp ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                  {metric.trend}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* CỘT TRÁI (Rộng hơn - Chiếm 2/3) */}
        <div className="lg:col-span-2 space-y-8">
          

          {/* 4. KHỐI CHIẾN DỊCH ĐANG TUYỂN (Active Campaigns) */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-extrabold text-gray-900">Dự án đang thực hiện</h2>
              <button onClick={() => router.push('/my-casting')} className="text-sm font-bold text-blue-600 hover:underline cursor-pointer">Quản lý tất cả</button>
            </div>
            {loading ? (
              <div className="py-10 text-center">
                <div className="inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : inProgressJobs.length === 0 ? (
              <div className="bg-white rounded-2xl border border-dashed border-gray-200 p-8 text-center text-gray-400 text-sm">
                Chưa có dự án nào đang thực hiện.
              </div>
            ) : (
              <div className="space-y-4">
                {inProgressJobs.map((campaign) => (
                  <JobCard 
                    key={campaign.id} 
                    job={campaign} 
                    role="shop"
                    onAction={(job) => router.push(`/my-casting?jobId=${job.id}`)}
                  />
                ))}
              </div>
            )}
          </section>

        </div>

        {/* CỘT PHẢI (Chiếm 1/3) */}
        <div className="space-y-8">
          
          {/* 2. KHỐI AI MATCHING (KOC Gợi Ý) */}
          <section className="bg-linear-to-b from-blue-900 to-indigo-900 rounded-3xl p-1 shadow-lg">
            <div className="bg-white/10 backdrop-blur-md rounded-[22px] p-5 h-full">
              <div className="mb-4">
                <span className="inline-block px-2.5 py-1 bg-white/20 text-white text-[10px] font-bold rounded-md uppercase tracking-wider mb-2 border border-white/10">
                  ⚡ AI Match
                </span>
                <h3 className="text-lg font-extrabold text-white leading-tight">KOC phù hợp nhất với shop của bạn</h3>
              </div>

              <div className="space-y-3">
                {recommendedKocs.map((koc) => (
                  <div key={koc.id} className="bg-white rounded-xl p-3 shadow-sm flex flex-col gap-3">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-indigo-50 rounded-full flex items-center justify-center text-xl border border-indigo-100">
                          {koc.avatar}
                        </div>
                        <div>
                          <h4 className="font-bold text-sm text-gray-900">{koc.name}</h4>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded border border-indigo-100">#{koc.vibe}</span>
                            <span className="text-[10px] text-gray-500">{koc.channel} • {koc.followers}</span>
                          </div>
                        </div>
                      </div>
                      <div className="bg-emerald-500 text-white text-[10px] font-black px-1.5 py-0.5 rounded flex items-center gap-1 shadow-xs">
                        {koc.matchRate}%
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 mt-1">
                      <button className="py-1.5 text-xs font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition cursor-pointer">Xem Profile</button>
                      <button className="py-1.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm shadow-indigo-200 rounded-lg transition cursor-pointer">Mời hợp tác</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}