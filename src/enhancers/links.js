export function enhanceLinks(root) {
  for (const anchor of root.querySelectorAll("a[href]")) {
    let url;
    try {
      url = new URL(anchor.href, location.href);
    } catch {
      continue;
    }
    if (!["http:", "https:"].includes(url.protocol)) continue;
    if (url.origin !== location.origin) {
      anchor.target = "_blank";
      anchor.rel = "noopener noreferrer nofollow";
      anchor.classList.add("hm-external-link");
    }
  }
}
