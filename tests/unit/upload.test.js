import { expect, it, vi } from "vitest";
import {
  createUploadQueue,
  uploadFile
} from "../../src/editor/upload.js";

it("inserts markdown URL after successful image upload", async () => {
  const insert = vi.fn();
  const queue = createUploadQueue({
    upload: async () => ({
      url: "https://img/a.png",
      name: "a.png",
      size: 3,
      content: "[img]x[/img]"
    }),
    insert,
    getMode: () => "markdown"
  });

  await queue.add([
    new File(["abc"], "a.png", { type: "image/png" })
  ]);
  expect(insert).toHaveBeenCalledWith("![a.png](https://img/a.png)");
  expect(queue.getItems()[0]).toMatchObject({
    status: "success",
    progress: 100
  });
});

it("uses server UBB content and keeps multiple files in order", async () => {
  const inserted = [];
  const queue = createUploadQueue({
    upload: async (file) => ({
      url: `https://img/${file.name}`,
      name: file.name,
      size: file.size,
      content: `[img]${file.name}[/img]`
    }),
    insert: (value) => inserted.push(value),
    getMode: () => "ubb"
  });

  await queue.add([
    new File(["a"], "a.png", { type: "image/png" }),
    new File(["b"], "b.png", { type: "image/png" })
  ]);
  expect(inserted).toEqual(["[img]a.png[/img]", "[img]b.png[/img]"]);
});

it("records upload failures without discarding queued files", async () => {
  const queue = createUploadQueue({
    upload: async () => {
      throw new Error("网络失败");
    },
    insert: vi.fn(),
    getMode: () => "markdown"
  });

  await queue.add([
    new File(["a"], "a.png", { type: "image/png" })
  ]);
  expect(queue.getItems()[0]).toMatchObject({
    status: "error",
    error: "网络失败"
  });
});

it("posts bbs.upload.json with credentials and validates response", async () => {
  const open = vi.fn();
  class FakeXhr {
    upload = {};
    status = 200;
    responseText = JSON.stringify({
      success: true,
      url: "https://img/a.png",
      name: "a.png",
      size: 1,
      content: "[img]a[/img]"
    });
    open(...args) {
      open(...args);
    }
    send(body) {
      this.body = body;
      queueMicrotask(() => this.onload());
    }
    abort() {
      this.onabort?.();
    }
  }
  const xhr = new FakeXhr();
  const result = await uploadFile(
    new File(["a"], "a.png", { type: "image/png" }),
    { xhrFactory: () => xhr }
  );

  expect(open).toHaveBeenCalledWith("POST", "bbs.upload.json");
  expect(xhr.withCredentials).toBe(true);
  expect(xhr.body.get("file").name).toBe("a.png");
  expect(result.url).toBe("https://img/a.png");
});
