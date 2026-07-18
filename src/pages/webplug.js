import {
  createWebPlugAdapter,
  normalizeWebPlugs
} from "../adapters/webplug.js";
import { confirmDialog } from "../ui/dialog.js";
import { el } from "../ui/dom.js";

export function renderWebPlugs(items, services = {}) {
  return el("section", { class: "hm-panel" }, [
    el("header", { class: "hm-page-head" }, [
      el("div", {}, [
        el("span", { class: "hm-kicker" }, "WEB PLUG"),
        el("h1", {}, "网页插件")
      ]),
      el("button", { class: "hm-button is-primary", type: "button" }, "添加插件")
    ]),
    el(
      "div",
      { class: "hm-webplug-list" },
      items.map((item) =>
        el("article", { class: "hm-webplug-item" }, [
          el("div", {}, [
            el("strong", {}, item.name),
            el("p", {}, item.description || "没有说明")
          ]),
          el("span", { class: `hm-status${item.enabled ? " is-on" : ""}` }, item.enabled ? "已启用" : "已停用"),
          el("div", { class: "hm-post-actions" }, [
            el("button", { class: "hm-post-action", type: "button" }, "编辑"),
            el(
              "button",
              {
                class: "hm-post-action is-danger",
                type: "button",
                onclick: async () => {
                  const approved = await (services.confirm || confirmDialog)({
                    title: `删除“${item.name}”？`,
                    message: "插件代码将被永久删除，此操作不可恢复。",
                    confirmText: "确认删除",
                    danger: true
                  });
                  if (approved) await services.remove?.(item.id);
                }
              },
              "删除"
            )
          ])
        ])
      )
    )
  ]);
}

export async function mount({ client, shell }) {
  const adapter = createWebPlugAdapter(client);
  const items = normalizeWebPlugs(await adapter.list());
  shell.setTitle("网页插件");
  shell.setMain(renderWebPlugs(items, { remove: adapter.remove }));
  shell.setSidebar(el("div", { class: "hm-side-stack" }));
}
