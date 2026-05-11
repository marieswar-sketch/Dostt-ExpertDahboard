const { spawnSync, spawn } = require("child_process");
const path = require("path");

// Run DB table init before starting
if (process.env.DATABASE_URL) {
  const result = spawnSync("node", [path.join(__dirname, "scripts/init-db.js")], {
    stdio: "inherit",
    env: process.env,
  });
  if (result.error) {
    console.error("DB init warning:", result.error.message);
  }
}

// Start Next.js
const port = process.env.PORT || "3000";
const next = spawn(
  path.join(__dirname, "node_modules/.bin/next"),
  ["start", "-p", port],
  { stdio: "inherit", env: process.env, cwd: __dirname }
);

next.on("exit", (code) => process.exit(code ?? 0));
