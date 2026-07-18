//#region src/formatters/sql.js
async function e(e, t = {}) {
	let { format: n } = await import("./esm-Dlpde53s.js");
	return n(e, {
		language: t.dialect || "mysql",
		tabWidth: t.tabWidth ?? 2,
		keywordCase: t.keywordCase || "upper"
	});
}
//#endregion
export { e as format };
