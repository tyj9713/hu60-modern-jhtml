import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "jsdom",
    include: ["tests/unit/**/*.test.js"],
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
      include: [
        "src/adapters/**/*.js",
        "src/core/client.js",
        "src/core/registry.js",
        "src/core/route.js",
        "src/core/state.js",
        "src/core/urls.js",
        "src/editor/drafts.js",
        "src/editor/fenced-code.js",
        "src/editor/layout.js",
        "src/editor/markdown.js",
        "src/editor/ubb.js",
        "src/enhancers/faces.js",
        "src/enhancers/links.js",
        "src/formatters/**/*.js"
      ],
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 75,
        statements: 80
      }
    }
  }
});
