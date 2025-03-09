import { fileURLToPath } from "node:url";
import { mergeConfig, defineConfig, configDefaults } from "vitest/config";
import viteConfig from "./vite.config";

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      globals: true,
      coverage: {
        provider: "istanbul", // or 'v8'
        reporter: [
          ["lcov", { projectRoot: "./src" }],
          ["json", { file: "coverage.json" }],
          ["clover"],
          ["text"]
        ]
      },
      reporters: ["junit", "json", "verbose"],
      outputFile: {
        junit: "./assets_testreports/junit.xml",
        json: "./assets_testreports/json-report.json"
      },
      environment: "jsdom",
      exclude: [...configDefaults.exclude, "e2e/*"],
      setupFiles: ["./vitest.setup.ts"],
      root: fileURLToPath(new URL("./", import.meta.url))
    }
  })
);
