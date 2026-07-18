import {
  normalizeChatMessages,
  normalizeChatRooms
} from "../adapters/chat.js";
import { toBidUrl } from "../core/urls.js";
import { enhanceContentSync } from "../enhancers/content.js";
import { el } from "../ui/dom.js";
import { bindAsyncFormSubmit } from "../ui/forms.js";
import { renderAvatar } from "../ui/avatar.js";
import { renderPagination } from "../ui/pagination.js";

function safeContent(html) {
  const template = document.createElement("template");
  template.innerHTML = html;
  template.content.querySelectorAll("script,object,embed").forEach((node) =>
    node.remove()
  );
  return template.content;
}

function renderRooms(model) {
  return el("section", { class: "hm-panel" }, [
    el("header", { class: "hm-page-head" }, [
      el("div", {}, [
        el("span", { class: "hm-kicker" }, "PUBLIC CHAT"),
        el("h1", {}, "公共聊天室")
      ]),
      el("a", { class: "hm-button is-primary", href: "addin.chat.new.html" }, "新建房间")
    ]),
    model.notice ? el("p", { class: "hm-notice" }, model.notice) : null,
    el(
      "div",
      { class: "hm-chat-rooms" },
      model.rooms.map((room) =>
        el(
          "a",
          {
            class: "hm-chat-room",
            href: `addin.chat.${encodeURIComponent(room.name)}.jhtml`
          },
          [
            el("div", {}, [
              el("strong", {}, room.name),
              room.description ? el("small", {}, room.description) : null
            ]),
            el("span", {}, `${room.count} 人`)
          ]
        )
      )
    )
  ]);
}

function chatComposer(model) {
  return el("div", { class: "hm-chat-composer" }, [
    el(
      "form",
      {
        class: "hm-form",
        action: `addin.chat.${encodeURIComponent(model.room)}.json`,
        method: "post"
      },
      [
        model.actionToken
          ? el("input", {
              type: "hidden",
              name: "token",
              value: model.actionToken
            })
          : null,
        el("label", { class: "hm-form-field" }, [
          el("span", {}, "参与聊天"),
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
              value: "快速发言"
            },
            "快速发言"
          )
        ])
      ]
    )
  ]);
}

function renderMessages(model, services) {
  const list = el(
    "div",
    { class: "hm-chat-messages" },
    model.messages.map((item) => {
      const content = el("div", { class: "hm-chat-content" });
      content.append(safeContent(item.contentHtml));
      enhanceContentSync(content);
      return el("article", { class: "hm-chat-message", id: String(item.floor) }, [
        renderAvatar({ ...item.author, avatar: item.avatar }, 42),
        el("div", { class: "hm-chat-message-main" }, [
          el("header", { class: "hm-chat-meta" }, [
            el("strong", {}, item.author?.name || "匿名"),
            el("a", { href: `#${item.floor}` }, `#${item.floor}`),
            item.createdAt ? el("time", {}, item.createdAt) : null
          ]),
          content,
          el("footer", { class: "hm-post-actions" }, [
            el("a", { class: "hm-post-action", href: `#reply-${item.uid}` }, "@Ta"),
            item.canViewSource
              ? el("a", { class: "hm-post-action", href: `?source=${item.id}` }, "源内容")
              : null,
            item.canDelete
              ? el("a", { class: "hm-post-action is-danger", href: `?del=${item.id}` }, "删除")
              : null
          ])
        ])
      ]);
    })
  );
  return el("section", { class: "hm-panel" }, [
    el("header", { class: "hm-page-head" }, [
      el("div", {}, [
        el("span", { class: "hm-kicker" }, "LIVE ROOM"),
        el("h1", {}, model.room)
      ]),
      el("a", { class: "hm-button is-ghost", href: "addin.chat.jhtml" }, "切换房间")
    ]),
    model.notice ? el("p", { class: "hm-notice" }, model.notice) : null,
    list,
    renderPagination(model.pagination),
    model.canPost && services.mountEditor ? chatComposer(model) : null
  ]);
}

export function renderChat(model, services = {}) {
  return model.mode === "rooms"
    ? renderRooms(model)
    : renderMessages(model, services);
}

export async function mount({ route, client, shell, services = {} }) {
  const payload = await client.json(
    toBidUrl({ ...route, hash: "" }, "json", {
      _uinfo: "uid,name,avatar"
    })
  );
  const model =
    route.ext.length || payload.chatList
      ? normalizeChatMessages(payload)
      : normalizeChatRooms(payload);
  shell.setTitle(model.mode === "rooms" ? "公共聊天室" : model.room);
  const view = renderChat(model, services);
  shell.setMain(view);
  shell.setSidebar(el("div", { class: "hm-side-stack" }));
  const form = view.querySelector(".hm-chat-composer form");
  const textarea = form?.querySelector('textarea[name="content"]');
  if (form && textarea && services.mountEditor) {
    const controller = await services.mountEditor({
      form,
      textarea,
      routeKey: "addin.chat",
      targetId: model.room,
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
