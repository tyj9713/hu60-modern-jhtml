import { el } from "../ui/dom.js";

export function renderFallback({ route, error, ordinaryUrl }) {
  return el("section", { class: "hm-panel hm-fallback" }, [
    el("span", { class: "hm-kicker" }, "CLASSIC FALLBACK"),
    el("h1", {}, "当前页面暂未完成现代适配"),
    el(
      "p",
      {},
      error?.message ||
        `${route.cid}.${route.pid} 暂时需要使用普通版页面。`
    ),
    el("div", { class: "hm-fallback-actions" }, [
      el(
        "a",
        { class: "hm-button is-primary", href: ordinaryUrl },
        "打开普通版"
      ),
      el(
        "a",
        { class: "hm-button is-ghost", href: "index.index.jhtml" },
        "返回首页"
      )
    ])
  ]);
}
