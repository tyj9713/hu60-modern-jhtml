import { number } from "./json.js";

const personalSettings = [
  ["修改资料", "user.chinfo.html"],
  ["修改头像", "user.avatar.html"],
  ["修改用户名", "user.chname.html"],
  ["修改密码", "user.chpwd.html"],
  ["收藏主题", "bbs.myfavorite.jhtml"],
  ["关注与屏蔽", "user.relationship.follow.jhtml"],
  ["微信通知", "user.wechat.html"],
  ["网页插件", "addin.webplug.jhtml"]
];

export function normalizeUser(payload = {}) {
  const source =
    payload.uinfo || payload.userInfo || payload.user || payload._uinfo || {};
  const relationship = payload.relationship || {};
  return {
    uid: number(source.uid ?? source.id),
    name: String(source.name || "用户"),
    avatar: String(source.avatar || ""),
    signature: String(source.signature || source.sign || ""),
    contact: String(source.contact || source.email || ""),
    registeredAt: source.regTime || source.ctime || source.registeredAt || "",
    access: number(source.access),
    labels: Array.isArray(source.labels)
      ? source.labels
      : [source.title].filter(Boolean),
    relationship: {
      followed: Boolean(relationship.followed ?? payload.followed),
      blocked: Boolean(relationship.blocked ?? payload.blocked),
      noDisturb: Boolean(relationship.noDisturb ?? payload.noDisturb)
    },
    isSelf: Boolean(payload.isSelf ?? payload.self),
    stats: {
      topics: number(payload.topicCount),
      replies: number(payload.replyCount)
    },
    settings: personalSettings.map(([label, href]) => ({ label, href }))
  };
}
