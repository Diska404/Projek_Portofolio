export function GET() {
  return Response.json(
    { application: "DevPulse", audience: "creator" },
    { headers: { "Cache-Control": "no-store" } },
  );
}
