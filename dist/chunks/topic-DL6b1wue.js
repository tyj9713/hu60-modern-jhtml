import { t as e } from "./urls-Bq3RnfMf.js";
import { t } from "./dom-Dhq3QSJF.js";
import { t as n } from "./avatar-f6-FYNKw.js";
import { r, t as i } from "./json-COYDUIwt.js";
import { t as a } from "./content-C2iR-miq.js";
import { t as o } from "./pagination-Bc186T6L.js";
//#region src/adapters/topic.js
function s(e = {}) {
	let t = e.topic || e.topicMeta || {}, n = r(t.id ?? t.topic_id ?? e.topic_id), a = (e.contentList || e.replyList || e.posts || []).map((e) => ({
		floor: r(e.floor),
		contentHtml: String(e.contentHtml ?? e.content ?? ""),
		author: e.uinfo || e.author || {},
		avatar: e.uinfo?.avatar || e.avatar || "",
		createdAt: e.ctime || e.createdAt || "",
		canEdit: !!e.canEdit,
		canDelete: !!(e.canDel ?? e.canDelete),
		canSink: !!e.canSink,
		canMove: !!e.canMove,
		canSetEssence: !!e.canSetEssence,
		canLockReply: !!e.canLockReply
	}));
	return {
		meta: {
			id: n,
			title: String(t.title || e.title || "主题"),
			uid: r(t.uid),
			locked: r(t.locked),
			review: !!r(t.review),
			readCount: r(t.read_count ?? t.readCount)
		},
		posts: a,
		canReply: !!e.canReply && !r(t.locked),
		token: String(e.actionToken || e.token || ""),
		pagination: i(e, `bbs.topic.${n}.jhtml`),
		notice: String(e.notice || e.error || "")
	};
}
//#endregion
//#region src/pages/topic.js
function c(e) {
	let t = document.createElement("template");
	t.innerHTML = e;
	for (let e of t.content.querySelectorAll("script,object,embed,base,meta[http-equiv]")) e.remove();
	for (let e of t.content.querySelectorAll("*")) for (let t of [...e.attributes]) /^on/i.test(t.name) && e.removeAttribute(t.name);
	return t.content;
}
function l(e, n, r = !1) {
	return t("a", {
		class: `hm-post-action${r ? " is-danger" : ""}`,
		href: n
	}, e);
}
function u(e, r) {
	let i = t("div", { class: "hm-post-content" });
	i.append(c(e.contentHtml)), a(i);
	let o = [];
	return e.canEdit && o.push(l("编辑", `bbs.edittopic.${r}.${e.floor}.html`)), e.canDelete && o.push(l("删除", `bbs.deltopic.${r}.${e.floor}.html`, !0)), e.canSink && o.push(l("下沉", `bbs.sinktopic.${r}.html`)), t("article", {
		class: "hm-post",
		id: String(e.floor)
	}, [
		t("header", { class: "hm-post-head" }, [
			n({
				...e.author,
				avatar: e.avatar
			}, 44),
			t("div", { class: "hm-post-author" }, [t("strong", {}, e.author?.name || "匿名"), t("small", {}, e.createdAt || "")]),
			t("a", {
				class: "hm-floor",
				href: `#${e.floor}`
			}, `#${e.floor}`)
		]),
		i,
		o.length ? t("footer", { class: "hm-post-actions" }, o) : null
	]);
}
function d(e) {
	return t("section", { class: "hm-panel hm-topic-page" }, [
		t("header", { class: "hm-page-head" }, [t("div", {}, [t("span", { class: "hm-kicker" }, `TOPIC · ${e.meta.readCount} READS`), t("h1", {}, e.meta.title)]), e.canReply ? t("a", {
			class: "hm-button is-primary",
			href: `bbs.newreply.${e.meta.id}.html`
		}, "回复") : null]),
		e.notice ? t("p", { class: "hm-notice" }, e.notice) : null,
		t("div", { class: "hm-post-list" }, e.posts.map((t) => u(t, e.meta.id))),
		o(e.pagination)
	]);
}
async function f({ route: n, client: r, shell: i }) {
	let a = s(await r.json(e({
		...n,
		hash: ""
	}, "json")));
	i.setTitle(a.meta.title), i.setMain(d(a)), i.setSidebar(t("div", { class: "hm-side-stack" }));
}
//#endregion
export { f as mount, d as renderTopic };
