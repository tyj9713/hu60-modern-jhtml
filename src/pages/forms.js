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

export function extractNewTopicForums(doc) {
  const forums = new Map();
  for (const anchor of doc.querySelectorAll('a[href*="bbs.newtopic."]')) {
    const href = anchor.getAttribute("href") || "";
    const match = href.match(
      /(?:^|\/)(bbs\.newtopic\.(\d+)\.html)(?:[?#].*)?$/
    );
    const name = anchor.textContent?.replace(/\s+/g, " ").trim();
    if (!match || !name || forums.has(match[2])) continue;
    forums.set(match[2], {
      id: match[2],
      name,
      href: `bbs.newtopic.${match[2]}.jhtml`
    });
  }
  return [...forums.values()];
}

function renderForumPicker(forums) {
  return el(
    "div",
    { class: "hm-forum-picker" },
    forums.map((forum) =>
      el("a", { class: "hm-forum-card", href: forum.href }, [
        el("strong", {}, forum.name),
        el("small", {}, "在此版块发布主题 →")
      ])
    )
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
  const forumChoices =
    route.cid === "bbs" &&
    route.pid === "newtopic" &&
    !route.ext?.length
      ? extractNewTopicForums(doc)
      : [];
  const form = model ? renderForm(model) : null;
  const resultText = doc
    .querySelector(".failure,.text-failure,.error,.success,.notice")
    ?.textContent?.replace(/\s+/g, " ")
    .trim();
  const content = el("section", { class: "hm-panel" }, [
    el("header", { class: "hm-page-head" }, [
      el("div", {}, [el("span", { class: "hm-kicker" }, "ACTION"), el("h1", {}, title)])
    ]),
    form ||
      (forumChoices.length ? renderForumPicker(forumChoices) : null) ||
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
