//#region src/adapters/html-form.js
var e = {
	title: "标题",
	content_title: "标题",
	content: "正文",
	name: "用户名",
	password: "密码",
	password2: "确认密码",
	email: "邮箱",
	token: "验证令牌"
};
function t(t) {
	return t.labels?.[0]?.textContent?.trim() || t.getAttribute("placeholder") || e[t.name] || t.name;
}
function n(e, n = "form") {
	let r = new DOMParser().parseFromString(e, "text/html"), i = r.querySelector(n);
	if (!i) throw Error("页面中没有找到可适配的表单");
	let a = [...i.elements], o = a.filter((e) => e.name && ![
		"submit",
		"button",
		"reset"
	].includes(e.type)).map((e) => ({
		tag: e.tagName.toLowerCase(),
		type: e.type || "",
		name: e.name,
		value: e.value,
		label: t(e),
		placeholder: e.getAttribute("placeholder") || "",
		required: e.required,
		disabled: e.disabled,
		checked: !!e.checked,
		accept: e.getAttribute("accept") || "",
		options: e.tagName === "SELECT" ? [...e.options].map((e) => ({
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
export { n as t };
