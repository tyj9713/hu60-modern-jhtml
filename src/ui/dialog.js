import { el } from "./dom.js";

let dialogCount = 0;

export function confirmDialog({
  title,
  message,
  confirmText = "确认",
  danger = false
}) {
  const previous = document.activeElement;
  const titleId = `hm-dialog-title-${++dialogCount}`;

  return new Promise((resolve) => {
    let settled = false;
    const finish = (value) => {
      if (settled) return;
      settled = true;
      backdrop.remove();
      previous?.focus?.();
      resolve(value);
    };

    const cancelButton = el(
      "button",
      {
        class: "hm-button is-ghost hm-touch-target",
        type: "button",
        onclick: () => finish(false)
      },
      "取消"
    );
    const confirmButton = el(
      "button",
      {
        class: `hm-button hm-touch-target ${
          danger ? "is-danger" : "is-primary"
        }`,
        type: "button",
        onclick: () => finish(true)
      },
      confirmText
    );
    const dialog = el(
      "section",
      {
        class: "hm-dialog",
        role: "dialog",
        "aria-modal": "true",
        "aria-labelledby": titleId
      },
      [
        el("span", { class: "hm-dialog-kicker" }, danger ? "谨慎操作" : "请确认"),
        el("h2", { id: titleId }, title),
        el("p", {}, message),
        el("div", { class: "hm-dialog-actions" }, [
          cancelButton,
          confirmButton
        ])
      ]
    );
    const backdrop = el(
      "div",
      {
        class: "hm-dialog-backdrop",
        onclick: (event) => {
          if (event.target === backdrop) finish(false);
        }
      },
      dialog
    );

    dialog.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        finish(false);
      }
      if (event.key === "Tab") {
        const buttons = [cancelButton, confirmButton];
        const direction = event.shiftKey ? -1 : 1;
        const current = buttons.indexOf(document.activeElement);
        const next = (current + direction + buttons.length) % buttons.length;
        event.preventDefault();
        buttons[next].focus();
      }
    });

    document.body.append(backdrop);
    cancelButton.focus();
  });
}
