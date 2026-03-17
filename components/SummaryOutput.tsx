// One job: display the 5-bullet meeting summary

type Props = {
  summary: string[];
};

export default function SummaryOutput({ summary }: Props) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h2 className="text-base font-semibold text-gray-900 mb-4">Meeting Summary</h2>
      <ul className="space-y-2">
        {summary.map((point, i) => (
          <li key={i} className="flex gap-3 text-sm text-gray-700">
            {/* Indigo dot as bullet — feels polished without markdown clutter */}
            <span className="mt-1.5 h-2 w-2 rounded-full bg-indigo-500 flex-shrink-0" />
            <span>{point}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
