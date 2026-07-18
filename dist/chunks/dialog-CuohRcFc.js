import { t as e } from "./dom-Dhq3QSJF.js";
//#region src/ui/dialog.js
var t = 0;
function n({ title: n, message: r, confirmText: i = "确认", danger: a = !1 }) {
	let o = document.activeElement, s = `hm-dialog-title-${++t}`;
	return new Promise((t) => {
		let c = !1, l = (e) => {
			c || (c = !0, p.remove(), o?.focus?.(), t(e));
		}, u = e("button", {
			class: "hm-button is-ghost hm-touch-target",
			type: "button",
			onclick: () => l(!1)
		}, "取消"), d = e("button", {
			class: `hm-button hm-touch-target ${a ? "is-danger" : "is-primary"}`,
			type: "button",
			onclick: () => l(!0)
		}, i), f = e("section", {
			class: "hm-dialog",
			role: "dialog",
			"aria-modal": "true",
			"aria-labelledby": s
		}, [
			e("span", { class: "hm-dialog-kicker" }, a ? "谨慎操作" : "请确认"),
			e("h2", { id: s }, n),
			e("p", {}, r),
			e("div", { class: "hm-dialog-actions" }, [u, d])
		]), p = e("div", {
			class: "hm-dialog-backdrop",
			onclick: (e) => {
				e.target === p && l(!1);
			}
		}, f);
		f.addEventListener("keydown", (e) => {
			if (e.key === "Escape" && (e.preventDefault(), l(!1)), e.key === "Tab") {
				let t = [u, d], n = e.shiftKey ? -1 : 1, r = (t.indexOf(document.activeElement) + n + t.length) % t.length;
				e.preventDefault(), t[r].focus();
			}
		}), document.body.append(p), u.focus();
	});
}
//#endregion
export { n as t };
