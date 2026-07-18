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
