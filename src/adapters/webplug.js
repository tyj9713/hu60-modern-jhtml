export function createWebPlugAdapter(client) {
  const post = (url, fields) =>
    client.json(url, {
      method: "POST",
      headers: {
        "content-type": "application/x-www-form-urlencoded;charset=UTF-8"
      },
      body: new URLSearchParams(fields)
    });

  return {
    list: () => client.json("api.webplug.list.json"),
    get: (id) => post("api.webplug.get.json", { id }),
    add: (item) => post("api.webplug.add.json", item),
    update: (item) => post("api.webplug.update.json", item),
    enable: (id, enabled) =>
      post("api.webplug.enable.json", {
        id,
        enabled: enabled ? 1 : 0
      }),
    reorder: (order) =>
      post("api.webplug.set_load_order.json", {
        order: JSON.stringify(order)
      }),
    remove: (id) => post("api.webplug.delete.json", { id }),
    importData: (content) =>
      post("api.webplug.import.json", { content }),
    exportData: () => client.json("api.webplug.export.json")
  };
}

export function normalizeWebPlugs(payload = {}) {
  const list = payload.list || payload.webplugs || payload.data || [];
  return list.map((item) => ({
    id: Number(item.id),
    name: String(item.name || item.title || "未命名插件"),
    description: String(item.description || ""),
    code: String(item.code || item.content || ""),
    enabled: Boolean(Number(item.enabled ?? item.enable)),
    order: Number(item.order ?? item.load_order ?? 0)
  }));
}
