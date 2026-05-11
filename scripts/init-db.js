// eslint-disable-next-line @typescript-eslint/no-require-imports
const { Pool } = require("pg");
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { readFileSync } = require("fs");
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { join } = require("path");

async function initDb() {
  if (!process.env.DATABASE_URL) {
    console.log("DATABASE_URL not set — skipping DB init");
    return;
  }

  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const schema = readFileSync(join(__dirname, "../sql/schema.sql"), "utf-8");

  try {
    await pool.query(schema);
    console.log("✓ DB tables ready");
  } finally {
    await pool.end();
  }
}

initDb().catch((err) => {
  console.error("DB init failed:", err.message);
  process.exit(1);
});
