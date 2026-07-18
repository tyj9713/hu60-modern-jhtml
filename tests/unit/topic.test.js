import { describe, expect, it } from "vitest";
import { normalizeTopic } from "../../src/adapters/topic.js";
import { renderTopic } from "../../src/pages/topic.js";

describe("topic adapter", () => {
  it("preserves posts, avatars, permissions, token and pagination", () => {
    const model = normalizeTopic({
      topic: {
        id: 12,
        title: "异步任务设计",
        uid: 2,
        locked: 0,
        read_count: 88
      },
      contentList: [
        {
          floor: 0,
          content: "<p>正文</p>",
          uinfo: { uid: 2, name: "楼主", avatar: "/a.jpg" },
          canEdit: true,
          canDel: true,
          canSink: true
        },
        {
          floor: 1,
          content: '<img src="/img/face/smile.gif">',
          uinfo: { uid: 3, name: "回复者" }
        }
      ],
      canReply: true,
      actionToken: "token-1",
      currPage: 1,
      maxPage: 2,
      hasNextPage: true
    });

    expect(model.meta).toMatchObject({
      id: 12,
      title: "异步任务设计",
      readCount: 88
    });
    expect(model.posts[0]).toMatchObject({
      floor: 0,
      avatar: "/a.jpg",
      canEdit: true,
      canDelete: true,
      canSink: true
    });
    expect(model.token).toBe("token-1");
    expect(model.pagination.nextUrl).toContain("p=2");
  });

  it("supports the live tMeta and tContents response contract", () => {
    const model = normalizeTopic({
      tMeta: {
        title: "线上主题",
        uid: 17189,
        _u_name: "森森",
        _u_avatar: "https://file.hu60.cn/avatar/17189.jpg",
        read_count: 42,
        locked: 0
      },
      tContents: [
        {
          id: 9001,
          topic_id: 107441,
          floor: 0,
          uid: 17189,
          _u_name: "森森",
          _u_avatar: "https://file.hu60.cn/avatar/17189.jpg",
          content: "<p>主题正文</p>",
          canEdit: true
        },
        {
          id: 9002,
          topic_id: 107441,
          floor: 1,
          uid: 8,
          _u_name: "回复者",
          _u_avatar: "/avatar/8.jpg",
          content: "<p>回复内容</p>"
        }
      ],
      canReply: true,
      currPage: 1,
      maxPage: 1
    });

    expect(model.meta).toMatchObject({
      id: 107441,
      title: "线上主题",
      readCount: 42
    });
    expect(model.posts).toHaveLength(2);
    expect(model.posts[0]).toMatchObject({
      author: { uid: 17189, name: "森森" },
      avatar: "https://file.hu60.cn/avatar/17189.jpg",
      contentHtml: "<p>主题正文</p>"
    });
    expect(model.canReply).toBe(true);
    expect(model.pagination.nextUrl).toBe("");
  });

  it("renders server content without executable scripts and shows actions", () => {
    const node = renderTopic(
      normalizeTopic({
        topic: { id: 12, title: "安全正文", read_count: 10 },
        contentList: [
          {
            floor: 0,
            content:
              '<p>可信内容</p><script>window.__executed = true</script><pre><code class="language-js">const x=1</code></pre>',
            uinfo: { name: "楼主" },
            canEdit: true,
            canDel: true
          }
        ],
        canReply: true
      }),
      {}
    );

    expect(node.textContent).toContain("可信内容");
    expect(node.querySelector("script")).toBeNull();
    expect(node.textContent).toContain("编辑");
    expect(node.textContent).toContain("删除");
    expect(node.querySelector(".hm-code-toolbar")).not.toBeNull();
  });
});
