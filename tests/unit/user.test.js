import { expect, it } from "vitest";
import { normalizeUser } from "../../src/adapters/user.js";
import { renderUserPage } from "../../src/pages/user.js";

it("normalizes profile, relationship and personal-center entries", () => {
  const model = normalizeUser({
    uinfo: {
      uid: 3,
      name: "工程虎",
      avatar: "/avatar/3.jpg",
      signature: "保持好奇",
      contact: "mail@example.com",
      regTime: "2020-01-01",
      access: 1
    },
    relationship: { followed: true, blocked: false },
    isSelf: true
  });

  expect(model).toMatchObject({
    uid: 3,
    name: "工程虎",
    signature: "保持好奇",
    relationship: { followed: true, blocked: false },
    isSelf: true
  });
  expect(model.settings.map((item) => item.label)).toContain("修改头像");
  expect(model.settings.map((item) => item.label)).toContain("网页插件");
});

it("supports the flat user.index JSON contract and avatar enrichment", () => {
  const model = normalizeUser({
    uid: 3,
    name: "旧人",
    _u_avatar: "/avatar/3.jpg",
    signature: "保持好奇",
    regtime: "2020-01-01",
    isFollow: true,
    isBlock: false,
    isSelf: true
  });

  expect(model).toMatchObject({
    uid: 3,
    name: "旧人",
    avatar: "/avatar/3.jpg",
    registeredAt: "2020-01-01",
    relationship: { followed: true, blocked: false },
    isSelf: true
  });
});

it("renders profile details, message entry and settings for self", () => {
  const node = renderUserPage(
    normalizeUser({
      uinfo: {
        uid: 3,
        name: "工程虎",
        signature: "保持好奇",
        contact: "mail@example.com"
      },
      isSelf: true
    }),
    {}
  );

  expect(node.textContent).toContain("工程虎");
  expect(node.textContent).toContain("保持好奇");
  expect(node.querySelector('a[href*="msg.index.send.3"]')).not.toBeNull();
  expect(node.textContent).toContain("个人设置");
});
