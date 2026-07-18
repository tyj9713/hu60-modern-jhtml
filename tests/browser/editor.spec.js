import { expect, test } from "@playwright/test";

test("editor switches Markdown and UBB without losing text", async ({
  page
}) => {
  await page.goto("/tests/browser/fixtures.html?page=editor");
  const textarea = page.locator("textarea[name=content]");
  await textarea.fill("# 标题\n\n正文");
  await page.getByRole("button", { name: "UBB", exact: true }).click();
  await expect(textarea).toHaveValue("# 标题\n\n正文");
  await page.getByRole("button", { name: "Markdown", exact: true }).click();
  await expect(textarea).toHaveValue("# 标题\n\n正文");
});

test("local layout helper tidies text without uploading it", async ({
  page
}) => {
  await page.goto("/tests/browser/fixtures.html?page=editor");
  const textarea = page.locator("textarea[name=content]");
  await textarea.fill("这是被误断的\n一行文字。  ");
  await page.getByRole("button", { name: "辅助排版" }).click();
  await expect(textarea).toHaveValue("这是被误断的一行文字。");
});

test("drafts can be restored and explicitly discarded", async ({ page }) => {
  await page.goto("/tests/browser/fixtures.html?page=editor");
  const textarea = page.locator("textarea[name=content]");
  await textarea.fill("只保存在本机的草稿");
  await page.waitForTimeout(650);
  await page.reload();
  await expect(page.getByRole("button", { name: "恢复草稿" })).toBeVisible();
  await page.getByRole("button", { name: "恢复草稿" }).click();
  await expect(textarea).toHaveValue("只保存在本机的草稿");

  await textarea.fill("准备丢弃的草稿");
  await page.waitForTimeout(650);
  await page.reload();
  await page.getByRole("button", { name: "丢弃草稿" }).click();
  await page.reload();
  await expect(
    page.getByRole("button", { name: "恢复草稿" })
  ).toHaveCount(0);
});

test("pasted images upload and insert Markdown locally", async ({ page }) => {
  await page.goto("/tests/browser/fixtures.html?page=editor");
  const textarea = page.locator("textarea[name=content]");
  await textarea.fill("正文");
  await textarea.evaluate((node) => {
    node.setSelectionRange(node.value.length, node.value.length);
    const transfer = new DataTransfer();
    transfer.items.add(
      new File(["image"], "paste.png", { type: "image/png" })
    );
    node.dispatchEvent(
      new ClipboardEvent("paste", {
        bubbles: true,
        cancelable: true,
        clipboardData: transfer
      })
    );
  });

  await expect(textarea).toHaveValue(
    /!\[paste\.png\]\(https:\/\/img\.example\/paste\.png\)/
  );
  await expect(page.locator(".hm-upload-status")).toContainText("已插入");
});

test("formatter loads on demand and keeps invalid source unchanged", async ({
  page
}) => {
  await page.goto("/tests/browser/fixtures.html?page=editor");
  const textarea = page.locator("textarea[name=content]");
  await textarea.fill("```js\nconst x={a:1}\n```");
  await textarea.evaluate((node) => {
    const cursor = node.value.indexOf("const");
    node.setSelectionRange(cursor, cursor);
  });
  await page.getByRole("button", { name: "格式化代码" }).click();
  await expect(textarea).toHaveValue(/const x = \{ a: 1 \};/);
  await expect
    .poll(() => page.evaluate(() => window.__fixtureFormatLoads))
    .toBe(1);

  const invalid = "```js\nconst x = ;\n```";
  await textarea.fill(invalid);
  await textarea.evaluate((node) => {
    const cursor = node.value.indexOf("const");
    node.setSelectionRange(cursor, cursor);
  });
  await page.getByRole("button", { name: "格式化代码" }).click();
  await expect(page.getByText("代码格式化失败，原文未修改")).toBeVisible();
  await expect(textarea).toHaveValue(invalid);
});

test("failed form submission keeps the original editor content", async ({
  page
}) => {
  await page.goto("/tests/browser/fixtures.html?page=editor");
  const textarea = page.locator("textarea[name=content]");
  await textarea.fill("网络失败时不能丢失");
  await page.getByRole("button", { name: "发布" }).click();

  await expect(page.getByText("发送失败，内容已保留")).toBeVisible();
  await expect(textarea).toHaveValue("网络失败时不能丢失");
});
