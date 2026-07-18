import { el } from "../ui/dom.js";

const languageNames = {
  js: "JavaScript",
  javascript: "JavaScript",
  ts: "TypeScript",
  typescript: "TypeScript",
  html: "HTML",
  css: "CSS",
  json: "JSON",
  php: "PHP",
  py: "Python",
  python: "Python",
  sql: "SQL",
  sh: "Shell",
  shell: "Shell",
  bash: "Shell",
  markdown: "Markdown",
  md: "Markdown"
};

function detectLanguage(code) {
  const token = [...code.classList]
    .map((name) => name.replace(/^(language-|lang-)/, ""))
    .find((name) => languageNames[name.toLowerCase()]);
  return token ? languageNames[token.toLowerCase()] : "代码";
}

export function markCodeBlocks(
  root,
  { clipboard = navigator.clipboard } = {}
) {
  for (const pre of root.querySelectorAll("pre")) {
    const code = pre.querySelector(":scope > code") || pre.querySelector("code");
    if (!code || pre.dataset.hmCodeEnhanced === "1") continue;

    pre.dataset.hmCodeEnhanced = "1";
    const lineCount = code.textContent.split(/\r?\n/).length;
    const copyButton = el(
      "button",
      {
        type: "button",
        "data-action": "copy-code",
        onclick: async () => {
          await clipboard?.writeText?.(code.textContent);
          copyButton.textContent = "已复制";
          setTimeout(() => {
            copyButton.textContent = "复制";
          }, 1600);
        }
      },
      "复制"
    );
    const wrapButton = el(
      "button",
      {
        type: "button",
        "data-action": "toggle-wrap",
        onclick: () => pre.classList.toggle("is-wrapped")
      },
      "换行"
    );
    const controls = [copyButton, wrapButton];
    if (lineCount > 36) {
      pre.classList.add("is-collapsed");
      controls.push(
        el(
          "button",
          {
            type: "button",
            "data-action": "toggle-collapse",
            onclick: (event) => {
              const collapsed = pre.classList.toggle("is-collapsed");
              event.currentTarget.textContent = collapsed ? "展开" : "收起";
            }
          },
          "展开"
        )
      );
    }
    pre.before(
      el("div", { class: "hm-code-toolbar" }, [
        el("span", { class: "hm-code-language" }, detectLanguage(code)),
        el("span", { class: "hm-code-actions" }, controls)
      ])
    );
  }
}

export async function enhanceCodeBlocks(root) {
  markCodeBlocks(root);
  const { default: hljs } = await import("highlight.js/lib/core");
  const languages = await Promise.all([
    import("highlight.js/lib/languages/javascript"),
    import("highlight.js/lib/languages/typescript"),
    import("highlight.js/lib/languages/xml"),
    import("highlight.js/lib/languages/css"),
    import("highlight.js/lib/languages/json"),
    import("highlight.js/lib/languages/php"),
    import("highlight.js/lib/languages/python"),
    import("highlight.js/lib/languages/sql"),
    import("highlight.js/lib/languages/bash")
  ]);
  const names = [
    "javascript",
    "typescript",
    "xml",
    "css",
    "json",
    "php",
    "python",
    "sql",
    "bash"
  ];
  languages.forEach((module, index) =>
    hljs.registerLanguage(names[index], module.default)
  );

  for (const code of root.querySelectorAll("pre > code")) {
    if (!code.classList.contains("hljs")) hljs.highlightElement(code);
  }
}
