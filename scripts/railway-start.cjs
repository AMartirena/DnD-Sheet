const { spawnSync } = require("node:child_process");
const path = require("node:path");

const npmCommand = process.platform === "win32" ? "npm.cmd" : "npm";
const migration = spawnSync(npmCommand, ["run", "db:migrate:deploy"], {
  stdio: "inherit",
  shell: true,
  env: process.env,
});

if (migration.error) {
  throw migration.error;
}

if (migration.status !== 0) {
  process.exit(migration.status ?? 1);
}

const server = spawnSync(process.execPath, [path.join(__dirname, "..", ".next", "standalone", "server.js")], {
  stdio: "inherit",
  env: {
    ...process.env,
    HOSTNAME: "0.0.0.0",
  },
});

if (server.error) {
  throw server.error;
}

process.exit(server.status ?? 1);
