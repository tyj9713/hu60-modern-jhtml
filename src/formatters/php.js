let toolsPromise;

async function loadTools() {
  toolsPromise ||= Promise.all([
    import("prettier/standalone"),
    import("@prettier/plugin-php/standalone")
  ]);
  return toolsPromise;
}

export async function format(code, options = {}) {
  const [prettier, php] = await loadTools();
  return prettier.format(code, {
    parser: "php",
    plugins: [php.default || php],
    tabWidth: options.tabWidth ?? 2,
    printWidth: options.printWidth ?? 88
  });
}
