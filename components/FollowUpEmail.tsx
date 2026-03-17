"use client";

import { useState } from "react";

// One job: display the follow-up email draft and let the user copy it

type Props = {
  email: string;
};

export default function FollowUpEmail({ email }: Props) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(email);
    setCopied(true);
    // Reset the "Copied!" label after 2 seconds
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-semibold text-gray-900">Follow-Up Email</h2>
        <button
          onClick={handleCopy}
          className="text-xs font-medium text-indigo-600 hover:text-indigo-800
                     border border-indigo-200 hover:border-indigo-400 rounded-md
                     px-3 py-1 transition-colors duration-150"
        >
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>
      {/* Pre-wrap preserves the line breaks in the email */}
      <pre className="text-sm text-gray-700 whitespace-pre-wrap font-sans leading-relaxed
                      bg-gray-50 rounded-lg p-4">
        {email}
      </pre>
    </div>
  );
}
