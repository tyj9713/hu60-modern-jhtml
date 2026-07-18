export function el(tag, attrs = {}, children = []) {
  const node = document.createElement(tag);

  for (const [key, value] of Object.entries(attrs)) {
    if (key === "class") {
      node.className = value;
    } else if (key.startsWith("on") && typeof value === "function") {
      node.addEventListener(key.slice(2).toLowerCase(), value);
    } else if (value !== false && value !== null && value !== undefined) {
      node.setAttribute(key, value === true ? "" : String(value));
    }
  }

  for (const child of [children].flat(Infinity)) {
    if (child === false || child === null || child === undefined) continue;
    node.append(
      child instanceof Node
        ? child
        : document.createTextNode(String(child))
    );
  }

  return node;
}
