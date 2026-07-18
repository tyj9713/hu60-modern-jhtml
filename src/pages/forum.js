import { normalizeForum } from "../adapters/forum.js";
import { toBidUrl } from "../core/urls.js";
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
        topic.essence ? el("em", {}, "精华") : null,
        topic.review ? el("em", {}, "待审核") : null
      ])
    ]),
    el("div", { class: "hm-topic-stats" }, [
      el("strong", {}, topic.replies),
      el("small", {}, `${topic.views} 阅读`)
    ])
  ]);
}

export function renderForum(model) {
  return el("section", { class: "hm-panel" }, [
    el("header", { class: "hm-page-head" }, [
      el("div", {}, [
        el("span", { class: "hm-kicker" }, "FORUM"),
        el("h1", {}, model.title),
        model.description ? el("p", {}, model.description) : null
      ]),
      el(
        "a",
        {
          class: "hm-button is-primary",
          href: `bbs.newtopic.${model.id}.jhtml`
        },
        "＋ 发帖"
      )
    ]),
    model.childForums.length
      ? el(
          "div",
          { class: "hm-forum-grid" },
          model.childForums.map((forum) =>
            el(
              "a",
              {
                class: "hm-forum-card",
                href: `bbs.forum.${forum.id}.jhtml`
              },
              [
                el("strong", {}, forum.name),
                forum.description ? el("small", {}, forum.description) : null
              ]
            )
          )
        )
      : null,
    model.notice ? el("p", { class: "hm-notice" }, model.notice) : null,
    el(
      "div",
      { class: "hm-topic-list" },
      model.topics.length
        ? model.topics.map(topicRow)
        : el("p", { class: "hm-empty" }, "当前版块暂无主题")
    ),
    renderPagination(model.pagination)
  ]);
}

export async function mount({ route, client, shell }) {
  const payload = await client.json(toBidUrl({ ...route, hash: "" }, "json"));
  const model = normalizeForum(payload);
  shell.setTitle(model.title);
  shell.setMain(renderForum(model));
  shell.setSidebar(el("div", { class: "hm-side-stack" }));
}
