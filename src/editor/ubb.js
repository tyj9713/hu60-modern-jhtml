export function wrapSelection(textarea, open, close = open) {
  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  const selected = textarea.value.slice(start, end);
  textarea.setRangeText(`${open}${selected}${close}`, start, end, "select");
  textarea.dispatchEvent(new Event("input", { bubbles: true }));
}

export function insertUbb(textarea, tag) {
  wrapSelection(textarea, `[${tag}]`, `[/${tag}]`);
}
