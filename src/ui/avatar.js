import { el } from "./dom.js";

export function renderAvatar(user = {}, size = 40) {
  const name = String(user.name || "虎").trim() || "虎";
  const fallback = [...name][0] || "虎";
  const node = el(
    "span",
    {
      class: "hm-avatar",
      role: "img",
      "aria-label": `${name}的头像`
    },
    fallback
  );
  node.style.setProperty("--hm-avatar-size", `${size}px`);

  if (user.avatar) {
    const image = el("img", {
      src: user.avatar,
      alt: "",
      loading: "lazy",
      decoding: "async"
    });
    image.addEventListener("error", () => image.remove(), { once: true });
    node.prepend(image);
  }

  return node;
}
