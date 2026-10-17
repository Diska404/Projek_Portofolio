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
await new Promise((resolve) => reservation.close(resolve));
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
    cwd: path.resolve("apps/creator"),
    env: { ...process.env, NODE_ENV: "production", DEVPULSE_REVIEW_MODE: "0" },
    stdio: ["ignore", "pipe", "pipe"],
    windowsHide: true,
  },
);
const exited = once(child, "exit");
let log = "";
for (const stream of [child.stdout, child.stderr])
  stream.on("data", (chunk) => {
    log = (log + chunk).slice(-4000);
  });
const base = `http://127.0.0.1:${port}`;
const forbidden = /college-work|Proyek perkuliahan|Profil pribadi|Diska404|127\.0\.0\.1:3100/;
try {
  let ready = false;
  for (let i = 0; i < 60; i++) {
    if (child.exitCode !== null) throw Error("Creator smoke server exited: " + log);
    try {
      ready = (await globalThis.fetch(base, { signal: globalThis.AbortSignal.timeout(1000) })).ok;
    } catch {
      ready = false;
    }
    if (ready) break;
    await wait(250);
  }
  assert.ok(ready, "Creator production server not ready");
  const root = await globalThis.fetch(base);
  assert.equal(root.headers.get("referrer-policy"), "no-referrer");
  const html = await root.text();
  assert.doesNotMatch(html, forbidden);
  assert.match(html, /GFL2 Bahasa Indonesia/);
  assert.match(html, /https:\/\/github\.com\/RaizeiID/);
  for (const file of [
    ...new Set([...html.matchAll(/<script[^>]*src="([^"]+)"/g)].map((match) => match[1])),
  ]) {
    assert.ok(file.startsWith("/_next/"), "Unexpected external script");
    assert.doesNotMatch(
      await (await globalThis.fetch(base + file.replaceAll("&amp;", "&"))).text(),
      forbidden,
      file,
    );
  }
  assert.doesNotMatch(await (await globalThis.fetch(base + "/access")).text(), forbidden);
  const selected = await (await globalThis.fetch(base + "/?audience=personal")).text();
  assert.doesNotMatch(selected, forbidden);
  for (const route of [
    "/preview/overview",
    "/preview/activity",
    "/preview/visuals",
    "/personal",
    "/dashboard/projects",
  ])
    assert.equal((await globalThis.fetch(base + route)).status, 404);
  for (const method of ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS", "HEAD"])
    assert.equal((await globalThis.fetch(base + "/api/owner/projects", { method })).status, 401);
  assert.equal((await globalThis.fetch(base + "/api/bridge")).status, 405);
  const gate = await globalThis.fetch(base + "/api/bridge", {
    method: "POST",
    headers: { Origin: base, "Content-Type": "application/json" },
    body: JSON.stringify({ passphrase: "not-a-real-passphrase" }),
  });
  assert.equal(gate.status, 503);
  assert.equal(gate.headers.get("cache-control"), "no-store");
  assert.doesNotMatch(await gate.text(), forbidden);
  console.log(
    "PASS creator production: HTML/RSC/client bundles isolated, query override denied, invitation contains no destination, owner methods denied, unreviewed public bridge fails closed.",
  );
} finally {
  if (child.exitCode === null) child.kill("SIGTERM");
  await exited;
  console.log("PASS isolated creator production server stopped.");
}
