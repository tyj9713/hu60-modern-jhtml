export function createHu60Client(
  fetchImpl = globalThis.fetch.bind(globalThis)
) {
  const request = (url, init = {}) =>
    fetchImpl(url, {
      credentials: "same-origin",
      redirect: "follow",
      ...init
    });

  return {
    async json(url, init) {
      const response = await request(url, init);
      const type = response.headers.get("content-type") || "";

      if (!response.ok) {
        throw new Error(`请求失败：${response.status}`);
      }
      if (!type.includes("json")) {
        throw new Error("预期 JSON，但站点返回了其他页面");
      }

      return response.json();
    },
    async html(url, init) {
      const response = await request(url, init);
      if (!response.ok) {
        throw new Error(`请求失败：${response.status}`);
      }
      return response.text();
    },
    request
  };
}
