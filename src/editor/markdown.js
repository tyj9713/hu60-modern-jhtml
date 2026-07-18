const MARKER = "<!-- markdown -->";

export function stripMarkdownMarker(source) {
  return String(source || "").replace(
    /^\s*(?:<!--\s*markdown\s*-->|<!md>)\s*/i,
    ""
  );
}

export function ensureMarkdownMarker(source) {
  return `${MARKER}\n${stripMarkdownMarker(source)}`;
}

export function transformMarkdownCompatibility(source) {
  const lines = String(source || "")
    .replace(/\r\n?/g, "\n")
    .split("\n");
  let fence = "";
  const warnings = [];
  const output = lines
    .map((line) => {
      const marker = line.match(/^\s*(`{3,}|~{3,})/);
      if (marker) {
        if (!fence) fence = marker[1][0];
        else if (fence === marker[1][0]) fence = "";
        return line;
      }
      if (fence) return line;
      return line
        .replace(/^(\s*[-*+]\s+)\[x\]\s+/i, "$1☑ ")
        .replace(/^(\s*[-*+]\s+)\[\s\]\s+/, "$1☐ ");
    })
    .join("\n");

  if (/(^|[^\\])~~.+?~~/.test(output)) {
    warnings.push("删除线将在发布前转换为 hu60 兼容样式");
  }
  return { output, warnings };
}
