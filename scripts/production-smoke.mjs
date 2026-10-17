import { spawn } from "node:child_process";
import { once } from "node:events";
import { createServer } from "node:net";
import { setTimeout as wait } from "node:timers/promises";
import path from "node:path";
import assert from "node:assert/strict";

const reservation = createServer();
reservation.listen(0, "127.0.0.1");
await once(reservation, "listening");
const port = reservation.address().port;
await new Promise((resolve, reject) =>
  reservation.close((error) => (error ? reject(error) : resolve())),
);
const child = spawn(
  process.execPath,
  [
    path.resolve("node_modules/next/dist/bin/next"),
    "start",
    "--hostname",
    "127.0.0.1",
    "--port",
    String(port),
  ],
  {
    cwd: path.resolve("apps/web"),
    env: { ...process.env, NODE_ENV: "production", DEVPULSE_REVIEW_MODE: "0" },
    stdio: ["ignore", "pipe", "pipe"],
    windowsHide: true,
  },
);
const exited = once(child, "exit");
let log = "";
child.stdout.on("data", (chunk) => {
  log = (log + chunk.toString()).slice(-4000);
});
child.stderr.on("data", (chunk) => {
  log = (log + chunk.toString()).slice(-4000);
});
const base = `http://127.0.0.1:${port}`;
try {
  let ready = false;
  for (let attempt = 0; attempt < 60; attempt++) {
    if (child.exitCode !== null) throw Error("Production test server exited: " + log);
    try {
      ready = (await globalThis.fetch(base, { signal: globalThis.AbortSignal.timeout(1000) })).ok;
    } catch {
      ready = false;
    }
    if (ready) break;
    await wait(250);
  }
  assert.ok(ready, "Production server did not become ready");
  const html = await (await globalThis.fetch(base)).text();
  assert.doesNotMatch(
    html,
    /R0 \/ DESIGN REVIEW|SAMPLE DATA · DESIGN PREVIEW|source_account_alias|credential_ref/,
  );
  for (const screen of ["overview", "projects", "integrations", "privacy", "design-system"]) {
    assert.equal((await globalThis.fetch(base + "/preview/" + screen)).status, 404, screen);
  }
  const denied = await globalThis.fetch(base + "/api/owner/projects?owner_id=spoofed");
  assert.equal(denied.status, 401);
  assert.equal(denied.headers.get("cache-control"), "no-store");
  const dashboard = await globalThis.fetch(base + "/dashboard/projects", { redirect: "manual" });
  assert.equal(dashboard.status, 307);
  assert.equal(dashboard.headers.get("location"), "/login");
  console.log(
    "PASS production build: preview routes 404, review navigation absent, owner API 401/no-store, dashboard redirects.",
  );
} finally {
  if (child.exitCode === null) child.kill("SIGTERM");
  await exited;
  console.log("PASS isolated production test server stopped.");
}
