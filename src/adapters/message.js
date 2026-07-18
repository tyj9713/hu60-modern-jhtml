import { normalizePagination, number } from "./json.js";

function messageContent(item) {
  return String(item.contentHtml ?? item.content ?? "");
}

export function normalizeMessageList(payload = {}, kind = "inbox") {
  const list = payload.msgList || payload.messageList || payload.messages || [];
  return {
    kind,
    messages: list.map((item) => {
      const outgoing = kind === "outbox";
      return {
        id: number(item.id),
        peerUid: number(outgoing ? item.touid : item.byuid),
        peerName: String(
          outgoing
            ? item.toUinfo?.name || item.toname || ""
            : item.byUinfo?.name || item.byname || ""
        ),
        contentHtml: messageContent(item),
        createdAt: item.ctime || item.createdAt || "",
        unread: !Boolean(number(item.isread)),
        direction: outgoing ? "outgoing" : "incoming"
      };
    }),
    pagination: normalizePagination(
      payload,
      `msg.index.${kind}.all.jhtml`
    ),
    filters: {
      readState: String(payload.readState || payload.filter || "all"),
      showBot: Boolean(payload.showBot)
    },
    actionToken: String(payload.actionToken || payload.token || ""),
    notice: String(payload.notice || payload.error || "")
  };
}

export function normalizeConversation(payload = {}, currentUid = 0) {
  const messages = (
    payload.msgList ||
    payload.messageList ||
    payload.messages ||
    []
  ).map((item) => {
    const outgoing = number(item.byuid) === number(currentUid);
    const peerInfo = outgoing
      ? item.toUinfo || { name: item.toname }
      : item.byUinfo || { name: item.byname };
    return {
      id: number(item.id),
      peerUid: number(outgoing ? item.touid : item.byuid),
      peerName: String(peerInfo?.name || ""),
      peerAvatar: String(peerInfo?.avatar || ""),
      contentHtml: messageContent(item),
      createdAt: item.ctime || item.createdAt || "",
      unread: !Boolean(number(item.isread)),
      direction: outgoing ? "outgoing" : "incoming"
    };
  });
  const first = messages[0] || {};
  return {
    kind: "chat",
    messages,
    peer: {
      uid: number(payload.peer?.uid ?? first.peerUid),
      name: String(payload.peer?.name || first.peerName || "对方"),
      avatar: String(payload.peer?.avatar || first.peerAvatar || "")
    },
    pagination: normalizePagination(payload, "msg.index.chat.jhtml"),
    actionToken: String(payload.actionToken || payload.token || "")
  };
}
