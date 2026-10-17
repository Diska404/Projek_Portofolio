import { test, expect } from "@playwright/test";

test("personal work scope and AI experience keep unconnected observations honest", async ({
  page,
}) => {
  await page.goto("/#journey");
  const atlas = page.locator("#journey");
  await expect(atlas.locator(".atlas-project")).toHaveCount(3);
  await atlas.getByLabel("Fokus proyek", { exact: true }).selectOption("gfl2-localization");
  await expect(atlas.locator(".atlas-project")).toHaveCount(1);
  await expect(atlas.locator(".atlas-project")).toContainText("GFL2 Bahasa Indonesia");
  await atlas.getByLabel("Periode proses", { exact: true }).selectOption("7");
  await expect(atlas.locator(".atlas-project-controls")).toContainText("7 hari");
  await atlas.getByRole("button", { name: "Pengalaman AI", exact: true }).click();
  await expect(atlas.locator('[data-atlas-view="ai"]')).toBeVisible();
  await atlas.getByLabel("Sumber pengalaman AI", { exact: true }).selectOption("AI lokal");
  await atlas
    .getByRole("group", { name: "Tahap pengalaman AI" })
    .getByRole("button", { name: /Diterapkan/ })
    .click();
  await expect(atlas.locator(".atlas-empty")).toContainText("Diterapkan · AI lokal");
  await expect(atlas.locator(".atlas-empty")).toContainText("Belum ada catatan pengalaman");
  for (const value of await atlas.locator(".atlas-metric strong").allTextContents())
    expect(value).toBe("—");
});

test("creator offers community scope and native Steam periods without leaking campus data", async ({
  page,
}) => {
  await page.goto("http://127.0.0.1:3101/?account=Diska404#journey");
  const atlas = page.locator("#journey");
  await expect(atlas.locator(".atlas-project")).toHaveCount(2);
  expect(await atlas.innerText()).not.toMatch(/Diska404|Kampus|college-work|Profil pribadi/);
  await expect(atlas.getByText("Discord", { exact: true })).toBeVisible();
  await expect(atlas.getByText("Facebook", { exact: true })).toBeVisible();
  await atlas.getByRole("button", { name: "Game & Steam", exact: true }).click();
  await atlas.getByRole("button", { name: "Sepanjang masa", exact: true }).click();
  await expect(atlas.locator(".atlas-empty")).toContainText("Sepanjang masa");
  await expect(atlas.locator(".atlas-empty")).toContainText("Library belum tersedia");
  await expect(atlas.locator(".atlas-footnote")).toContainText("Status online");
  for (const value of await atlas.locator(".atlas-metric strong").allTextContents())
    expect(value).toBe("—");
  expect(await atlas.locator("a[href*='steamcommunity.com']").count()).toBe(0);
});

test("review simulation demonstrates interval union without saving account history", async ({
  page,
}) => {
  await page.goto("/preview/activity");
  await expect(
    page.getByText("SIMULASI METODE · BUKAN RIWAYAT AKUN", { exact: true }),
  ).toBeVisible();
  await expect(page.locator(".method-result")).toContainText(
    "45 + 30 − 30 menit tumpang tindih = 45 menit tercatat",
  );
  const offset = page.getByRole("slider", { name: "Jarak mulai jurnal contoh", exact: true });
  await offset.focus();
  await page.keyboard.press("End");
  await expect(page.locator(".method-result")).toContainText(
    "45 + 30 − 0 menit tumpang tindih = 75 menit tercatat",
  );
  await expect(page.getByText(/Tidak ada data yang disimpan atau dipublikasikan/)).toBeVisible();
});

for (const width of [390, 768, 1440, 1920]) {
  test(`AI, Steam and method review fit ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 1000 });
    for (const [url, button] of [
      ["http://127.0.0.1:3100/#journey", "Pengalaman AI"],
      ["http://127.0.0.1:3101/#journey", "Game & Steam"],
    ]) {
      await page.goto(url!);
      await page.locator("#journey").getByRole("button", { name: button!, exact: true }).click();
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth),
      ).toBe(true);
    }
    await page.goto("/preview/activity");
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth),
    ).toBe(true);
  });
}
