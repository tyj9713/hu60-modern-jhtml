import { t as e } from "./urls-Bq3RnfMf.js";
import { t } from "./dom-Dhq3QSJF.js";
import { t as n } from "./dialog-CuohRcFc.js";
import { r, t as i } from "./json-COYDUIwt.js";
import { t as a } from "./forms-Dv92BbyG.js";
import { t as o } from "./pagination-Bc186T6L.js";
//#region src/adapters/message.js
function s(e) {
	return String(e.contentHtml ?? e.content ?? "");
}
function c(e = {}, t = "inbox") {
	return {
		kind: t,
		messages: (e.msgList || e.messageList || e.messages || []).map((e) => {
			let n = t === "outbox";
			return {
				id: r(e.id),
				peerUid: r(n ? e.touid : e.byuid),
				peerName: String(n ? e.toUinfo?.name || e.toname || "" : e.byUinfo?.name || e.byname || ""),
				contentHtml: s(e),
				createdAt: e.ctime || e.createdAt || "",
				unread: !r(e.isread),
				direction: n ? "outgoing" : "incoming"
			};
		}),
		pagination: i(e, `msg.index.${t}.all.jhtml`),
		filters: {
			readState: String(e.readState || e.filter || "all"),
			showBot: !!e.showBot
		},
		actionToken: String(e.actionToken || e.token || ""),
		notice: String(e.notice || e.error || "")
	};
}
function l(e = {}, t = 0) {
	let n = (e.msgList || e.messageList || e.messages || []).map((e) => {
		let n = r(e.byuid) === r(t), i = n ? e.toUinfo || { name: e.toname } : e.byUinfo || { name: e.byname };
		return {
			id: r(e.id),
			peerUid: r(n ? e.touid : e.byuid),
			peerName: String(i?.name || ""),
			peerAvatar: String(i?.avatar || ""),
			contentHtml: s(e),
			createdAt: e.ctime || e.createdAt || "",
			unread: !r(e.isread),
			direction: n ? "outgoing" : "incoming"
		};
	}), a = n[0] || {};
	return {
		kind: "chat",
		messages: n,
		peer: {
			uid: r(e.peer?.uid ?? a.peerUid),
			name: String(e.peer?.name || a.peerName || "对方"),
			avatar: String(e.peer?.avatar || a.peerAvatar || "")
		},
		pagination: i(e, "msg.index.chat.jhtml"),
		actionToken: String(e.actionToken || e.token || "")
	};
}
//#endregion
//#region src/pages/messages.js
var u = [
	["收件箱", "msg.index.inbox.all.jhtml"],
	["未读", "msg.index.inbox.no.jhtml"],
	["已读", "msg.index.inbox.yes.jhtml"],
	["发件箱", "msg.index.outbox.all.jhtml"],
	["@消息", "msg.index.@.all.jhtml"],
	["发信", "msg.index.send.jhtml"]
];
function d(e) {
	let t = document.createElement("template");
	return t.innerHTML = e, t.content.querySelectorAll("script,object,embed").forEach((e) => e.remove()), t.content;
}
function f(e, n = !1) {
	let r = t("div", { class: "hm-message-content" });
	return r.append(d(e.contentHtml)), t("article", { class: `hm-message is-${e.direction}${e.unread ? " is-unread" : ""}` }, [t("div", { class: "hm-message-meta" }, [
		t("strong", {}, e.direction === "outgoing" ? `发给 ${e.peerName || "对方"}` : e.peerName || "对方"),
		e.unread ? t("span", {}, "未读") : null,
		e.createdAt ? t("time", {}, e.createdAt) : null
	]), n ? r : t("a", {
		class: "hm-message-link",
		href: `msg.index.view.${e.id}.jhtml`
	}, r)]);
}
function p(e) {
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
function m(e, n = {}) {
	let r = e.kind === "chat";
	return t("section", { class: "hm-panel hm-messages-page" }, [
		t("header", { class: "hm-page-head" }, [t("div", {}, [t("span", { class: "hm-kicker" }, r ? "CONVERSATION" : "MESSAGES"), t("h1", {}, r ? `与 ${e.peer.name} 的对话` : "站内消息")]), t("a", {
			class: "hm-button is-primary",
			href: "msg.index.send.jhtml"
		}, "写内信")]),
		t("nav", {
			class: "hm-tabs",
			"aria-label": "消息分类"
		}, u.map(([e, n]) => t("a", { href: n }, e))),
		e.notice ? t("p", { class: "hm-notice" }, e.notice) : null,
		t("div", { class: `hm-message-list${r ? " is-chat" : ""}` }, e.messages.length ? e.messages.map((e) => f(e, r)) : t("p", { class: "hm-empty" }, "这里还没有消息")),
		o(e.pagination),
		r && n.mountEditor ? p(e) : null
	]);
}
async function h(e, t, { confirm: r = n } = {}) {
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
async function g({ route: n, client: r, shell: i, services: o = {} }) {
	let s = await r.json(e({
		...n,
		hash: ""
	}, "json")), u = n.ext[0] || "inbox", d = u === "chat" ? l(s, s._myself?.uid || s.userInfo?.uid || 0) : c(s, u === "outbox" ? "outbox" : u === "@" ? "at" : "inbox");
	i.setTitle(u === "chat" ? `与 ${d.peer.name} 的对话` : "站内消息");
	let f = m(d, o);
	i.setMain(f), i.setSidebar(t("div", { class: "hm-side-stack" }));
	let p = f.querySelector(".hm-message-composer form"), h = p?.querySelector("textarea[name=\"content\"]");
	if (p && h && o.mountEditor) {
		let e = await o.mountEditor({
			form: p,
			textarea: h,
			routeKey: "msg.index.chat",
			targetId: String(d.peer.uid),
			previewUrl: p.getAttribute("action"),
			services: {
				...o,
				client: r
			}
		});
		r.request && a(p, {
			client: r,
			controller: e,
			toast: o.toast
		});
	}
}
//#endregion
export { g as mount, m as renderMessages, h as requestClearInbox };
