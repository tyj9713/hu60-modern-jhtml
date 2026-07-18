//#region src/adapters/json.js
function e(e, t = 0) {
	let n = Number(e);
	return Number.isFinite(n) ? n : t;
}
function t(t, n = "") {
	let r = Math.max(1, e(t.currPage ?? t.page, 1)), i = Math.max(r, e(t.maxPage ?? t.pageCount, r)), a = r > 1, o = t.hasNextPage === void 0 ? r < i : !!t.hasNextPage, s = (e) => {
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
function n(t = {}) {
	return {
		id: e(t.topic_id ?? t.id),
		forumId: e(t.forum_id),
		title: String(t.title || ""),
		author: t.uinfo || t.author || {},
		avatar: t.uinfo?.avatar || t.avatar || "",
		replies: e(t.reply_count ?? t.replies),
		views: e(t.read_count ?? t.views),
		createdAt: t.ctime || t.createdAt || "",
		updatedAt: t.mtime || t.updatedAt || "",
		forumName: String(t.forum_name || ""),
		essence: !!e(t.essence),
		locked: e(t.locked),
		review: !!e(t.review)
	};
}
//#endregion
export { n, e as r, t };
