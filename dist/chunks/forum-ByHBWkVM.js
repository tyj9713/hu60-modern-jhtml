import { t as e } from "./urls-Bq3RnfMf.js";
import { t } from "./dom-Dhq3QSJF.js";
import { t as n } from "./avatar-f6-FYNKw.js";
import { n as r, r as i, t as a } from "./json-COYDUIwt.js";
import { t as o } from "./pagination-Bc186T6L.js";
//#region src/adapters/forum.js
function s(e = {}) {
	let t = e.forum || e.forumInfo || {}, n = i(t.id ?? e.forumId);
	return {
		id: n,
		title: String(t.name || e.title || "论坛"),
		description: String(t.description || t.intro || ""),
		breadcrumbs: (e.parentForumList || e.breadcrumbs || []).map((e) => ({
			id: i(e.id),
			name: String(e.name || "")
		})),
		childForums: (e.childForumList || e.childForums || []).map((e) => ({
			id: i(e.id),
			name: String(e.name || ""),
			description: String(e.description || e.intro || "")
		})),
		topics: (e.topicList || e.topics || []).map(r),
		pagination: a(e, `bbs.forum.${n}.jhtml`),
		filters: { onlyEssence: !!i(e.onlyEssence) },
		notice: String(e.notice || e.error || "")
	};
}
//#endregion
//#region src/pages/forum.js
function c(e) {
	return t("article", { class: "hm-topic-row" }, [
		n({
			...e.author,
			avatar: e.avatar
		}, 42),
		t("div", { class: "hm-topic-copy" }, [t("a", {
			class: "hm-topic-title",
			href: `bbs.topic.${e.id}.jhtml`
		}, e.title || "无标题"), t("div", { class: "hm-topic-meta" }, [
			t("span", {}, e.author?.name || "匿名"),
			e.essence ? t("em", {}, "精华") : null,
			e.review ? t("em", {}, "待审核") : null
		])]),
		t("div", { class: "hm-topic-stats" }, [t("strong", {}, e.replies), t("small", {}, `${e.views} 阅读`)])
	]);
}
function l(e) {
	return t("section", { class: "hm-panel" }, [
		t("header", { class: "hm-page-head" }, [t("div", {}, [
			t("span", { class: "hm-kicker" }, "FORUM"),
			t("h1", {}, e.title),
			e.description ? t("p", {}, e.description) : null
		]), t("a", {
			class: "hm-button is-primary",
			href: `bbs.newtopic.${e.id}.html`
		}, "＋ 发帖")]),
		e.childForums.length ? t("div", { class: "hm-forum-grid" }, e.childForums.map((e) => t("a", {
			class: "hm-forum-card",
			href: `bbs.forum.${e.id}.jhtml`
		}, [t("strong", {}, e.name), e.description ? t("small", {}, e.description) : null]))) : null,
		e.notice ? t("p", { class: "hm-notice" }, e.notice) : null,
		t("div", { class: "hm-topic-list" }, e.topics.length ? e.topics.map(c) : t("p", { class: "hm-empty" }, "当前版块暂无主题")),
		o(e.pagination)
	]);
}
async function u({ route: n, client: r, shell: i }) {
	let a = s(await r.json(e({
		...n,
		hash: ""
	}, "json")));
	i.setTitle(a.title), i.setMain(l(a)), i.setSidebar(t("div", { class: "hm-side-stack" }));
}
//#endregion
export { u as mount, l as renderForum };
