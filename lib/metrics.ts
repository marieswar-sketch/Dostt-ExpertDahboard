import type { RawRow } from "./redash";

export interface DayMetrics {
  date: string;
  availability_hours: number;
  talktime_hours: number;
  missed_calls: number;
}

export interface TodayMetrics extends DayMetrics {
  availability_message: string;
  missed_calls_message: string;
  missed_calls_type: "warning" | "success";
}

export interface OverallMetrics {
  total_active_days: number;
  days_above_5hrs: number;
  avg_availability: number;
  total_talktime: number;
  total_missed_calls: number;
  motivation_message: string;
}

export interface DashboardMetrics {
  today: TodayMetrics | null;
  overall: OverallMetrics;
  history: DayMetrics[];
}

function n(val: number | string): number {
  return parseFloat(String(val)) || 0;
}

function availabilityMessage(hours: number): string {
  if (hours >= 5) {
    return `You were available for ${hours.toFixed(1)} hours today. Stay active between 8 PM and 1 AM to earn ₹150–₹300 daily.`;
  }
  return `You were available for ${hours.toFixed(1)} hours today. Try to be available for at least 5 hours to maximize your earnings.`;
}

function missedCallsMessage(missed: number): { message: string; type: "warning" | "success" } {
  if (missed > 0) {
    return {
      message: `You missed ${missed} call${missed > 1 ? "s" : ""} today. Don't miss calls — your profile may become invisible.`,
      type: "warning",
    };
  }
  return {
    message: "Good job! You did not miss any calls today. Keep staying active.",
    type: "success",
  };
}

function motivationMessage(daysAbove5: number): string {
  return `You completed ${daysAbove5} high-availability day${daysAbove5 !== 1 ? "s" : ""}. Maintain your streak for 7 days to unlock ₹600–₹700 extra rewards.`;
}

export function computeMetrics(rows: RawRow[]): DashboardMetrics {
  if (rows.length === 0) {
    return {
      today: null,
      overall: {
        total_active_days: 0,
        days_above_5hrs: 0,
        avg_availability: 0,
        total_talktime: 0,
        total_missed_calls: 0,
        motivation_message: motivationMessage(0),
      },
      history: [],
    };
  }

  // Sort newest first
  const sorted = [...rows].sort((a, b) =>
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const history: DayMetrics[] = sorted.map((r) => ({
    date: r.date,
    availability_hours: n(r.availability_hours),
    talktime_hours: n(r.talktime_hours),
    missed_calls: n(r.missed_calls),
  }));

  const latest = history[0];
  const missedInfo = missedCallsMessage(latest.missed_calls);

  const today: TodayMetrics = {
    ...latest,
    availability_message: availabilityMessage(latest.availability_hours),
    missed_calls_message: missedInfo.message,
    missed_calls_type: missedInfo.type,
  };

  const totalTalktime = history.reduce((s, r) => s + r.talktime_hours, 0);
  const totalMissed = history.reduce((s, r) => s + r.missed_calls, 0);
  const totalAvail = history.reduce((s, r) => s + r.availability_hours, 0);
  const daysAbove5 = history.filter((r) => r.availability_hours >= 5).length;

  const overall: OverallMetrics = {
    total_active_days: history.length,
    days_above_5hrs: daysAbove5,
    avg_availability: parseFloat((totalAvail / history.length).toFixed(1)),
    total_talktime: parseFloat(totalTalktime.toFixed(1)),
    total_missed_calls: totalMissed,
    motivation_message: motivationMessage(daysAbove5),
  };

  return { today, overall, history };
}
