let workspacePromise;

async function getWorkspace() {
  workspacePromise ||= import("@astral-sh/ruff-wasm-web").then(async (ruff) => {
    if (
      typeof process !== "undefined" &&
      process.versions?.node &&
      typeof import.meta.resolve === "function"
    ) {
      const nodeFs = "node:fs/promises";
      const { readFile } = await import(/* @vite-ignore */ nodeFs);
      const moduleUrl = import.meta.resolve("@astral-sh/ruff-wasm-web");
      const wasm = await readFile(
        new URL("./ruff_wasm_bg.wasm", moduleUrl)
      );
      await ruff.default(wasm);
    } else {
      await ruff.default();
    }
    return new ruff.Workspace(
      ruff.Workspace.defaultSettings(),
      ruff.PositionEncoding.Utf16
    );
  });
  return workspacePromise;
}

export async function format(code) {
  const workspace = await getWorkspace();
  return workspace.format(code);
}
