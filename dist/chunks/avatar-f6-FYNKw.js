import { t as e } from "./dom-Dhq3QSJF.js";
//#region src/ui/avatar.js
function t(t = {}, n = 40) {
	let r = String(t.name || "虎").trim() || "虎", i = [...r][0] || "虎", a = e("span", {
		class: "hm-avatar",
		role: "img",
		"aria-label": `${r}的头像`
	}, i);
	if (a.style.setProperty("--hm-avatar-size", `${n}px`), t.avatar) {
		let n = e("img", {
			src: t.avatar,
			alt: "",
			loading: "lazy",
			decoding: "async"
		});
		n.addEventListener("error", () => n.remove(), { once: !0 }), a.prepend(n);
	}
	return a;
}
//#endregion
export { t };
