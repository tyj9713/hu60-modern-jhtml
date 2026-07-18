import { t as e } from "./dom-Dhq3QSJF.js";
//#region src/enhancers/code.js
var t = {
	js: "JavaScript",
	javascript: "JavaScript",
	ts: "TypeScript",
	typescript: "TypeScript",
	html: "HTML",
	css: "CSS",
	json: "JSON",
	php: "PHP",
	py: "Python",
	python: "Python",
	sql: "SQL",
	sh: "Shell",
	shell: "Shell",
	bash: "Shell",
	markdown: "Markdown",
	md: "Markdown"
};
function n(e) {
	let n = [...e.classList].map((e) => e.replace(/^(language-|lang-)/, "")).find((e) => t[e.toLowerCase()]);
	return n ? t[n.toLowerCase()] : "代码";
}
function r(t, { clipboard: r = navigator.clipboard } = {}) {
	for (let i of t.querySelectorAll("pre")) {
		let t = i.querySelector(":scope > code") || i.querySelector("code");
		if (!t || i.dataset.hmCodeEnhanced === "1") continue;
		i.dataset.hmCodeEnhanced = "1";
		let a = t.textContent.split(/\r?\n/).length, o = e("button", {
			type: "button",
			"data-action": "copy-code",
			onclick: async () => {
				await r?.writeText?.(t.textContent), o.textContent = "已复制", setTimeout(() => {
					o.textContent = "复制";
				}, 1600);
			}
		}, "复制"), s = [o, e("button", {
			type: "button",
			"data-action": "toggle-wrap",
			onclick: () => i.classList.toggle("is-wrapped")
		}, "换行")];
		a > 36 && (i.classList.add("is-collapsed"), s.push(e("button", {
			type: "button",
			"data-action": "toggle-collapse",
			onclick: (e) => {
				let t = i.classList.toggle("is-collapsed");
				e.currentTarget.textContent = t ? "展开" : "收起";
			}
		}, "展开"))), i.before(e("div", { class: "hm-code-toolbar" }, [e("span", { class: "hm-code-language" }, n(t)), e("span", { class: "hm-code-actions" }, s)]));
	}
}
//#endregion
//#region src/enhancers/faces.js
function i(e) {
	for (let t of e.querySelectorAll("img[src*=\"/img/face/\"]")) t.classList.add("hm-face-image");
}
//#endregion
//#region src/enhancers/links.js
function a(e) {
	for (let t of e.querySelectorAll("a[href]")) {
		let e;
		try {
			e = new URL(t.href, location.href);
		} catch {
			continue;
		}
		["http:", "https:"].includes(e.protocol) && e.origin !== location.origin && (t.target = "_blank", t.rel = "noopener noreferrer nofollow", t.classList.add("hm-external-link"));
	}
}
//#endregion
//#region src/enhancers/content.js
function o(e) {
	i(e), a(e), r(e);
}
//#endregion
export { o as t };
