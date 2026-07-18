export function toBidUrl(route, bid, extraParams = {}) {
  const targetBid = route.cid === "admin" ? "html" : bid;
  const segments = [
    route.cid,
    route.pid,
    ...route.ext.map(encodeURIComponent),
    targetBid
  ];
  const query = new URLSearchParams(route.query);

  for (const [key, value] of Object.entries(extraParams)) {
    if (value === null || value === undefined || value === "") {
      query.delete(key);
    } else {
      query.set(key, String(value));
    }
  }

  const suffix = query.size ? `?${query}` : "";
  return `${segments.join(".")}${suffix}${route.hash || ""}`;
}
