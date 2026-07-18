import { normalizePagination, number } from "./json.js";
import { normalizeUserInfo } from "./user-info.js";

export function normalizeTopic(payload = {}) {
  const topic = payload.topic || payload.topicMeta || payload.tMeta || {};
  const sourcePosts =
    payload.contentList ||
    payload.replyList ||
    payload.posts ||
    payload.tContents ||
    [];
  const id = number(
    topic.id ??
      topic.topic_id ??
      payload.topic_id ??
      sourcePosts[0]?.topic_id
  );
  const posts = (
    sourcePosts
  ).map((item) => {
    const author = normalizeUserInfo(item, item.author || {});
    return {
      floor: number(item.floor),
      contentHtml: String(item.contentHtml ?? item.content ?? ""),
      author,
      avatar: author.avatar,
      createdAt: item.ctime || item.createdAt || "",
      canEdit: Boolean(item.canEdit),
      canDelete: Boolean(item.canDel ?? item.canDelete),
      canSink: Boolean(item.canSink),
      canMove: Boolean(item.canMove),
      canSetEssence: Boolean(item.canSetEssence),
      canLockReply: Boolean(item.canLockReply)
    };
  });
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
