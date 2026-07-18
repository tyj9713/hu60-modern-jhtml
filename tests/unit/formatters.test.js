import { expect, it } from "vitest";
import {
  formatCode,
  normalizeLanguage
} from "../../src/formatters/registry.js";

it.each([
  ["js", "javascript"],
  ["jsx", "javascript"],
  ["ts", "typescript"],
  ["py", "python"],
  ["bash", "shell"],
  ["sh", "shell"],
  ["mysql", "sql"],
  ["php", "php"]
])("maps %s to %s", (input, expected) => {
  expect(normalizeLanguage(input)).toBe(expected);
});

it("formats JavaScript, JSON, PHP, SQL and Shell through lazy loaders", async () => {
  await expect(formatCode("js", "const x={a:1}")).resolves.toContain(
    "const x = { a: 1 };"
  );
  await expect(formatCode("json", '{"a":1}')).resolves.toContain(
    '"a": 1'
  );
  await expect(formatCode("php", "<?php $x=[1,2];")).resolves.toContain(
    "$x = [1, 2];"
  );
  await expect(formatCode("sql", "select * from users where id=1")).resolves.toContain(
    "SELECT"
  );
  await expect(formatCode("sh", "if true;then echo hi;fi")).resolves.toContain(
    "then"
  );
}, 30000);

it("formats TypeScript, HTML, CSS, Markdown and Python", async () => {
  await expect(
    formatCode("ts", "const value:{name:string}={name:'hu60'}")
  ).resolves.toContain("name: string");
  await expect(
    formatCode("html", "<main><h1>hu60</h1></main>")
  ).resolves.toContain("<h1>hu60</h1>");
  await expect(formatCode("css", ".a{color:red}")).resolves.toContain(
    "color: red"
  );
  await expect(formatCode("md", "# 标题\n\n-  项目")).resolves.toContain(
    "- 项目"
  );
  await expect(formatCode("py", "value={\"a\":1}\nprint( value )")).resolves.toContain(
    'value = {"a": 1}'
  );
}, 30000);

it("rejects unsupported languages with a readable error", async () => {
  await expect(formatCode("brainfuck", "+++")).rejects.toThrow(
    "暂不支持格式化"
  );
});
