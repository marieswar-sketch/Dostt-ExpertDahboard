import { NextRequest, NextResponse } from "next/server";
import { fetchExpertRows } from "@/lib/redash";
import { computeMetrics } from "@/lib/metrics";
import { getPool } from "@/lib/db";

export async function GET(
  _req: NextRequest,
  { params }: { params: { mobile: string } }
) {
  const mobile = params.mobile?.replace(/\D/g, "");

  if (!mobile || mobile.length < 10) {
    return NextResponse.json({ error: "Invalid mobile number" }, { status: 400 });
  }

  try {
    const rows = await fetchExpertRows(mobile);

    if (rows.length === 0) {
      return NextResponse.json({ error: "No data found for this mobile number" }, { status: 404 });
    }

    const metrics = computeMetrics(rows);

    // Async snapshot upsert — don't block the response
    if (process.env.DATABASE_URL) {
      snapshotMetrics(mobile, rows).catch(() => {});
    }

    return NextResponse.json(metrics);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

async function snapshotMetrics(mobile: string, rows: Awaited<ReturnType<typeof fetchExpertRows>>) {
  const pool = getPool();
  for (const row of rows) {
    await pool.query(
      `INSERT INTO expert_metrics_snapshot
        (mobile_number, metric_date, availability_hours, talktime_hours, missed_calls, total_calls, active_day, above_five_hours, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW())
       ON CONFLICT (mobile_number, metric_date)
       DO UPDATE SET
         availability_hours = EXCLUDED.availability_hours,
         talktime_hours = EXCLUDED.talktime_hours,
         missed_calls = EXCLUDED.missed_calls,
         total_calls = EXCLUDED.total_calls,
         active_day = EXCLUDED.active_day,
         above_five_hours = EXCLUDED.above_five_hours,
         updated_at = NOW()`,
      [
        mobile,
        row.date,
        row.availability_hours,
        row.talktime_hours,
        row.missed_calls,
        row.total_calls,
        true,
        parseFloat(String(row.availability_hours)) >= 5,
      ]
    );
  }
}
