//#region src/formatters/prettier.js
var e = {
	javascript: "babel",
	typescript: "typescript",
	json: "json",
	html: "html",
	css: "css",
	markdown: "markdown"
}, t;
async function n() {
	return t ||= Promise.all([
		import("./standalone-CkXaCNBo.js"),
		import("./babel-BvWku014.js"),
		import("./estree-x9G7833h.js"),
		import("./typescript-9PDS9Vhx.js"),
		import("./html-CRqSsZD3.js"),
		import("./postcss-CUc-kPc7.js"),
		import("./markdown-Dia7yVvt.js")
	]).then(([e, ...t]) => ({
		prettier: e,
		plugins: t.map((e) => e.default || e)
	})), t;
}
async function r(t, r) {
	let { prettier: i, plugins: a } = await n();
	return i.format(t, {
		parser: e[r.language],
		plugins: a,
		semi: r.semi ?? !0,
		singleQuote: r.singleQuote ?? !1,
		tabWidth: r.tabWidth ?? 2,
		printWidth: r.printWidth ?? 88
	});
}
//#endregion
export { r as format };
