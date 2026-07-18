import {
  normalizeConversation,
  normalizeMessageList
} from "../adapters/message.js";
import { toBidUrl } from "../core/urls.js";
import { confirmDialog } from "../ui/dialog.js";
import { el } from "../ui/dom.js";
import { bindAsyncFormSubmit } from "../ui/forms.js";
import { renderPagination } from "../ui/pagination.js";

const tabs = [
  ["收件箱", "msg.index.inbox.all.jhtml"],
  ["未读", "msg.index.inbox.no.jhtml"],
  ["已读", "msg.index.inbox.yes.jhtml"],
  ["发件箱", "msg.index.outbox.all.jhtml"],
  ["@消息", "msg.index.@.all.jhtml"],
  ["发信", "msg.index.send.jhtml"]
];

function safeContent(html) {
  const template = document.createElement("template");
  template.innerHTML = html;
  template.content.querySelectorAll("script,object,embed").forEach((node) =>
    node.remove()
  );
  return template.content;
}

function messageItem(item, chatMode = false) {
  const content = el("div", { class: "hm-message-content" });
  content.append(safeContent(item.contentHtml));
  return el(
    "article",
    {
      class: `hm-message is-${item.direction}${
        item.unread ? " is-unread" : ""
      }`
    },
    [
      el("div", { class: "hm-message-meta" }, [
        el(
          "strong",
          {},
          item.direction === "outgoing"
            ? `发给 ${item.peerName || "对方"}`
            : item.peerName || "对方"
        ),
        item.unread ? el("span", {}, "未读") : null,
        item.createdAt ? el("time", {}, item.createdAt) : null
      ]),
      chatMode
        ? content
        : el(
            "a",
            { class: "hm-message-link", href: `msg.index.view.${item.id}.jhtml` },
            content
          )
    ]
  );
}

function messageComposer(model) {
  return el("div", { class: "hm-message-composer" }, [
    el(
      "form",
      {
        class: "hm-form",
        action: `msg.index.send.${model.peer.uid}.json`,
        method: "post"
      },
      [
        el("label", { class: "hm-form-field" }, [
          el("span", {}, `回复 ${model.peer.name}`),
          el("textarea", {
            class: "hm-form-control",
            name: "content",
            required: true
          })
        ]),
        el("div", { class: "hm-form-actions" }, [
          el(
            "button",
            {
              class: "hm-button is-primary",
              type: "submit",
              name: "go",
              value: "回复"
            },
            "回复"
          )
        ])
      ]
    )
  ]);
}

export function renderMessages(model, services = {}) {
  const chatMode = model.kind === "chat";
  return el("section", { class: "hm-panel hm-messages-page" }, [
    el("header", { class: "hm-page-head" }, [
      el("div", {}, [
        el("span", { class: "hm-kicker" }, chatMode ? "CONVERSATION" : "MESSAGES"),
        el("h1", {}, chatMode ? `与 ${model.peer.name} 的对话` : "站内消息")
      ]),
      el(
        "a",
        { class: "hm-button is-primary", href: "msg.index.send.jhtml" },
        "写内信"
      )
    ]),
    el(
      "nav",
      { class: "hm-tabs", "aria-label": "消息分类" },
      tabs.map(([label, href]) => el("a", { href }, label))
    ),
    model.notice ? el("p", { class: "hm-notice" }, model.notice) : null,
    el(
      "div",
      { class: `hm-message-list${chatMode ? " is-chat" : ""}` },
      model.messages.length
        ? model.messages.map((item) => messageItem(item, chatMode))
        : el("p", { class: "hm-empty" }, "这里还没有消息")
    ),
    renderPagination(model.pagination),
    chatMode && services.mountEditor ? messageComposer(model) : null
  ]);
}

export async function requestClearInbox(
  client,
  model,
  { confirm = confirmDialog } = {}
) {
  const approved = await confirm({
    title: "清空全部收件箱？",
    message: "已读和未读内信都会永久删除，此操作不可恢复。",
    confirmText: "确认清空",
    danger: true
  });
  if (!approved) return false;

  await client.request("msg.index.inbox.all.json", {
    method: "POST",
    headers: {
      "content-type": "application/x-www-form-urlencoded;charset=UTF-8"
    },
    body: new URLSearchParams({
      clean: "msg",
      actionToken: model.actionToken,
      action: "清空收件箱"
    })
  });
  return true;
}

export async function mount({ route, client, shell, services = {} }) {
  const payload = await client.json(
    toBidUrl({ ...route, hash: "" }, "json")
  );
  const mode = route.ext[0] || "inbox";
  const model =
    mode === "chat"
      ? normalizeConversation(
          payload,
          payload._myself?.uid || payload.userInfo?.uid || 0
        )
      : normalizeMessageList(
          payload,
          mode === "outbox" ? "outbox" : mode === "@" ? "at" : "inbox"
        );
  shell.setTitle(mode === "chat" ? `与 ${model.peer.name} 的对话` : "站内消息");
  const view = renderMessages(model, services);
  shell.setMain(view);
  shell.setSidebar(el("div", { class: "hm-side-stack" }));
  const form = view.querySelector(".hm-message-composer form");
  const textarea = form?.querySelector('textarea[name="content"]');
  if (form && textarea && services.mountEditor) {
    const controller = await services.mountEditor({
      form,
      textarea,
      routeKey: "msg.index.chat",
      targetId: String(model.peer.uid),
      previewUrl: form.getAttribute("action"),
      services: { ...services, client }
    });
    if (client.request) {
      bindAsyncFormSubmit(form, {
        client,
        controller,
        toast: services.toast
      });
    }
  }
}
