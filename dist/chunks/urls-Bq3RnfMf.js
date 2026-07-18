//#region src/core/urls.js
function e(e, t, n = {}) {
	let r = e.cid === "admin" ? "html" : t, i = [
		e.cid,
		e.pid,
		...e.ext.map(encodeURIComponent),
		r
	], a = new URLSearchParams(e.query);
	for (let [e, t] of Object.entries(n)) t == null || t === "" ? a.delete(e) : a.set(e, String(t));
	let o = a.size ? `?${a}` : "";
	return `${i.join(".")}${o}${e.hash || ""}`;
}
//#endregion
export { e as t };
