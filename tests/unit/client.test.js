import { expect, it, vi } from "vitest";
import { createHu60Client } from "../../src/core/client.js";

it("uses same-origin credentials and rejects non-json responses", async () => {
  const fetchImpl = vi.fn(
    async () =>
      new Response("<html>login</html>", {
        status: 200,
        headers: { "content-type": "text/html" }
      })
  );
  const client = createHu60Client(fetchImpl);

  await expect(client.json("bbs.topic.1.json")).rejects.toThrow("预期 JSON");
  expect(fetchImpl).toHaveBeenCalledWith(
    "bbs.topic.1.json",
    expect.objectContaining({
      credentials: "same-origin"
    })
  );
});

it("reports HTTP failures before parsing response bodies", async () => {
  const client = createHu60Client(
    async () =>
      new Response("busy", {
        status: 503,
        headers: { "content-type": "text/plain" }
      })
  );

  await expect(client.html("index.index.html")).rejects.toThrow(
    "请求失败：503"
  );
});

it("parses successful JSON and HTML responses", async () => {
  const fetchImpl = vi
    .fn()
    .mockResolvedValueOnce(
      new Response(JSON.stringify({ ok: true }), {
        status: 200,
        headers: { "content-type": "application/json;charset=UTF-8" }
      })
    )
    .mockResolvedValueOnce(new Response("<main>ok</main>", { status: 200 }));
  const client = createHu60Client(fetchImpl);

  await expect(client.json("index.index.json")).resolves.toEqual({ ok: true });
  await expect(client.html("index.index.html")).resolves.toBe("<main>ok</main>");
});

it("rejects failed JSON responses before checking their content type", async () => {
  const client = createHu60Client(
    async () =>
      new Response("denied", {
        status: 401,
        headers: { "content-type": "text/plain" }
      })
  );

  await expect(client.json("user.index.json")).rejects.toThrow("请求失败：401");
});
