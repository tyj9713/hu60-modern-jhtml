//#region src/adapters/html-form.js
function e(e) {
	return e.labels?.[0]?.textContent?.trim() || e.getAttribute("placeholder") || e.name;
}
function t(t, n = "form") {
	let r = new DOMParser().parseFromString(t, "text/html"), i = r.querySelector(n);
	if (!i) throw Error("页面中没有找到可适配的表单");
	let a = [...i.elements], o = a.filter((e) => e.name && ![
		"submit",
		"button",
		"reset"
	].includes(e.type)).map((t) => ({
		tag: t.tagName.toLowerCase(),
		type: t.type || "",
		name: t.name,
		value: t.value,
		label: e(t),
		placeholder: t.getAttribute("placeholder") || "",
		required: t.required,
		disabled: t.disabled,
		checked: !!t.checked,
		accept: t.getAttribute("accept") || "",
		options: t.tagName === "SELECT" ? [...t.options].map((e) => ({
			value: e.value,
			label: e.text,
			selected: e.selected
		})) : []
	})), s = a.filter((e) => ["submit", "button"].includes(e.type)).map((e) => ({
		name: e.name,
		value: e.value,
		label: e.textContent?.trim() || e.value || "提交"
	}));
	return {
		action: i.getAttribute("action") || location.href,
		method: (i.getAttribute("method") || "get").toLowerCase(),
		enctype: i.getAttribute("enctype") || "application/x-www-form-urlencoded",
		title: r.querySelector("h1,h2,title")?.textContent?.trim() || "表单",
		fields: o,
		submitters: s
	};
}
//#endregion
export { t };
