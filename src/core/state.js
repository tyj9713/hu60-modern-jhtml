export function createPageState(initial = {}) {
  let value = { ...initial };
  const subscribers = new Set();

  return {
    get() {
      return { ...value };
    },
    set(patch) {
      const previous = value;
      value = { ...value, ...patch };
      for (const subscriber of subscribers) {
        subscriber({ ...value }, { ...previous });
      }
      return { ...value };
    },
    subscribe(subscriber) {
      subscribers.add(subscriber);
      return () => subscribers.delete(subscriber);
    }
  };
}
