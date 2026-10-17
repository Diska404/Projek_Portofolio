import { OWNER_DENIAL } from "@devpulse/contracts";
function deny() {
  return Response.json(OWNER_DENIAL, { status: 401, headers: { "Cache-Control": "no-store" } });
}
export {
  deny as GET,
  deny as POST,
  deny as PUT,
  deny as PATCH,
  deny as DELETE,
  deny as OPTIONS,
  deny as HEAD,
};
