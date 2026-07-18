import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { expect, it } from "vitest";

it("ships an exact-version loader without floating URLs", () => {
  const loader = readFileSync(
    resolve(process.cwd(), "../../document/jhtml-modern-v2-loader.html"),
    "utf8"
  );

  expect(loader).toContain(
    "cdn.jsdelivr.net/gh/tyj9713/hu60-modern-jhtml@v1.0.2/dist/theme.min.css"
  );
  expect(loader).toContain(
    "cdn.jsdelivr.net/gh/tyj9713/hu60-modern-jhtml@v1.0.2/dist/app.min.js"
  );
  expect(loader).not.toContain("@latest");
  expect(loader).not.toContain("@main");
});
