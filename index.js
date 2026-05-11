const { spawnSync, spawn } = require("child_process");
const path = require("path");
const fs = require("fs");

const ROOT = __dirname;

// Run DB table init (non-fatal if it fails)
if (process.env.DATABASE_URL) {
  const initScript = path.join(ROOT, "scripts/init-db.js");
  if (fs.existsSync(initScript)) {
    console.log("Running DB init...");
    spawnSync("node", [initScript], { stdio: "inherit", env: process.env });
  }
}

// Start Next.js
const port = process.env.PORT || "3000";
console.log(`Starting Dostt Dashboard on port ${port}...`);

// Use local binary if available, otherwise fall back to npx
const localBin = path.join(ROOT, "node_modules/.bin/next");
const nextBin = fs.existsSync(localBin) ? localBin : "npx";
const nextArgs = fs.existsSync(localBin)
  ? ["start", "-p", port]
  : ["next", "start", "-p", port];

const next = spawn(nextBin, nextArgs, {
  stdio: "inherit",
  env: { ...process.env, NODE_ENV: "production" },
  cwd: ROOT,
});

next.on("exit", (code) => process.exit(code ?? 0));
