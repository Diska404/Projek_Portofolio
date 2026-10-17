import { randomBytes } from "node:crypto";
import { access, mkdir, open, writeFile } from "node:fs/promises";
import path from "node:path";
import { createBridgeConfig } from "../apps/creator/src/lib/bridge-crypto";
import { bridgeDirectory } from "../apps/creator/src/lib/bridge-storage";

const directory = bridgeDirectory();
const rotate = process.argv.includes("--rotate");
let exists = false;
try {
  await access(path.join(directory, "config.json"));
  exists = true;
} catch {
  /* First setup. */
}
if (exists && !rotate) {
  console.log(
    "Akses sudah dikonfigurasi. Gunakan npm run setup:bridge -- --rotate untuk membuat kode baru.",
  );
} else {
  // Generated in an interactive owner terminal; never run this through CI/log capture.
  const consoleDevice =
    !process.stdout.isTTY && process.platform === "win32"
      ? await open("\\\\.\\CONOUT$", "w")
      : null;
  if (!process.stdout.isTTY && !consoleDevice)
    throw new Error(
      "Run setup in an interactive terminal; credentials must not enter captured logs.",
    );
  const passphrase = randomBytes(24).toString("base64url");
  const target = process.env.DEVPULSE_PERSONAL_DESTINATION || "http://127.0.0.1:3100/";
  const { config, key } = await createBridgeConfig(passphrase, target);
  await mkdir(directory, { recursive: true, mode: 0o700 });
  await writeFile(path.join(directory, "key.bin"), key, { mode: 0o600 });
  await writeFile(path.join(directory, "config.json"), JSON.stringify(config), { mode: 0o600 });
  let verified = false;
  try {
    const response = await globalThis.fetch("http://127.0.0.1:3101/api/bridge", {
      method: "POST",
      headers: { Origin: "http://127.0.0.1:3101", "Content-Type": "application/json" },
      body: JSON.stringify({ passphrase }),
      signal: globalThis.AbortSignal.timeout(10_000),
    });
    const result: { destination?: string } = await response.json();
    verified = response.status === 200 && result.destination === new URL(target).href;
  } catch {
    /* Preview may not be running during owner setup. */
  }
  await writeFile(
    path.join(directory, "setup-check.json"),
    JSON.stringify({ checkedAt: new Date().toISOString(), verified }),
    { mode: 0o600 },
  );
  const secretMessage =
    "\nKODE AKSES (catat sekarang; tidak disimpan dalam bentuk asli):\n\n" + passphrase + "\n";
  if (consoleDevice) {
    await consoleDevice.writeFile(secretMessage);
    await consoleDevice.close();
  } else process.stdout.write(secretMessage);
  console.log("\nSimpan di password manager dan bagikan hanya kepada orang yang Anda pilih.");
  console.log("Konfigurasi terenkripsi tersimpan di folder lokal pengguna, di luar Git/OneDrive.");
  console.log(
    verified
      ? "Pemeriksaan shortcut lokal: BERHASIL."
      : "Pemeriksaan shortcut belum selesai; jalankan preview kreator untuk mencobanya.",
  );
  console.log(
    "Ini mengatur shortcut preview lokal; deployment publik tetap memerlukan validasi hosting/abuse control.",
  );
}
