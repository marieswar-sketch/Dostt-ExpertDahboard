import { Pool } from "pg";

let pool: Pool | null = null;

export function getPool(): Pool {
  if (!pool) {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.DB_SSL === "true" ? { rejectUnauthorized: false } : false,
    });
  }
  return pool;
}
