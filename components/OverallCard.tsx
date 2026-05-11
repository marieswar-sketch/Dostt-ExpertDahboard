import type { OverallMetrics } from "@/lib/metrics";

interface Props {
  overall: OverallMetrics;
}

function StatRow({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex items-center justify-between py-2.5 border-b border-purple-50 last:border-0">
      <span className="text-sm text-gray-600">{label}</span>
      <span className="text-sm font-semibold text-dostt-purple">{value}</span>
    </div>
  );
}

export default function OverallCard({ overall }: Props) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-purple-100 overflow-hidden">
      <div className="bg-dostt-purple px-6 py-4">
        <h2 className="text-white font-semibold text-base">Overall Performance</h2>
      </div>

      <div className="p-5">
        <div className="mb-4">
          <StatRow label="Total Active Days" value={overall.total_active_days} />
          <StatRow label="Days Above 5 Hours" value={overall.days_above_5hrs} />
          <StatRow label="Avg Availability" value={`${overall.avg_availability} hrs`} />
          <StatRow label="Total Talk Time" value={`${overall.total_talktime} hrs`} />
          <StatRow label="Total Missed Calls" value={overall.total_missed_calls} />
        </div>

        <div className="bg-dostt-purple-bg rounded-xl px-4 py-3">
          <p className="text-sm text-dostt-purple-dark leading-relaxed">
            🏆 {overall.motivation_message}
          </p>
        </div>
      </div>
    </div>
  );
}
