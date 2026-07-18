import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/browser",
  use: {
    baseURL: "http://127.0.0.1:4173"
  },
  webServer: {
    command: "pnpm vite --host 127.0.0.1 --port 4173",
    port: 4173,
    reuseExistingServer: true
  },
  projects: [
    {
      name: "mobile",
      use: {
        ...devices["iPhone 13"],
        browserName: "chromium",
        viewport: { width: 390, height: 844 }
      }
    },
    {
      name: "tablet",
      use: {
        viewport: { width: 768, height: 1024 }
      }
    },
    {
      name: "desktop",
      use: {
        viewport: { width: 1440, height: 900 }
      }
    }
  ]
});
