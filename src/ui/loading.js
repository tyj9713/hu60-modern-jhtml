import { el } from "./dom.js";

export function renderLoading(label = "正在加载") {
  return el(
    "div",
    {
      class: "hm-loading",
      role: "status",
      "aria-live": "polite"
    },
    [
      el("span", { class: "hm-loading-mark", "aria-hidden": "true" }),
      el("span", {}, label)
    ]
  );
}
