import { test } from "node:test";
import assert from "node:assert/strict";
import { randomBytes } from "node:crypto";
import {
  createBridgeConfig,
  unlockDestination,
  validDestination,
  AttemptBudget,
} from "../apps/creator/src/lib/bridge-crypto";
import { createBridgeHandler } from "../apps/creator/src/lib/bridge-handler";
import { publicProfile } from "../apps/web/src/lib/public-content";

const passphrase = randomBytes(24).toString("base64url");
const destination = "https://private-location.example/";
const stored = await createBridgeConfig(passphrase, destination);
function request(body: unknown, origin = "http://127.0.0.1:3101") {
  return new Request("http://127.0.0.1:3101/api/bridge", {
    method: "POST",
    headers: { Origin: origin, "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}
const handler = () =>
  createBridgeHandler(
    async () => stored,
    new AttemptBudget(),
    () => false,
  );

test("creator projection excludes college work and personal fields", () => {
  const creator = publicProfile("creator");
  assert.equal(creator.projects.length, 2);
  assert.doesNotMatch(
    JSON.stringify(creator),
    /college-work|Proyek perkuliahan|Profil pribadi|personalUrl|legalName|avatarUrl/,
  );
  assert.equal(publicProfile("personal").projects.length, 3);
  assert.ok(creator.projects.some((p) => p.id === "gfl2-localization"));
});
test("destination is encrypted; only the correct passphrase can disclose it", async () => {
  assert.doesNotMatch(
    JSON.stringify(stored.config),
    new RegExp(destination.replaceAll(".", "\\.")),
  );
  assert.ok(!JSON.stringify(stored.config).includes(passphrase));
  assert.equal(await unlockDestination(passphrase, stored.config, stored.key), destination);
  assert.equal(await unlockDestination("wrong passphrase", stored.config, stored.key), null);
});
test("tampered ciphertext or key cannot return a destination", async () => {
  const tampered = { ...stored.config, tag: "0".repeat(32) };
  await assert.rejects(() => unlockDestination(passphrase, tampered, stored.key));
  await assert.rejects(() => unlockDestination(passphrase, stored.config, randomBytes(32)));
});
test("unsafe destinations and weak setup passphrases are rejected", async () => {
  for (const raw of [
    "javascript:alert(1)",
    "http://external.example/",
    "https://user:password@example.com/",
    "https://example.com/?token=123",
    "//example.com/",
  ])
    assert.throws(() => validDestination(raw));
  await assert.rejects(() => createBridgeConfig("short", destination));
});
test("guarded shortcut validates before disclosing and ignores destination overrides", async () => {
  const post = handler();
  const denied = await post(request({ passphrase: "wrong", destination: "https://evil.example/" }));
  assert.equal(denied.status, 401);
  assert.ok(!(await denied.text()).includes(destination));
  const accepted = await post(request({ passphrase, destination: "https://evil.example/" }));
  assert.deepEqual(await accepted.json(), { destination });
  assert.equal(accepted.headers.get("cache-control"), "no-store");
  assert.equal(accepted.headers.get("referrer-policy"), "no-referrer");
});
test("cross-origin, missing-origin, non-POST and malformed requests are denied", async () => {
  const post = handler();
  assert.equal((await post(request({ passphrase }, "https://evil.example"))).status, 403);
  assert.equal((await post(new Request("http://127.0.0.1:3101/api/bridge"))).status, 405);
  const missing = request({ passphrase });
  missing.headers.delete("origin");
  assert.equal((await post(missing)).status, 403);
  assert.equal((await post(request([]))).status, 400);
  assert.equal((await post(request({ passphrase: 123 }))).status, 400);
  assert.equal((await post(request({ passphrase: "x".repeat(2000) }))).status, 413);
});
test("missing configuration and production bridge fail closed", async () => {
  const missing = createBridgeHandler(
    async () => null,
    new AttemptBudget(),
    () => false,
  );
  assert.equal((await missing(request({ passphrase }))).status, 503);
  const production = createBridgeHandler(
    async () => stored,
    new AttemptBudget(),
    () => true,
  );
  const denied = await production(request({ passphrase }));
  assert.equal(denied.status, 503);
  assert.ok(!(await denied.text()).includes(destination));
});
test("attempt limits include concurrency and recover after the window", () => {
  let now = 1_000;
  const budget = new AttemptBudget(() => now);
  assert.equal(budget.acquire(), true);
  assert.equal(budget.acquire(), false);
  budget.release();
  for (let i = 0; i < 9; i++) {
    assert.equal(budget.acquire(), true);
    budget.release();
  }
  assert.equal(budget.acquire(), false);
  now += 600_001;
  assert.equal(budget.acquire(), true);
  budget.release();
});
test("trusted public origin works when Next normalizes the internal hostname", async () => {
  const post = createBridgeHandler(
    async () => stored,
    new AttemptBudget(),
    () => false,
    () => "http://127.0.0.1:3101",
  );
  const internal = new Request("http://localhost:3101/api/bridge", {
    method: "POST",
    headers: {
      Origin: "http://127.0.0.1:3101",
      "Content-Type": "application/json",
      Host: "evil.example",
    },
    body: JSON.stringify({ passphrase }),
  });
  const accepted = await post(internal);
  assert.equal(accepted.status, 200);
  assert.deepEqual(await accepted.json(), { destination });
  assert.equal((await post(request({ passphrase }, "http://localhost:3101"))).status, 403);
});
test("endpoint rejects an exhausted attempt budget before verification", async () => {
  const budget = new AttemptBudget();
  for (let i = 0; i < 10; i++) {
    budget.acquire();
    budget.release();
  }
  const post = createBridgeHandler(
    async () => {
      throw new Error("Must not be read");
    },
    budget,
    () => false,
  );
  const result = await post(request({ passphrase }));
  assert.equal(result.status, 429);
  assert.equal(result.headers.get("retry-after"), "600");
});
