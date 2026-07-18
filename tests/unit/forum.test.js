import { describe, expect, it } from "vitest";
import { normalizeForum } from "../../src/adapters/forum.js";
import { renderForum } from "../../src/pages/forum.js";
import { normalizeSearch } from "../../src/pages/search.js";

describe("forum adapter", () => {
  it("normalizes children, topics, filters and explicit pagination", () => {
    const model = normalizeForum({
      forum: { id: 170, name: "技术交流", description: "讨论开发" },
      parentForumList: [{ id: 0, name: "全部版块" }],
      childForumList: [{ id: 171, name: "前端", intro: "浏览器技术" }],
      topicList: [
        {
          topic_id: 9,
          title: "现代 CSS",
          uinfo: { name: "工程虎", avatar: "/a.jpg" },
          reply_count: 5,
          read_count: 30,
          essence: 1,
          locked: 0
        }
      ],
      currPage: 2,
      maxPage: 4,
      hasNextPage: true,
      onlyEssence: 1
    });

    expect(model.title).toBe("技术交流");
    expect(model.childForums[0]).toEqual({
      id: 171,
      name: "前端",
      description: "浏览器技术"
    });
    expect(model.topics[0]).toMatchObject({
      id: 9,
      replies: 5,
      views: 30,
      essence: true
    });
    expect(model.pagination).toMatchObject({ current: 2, max: 4 });
    expect(model.filters.onlyEssence).toBe(true);
  });

  it("supports the fName, fIndex and childForum fields used by hu60", () => {
    const model = normalizeForum({
      fName: "网站开发",
      fIndex: [
        { id: 0, name: "论坛" },
        { id: 215, name: "网站开发" }
      ],
      childForum: [
        { id: 216, name: "前端开发", description: "浏览器技术" }
      ],
      topicList: [
        {
          topic_id: 10,
          forum_id: 215,
          title: "实际版块主题",
          uid: 9,
          _u_name: "开发者",
          _u_avatar: "/avatar/9.jpg"
        }
      ]
    });

    expect(model).toMatchObject({
      id: 215,
      title: "网站开发",
      breadcrumbs: [
        { id: 0, name: "论坛" },
        { id: 215, name: "网站开发" }
      ]
    });
    expect(model.childForums[0]).toMatchObject({
      id: 216,
      name: "前端开发"
    });
    expect(model.topics[0]).toMatchObject({
      author: { uid: 9, name: "开发者" },
      avatar: "/avatar/9.jpg"
    });
  });

  it("renders forum cards, topic list and pagination", () => {
    const node = renderForum(
      normalizeForum({
        forum: { name: "技术交流" },
        childForumList: [{ id: 171, name: "前端" }],
        topicList: [{ topic_id: 9, title: "现代 CSS", uinfo: { name: "工程虎" } }],
        currPage: 1,
        maxPage: 2,
        hasNextPage: true
      }),
      {}
    );

    expect(node.textContent).toContain("前端");
    expect(node.textContent).toContain("现代 CSS");
    expect(node.querySelector('[aria-label="分页"]')).not.toBeNull();
  });

  it("preserves search mode, keyword and server errors", () => {
    expect(
      normalizeSearch({
        searchType: "reply",
        keyword: "路由",
        error: "关键词过短",
        replyList: [{ topic_id: 3, floor: 2, content: "路由内容" }]
      })
    ).toMatchObject({
      type: "reply",
      keyword: "路由",
      error: "关键词过短"
    });
  });
});
