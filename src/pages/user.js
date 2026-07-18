import { normalizeUser } from "../adapters/user.js";
import { toBidUrl } from "../core/urls.js";
import { renderAvatar } from "../ui/avatar.js";
import { el } from "../ui/dom.js";

export function renderUserPage(model) {
  const profile = el("section", { class: "hm-panel hm-profile-page" }, [
    el("div", { class: "hm-profile-hero" }, [
      renderAvatar(model, 88),
      el("div", { class: "hm-profile-copy" }, [
        el("span", { class: "hm-kicker" }, model.isSelf ? "MY PROFILE" : "MEMBER"),
        el("h1", {}, model.name),
        model.signature
          ? el("p", { class: "hm-profile-signature" }, model.signature)
          : el("p", { class: "hm-profile-signature" }, "这个人还没有留下签名。"),
        el("div", { class: "hm-profile-actions" }, [
          el(
            "a",
            {
              class: "hm-button is-primary",
              href: `msg.index.send.${model.uid}.jhtml`
            },
            "发送内信"
          ),
          el(
            "a",
            {
              class: "hm-button is-ghost",
              href: `msg.index.chat.${model.uid}.jhtml`
            },
            "聊天模式"
          )
        ])
      ])
    ]),
    el("dl", { class: "hm-profile-facts" }, [
      el("div", {}, [el("dt", {}, "联系方式"), el("dd", {}, model.contact || "未公开")]),
      el("div", {}, [el("dt", {}, "注册时间"), el("dd", {}, model.registeredAt || "未知")]),
      el("div", {}, [
        el("dt", {}, "关系状态"),
        el(
          "dd",
          {},
          model.relationship.followed
            ? "已关注"
            : model.relationship.blocked
              ? "已屏蔽"
              : "普通"
        )
      ])
    ]),
    model.isSelf
      ? el("section", { class: "hm-settings-section" }, [
          el("h2", {}, "个人设置"),
          el(
            "div",
            { class: "hm-settings-grid" },
            model.settings.map((item) =>
              el("a", { href: item.href }, [
                el("strong", {}, item.label),
                el("span", { "aria-hidden": "true" }, "→")
              ])
            )
          )
        ])
      : null
  ]);
  return profile;
}

export async function mount({ route, client, shell }) {
  const model = normalizeUser(
    await client.json(toBidUrl({ ...route, hash: "" }, "json"))
  );
  shell.setTitle(model.name);
  shell.setMain(renderUserPage(model));
  shell.setSidebar(el("div", { class: "hm-side-stack" }));
}
