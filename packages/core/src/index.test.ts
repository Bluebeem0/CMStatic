import { describe, expect, it } from "vitest";
import { PACKAGE_NAME } from "./index.js";

// Smoke test for the phase 0 toolchain; replaced by real tests in task 1.1.
describe("@cmstatic/core", () => {
  it("exposes its package name", () => {
    expect(PACKAGE_NAME).toBe("@cmstatic/core");
  });
});
