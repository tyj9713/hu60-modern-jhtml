import { describe, expect, it } from "vitest";
import packageJson from "../../package.json";

describe("npm package contract", () => {
  it("uses the public stable package identity", () => {
    expect(packageJson.name).toBe("hu60-modern-jhtml");
    expect(packageJson.version).toBe("1.0.2");
    expect(packageJson.type).toBe("module");
    expect(packageJson.files).toEqual(["dist", "README.md", "LICENSE"]);
  });

  it("does not expose a floating CDN URL", () => {
    expect(JSON.stringify(packageJson)).not.toContain("@latest");
  });
});
