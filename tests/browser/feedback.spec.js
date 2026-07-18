import { expect, test } from "@playwright/test";

test("Toast feedback is non-blocking and dismissible", async ({ page }) => {
  await page.goto("/tests/browser/fixtures.html?page=interactions");
  await page.getByRole("button", { name: "显示提示" }).click();
  const toast = page.getByRole("status").filter({ hasText: "操作成功" });
  await expect(toast).toBeVisible();
  await toast.getByRole("button", { name: "关闭" }).click();
  await expect(toast).toHaveCount(0);
});

test("dialog traps Tab, closes with Escape and restores focus", async ({
  page
}) => {
  await page.goto("/tests/browser/fixtures.html?page=interactions");
  const trigger = page.getByRole("button", { name: "打开对话框" });
  await trigger.focus();
  await trigger.click();
  const dialog = page.getByRole("dialog", { name: "确认操作" });
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole("button", { name: "取消" })).toBeFocused();
  await page.keyboard.press("Shift+Tab");
  await expect(dialog.getByRole("button", { name: "确认" })).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(dialog).toHaveCount(0);
  await expect(trigger).toBeFocused();
});
