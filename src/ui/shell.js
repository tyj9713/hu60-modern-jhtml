import { renderAvatar } from "./avatar.js";
import { el } from "./dom.js";

const primaryNavigation = [
  ["社区", "index.index.jhtml", "index"],
  ["精华", "bbs.forum.0.1.1.jhtml", "bbs"],
  ["聊天室", "addin.chat.jhtml", "addin"],
  ["工具", "tools.coder.jhtml", "tools"]
];

const bottomNavigation = [
  ["首页", "index.index.jhtml", "⌂"],
  ["版块", "bbs.forum.0.jhtml", "▦"],
  ["发布", "bbs.newtopic.0.jhtml", "＋"],
  ["聊天", "addin.chat.jhtml", "◇"],
  ["我的", "user.index.jhtml", "○"]
];

function navigationLink([label, href, mark], route, compact = false) {
  const active =
    route.cid === mark ||
    (mark === "search" && route.cid === "bbs" && route.pid === "search");
  return el(
    "a",
    {
      class: compact ? "hm-bottom-link hm-touch-target" : "hm-nav-link",
      href,
      "aria-current": active ? "page" : null
    },
    compact
      ? [
          el("span", { "aria-hidden": "true" }, mark),
          el("small", {}, label)
        ]
      : label
  );
}

export function createShell({ route, user }) {
  const main = el("main", { class: "hm-main", id: "hm-main" });
  const sidebar = el("aside", {
    class: "hm-sidebar",
    "aria-label": "用户与站点信息"
  });
  const categoryBar = el(
    "nav",
    { class: "hm-category-bar", "aria-label": "论坛快捷入口" },
    [
      ["全部主题", "bbs.forum.0.jhtml"],
      ["技术交流", "bbs.forum.170.jhtml"],
      ["精华", "bbs.forum.0.1.1.jhtml"],
      ["收藏", "bbs.myfavorite.jhtml"]
    ].map(([label, href]) =>
      el("a", { class: "hm-category-link", href }, label)
    )
  );
  const accountLink = el("a", {
    class: "hm-account hm-touch-target",
    href: "user.index.jhtml"
  });
  const messageLink = el(
    "a",
    {
      class: "hm-icon-link hm-touch-target",
      href: "msg.index.inbox.no.jhtml",
      "aria-label": "未读消息"
    },
    "◇"
  );
  const renderAccount = (nextUser) => {
    const current = nextUser || { name: "游客", avatar: "" };
    const notificationCount =
      Number(current.newMsg || 0) + Number(current.newAtInfo || 0);
    messageLink.replaceChildren(
      document.createTextNode("◇"),
      notificationCount
        ? el(
            "span",
            { class: "hm-badge" },
            notificationCount > 99 ? "99+" : notificationCount
          )
        : null
    );
    accountLink.replaceChildren(
      renderAvatar(current, 34),
      el("span", { class: "hm-account-copy" }, [
        el("strong", {}, current.name || "游客"),
        el("small", {}, nextUser ? "个人中心" : "登录 / 注册")
      ])
    );
  };
  renderAccount(user);
  const header = el("header", { class: "hm-header" }, [
    el("div", { class: "hm-header-inner" }, [
      el("a", { class: "hm-brand", href: "index.index.jhtml" }, [
        el("span", { class: "hm-brand-mark", "aria-hidden": "true" }, "H"),
        el("span", { class: "hm-brand-copy" }, [
          el("strong", {}, "hu60")
        ])
      ]),
      el(
        "nav",
        { class: "hm-primary-nav", "aria-label": "主导航" },
        primaryNavigation.map((item) => navigationLink(item, route))
      ),
      el("div", { class: "hm-header-actions" }, [
        el(
          "a",
          {
            class: "hm-icon-link hm-touch-target",
            href: "bbs.search.jhtml",
            "aria-label": "搜索"
          },
          "⌕"
        ),
        messageLink,
        accountLink
      ])
    ]),
    categoryBar
  ]);
  const bottomNav = el(
    "nav",
    { class: "hm-bottom-nav", "aria-label": "移动端导航" },
    bottomNavigation.map((item) => navigationLink(item, route, true))
  );
  const root = el("div", { class: "hm-app" }, [
    el("a", { class: "hm-skip-link", href: "#hm-main" }, "跳到正文"),
    header,
    el("div", { class: "hm-layout" }, [main, sidebar]),
    bottomNav
  ]);

  document.head.append(
    ...document.body.querySelectorAll('link[rel="stylesheet"]')
  );
  document.body.replaceChildren(root);

  return {
    root,
    header,
    categoryBar,
    main,
    sidebar,
    bottomNav,
    setTitle(title) {
      document.title = `${title} · hu60`;
    },
    setMain(node) {
      main.replaceChildren(node);
    },
    setSidebar(node) {
      sidebar.replaceChildren(node);
    },
    setUser(nextUser) {
      renderAccount(nextUser);
    }
  };
}
