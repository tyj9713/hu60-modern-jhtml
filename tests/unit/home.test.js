import { describe, expect, it, vi } from "vitest";
import {
  extractFriendLinks,
  loadHome,
  normalizeHome
} from "../../src/adapters/home.js";
import { renderHome } from "../../src/pages/home.js";

describe("home adapter", () => {
  it("keeps topics, newest chat and same-origin friend links", () => {
    const model = normalizeHome({
      newTopicList: [
        {
          topic_id: 8,
          title: "测试",
          forum_id: 170,
          forum_name: "技术交流",
          uinfo: { name: "旧人", avatar: "/avatar/u.jpg" },
          reply_count: 3,
          read_count: 20
        }
      ],
      _myself: {
        newChats: [
          { room: "公共聊天室", name: "胡图图", content: "你好" }
        ]
      },
      currPage: 1,
      hasNextPage: true
    });

    expect(model.topics[0]).toMatchObject({
      id: 8,
      forumId: 170,
      replies: 3,
      views: 20
    });
    expect(model.latestChat.room).toBe("公共聊天室");

    const links = extractFriendLinks(`
      <div id="friend_links"><div class="friend-link-item">
        <img src="/avatar/1.jpg"><a href="/q.php/link.friend.0.html">虎友</a>
      </div></div>
    `);
    expect(links).toEqual([
      {
        name: "虎友",
        href: "/q.php/link.friend.0.html",
        avatar: "/avatar/1.jpg"
      }
    ]);
  });

  it("reads the flat user and avatar fields returned by hu60", () => {
    const model = normalizeHome({
      newTopicList: [
        {
          topic_id: 107441,
          title: "真实接口主题",
          uid: 17189,
          _u_name: "森森",
          _u_avatar: "https://file.hu60.cn/avatar/17189.jpg",
          uinfo: { name: "森森" }
        }
      ],
      userInfo: {
        uid: 3,
        name: "旧人",
        avatar: "https://file.hu60.cn/avatar/3.jpg"
      }
    });

    expect(model.topics[0]).toMatchObject({
      author: { uid: 17189, name: "森森" },
      avatar: "https://file.hu60.cn/avatar/17189.jpg"
    });
    expect(model.user).toMatchObject({
      uid: 3,
      name: "旧人",
      avatar: "https://file.hu60.cn/avatar/3.jpg"
    });
  });

  it("normalizes the latest chat author from flat extra fields", () => {
    const model = normalizeHome({
      _myself: {
        newChats: [
          {
            room: "公共聊天室",
            uid: 12,
            _u_name: "聊天用户",
            _u_avatar: "/avatar/12.jpg",
            content: "最新消息"
          }
        ]
      }
    });

    expect(model.latestChat).toMatchObject({
      room: "公共聊天室",
      name: "聊天用户",
      avatar: "/avatar/12.jpg"
    });
  });

  it("loads JSON and treats friend-link failure as recoverable", async () => {
    const client = {
      json: vi.fn(async () => ({ newTopicList: [] })),
      html: vi.fn(async () => {
        throw new Error("classic page unavailable");
      })
    };
    const model = await loadHome(client, {
      cid: "index",
      pid: "index",
      ext: [],
      bid: "jhtml",
      query: new URLSearchParams(),
      hash: ""
    });

    expect(model.friendLinks).toEqual([]);
    expect(model.friendLinksError).toContain("classic page unavailable");
    expect(client.json).toHaveBeenCalledWith(
      expect.stringContaining("index.index.json")
    );
  });

  it("renders topic density and sidebar summaries", () => {
    const node = renderHome(
      {
        ...normalizeHome({
          newTopicList: [
            {
              topic_id: 8,
              title: "Vite 构建实践",
              uinfo: { name: "旧人" },
              reply_count: 3
            }
          ],
          _myself: {
            newChats: [
              { room: "公共聊天室", name: "胡图图", content: "你好" }
            ]
          }
        }),
        friendLinks: [{ name: "虎友", href: "/friend", avatar: "" }]
      },
      {}
    );

    expect(node.main.textContent).toContain("Vite 构建实践");
    expect(node.sidebar.textContent).toContain("虎友网站");
    expect(node.sidebar.textContent).toContain("公共聊天室");
  });
});
