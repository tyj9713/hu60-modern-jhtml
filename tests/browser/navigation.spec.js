import { expect, test } from "@playwright/test";

test("admin links remain on ordinary html", async ({ page }) => {
  await page.goto("/tests/browser/fixtures.html?page=home");
  await expect(page.locator("#admin-link")).toHaveAttribute(
    "href",
    "admin.index.html"
  );
});

test("pagination remains explicit instead of infinite scrolling", async ({
  page
}) => {
  await page.goto("/tests/browser/fixtures.html?page=forum");
  await expect(page.getByRole("navigation", { name: "分页" })).toContainText(
    "第 1 / 3 页"
  );
  await expect(page.getByRole("link", { name: "下一页" })).toBeVisible();
  await expect(page.getByRole("link", { name: "下一页" })).toHaveAttribute(
    "href",
    /[?&]p=2/
  );
});

test("code blocks copy through the modern toolbar", async ({ page }) => {
  await page.goto("/tests/browser/fixtures.html?page=topic");
  await page.getByRole("button", { name: "复制" }).click();
  await expect
    .poll(() => page.evaluate(() => window.__fixtureCopiedText))
    .toContain("const stable = true");
});

test("back navigation restores the recorded scroll position", async ({
  page
}) => {
  await page.goto("/tests/browser/fixtures.html?page=interactions");
  await page.evaluate(() => window.scrollTo(0, 700));
  await page.evaluate(() => document.querySelector("#fixture-next").click());
  await expect(page.locator("body")).toHaveAttribute("data-fixture-step", "2");
  await page.goBack();
  await expect(page.locator("body")).toHaveAttribute("data-fixture-step", "1");
  await expect
    .poll(() => page.evaluate(() => Math.round(window.scrollY)))
    .toBeGreaterThan(650);
});
