import { defineConfig, devices } from "@playwright/test";

const PORT = 3201;
const HOST = "127.0.0.1";
const baseURL = `http://${HOST}:${PORT}`;
const readinessURL = `${baseURL}/en`;

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  // Visual baselines are platform-specific and not committed; CI runs the
  // functional assertions and skips the screenshot comparisons.
  ignoreSnapshots: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? [["github"], ["html", { open: "never" }]] : "list",
  use: {
    baseURL,
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },
  projects: [
    {
      name: "desktop-chromium",
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 1440, height: 1080 },
      },
    },
    {
      name: "mobile-chromium",
      use: {
        ...devices["Pixel 5"],
      },
    },
  ],
  webServer: {
    // No --hostname flag: with an explicit hostname, Next 16 normalizes the
    // loopback host and middleware rewrites to locale-internal paths come
    // back as redirect loops on CA/ES routes.
    command: `npm run start:e2e -- --port ${PORT}`,
    url: readinessURL,
    reuseExistingServer: false,
    timeout: 180_000,
  },
});
