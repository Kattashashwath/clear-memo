"use client";

import { useState } from "react";
import MeetingForm from "@/components/MeetingForm";
import SummaryOutput from "@/components/SummaryOutput";
import ActionItems from "@/components/ActionItems";
import FollowUpEmail from "@/components/FollowUpEmail";
import LogButton from "@/components/LogButton";
import type { MemoResult } from "@/lib/gemini";

export default function Home() {
  const [result, setResult] = useState<MemoResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [meetingName, setMeetingName] = useState("");

  const handleStart = () => {
    setLoading(true);
    setResult(null);
  };

  const handleSuccess = (data: MemoResult, name: string) => {
    setMeetingName(name);
    setResult(data);
    setLoading(false);
  };

  return (
    <main className="max-w-2xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900">Clear Memo</h1>
        <p className="mt-2 text-gray-500 text-sm">
          Turn messy notes into clear action.
        </p>
      </div>

      {/* Step 1 — Form (hidden once processing or done) */}
      {!loading && !result && (
        <MeetingForm onSuccess={handleSuccess} onStart={handleStart} />
      )}

      {/* Step 2 — Processing state */}
      {loading && (
        <p className="text-center text-gray-500 text-sm mt-12">
          Processing your meeting...
        </p>
      )}

      {/* Step 3 — Results */}
      {result && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-800 fade-in">
            Results for: {meetingName || "your meeting"}
          </h2>

          <div className="fade-in" style={{ animationDelay: "0.05s" }}>
            <SummaryOutput summary={result.summary} />
          </div>
          <div className="fade-in" style={{ animationDelay: "0.15s" }}>
            <ActionItems actions={result.actions} />
          </div>
          <div className="fade-in" style={{ animationDelay: "0.25s" }}>
            <FollowUpEmail email={result.email} />
          </div>
          <div className="fade-in" style={{ animationDelay: "0.35s" }}>
            <LogButton result={result} />
          </div>
        </div>
      )}
    </main>
  );
}
