export function number(value, fallback = 0) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

export function normalizePagination(payload, base = "") {
  const current = Math.max(1, number(payload.currPage ?? payload.page, 1));
  const max = Math.max(
    current,
    number(payload.maxPage ?? payload.pageCount, current)
  );
  const hasPrevious = current > 1;
  const hasNext =
    payload.hasNextPage === undefined
      ? current < max
      : Boolean(payload.hasNextPage);
  const url = (page) => {
    const query = new URLSearchParams();
    query.set("p", String(page));
    return `${base}${base.includes("?") ? "&" : "?"}${query}`;
  };

  return {
    current,
    max,
    previousUrl: hasPrevious ? url(current - 1) : "",
    nextUrl: hasNext ? url(current + 1) : ""
  };
}

export function normalizeTopicItem(item = {}) {
  return {
    id: number(item.topic_id ?? item.id),
    forumId: number(item.forum_id),
    title: String(item.title || ""),
    author: item.uinfo || item.author || {},
    avatar: item.uinfo?.avatar || item.avatar || "",
    replies: number(item.reply_count ?? item.replies),
    views: number(item.read_count ?? item.views),
    createdAt: item.ctime || item.createdAt || "",
    updatedAt: item.mtime || item.updatedAt || "",
    forumName: String(item.forum_name || ""),
    essence: Boolean(number(item.essence)),
    locked: number(item.locked),
    review: Boolean(number(item.review))
  };
}
