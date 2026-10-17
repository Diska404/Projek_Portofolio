"use client";
import { useState } from "react";
import { Icon } from "@/components/icons";
export function AccessForm() {
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  return (
    <form
      className="invitation-form"
      onSubmit={async (event) => {
        event.preventDefault();
        if (busy) return;
        const form = event.currentTarget;
        const passphrase = new FormData(form).get("passphrase");
        setBusy(true);
        setMessage("");
        try {
          const response = await fetch("/api/bridge", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ passphrase }),
            cache: "no-store",
            referrerPolicy: "no-referrer",
          });
          if (!response.ok) {
            setMessage(
              response.status === 401
                ? "Kode akses tidak sesuai. Periksa kembali kode yang Anda terima."
                : response.status === 429
                  ? "Terlalu banyak percobaan. Coba lagi dalam 10 menit."
                  : "Gerbang belum tersedia. Hubungi pemilik untuk mendapatkan akses.",
            );
            return;
          }
          const data: { destination?: string } = await response.json();
          if (typeof data.destination !== "string") throw new Error("Invalid response");
          form.reset();
          window.location.assign(data.destination);
        } catch {
          setMessage("Belum bisa terhubung. Coba kembali sebentar lagi.");
        } finally {
          setBusy(false);
        }
      }}
    >
      <label htmlFor="passphrase">Kode akses</label>
      <input
        id="passphrase"
        name="passphrase"
        type="password"
        autoComplete="off"
        required
        maxLength={256}
        placeholder="Masukkan kode undangan"
        aria-describedby="access-note access-status"
        disabled={busy}
      />
      <p id="access-note">Gunakan kode yang dibagikan langsung oleh pemilik.</p>
      <button className="button button-primary" disabled={busy} type="submit">
        {busy ? "Memeriksa…" : "Buka undangan"}
        <Icon name="arrowRight" size={16} />
      </button>
      <p role="status" id="access-status" className="access-status" aria-live="polite">
        {message}
      </p>
    </form>
  );
}
