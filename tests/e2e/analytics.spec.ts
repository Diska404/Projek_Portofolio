import { test, expect } from "@playwright/test";

test("personal analytics filters preserve unknown data and distinguish language sources", async ({
  page,
}) => {
  await page.goto("/#statistics");
  const stats = page.locator("#statistics");
  const scope = stats.getByRole("group", { name: "Akun statistik GitHub" });
  await expect(stats.locator(".analytics-account")).toHaveCount(2);
  await scope.getByRole("button", { name: "Diska404", exact: true }).click();
  await expect(stats.locator(".analytics-account")).toHaveCount(1);
  await expect(stats.locator(".analytics-account")).toContainText("Diska404");
  await scope.getByRole("button", { name: "RaizeiID", exact: true }).click();
  await expect(stats.locator(".analytics-account")).toContainText("RaizeiID");
  await stats.getByRole("button", { name: "90 hari", exact: true }).click();
  await expect(stats.locator(".analytics-range")).toContainText("90 hari terakhir · RaizeiID");
  await stats.getByRole("button", { name: "Komposisi kode", exact: true }).click();
  await expect(stats.locator(".language-empty")).toContainText("Jumlah byte kode");
  await stats.getByRole("button", { name: "Durasi coding", exact: true }).click();
  await expect(stats.locator(".language-empty")).toContainText("WakaTime belum terhubung");
  await stats
    .getByRole("group", { name: "Jenis aktivitas" })
    .getByRole("button", { name: "Review", exact: true })
    .click();
  await expect(stats.locator(".activity-journal > p")).toContainText("Review · Belum ada sumber");
  for (const value of await stats.locator(".metric-value").allTextContents())
    expect(value).toBe("—");
  const definition = stats.locator('[data-metric="commits"] summary');
  await definition.focus();
  await page.keyboard.press("Enter");
  await expect(stats.locator('[data-metric="commits"] details')).toHaveAttribute("open", "");
  await expect(stats.locator('[data-metric="commits"] details')).toContainText(
    "repository dan SHA",
  );
});

test("creator publishing metrics and serialized page cannot select the other account", async ({
  page,
}) => {
  await page.goto("http://127.0.0.1:3101/?account=Diska404&audience=personal#statistics");
  const stats = page.locator("#statistics");
  await expect(
    stats.getByRole("heading", { name: "Video dipublikasikan", exact: true }),
  ).toBeVisible();
  await expect(stats.getByRole("heading", { name: "Live selesai", exact: true })).toBeVisible();
  await expect(stats.locator('[data-metric="posts"]')).toContainText("Menunggu catatan");
  await expect(stats.locator(".analytics-account")).toHaveCount(1);
  await expect(
    stats.getByRole("link", { name: "Profil GitHub RaizeiID", exact: true }),
  ).toHaveAttribute("href", "https://github.com/RaizeiID");
  // Next serializes the requested query string; verify it cannot select account data.
  expect(await page.locator(".audience-page").innerText()).not.toMatch(
    /Diska404|college-work|WakaTime|127\.0\.0\.1:3100/,
  );
  expect(await page.content()).not.toMatch(/college-work|WakaTime|127\.0\.0\.1:3100/);
  await stats.getByRole("button", { name: "7 hari", exact: true }).click();
  await stats
    .getByRole("group", { name: "Jenis aktivitas" })
    .getByRole("button", { name: "Live", exact: true })
    .click();
  await expect(stats.locator(".activity-journal > p")).toContainText("Live · Belum ada sumber");
  for (const value of await stats.locator(".metric-value").allTextContents())
    expect(value).toBe("—");
  await expect(stats.locator(".observation-empty")).toContainText("cakupan periode terverifikasi");
  await page.goto("http://127.0.0.1:3101/");
  expect(await page.content()).not.toMatch(/Diska404|college-work|WakaTime|127\.0\.0\.1:3100/);
});
