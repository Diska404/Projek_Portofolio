import { AttemptBudget, unlockDestination } from "./bridge-crypto";
import type { BridgeConfig } from "./bridge-crypto";

const headers = {
  "Cache-Control": "no-store",
  "Referrer-Policy": "no-referrer",
  "X-Robots-Tag": "noindex, nofollow",
};
const answer = (error: string, status: number, retry = false) =>
  Response.json(
    { error },
    { status, headers: { ...headers, ...(retry ? { "Retry-After": "600" } : {}) } },
  );
export function createBridgeHandler(
  readConfig: () => Promise<{ config: BridgeConfig; key: Buffer } | null>,
  budget = new AttemptBudget(),
  production = () => process.env.NODE_ENV === "production",
  allowedOrigin: () => string | undefined = () => undefined,
) {
  return async function POST(request: Request) {
    if (request.method !== "POST")
      return new Response(null, { status: 405, headers: { ...headers, Allow: "POST" } });
    // R0 has no distributed abuse-control store. Do not expose this local limiter publicly.
    if (production()) return answer("unavailable", 503);
    if (request.headers.get("origin") !== (allowedOrigin() || new URL(request.url).origin))
      return answer("forbidden", 403);
    if (!request.headers.get("content-type")?.startsWith("application/json"))
      return answer("invalid_request", 415);
    if (Number(request.headers.get("content-length")) > 1024) return answer("invalid_request", 413);
    const reader = request.body?.getReader();
    if (!reader) return answer("invalid_request", 400);
    let bytes = 0;
    const chunks: Uint8Array[] = [];
    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        bytes += value.byteLength;
        if (bytes > 1024) {
          await reader.cancel();
          return answer("invalid_request", 413);
        }
        chunks.push(value);
      }
    } catch {
      return answer("invalid_request", 400);
    }
    let passphrase: unknown;
    try {
      const data: unknown = JSON.parse(Buffer.concat(chunks).toString("utf8"));
      if (data && typeof data === "object" && "passphrase" in data) passphrase = data.passphrase;
    } catch {
      return answer("invalid_request", 400);
    }
    if (
      typeof passphrase !== "string" ||
      passphrase.length === 0 ||
      Buffer.byteLength(passphrase) > 256
    )
      return answer("invalid_request", 400);
    if (!budget.acquire()) return answer("try_later", 429, true);
    try {
      const stored = await readConfig();
      if (!stored) return answer("unavailable", 503);
      const destination = await unlockDestination(passphrase, stored.config, stored.key);
      if (!destination) return answer("access_denied", 401);
      return Response.json({ destination }, { headers });
    } catch {
      return answer("unavailable", 503);
    } finally {
      budget.release();
    }
  };
}
