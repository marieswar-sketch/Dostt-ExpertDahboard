import { NextRequest, NextResponse } from "next/server";
import { getPool } from "@/lib/db";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const {
    mobile_number,
    device_type,
    browser,
    viewed_today,
    viewed_overall,
    viewed_history,
    session_id,
  } = body;

  if (!mobile_number) {
    return NextResponse.json({ error: "mobile_number required" }, { status: 400 });
  }

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? null;
  const cleanMobile = String(mobile_number).replace(/\D/g, "");
  const now = new Date().toISOString();

  // DB logging (if configured)
  if (process.env.DATABASE_URL) {
    try {
      const pool = getPool();
      await pool.query(
        `INSERT INTO dashboard_usage_logs
           (mobile_number, session_id, first_seen_at, last_seen_at, total_visits,
            viewed_today_metrics, viewed_overall_metrics, viewed_history_table,
            device_type, browser, ip_address, created_at, updated_at)
         VALUES ($1, $2, NOW(), NOW(), 1, $3, $4, $5, $6, $7, $8, NOW(), NOW())
         ON CONFLICT (mobile_number)
         DO UPDATE SET
           last_seen_at = NOW(),
           total_visits = dashboard_usage_logs.total_visits + 1,
           viewed_today_metrics = GREATEST(dashboard_usage_logs.viewed_today_metrics::int, $3::int)::boolean,
           viewed_overall_metrics = GREATEST(dashboard_usage_logs.viewed_overall_metrics::int, $4::int)::boolean,
           viewed_history_table = GREATEST(dashboard_usage_logs.viewed_history_table::int, $5::int)::boolean,
           device_type = COALESCE($6, dashboard_usage_logs.device_type),
           browser = COALESCE($7, dashboard_usage_logs.browser),
           updated_at = NOW()`,
        [
          cleanMobile,
          session_id ?? null,
          viewed_today ?? false,
          viewed_overall ?? false,
          viewed_history ?? false,
          device_type ?? null,
          browser ?? null,
          ip,
        ]
      );
    } catch {
      // non-fatal — don't block response
    }
  }

  // Google Sheets logging (if configured)
  if (process.env.GOOGLE_SHEET_SCRIPT_URL) {
    logToSheet({
      timestamp: now,
      mobile_number: cleanMobile,
      device_type: device_type ?? "",
      browser: (browser ?? "").slice(0, 80),
      viewed_today: viewed_today ? "Yes" : "No",
      viewed_overall: viewed_overall ? "Yes" : "No",
      viewed_history: viewed_history ? "Yes" : "No",
      ip_address: ip ?? "",
    }).catch(() => {});
  }

  return NextResponse.json({ ok: true });
}

async function logToSheet(row: Record<string, string>) {
  await fetch(process.env.GOOGLE_SHEET_SCRIPT_URL!, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      sheet: "DashboardLogs",
      row: [
        row.timestamp,
        row.mobile_number,
        row.device_type,
        row.browser,
        row.viewed_today,
        row.viewed_overall,
        row.viewed_history,
        row.ip_address,
      ],
    }),
  });
}
