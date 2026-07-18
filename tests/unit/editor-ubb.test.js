import { expect, it, vi } from "vitest";
import { insertUbb, wrapSelection } from "../../src/editor/ubb.js";

it("wraps the current selection and emits an input event", () => {
  const textarea = document.createElement("textarea");
  textarea.value = "前文正文后文";
  textarea.setSelectionRange(2, 4);
  const input = vi.fn();
  textarea.addEventListener("input", input);

  wrapSelection(textarea, "**");

  expect(textarea.value).toBe("前文**正文**后文");
  expect(textarea.selectionStart).toBe(2);
  expect(textarea.selectionEnd).toBe(8);
  expect(input).toHaveBeenCalledOnce();
});

it("inserts matching UBB tags around a selection", () => {
  const textarea = document.createElement("textarea");
  textarea.value = "内容";
  textarea.setSelectionRange(0, 2);

  insertUbb(textarea, "quote");

  expect(textarea.value).toBe("[quote]内容[/quote]");
});
