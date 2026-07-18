import { normalizePagination, number } from "./json.js";

export function normalizeChatRooms(payload = {}) {
  return {
    mode: "rooms",
    rooms: (payload.roomList || payload.rooms || []).map((item) => ({
      name: String(item.name || item.room || ""),
      count: number(item.count ?? item.online),
      description: String(item.description || "")
    })),
    showBot: Boolean(number(payload.showBot)),
    actionToken: String(payload.actionToken || payload.token || ""),
    notice: String(payload.notice || payload.error || "")
  };
}

export function normalizeChatMessages(payload = {}) {
  const room = String(
    payload.roomName || payload.chatRomName || payload.room || "聊天室"
  );
  return {
    mode: "messages",
    room,
    messages: (payload.chatList || payload.messages || []).map((item) => ({
      id: number(item.id ?? item.lid),
      floor: number(item.lid ?? item.floor),
      uid: number(item.uid),
      author: item.uinfo || {},
      avatar: String(item.uinfo?.avatar || item.avatar || ""),
      contentHtml: String(item.contentHtml ?? item.content ?? ""),
      createdAt: item.ctime || item.createdAt || "",
      canDelete: Boolean(item.canDel ?? item.canDelete),
      canViewSource: Boolean(item.canViewSource ?? item.canSource)
    })),
    showBot: Boolean(number(payload.showBot)),
    pagination: normalizePagination(
      payload,
      `addin.chat.${encodeURIComponent(room)}.jhtml`
    ),
    actionToken: String(payload.actionToken || payload.token || ""),
    canPost: payload.canPost !== false,
    notice: String(payload.notice || payload.error || "")
  };
}
