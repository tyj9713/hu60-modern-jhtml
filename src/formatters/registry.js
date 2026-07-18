const aliases = new Map([
  ["js", "javascript"],
  ["jsx", "javascript"],
  ["ts", "typescript"],
  ["tsx", "typescript"],
  ["json5", "json"],
  ["md", "markdown"],
  ["py", "python"],
  ["bash", "shell"],
  ["sh", "shell"],
  ["zsh", "shell"],
  ["mysql", "sql"],
  ["postgresql", "sql"],
  ["sqlite", "sql"]
]);

const loaders = {
  javascript: () => import("./prettier.js"),
  typescript: () => import("./prettier.js"),
  json: () => import("./prettier.js"),
  html: () => import("./prettier.js"),
  css: () => import("./prettier.js"),
  markdown: () => import("./prettier.js"),
  php: () => import("./php.js"),
  python: () => import("./python.js"),
  sql: () => import("./sql.js"),
  shell: () => import("./shell.js")
};

export function normalizeLanguage(language) {
  const value = String(language || "").trim().toLowerCase();
  return aliases.get(value) || value;
}

export async function formatCode(language, code, options = {}) {
  const normalized = normalizeLanguage(language);
  const load = loaders[normalized];
  if (!load) {
    throw new Error(`暂不支持格式化：${language || "未指定语言"}`);
  }
  const formatter = await load();
  try {
    return await formatter.format(String(code || ""), {
      ...options,
      language: normalized
    });
  } catch (error) {
    const wrapped = new Error(
      `${normalized} 格式化失败：${error?.message || String(error)}`
    );
    wrapped.cause = error;
    wrapped.source = code;
    throw wrapped;
  }
}
