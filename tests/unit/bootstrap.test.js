import { afterEach, expect, it, vi } from "vitest";
import { bootstrap } from "../../src/core/bootstrap.js";

afterEach(() => document.body.replaceChildren());

it("renders a registered home route with the modern shell", async () => {
  const client = {
    json: vi.fn(async () => ({
      newTopicList: [{ topic_id: 8, title: "启动成功", uinfo: { name: "旧人" } }]
    })),
    html: vi.fn(async () => '<div id="friend_links"></div>')
  };

  await bootstrap({
    url: "https://hu60.cn/q.php/index.index.jhtml",
    client,
    navigation: false
  });

  expect(document.querySelector(".hm-app")).not.toBeNull();
  expect(document.body.textContent).toContain("启动成功");
});

it("renders an ordinary-page fallback for unknown routes", async () => {
  await bootstrap({
    url: "https://hu60.cn/q.php/addin.unknown.7.jhtml",
    client: {},
    navigation: false
  });

  expect(document.body.textContent).toContain("当前页面暂未完成现代适配");
  expect(
    document.querySelector('a[href="addin.unknown.7.html"]')
  ).not.toBeNull();
});
