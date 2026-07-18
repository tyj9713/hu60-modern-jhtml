import { existsSync, readFileSync, statSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const dist = resolve(root, "dist");

function requireFile(relativePath) {
  const path = resolve(dist, relativePath);
  if (!existsSync(path)) {
    throw new Error(`缺少发布产物：dist/${relativePath}`);
  }
  if (statSync(path).size === 0) {
    throw new Error(`发布产物为空：dist/${relativePath}`);
  }
  return readFileSync(path, "utf8");
}

const app = requireFile("app.min.js");
const css = requireFile("theme.min.css");
const manifest = JSON.parse(requireFile("manifest.json"));

if (app.includes("@latest")) {
  throw new Error("入口文件不得包含浮动的 @latest 依赖");
}

for (const marker of ["ruff_wasm", "sql-formatter", "sh-syntax"]) {
  if (app.includes(marker)) {
    throw new Error(`按需格式化器被错误打进入口：${marker}`);
  }
}

const referenced = new Set();
for (const entry of Object.values(manifest)) {
  if (entry.file) referenced.add(entry.file);
  for (const file of [...(entry.css || []), ...(entry.assets || [])]) {
    referenced.add(file);
  }
}
for (const file of referenced) requireFile(file);

for (const rule of [
  "max-width:24px",
  "@media (max-width:980px)",
  "@media (max-width:720px)",
  "@media (prefers-reduced-motion:reduce)"
]) {
  if (!css.includes(rule)) {
    throw new Error(`CSS 缺少发布契约：${rule}`);
  }
}

console.log(
  `dist 验证通过：${referenced.size} 个 manifest 产物、入口与响应式 CSS 均有效。`
);
