import { afterEach, expect, it, vi } from "vitest";
import { mountEditor } from "../../src/editor/controller.js";
import {
  ensureMarkdownMarker,
  stripMarkdownMarker,
  transformMarkdownCompatibility
} from "../../src/editor/markdown.js";

afterEach(() => document.body.replaceChildren());

it("adds exactly one markdown marker", () => {
  expect(ensureMarkdownMarker("# 标题")).toBe(
    "<!-- markdown -->\n# 标题"
  );
  expect(ensureMarkdownMarker("<!-- markdown -->\n# 标题")).toBe(
    "<!-- markdown -->\n# 标题"
  );
  expect(stripMarkdownMarker("<!md>\n正文")).toBe("正文");
});

it("transforms task items but protects fenced code", () => {
  const result = transformMarkdownCompatibility(
    "- [x] 完成\n```\n- [x] code\n```"
  );
  expect(result.output).toContain("- ☑ 完成");
  expect(result.output).toContain("- [x] code");
});

it("switches between markdown and UBB without losing the body", () => {
  document.body.innerHTML =
    '<form><textarea name="content">正文</textarea><button type="submit">发布</button></form>';
  const textarea = document.querySelector("textarea");
  const controller = mountEditor({
    form: document.querySelector("form"),
    textarea,
    mode: "markdown",
    uid: 3,
    routeKey: "bbs.newtopic",
    targetId: "170",
    services: {}
  });

  controller.setMode("ubb");
  expect(controller.getMode()).toBe("ubb");
  expect(controller.getValue()).toBe("正文");
  controller.setMode("markdown");
  expect(controller.getValue()).toBe("正文");
  controller.destroy();
});

it("offers draft restore and discard actions inside the editor", () => {
  const values = new Map([
    [
      "hu60-modern:draft:3:bbs.newtopic:170",
      JSON.stringify({
        mode: "markdown",
        body: "草稿正文",
        title: "草稿标题",
        savedAt: Date.now()
      })
    ]
  ]);
  const storage = {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, value),
    removeItem: (key) => values.delete(key)
  };
  document.body.innerHTML =
    '<form><input name="title"><textarea name="content">当前正文</textarea></form>';
  const textarea = document.querySelector("textarea");
  const controller = mountEditor({
    form: document.querySelector("form"),
    textarea,
    titleInput: document.querySelector('[name="title"]'),
    uid: 3,
    routeKey: "bbs.newtopic",
    targetId: "170",
    services: { storage }
  });

  const restore = [...document.querySelectorAll("button")].find(
    (button) => button.textContent === "恢复草稿"
  );
  expect(restore).toBeTruthy();
  restore.click();
  expect(textarea.value).toBe("草稿正文");
  expect(document.querySelector('[name="title"]').value).toBe("草稿标题");
  controller.destroy();
});

it("uploads pasted images and inserts the active mode syntax", async () => {
  document.body.innerHTML =
    '<form><textarea name="content">正文</textarea></form>';
  const textarea = document.querySelector("textarea");
  textarea.setSelectionRange(2, 2);
  const controller = mountEditor({
    form: document.querySelector("form"),
    textarea,
    routeKey: "bbs.newtopic",
    targetId: "170",
    services: {
      upload: vi.fn(async () => ({
        url: "https://img.example/a.png",
        name: "a.png",
        content: "[img]https://img.example/a.png[/img]"
      }))
    }
  });
  const event = new Event("paste", { bubbles: true, cancelable: true });
  Object.defineProperty(event, "clipboardData", {
    value: {
      files: [new File(["a"], "a.png", { type: "image/png" })]
    }
  });

  textarea.dispatchEvent(event);
  await vi.waitFor(() =>
    expect(textarea.value).toContain("![a.png](https://img.example/a.png)")
  );
  expect(event.defaultPrevented).toBe(true);
  controller.destroy();
});

it("formats only the fenced block at the cursor and preserves failures", async () => {
  document.body.innerHTML =
    '<form><textarea name="content"></textarea></form>';
  const textarea = document.querySelector("textarea");
  textarea.value = "前文\n```js\nconst x={a:1}\n```\n后文";
  textarea.setSelectionRange(
    textarea.value.indexOf("const"),
    textarea.value.indexOf("const")
  );
  const formatCode = vi.fn(async () => "const x = { a: 1 };\n");
  const toast = vi.fn();
  const controller = mountEditor({
    form: document.querySelector("form"),
    textarea,
    services: { formatCode, toast }
  });

  [...document.querySelectorAll("button")]
    .find((button) => button.textContent === "格式化代码")
    .click();
  await vi.waitFor(() =>
    expect(textarea.value).toContain("const x = { a: 1 };")
  );
  expect(formatCode).toHaveBeenCalledWith("js", "const x={a:1}\n");

  const successful = textarea.value;
  formatCode.mockRejectedValueOnce(new Error("语法错误"));
  [...document.querySelectorAll("button")]
    .find((button) => button.textContent === "格式化代码")
    .click();
  await vi.waitFor(() =>
    expect(toast).toHaveBeenCalledWith(
      expect.objectContaining({ kind: "error", message: "语法错误" })
    )
  );
  expect(textarea.value).toBe(successful);
  controller.destroy();
});
