import { normalizePagination, number } from "./json.js";

export function normalizeTopic(payload = {}) {
  const topic = payload.topic || payload.topicMeta || {};
  const id = number(topic.id ?? topic.topic_id ?? payload.topic_id);
  const posts = (
    payload.contentList ||
    payload.replyList ||
    payload.posts ||
    []
  ).map((item) => ({
    floor: number(item.floor),
    contentHtml: String(item.contentHtml ?? item.content ?? ""),
    author: item.uinfo || item.author || {},
    avatar: item.uinfo?.avatar || item.avatar || "",
    createdAt: item.ctime || item.createdAt || "",
    canEdit: Boolean(item.canEdit),
    canDelete: Boolean(item.canDel ?? item.canDelete),
    canSink: Boolean(item.canSink),
    canMove: Boolean(item.canMove),
    canSetEssence: Boolean(item.canSetEssence),
    canLockReply: Boolean(item.canLockReply)
  }));
  return {
    meta: {
      id,
      title: String(topic.title || payload.title || "主题"),
      uid: number(topic.uid),
      locked: number(topic.locked),
      review: Boolean(number(topic.review)),
      readCount: number(topic.read_count ?? topic.readCount)
    },
    posts,
    canReply: Boolean(payload.canReply) && !number(topic.locked),
    token: String(payload.actionToken || payload.token || ""),
    pagination: normalizePagination(payload, `bbs.topic.${id}.jhtml`),
    notice: String(payload.notice || payload.error || "")
  };
}
