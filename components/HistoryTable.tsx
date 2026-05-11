import type { DayMetrics } from "@/lib/metrics";

interface Props {
  history: DayMetrics[];
}

export default function HistoryTable({ history }: Props) {
  if (history.length === 0) return null;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-purple-100 overflow-hidden">
      <div className="bg-dostt-purple px-6 py-4">
        <h2 className="text-white font-semibold text-base">History</h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-dostt-purple-bg">
              <th className="text-left px-4 py-3 text-dostt-purple font-semibold text-xs uppercase tracking-wide">Date</th>
              <th className="text-right px-4 py-3 text-dostt-purple font-semibold text-xs uppercase tracking-wide">Availability</th>
              <th className="text-right px-4 py-3 text-dostt-purple font-semibold text-xs uppercase tracking-wide">Talk Time</th>
              <th className="text-right px-4 py-3 text-dostt-purple font-semibold text-xs uppercase tracking-wide">Missed</th>
            </tr>
          </thead>
          <tbody>
            {history.map((row, i) => {
              const dateStr = new Date(row.date).toLocaleDateString("en-IN", {
                day: "2-digit",
                month: "2-digit",
                year: "2-digit",
              });
              return (
                <tr
                  key={row.date}
                  className={i % 2 === 0 ? "bg-white" : "bg-purple-50/30"}
                >
                  <td className="px-4 py-3 text-gray-700 font-medium">{dateStr}</td>
                  <td className="px-4 py-3 text-right text-gray-700">
                    <span className={row.availability_hours >= 5 ? "text-green-600 font-semibold" : ""}>
                      {row.availability_hours.toFixed(1)} hrs
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right text-gray-700">{row.talktime_hours.toFixed(1)} hrs</td>
                  <td className="px-4 py-3 text-right">
                    <span
                      className={`font-semibold ${
                        row.missed_calls > 0 ? "text-red-500" : "text-green-500"
                      }`}
                    >
                      {row.missed_calls}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
