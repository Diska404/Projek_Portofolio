import { test, expect } from "@playwright/test";
import { mkdir } from "node:fs/promises";
const creator = "http://127.0.0.1:3101";
for (const width of [390, 768, 1440, 1920]) {
  test(`creator and invitation fit ${width}px without identity disclosure`, async ({ page }) => {
    await page.setViewportSize({ width, height: 1000 });
    for (const route of ["/", "/access"]) {
      const response = await page.goto(creator + route);
      expect(response?.status()).toBe(200);
      await expect(page.locator("h1")).toBeVisible();
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth),
      ).toBe(true);
      expect(await page.content()).not.toMatch(
        /Proyek perkuliahan|college-work|Diska404|127\.0\.0\.1:3100|Profil pribadi/,
      );
      await mkdir("docs/evidence", { recursive: true });
      await page.screenshot({
        path: `docs/evidence/creator${route === "/access" ? "-access" : ""}-${width}.png`,
        fullPage: true,
      });
    }
  });
}
test("personal avatar shortcut opens creator with referrer suppression", async ({ page }) => {
  await page.goto("/");
  const shortcut = page.getByRole("link", { name: "Buka portofolio YouTube Raizei" });
  await expect(shortcut).toHaveAttribute("referrerpolicy", "no-referrer");
  await shortcut.click();
  await expect(page).toHaveURL(creator + "/");
  await expect(
    page.locator("#work").getByRole("heading", { name: "GFL2 Bahasa Indonesia", exact: true }),
  ).toBeVisible();
  await expect(page.getByRole("button", { name: "Kampus", exact: true })).toHaveCount(0);
  await page.getByRole("link", { name: /Ruang undangan/ }).click();
  await expect(page).toHaveURL(creator + "/access");
  await expect(page.getByLabel("Kode akses", { exact: true })).toHaveAttribute("type", "password");
});
test("creator cannot select personal data or owner routes via URLs", async ({ request }) => {
  const response = await request.get(creator + "/?audience=personal&owner_id=anything");
  expect(await response.text()).not.toMatch(
    /Proyek perkuliahan|college-work|Profil pribadi|127\.0\.0\.1:3100/,
  );
  expect((await request.get(creator + "/preview/overview")).status()).toBe(404);
  expect((await request.get(creator + "/api/owner/projects")).status()).toBe(401);
  expect((await request.get(creator + "/api/bridge")).status()).toBe(405);
  const rejected = await request.post(creator + "/api/bridge", {
    headers: { Origin: "https://evil.example" },
    data: { passphrase: "wrong" },
  });
  expect(rejected.status()).toBe(403);
  expect(await rejected.text()).not.toContain("3100");
});
