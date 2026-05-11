const { spawnSync, spawn } = require("child_process");
const path = require("path");
const fs = require("fs");

const ROOT = __dirname;

function run(cmd, args, extraEnv = {}) {
  console.log(`> ${cmd} ${args.join(" ")}`);
  const result = spawnSync(cmd, args, {
    stdio: "inherit",
    env: { ...process.env, ...extraEnv },
    cwd: ROOT,
  });
  return result.status ?? 1;
}

// Build if no production build exists
const buildId = path.join(ROOT, ".next", "BUILD_ID");
if (!fs.existsSync(buildId)) {
  console.log("No production build found. Installing dependencies...");
  if (run("npm", ["install"]) !== 0) {
    console.error("npm install failed, exiting.");
    process.exit(1);
  }

  console.log("Running next build...");
  if (run("node_modules/.bin/next", ["build"], { NODE_ENV: "production" }) !== 0) {
    console.error("next build failed, exiting.");
    process.exit(1);
  }
}

// Run DB table init (non-fatal if it fails)
if (process.env.DATABASE_URL) {
  const initScript = path.join(ROOT, "scripts/init-db.js");
  if (fs.existsSync(initScript)) {
    console.log("Running DB init...");
    run("node", [initScript]);
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
