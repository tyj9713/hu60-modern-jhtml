import { normalizePagination, normalizeTopicItem } from "./json.js";
import { toBidUrl } from "../core/urls.js";

export function normalizeHome(payload = {}) {
  return {
    topics: (payload.newTopicList || payload.topicList || []).map(
      normalizeTopicItem
    ),
    pagination: normalizePagination(payload, "index.index.jhtml"),
    currentPage: Number(payload.currPage || 1),
    hasNextPage: Boolean(payload.hasNextPage),
    latestChat: payload._myself?.newChats?.[0] || null,
    user: payload.userInfo || payload._uinfo || payload._myself?.user || null,
    forums: payload.forumList || payload.forums || [],
    friendLinks: [],
    friendLinksError: ""
  };
}

export function extractFriendLinks(html) {
  const doc = new DOMParser().parseFromString(html, "text/html");
  return [...doc.querySelectorAll("#friend_links .friend-link-item")]
    .map((item) => {
      const anchor = item.querySelector("a:last-of-type");
      return {
        name: anchor?.textContent?.trim() || "",
        href: anchor?.getAttribute("href") || "",
        avatar: item.querySelector("img")?.getAttribute("src") || ""
      };
    })
    .filter((item) => item.name && item.href);
}

export async function loadHome(client, route) {
  const jsonUrl = toBidUrl(
    { ...route, hash: "" },
    "json",
    {
      _uinfo: "uid,name,avatar",
      _myself: "newMsg,newAtInfo,newChats"
    }
  );
  const model = normalizeHome(await client.json(jsonUrl));

  try {
    model.friendLinks = extractFriendLinks(
      await client.html("index.index.html")
    );
  } catch (error) {
    model.friendLinksError = error?.message || String(error);
  }

  return model;
}
