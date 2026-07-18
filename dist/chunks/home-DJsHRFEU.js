import { t as e } from "./urls-Bq3RnfMf.js";
import { t } from "./dom-Dhq3QSJF.js";
import { t as n } from "./avatar-f6-FYNKw.js";
import { t as r } from "./user-info-D3tSPs85.js";
import { n as i, t as a } from "./json-CtYJArb0.js";
import { t as o } from "./pagination-Bc186T6L.js";
//#region src/adapters/home.js
function s(e = {}) {
	let t = e.userInfo || e._uinfo || e._myself?.user || null, n = e._myself?.newChats?.[0] || null, o = n ? {
		...n,
		...r(n)
	} : null;
	return {
		topics: (e.newTopicList || e.topicList || []).map(i),
		pagination: a(e, "index.index.jhtml"),
		currentPage: Number(e.currPage || 1),
		hasNextPage: !!e.hasNextPage,
		latestChat: o,
		user: t && t.isLogin !== !1 && (t.uid || t.name) ? r(t) : null,
		forums: e.forumList || e.forums || [],
		friendLinks: [],
		friendLinksError: ""
	};
}
function c(e) {
	return [...new DOMParser().parseFromString(e, "text/html").querySelectorAll("#friend_links .friend-link-item")].map((e) => {
		let t = e.querySelector("a:last-of-type");
		return {
			name: t?.textContent?.trim() || "",
			href: t?.getAttribute("href") || "",
			avatar: e.querySelector("img")?.getAttribute("src") || ""
		};
	}).filter((e) => e.name && e.href);
}
async function l(t, n) {
	let r = e({
		...n,
		hash: ""
	}, "json", {
		_uinfo: "uid,name,avatar",
		_myself: "newMsg,newAtInfo,newChats"
	}), i = s(await t.json(r));
	try {
		i.friendLinks = c(await t.html("index.index.html"));
	} catch (e) {
		i.friendLinksError = e?.message || String(e);
	}
	return i;
}
//#endregion
//#region src/pages/home.js
function u(e) {
	return t("article", { class: "hm-topic-row" }, [
		n({
			...e.author,
			avatar: e.avatar
		}, 42),
		t("div", { class: "hm-topic-copy" }, [t("a", {
			class: "hm-topic-title",
			href: `bbs.topic.${e.id}.jhtml`
		}, e.title || "无标题"), t("div", { class: "hm-topic-meta" }, [
			t("span", {}, e.author?.name || "匿名"),
			e.forumName ? t("span", {}, e.forumName) : null,
			e.essence ? t("em", {}, "精华") : null,
			e.locked ? t("em", {}, "已锁定") : null
		])]),
		t("div", { class: "hm-topic-stats" }, [t("strong", {}, e.replies), t("small", {}, `${e.views} 阅读`)])
	]);
}
function d(e, n, r = "") {
	return t("section", { class: `hm-side-card ${r}`.trim() }, [t("h2", {}, e), t("div", { class: "hm-side-card-body" }, n)]);
}
function f(e) {
	let t = document.createElement("template");
	t.innerHTML = String(e || ""), t.content.querySelectorAll("script,style,object,embed,iframe,base,meta").forEach((e) => e.remove());
	for (let e of t.content.querySelectorAll("*")) for (let t of [...e.attributes]) /^on/i.test(t.name) && e.removeAttribute(t.name);
	return t.content;
}
function p(e) {
	let n = t("p", {}, `${e.name || "用户"}：`);
	return n.append(f(e.content)), n;
}
function m(e) {
	return {
		main: t("section", { class: "hm-panel" }, [
			t("header", { class: "hm-page-head" }, [t("div", {}, [t("span", { class: "hm-kicker" }, "TECHNICAL COMMONS"), t("h1", {}, "最新讨论")]), t("div", { class: "hm-page-actions" }, [t("a", {
				class: "hm-button is-ghost",
				href: "bbs.search.jhtml"
			}, "搜索"), t("a", {
				class: "hm-button is-primary",
				href: "bbs.newtopic.0.jhtml"
			}, "＋ 发帖")])]),
			t("nav", {
				class: "hm-tabs",
				"aria-label": "主题筛选"
			}, [
				t("a", {
					class: "is-active",
					href: "index.index.jhtml"
				}, "最新"),
				t("a", { href: "bbs.forum.0.1.1.jhtml" }, "精华"),
				t("a", { href: "bbs.search.jhtml" }, "搜索")
			]),
			t("div", { class: "hm-topic-list" }, e.topics.length ? e.topics.map(u) : t("p", { class: "hm-empty" }, "暂时没有新主题")),
			o(e.pagination)
		]),
		sidebar: t("div", { class: "hm-side-stack" }, [
			e.user ? d("我的社区", [t("div", { class: "hm-user-summary" }, [n(e.user, 48), t("div", {}, [t("strong", {}, e.user.name || "用户"), t("span", { class: "hm-user-note" }, e.user.signature || "欢迎回到技术社区")])]), t("div", { class: "hm-profile-actions hm-home-user-actions" }, [
				t("a", { href: "user.index.jhtml" }, "个人中心"),
				t("a", { href: "bbs.myfavorite.jhtml" }, "我的收藏"),
				t("a", { href: "msg.index.inbox.all.jhtml" }, [t("span", {}, "站内消息"), Number(e.user.newMsg || 0) ? t("em", {}, e.user.newMsg) : null]),
				t("a", { href: "bbs.newtopic.0.jhtml" }, "发布主题")
			])], "is-account") : d("加入讨论", [t("p", {}, "登录后可发帖、收藏和参与聊天室。"), t("a", { href: "user.login.html" }, "登录 / 注册 →")], "is-account"),
			e.latestChat ? d("聊天室最新", [t("a", {
				class: "hm-chat-preview",
				href: `addin.chat.${encodeURIComponent(e.latestChat.room || "")}.jhtml`
			}, [n(e.latestChat, 34), t("div", {}, [t("strong", {}, e.latestChat.room || "聊天室"), p(e.latestChat)])])]) : null,
			d("社区导航", t("div", { class: "hm-community-links" }, [
				t("a", { href: "bbs.forum.0.jhtml" }, [t("span", {}, "浏览全部版块"), t("span", { "aria-hidden": "true" }, "›")]),
				t("a", { href: "bbs.search.jhtml" }, [t("span", {}, "搜索全部内容"), t("span", { "aria-hidden": "true" }, "›")]),
				t("a", { href: "addin.chat.jhtml" }, [t("span", {}, "进入公共聊天室"), t("span", { "aria-hidden": "true" }, "›")])
			]), "is-community"),
			e.friendLinks?.length ? d("虎友网站", t("div", { class: "hm-friend-links" }, e.friendLinks.map((e) => t("a", { href: e.href }, [n({
				name: e.name,
				avatar: e.avatar
			}, 30), t("span", {}, e.name)])))) : null
		])
	};
}
async function h({ route: e, client: t, shell: n }) {
	let r = m(await l(t, e));
	n.setTitle("首页"), n.setMain(r.main), n.setSidebar(r.sidebar), r.user && n.setUser?.(r.user);
}
//#endregion
export { h as mount, m as renderHome };
