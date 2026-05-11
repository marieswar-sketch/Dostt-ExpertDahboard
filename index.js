const { spawnSync, spawn } = require("child_process");
const path = require("path");
const fs = require("fs");

const ROOT = __dirname;

// === DIAGNOSTICS ===
console.log("=== STARTUP DIAGNOSTICS ===");
console.log("__dirname:", ROOT);
console.log("process.cwd():", process.cwd());
try {
  console.log("/app contents:", fs.readdirSync("/app").join(", "));
} catch (e) { console.log("/app not readable:", e.message); }
console.log("node_modules exists:", fs.existsSync(path.join(ROOT, "node_modules")));
console.log("node_modules/.bin/next exists:", fs.existsSync(path.join(ROOT, "node_modules/.bin/next")));
console.log(".next/BUILD_ID exists:", fs.existsSync(path.join(ROOT, ".next/BUILD_ID")));
console.log("=== END DIAGNOSTICS ===");

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

const next = spawn(
  path.join(ROOT, "node_modules/.bin/next"),
  ["start", "-p", port],
  {
    stdio: "inherit",
    env: { ...process.env, NODE_ENV: "production" },
    cwd: ROOT,
  }
);

next.on("exit", (code) => process.exit(code ?? 0));
