import { normalizePagination, number } from "../adapters/json.js";
import { toBidUrl } from "../core/urls.js";
import { el } from "../ui/dom.js";
import { renderPagination } from "../ui/pagination.js";

export function normalizeSearch(payload = {}) {
  const type = payload.searchType === "reply" ? "reply" : "topic";
  const source =
    type === "reply"
      ? payload.replyList || payload.resultList || []
      : payload.topicList || payload.resultList || [];
  return {
    type,
    keyword: String(payload.keyword || payload.key || ""),
    uid: number(payload.uid),
    error: String(payload.error || payload.errMsg || ""),
    results: source.map((item) => ({
      id: number(item.topic_id ?? item.id),
      floor: number(item.floor),
      title: String(item.title || item.topic_title || ""),
      contentHtml: String(item.content || item.contentHtml || ""),
      author: item.uinfo || {}
    })),
    pagination: normalizePagination(payload, "bbs.search.jhtml")
  };
}

export function renderSearch(model) {
  const form = el(
    "form",
    { class: "hm-search-form", action: "bbs.search.jhtml", method: "get" },
    [
      el("input", {
        name: "keyword",
        value: model.keyword,
        placeholder: "搜索主题、回复或用户",
        "aria-label": "搜索关键词"
      }),
      el(
        "select",
        { name: "searchType", "aria-label": "搜索类型" },
        [
          el("option", { value: "topic", selected: model.type === "topic" }, "主题"),
          el("option", { value: "reply", selected: model.type === "reply" }, "回复")
        ]
      ),
      el("button", { class: "hm-button is-primary", type: "submit" }, "搜索")
    ]
  );
  return el("section", { class: "hm-panel" }, [
    el("header", { class: "hm-page-head" }, [
      el("div", {}, [
        el("span", { class: "hm-kicker" }, "SEARCH"),
        el("h1", {}, "站内搜索")
      ])
    ]),
    form,
    model.error ? el("p", { class: "hm-notice is-error" }, model.error) : null,
    el(
      "div",
      { class: "hm-search-results" },
      model.results.map((item) =>
        el(
          "a",
          {
            class: "hm-search-result",
            href: `bbs.topic.${item.id}.jhtml${
              item.floor ? `?floor=${item.floor}#${item.floor}` : ""
            }`
          },
          [
            el("strong", {}, item.title || `主题 #${item.id}`),
            el("span", {}, item.author?.name || ""),
            item.contentHtml
              ? el("div", { class: "hm-result-content" }, item.contentHtml)
              : null
          ]
        )
      )
    ),
    renderPagination(model.pagination)
  ]);
}

export async function mount({ route, client, shell }) {
  const model = normalizeSearch(
    await client.json(toBidUrl({ ...route, hash: "" }, "json"))
  );
  shell.setTitle("搜索");
  shell.setMain(renderSearch(model));
  shell.setSidebar(el("div"));
}
