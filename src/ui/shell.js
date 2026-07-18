import { renderAvatar } from "./avatar.js";
import { el } from "./dom.js";

const primaryNavigation = [
  ["首页", "index.index.jhtml", "index"],
  ["版块", "bbs.forum.0.jhtml", "bbs"],
  ["搜索", "bbs.search.jhtml", "search"],
  ["聊天", "addin.chat.jhtml", "addin"]
];

const bottomNavigation = [
  ["首页", "index.index.jhtml", "⌂"],
  ["版块", "bbs.forum.0.jhtml", "▦"],
  ["发布", "bbs.newtopic.0.html", "＋"],
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
  const account = user || { name: "游客", avatar: "" };
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
  const header = el("header", { class: "hm-header" }, [
    el("div", { class: "hm-header-inner" }, [
      el("a", { class: "hm-brand", href: "index.index.jhtml" }, [
        el("span", { class: "hm-brand-mark", "aria-hidden": "true" }, "虎"),
        el("span", { class: "hm-brand-copy" }, [
          el("strong", {}, "hu60"),
          el("small", {}, "技术社区")
        ])
      ]),
      el(
        "nav",
        { class: "hm-primary-nav", "aria-label": "主导航" },
        primaryNavigation.map((item) => navigationLink(item, route))
      ),
      el("a", { class: "hm-account hm-touch-target", href: "user.index.jhtml" }, [
        renderAvatar(account, 34),
        el("span", { class: "hm-account-copy" }, [
          el("strong", {}, account.name || "游客"),
          el("small", {}, user ? "个人中心" : "登录 / 注册")
        ])
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
    }
  };
}
