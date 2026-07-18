import { expect, it } from "vitest";
import { formatLayout } from "../../src/editor/layout.js";

it("normalizes whitespace and merges obvious Chinese hard wraps", () => {
  const result = formatLayout(
    "# 标题  \r\n\r\n\r\n这是被误断的\r\n一行文字。\r\n\r\n- 项目一  "
  );

  expect(result.output).toBe(
    "# 标题\n\n这是被误断的一行文字。\n\n- 项目一"
  );
  expect(result.changes.length).toBeGreaterThan(0);
});

it("protects fenced code, inline code, links and quote blocks", () => {
  const source =
    "正文 `a  b`\n\n> 引用\n> 第二行\n\n```js\nconst  x = 1;  \n```\n\n[链接](https://a.example/x  y)";
  const result = formatLayout(source);

  expect(result.output).toContain("const  x = 1;  ");
  expect(result.output).toContain("`a  b`");
  expect(result.output).toContain("https://a.example/x  y");
  expect(result.output).toContain("> 引用\n> 第二行");
});
