let processorPromise;

async function loadProcessor() {
  processorPromise ||= import("sh-syntax").then(async (shell) => {
    if ("processor" in shell) return shell.processor;
    const { default: wasmUrl } = await import("sh-syntax/main.wasm?url");
    return shell.getProcessor(() => fetch(wasmUrl));
  });
  return processorPromise;
}

export async function format(code, options = {}) {
  const processor = await loadProcessor();
  return processor(code, {
    print: true,
    variant: options.variant,
    tabWidth: options.tabWidth ?? 2,
    useTabs: options.useTabs ?? false,
    keepComments: options.keepComments ?? true
  });
}
