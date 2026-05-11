import type { TodayMetrics } from "@/lib/metrics";

interface Props {
  today: TodayMetrics;
}

function MetricChip({ label, value, unit }: { label: string; value: string | number; unit?: string }) {
  return (
    <div className="flex-1 bg-dostt-purple-bg rounded-xl p-4 flex flex-col items-center gap-1 min-w-0">
      <span className="text-2xl font-bold text-dostt-purple truncate">
        {value}
        {unit && <span className="text-sm font-normal ml-0.5">{unit}</span>}
      </span>
      <span className="text-xs text-gray-500 text-center leading-tight">{label}</span>
    </div>
  );
}

export default function TodayCard({ today }: Props) {
  const dateDisplay = new Date(today.date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "2-digit",
  });

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-purple-100 overflow-hidden">
      <div className="bg-dostt-purple px-6 py-4 flex items-center justify-between">
        <h2 className="text-white font-semibold text-base">Today&apos;s Performance</h2>
        <span className="text-purple-200 text-xs">{dateDisplay}</span>
      </div>

      <div className="p-5">
        <div className="flex gap-3 mb-4">
          <MetricChip label="Availability" value={today.availability_hours.toFixed(1)} unit=" hrs" />
          <MetricChip label="Talk Time" value={today.talktime_hours.toFixed(1)} unit=" hrs" />
          <MetricChip
            label="Missed Calls"
            value={today.missed_calls}
          />
        </div>

        {/* Availability message */}
        <div className="bg-purple-50 rounded-xl px-4 py-3 mb-3">
          <p className="text-sm text-dostt-purple-dark leading-relaxed">{today.availability_message}</p>
        </div>

        {/* Missed calls message */}
        <div
          className={`rounded-xl px-4 py-3 ${
            today.missed_calls_type === "warning"
              ? "bg-orange-50 border border-orange-100"
              : "bg-green-50 border border-green-100"
          }`}
        >
          <p
            className={`text-sm leading-relaxed ${
              today.missed_calls_type === "warning" ? "text-orange-700" : "text-green-700"
            }`}
          >
            {today.missed_calls_type === "warning" ? "⚠️ " : "✅ "}
            {today.missed_calls_message}
          </p>
        </div>
      </div>
    </div>
  );
}
