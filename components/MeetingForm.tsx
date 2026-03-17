"use client";

// One job: collect meeting name + raw notes, call /api/process, and surface the result

import { useState } from "react";
import type { MemoResult } from "@/lib/gemini";

type Props = {
  onSuccess: (result: MemoResult, meetingName: string) => void;
  onStart?: () => void;
};

export default function MeetingForm({ onSuccess, onStart }: Props) {
  const [meetingName, setMeetingName] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    onStart?.();

    try {
      const res = await fetch("/api/process", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notes }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Something went wrong. Please try again.");
        return;
      }

      onSuccess(data, meetingName);
    } catch {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
      {/* Meeting name */}
      <div>
        <label
          htmlFor="meeting-name"
          className="block text-sm font-semibold text-gray-700 mb-1"
        >
          Meeting name
        </label>
        <input
          id="meeting-name"
          type="text"
          value={meetingName}
          onChange={(e) => setMeetingName(e.target.value)}
          placeholder="e.g. Q3 Planning Kickoff"
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-gray-800 text-sm
                     placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
      </div>

      {/* Raw notes */}
      <div>
        <label
          htmlFor="notes"
          className="block text-sm font-semibold text-gray-700 mb-1"
        >
          Meeting notes
        </label>
        <textarea
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Paste your notes here. Messy is fine."
          rows={8}
          className="w-full border border-gray-200 rounded-lg p-3 text-gray-800 text-sm
                     placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400
                     resize-y"
        />
      </div>

      {/* Submit */}
      <button
        onClick={handleSubmit}
        disabled={loading || notes.trim().length < 10}
        className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50
                   disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg
                   transition-colors duration-150"
      >
        {loading ? "Processing…" : "Process Meeting"}
      </button>

      {/* Error */}
      {error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
          {error}
        </p>
      )}
    </div>
  );
}
