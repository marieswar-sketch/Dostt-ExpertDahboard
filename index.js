const { spawnSync, spawn } = require("child_process");
const path = require("path");
const fs = require("fs");

const ROOT = __dirname;

// Self-heal: if no production build exists, install deps and build now
const buildId = path.join(ROOT, ".next", "BUILD_ID");
if (!fs.existsSync(buildId)) {
  console.log("No production build found. Installing dependencies...");
  const install = spawnSync("npm", ["install", "--prefer-offline"], {
    stdio: "inherit",
    env: process.env,
    cwd: ROOT,
  });
  if (install.status !== 0) {
    console.error("npm install failed");
    process.exit(1);
  }

  console.log("Building Next.js app...");
  const build = spawnSync("npm", ["run", "build", "--if-present"], {
    stdio: "inherit",
    env: { ...process.env, NODE_ENV: "production" },
    cwd: ROOT,
  });
  if (build.status !== 0) {
    console.error("next build failed");
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
