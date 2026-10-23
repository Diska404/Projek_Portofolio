import { test, expect } from "@playwright/test";
import { mkdir } from "node:fs/promises";

test("personal Leva card opens a working architecture explorer with explicit evidence limits", async ({
  page,
  request,
}) => {
  await page.goto("/#work");
  await page
    .locator('[data-project="leva-assistant"]')
    .getByRole("link", { name: /Jelajahi proyek/ })
    .click();
  await expect(page).toHaveURL(/\/projects\/leva$/);
  await expect(page.locator("h1")).toHaveText("LEVA.");
  const picker = page.getByRole("group", { name: "Pilih modul Leva" });
  await picker.getByRole("button", { name: "Agent + alat host", exact: true }).click();
  await expect(page.locator(".leva-module-detail")).toContainText("menerima hasil pelaksanaan");
  await picker.getByRole("button", { name: "Web / HP", exact: true }).focus();
  await page.keyboard.press("Enter");
  await expect(page.locator(".leva-module-detail h3")).toHaveText("Web / HP");
  await expect(page.locator(".leva-evidence")).toContainText("0.3.0");
  const graph = await request.get("/leva/graph.json");
  expect(graph.status()).toBe(200);
  expect((await graph.json()).nodes.length).toBe(2356);
  const html = await request.get("/leva/graph.html");
  expect(html.status()).toBe(200);
  expect(await html.text()).toContain("LevaWindow");
  expect((await request.get("http://127.0.0.1:3101/projects/leva")).status()).toBe(404);
  expect((await request.get("http://127.0.0.1:3101/leva/graph.json")).status()).toBe(404);
});

for (const width of [390, 1440]) {
  test(`Leva architecture is readable without horizontal overflow at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 1000 });
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.goto("/projects/leva");
    await expect(
      page.getByRole("heading", { name: "Bagaimana semuanya terhubung." }),
    ).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
      true,
    );
    expect(errors).toEqual([]);
    await mkdir("docs/evidence", { recursive: true });
    await page.screenshot({ path: `docs/evidence/leva-${width}.png`, fullPage: true });
  });
}
