import { el } from "./dom.js";

function pageControl(url, label, direction) {
  const className = `hm-page-link is-${direction} hm-touch-target`;
  return url
    ? el("a", { class: className, href: url }, label)
    : el(
        "span",
        { class: className, "aria-disabled": "true" },
        label
      );
}

export function renderPagination(model) {
  return el("nav", { class: "hm-pagination", "aria-label": "分页" }, [
    pageControl(model.previousUrl, "← 上一页", "previous"),
    el(
      "span",
      { class: "hm-page-info", "aria-current": "page" },
      `第 ${model.current} / ${model.max || "?"} 页`
    ),
    pageControl(model.nextUrl, "下一页 →", "next")
  ]);
}
