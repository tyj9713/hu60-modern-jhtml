import { expect, test } from "@playwright/test";

for (const fixture of [
  "home",
  "forum",
  "topic",
  "user",
  "messages",
  "chat",
  "editor",
  "tools"
]) {
  test(`${fixture} has no unintended horizontal overflow`, async ({
    page
  }) => {
    await page.goto(`/tests/browser/fixtures.html?page=${fixture}`);
    await expect(page.locator("body")).toHaveAttribute(
      "data-fixture-ready",
      "true"
    );
    const overflow = await page.evaluate(
      () =>
        document.documentElement.scrollWidth -
        document.documentElement.clientWidth
    );
    expect(overflow).toBeLessThanOrEqual(1);
  });
}

test("face images stay within 24px", async ({ page }) => {
  await page.goto("/tests/browser/fixtures.html?page=topic");
  const box = await page.locator('img[src*="/img/face/"]').boundingBox();
  expect(box.width).toBeLessThanOrEqual(24);
  expect(box.height).toBeLessThanOrEqual(24);
});
