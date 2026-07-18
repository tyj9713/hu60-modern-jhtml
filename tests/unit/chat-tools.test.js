import { expect, it, vi } from "vitest";
import {
  normalizeChatMessages,
  normalizeChatRooms
} from "../../src/adapters/chat.js";
import { extractCoderForm, normalizeUa } from "../../src/adapters/tools.js";
import {
  createWebPlugAdapter,
  normalizeWebPlugs
} from "../../src/adapters/webplug.js";
import { mount as mountChat, renderChat } from "../../src/pages/chat.js";

it("keeps chat avatar, room, floor and permissions", () => {
  const model = normalizeChatMessages({
    roomName: "公共聊天室",
    chatList: [
      {
        lid: 9,
        uid: 3,
        uinfo: { name: "旧人", avatar: "/a.jpg" },
        content: "你好",
        canDel: true
      }
    ],
    currPage: 1,
    maxPage: 3
  });

  expect(model.messages[0]).toMatchObject({
    floor: 9,
    avatar: "/a.jpg",
    canDelete: true
  });
  const node = renderChat(model, {});
  expect(node.textContent).toContain("公共聊天室");
  expect(node.textContent).toContain("旧人");
  expect(node.textContent).toContain("删除");
});

it("reads flat hu60 chat author and avatar fields", () => {
  const model = normalizeChatMessages({
    roomName: "公共聊天室",
    chatList: [
      {
        lid: 10,
        uid: 12,
        _u_name: "聊天用户",
        _u_avatar: "/avatar/12.jpg",
        content: "真实消息"
      }
    ]
  });

  expect(model.messages[0]).toMatchObject({
    author: { uid: 12, name: "聊天用户" },
    avatar: "/avatar/12.jpg"
  });
});

it("normalizes room list and keeps bot visibility", () => {
  expect(
    normalizeChatRooms({
      roomList: [
        { name: "公共聊天室", count: 12 },
        { room: "技术交流", online: 3 }
      ],
      showBot: 1
    })
  ).toMatchObject({
    showBot: true,
    rooms: [
      { name: "公共聊天室", count: 12 },
      { name: "技术交流", count: 3 }
    ]
  });
});

it("supports the chatRomList key used by the live room index", () => {
  expect(
    normalizeChatRooms({
      chatRomList: [
        { name: "公共聊天室", count: 12 },
        { room: "技术茶馆", online: 3 }
      ]
    }).rooms
  ).toEqual([
    {
      name: "公共聊天室",
      count: 12,
      description: ""
    },
    {
      name: "技术茶馆",
      count: 3,
      description: ""
    }
  ]);
});

it("extracts all coder actions and charsets", () => {
  const model = extractCoderForm(`
    <form action="tools.coder.html" method="post">
      <textarea name="content"></textarea>
      <select name="code"><option value="UTF-8">UTF-8</option></select>
      <select name="action"><option value="eurl">URL编码</option></select>
    </form>
  `);

  expect(
    model.fields.find((field) => field.name === "action").options[0].value
  ).toBe("eurl");
  expect(model.fields.find((field) => field.name === "code").value).toBe(
    "UTF-8"
  );
});

it("normalizes UA data without reading browser cookies", () => {
  const model = normalizeUa({
    ip: "127.0.0.1",
    location: "本地",
    proxy: "none",
    header: { "user-agent": "Test UA", cookie: "secret" }
  });

  expect(model.headers["user-agent"]).toBe("Test UA");
  expect(model.headers.cookie).toBeUndefined();
});

it("uses existing webplug API endpoints and encoded POST bodies", async () => {
  const json = vi.fn(async () => ({}));
  const adapter = createWebPlugAdapter({ json });

  await adapter.enable(7, true);
  await adapter.reorder([7, 2]);

  expect(json).toHaveBeenNthCalledWith(
    1,
    "api.webplug.enable.json",
    expect.objectContaining({ method: "POST" })
  );
  expect(json.mock.calls[0][1].body.get("enabled")).toBe("1");
  expect(json.mock.calls[1][1].body.get("order")).toBe("[7,2]");
});

it("covers the complete existing webplug API contract", async () => {
  const json = vi.fn(async () => ({}));
  const adapter = createWebPlugAdapter({ json });

  await adapter.list();
  await adapter.get(7);
  await adapter.add({ name: "插件", code: "console.log(1)" });
  await adapter.update({ id: 7, name: "新名称" });
  await adapter.enable(7, false);
  await adapter.remove(7);
  await adapter.importData("backup");
  await adapter.exportData();

  expect(json.mock.calls.map(([url]) => url)).toEqual([
    "api.webplug.list.json",
    "api.webplug.get.json",
    "api.webplug.add.json",
    "api.webplug.update.json",
    "api.webplug.enable.json",
    "api.webplug.delete.json",
    "api.webplug.import.json",
    "api.webplug.export.json"
  ]);
  expect(json.mock.calls[4][1].body.get("enabled")).toBe("0");
  expect(json.mock.calls[6][1].body.get("content")).toBe("backup");
});

it("normalizes every supported webplug response shape and legacy field", () => {
  expect(
    normalizeWebPlugs({
      list: [
        {
          id: "1",
          name: "A",
          description: "说明",
          code: "a()",
          enabled: "1",
          order: "2"
        },
        {
          id: "2",
          title: "B",
          content: "b()",
          enable: "0",
          load_order: "3"
        },
        { id: "3" }
      ]
    })
  ).toEqual([
    {
      id: 1,
      name: "A",
      description: "说明",
      code: "a()",
      enabled: true,
      order: 2
    },
    {
      id: 2,
      name: "B",
      description: "",
      code: "b()",
      enabled: false,
      order: 3
    },
    {
      id: 3,
      name: "未命名插件",
      description: "",
      code: "",
      enabled: false,
      order: 0
    }
  ]);
  expect(normalizeWebPlugs({ webplugs: [{ id: 4, name: "C" }] })).toHaveLength(1);
  expect(normalizeWebPlugs({ data: [{ id: 5, name: "D" }] })).toHaveLength(1);
  expect(normalizeWebPlugs()).toEqual([]);
});

it("mounts a token-preserving modern composer in chat rooms", async () => {
  const mountEditor = vi.fn(async () => ({ discardDraft: vi.fn() }));
  const shell = {
    setTitle: vi.fn(),
    setMain: vi.fn((node) => document.body.append(node)),
    setSidebar: vi.fn()
  };
  await mountChat({
    route: {
      cid: "addin",
      pid: "chat",
      ext: ["技术茶馆"],
      query: new URLSearchParams(),
      hash: ""
    },
    client: {
      json: vi.fn(async () => ({
        roomName: "技术茶馆",
        token: "chat-token",
        chatList: [],
        canPost: true
      }))
    },
    shell,
    services: { mountEditor }
  });

  const form = document.querySelector(".hm-chat-composer form");
  expect(form.action).toContain("addin.chat.%E6%8A%80%E6%9C%AF%E8%8C%B6%E9%A6%86.json");
  expect(form.querySelector('[name="token"]').value).toBe("chat-token");
  expect(form.querySelector('[name="go"]').value).toBe("快速发言");
  expect(mountEditor).toHaveBeenCalledOnce();
});
