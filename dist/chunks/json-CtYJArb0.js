import { t as e } from "./user-info-D3tSPs85.js";
//#region src/adapters/json.js
function t(e, t = 0) {
	let n = Number(e);
	return Number.isFinite(n) ? n : t;
}
function n(e, n = "") {
	let r = Math.max(1, t(e.currPage ?? e.page, 1)), i = Math.max(r, t(e.maxPage ?? e.pageCount, r)), a = r > 1, o = e.hasNextPage === void 0 ? r < i : !!e.hasNextPage, s = (e) => {
		let t = new URLSearchParams();
		return t.set("p", String(e)), `${n}${n.includes("?") ? "&" : "?"}${t}`;
	};
	return {
		current: r,
		max: i,
		previousUrl: a ? s(r - 1) : "",
		nextUrl: o ? s(r + 1) : ""
	};
}
function r(n = {}) {
	let r = e(n, n.author || {});
	return {
		id: t(n.topic_id ?? n.id),
		forumId: t(n.forum_id),
		title: String(n.title || ""),
		author: r,
		avatar: r.avatar,
		replies: t(n.reply_count ?? n.replies),
		views: t(n.read_count ?? n.views),
		createdAt: n.ctime || n.createdAt || "",
		updatedAt: n.mtime || n.updatedAt || "",
		forumName: String(n.forum_name || ""),
		essence: !!t(n.essence),
		locked: t(n.locked),
		review: !!t(n.review)
	};
}
//#endregion
export { r as n, t as r, n as t };
