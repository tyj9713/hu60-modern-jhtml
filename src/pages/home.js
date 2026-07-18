import { loadHome } from "../adapters/home.js";
import { el } from "../ui/dom.js";
import { renderAvatar } from "../ui/avatar.js";
import { renderPagination } from "../ui/pagination.js";

function topicRow(topic) {
  return el("article", { class: "hm-topic-row" }, [
    renderAvatar({ ...topic.author, avatar: topic.avatar }, 42),
    el("div", { class: "hm-topic-copy" }, [
      el(
        "a",
        {
          class: "hm-topic-title",
          href: `bbs.topic.${topic.id}.jhtml`
        },
        topic.title || "无标题"
      ),
      el("div", { class: "hm-topic-meta" }, [
        el("span", {}, topic.author?.name || "匿名"),
        topic.forumName ? el("span", {}, topic.forumName) : null,
        topic.essence ? el("em", {}, "精华") : null,
        topic.locked ? el("em", {}, "已锁定") : null
      ])
    ]),
    el("div", { class: "hm-topic-stats" }, [
      el("strong", {}, topic.replies),
      el("small", {}, `${topic.views} 阅读`)
    ])
  ]);
}

function sideCard(title, children, className = "") {
  return el("section", { class: `hm-side-card ${className}`.trim() }, [
    el("h2", {}, title),
    el("div", { class: "hm-side-card-body" }, children)
  ]);
}

function safeInlineContent(html) {
  const template = document.createElement("template");
  template.innerHTML = String(html || "");
  template.content
    .querySelectorAll("script,style,object,embed,iframe,base,meta")
    .forEach((node) => node.remove());
  for (const node of template.content.querySelectorAll("*")) {
    for (const attribute of [...node.attributes]) {
      if (/^on/i.test(attribute.name)) node.removeAttribute(attribute.name);
    }
  }
  return template.content;
}

function latestChatSummary(chat) {
  const paragraph = el("p", {}, `${chat.name || "用户"}：`);
  paragraph.append(safeInlineContent(chat.content));
  return paragraph;
}

export function renderHome(model) {
  const main = el("section", { class: "hm-panel" }, [
    el("header", { class: "hm-page-head" }, [
      el("div", {}, [
        el("span", { class: "hm-kicker" }, "TECHNICAL COMMONS"),
        el("h1", {}, "最新讨论")
      ]),
      el("div", { class: "hm-page-actions" }, [
        el(
          "a",
          { class: "hm-button is-ghost", href: "bbs.search.jhtml" },
          "搜索"
        ),
        el(
          "a",
          { class: "hm-button is-primary", href: "bbs.newtopic.0.jhtml" },
          "＋ 发帖"
        )
      ])
    ]),
    el("nav", { class: "hm-tabs", "aria-label": "主题筛选" }, [
      el("a", { class: "is-active", href: "index.index.jhtml" }, "最新"),
      el("a", { href: "bbs.forum.0.1.1.jhtml" }, "精华"),
      el("a", { href: "bbs.search.jhtml" }, "搜索")
    ]),
    el(
      "div",
      { class: "hm-topic-list" },
      model.topics.length
        ? model.topics.map(topicRow)
        : el("p", { class: "hm-empty" }, "暂时没有新主题")
    ),
    renderPagination(model.pagination)
  ]);

  const sidebar = el("div", { class: "hm-side-stack" }, [
    model.user
      ? sideCard(
          "我的社区",
          [
            el("div", { class: "hm-user-summary" }, [
              renderAvatar(model.user, 48),
              el("div", {}, [
                el("strong", {}, model.user.name || "用户"),
                el(
                  "span",
                  { class: "hm-user-note" },
                  model.user.signature || "欢迎回到技术社区"
                )
              ])
            ]),
            el("div", { class: "hm-profile-actions hm-home-user-actions" }, [
              el("a", { href: "user.index.jhtml" }, "个人中心"),
              el("a", { href: "bbs.myfavorite.jhtml" }, "我的收藏"),
              el("a", { href: "msg.index.inbox.all.jhtml" }, [
                el("span", {}, "站内消息"),
                Number(model.user.newMsg || 0)
                  ? el("em", {}, model.user.newMsg)
                  : null
              ]),
              el("a", { href: "bbs.newtopic.0.jhtml" }, "发布主题")
            ])
          ],
          "is-account"
        )
      : sideCard(
          "加入讨论",
          [
            el("p", {}, "登录后可发帖、收藏和参与聊天室。"),
            el("a", { href: "user.login.html" }, "登录 / 注册 →")
          ],
          "is-account"
        ),
    model.latestChat
      ? sideCard("聊天室最新", [
          el(
            "a",
            {
              class: "hm-chat-preview",
              href: `addin.chat.${encodeURIComponent(
                model.latestChat.room || ""
              )}.jhtml`
            },
            [
              renderAvatar(model.latestChat, 34),
              el("div", {}, [
                el("strong", {}, model.latestChat.room || "聊天室"),
                latestChatSummary(model.latestChat)
              ])
            ]
          )
        ])
      : null,
    sideCard(
      "社区导航",
      el("div", { class: "hm-community-links" }, [
        el("a", { href: "bbs.forum.0.jhtml" }, [
          el("span", {}, "浏览全部版块"),
          el("span", { "aria-hidden": "true" }, "›")
        ]),
        el("a", { href: "bbs.search.jhtml" }, [
          el("span", {}, "搜索全部内容"),
          el("span", { "aria-hidden": "true" }, "›")
        ]),
        el("a", { href: "addin.chat.jhtml" }, [
          el("span", {}, "进入公共聊天室"),
          el("span", { "aria-hidden": "true" }, "›")
        ])
      ]),
      "is-community"
    ),
    model.friendLinks?.length
      ? sideCard(
          "虎友网站",
          el(
            "div",
            { class: "hm-friend-links" },
            model.friendLinks.map((item) =>
              el("a", { href: item.href }, [
                renderAvatar(
                  { name: item.name, avatar: item.avatar },
                  30
                ),
                el("span", {}, item.name)
              ])
            )
          )
        )
      : null
  ]);

  return { main, sidebar };
}

export async function mount({ route, client, shell }) {
  const view = renderHome(await loadHome(client, route));
  shell.setTitle("首页");
  shell.setMain(view.main);
  shell.setSidebar(view.sidebar);
  if (view.user) shell.setUser?.(view.user);
}
