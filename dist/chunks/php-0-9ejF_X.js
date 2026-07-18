import { r as e } from "./rolldown-runtime-Dqa2HsxW.js";
//#region src/formatters/php.js
var t;
async function n() {
	return t ||= Promise.all([import("./standalone-CkXaCNBo.js"), import("./standalone-CtXqWg3V.js").then((t) => /* @__PURE__ */ e(t.default, 1))]), t;
}
async function r(e, t = {}) {
	let [r, i] = await n();
	return r.format(e, {
		parser: "php",
		plugins: [i.default || i],
		tabWidth: t.tabWidth ?? 2,
		printWidth: t.printWidth ?? 88
	});
}
//#endregion
export { r as format };
