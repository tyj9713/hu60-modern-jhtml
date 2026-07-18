//#region src/ui/dom.js
function e(e, t = {}, n = []) {
	let r = document.createElement(e);
	for (let [e, n] of Object.entries(t)) e === "class" ? r.className = n : e.startsWith("on") && typeof n == "function" ? r.addEventListener(e.slice(2).toLowerCase(), n) : n !== !1 && n != null && r.setAttribute(e, n === !0 ? "" : String(n));
	for (let e of [n].flat(Infinity)) e === !1 || e == null || r.append(e instanceof Node ? e : document.createTextNode(String(e)));
	return r;
}
//#endregion
export { e as t };
