import { t as e } from "./urls-Bq3RnfMf.js";
import { t } from "./dom-Dhq3QSJF.js";
import { t as n } from "./avatar-f6-FYNKw.js";
import { t as r } from "./user-info-D3tSPs85.js";
import { r as i, t as a } from "./json-CtYJArb0.js";
import { t as o } from "./content-C2iR-miq.js";
import { t as s } from "./pagination-Bc186T6L.js";
//#region src/adapters/topic.js
function c(e = {}) {
	let t = e.topic || e.topicMeta || e.tMeta || {}, n = e.contentList || e.replyList || e.posts || e.tContents || [], o = i(t.id ?? t.topic_id ?? e.topic_id ?? n[0]?.topic_id), s = n.map((e) => {
		let t = r(e, e.author || {});
		return {
			floor: i(e.floor),
			contentHtml: String(e.contentHtml ?? e.content ?? ""),
			author: t,
			avatar: t.avatar,
			createdAt: e.ctime || e.createdAt || "",
			canEdit: !!e.canEdit,
			canDelete: !!(e.canDel ?? e.canDelete),
			canSink: !!e.canSink,
			canMove: !!e.canMove,
			canSetEssence: !!e.canSetEssence,
			canLockReply: !!e.canLockReply
		};
	});
	return {
		meta: {
			id: o,
			title: String(t.title || e.title || "主题"),
			uid: i(t.uid),
			locked: i(t.locked),
			review: !!i(t.review),
			readCount: i(t.read_count ?? t.readCount)
		},
		posts: s,
		canReply: !!e.canReply && !i(t.locked),
		token: String(e.actionToken || e.token || ""),
		pagination: a(e, `bbs.topic.${o}.jhtml`),
		notice: String(e.notice || e.error || "")
	};
}
//#endregion
//#region src/pages/topic.js
function l(e) {
	let t = document.createElement("template");
	t.innerHTML = e;
	for (let e of t.content.querySelectorAll("script,object,embed,base,meta[http-equiv]")) e.remove();
	for (let e of t.content.querySelectorAll("*")) for (let t of [...e.attributes]) /^on/i.test(t.name) && e.removeAttribute(t.name);
	return t.content;
}
function u(e, n, r = !1) {
	return t("a", {
		class: `hm-post-action${r ? " is-danger" : ""}`,
		href: n
	}, e);
}
function d(e, r) {
	let i = t("div", { class: "hm-post-content" });
	i.append(l(e.contentHtml)), o(i);
	let a = [];
	return e.canEdit && a.push(u("编辑", `bbs.edittopic.${r}.${e.floor}.jhtml`)), e.canDelete && a.push(u("删除", `bbs.deltopic.${r}.${e.floor}.jhtml`, !0)), e.canSink && a.push(u("下沉", `bbs.sinktopic.${r}.jhtml`)), t("article", {
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
		a.length ? t("footer", { class: "hm-post-actions" }, a) : null
	]);
}
function f(e) {
	return t("section", { class: "hm-panel hm-topic-page" }, [
		t("header", { class: "hm-page-head" }, [t("div", {}, [t("span", { class: "hm-kicker" }, `TOPIC · ${e.meta.readCount} READS`), t("h1", {}, e.meta.title)]), e.canReply ? t("a", {
			class: "hm-button is-primary",
			href: `bbs.newreply.${e.meta.id}.jhtml`
		}, "回复") : null]),
		e.notice ? t("p", { class: "hm-notice" }, e.notice) : null,
		t("div", { class: "hm-post-list" }, e.posts.map((t) => d(t, e.meta.id))),
		s(e.pagination)
	]);
}
async function p({ route: n, client: r, shell: i }) {
	let a = c(await r.json(e({
		...n,
		hash: ""
	}, "json")));
	i.setTitle(a.meta.title), i.setMain(f(a)), i.setSidebar(t("div", { class: "hm-side-stack" }));
}
//#endregion
export { p as mount, f as renderTopic };
