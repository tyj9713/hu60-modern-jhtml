export function findFencedCodeAt(source, cursor) {
  const text = String(source || "");
  const openingPattern = /^([ \t]*)(`{3,}|~{3,})([^\n]*)\r?\n/gm;
  let opening;

  while ((opening = openingPattern.exec(text))) {
    const marker = opening[2];
    const contentStart = openingPattern.lastIndex;
    const closingPattern = new RegExp(
      `^[ \\t]*${marker[0]}{${marker.length},}[ \\t]*$`,
      "gm"
    );
    closingPattern.lastIndex = contentStart;
    const closing = closingPattern.exec(text);
    if (!closing) continue;
    const contentEnd = closing.index;
    if (cursor >= contentStart && cursor <= contentEnd) {
      return {
        language: opening[3].trim().split(/\s+/)[0] || "",
        marker,
        openStart: opening.index,
        contentStart,
        contentEnd,
        closeStart: closing.index,
        closeEnd: closingPattern.lastIndex
      };
    }
    openingPattern.lastIndex = closingPattern.lastIndex;
  }
  return null;
}

export function replaceFencedCode(source, range, formatted) {
  if (!range) return String(source || "");
  const content = String(formatted || "").replace(/\r\n?/g, "\n");
  const normalized = content.endsWith("\n") ? content : `${content}\n`;
  return `${source.slice(0, range.contentStart)}${normalized}${source.slice(
    range.contentEnd
  )}`;
}
