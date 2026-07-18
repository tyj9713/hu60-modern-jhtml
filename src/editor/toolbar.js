import { el } from "../ui/dom.js";
import { wrapSelection, insertUbb } from "./ubb.js";

const markdownActions = [
  ["标题", "## ", ""],
  ["加粗", "**", "**"],
  ["引用", "> ", ""],
  ["列表", "- ", ""],
  ["代码", "```\n", "\n```"],
  ["链接", "[", "](https://)"]
];

export function createEditorToolbar({
  textarea,
  getMode,
  onFormatLayout,
  onFormatCode,
  onChooseImage,
  onPreview
}) {
  const actions = el("div", { class: "hm-editor-actions" });
  const refresh = () => {
    actions.replaceChildren(
      ...(getMode() === "markdown"
        ? markdownActions.map(([label, open, close]) =>
            el(
              "button",
              {
                type: "button",
                onclick: () => wrapSelection(textarea, open, close)
              },
              label
            )
          )
        : ["b", "i", "u", "quote", "code", "url"].map((tag) =>
            el(
              "button",
              { type: "button", onclick: () => insertUbb(textarea, tag) },
              tag.toUpperCase()
            )
          ))
    );
  };
  refresh();
  return {
    node: el("div", { class: "hm-editor-toolbar" }, [
      actions,
      el("div", { class: "hm-editor-tools" }, [
        el("button", { type: "button", onclick: onFormatLayout }, "辅助排版"),
        onFormatCode
          ? el(
              "button",
              { type: "button", onclick: onFormatCode },
              "格式化代码"
            )
          : null,
        onChooseImage
          ? el(
              "button",
              { type: "button", onclick: onChooseImage },
              "添加图片"
            )
          : null,
        el("button", { type: "button", onclick: onPreview }, "服务器预览")
      ])
    ]),
    refresh
  };
}
