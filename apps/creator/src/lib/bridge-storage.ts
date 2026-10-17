import { readFile } from "node:fs/promises";
import path from "node:path";
import os from "node:os";
import { validConfig } from "./bridge-crypto";

export function bridgeDirectory() {
  return (
    process.env.DEVPULSE_BRIDGE_DIRECTORY ||
    path.join(process.env.LOCALAPPDATA || os.homedir(), "DevPulsePortfolio", "bridge")
  );
}
export async function readBridge() {
  try {
    const directory = bridgeDirectory();
    const config: unknown = JSON.parse(await readFile(path.join(directory, "config.json"), "utf8"));
    const key = await readFile(path.join(directory, "key.bin"));
    if (!validConfig(config) || key.length !== 32) return null;
    return { config, key };
  } catch {
    return null;
  }
}
