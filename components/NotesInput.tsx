"use client";

// One job: accept raw meeting notes and submit them for processing

type Props = {
  notes: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  loading: boolean;
};

export default function NotesInput({ notes, onChange, onSubmit, loading }: Props) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <label
        htmlFor="notes"
        className="block text-sm font-semibold text-gray-700 mb-2"
      >
        Paste your meeting notes
      </label>
      <textarea
        id="notes"
        value={notes}
        onChange={(e) => onChange(e.target.value)}
        placeholder="e.g. Discussed Q3 targets with Sarah. John to send revised deck by Friday. Budget approved at $50k…"
        rows={8}
        className="w-full border border-gray-200 rounded-lg p-3 text-gray-800 text-sm
                   placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400
                   resize-y"
      />
      <button
        onClick={onSubmit}
        disabled={loading || notes.trim().length < 10}
        className="mt-4 w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50
                   disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg
                   transition-colors duration-150"
      >
        {loading ? "Processing…" : "Generate Summary"}
      </button>
    </div>
  );
}
