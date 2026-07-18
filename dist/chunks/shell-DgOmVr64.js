//#region src/formatters/shell.js
var e;
async function t() {
	return e ||= import("./browser-bJBXmvJL.js").then(async (e) => {
		if ("processor" in e) return e.processor;
		let { default: t } = await import("./main-Cci6Lt_R.js");
		return e.getProcessor(() => fetch(t));
	}), e;
}
async function n(e, n = {}) {
	return (await t())(e, {
		print: !0,
		variant: n.variant,
		tabWidth: n.tabWidth ?? 2,
		useTabs: n.useTabs ?? !1,
		keepComments: n.keepComments ?? !0
	});
}
//#endregion
export { n as format };
