import { t as e } from "./dom-Dhq3QSJF.js";
//#region src/ui/forms.js
function t(t) {
	let n = {
		name: t.name,
		required: t.required,
		disabled: t.disabled,
		placeholder: t.placeholder || null
	}, r;
	if (t.tag === "textarea") r = e("textarea", n, t.value || "");
	else if (t.tag === "select") r = e("select", n, (t.options || []).map((t) => e("option", {
		value: t.value,
		selected: t.selected
	}, t.label)));
	else {
		let i = t.type || "text";
		r = e("input", {
			...n,
			type: i,
			value: [
				"file",
				"checkbox",
				"radio"
			].includes(i) ? null : t.value || "",
			checked: t.checked,
			accept: t.accept || null,
			autocomplete: i === "password" ? "current-password" : null
		});
	}
	return r.classList.add("hm-form-control"), r;
}
function n(n, r = {}) {
	let i = e("form", {
		class: "hm-form",
		action: n.action,
		method: n.method,
		enctype: n.enctype,
		onsubmit: r.onSubmit || null
	});
	for (let r of n.fields) {
		let n = t(r);
		if (r.type === "hidden") {
			i.append(n);
			continue;
		}
		let a = ["checkbox", "radio"].includes(r.type);
		i.append(e("label", { class: `hm-form-field${a ? " is-inline" : ""}` }, a ? [n, e("span", {}, r.label)] : [e("span", {}, r.label), n]));
	}
	return i.append(e("div", { class: "hm-form-actions" }, (n.submitters?.length ? n.submitters : [{
		name: "",
		value: "",
		label: "提交"
	}]).map((t) => e("button", {
		class: "hm-button is-primary",
		type: "submit",
		name: t.name || null,
		value: t.value || null
	}, t.label)))), i;
}
function r(e, { client: t, controller: n, toast: r = () => {}, onSuccess: i = () => {} }) {
	let a = !1, o = async (o) => {
		if (o.preventDefault(), a) return;
		a = !0;
		let s = n?.getValue?.() ?? e.querySelector("textarea[name=\"content\"]")?.value ?? "", c = [...e.querySelectorAll("button[type=\"submit\"],input[type=\"submit\"]")];
		c.forEach((e) => {
			e.disabled = !0;
		});
		try {
			let a = new FormData(e);
			o.submitter?.name && a.set(o.submitter.name, o.submitter.value);
			let s = await t.request(e.getAttribute("action"), {
				method: (e.getAttribute("method") || "post").toUpperCase(),
				body: a
			});
			if (!s.ok) throw Error(`请求失败：${s.status}`);
			let c = (s.headers.get("content-type") || "").includes("json") ? await s.json() : {};
			if (c.success === !1 || c.ok === !1 || c.error) throw Error(c.error || c.message || "提交失败");
			n?.setValue?.(""), n?.discardDraft?.(), r({
				kind: "success",
				title: "发送成功"
			}), await i(c);
		} catch (e) {
			n?.setValue?.(s), r({
				kind: "error",
				title: "发送失败，内容已保留",
				message: e?.message || String(e)
			});
		} finally {
			a = !1, c.forEach((e) => {
				e.disabled = !1;
			});
		}
	};
	return e.addEventListener("submit", o), () => e.removeEventListener("submit", o);
}
//#endregion
export { n, r as t };
