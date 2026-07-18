import { t as e } from "./urls-Bq3RnfMf.js";
import { t } from "./dom-Dhq3QSJF.js";
import { t as n } from "./avatar-f6-FYNKw.js";
import { r } from "./json-COYDUIwt.js";
//#region src/adapters/user.js
var i = [
	["修改资料", "user.chinfo.html"],
	["修改头像", "user.avatar.html"],
	["修改用户名", "user.chname.html"],
	["修改密码", "user.chpwd.html"],
	["收藏主题", "bbs.myfavorite.jhtml"],
	["关注与屏蔽", "user.relationship.follow.jhtml"],
	["微信通知", "user.wechat.html"],
	["网页插件", "addin.webplug.jhtml"]
];
function a(e = {}) {
	let t = e.uinfo || e.userInfo || e.user || e._uinfo || {}, n = e.relationship || {};
	return {
		uid: r(t.uid ?? t.id),
		name: String(t.name || "用户"),
		avatar: String(t.avatar || ""),
		signature: String(t.signature || t.sign || ""),
		contact: String(t.contact || t.email || ""),
		registeredAt: t.regTime || t.ctime || t.registeredAt || "",
		access: r(t.access),
		labels: Array.isArray(t.labels) ? t.labels : [t.title].filter(Boolean),
		relationship: {
			followed: !!(n.followed ?? e.followed),
			blocked: !!(n.blocked ?? e.blocked),
			noDisturb: !!(n.noDisturb ?? e.noDisturb)
		},
		isSelf: !!(e.isSelf ?? e.self),
		stats: {
			topics: r(e.topicCount),
			replies: r(e.replyCount)
		},
		settings: i.map(([e, t]) => ({
			label: e,
			href: t
		}))
	};
}
//#endregion
//#region src/pages/user.js
function o(e) {
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
async function s({ route: n, client: r, shell: i }) {
	let s = a(await r.json(e({
		...n,
		hash: ""
	}, "json")));
	i.setTitle(s.name), i.setMain(o(s)), i.setSidebar(t("div", { class: "hm-side-stack" }));
}
//#endregion
export { s as mount, o as renderUserPage };
