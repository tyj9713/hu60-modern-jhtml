export function uploadFile(
  file,
  {
    url = "bbs.upload.json",
    signal,
    onProgress,
    xhrFactory = () => new XMLHttpRequest()
  } = {}
) {
  return new Promise((resolve, reject) => {
    const xhr = xhrFactory();
    const cleanup = () => signal?.removeEventListener("abort", abort);
    const abort = () => xhr.abort();

    xhr.open("POST", url);
    xhr.withCredentials = true;
    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        onProgress?.(Math.round((event.loaded / event.total) * 100));
      }
    };
    xhr.onerror = () => {
      cleanup();
      reject(new Error("图片上传网络错误"));
    };
    xhr.onabort = () => {
      cleanup();
      const error = new Error("图片上传已取消");
      error.name = "AbortError";
      reject(error);
    };
    xhr.onload = () => {
      cleanup();
      if (xhr.status < 200 || xhr.status >= 300) {
        reject(new Error(`图片上传失败：${xhr.status}`));
        return;
      }
      let payload;
      try {
        payload = JSON.parse(xhr.responseText);
      } catch {
        reject(new Error("图片上传返回了无效数据"));
        return;
      }
      if (payload.success !== true || !payload.url) {
        reject(new Error(payload.error || payload.message || "图片上传失败"));
        return;
      }
      resolve({
        url: String(payload.url),
        name: String(payload.name || file.name),
        size: Number(payload.size ?? file.size),
        content: String(payload.content || "")
      });
    };
    if (signal?.aborted) {
      abort();
      return;
    }
    signal?.addEventListener("abort", abort, { once: true });
    const data = new FormData();
    data.append("file", file, file.name);
    xhr.send(data);
  });
}

export function createUploadQueue({
  upload = uploadFile,
  insert,
  getMode,
  onChange = () => {}
}) {
  const items = [];
  let sequence = 0;

  const notify = () => onChange(items.map((item) => ({ ...item })));
  const process = async (item) => {
    item.status = "uploading";
    item.progress = 0;
    item.error = "";
    item.controller = new AbortController();
    notify();
    try {
      item.result = await upload(item.file, {
        signal: item.controller.signal,
        onProgress(progress) {
          item.progress = progress;
          notify();
        }
      });
      item.status = "success";
      item.progress = 100;
      const value =
        getMode() === "markdown"
          ? `![${item.result.name}](${item.result.url})`
          : item.result.content || `[img]${item.result.url}[/img]`;
      insert(value);
    } catch (error) {
      item.status =
        error?.name === "AbortError" ? "cancelled" : "error";
      item.error = error?.message || String(error);
    } finally {
      delete item.controller;
      notify();
    }
  };

  return {
    async add(files) {
      const added = [...files]
        .filter((file) => file.type?.startsWith("image/"))
        .map((file) => {
          const item = {
            id: `upload-${++sequence}`,
            file,
            status: "queued",
            progress: 0,
            error: "",
            result: null
          };
          items.push(item);
          return item;
        });
      notify();
      for (const item of added) await process(item);
      return added.map((item) => ({ ...item }));
    },
    async retry(id) {
      const item = items.find((candidate) => candidate.id === id);
      if (!item || item.status !== "error") return false;
      await process(item);
      return item.status === "success";
    },
    cancel(id) {
      const item = items.find((candidate) => candidate.id === id);
      item?.controller?.abort();
    },
    getItems() {
      return items.map(({ controller, ...item }) => ({ ...item }));
    },
    get activeCount() {
      return items.filter((item) =>
        ["queued", "uploading"].includes(item.status)
      ).length;
    }
  };
}

export function bindUploadInteractions({ textarea, input, dropZone, queue }) {
  const paste = (event) => {
    const images = [...(event.clipboardData?.files || [])].filter((file) =>
      file.type.startsWith("image/")
    );
    if (!images.length) return;
    event.preventDefault();
    queue.add(images);
  };
  const drop = (event) => {
    const images = [...(event.dataTransfer?.files || [])].filter((file) =>
      file.type.startsWith("image/")
    );
    if (!images.length) return;
    event.preventDefault();
    queue.add(images);
  };
  const dragover = (event) => event.preventDefault();
  const change = () => queue.add(input.files || []);

  textarea.addEventListener("paste", paste);
  dropZone.addEventListener("drop", drop);
  dropZone.addEventListener("dragover", dragover);
  input.addEventListener("change", change);

  return () => {
    textarea.removeEventListener("paste", paste);
    dropZone.removeEventListener("drop", drop);
    dropZone.removeEventListener("dragover", dragover);
    input.removeEventListener("change", change);
  };
}
