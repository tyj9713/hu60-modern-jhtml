export function detectRoute(url) {
  const source = url instanceof URL ? url : new URL(url, location.href);
  const file = source.pathname.split("/").pop() || "index.index.jhtml";
  const parts = file.split(".");
  const bid = parts.at(-1) || "jhtml";
  const cid = parts[0] || "index";
  const pid = parts[1] || "index";
  const ext = parts.slice(2, -1).map((value) => {
    try {
      return decodeURIComponent(value);
    } catch {
      return value;
    }
  });

  return {
    cid,
    pid,
    ext,
    bid,
    query: new URLSearchParams(source.search),
    hash: source.hash,
    pathname: source.pathname
  };
}
