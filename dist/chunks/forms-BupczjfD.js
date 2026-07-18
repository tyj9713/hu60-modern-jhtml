import { t as e } from "./urls-Bq3RnfMf.js";
import { t } from "./dom-Dhq3QSJF.js";
import { n } from "./forms-Dv92BbyG.js";
import { t as r } from "./html-form-CqrFi-b0.js";
//#region src/pages/forms.js
function i(e, n = "info") {
	return t("p", { class: `hm-notice${n === "error" ? " is-error" : ""}` }, e);
}
async function a({ route: a, client: o, shell: s, services: c = {} }) {
	let l = await o.html(e({
		...a,
		hash: ""
	}, "html")), u = new DOMParser().parseFromString(l, "text/html"), d = u.querySelector("h1,h2,title")?.textContent?.trim() || "操作", f;
	try {
		f = r(l);
	} catch {
		f = null;
	}
	let p = f ? n(f) : null, m = u.body?.textContent?.replace(/\s+/g, " ").trim(), h = t("section", { class: "hm-panel" }, [t("header", { class: "hm-page-head" }, [t("div", {}, [t("span", { class: "hm-kicker" }, "ACTION"), t("h1", {}, d)])]), p || i(m || "操作已经完成。", u.querySelector(".failure,.text-failure,.error") ? "error" : "info")]);
	s.setTitle(d), s.setMain(h), s.setSidebar(t("div"));
	let g = p?.querySelector("textarea[name=\"content\"]");
	g && c.mountEditor && await c.mountEditor({
		form: p,
		textarea: g,
		titleInput: p.querySelector("input[name=\"title\"],input[name=\"content_title\"]"),
		routeKey: `${a.cid}.${a.pid}`,
		targetId: a.ext[0] || "",
		previewUrl: e({
			...a,
			hash: ""
		}, "json"),
		services: {
			...c,
			client: o
		}
	});
}
//#endregion
export { a as mount, i as renderServerNotice };
