export function GET() {
  return Response.json(
    { application: "DevPulse", audience: "personal" },
    { headers: { "Cache-Control": "no-store" } },
  );
}
