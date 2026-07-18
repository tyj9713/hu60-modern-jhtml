//#region src/formatters/registry.js
var e = /* @__PURE__ */ new Map([
	["js", "javascript"],
	["jsx", "javascript"],
	["ts", "typescript"],
	["tsx", "typescript"],
	["json5", "json"],
	["md", "markdown"],
	["py", "python"],
	["bash", "shell"],
	["sh", "shell"],
	["zsh", "shell"],
	["mysql", "sql"],
	["postgresql", "sql"],
	["sqlite", "sql"]
]), t = {
	javascript: () => import("./prettier-DGv0CReA.js"),
	typescript: () => import("./prettier-DGv0CReA.js"),
	json: () => import("./prettier-DGv0CReA.js"),
	html: () => import("./prettier-DGv0CReA.js"),
	css: () => import("./prettier-DGv0CReA.js"),
	markdown: () => import("./prettier-DGv0CReA.js"),
	php: () => import("./php-0-9ejF_X.js"),
	python: () => import("./python-BX7mwRb3.js"),
	sql: () => import("./sql-CcOWj28J.js"),
	shell: () => import("./shell-DgOmVr64.js")
};
function n(t) {
	let n = String(t || "").trim().toLowerCase();
	return e.get(n) || n;
}
async function r(e, r, i = {}) {
	let a = n(e), o = t[a];
	if (!o) throw Error(`暂不支持格式化：${e || "未指定语言"}`);
	let s = await o();
	try {
		return await s.format(String(r || ""), {
			...i,
			language: a
		});
	} catch (e) {
		let t = /* @__PURE__ */ Error(`${a} 格式化失败：${e?.message || String(e)}`);
		throw t.cause = e, t.source = r, t;
	}
}
//#endregion
export { r as formatCode };
