export interface RawRow {
  mobile_number: string;
  date: string;
  availability_hours: number | string;
  talktime_hours: number | string;
  missed_calls: number | string;
  total_calls: number | string;
  [key: string]: unknown;
}

function normalizeMobile(mobile: string): string {
  const digits = String(mobile).replace(/\D/g, "");
  // Strip leading 91 country code if present
  return digits.startsWith("91") && digits.length === 12 ? digits.slice(2) : digits;
}

export async function fetchExpertRows(mobileNumber: string): Promise<RawRow[]> {
  const apiUrl = process.env.REDASH_API_URL;
  const apiKey = process.env.REDASH_API_KEY;

  if (!apiUrl) throw new Error("REDASH_API_URL not configured");

  const url = apiKey ? `${apiUrl}?api_key=${apiKey}` : apiUrl;
  const res = await fetch(url, { next: { revalidate: 60 } });

  if (!res.ok) throw new Error(`Redash fetch failed: ${res.status}`);

  const json = await res.json();
  const rows: RawRow[] = json?.query_result?.data?.rows ?? [];

  const target = normalizeMobile(mobileNumber);
  return rows.filter((row) => normalizeMobile(String(row.mobile_number)) === target);
}
