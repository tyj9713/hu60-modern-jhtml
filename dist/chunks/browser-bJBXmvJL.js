//#region node_modules/.pnpm/sh-syntax@0.6.0/node_modules/sh-syntax/lib/types.js
var e = {
	LangBash: 1,
	LangPOSIX: 2,
	LangMirBSDKorn: 4,
	LangBats: 8,
	LangZsh: 16,
	LangAuto: 32
}, t = class extends Error {
	constructor({ Filename: e, Incomplete: t, Text: n, Pos: r }) {
		super(n), this.Filename = e, this.Incomplete = t, this.Text = n, this.Pos = r;
	}
}, n, r, i = (i) => {
	let a, o;
	n ??= new TextEncoder(), r ??= new TextDecoder();
	async function s(s, { filepath: c, print: l = !1, originalText: u, keepComments: d = !0, variant: f = e.LangBash, stopAt: p = "", recoverErrors: m = 0, useTabs: h = !1, tabWidth: g = 2, indent: _ = h ? 0 : g, binaryNextLine: v = !0, switchCaseIndent: y = !0, spaceRedirects: b = !0, keepPadding: x = !1, minify: S = !1, singleLine: C = !1, functionNextLine: w = !1 } = {}) {
		if (!a && !o && i.length === 0 && (o = Promise.resolve(i()).then((e) => "arrayBuffer" in e ? e.arrayBuffer() : e)), o && (a = await o), typeof s != "string" && !l && (l = !0, u == null)) throw TypeError("`originalText` is required for now, hope we will find better solution later");
		let T = new Go(), E = i.length === 0 ? await WebAssembly.instantiate(a, T.importObject) : { instance: await i(T.importObject) };
		T.run(E.instance);
		let { memory: D, wasmAlloc: O, wasmFree: k, process: A } = E.instance.exports, j = n.encode(c), M = n.encode(u || s), N = n.encode(p), P = O(j.byteLength);
		new Uint8Array(D.buffer).set(j, P);
		let F = O(M.byteLength);
		new Uint8Array(D.buffer).set(M, F);
		let I = O(N.byteLength);
		new Uint8Array(D.buffer).set(N, I);
		let L = A(P, j.byteLength, j.byteLength, F, M.byteLength, M.byteLength, l, d, f, I, N.byteLength, N.byteLength, m, _, v, y, b, x, S, C, w);
		k(P), k(F), k(I);
		let R = new Uint8Array(D.buffer).subarray(L), z = R.indexOf(0), B = r.decode(R.subarray(0, z));
		if (!B.startsWith("{\"") || !B.endsWith("}")) throw new t({
			Filename: c,
			Incomplete: !0,
			Text: B
		});
		let { file: V, text: H, parseError: U, message: W } = JSON.parse(B);
		if (U || W) throw U == null ? SyntaxError(W) : new t(U);
		return l ? H : V;
	}
	return s;
};
//#endregion
export { e as LangVariant, t as ParseError, i as getProcessor };
