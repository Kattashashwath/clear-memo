"use client";

import { useState } from "react";

// One job: display the meeting summary with a copy button and fade-in entrance

export default function SummaryCard({ summary }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const text = summary.join("\n\n");
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className="bg-white rounded-xl shadow-sm p-6"
      style={{ animation: "fadeIn 0.4s ease-out forwards" }}
    >
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs font-bold tracking-widest text-indigo-600 uppercase">
          Summary
        </span>
        <button
          onClick={handleCopy}
          className="text-xs font-medium text-indigo-600 hover:text-indigo-800
                     border border-indigo-200 hover:border-indigo-400 rounded-md
                     px-3 py-1 transition-colors duration-150"
        >
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>

      <div className="space-y-3">
        {summary.map((point, i) => (
          <p key={i} className="text-sm text-gray-700 leading-relaxed">
            {point}
          </p>
        ))}
      </div>
    </div>
  );
}
