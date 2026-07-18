import { createDraftStore } from "./drafts.js";
import {
  findFencedCodeAt,
  replaceFencedCode
} from "./fenced-code.js";
import { formatLayout } from "./layout.js";
import {
  ensureMarkdownMarker,
  stripMarkdownMarker,
  transformMarkdownCompatibility
} from "./markdown.js";
import { renderServerPreview } from "./preview.js";
import { createEditorToolbar } from "./toolbar.js";
import {
  bindUploadInteractions,
  createUploadQueue
} from "./upload.js";
import { el } from "../ui/dom.js";

export function mountEditor(options) {
  const {
    form,
    textarea,
    titleInput,
    uid = 0,
    routeKey = "",
    targetId = "",
    previewUrl,
    services = {}
  } = options;
  let mode = options.mode === "ubb" ? "ubb" : "markdown";
  let previewController;
  let saveTimer;
  const draftStore =
    services.draftStore ||
    createDraftStore(services.storage || globalThis.localStorage);
  const identity = { uid, route: routeKey, target: targetId };
  const initialDraft = draftStore.load(identity);
  const previewPane = el("div", {
    class: "hm-editor-preview",
    "aria-live": "polite"
  });
  const modeSwitch = el("div", { class: "hm-mode-switch" });
  const uploadInput = el("input", {
    type: "file",
    accept: "image/*",
    multiple: true,
    hidden: true
  });
  const uploadStatus = el("div", {
    class: "hm-upload-status",
    "aria-live": "polite"
  });
  const insertAtCursor = (value) => {
    const start = textarea.selectionStart ?? textarea.value.length;
    const end = textarea.selectionEnd ?? start;
    const prefix = start && !textarea.value.slice(0, start).endsWith("\n")
      ? "\n"
      : "";
    const suffix =
      end < textarea.value.length &&
      !textarea.value.slice(end).startsWith("\n")
        ? "\n"
        : "";
    const insertion = `${prefix}${value}${suffix}`;
    textarea.setRangeText(insertion, start, end, "end");
    textarea.dispatchEvent(new Event("input", { bubbles: true }));
  };
  const uploadQueue = createUploadQueue({
    upload: services.upload,
    insert: insertAtCursor,
    getMode: () => mode,
    onChange(items) {
      uploadStatus.replaceChildren(
        ...items.map((item) =>
          el(
            "span",
            { class: `is-${item.status}` },
            item.status === "uploading"
              ? `${item.file.name} ${item.progress}%`
              : item.status === "success"
                ? `${item.file.name} 已插入`
                : item.status === "error"
                  ? `${item.file.name}：${item.error}`
                  : `${item.file.name} ${item.status}`
          )
        )
      );
    }
  });

  const saveDraft = () => {
    clearTimeout(saveTimer);
    saveTimer = setTimeout(
      () =>
        draftStore.save({
          ...identity,
          mode,
          body: textarea.value,
          title: titleInput?.value || ""
        }),
      500
    );
  };
  const applyLayout = () => {
    const result = formatLayout(textarea.value);
    textarea.value = result.output;
    textarea.dispatchEvent(new Event("input", { bubbles: true }));
    services.toast?.({
      kind: "success",
      title: result.changes.length ? "排版已整理" : "正文已经很整齐"
    });
  };
  const formatActiveCode = async () => {
    const source = textarea.value;
    const range = findFencedCodeAt(source, textarea.selectionStart || 0);
    if (!range) {
      services.toast?.({
        kind: "info",
        title: "请把光标放进代码块",
        message: "支持 Markdown 的 ``` 或 ~~~ 围栏代码块。"
      });
      return false;
    }
    const formatter =
      services.formatCode ||
      (async (...args) => {
        const module = await import("../formatters/registry.js");
        return module.formatCode(...args);
      });
    try {
      const formatted = await formatter(
        range.language,
        source.slice(range.contentStart, range.contentEnd)
      );
      textarea.value = replaceFencedCode(source, range, formatted);
      textarea.setSelectionRange(
        range.contentStart,
        range.contentStart + String(formatted).trimEnd().length
      );
      textarea.dispatchEvent(new Event("input", { bubbles: true }));
      services.toast?.({ kind: "success", title: "代码已格式化" });
      return true;
    } catch (error) {
      services.toast?.({
        kind: "error",
        title: "代码格式化失败，原文未修改",
        message: error?.message || String(error)
      });
      return false;
    }
  };
  const preview = async () => {
    previewController?.abort();
    previewController = new AbortController();
    previewPane.textContent = "正在生成服务器预览…";
    try {
      previewPane.innerHTML = await renderServerPreview({
        client: services.client,
        url: previewUrl,
        form,
        content: textarea.value,
        mode,
        signal: previewController.signal
      });
      return previewPane.innerHTML;
    } catch (error) {
      if (error.name !== "AbortError") {
        previewPane.textContent = error.message;
        services.toast?.({
          kind: "error",
          title: "预览失败",
          message: error.message
        });
      }
      throw error;
    }
  };
  const toolbar = createEditorToolbar({
    textarea,
    getMode: () => mode,
    onFormatLayout: applyLayout,
    onFormatCode: formatActiveCode,
    onChooseImage: () => uploadInput.click(),
    onPreview: preview
  });
  const renderModeSwitch = () => {
    modeSwitch.replaceChildren(
      ...[
        ["markdown", "Markdown"],
        ["ubb", "UBB"]
      ].map(([value, label]) =>
        el(
          "button",
          {
            type: "button",
            "aria-pressed": mode === value,
            onclick: () => controller.setMode(value)
          },
          label
        )
      )
    );
  };
  const draftBanner = initialDraft
    ? el("div", { class: "hm-draft-banner", role: "status" }, [
        el("span", {}, "检测到这篇内容在本机保存的草稿。"),
        el("div", {}, [
          el(
            "button",
            {
              type: "button",
              onclick: () => {
                controller.restoreDraft();
                draftBanner.remove();
              }
            },
            "恢复草稿"
          ),
          el(
            "button",
            {
              type: "button",
              onclick: () => {
                controller.discardDraft();
                draftBanner.remove();
              }
            },
            "丢弃草稿"
          )
        ])
      ])
    : null;
  const editorPane = el("div", { class: "hm-editor-pane" }, [
    el("div", { class: "hm-editor-head" }, [
      modeSwitch,
      el("small", {}, "内容只在本机排版，预览由当前站点生成")
    ]),
    draftBanner,
    toolbar.node,
    uploadInput,
    uploadStatus
  ]);
  const root = el("section", { class: "hm-editor" }, [
    editorPane,
    previewPane
  ]);
  textarea.before(root);
  editorPane.append(textarea);
  const unbindUpload = bindUploadInteractions({
    textarea,
    input: uploadInput,
    dropZone: editorPane,
    queue: uploadQueue
  });

  const submit = () => {
    if (mode === "markdown") {
      textarea.value = ensureMarkdownMarker(
        transformMarkdownCompatibility(textarea.value).output
      );
    } else {
      textarea.value = stripMarkdownMarker(textarea.value);
    }
  };
  textarea.addEventListener("input", saveDraft);
  titleInput?.addEventListener("input", saveDraft);
  form.addEventListener("submit", submit);

  const controller = {
    getValue: () => stripMarkdownMarker(textarea.value),
    setValue(value) {
      textarea.value = stripMarkdownMarker(value);
    },
    getMode: () => mode,
    setMode(value) {
      mode = value === "ubb" ? "ubb" : "markdown";
      textarea.value = stripMarkdownMarker(textarea.value);
      renderModeSwitch();
      toolbar.refresh();
    },
    preview,
    restoreDraft() {
      const draft = draftStore.load(identity);
      if (!draft) return null;
      textarea.value = draft.body || "";
      if (titleInput) titleInput.value = draft.title || "";
      controller.setMode(draft.mode);
      draftBanner?.remove();
      return draft;
    },
    discardDraft() {
      draftStore.remove(identity);
      draftBanner?.remove();
    },
    destroy() {
      clearTimeout(saveTimer);
      previewController?.abort();
      textarea.removeEventListener("input", saveDraft);
      titleInput?.removeEventListener("input", saveDraft);
      form.removeEventListener("submit", submit);
      unbindUpload();
      root.before(textarea);
      root.remove();
    }
  };
  renderModeSwitch();
  return controller;
}
