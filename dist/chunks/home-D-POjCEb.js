import { t as e } from "./urls-Bq3RnfMf.js";
import { t } from "./dom-Dhq3QSJF.js";
import { t as n } from "./avatar-f6-FYNKw.js";
import { n as r, t as i } from "./json-COYDUIwt.js";
import { t as a } from "./pagination-Bc186T6L.js";
//#region src/adapters/home.js
function o(e = {}) {
	return {
		topics: (e.newTopicList || e.topicList || []).map(r),
		pagination: i(e, "index.index.jhtml"),
		currentPage: Number(e.currPage || 1),
		hasNextPage: !!e.hasNextPage,
		latestChat: e._myself?.newChats?.[0] || null,
		user: e.userInfo || e._uinfo || e._myself?.user || null,
		forums: e.forumList || e.forums || [],
		friendLinks: [],
		friendLinksError: ""
	};
}
function s(e) {
	return [...new DOMParser().parseFromString(e, "text/html").querySelectorAll("#friend_links .friend-link-item")].map((e) => {
		let t = e.querySelector("a:last-of-type");
		return {
			name: t?.textContent?.trim() || "",
			href: t?.getAttribute("href") || "",
			avatar: e.querySelector("img")?.getAttribute("src") || ""
		};
	}).filter((e) => e.name && e.href);
}
async function c(t, n) {
	let r = e({
		...n,
		hash: ""
	}, "json", {
		_uinfo: "uid,name,avatar",
		_myself: "newMsg,newAtInfo,newChats"
	}), i = o(await t.json(r));
	try {
		i.friendLinks = s(await t.html("index.index.html"));
	} catch (e) {
		i.friendLinksError = e?.message || String(e);
	}
	return i;
}
//#endregion
//#region src/pages/home.js
function l(e) {
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
function u(e, n, r = "") {
	return t("section", { class: `hm-side-card ${r}`.trim() }, [t("h2", {}, e), t("div", { class: "hm-side-card-body" }, n)]);
}
function d(e) {
	return {
		main: t("section", { class: "hm-panel" }, [
			t("header", { class: "hm-page-head" }, [t("div", {}, [t("span", { class: "hm-kicker" }, "TECHNICAL COMMONS"), t("h1", {}, "最新讨论")]), t("a", {
				class: "hm-button is-primary",
				href: "bbs.newtopic.0.html"
			}, "＋ 发布主题")]),
			t("div", { class: "hm-topic-list" }, e.topics.length ? e.topics.map(l) : t("p", { class: "hm-empty" }, "暂时没有新主题")),
			a(e.pagination)
		]),
		sidebar: t("div", { class: "hm-side-stack" }, [
			e.user ? u("我的社区", t("div", { class: "hm-user-summary" }, [n(e.user, 48), t("div", {}, [t("strong", {}, e.user.name || "用户"), t("a", { href: "user.index.jhtml" }, "查看个人中心")])]), "is-account") : u("加入讨论", [t("p", {}, "登录后可发帖、收藏和参与聊天室。"), t("a", { href: "user.login.html" }, "登录 / 注册 →")], "is-account"),
			e.latestChat ? u("聊天室最新", [t("a", {
				class: "hm-chat-preview",
				href: `addin.chat.${encodeURIComponent(e.latestChat.room || "")}.jhtml`
			}, [t("strong", {}, e.latestChat.room || "聊天室"), t("p", {}, `${e.latestChat.name || "用户"}：${e.latestChat.content || ""}`)])]) : null,
			e.friendLinks?.length ? u("虎友网站", t("div", { class: "hm-friend-links" }, e.friendLinks.map((e) => t("a", { href: e.href }, [n({
				name: e.name,
				avatar: e.avatar
			}, 30), t("span", {}, e.name)])))) : null
		])
	};
}
async function f({ route: e, client: t, shell: n }) {
	let r = d(await c(t, e));
	n.setTitle("首页"), n.setMain(r.main), n.setSidebar(r.sidebar);
}
//#endregion
export { f as mount, d as renderHome };
