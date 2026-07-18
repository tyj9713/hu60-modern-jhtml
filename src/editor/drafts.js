function draftKey({ uid = 0, route = "", target = "" }) {
  return `hu60-modern:draft:${uid}:${route}:${target}`;
}

export function createDraftStore(storage = globalThis.localStorage) {
  return {
    key: draftKey,
    save(identity) {
      const key = draftKey(identity);
      storage.setItem(
        key,
        JSON.stringify({
          mode: identity.mode || "markdown",
          body: identity.body || "",
          title: identity.title || "",
          savedAt: Date.now()
        })
      );
    },
    load(identity) {
      try {
        const value = storage.getItem(draftKey(identity));
        return value ? JSON.parse(value) : null;
      } catch {
        return null;
      }
    },
    remove(identity) {
      storage.removeItem(draftKey(identity));
    }
  };
}
