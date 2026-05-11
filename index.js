const { spawnSync } = require("child_process");
const path = require("path");

// Run DB table init before starting the server
if (process.env.DATABASE_URL) {
  const result = spawnSync("node", [path.join(__dirname, "scripts/init-db.js")], {
    stdio: "inherit",
    env: process.env,
  });
  if (result.error) {
    console.error("DB init warning:", result.error.message);
  }
}

// Start Next.js standalone server
require("./server.js");
