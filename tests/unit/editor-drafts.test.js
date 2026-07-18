import { expect, it } from "vitest";
import { createDraftStore } from "../../src/editor/drafts.js";

it("isolates drafts by uid route and target", () => {
  const storage = new Map();
  const store = createDraftStore({
    getItem: (key) => storage.get(key) || null,
    setItem: (key, value) => storage.set(key, value),
    removeItem: (key) => storage.delete(key)
  });
  store.save({
    uid: 3,
    route: "bbs.newreply",
    target: "8",
    mode: "markdown",
    body: "a"
  });

  expect(
    store.load({ uid: 3, route: "bbs.newreply", target: "8" }).body
  ).toBe("a");
  expect(
    store.load({ uid: 4, route: "bbs.newreply", target: "8" })
  ).toBeNull();
});

it("discards drafts and tolerates damaged storage", () => {
  const storage = new Map();
  const store = createDraftStore({
    getItem: (key) => storage.get(key) || null,
    setItem: (key, value) => storage.set(key, value),
    removeItem: (key) => storage.delete(key)
  });
  const key = store.key({ uid: 3, route: "bbs.newreply", target: "8" });
  storage.set(key, "{broken");
  expect(store.load({ uid: 3, route: "bbs.newreply", target: "8" })).toBeNull();
  store.save({ uid: 3, route: "bbs.newreply", target: "8", body: "a" });
  store.remove({ uid: 3, route: "bbs.newreply", target: "8" });
  expect(storage.has(key)).toBe(false);
});
