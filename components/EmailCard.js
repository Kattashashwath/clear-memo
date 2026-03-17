"use client";

import { useState } from "react";

// One job: display the follow-up email with subject in a grey box and a copy button
// that copies subject + body together

// Splits "Subject: Re: Project Alpha\n\nHi team,..." into { subject, body }
function parseEmail(email) {
  const firstLine = email.split("\n")[0] ?? "";
  const subjectMatch = firstLine.match(/^Subject:\s*(.+)/i);

  if (subjectMatch) {
    const subject = subjectMatch[1].trim();
    const body = email.replace(/^Subject:[^\n]*\n*/i, "").trim();
    return { subject, body };
  }

  return { subject: null, body: email };
}

export default function EmailCard({ email }) {
  const [copied, setCopied] = useState(false);

  const { subject, body } = parseEmail(email);

  const handleCopy = () => {
    const text = subject ? `Subject: ${subject}\n\n${body}` : body;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className="bg-white rounded-xl shadow-sm p-6"
      style={{ animation: "fadeIn 0.4s ease-out 0.2s both" }}
    >
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs font-bold tracking-widest text-indigo-600 uppercase">
          Follow-Up Email
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

      {subject && (
        <div className="bg-gray-100 rounded-lg px-4 py-2 mb-4">
          <p className="text-xs text-gray-500 font-medium uppercase tracking-wide mb-0.5">
            Subject
          </p>
          <p className="text-sm text-gray-700 font-medium">{subject}</p>
        </div>
      )}

      <pre className="text-sm text-gray-700 whitespace-pre-wrap font-sans leading-relaxed">
        {body}
      </pre>
    </div>
  );
}
