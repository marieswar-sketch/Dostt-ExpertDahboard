const { spawnSync, spawn } = require("child_process");
const path = require("path");
const fs = require("fs");

const ROOT = __dirname;

// Build if no production build exists (Kubero only runs `npm install` as buildCommand)
const buildId = path.join(ROOT, ".next", "BUILD_ID");
if (!fs.existsSync(buildId)) {
  console.log("No production build found. Running next build...");
  const build = spawnSync("node_modules/.bin/next", ["build"], {
    stdio: "inherit",
    env: { ...process.env, NODE_ENV: "production" },
    cwd: ROOT,
  });
  if (build.status !== 0) {
    console.error("next build failed, exiting.");
    process.exit(1);
  }
}

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
