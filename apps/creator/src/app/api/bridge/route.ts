import "server-only";
import { createBridgeHandler } from "../../../lib/bridge-handler";
import { readBridge } from "../../../lib/bridge-storage";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
// Next can normalize request.url to an internal hostname. Compare the browser's
// Origin to trusted server configuration, never to client Host/forwarded headers.
export const POST = createBridgeHandler(
  readBridge,
  undefined,
  undefined,
  () => process.env.DEVPULSE_CREATOR_ORIGIN || "http://127.0.0.1:3101",
);
export function GET() {
  return new Response(null, {
    status: 405,
    headers: { Allow: "POST", "Cache-Control": "no-store" },
  });
}
