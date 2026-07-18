//#region src/formatters/python.js
var e;
async function t() {
	return e ||= import("./ruff_wasm-Dzf1pIzP.js").then(async (e) => {
		if (typeof process < "u" && process.versions?.node && typeof import.meta.resolve == "function") {
			let { readFile: t } = await import(
				/* @vite-ignore */
				"node:fs/promises"
), n = import.meta.resolve("@astral-sh/ruff-wasm-web"), r = await t(new URL("./ruff_wasm_bg.wasm", n));
			await e.default(r);
		} else await e.default();
		return new e.Workspace(e.Workspace.defaultSettings(), e.PositionEncoding.Utf16);
	}), e;
}
async function n(e) {
	return (await t()).format(e);
}
//#endregion
export { n as format };
