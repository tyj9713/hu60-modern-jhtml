import { number } from "./json.js";
import { normalizeUserInfo } from "./user-info.js";

const personalSettings = [
  ["修改资料", "user.chinfo.jhtml"],
  ["修改头像", "user.avatar.jhtml"],
  ["修改用户名", "user.chname.jhtml"],
  ["修改密码", "user.chpwd.jhtml"],
  ["收藏主题", "bbs.myfavorite.jhtml"],
  ["关注与屏蔽", "user.relationship.follow.jhtml"],
  ["微信通知", "user.wechat.jhtml"],
  ["网页插件", "addin.webplug.jhtml"]
];

export function normalizeUser(payload = {}) {
  const source = normalizeUserInfo(payload);
  const relationship = payload.relationship || {};
  return {
    uid: number(source.uid ?? source.id),
    name: String(source.name || "用户"),
    avatar: String(source.avatar || ""),
    signature: String(source.signature || source.sign || ""),
    contact: String(source.contact || source.email || ""),
    registeredAt:
      source.regTime ||
      source.regtime ||
      source.ctime ||
      source.registeredAt ||
      "",
    access: number(source.access),
    labels: Array.isArray(source.labels)
      ? source.labels
      : [source.title].filter(Boolean),
    relationship: {
      followed: Boolean(
        relationship.followed ?? payload.followed ?? payload.isFollow
      ),
      blocked: Boolean(
        relationship.blocked ?? payload.blocked ?? payload.isBlock
      ),
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
