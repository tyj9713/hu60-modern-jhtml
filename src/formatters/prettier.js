const parserMap = {
  javascript: "babel",
  typescript: "typescript",
  json: "json",
  html: "html",
  css: "css",
  markdown: "markdown"
};

let prettierPromise;

async function loadPrettier() {
  prettierPromise ||= Promise.all([
    import("prettier/standalone"),
    import("prettier/plugins/babel"),
    import("prettier/plugins/estree"),
    import("prettier/plugins/typescript"),
    import("prettier/plugins/html"),
    import("prettier/plugins/postcss"),
    import("prettier/plugins/markdown")
  ]).then(([prettier, ...plugins]) => ({
    prettier,
    plugins: plugins.map((plugin) => plugin.default || plugin)
  }));
  return prettierPromise;
}

export async function format(code, options) {
  const { prettier, plugins } = await loadPrettier();
  return prettier.format(code, {
    parser: parserMap[options.language],
    plugins,
    semi: options.semi ?? true,
    singleQuote: options.singleQuote ?? false,
    tabWidth: options.tabWidth ?? 2,
    printWidth: options.printWidth ?? 88
  });
}
