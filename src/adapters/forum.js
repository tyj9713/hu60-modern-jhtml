import {
  normalizePagination,
  normalizeTopicItem,
  number
} from "./json.js";

export function normalizeForum(payload = {}) {
  const forum = payload.forum || payload.forumInfo || {};
  const forumId = number(forum.id ?? payload.forumId);
  return {
    id: forumId,
    title: String(forum.name || payload.title || "论坛"),
    description: String(forum.description || forum.intro || ""),
    breadcrumbs: (
      payload.parentForumList ||
      payload.breadcrumbs ||
      []
    ).map((item) => ({ id: number(item.id), name: String(item.name || "") })),
    childForums: (payload.childForumList || payload.childForums || []).map(
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
