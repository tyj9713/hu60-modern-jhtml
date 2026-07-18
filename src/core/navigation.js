export function isEligibleNavigation(event, anchor) {
  if (!anchor || event.defaultPrevented || event.button !== 0) return false;
  if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
    return false;
  }
  if (anchor.hasAttribute("download")) return false;
  if (anchor.target && anchor.target !== "_self") return false;

  const target = new URL(anchor.href, location.href);
  if (target.origin !== location.origin) return false;
  const file = target.pathname.split("/").pop() || "";
  return !file.startsWith("admin.");
}

export function createNavigation({
  root = document,
  onNavigate,
  windowRef = window
}) {
  const click = (event) => {
    const anchor = event.target.closest?.("a[href]");
    if (!isEligibleNavigation(event, anchor)) return;
    event.preventDefault();
    const url = new URL(anchor.href, location.href);
    windowRef.history.replaceState(
      {
        ...(windowRef.history.state || {}),
        url: windowRef.location.href,
        scrollY: windowRef.scrollY
      },
      "",
      windowRef.location.href
    );
    windowRef.history.pushState(
      { url: url.href, scrollY: 0 },
      "",
      url
    );
    onNavigate(url);
  };
  const popstate = (event) => {
    Promise.resolve(onNavigate(new URL(windowRef.location.href))).then(() => {
      windowRef.scrollTo(0, Number(event.state?.scrollY || 0));
    });
  };

  root.addEventListener("click", click);
  windowRef.addEventListener("popstate", popstate);

  return () => {
    root.removeEventListener("click", click);
    windowRef.removeEventListener("popstate", popstate);
  };
}
