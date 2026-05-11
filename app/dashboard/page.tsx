"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import TodayCard from "@/components/TodayCard";
import OverallCard from "@/components/OverallCard";
import HistoryTable from "@/components/HistoryTable";
import type { DashboardMetrics } from "@/lib/metrics";

function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-purple-100 animate-pulse">
      <div className="h-5 bg-purple-100 rounded w-1/3 mb-4" />
      <div className="flex gap-4">
        <div className="h-16 bg-purple-50 rounded-xl flex-1" />
        <div className="h-16 bg-purple-50 rounded-xl flex-1" />
        <div className="h-16 bg-purple-50 rounded-xl flex-1" />
      </div>
    </div>
  );
}

function DashboardContent() {
  const params = useSearchParams();
  const router = useRouter();
  const mobile = params.get("mobile") ?? "";

  const [data, setData] = useState<DashboardMetrics | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!mobile || mobile.length < 10) {
      router.replace("/");
      return;
    }

    async function load() {
      setLoading(true);
      try {
        const res = await fetch(`/api/expert/${mobile}`);
        if (!res.ok) {
          const json = await res.json();
          setError(json.error ?? "Could not load data.");
          return;
        }
        const json: DashboardMetrics = await res.json();
        setData(json);

        // Log visit async
        fetch("/api/log-visit", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            mobile_number: mobile,
            device_type: /Mobi|Android/i.test(navigator.userAgent) ? "mobile" : "desktop",
            browser: navigator.userAgent.slice(0, 100),
            viewed_today: true,
            viewed_overall: true,
            viewed_history: true,
          }),
        }).catch(() => {});
      } catch {
        setError("Network error. Please try again.");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [mobile, router]);

  return (
    <main className="min-h-screen px-4 py-8 max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-dostt-purple rounded-xl px-3 py-1.5 flex items-center justify-center">
          <Image src="/dostt-logo-white.png" alt="dostt" width={80} height={26} className="object-contain" />
        </div>
        <div className="flex-1" />
        <button
          onClick={() => {
            localStorage.removeItem("dostt_mobile");
            router.push("/");
          }}
          className="text-sm text-gray-400 hover:text-red-500 transition-colors font-medium"
        >
          Logout
        </button>
      </div>

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Your Performance</h1>
        <p className="text-gray-500 text-sm mt-1">Mobile: +91 {mobile}</p>
      </div>

      {loading && (
        <div className="flex flex-col gap-4">
          <SkeletonCard />
          <SkeletonCard />
        </div>
      )}

      {!loading && error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-2xl p-6 text-center">
          <p className="font-semibold text-lg mb-1">No data found</p>
          <p className="text-sm">{error}</p>
          <button
            onClick={() => router.push("/")}
            className="mt-4 bg-dostt-purple text-white px-6 py-2 rounded-xl text-sm font-medium"
          >
            Try another number
          </button>
        </div>
      )}

      {!loading && data && (
        <div className="flex flex-col gap-5">
          {data.today && <TodayCard today={data.today} />}
          <OverallCard overall={data.overall} />
          <HistoryTable history={data.history} />
        </div>
      )}
    </main>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen px-4 py-8 max-w-2xl mx-auto">
        <div className="flex flex-col gap-4 mt-16">
          <div className="h-48 bg-white rounded-2xl animate-pulse border border-purple-100" />
          <div className="h-48 bg-white rounded-2xl animate-pulse border border-purple-100" />
        </div>
      </main>
    }>
      <DashboardContent />
    </Suspense>
  );
}
