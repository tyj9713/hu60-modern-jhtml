import { expect, it } from "vitest";
import { routeDefinitions } from "../../src/core/bootstrap.js";

it("covers ordinary routes and excludes admin", () => {
  const keys = routeDefinitions.map((item) => `${item.cid}.${item.pid}`);
  expect(keys).toEqual(
    expect.arrayContaining([
      "index.index",
      "bbs.forum",
      "bbs.topic",
      "bbs.search",
      "bbs.myfavorite",
      "bbs.newtopic",
      "bbs.newreply",
      "user.index",
      "user.info",
      "user.login",
      "user.reg",
      "msg.index",
      "addin.chat",
      "addin.webplug",
      "tools.ua",
      "tools.coder"
    ])
  );
  expect(routeDefinitions.some((item) => item.cid === "admin")).toBe(false);
  const firstWildcard = routeDefinitions.findIndex(
    (item) => item.pid === "*"
  );
  expect(
    routeDefinitions
      .slice(firstWildcard)
      .every((item) => item.pid === "*")
  ).toBe(true);
});
