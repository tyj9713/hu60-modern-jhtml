import { t as e } from "./urls-Bq3RnfMf.js";
import { t } from "./dom-Dhq3QSJF.js";
import { t as n } from "./dialog-CuohRcFc.js";
import { t as r } from "./avatar-f6-FYNKw.js";
import { t as i } from "./user-info-D3tSPs85.js";
import { r as a, t as o } from "./json-CtYJArb0.js";
import { t as s } from "./forms-Dv92BbyG.js";
import { t as c } from "./pagination-Bc186T6L.js";
//#region src/adapters/message.js
function l(e) {
	return String(e.contentHtml ?? e.content ?? "");
}
function u(e = {}, t = "inbox") {
	return {
		kind: t,
		messages: (e.msgList || e.messageList || e.messages || []).map((e) => {
			let n = t === "outbox", r = n ? "to" : "by", o = i({
				uid: n ? e.touid : e.byuid,
				uinfo: n ? e.toUinfo : e.byUinfo,
				_u_name: e[`${r}_u_name`] || e[`${r}name`],
				_u_avatar: e[`${r}_u_avatar`]
			});
			return {
				id: a(e.id),
				peerUid: o.uid,
				peerName: o.name,
				peerAvatar: o.avatar,
				contentHtml: l(e),
				createdAt: e.ctime || e.createdAt || "",
				unread: !a(e.isread),
				direction: n ? "outgoing" : "incoming"
			};
		}),
		pagination: o(e, `msg.index.${t}.all.jhtml`),
		filters: {
			readState: String(e.readState || e.filter || "all"),
			showBot: !!e.showBot
		},
		actionToken: String(e.actionToken || e.token || ""),
		notice: String(e.notice || e.error || "")
	};
}
function d(e = {}, t = 0) {
	let n = (e.msgList || e.messageList || e.messages || []).map((e) => {
		let n = a(e.byuid) === a(t), r = n ? "to" : "by", o = i({
			uid: n ? e.touid : e.byuid,
			uinfo: n ? e.toUinfo : e.byUinfo,
			_u_name: e[`${r}_u_name`] || e[`${r}name`],
			_u_avatar: e[`${r}_u_avatar`]
		});
		return {
			id: a(e.id),
			peerUid: a(n ? e.touid : e.byuid),
			peerName: o.name,
			peerAvatar: o.avatar,
			contentHtml: l(e),
			createdAt: e.ctime || e.createdAt || "",
			unread: !a(e.isread),
			direction: n ? "outgoing" : "incoming"
		};
	}), r = n[0] || {};
	return {
		kind: "chat",
		messages: n,
		peer: {
			uid: a(e.peer?.uid ?? r.peerUid),
			name: String(e.peer?.name || r.peerName || "对方"),
			avatar: String(e.peer?.avatar || r.peerAvatar || "")
		},
		pagination: o(e, "msg.index.chat.jhtml"),
		actionToken: String(e.actionToken || e.token || "")
	};
}
//#endregion
//#region src/pages/messages.js
var f = [
	["收件箱", "msg.index.inbox.all.jhtml"],
	["未读", "msg.index.inbox.no.jhtml"],
	["已读", "msg.index.inbox.yes.jhtml"],
	["发件箱", "msg.index.outbox.all.jhtml"],
	["@消息", "msg.index.@.all.jhtml"],
	["发信", "msg.index.send.jhtml"]
];
function p(e) {
	let t = document.createElement("template");
	return t.innerHTML = e, t.content.querySelectorAll("script,object,embed").forEach((e) => e.remove()), t.content;
}
function m(e, n = !1) {
	let i = t("div", { class: "hm-message-content" });
	return i.append(p(e.contentHtml)), t("article", { class: `hm-message is-${e.direction}${e.unread ? " is-unread" : ""}` }, [r({
		name: e.peerName || "对方",
		avatar: e.peerAvatar || ""
	}, 38), t("div", { class: "hm-message-main" }, [t("div", { class: "hm-message-meta" }, [
		t("strong", {}, e.direction === "outgoing" ? `发给 ${e.peerName || "对方"}` : e.peerName || "对方"),
		e.unread ? t("span", {}, "未读") : null,
		e.createdAt ? t("time", {}, e.createdAt) : null
	]), n ? i : t("a", {
		class: "hm-message-link",
		href: `msg.index.view.${e.id}.jhtml`
	}, i)])]);
}
function h(e) {
	return t("div", { class: "hm-message-composer" }, [t("form", {
		class: "hm-form",
		action: `msg.index.send.${e.peer.uid}.json`,
		method: "post"
	}, [t("label", { class: "hm-form-field" }, [t("span", {}, `回复 ${e.peer.name}`), t("textarea", {
		class: "hm-form-control",
		name: "content",
		required: !0
	})]), t("div", { class: "hm-form-actions" }, [t("button", {
		class: "hm-button is-primary",
		type: "submit",
		name: "go",
		value: "回复"
	}, "回复")])])]);
}
function g(e, n = {}) {
	let r = e.kind === "chat";
	return t("section", { class: "hm-panel hm-messages-page" }, [
		t("header", { class: "hm-page-head" }, [t("div", {}, [t("span", { class: "hm-kicker" }, r ? "CONVERSATION" : "MESSAGES"), t("h1", {}, r ? `与 ${e.peer.name} 的对话` : "站内消息")]), t("a", {
			class: "hm-button is-primary",
			href: "msg.index.send.jhtml"
		}, "写内信")]),
		t("nav", {
			class: "hm-tabs",
			"aria-label": "消息分类"
		}, f.map(([e, n]) => t("a", { href: n }, e))),
		e.notice ? t("p", { class: "hm-notice" }, e.notice) : null,
		t("div", { class: `hm-message-list${r ? " is-chat" : ""}` }, e.messages.length ? e.messages.map((e) => m(e, r)) : t("p", { class: "hm-empty" }, "这里还没有消息")),
		c(e.pagination),
		r && n.mountEditor ? h(e) : null
	]);
}
async function _(e, t, { confirm: r = n } = {}) {
	return await r({
		title: "清空全部收件箱？",
		message: "已读和未读内信都会永久删除，此操作不可恢复。",
		confirmText: "确认清空",
		danger: !0
	}) ? (await e.request("msg.index.inbox.all.json", {
		method: "POST",
		headers: { "content-type": "application/x-www-form-urlencoded;charset=UTF-8" },
		body: new URLSearchParams({
			clean: "msg",
			actionToken: t.actionToken,
			action: "清空收件箱"
		})
	}), !0) : !1;
}
async function v({ route: n, client: r, shell: i, services: a = {} }) {
	let o = await r.json(e({
		...n,
		hash: ""
	}, "json", { _uinfo: "uid,name,avatar" })), c = n.ext[0] || "inbox", l = c === "chat" ? d(o, o._myself?.uid || o.userInfo?.uid || 0) : u(o, c === "outbox" ? "outbox" : c === "@" ? "at" : "inbox");
	i.setTitle(c === "chat" ? `与 ${l.peer.name} 的对话` : "站内消息");
	let f = g(l, a);
	i.setMain(f), i.setSidebar(t("div", { class: "hm-side-stack" }));
	let p = f.querySelector(".hm-message-composer form"), m = p?.querySelector("textarea[name=\"content\"]");
	if (p && m && a.mountEditor) {
		let e = await a.mountEditor({
			form: p,
			textarea: m,
			routeKey: "msg.index.chat",
			targetId: String(l.peer.uid),
			previewUrl: p.getAttribute("action"),
			services: {
				...a,
				client: r
			}
		});
		r.request && s(p, {
			client: r,
			controller: e,
			toast: a.toast
		});
	}
}
//#endregion
export { v as mount, g as renderMessages, _ as requestClearInbox };
