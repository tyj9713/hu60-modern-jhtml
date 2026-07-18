import DOMPurify from "dompurify";
import { ensureMarkdownMarker } from "./markdown.js";

export async function renderServerPreview({
  client,
  url,
  form,
  content,
  mode,
  signal
}) {
  const fields = new FormData(form);
  fields.set("preview", "1");
  fields.set(
    "content",
    mode === "markdown" ? ensureMarkdownMarker(content) : content
  );
  const response = await client.request(url || form.action, {
    method: "POST",
    body: fields,
    signal
  });
  if (!response.ok) throw new Error(`预览失败：${response.status}`);
  const type = response.headers.get("content-type") || "";
  let html;
  if (type.includes("json")) {
    const payload = await response.json();
    html = payload.preview || payload.content || payload.html || "";
  } else {
    const doc = new DOMParser().parseFromString(
      await response.text(),
      "text/html"
    );
    html =
      doc.querySelector(
        ".preview,.content-preview,#preview,.user-content"
      )?.innerHTML || doc.body.innerHTML;
  }
  return DOMPurify.sanitize(html, {
    FORBID_TAGS: ["script", "object", "embed"],
    FORBID_ATTR: ["style"]
  });
}
