import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
const root = process.cwd();
const skip = new Set([
  "node_modules",
  ".git",
  ".next",
  ".r0-dependency-backup",
  "planning",
  "evidence",
  "test-results",
  "playwright-report",
]);
const patterns = [
  /ghp_[A-Za-z0-9]{30,}/,
  /github_pat_[A-Za-z0-9_]{30,}/,
  /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/,
  /NEXT_PUBLIC_[A-Z_]*(?:SECRET|SERVICE_ROLE|TOKEN|API_KEY)\s*=\s*[^\s#]+/,
];
let count = 0;
const failures = [];
async function walk(dir) {
  for (const item of await readdir(dir, { withFileTypes: true })) {
    if (skip.has(item.name) || item.name.startsWith(".r0-")) continue;
    const p = path.join(dir, item.name);
    if (item.isDirectory()) {
      await walk(p);
      continue;
    }
    if (item.name.startsWith(".env") && item.name !== ".env.example")
      failures.push(`${path.relative(root, p)}: real environment file in workspace`);
    if (
      !/\.(ts|tsx|js|mjs|json|css|env|example|ya?ml)$/.test(p) ||
      item.name === "package-lock.json"
    )
      continue;
    const text = await readFile(p, "utf8");
    count++;
    if (patterns.some((regex) => regex.test(text)))
      failures.push(`${path.relative(root, p)}: possible credential pattern`);
  }
}
await walk(root);
if (failures.length) {
  console.error(failures.join("\n"));
  process.exitCode = 1;
} else
  console.log(
    `PASS: credential-pattern scan of ${count} source/config files. No live credentials supplied.`,
  );
