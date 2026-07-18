//#region src/editor/upload.js
function e(e, { url: t = "bbs.upload.json", signal: n, onProgress: r, xhrFactory: i = () => new XMLHttpRequest() } = {}) {
	return new Promise((a, o) => {
		let s = i(), c = () => n?.removeEventListener("abort", l), l = () => s.abort();
		if (s.open("POST", t), s.withCredentials = !0, s.upload.onprogress = (e) => {
			e.lengthComputable && r?.(Math.round(e.loaded / e.total * 100));
		}, s.onerror = () => {
			c(), o(/* @__PURE__ */ Error("图片上传网络错误"));
		}, s.onabort = () => {
			c();
			let e = /* @__PURE__ */ Error("图片上传已取消");
			e.name = "AbortError", o(e);
		}, s.onload = () => {
			if (c(), s.status < 200 || s.status >= 300) {
				o(/* @__PURE__ */ Error(`图片上传失败：${s.status}`));
				return;
			}
			let t;
			try {
				t = JSON.parse(s.responseText);
			} catch {
				o(/* @__PURE__ */ Error("图片上传返回了无效数据"));
				return;
			}
			if (t.success !== !0 || !t.url) {
				o(Error(t.error || t.message || "图片上传失败"));
				return;
			}
			a({
				url: String(t.url),
				name: String(t.name || e.name),
				size: Number(t.size ?? e.size),
				content: String(t.content || "")
			});
		}, n?.aborted) {
			l();
			return;
		}
		n?.addEventListener("abort", l, { once: !0 });
		let u = new FormData();
		u.append("file", e, e.name), s.send(u);
	});
}
function t({ upload: t = e, insert: n, getMode: r, onChange: i = () => {} }) {
	let a = [], o = 0, s = () => i(a.map((e) => ({ ...e }))), c = async (e) => {
		e.status = "uploading", e.progress = 0, e.error = "", e.controller = new AbortController(), s();
		try {
			e.result = await t(e.file, {
				signal: e.controller.signal,
				onProgress(t) {
					e.progress = t, s();
				}
			}), e.status = "success", e.progress = 100, n(r() === "markdown" ? `![${e.result.name}](${e.result.url})` : e.result.content || `[img]${e.result.url}[/img]`);
		} catch (t) {
			e.status = t?.name === "AbortError" ? "cancelled" : "error", e.error = t?.message || String(t);
		} finally {
			delete e.controller, s();
		}
	};
	return {
		async add(e) {
			let t = [...e].filter((e) => e.type?.startsWith("image/")).map((e) => {
				let t = {
					id: `upload-${++o}`,
					file: e,
					status: "queued",
					progress: 0,
					error: "",
					result: null
				};
				return a.push(t), t;
			});
			s();
			for (let e of t) await c(e);
			return t.map((e) => ({ ...e }));
		},
		async retry(e) {
			let t = a.find((t) => t.id === e);
			return !t || t.status !== "error" ? !1 : (await c(t), t.status === "success");
		},
		cancel(e) {
			a.find((t) => t.id === e)?.controller?.abort();
		},
		getItems() {
			return a.map(({ controller: e, ...t }) => ({ ...t }));
		},
		get activeCount() {
			return a.filter((e) => ["queued", "uploading"].includes(e.status)).length;
		}
	};
}
function n({ textarea: e, input: t, dropZone: n, queue: r }) {
	let i = (e) => {
		let t = [...e.clipboardData?.files || []].filter((e) => e.type.startsWith("image/"));
		t.length && (e.preventDefault(), r.add(t));
	}, a = (e) => {
		let t = [...e.dataTransfer?.files || []].filter((e) => e.type.startsWith("image/"));
		t.length && (e.preventDefault(), r.add(t));
	}, o = (e) => e.preventDefault(), s = () => r.add(t.files || []);
	return e.addEventListener("paste", i), n.addEventListener("drop", a), n.addEventListener("dragover", o), t.addEventListener("change", s), () => {
		e.removeEventListener("paste", i), n.removeEventListener("drop", a), n.removeEventListener("dragover", o), t.removeEventListener("change", s);
	};
}
//#endregion
export { n as bindUploadInteractions, t as createUploadQueue };
