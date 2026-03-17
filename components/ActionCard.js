"use client";

import { useState } from "react";

// One job: display numbered action items, extracting owner and deadline into grey sub-text

// Parses "Do the thing — Owner: Alex, Deadline: March 20" into parts.
// Returns { main, owner, deadline }. owner/deadline are null if not found.
function parseAction(raw) {
  const ownerMatch = raw.match(/Owner:\s*([^,\n]+)/i);
  const deadlineMatch = raw.match(/(?:Deadline|Due):\s*([^,\n]+)/i);

  // Strip the metadata portion so the main text stays clean
  let main = raw
    .replace(/[—–-]?\s*Owner:\s*[^,\n]+,?\s*/gi, "")
    .replace(/[—–-]?\s*(?:Deadline|Due):\s*[^,\n]+,?\s*/gi, "")
    .replace(/[,\s]+$/, "")
    .trim();

  return {
    main: main || raw,
    owner: ownerMatch ? ownerMatch[1].trim() : null,
    deadline: deadlineMatch ? deadlineMatch[1].trim() : null,
  };
}

export default function ActionCard({ actions }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const text = actions
      .map((a, i) => `${i + 1}. ${a}`)
      .join("\n");
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className="bg-white rounded-xl shadow-sm p-6"
      style={{ animation: "fadeIn 0.4s ease-out 0.1s both" }}
    >
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs font-bold tracking-widest text-indigo-600 uppercase">
          Action Items
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

      <ol className="space-y-4 list-none">
        {actions.map((raw, i) => {
          const { main, owner, deadline } = parseAction(raw);
          const meta = [
            owner ? `Owner: ${owner}` : null,
            deadline ? `Deadline: ${deadline}` : null,
          ]
            .filter(Boolean)
            .join("  ·  ");

          return (
            <li key={i} className="flex gap-3">
              <span className="flex-shrink-0 h-5 w-5 rounded-full bg-indigo-100 text-indigo-700
                               text-xs font-bold flex items-center justify-center mt-0.5">
                {i + 1}
              </span>
              <div>
                <p className="text-sm text-gray-800 leading-snug">{main}</p>
                {meta && (
                  <p className="text-xs text-gray-400 mt-0.5">{meta}</p>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
