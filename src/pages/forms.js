import { extractFormModel } from "../adapters/html-form.js";
import { toBidUrl } from "../core/urls.js";
import { el } from "../ui/dom.js";
import { renderForm } from "../ui/forms.js";

export function renderServerNotice(message, kind = "info") {
  return el(
    "p",
    { class: `hm-notice${kind === "error" ? " is-error" : ""}` },
    message
  );
}

export async function mount({ route, client, shell, services = {} }) {
  const html = await client.html(toBidUrl({ ...route, hash: "" }, "html"));
  const doc = new DOMParser().parseFromString(html, "text/html");
  const title = doc.querySelector("h1,h2,title")?.textContent?.trim() || "操作";
  let model;
  try {
    model = extractFormModel(html);
  } catch {
    model = null;
  }
  const form = model ? renderForm(model) : null;
  const resultText = doc.body?.textContent?.replace(/\s+/g, " ").trim();
  const content = el("section", { class: "hm-panel" }, [
    el("header", { class: "hm-page-head" }, [
      el("div", {}, [el("span", { class: "hm-kicker" }, "ACTION"), el("h1", {}, title)])
    ]),
    form ||
      renderServerNotice(
        resultText || "操作已经完成。",
        doc.querySelector(".failure,.text-failure,.error") ? "error" : "info"
      )
  ]);
  shell.setTitle(title);
  shell.setMain(content);
  shell.setSidebar(el("div"));

  const textarea = form?.querySelector('textarea[name="content"]');
  if (textarea && services.mountEditor) {
    await services.mountEditor({
      form,
      textarea,
      titleInput: form.querySelector(
        'input[name="title"],input[name="content_title"]'
      ),
      routeKey: `${route.cid}.${route.pid}`,
      targetId: route.ext[0] || "",
      previewUrl: toBidUrl({ ...route, hash: "" }, "json"),
      services: { ...services, client }
    });
  }
}
