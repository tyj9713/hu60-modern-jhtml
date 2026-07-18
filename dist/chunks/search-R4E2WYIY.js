import { t as e } from "./urls-Bq3RnfMf.js";
import { t } from "./dom-Dhq3QSJF.js";
import { r as n, t as r } from "./json-CtYJArb0.js";
import { t as i } from "./pagination-Bc186T6L.js";
//#region src/pages/search.js
function a(e = {}) {
	let t = e.searchType === "reply" ? "reply" : "topic", i = t === "reply" ? e.replyList || e.resultList || [] : e.topicList || e.resultList || [];
	return {
		type: t,
		keyword: String(e.keyword || e.key || ""),
		uid: n(e.uid),
		error: String(e.error || e.errMsg || ""),
		results: i.map((e) => ({
			id: n(e.topic_id ?? e.id),
			floor: n(e.floor),
			title: String(e.title || e.topic_title || ""),
			contentHtml: String(e.content || e.contentHtml || ""),
			author: e.uinfo || {}
		})),
		pagination: r(e, "bbs.search.jhtml")
	};
}
function o(e) {
	let n = t("form", {
		class: "hm-search-form",
		action: "bbs.search.jhtml",
		method: "get"
	}, [
		t("input", {
			name: "keyword",
			value: e.keyword,
			placeholder: "搜索主题、回复或用户",
			"aria-label": "搜索关键词"
		}),
		t("select", {
			name: "searchType",
			"aria-label": "搜索类型"
		}, [t("option", {
			value: "topic",
			selected: e.type === "topic"
		}, "主题"), t("option", {
			value: "reply",
			selected: e.type === "reply"
		}, "回复")]),
		t("button", {
			class: "hm-button is-primary",
			type: "submit"
		}, "搜索")
	]);
	return t("section", { class: "hm-panel" }, [
		t("header", { class: "hm-page-head" }, [t("div", {}, [t("span", { class: "hm-kicker" }, "SEARCH"), t("h1", {}, "站内搜索")])]),
		n,
		e.error ? t("p", { class: "hm-notice is-error" }, e.error) : null,
		t("div", { class: "hm-search-results" }, e.results.map((e) => t("a", {
			class: "hm-search-result",
			href: `bbs.topic.${e.id}.jhtml${e.floor ? `?floor=${e.floor}#${e.floor}` : ""}`
		}, [
			t("strong", {}, e.title || `主题 #${e.id}`),
			t("span", {}, e.author?.name || ""),
			e.contentHtml ? t("div", { class: "hm-result-content" }, e.contentHtml) : null
		]))),
		i(e.pagination)
	]);
}
async function s({ route: n, client: r, shell: i }) {
	let s = a(await r.json(e({
		...n,
		hash: ""
	}, "json")));
	i.setTitle("搜索"), i.setMain(o(s)), i.setSidebar(t("div"));
}
//#endregion
export { s as mount, a as normalizeSearch, o as renderSearch };
