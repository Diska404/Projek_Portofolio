import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { createHash } from "node:crypto";
import path from "node:path";
import { publicProfile } from "../apps/web/src/lib/public-content";
import { levaSnapshot } from "../apps/web/src/lib/leva-architecture";

const root = path.resolve("apps/web/public/leva");

test("Leva documentation belongs only to the approved personal audience", () => {
  assert.equal(
    publicProfile("personal").projects.find((p) => p.id === "leva-assistant")?.href,
    "/projects/leva",
  );
  assert.doesNotMatch(
    JSON.stringify(publicProfile("creator")),
    /leva-assistant|Private_Assistant_AI|\/projects\/leva/,
  );
});

test("published graph, page metrics and provenance describe the same intact snapshot", () => {
  const graph = JSON.parse(readFileSync(path.join(root, "graph.json"), "utf8"));
  const snapshot = JSON.parse(readFileSync(path.join(root, "SNAPSHOT.json"), "utf8"));
  assert.equal(graph.nodes.length, levaSnapshot.nodes);
  assert.equal(graph.links.length, levaSnapshot.edges);
  assert.equal(snapshot.nodes, levaSnapshot.nodes);
  assert.equal(snapshot.edges, levaSnapshot.edges);
  assert.equal(snapshot.application_snapshot, levaSnapshot.version);
  assert.equal(snapshot.repository_source_snapshot, "0.3.0");
  const ids = new Set(graph.nodes.map((n: { id: string }) => n.id));
  for (const link of graph.links) assert.ok(ids.has(link.source) && ids.has(link.target));
  for (const [name, expected] of Object.entries(snapshot.sha256)) {
    assert.equal(
      createHash("sha256")
        .update(readFileSync(path.join(root, name)))
        .digest("hex"),
      expected,
      name,
    );
  }
});

test("public artifacts exclude machine paths, private gateway addresses, credentials and runtime files", () => {
  for (const name of readdirSync(root)) {
    assert.ok(/\.(?:json|html|md|txt)$/.test(name), name);
    const text = readFileSync(path.join(root, name), "utf8");
    assert.doesNotMatch(
      text,
      /\b[A-Za-z]:[\\/]|https?:\/\/[\w.-]+\.ts\.net|\b192\.168\.\d+\.\d+\b/,
      name,
    );
    assert.doesNotMatch(
      text,
      /AIza[0-9A-Za-z_-]{30,}|gh[pousr]_[0-9A-Za-z]{30,}|github_pat_[0-9A-Za-z_]{30,}/,
      name,
    );
  }
});
