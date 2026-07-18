import { normalizeTopic } from "../adapters/topic.js";
import { toBidUrl } from "../core/urls.js";
import { enhanceContentSync } from "../enhancers/content.js";
import { el } from "../ui/dom.js";
import { renderAvatar } from "../ui/avatar.js";
import { renderPagination } from "../ui/pagination.js";

function safeServerFragment(html) {
  const template = document.createElement("template");
  template.innerHTML = html;
  for (const blocked of template.content.querySelectorAll(
    "script,object,embed,base,meta[http-equiv]"
  )) {
    blocked.remove();
  }
  for (const node of template.content.querySelectorAll("*")) {
    for (const attribute of [...node.attributes]) {
      if (/^on/i.test(attribute.name)) node.removeAttribute(attribute.name);
    }
  }
  return template.content;
}

function actionLink(label, href, danger = false) {
  return el(
    "a",
    {
      class: `hm-post-action${danger ? " is-danger" : ""}`,
      href
    },
    label
  );
}

function renderPost(post, topicId) {
  const content = el("div", { class: "hm-post-content" });
  content.append(safeServerFragment(post.contentHtml));
  enhanceContentSync(content);
  const actions = [];
  if (post.canEdit) {
    actions.push(
      actionLink(
        "编辑",
        `bbs.edittopic.${topicId}.${post.floor}.jhtml`
      )
    );
  }
  if (post.canDelete) {
    actions.push(
      actionLink(
        "删除",
        `bbs.deltopic.${topicId}.${post.floor}.jhtml`,
        true
      )
    );
  }
  if (post.canSink) {
    actions.push(actionLink("下沉", `bbs.sinktopic.${topicId}.jhtml`));
  }

  return el("article", { class: "hm-post", id: String(post.floor) }, [
    el("header", { class: "hm-post-head" }, [
      renderAvatar({ ...post.author, avatar: post.avatar }, 44),
      el("div", { class: "hm-post-author" }, [
        el("strong", {}, post.author?.name || "匿名"),
        el("small", {}, post.createdAt || "")
      ]),
      el("a", { class: "hm-floor", href: `#${post.floor}` }, `#${post.floor}`)
    ]),
    content,
    actions.length ? el("footer", { class: "hm-post-actions" }, actions) : null
  ]);
}

export function renderTopic(model) {
  return el("section", { class: "hm-panel hm-topic-page" }, [
    el("header", { class: "hm-page-head" }, [
      el("div", {}, [
        el("span", { class: "hm-kicker" }, `TOPIC · ${model.meta.readCount} READS`),
        el("h1", {}, model.meta.title)
      ]),
      model.canReply
        ? el(
            "a",
            {
              class: "hm-button is-primary",
              href: `bbs.newreply.${model.meta.id}.jhtml`
            },
            "回复"
          )
        : null
    ]),
    model.notice ? el("p", { class: "hm-notice" }, model.notice) : null,
    el(
      "div",
      { class: "hm-post-list" },
      model.posts.map((post) => renderPost(post, model.meta.id))
    ),
    renderPagination(model.pagination)
  ]);
}

export async function mount({ route, client, shell }) {
  const model = normalizeTopic(
    await client.json(toBidUrl({ ...route, hash: "" }, "json"))
  );
  shell.setTitle(model.meta.title);
  shell.setMain(renderTopic(model));
  shell.setSidebar(el("div", { class: "hm-side-stack" }));
}
