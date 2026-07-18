import { afterEach, expect, it, vi } from "vitest";
import { mount } from "../../src/pages/forms.js";

afterEach(() => document.body.replaceChildren());

function createShellStub() {
  return {
    setTitle: vi.fn(),
    setMain: vi.fn((node) => document.body.append(node)),
    setSidebar: vi.fn()
  };
}

it("renders the original HTML form instead of a compatibility notice", async () => {
  const shell = createShellStub();
  const client = {
    html: vi.fn(async () => `
      <html><head><title>登录</title></head><body>
        <form action="user.login.html" method="post">
          <label>用户名<input name="name" required></label>
          <label>密码<input name="password" type="password" required></label>
          <button name="go" value="1">登录</button>
        </form>
      </body></html>
    `)
  };

  await mount({
    route: { cid: "user", pid: "login", ext: [] },
    client,
    shell,
    services: {}
  });

  expect(document.querySelector('form[action="user.login.html"]')).not.toBeNull();
  expect(document.querySelector('[name="password"]').type).toBe("password");
  expect(document.body.textContent).not.toContain("正在使用兼容表单适配器");
  expect(shell.setTitle).toHaveBeenCalledWith("登录");
});

it("mounts the modern editor on content textareas", async () => {
  const shell = createShellStub();
  const mountEditor = vi.fn();
  const client = {
    html: vi.fn(async () => `
      <h1>发布主题</h1>
      <form action="bbs.newtopic.170.html" method="post">
        <input name="title">
        <textarea name="content">正文</textarea>
        <button name="go" value="1">发布</button>
      </form>
    `)
  };

  await mount({
    route: { cid: "bbs", pid: "newtopic", ext: ["170"] },
    client,
    shell,
    services: { mountEditor }
  });

  expect(mountEditor).toHaveBeenCalledOnce();
  expect(mountEditor.mock.calls[0][0]).toMatchObject({
    routeKey: "bbs.newtopic",
    targetId: "170"
  });
  expect(mountEditor.mock.calls[0][0].textarea.name).toBe("content");
  expect(mountEditor.mock.calls[0][0].titleInput.name).toBe("title");
});
