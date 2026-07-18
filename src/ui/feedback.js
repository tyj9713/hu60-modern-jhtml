import { el } from "./dom.js";

let region;

function getRegion() {
  if (!region?.isConnected) {
    region = document.body.appendChild(
      el("div", {
        class: "hm-toast-region",
        "aria-live": "polite",
        "aria-relevant": "additions"
      })
    );
  }
  return region;
}

export function toast({ kind = "info", title, message = "" }) {
  const host = getRegion();
  const item = el(
    "div",
    {
      class: `hm-toast is-${kind}`,
      role: kind === "error" ? "alert" : "status"
    },
    [
      el("span", { class: "hm-toast-mark", "aria-hidden": "true" }, "●"),
      el("span", { class: "hm-toast-copy" }, [
        el("strong", {}, title),
        message ? el("span", {}, message) : null
      ]),
      el(
        "button",
        {
          class: "hm-toast-close hm-touch-target",
          type: "button",
          "aria-label": "关闭",
          onclick: () => item.remove()
        },
        "×"
      )
    ]
  );

  host.append(item);
  if (kind !== "error") {
    setTimeout(() => item.remove(), 4200);
  }
  return item;
}
