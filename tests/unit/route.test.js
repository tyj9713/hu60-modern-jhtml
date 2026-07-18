import { describe, expect, it } from "vitest";
import { createRouteRegistry } from "../../src/core/registry.js";
import { detectRoute } from "../../src/core/route.js";
import { toBidUrl } from "../../src/core/urls.js";

describe("hu60 route", () => {
  it("parses dotted JHTML routes and decoded extensions", () => {
    expect(
      detectRoute(
        new URL(
          "https://hu60.cn/q.php/addin.chat.%E5%85%AC%E5%85%B1%E8%81%8A%E5%A4%A9%E5%AE%A4.jhtml?p=2#9"
        )
      )
    ).toEqual({
      cid: "addin",
      pid: "chat",
      ext: ["公共聊天室"],
      bid: "jhtml",
      query: new URLSearchParams("p=2"),
      hash: "#9",
      pathname:
        "/q.php/addin.chat.%E5%85%AC%E5%85%B1%E8%81%8A%E5%A4%A9%E5%AE%A4.jhtml"
    });
  });

  it("keeps admin routes on html", () => {
    const route = detectRoute(
      new URL("https://hu60.cn/q.php/admin.user.jhtml")
    );
    expect(toBidUrl(route, "jhtml")).toBe("admin.user.html");
  });

  it("preserves filters when changing bid", () => {
    const route = detectRoute(
      new URL(
        "https://hu60.cn/q.php/bbs.forum.8.jhtml?p=3&onlyEssence=1"
      )
    );
    expect(toBidUrl(route, "json")).toBe(
      "bbs.forum.8.json?p=3&onlyEssence=1"
    );
  });
});

describe("route registry", () => {
  it("prefers an exact route before a wildcard fallback", () => {
    const exact = { cid: "bbs", pid: "topic" };
    const wildcard = { cid: "bbs", pid: "*" };
    const registry = createRouteRegistry([wildcard, exact]);

    expect(registry.resolve({ cid: "bbs", pid: "topic" })).toBe(exact);
    expect(registry.resolve({ cid: "bbs", pid: "review" })).toBe(wildcard);
    expect(registry.list()).toEqual([wildcard, exact]);
  });
});
