import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    setupFiles: ["./config/vitest.setup.ts"],
    exclude: ["node_modules", "./lib"],
    environment: "jsdom",
    typecheck: {
      checker: "tsc",
    },
  },
});
