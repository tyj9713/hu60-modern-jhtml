const blockPattern =
  /^\s*(?:#{1,6}\s|[-*+]\s|>\s?|\d+[.)]\s|\|.*\||`{3,}|~{3,}|-{3,}\s*$)/;
const sentenceEndPattern = /[。！？；：.!?;:]$/;
const cjkPattern = /[\u3400-\u9fff]/;

export function formatLayout(source) {
  const original = String(source || "");
  const lines = original.replace(/\r\n?/g, "\n").split("\n");
  const output = [];
  let fence = "";
  let blank = false;

  for (const rawLine of lines) {
    const marker = rawLine.match(/^\s*(`{3,}|~{3,})/);
    if (marker) {
      if (!fence) fence = marker[1][0];
      else if (fence === marker[1][0]) fence = "";
      output.push(rawLine.trimEnd());
      blank = false;
      continue;
    }
    if (fence) {
      output.push(rawLine);
      continue;
    }

    const line = rawLine.trimEnd();
    if (!line.trim()) {
      if (!blank && output.length) output.push("");
      blank = true;
      continue;
    }
    blank = false;

    const previous = output.at(-1);
    const canMerge =
      previous &&
      !blockPattern.test(previous) &&
      !blockPattern.test(line) &&
      cjkPattern.test(previous) &&
      cjkPattern.test(line) &&
      !sentenceEndPattern.test(previous);
    if (canMerge) output[output.length - 1] = `${previous}${line.trimStart()}`;
    else output.push(line);
  }

  while (output.at(-1) === "") output.pop();
  const formatted = output.join("\n");
  return {
    output: formatted,
    changes:
      formatted === original
        ? []
        : [{ type: "replace", before: original, after: formatted, line: 1 }]
  };
}
