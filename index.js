const { spawnSync, spawn } = require("child_process");
const path = require("path");
const fs = require("fs");

const ROOT = __dirname;

// Build if .next doesn't exist (Kubero may not run npm build)
const nextDir = path.join(ROOT, ".next");
if (!fs.existsSync(nextDir)) {
  console.log("Building Next.js app...");
  const build = spawnSync(
    path.join(ROOT, "node_modules/.bin/next"),
    ["build"],
    { stdio: "inherit", env: process.env, cwd: ROOT }
  );
  if (build.status !== 0) {
    console.error("Build failed");
    process.exit(1);
  }
}

// Run DB table init
if (process.env.DATABASE_URL) {
  const initScript = path.join(ROOT, "scripts/init-db.js");
  if (fs.existsSync(initScript)) {
    console.log("Running DB init...");
    spawnSync("node", [initScript], { stdio: "inherit", env: process.env });
  }
}

// Start Next.js
const port = process.env.PORT || "3000";
console.log(`Starting on port ${port}...`);

const next = spawn(
  path.join(ROOT, "node_modules/.bin/next"),
  ["start", "-p", port],
  { stdio: "inherit", env: { ...process.env, NODE_ENV: "production" }, cwd: ROOT }
);

next.on("exit", (code) => process.exit(code ?? 0));
