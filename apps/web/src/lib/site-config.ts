export function creatorUrl() {
  const raw = process.env.DEVPULSE_CREATOR_URL || "http://127.0.0.1:3101/";
  try {
    const url = new URL(raw);
    const loopback = url.hostname === "127.0.0.1" || url.hostname === "localhost";
    if (
      url.username ||
      url.password ||
      url.hash ||
      url.search ||
      (url.protocol !== "https:" && !(loopback && url.protocol === "http:"))
    )
      return undefined;
    if (process.env.NODE_ENV === "production" && loopback) return undefined;
    return url.href;
  } catch {
    return undefined;
  }
}
