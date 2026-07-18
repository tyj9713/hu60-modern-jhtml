import { t as e } from "./urls-Bq3RnfMf.js";
import { t } from "./dom-Dhq3QSJF.js";
import { t as n } from "./avatar-f6-FYNKw.js";
import { t as r } from "./user-info-D3tSPs85.js";
import { r as i } from "./json-CtYJArb0.js";
//#region src/adapters/user.js
var a = [
	["修改资料", "user.chinfo.jhtml"],
	["修改头像", "user.avatar.jhtml"],
	["修改用户名", "user.chname.jhtml"],
	["修改密码", "user.chpwd.jhtml"],
	["收藏主题", "bbs.myfavorite.jhtml"],
	["关注与屏蔽", "user.relationship.follow.jhtml"],
	["微信通知", "user.wechat.jhtml"],
	["网页插件", "addin.webplug.jhtml"]
];
function o(e = {}) {
	let t = r(e), n = e.relationship || {};
	return {
		uid: i(t.uid ?? t.id),
		name: String(t.name || "用户"),
		avatar: String(t.avatar || ""),
		signature: String(t.signature || t.sign || ""),
		contact: String(t.contact || t.email || ""),
		registeredAt: t.regTime || t.regtime || t.ctime || t.registeredAt || "",
		access: i(t.access),
		labels: Array.isArray(t.labels) ? t.labels : [t.title].filter(Boolean),
		relationship: {
			followed: !!(n.followed ?? e.followed ?? e.isFollow),
			blocked: !!(n.blocked ?? e.blocked ?? e.isBlock),
			noDisturb: !!(n.noDisturb ?? e.noDisturb)
		},
		isSelf: !!(e.isSelf ?? e.self),
		stats: {
			topics: i(e.topicCount),
			replies: i(e.replyCount)
		},
		settings: a.map(([e, t]) => ({
			label: e,
			href: t
		}))
	};
}
//#endregion
//#region src/pages/user.js
function s(e) {
	return t("section", { class: "hm-panel hm-profile-page" }, [
		t("div", { class: "hm-profile-hero" }, [n(e, 88), t("div", { class: "hm-profile-copy" }, [
			t("span", { class: "hm-kicker" }, e.isSelf ? "MY PROFILE" : "MEMBER"),
			t("h1", {}, e.name),
			e.signature ? t("p", { class: "hm-profile-signature" }, e.signature) : t("p", { class: "hm-profile-signature" }, "这个人还没有留下签名。"),
			t("div", { class: "hm-profile-actions" }, [t("a", {
				class: "hm-button is-primary",
				href: `msg.index.send.${e.uid}.jhtml`
			}, "发送内信"), t("a", {
				class: "hm-button is-ghost",
				href: `msg.index.chat.${e.uid}.jhtml`
			}, "聊天模式")])
		])]),
		t("dl", { class: "hm-profile-facts" }, [
			t("div", {}, [t("dt", {}, "联系方式"), t("dd", {}, e.contact || "未公开")]),
			t("div", {}, [t("dt", {}, "注册时间"), t("dd", {}, e.registeredAt || "未知")]),
			t("div", {}, [t("dt", {}, "关系状态"), t("dd", {}, e.relationship.followed ? "已关注" : e.relationship.blocked ? "已屏蔽" : "普通")])
		]),
		e.isSelf ? t("section", { class: "hm-settings-section" }, [t("h2", {}, "个人设置"), t("div", { class: "hm-settings-grid" }, e.settings.map((e) => t("a", { href: e.href }, [t("strong", {}, e.label), t("span", { "aria-hidden": "true" }, "→")])))]) : null
	]);
}
async function c({ route: n, client: r, shell: i }) {
	let a = await r.json(e({
		...n,
		hash: ""
	}, "json", { _uinfo: "uid,name,avatar,signature,contact" })), c = o({
		...a,
		isSelf: n.pid === "index" || a.isSelf
	});
	i.setTitle(c.name), i.setMain(s(c)), i.setSidebar(t("div", { class: "hm-side-stack" }));
}
//#endregion
export { c as mount, s as renderUserPage };
