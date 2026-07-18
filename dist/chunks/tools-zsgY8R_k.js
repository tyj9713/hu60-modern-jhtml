import { t as e } from "./urls-Bq3RnfMf.js";
import { t } from "./dom-Dhq3QSJF.js";
import { n } from "./forms-Dv92BbyG.js";
import { t as r } from "./html-form-AUGbAe7I.js";
//#region src/adapters/tools.js
function i(e = {}) {
	let t = {};
	for (let [n, r] of Object.entries(e.header || e.headers || {})) n.toLowerCase() !== "cookie" && (t[n.toLowerCase()] = String(r));
	return {
		ip: String(e.ip || ""),
		location: String(e.location || ""),
		proxy: String(e.proxy || ""),
		headers: t
	};
}
function a(e) {
	return r(e, "form");
}
//#endregion
//#region src/pages/tools.js
function o(e) {
	return t("section", { class: "hm-panel" }, [
		t("header", { class: "hm-page-head" }, [t("div", {}, [t("span", { class: "hm-kicker" }, "REQUEST INSPECTOR"), t("h1", {}, "浏览器 UA")])]),
		t("dl", { class: "hm-tool-facts" }, [
			t("div", {}, [t("dt", {}, "IP"), t("dd", {}, e.ip)]),
			t("div", {}, [t("dt", {}, "位置"), t("dd", {}, e.location)]),
			t("div", {}, [t("dt", {}, "代理"), t("dd", {}, e.proxy || "无")])
		]),
		t("div", { class: "hm-header-table" }, Object.entries(e.headers).map(([e, n]) => t("div", {}, [t("strong", {}, e), t("code", {}, n)])))
	]);
}
function s(e, r = {}) {
	return t("section", { class: "hm-panel" }, [t("header", { class: "hm-page-head" }, [t("div", {}, [t("span", { class: "hm-kicker" }, "CODEC"), t("h1", {}, "编码解码器")])]), n(e, r)]);
}
async function c({ route: n, client: r, shell: c }) {
	if (n.pid === "ua") {
		let t = i(await r.json(e({
			...n,
			hash: ""
		}, "json")));
		c.setTitle("浏览器 UA"), c.setMain(o(t));
	} else {
		let e = await r.html("tools.coder.html");
		c.setTitle("编码解码器"), c.setMain(s(a(e)));
	}
	c.setSidebar(t("div", { class: "hm-side-stack" }));
}
//#endregion
export { c as mount, s as renderCoder, o as renderUa };
