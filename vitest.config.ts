import { defineConfig } from "vitest/config";

// One Vitest run for the whole workspace: tests live next to the code they
// test, as *.test.ts files (see docs/05-conventions.md). Per-package
// projects (e.g. a browser environment for admin-ui) can be added later.
export default defineConfig({
  test: {
    include: ["{packages,apps,themes,plugins,examples}/*/src/**/*.test.ts"],
  },
});
