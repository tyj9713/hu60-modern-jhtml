import { t as e } from "./urls-Bq3RnfMf.js";
import { t } from "./dom-Dhq3QSJF.js";
import { n } from "./forms-Dv92BbyG.js";
import { t as r } from "./html-form-AUGbAe7I.js";
//#region src/pages/forms.js
function i(e, n = "info") {
	return t("p", { class: `hm-notice${n === "error" ? " is-error" : ""}` }, e);
}
function a(e) {
	let t = /* @__PURE__ */ new Map();
	for (let n of e.querySelectorAll("a[href*=\"bbs.newtopic.\"]")) {
		let e = (n.getAttribute("href") || "").match(/(?:^|\/)(bbs\.newtopic\.(\d+)\.html)(?:[?#].*)?$/), r = n.textContent?.replace(/\s+/g, " ").trim();
		!e || !r || t.has(e[2]) || t.set(e[2], {
			id: e[2],
			name: r,
			href: `bbs.newtopic.${e[2]}.jhtml`
		});
	}
	return [...t.values()];
}
function o(e) {
	return t("div", { class: "hm-forum-picker" }, e.map((e) => t("a", {
		class: "hm-forum-card",
		href: e.href
	}, [t("strong", {}, e.name), t("small", {}, "在此版块发布主题 →")])));
}
async function s({ route: s, client: c, shell: l, services: u = {} }) {
	let d = await c.html(e({
		...s,
		hash: ""
	}, "html")), f = new DOMParser().parseFromString(d, "text/html"), p = f.querySelector("h1,h2,title")?.textContent?.trim() || "操作", m;
	try {
		m = r(d);
	} catch {
		m = null;
	}
	let h = s.cid === "bbs" && s.pid === "newtopic" && !s.ext?.length ? a(f) : [], g = m ? n(m) : null, _ = f.querySelector(".failure,.text-failure,.error,.success,.notice")?.textContent?.replace(/\s+/g, " ").trim(), v = t("section", { class: "hm-panel" }, [t("header", { class: "hm-page-head" }, [t("div", {}, [t("span", { class: "hm-kicker" }, "ACTION"), t("h1", {}, p)])]), g || (h.length ? o(h) : null) || i(_ || "操作已经完成。", f.querySelector(".failure,.text-failure,.error") ? "error" : "info")]);
	l.setTitle(p), l.setMain(v), l.setSidebar(t("div"));
	let y = g?.querySelector("textarea[name=\"content\"]");
	y && u.mountEditor && await u.mountEditor({
		form: g,
		textarea: y,
		titleInput: g.querySelector("input[name=\"title\"],input[name=\"content_title\"]"),
		routeKey: `${s.cid}.${s.pid}`,
		targetId: s.ext[0] || "",
		previewUrl: e({
			...s,
			hash: ""
		}, "json"),
		services: {
			...u,
			client: c
		}
	});
}
//#endregion
export { a as extractNewTopicForums, s as mount, i as renderServerNotice };
