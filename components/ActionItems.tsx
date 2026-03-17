// One job: display the numbered list of action items

type Props = {
  actions: string[];
};

export default function ActionItems({ actions }: Props) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h2 className="text-base font-semibold text-gray-900 mb-4">Action Items</h2>
      <ol className="space-y-2 list-none">
        {actions.map((action, i) => (
          <li key={i} className="flex gap-3 text-sm text-gray-700">
            {/* Numbered badge — visually clear for consultants scanning quickly */}
            <span className="flex-shrink-0 h-5 w-5 rounded-full bg-indigo-100 text-indigo-700
                             text-xs font-bold flex items-center justify-center">
              {i + 1}
            </span>
            <span>{action}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}
