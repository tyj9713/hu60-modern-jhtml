import { expect, test } from "@playwright/test";

test("shell exposes landmarks and keyboard skip navigation", async ({
  page
}, testInfo) => {
  await page.goto("/tests/browser/fixtures.html?page=home");
  await expect(page.getByRole("banner")).toBeVisible();
  await expect(page.getByRole("main")).toBeVisible();
  await expect(
    page.getByRole("navigation", {
      name: testInfo.project.name === "mobile" ? "移动端导航" : "主导航"
    })
  ).toBeVisible();
  await page.keyboard.press("Tab");
  await expect(page.getByRole("link", { name: "跳到正文" })).toBeFocused();
});

test("mobile navigation uses five touch-sized targets", async ({
  page
}, testInfo) => {
  test.skip(testInfo.project.name !== "mobile", "仅适用于移动端导航");
  await page.goto("/tests/browser/fixtures.html?page=home");
  const links = page.locator(".hm-bottom-nav a");
  await expect(links).toHaveCount(5);
  const sizes = await links.evaluateAll((nodes) =>
    nodes.map((node) => {
      const box = node.getBoundingClientRect();
      return [box.width, box.height];
    })
  );
  for (const [width, height] of sizes) {
    expect(width).toBeGreaterThanOrEqual(44);
    expect(height).toBeGreaterThanOrEqual(44);
  }
});
