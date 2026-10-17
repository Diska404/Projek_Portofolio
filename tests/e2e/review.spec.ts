import { test, expect } from "@playwright/test";
import { mkdir } from "node:fs/promises";
for (const width of [390, 768, 1440, 1920]) {
  test(`public and workspace have no page overflow at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 1000 });
    for (const route of ["/", "/preview/overview", "/preview/design-system"]) {
      await page.goto(route);
      await expect(page.locator("h1")).toBeVisible();
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth),
      ).toBe(true);
      await mkdir("docs/evidence", { recursive: true });
      const name = route === "/" ? "portfolio" : route.split("/").at(-1);
      await page.screenshot({ path: `docs/evidence/${name}-${width}.png`, fullPage: true });
    }
  });
}
test("sample mode, date filter, coverage and disconnected state are explicit", async ({ page }) => {
  await page.goto("/preview/overview");
  await expect(page.getByText("SAMPLE DATA · DESIGN PREVIEW.", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "90D", exact: true }).click();
  await expect(page.getByText(/Requested 90 days/)).toBeVisible();
  await page.getByRole("button", { name: "Not connected", exact: true }).click();
  await expect(page.locator(".metric-value").first()).toHaveText("—");
});
test("mobile drawer supports escape and returns focus", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/preview/overview");
  const trigger = page.getByRole("button", { name: "Open navigation", exact: true });
  await trigger.click();
  await expect(page.getByRole("dialog", { name: "Workspace navigation" })).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await expect(trigger).toBeFocused();
});
test("personal project filters preserve the audience boundary", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Kampus", exact: true }).click();
  await expect(page.locator(".public-project")).toHaveCount(1);
  await expect(
    page.locator("#work").getByRole("heading", { name: "Proyek perkuliahan", exact: true }),
  ).toBeVisible();
});
test("private routes and APIs deny unauthenticated visitors", async ({ page, request }) => {
  await page.goto("/dashboard/projects");
  await expect(page).toHaveURL(/\/login$/);
  const response = await request.get("/api/owner/projects/guessed-id?owner_id=spoofed");
  expect(response.status()).toBe(401);
});
test("public mobile navigation supports keyboard escape", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  const toggle = page.getByRole("button", { name: "Toggle navigation" });
  await toggle.click();
  await expect(page.getByRole("navigation", { name: "Public navigation" })).toBeVisible();
  await page.keyboard.press("Tab");
  await page.keyboard.press("Escape");
  await expect(toggle).toHaveAttribute("aria-expanded", "false");
  await expect(toggle).toBeFocused();
});
test("all nine component states can be reviewed without provider calls", async ({ page }) => {
  await page.goto("/preview/design-system");
  for (const state of [
    "loading",
    "ready",
    "empty",
    "not connected",
    "syncing",
    "stale",
    "rate limited",
    "error",
    "permission denied",
  ]) {
    await page.getByRole("button", { name: state, exact: true }).click();
    await expect(page.locator(".data-state")).toHaveAttribute(
      "data-state",
      state.replaceAll(" ", "_"),
    );
  }
});
