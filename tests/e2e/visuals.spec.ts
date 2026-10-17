import { test, expect } from "@playwright/test";

test("visual review has explicit sample provenance, keyboard details, tables and composition selection", async ({
  page,
}) => {
  const browserErrors: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error") browserErrors.push(message.text());
  });
  page.on("pageerror", (error) => browserErrors.push(error.message));
  await page.goto("/preview/visuals");
  await expect(
    page.getByText("SIMULASI VISUAL · BUKAN RIWAYAT AKUN", { exact: true }),
  ).toBeVisible();
  const calendar = page.locator('[data-chart="calendar"]');
  await expect(calendar.locator(".calendar-cell")).toHaveCount(365);
  const first = calendar.locator(".calendar-cell").first();
  await first.focus();
  await page.keyboard.press("End");
  await expect(calendar.locator(".calendar-detail")).toContainText("18 Okt 2026");
  await calendar.getByRole("button", { name: "Mingguan", exact: true }).click();
  expect(await calendar.locator(".weekly-column").count()).toBeGreaterThan(50);
  await calendar.locator("summary").click();
  await expect(calendar.locator("table")).toBeVisible();
  await page.locator('[data-chart="composition"] .composition-legend button').first().click();
  await expect(page.locator('[data-chart="composition"] .calendar-detail')).toContainText(
    "Otomatis saja",
  );
  await page.getByLabel("Indikator diagram", { exact: true }).selectOption("ai");
  await expect(page.locator('[data-chart="calendar"]')).toContainText("Aktivitas token AI");
  await expect(page.locator('[data-chart="composition"]')).toContainText("AI lokal");
  expect(browserErrors).toEqual([]);
});
test("gaps and unconnected preview remove invented complete totals, percentages and cumulative cells", async ({
  page,
}) => {
  await page.goto("/preview/visuals");
  await page.getByLabel("Tampilkan celah data", { exact: true }).check();
  await page.getByRole("button", { name: "Kumulatif", exact: true }).click();
  expect(await page.locator('.calendar-cell[data-value="unknown"]').count()).toBeGreaterThan(0);
  await expect(page.locator(".visual-summary-strip > div").first().locator("b")).toHaveText("—");
  await expect(page.locator(".composition-segment")).toHaveCount(0);
  await page
    .getByRole("group", { name: "Sumber pratinjau" })
    .getByRole("button", { name: "Belum terhubung", exact: true })
    .click();
  await expect(page.locator('.calendar-cell:not([data-value="unknown"])')).toHaveCount(0);
  await expect(page.locator(".composition-track")).toHaveClass(/is-unknown/);
  await expect(page.locator(".visual-disclosure")).toContainText(
    "PRATINJAU SUMBER BELUM TERHUBUNG",
  );
});
test("public charts cannot activate sample records through a query", async ({ page }) => {
  await page.goto("http://127.0.0.1:3101/?sample=1&audience=personal#journey");
  await expect(page.locator('.calendar-cell:not([data-value="unknown"])')).toHaveCount(0);
  expect(await page.locator(".audience-page").innerText()).not.toMatch(
    /SIMULASI VISUAL|Diska404|Proyek perkuliahan/,
  );
  await expect(page.locator('.evidence-chart[data-state="sample"]')).toHaveCount(0);
});
for (const width of [390, 768, 1440, 1920]) {
  test(`yearly diagrams fit ${width}px using internal chart scroll`, async ({ page }) => {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto("/preview/visuals");
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
      true,
    );
    await page.goto("/#journey");
    await page.getByLabel("Periode proses", { exact: true }).selectOption("365");
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
      true,
    );
    const work = page.locator('#journey [data-chart="calendar"]');
    await expect(work.locator(".calendar-cell")).toHaveCount(365);
    await expect(work.locator('.calendar-cell:not([data-value="unknown"])')).toHaveCount(0);
  });
}
