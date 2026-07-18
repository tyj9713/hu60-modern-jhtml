import { extractCoderForm, normalizeUa } from "../adapters/tools.js";
import { toBidUrl } from "../core/urls.js";
import { el } from "../ui/dom.js";
import { renderForm } from "../ui/forms.js";

export function renderUa(model) {
  return el("section", { class: "hm-panel" }, [
    el("header", { class: "hm-page-head" }, [
      el("div", {}, [
        el("span", { class: "hm-kicker" }, "REQUEST INSPECTOR"),
        el("h1", {}, "浏览器 UA")
      ])
    ]),
    el("dl", { class: "hm-tool-facts" }, [
      el("div", {}, [el("dt", {}, "IP"), el("dd", {}, model.ip)]),
      el("div", {}, [el("dt", {}, "位置"), el("dd", {}, model.location)]),
      el("div", {}, [el("dt", {}, "代理"), el("dd", {}, model.proxy || "无")])
    ]),
    el(
      "div",
      { class: "hm-header-table" },
      Object.entries(model.headers).map(([name, value]) =>
        el("div", {}, [el("strong", {}, name), el("code", {}, value)])
      )
    )
  ]);
}

export function renderCoder(model, services = {}) {
  return el("section", { class: "hm-panel" }, [
    el("header", { class: "hm-page-head" }, [
      el("div", {}, [
        el("span", { class: "hm-kicker" }, "CODEC"),
        el("h1", {}, "编码解码器")
      ])
    ]),
    renderForm(model, services)
  ]);
}

export async function mount({ route, client, shell }) {
  if (route.pid === "ua") {
    const model = normalizeUa(
      await client.json(toBidUrl({ ...route, hash: "" }, "json"))
    );
    shell.setTitle("浏览器 UA");
    shell.setMain(renderUa(model));
  } else {
    const html = await client.html("tools.coder.html");
    shell.setTitle("编码解码器");
    shell.setMain(renderCoder(extractCoderForm(html)));
  }
  shell.setSidebar(el("div", { class: "hm-side-stack" }));
}
