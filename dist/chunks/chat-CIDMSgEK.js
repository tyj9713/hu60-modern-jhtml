import { t as e } from "./urls-Bq3RnfMf.js";
import { t } from "./dom-Dhq3QSJF.js";
import { t as n } from "./avatar-f6-FYNKw.js";
import { t as r } from "./user-info-D3tSPs85.js";
import { r as i, t as a } from "./json-CtYJArb0.js";
import { t as o } from "./content-C2iR-miq.js";
import { t as s } from "./forms-Dv92BbyG.js";
import { t as c } from "./pagination-Bc186T6L.js";
//#region src/adapters/chat.js
function l(e = {}) {
	return {
		mode: "rooms",
		rooms: (e.roomList || e.rooms || e.chatRomList || []).map((e) => ({
			name: String(e.name || e.room || ""),
			count: i(e.count ?? e.online),
			description: String(e.description || "")
		})),
		showBot: !!i(e.showBot),
		actionToken: String(e.actionToken || e.token || ""),
		notice: String(e.notice || e.error || "")
	};
}
function u(e = {}) {
	let t = String(e.roomName || e.chatRomName || e.room || "聊天室");
	return {
		mode: "messages",
		room: t,
		messages: (e.chatList || e.messages || []).map((e) => {
			let t = r(e);
			return {
				id: i(e.id ?? e.lid),
				floor: i(e.lid ?? e.floor),
				uid: i(e.uid),
				author: t,
				avatar: t.avatar,
				contentHtml: String(e.contentHtml ?? e.content ?? ""),
				createdAt: e.ctime || e.createdAt || "",
				canDelete: !!(e.canDel ?? e.canDelete),
				canViewSource: !!(e.canViewSource ?? e.canSource)
			};
		}),
		showBot: !!i(e.showBot),
		pagination: a(e, `addin.chat.${encodeURIComponent(t)}.jhtml`),
		actionToken: String(e.actionToken || e.token || ""),
		canPost: e.canPost !== !1,
		notice: String(e.notice || e.error || "")
	};
}
//#endregion
//#region src/pages/chat.js
function d(e) {
	let t = document.createElement("template");
	return t.innerHTML = e, t.content.querySelectorAll("script,object,embed").forEach((e) => e.remove()), t.content;
}
function f(e) {
	return t("section", { class: "hm-panel" }, [
		t("header", { class: "hm-page-head" }, [t("div", {}, [t("span", { class: "hm-kicker" }, "PUBLIC CHAT"), t("h1", {}, "公共聊天室")]), t("a", {
			class: "hm-button is-primary",
			href: "addin.chat.new.html"
		}, "新建房间")]),
		e.notice ? t("p", { class: "hm-notice" }, e.notice) : null,
		t("div", { class: "hm-chat-rooms" }, e.rooms.map((e) => t("a", {
			class: "hm-chat-room",
			href: `addin.chat.${encodeURIComponent(e.name)}.jhtml`
		}, [t("div", {}, [t("strong", {}, e.name), e.description ? t("small", {}, e.description) : null]), t("span", {}, `${e.count} 人`)])))
	]);
}
function p(e) {
	return t("div", { class: "hm-chat-composer" }, [t("form", {
		class: "hm-form",
		action: `addin.chat.${encodeURIComponent(e.room)}.json`,
		method: "post"
	}, [
		e.actionToken ? t("input", {
			type: "hidden",
			name: "token",
			value: e.actionToken
		}) : null,
		t("label", { class: "hm-form-field" }, [t("span", {}, "参与聊天"), t("textarea", {
			class: "hm-form-control",
			name: "content",
			required: !0
		})]),
		t("div", { class: "hm-form-actions" }, [t("button", {
			class: "hm-button is-primary",
			type: "submit",
			name: "go",
			value: "快速发言"
		}, "快速发言")])
	])]);
}
function m(e, r) {
	let i = t("div", { class: "hm-chat-messages" }, e.messages.map((e) => {
		let r = t("div", { class: "hm-chat-content" });
		return r.append(d(e.contentHtml)), o(r), t("article", {
			class: "hm-chat-message",
			id: String(e.floor)
		}, [n({
			...e.author,
			avatar: e.avatar
		}, 42), t("div", { class: "hm-chat-message-main" }, [
			t("header", { class: "hm-chat-meta" }, [
				t("strong", {}, e.author?.name || "匿名"),
				t("a", { href: `#${e.floor}` }, `#${e.floor}`),
				e.createdAt ? t("time", {}, e.createdAt) : null
			]),
			r,
			t("footer", { class: "hm-post-actions" }, [
				t("a", {
					class: "hm-post-action",
					href: `#reply-${e.uid}`
				}, "@Ta"),
				e.canViewSource ? t("a", {
					class: "hm-post-action",
					href: `?source=${e.id}`
				}, "源内容") : null,
				e.canDelete ? t("a", {
					class: "hm-post-action is-danger",
					href: `?del=${e.id}`
				}, "删除") : null
			])
		])]);
	}));
	return t("section", { class: "hm-panel" }, [
		t("header", { class: "hm-page-head" }, [t("div", {}, [t("span", { class: "hm-kicker" }, "LIVE ROOM"), t("h1", {}, e.room)]), t("a", {
			class: "hm-button is-ghost",
			href: "addin.chat.jhtml"
		}, "切换房间")]),
		e.notice ? t("p", { class: "hm-notice" }, e.notice) : null,
		i,
		c(e.pagination),
		e.canPost && r.mountEditor ? p(e) : null
	]);
}
function h(e, t = {}) {
	return e.mode === "rooms" ? f(e) : m(e, t);
}
async function g({ route: n, client: r, shell: i, services: a = {} }) {
	let o = await r.json(e({
		...n,
		hash: ""
	}, "json", { _uinfo: "uid,name,avatar" })), c = n.ext.length || o.chatList ? u(o) : l(o);
	i.setTitle(c.mode === "rooms" ? "公共聊天室" : c.room);
	let d = h(c, a);
	i.setMain(d), i.setSidebar(t("div", { class: "hm-side-stack" }));
	let f = d.querySelector(".hm-chat-composer form"), p = f?.querySelector("textarea[name=\"content\"]");
	if (f && p && a.mountEditor) {
		let e = await a.mountEditor({
			form: f,
			textarea: p,
			routeKey: "addin.chat",
			targetId: c.room,
			previewUrl: f.getAttribute("action"),
			services: {
				...a,
				client: r
			}
		});
		r.request && s(f, {
			client: r,
			controller: e,
			toast: a.toast
		});
	}
}
//#endregion
export { g as mount, h as renderChat };
