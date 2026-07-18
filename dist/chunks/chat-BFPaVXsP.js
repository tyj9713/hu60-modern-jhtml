import { t as e } from "./urls-Bq3RnfMf.js";
import { t } from "./dom-Dhq3QSJF.js";
import { t as n } from "./avatar-f6-FYNKw.js";
import { r, t as i } from "./json-COYDUIwt.js";
import { t as a } from "./content-C2iR-miq.js";
import { t as o } from "./forms-Dv92BbyG.js";
import { t as s } from "./pagination-Bc186T6L.js";
//#region src/adapters/chat.js
function c(e = {}) {
	return {
		mode: "rooms",
		rooms: (e.roomList || e.rooms || []).map((e) => ({
			name: String(e.name || e.room || ""),
			count: r(e.count ?? e.online),
			description: String(e.description || "")
		})),
		showBot: !!r(e.showBot),
		actionToken: String(e.actionToken || e.token || ""),
		notice: String(e.notice || e.error || "")
	};
}
function l(e = {}) {
	let t = String(e.roomName || e.chatRomName || e.room || "聊天室");
	return {
		mode: "messages",
		room: t,
		messages: (e.chatList || e.messages || []).map((e) => ({
			id: r(e.id ?? e.lid),
			floor: r(e.lid ?? e.floor),
			uid: r(e.uid),
			author: e.uinfo || {},
			avatar: String(e.uinfo?.avatar || e.avatar || ""),
			contentHtml: String(e.contentHtml ?? e.content ?? ""),
			createdAt: e.ctime || e.createdAt || "",
			canDelete: !!(e.canDel ?? e.canDelete),
			canViewSource: !!(e.canViewSource ?? e.canSource)
		})),
		showBot: !!r(e.showBot),
		pagination: i(e, `addin.chat.${encodeURIComponent(t)}.jhtml`),
		actionToken: String(e.actionToken || e.token || ""),
		canPost: e.canPost !== !1,
		notice: String(e.notice || e.error || "")
	};
}
//#endregion
//#region src/pages/chat.js
function u(e) {
	let t = document.createElement("template");
	return t.innerHTML = e, t.content.querySelectorAll("script,object,embed").forEach((e) => e.remove()), t.content;
}
function d(e) {
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
function f(e) {
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
function p(e, r) {
	let i = t("div", { class: "hm-chat-messages" }, e.messages.map((e) => {
		let r = t("div", { class: "hm-chat-content" });
		return r.append(u(e.contentHtml)), a(r), t("article", {
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
		s(e.pagination),
		e.canPost && r.mountEditor ? f(e) : null
	]);
}
function m(e, t = {}) {
	return e.mode === "rooms" ? d(e) : p(e, t);
}
async function h({ route: n, client: r, shell: i, services: a = {} }) {
	let s = await r.json(e({
		...n,
		hash: ""
	}, "json", { _uinfo: "uid,name,avatar" })), u = n.ext.length || s.chatList ? l(s) : c(s);
	i.setTitle(u.mode === "rooms" ? "公共聊天室" : u.room);
	let d = m(u, a);
	i.setMain(d), i.setSidebar(t("div", { class: "hm-side-stack" }));
	let f = d.querySelector(".hm-chat-composer form"), p = f?.querySelector("textarea[name=\"content\"]");
	if (f && p && a.mountEditor) {
		let e = await a.mountEditor({
			form: f,
			textarea: p,
			routeKey: "addin.chat",
			targetId: u.room,
			previewUrl: f.getAttribute("action"),
			services: {
				...a,
				client: r
			}
		});
		r.request && o(f, {
			client: r,
			controller: e,
			toast: a.toast
		});
	}
}
//#endregion
export { h as mount, m as renderChat };
