import { expect, it, vi } from "vitest";
import {
  normalizeConversation,
  normalizeMessageList
} from "../../src/adapters/message.js";
import {
  mount as mountMessages,
  renderMessages,
  requestClearInbox
} from "../../src/pages/messages.js";

it("maps incoming and outgoing conversation messages", () => {
  const model = normalizeConversation(
    {
      msgList: [
        {
          id: 1,
          byuid: 9,
          touid: 3,
          byUinfo: { name: "对方" },
          content: "你好",
          isread: 0
        },
        {
          id: 2,
          byuid: 3,
          touid: 9,
          toUinfo: { name: "对方" },
          content: "收到",
          isread: 1
        }
      ]
    },
    3
  );

  expect(model.messages.map((item) => item.direction)).toEqual([
    "incoming",
    "outgoing"
  ]);
  expect(model.messages[0].unread).toBe(true);
  expect(model.peer).toMatchObject({ uid: 9, name: "对方" });
});

it("reads prefixed peer names and avatars added by hu60 JSON pages", () => {
  const inbox = normalizeMessageList({
    msgList: [
      {
        id: 3,
        byuid: 9,
        by_u_name: "发件人",
        by_u_avatar: "/avatar/9.jpg",
        content: "带头像的消息"
      }
    ]
  });
  const conversation = normalizeConversation(
    {
      msgList: [
        {
          id: 4,
          byuid: 3,
          touid: 9,
          to_u_name: "对方",
          to_u_avatar: "/avatar/9.jpg",
          content: "发出的消息"
        }
      ]
    },
    3
  );

  expect(inbox.messages[0]).toMatchObject({
    peerUid: 9,
    peerName: "发件人",
    peerAvatar: "/avatar/9.jpg"
  });
  expect(
    renderMessages(inbox).querySelector(".hm-message img")?.src
  ).toContain("/avatar/9.jpg");
  expect(conversation.peer).toMatchObject({
    uid: 9,
    name: "对方",
    avatar: "/avatar/9.jpg"
  });
});

it("normalizes inbox filters and renders all message tabs", () => {
  const model = normalizeMessageList(
    {
      msgList: [
        {
          id: 5,
          byuid: 9,
          byname: "对方",
          content: "<p>消息</p>",
          isread: 0
        }
      ],
      readState: "no",
      currPage: 1,
      maxPage: 2
    },
    "inbox"
  );
  const node = renderMessages(model, {});

  expect(model.filters.readState).toBe("no");
  expect(node.textContent).toContain("收件箱");
  expect(node.textContent).toContain("发件箱");
  expect(node.textContent).toContain("@消息");
  expect(node.querySelector(".is-unread")).not.toBeNull();
  expect(node.querySelector('[aria-label="分页"]')).not.toBeNull();
});

it("clears inbox only after the custom confirmation", async () => {
  const confirm = vi.fn(async () => true);
  const request = vi.fn(async () => new Response("", { status: 200 }));

  await requestClearInbox(
    { request },
    { actionToken: "secure-token" },
    { confirm }
  );

  expect(confirm).toHaveBeenCalledWith(
    expect.objectContaining({ danger: true, confirmText: "确认清空" })
  );
  const body = request.mock.calls[0][1].body;
  expect(body.get("clean")).toBe("msg");
  expect(body.get("actionToken")).toBe("secure-token");
});

it("mounts the editor into private chat with the original send endpoint", async () => {
  const mountEditor = vi.fn(async () => ({ discardDraft: vi.fn() }));
  const shell = {
    setTitle: vi.fn(),
    setMain: vi.fn((node) => document.body.append(node)),
    setSidebar: vi.fn()
  };
  await mountMessages({
    route: {
      cid: "msg",
      pid: "index",
      ext: ["chat", "9"],
      query: new URLSearchParams(),
      hash: ""
    },
    client: {
      json: vi.fn(async () => ({
        peer: { uid: 9, name: "对方" },
        msgList: [
          {
            id: 1,
            byuid: 9,
            touid: 3,
            byUinfo: { name: "对方" },
            content: "你好"
          }
        ],
        _myself: { uid: 3 }
      }))
    },
    shell,
    services: { mountEditor }
  });

  const form = document.querySelector(".hm-message-composer form");
  expect(form.action).toContain("msg.index.send.9.json");
  expect(form.querySelector('[name="content"]')).not.toBeNull();
  expect(form.querySelector('[name="go"]').value).toBe("回复");
  expect(mountEditor).toHaveBeenCalledOnce();
});
