import {
  normalizePagination,
  normalizeTopicItem,
  number
} from "./json.js";

export function normalizeForum(payload = {}) {
  const forum = payload.forum || payload.forumInfo || {};
  const breadcrumbs = (
    payload.parentForumList ||
    payload.breadcrumbs ||
    payload.fIndex ||
    []
  ).map((item) => ({ id: number(item.id), name: String(item.name || "") }));
  const forumId = number(
    forum.id ??
      payload.forumId ??
      breadcrumbs[breadcrumbs.length - 1]?.id
  );
  return {
    id: forumId,
    title: String(forum.name || payload.fName || payload.title || "论坛"),
    description: String(forum.description || forum.intro || ""),
    breadcrumbs,
    childForums: (
      payload.childForumList ||
      payload.childForums ||
      payload.childForum ||
      []
    ).map(
      (item) => ({
        id: number(item.id),
        name: String(item.name || ""),
        description: String(item.description || item.intro || "")
      })
    ),
    topics: (payload.topicList || payload.topics || []).map(normalizeTopicItem),
    pagination: normalizePagination(
      payload,
      `bbs.forum.${forumId}.jhtml`
    ),
    filters: {
      onlyEssence: Boolean(number(payload.onlyEssence))
    },
    notice: String(payload.notice || payload.error || "")
  };
}
