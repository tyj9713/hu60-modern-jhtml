import { t as e } from "./dom-Dhq3QSJF.js";
import { t } from "./dialog-CuohRcFc.js";
//#region src/adapters/webplug.js
function n(e) {
	let t = (t, n) => e.json(t, {
		method: "POST",
		headers: { "content-type": "application/x-www-form-urlencoded;charset=UTF-8" },
		body: new URLSearchParams(n)
	});
	return {
		list: () => e.json("api.webplug.list.json"),
		get: (e) => t("api.webplug.get.json", { id: e }),
		add: (e) => t("api.webplug.add.json", e),
		update: (e) => t("api.webplug.update.json", e),
		enable: (e, n) => t("api.webplug.enable.json", {
			id: e,
			enabled: +!!n
		}),
		reorder: (e) => t("api.webplug.set_load_order.json", { order: JSON.stringify(e) }),
		remove: (e) => t("api.webplug.delete.json", { id: e }),
		importData: (e) => t("api.webplug.import.json", { content: e }),
		exportData: () => e.json("api.webplug.export.json")
	};
}
function r(e = {}) {
	return (e.list || e.webplugs || e.data || []).map((e) => ({
		id: Number(e.id),
		name: String(e.name || e.title || "未命名插件"),
		description: String(e.description || ""),
		code: String(e.code || e.content || ""),
		enabled: !!Number(e.enabled ?? e.enable),
		order: Number(e.order ?? e.load_order ?? 0)
	}));
}
//#endregion
//#region src/pages/webplug.js
function i(n, r = {}) {
	return e("section", { class: "hm-panel" }, [e("header", { class: "hm-page-head" }, [e("div", {}, [e("span", { class: "hm-kicker" }, "WEB PLUG"), e("h1", {}, "网页插件")]), e("button", {
		class: "hm-button is-primary",
		type: "button"
	}, "添加插件")]), e("div", { class: "hm-webplug-list" }, n.map((n) => e("article", { class: "hm-webplug-item" }, [
		e("div", {}, [e("strong", {}, n.name), e("p", {}, n.description || "没有说明")]),
		e("span", { class: `hm-status${n.enabled ? " is-on" : ""}` }, n.enabled ? "已启用" : "已停用"),
		e("div", { class: "hm-post-actions" }, [e("button", {
			class: "hm-post-action",
			type: "button"
		}, "编辑"), e("button", {
			class: "hm-post-action is-danger",
			type: "button",
			onclick: async () => {
				await (r.confirm || t)({
					title: `删除“${n.name}”？`,
					message: "插件代码将被永久删除，此操作不可恢复。",
					confirmText: "确认删除",
					danger: !0
				}) && await r.remove?.(n.id);
			}
		}, "删除")])
	])))]);
}
async function a({ client: t, shell: a }) {
	let o = n(t), s = r(await o.list());
	a.setTitle("网页插件"), a.setMain(i(s, { remove: o.remove })), a.setSidebar(e("div", { class: "hm-side-stack" }));
}
//#endregion
export { a as mount, i as renderWebPlugs };
