import assert from "node:assert/strict";
const base = process.env.DEVPULSE_TEST_URL || "http://127.0.0.1:3100";
for (const route of [
  "/",
  "/login",
  "/preview/overview",
  "/preview/projects",
  "/preview/integrations",
  "/preview/privacy",
  "/preview/design-system",
]) {
  const response = await fetch(base + route);
  assert.equal(response.status, 200, route);
  assert.match(response.headers.get("x-robots-tag") || "", /noindex/);
  console.log(`PASS ${route}: 200, noindex`);
}
const dashboard = await fetch(base + "/dashboard/private-project?owner_id=anything", {
  redirect: "manual",
});
assert.equal(dashboard.status, 307);
assert.equal(dashboard.headers.get("location"), "/login");
for (const method of ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS", "HEAD"]) {
  const response = await fetch(base + "/api/owner/projects/guess?owner_id=anything", {
    method,
    headers: { "X-Owner-ID": "spoofed", Cookie: "owner=true" },
  });
  assert.equal(response.status, 401, method);
  assert.equal(response.headers.get("cache-control"), "no-store");
}
const publicHtml = await (await fetch(base)).text();
assert.doesNotMatch(
  publicHtml,
  /SAMPLE DATA · DESIGN PREVIEW|Atlas Workspace.*64%|source_account_alias|credential_ref/,
);
assert.equal((await fetch(base + "/preview/unknown-screen")).status, 404);
assert.equal((await fetch(base + "/docs/planning/references/video_0s.jpg")).status, 404);
console.log(
  "PASS owner boundary: all methods 401, spoofed identity denied; dashboard redirects; reference files not served.",
);
