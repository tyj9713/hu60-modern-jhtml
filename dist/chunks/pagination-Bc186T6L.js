import { t as e } from "./dom-Dhq3QSJF.js";
//#region src/ui/pagination.js
function t(t, n, r) {
	let i = `hm-page-link is-${r} hm-touch-target`;
	return t ? e("a", {
		class: i,
		href: t
	}, n) : e("span", {
		class: i,
		"aria-disabled": "true"
	}, n);
}
function n(n) {
	return e("nav", {
		class: "hm-pagination",
		"aria-label": "分页"
	}, [
		t(n.previousUrl, "← 上一页", "previous"),
		e("span", {
			class: "hm-page-info",
			"aria-current": "page"
		}, `第 ${n.current} / ${n.max || "?"} 页`),
		t(n.nextUrl, "下一页 →", "next")
	]);
}
//#endregion
export { n as t };
