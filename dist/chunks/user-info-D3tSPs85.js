//#region src/adapters/user-info.js
function e(e) {
	let t = Number(e);
	return Number.isFinite(t) ? t : 0;
}
function t(t = {}, n = {}) {
	let r = t.uinfo || t.userInfo || t.user || t._uinfo || {}, i = e(r.uid ?? r.id ?? t._u_uid ?? t.uid ?? t.user_id ?? n.uid ?? n.id), a = String(r.name ?? t._u_name ?? t.username ?? t.name ?? n.name ?? ""), o = String(r.avatar ?? t._u_avatar ?? t.avatar ?? n.avatar ?? "");
	return {
		...n,
		...t,
		...r,
		uid: i,
		name: a,
		avatar: o
	};
}
//#endregion
export { t };
