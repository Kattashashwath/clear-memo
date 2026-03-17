"use client";

import { useState } from "react";
import type { MemoResult } from "@/lib/gemini";

// One job: send the memo result to /api/log and report success or failure

type Props = {
  result: MemoResult;
};

export default function LogButton({ result }: Props) {
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");

  const handleLog = async () => {
    setStatus("loading");
    try {
      const res = await fetch("/api/log", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(result),
      });
      if (!res.ok) throw new Error("Log failed");
      setStatus("done");
    } catch {
      setStatus("error");
    }
  };

  if (status === "done") {
    return (
      <p className="text-center text-sm text-green-600 font-medium py-2">
        Logged to Google Sheets
      </p>
    );
  }

  if (status === "error") {
    return (
      <p className="text-center text-sm text-red-500 font-medium py-2">
        Could not log. Check your Sheets credentials in .env.local.
      </p>
    );
  }

  return (
    <button
      onClick={handleLog}
      disabled={status === "loading"}
      className="w-full border border-indigo-300 text-indigo-600 hover:bg-indigo-50
                 disabled:opacity-50 disabled:cursor-not-allowed font-semibold
                 py-3 rounded-lg transition-colors duration-150 text-sm"
    >
      {status === "loading" ? "Logging…" : "Log to Google Sheets"}
    </button>
  );
}
