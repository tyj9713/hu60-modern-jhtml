import { expect, it } from "vitest";
import {
  findFencedCodeAt,
  replaceFencedCode
} from "../../src/editor/fenced-code.js";

it("formats only the fenced block containing the cursor", () => {
  const source = "前文\n```python\nprint( 1 )\n```\n后文";
  const range = findFencedCodeAt(source, source.indexOf("print"));
  expect(range.language).toBe("python");
  expect(replaceFencedCode(source, range, "print(1)\n")).toBe(
    "前文\n```python\nprint(1)\n```\n后文"
  );
});

it("returns null outside a fence and supports tilde fences", () => {
  const source = "前文\n~~~sql\nselect * from users\n~~~\n后文";
  expect(findFencedCodeAt(source, 1)).toBeNull();
  expect(findFencedCodeAt(source, source.indexOf("select"))).toMatchObject({
    language: "sql",
    marker: "~~~"
  });
});
