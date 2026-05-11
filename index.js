const { spawnSync, spawn } = require("child_process");
const path = require("path");
const fs = require("fs");

const ROOT = __dirname;
const standaloneServer = path.join(ROOT, ".next/standalone/server.js");

// Run DB table init (non-fatal if it fails)
if (process.env.DATABASE_URL) {
  const initScript = path.join(ROOT, "scripts/init-db.js");
  if (fs.existsSync(initScript)) {
    console.log("Running DB init...");
    spawnSync("node", [initScript], { stdio: "inherit", env: process.env });
  }
}

const port = process.env.PORT || "3000";
console.log(`Starting Dostt Dashboard on port ${port}...`);

const next = spawn("node", [standaloneServer], {
  stdio: "inherit",
  env: {
    ...process.env,
    NODE_ENV: "production",
    PORT: port,
    HOSTNAME: "0.0.0.0",
  },
  cwd: path.join(ROOT, ".next/standalone"),
});

next.on("exit", (code) => process.exit(code ?? 0));
