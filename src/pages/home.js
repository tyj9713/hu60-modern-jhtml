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

export function renderHome(model) {
  const main = el("section", { class: "hm-panel" }, [
    el("header", { class: "hm-page-head" }, [
      el("div", {}, [
        el("span", { class: "hm-kicker" }, "TECHNICAL COMMONS"),
        el("h1", {}, "最新讨论")
      ]),
      el(
        "a",
        { class: "hm-button is-primary", href: "bbs.newtopic.0.html" },
        "＋ 发布主题"
      )
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
          el("div", { class: "hm-user-summary" }, [
            renderAvatar(model.user, 48),
            el("div", {}, [
              el("strong", {}, model.user.name || "用户"),
              el("a", { href: "user.index.jhtml" }, "查看个人中心")
            ])
          ]),
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
              el("strong", {}, model.latestChat.room || "聊天室"),
              el(
                "p",
                {},
                `${model.latestChat.name || "用户"}：${
                  model.latestChat.content || ""
                }`
              )
            ]
          )
        ])
      : null,
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
}
