import {
  createCipheriv,
  createDecipheriv,
  randomBytes,
  scrypt,
  timingSafeEqual,
} from "node:crypto";

const AAD = Buffer.from("devpulse-shortcut/v1");
export interface BridgeConfig {
  version: 1;
  salt: string;
  hash: string;
  iv: string;
  tag: string;
  ciphertext: string;
}
async function derive(passphrase: string, salt: Buffer): Promise<Buffer> {
  return new Promise((resolve, reject) =>
    scrypt(
      passphrase,
      salt,
      64,
      { N: 131072, r: 8, p: 1, maxmem: 256 * 1024 * 1024 },
      (error, result) => (error ? reject(error) : resolve(result)),
    ),
  );
}
export function validDestination(raw: string): string {
  const url = new URL(raw);
  const loopback = url.hostname === "127.0.0.1" || url.hostname === "localhost";
  if (
    url.username ||
    url.password ||
    url.hash ||
    url.search ||
    (url.protocol !== "https:" && !(loopback && url.protocol === "http:"))
  )
    throw new Error("Invalid destination");
  return url.href;
}
export async function createBridgeConfig(passphrase: string, target: string) {
  if (passphrase.length < 16 || Buffer.byteLength(passphrase) > 256)
    throw new Error("Use a passphrase of 16–256 bytes.");
  const destination = validDestination(target);
  const salt = randomBytes(16),
    key = randomBytes(32),
    iv = randomBytes(12);
  const hash = await derive(passphrase, salt);
  const cipher = createCipheriv("aes-256-gcm", key, iv);
  cipher.setAAD(AAD);
  const ciphertext = Buffer.concat([cipher.update(destination, "utf8"), cipher.final()]);
  const config: BridgeConfig = {
    version: 1,
    salt: salt.toString("hex"),
    hash: hash.toString("hex"),
    iv: iv.toString("hex"),
    tag: cipher.getAuthTag().toString("hex"),
    ciphertext: ciphertext.toString("base64"),
  };
  return { config, key };
}
export function validConfig(config: unknown): config is BridgeConfig {
  if (!config || typeof config !== "object") return false;
  const c = config as BridgeConfig;
  return (
    c.version === 1 &&
    typeof c.salt === "string" &&
    /^[a-f0-9]{32}$/.test(c.salt) &&
    typeof c.hash === "string" &&
    /^[a-f0-9]{128}$/.test(c.hash) &&
    typeof c.iv === "string" &&
    /^[a-f0-9]{24}$/.test(c.iv) &&
    typeof c.tag === "string" &&
    /^[a-f0-9]{32}$/.test(c.tag) &&
    typeof c.ciphertext === "string" &&
    c.ciphertext.length > 0 &&
    c.ciphertext.length < 4096 &&
    /^[A-Za-z0-9+/]+=*$/.test(c.ciphertext)
  );
}
export async function unlockDestination(
  passphrase: string,
  config: BridgeConfig,
  key: Buffer,
): Promise<string | null> {
  if (
    !validConfig(config) ||
    key.length !== 32 ||
    typeof passphrase !== "string" ||
    Buffer.byteLength(passphrase) > 256
  )
    return null;
  const candidate = await derive(passphrase, Buffer.from(config.salt, "hex"));
  if (!timingSafeEqual(candidate, Buffer.from(config.hash, "hex"))) return null;
  const cipher = createDecipheriv("aes-256-gcm", key, Buffer.from(config.iv, "hex"));
  cipher.setAAD(AAD);
  cipher.setAuthTag(Buffer.from(config.tag, "hex"));
  return validDestination(
    Buffer.concat([
      cipher.update(Buffer.from(config.ciphertext, "base64")),
      cipher.final(),
    ]).toString("utf8"),
  );
}

/** Single-process local preview limiter. Public deployment is denied by the route. */
export class AttemptBudget {
  private attempts: number[] = [];
  private active = false;
  constructor(private now = () => Date.now()) {}
  acquire(): boolean {
    const cutoff = this.now() - 10 * 60_000;
    this.attempts = this.attempts.filter((timestamp) => timestamp > cutoff);
    if (this.active || this.attempts.length >= 10) return false;
    this.attempts.push(this.now());
    this.active = true;
    return true;
  }
  release() {
    this.active = false;
  }
}
