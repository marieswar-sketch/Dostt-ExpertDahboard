import { Pool } from "pg";
import { readFileSync } from "fs";
import { join } from "path";

async function initDb() {
  if (!process.env.DATABASE_URL) {
    console.log("DATABASE_URL not set — skipping DB init");
    return;
  }

  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const schema = readFileSync(join(__dirname, "../sql/schema.sql"), "utf-8");

  try {
    await pool.query(schema);
    console.log("DB tables ready");
  } finally {
    await pool.end();
  }
}

initDb().catch((err) => {
  console.error("DB init failed:", err.message);
  process.exit(1);
});
