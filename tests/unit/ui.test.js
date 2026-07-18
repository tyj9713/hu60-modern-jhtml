import { afterEach, describe, expect, it, vi } from "vitest";
import { isEligibleNavigation } from "../../src/core/navigation.js";
import { createPageState } from "../../src/core/state.js";
import { renderAvatar } from "../../src/ui/avatar.js";
import { confirmDialog } from "../../src/ui/dialog.js";
import { el } from "../../src/ui/dom.js";
import { toast } from "../../src/ui/feedback.js";
import { renderLoading } from "../../src/ui/loading.js";
import { renderPagination } from "../../src/ui/pagination.js";
import { createShell } from "../../src/ui/shell.js";

afterEach(() => {
  vi.useRealTimers();
  document.body.replaceChildren();
  document.head
    .querySelectorAll("[data-hu60-test]")
    .forEach((node) => node.remove());
  document.title = "";
});

describe("DOM helpers", () => {
  it("creates attributes, listeners and nested children", () => {
    const onClick = vi.fn();
    const node = el(
      "button",
      { class: "action", type: "button", onclick: onClick },
      ["发布", el("span", {}, "主题")]
    );

    node.click();
    expect(node.className).toBe("action");
    expect(node.type).toBe("button");
    expect(node.textContent).toBe("发布主题");
    expect(onClick).toHaveBeenCalledOnce();
  });
});

describe("shared UI", () => {
  it("renders explicit accessible pagination", () => {
    const node = renderPagination({
      current: 2,
      max: 5,
      previousUrl: "?p=1",
      nextUrl: "?p=3"
    });

    expect(node.getAttribute("aria-label")).toBe("分页");
    expect(node.textContent).toContain("第 2 / 5 页");
    expect(node.querySelector('a[href="?p=3"]')).not.toBeNull();
    expect(node.querySelectorAll("a")).toHaveLength(2);
  });

  it("uses initials when avatar URL is absent", () => {
    const node = renderAvatar({ name: "旧人", avatar: "" }, 40);

    expect(node.textContent).toBe("旧");
    expect(node.style.getPropertyValue("--hm-avatar-size")).toBe("40px");
    expect(node.getAttribute("aria-label")).toBe("旧人的头像");
  });

  it("renders lazy avatar images and removes broken ones", () => {
    const node = renderAvatar(
      { name: "小虎", avatar: "/upload/avatar.png" },
      48
    );
    const image = node.querySelector("img");

    expect(image.getAttribute("loading")).toBe("lazy");
    image.dispatchEvent(new Event("error"));
    expect(node.querySelector("img")).toBeNull();
    expect(node.textContent).toBe("小");
  });

  it("renders non-blocking feedback and dismisses it", () => {
    const item = toast({
      kind: "success",
      title: "保存成功",
      message: "内容已经更新"
    });

    expect(item.textContent).toContain("保存成功");
    expect(document.querySelector(".hm-toast-region")).not.toBeNull();
    item.querySelector('button[aria-label="关闭"]').click();
    expect(document.body.contains(item)).toBe(false);
  });

  it("confirms from a focus-safe dialog", async () => {
    const trigger = el("button", { type: "button" }, "删除");
    document.body.append(trigger);
    trigger.focus();

    const result = confirmDialog({
      title: "删除回复",
      message: "此操作无法撤销",
      danger: true
    });
    const dialog = document.querySelector('[role="dialog"]');
    expect(dialog.getAttribute("aria-modal")).toBe("true");
    dialog.querySelector(".is-danger").click();

    await expect(result).resolves.toBe(true);
    expect(document.activeElement).toBe(trigger);
  });

  it("shows an accessible loading state", () => {
    const node = renderLoading("正在加载帖子");

    expect(node.getAttribute("role")).toBe("status");
    expect(node.textContent).toContain("正在加载帖子");
  });
});

describe("application shell and state", () => {
  it("preserves a body-hosted stylesheet when replacing JHTML content", () => {
    const stylesheet = document.createElement("link");
    stylesheet.rel = "stylesheet";
    stylesheet.href = "https://cdn.example.test/theme.min.css";
    stylesheet.dataset.hu60Test = "stylesheet";
    document.body.append(stylesheet);

    createShell({
      route: { cid: "index", pid: "index" },
      user: null
    });

    expect(stylesheet.isConnected).toBe(true);
    expect(stylesheet.parentElement).toBe(document.head);
  });

  it("creates the editorial shell and updates content regions", () => {
    const shell = createShell({
      route: { cid: "bbs", pid: "topic" },
      user: { name: "工程虎", avatar: "" }
    });
    const content = el("article", {}, "帖子内容");
    const sidebar = el("aside", {}, "个人信息");

    shell.setTitle("技术交流");
    shell.setMain(content);
    shell.setSidebar(sidebar);

    expect(document.title).toContain("技术交流");
    expect(shell.root.classList.contains("hm-app")).toBe(true);
    expect(shell.main.textContent).toBe("帖子内容");
    expect(shell.sidebar.textContent).toBe("个人信息");
    expect(shell.root.textContent).toContain("工程虎");
    expect(shell.bottomNav.querySelectorAll("a")).toHaveLength(5);
  });

  it("hydrates the account after the logged-in user becomes available", () => {
    const shell = createShell({
      route: { cid: "index", pid: "index" },
      user: null
    });

    expect(shell.header.textContent).toContain("游客");
    shell.setUser({
      uid: 3,
      name: "旧人",
      avatar: "https://file.hu60.cn/avatar/3.jpg"
    });

    expect(shell.header.textContent).toContain("旧人");
    expect(shell.header.textContent).toContain("个人中心");
    expect(shell.header.textContent).not.toContain("游客");
    expect(shell.header.querySelector(".hm-account img")?.src).toContain(
      "/avatar/3.jpg"
    );
  });

  it("notifies subscribers only when page state changes", () => {
    const state = createPageState({ page: 1 });
    const listener = vi.fn();
    const unsubscribe = state.subscribe(listener);

    state.set({ page: 2 });
    unsubscribe();
    state.set({ page: 3 });

    expect(listener).toHaveBeenCalledOnce();
    expect(listener).toHaveBeenCalledWith({ page: 2 }, { page: 1 });
    expect(state.get()).toEqual({ page: 3 });
  });

  it("only intercepts plain same-origin left clicks", () => {
    const anchor = document.createElement("a");
    anchor.href = `${location.origin}/q.php/bbs.topic.1.jhtml`;

    expect(
      isEligibleNavigation(new MouseEvent("click", { button: 0 }), anchor)
    ).toBe(true);
    expect(
      isEligibleNavigation(
        new MouseEvent("click", { button: 0, ctrlKey: true }),
        anchor
      )
    ).toBe(false);

    anchor.href = "https://example.com/";
    expect(
      isEligibleNavigation(new MouseEvent("click", { button: 0 }), anchor)
    ).toBe(false);

    anchor.href = `${location.origin}/q.php/admin.user.jhtml`;
    expect(
      isEligibleNavigation(new MouseEvent("click", { button: 0 }), anchor)
    ).toBe(false);
  });
});
