import { t as e } from "./dom-Dhq3QSJF.js";
import { bindUploadInteractions as t, createUploadQueue as n } from "./upload-DM-z18-0.js";
//#region src/editor/drafts.js
function r({ uid: e = 0, route: t = "", target: n = "" }) {
	return `hu60-modern:draft:${e}:${t}:${n}`;
}
function i(e = globalThis.localStorage) {
	return {
		key: r,
		save(t) {
			let n = r(t);
			e.setItem(n, JSON.stringify({
				mode: t.mode || "markdown",
				body: t.body || "",
				title: t.title || "",
				savedAt: Date.now()
			}));
		},
		load(t) {
			try {
				let n = e.getItem(r(t));
				return n ? JSON.parse(n) : null;
			} catch {
				return null;
			}
		},
		remove(t) {
			e.removeItem(r(t));
		}
	};
}
//#endregion
//#region src/editor/fenced-code.js
function a(e, t) {
	let n = String(e || ""), r = /^([ \t]*)(`{3,}|~{3,})([^\n]*)\r?\n/gm, i;
	for (; i = r.exec(n);) {
		let e = i[2], a = r.lastIndex, o = RegExp(`^[ \\t]*${e[0]}{${e.length},}[ \\t]*$`, "gm");
		o.lastIndex = a;
		let s = o.exec(n);
		if (!s) continue;
		let c = s.index;
		if (t >= a && t <= c) return {
			language: i[3].trim().split(/\s+/)[0] || "",
			marker: e,
			openStart: i.index,
			contentStart: a,
			contentEnd: c,
			closeStart: s.index,
			closeEnd: o.lastIndex
		};
		r.lastIndex = o.lastIndex;
	}
	return null;
}
function o(e, t, n) {
	if (!t) return String(e || "");
	let r = String(n || "").replace(/\r\n?/g, "\n"), i = r.endsWith("\n") ? r : `${r}\n`;
	return `${e.slice(0, t.contentStart)}${i}${e.slice(t.contentEnd)}`;
}
//#endregion
//#region src/editor/layout.js
var s = /^\s*(?:#{1,6}\s|[-*+]\s|>\s?|\d+[.)]\s|\|.*\||`{3,}|~{3,}|-{3,}\s*$)/, c = /[。！？；：.!?;:]$/, l = /[\u3400-\u9fff]/;
function u(e) {
	let t = String(e || ""), n = t.replace(/\r\n?/g, "\n").split("\n"), r = [], i = "", a = !1;
	for (let e of n) {
		let t = e.match(/^\s*(`{3,}|~{3,})/);
		if (t) {
			i ? i === t[1][0] && (i = "") : i = t[1][0], r.push(e.trimEnd()), a = !1;
			continue;
		}
		if (i) {
			r.push(e);
			continue;
		}
		let n = e.trimEnd();
		if (!n.trim()) {
			!a && r.length && r.push(""), a = !0;
			continue;
		}
		a = !1;
		let o = r.at(-1);
		o && !s.test(o) && !s.test(n) && l.test(o) && l.test(n) && !c.test(o) ? r[r.length - 1] = `${o}${n.trimStart()}` : r.push(n);
	}
	for (; r.at(-1) === "";) r.pop();
	let o = r.join("\n");
	return {
		output: o,
		changes: o === t ? [] : [{
			type: "replace",
			before: t,
			after: o,
			line: 1
		}]
	};
}
//#endregion
//#region src/editor/markdown.js
var d = "<!-- markdown -->";
function ee(e) {
	return String(e || "").replace(/^\s*(?:<!--\s*markdown\s*-->|<!md>)\s*/i, "");
}
function te(e) {
	return `${d}\n${ee(e)}`;
}
function ne(e) {
	let t = String(e || "").replace(/\r\n?/g, "\n").split("\n"), n = "", r = [], i = t.map((e) => {
		let t = e.match(/^\s*(`{3,}|~{3,})/);
		return t ? (n ? n === t[1][0] && (n = "") : n = t[1][0], e) : n ? e : e.replace(/^(\s*[-*+]\s+)\[x\]\s+/i, "$1☑ ").replace(/^(\s*[-*+]\s+)\[\s\]\s+/, "$1☐ ");
	}).join("\n");
	return /(^|[^\\])~~.+?~~/.test(i) && r.push("删除线将在发布前转换为 hu60 兼容样式"), {
		output: i,
		warnings: r
	};
}
//#endregion
//#region node_modules/.pnpm/dompurify@3.4.12/node_modules/dompurify/dist/purify.es.mjs
function f(e, t) {
	(t == null || t > e.length) && (t = e.length);
	for (var n = 0, r = Array(t); n < t; n++) r[n] = e[n];
	return r;
}
function p(e) {
	if (Array.isArray(e)) return e;
}
function re(e, t) {
	var n = e == null ? null : typeof Symbol < "u" && e[Symbol.iterator] || e["@@iterator"];
	if (n != null) {
		var r, i, a, o, s = [], c = !0, l = !1;
		try {
			if (a = (n = n.call(e)).next, t !== 0) for (; !(c = (r = a.call(n)).done) && (s.push(r.value), s.length !== t); c = !0);
		} catch (e) {
			l = !0, i = e;
		} finally {
			try {
				if (!c && n.return != null && (o = n.return(), Object(o) !== o)) return;
			} finally {
				if (l) throw i;
			}
		}
		return s;
	}
}
function m() {
	throw TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function h(e, t) {
	return p(e) || re(e, t) || g(e, t) || m();
}
function g(e, t) {
	if (e) {
		if (typeof e == "string") return f(e, t);
		var n = {}.toString.call(e).slice(8, -1);
		return n === "Object" && e.constructor && (n = e.constructor.name), n === "Map" || n === "Set" ? Array.from(e) : n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n) ? f(e, t) : void 0;
	}
}
var ie = Object.entries, _ = Object.setPrototypeOf, v = Object.isFrozen, ae = Object.getPrototypeOf, y = Object.getOwnPropertyDescriptor, b = Object.freeze, x = Object.seal, S = Object.create, C = typeof Reflect < "u" && Reflect, w = C.apply, T = C.construct;
b ||= function(e) {
	return e;
}, x ||= function(e) {
	return e;
}, w ||= function(e, t) {
	var n = [...arguments].slice(2);
	return e.apply(t, n);
}, T ||= function(e) {
	return new e(...[...arguments].slice(1));
};
var E = F(Array.prototype.forEach), oe = F(Array.prototype.lastIndexOf), se = F(Array.prototype.pop), D = F(Array.prototype.push), ce = F(Array.prototype.splice), O = Array.isArray, k = F(String.prototype.toLowerCase), le = F(String.prototype.toString), ue = F(String.prototype.match), A = F(String.prototype.replace), de = F(String.prototype.indexOf), fe = F(String.prototype.trim), pe = F(Number.prototype.toString), me = F(Boolean.prototype.toString), he = typeof BigInt > "u" ? null : F(BigInt.prototype.toString), ge = typeof Symbol > "u" ? null : F(Symbol.prototype.toString), j = F(Object.prototype.hasOwnProperty), M = F(Object.prototype.toString), N = F(RegExp.prototype.test), P = _e(TypeError);
function F(e) {
	return function(t) {
		t instanceof RegExp && (t.lastIndex = 0);
		var n = [...arguments].slice(1);
		return w(e, t, n);
	};
}
function _e(e) {
	return function() {
		return T(e, [...arguments]);
	};
}
function I(e, t) {
	let n = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : k;
	if (_ && _(e, null), !O(t)) return e;
	let r = t.length;
	for (; r--;) {
		let i = t[r];
		if (typeof i == "string") {
			let e = n(i);
			e !== i && (v(t) || (t[r] = e), i = e);
		}
		e[i] = !0;
	}
	return e;
}
function ve(e) {
	for (let t = 0; t < e.length; t++) j(e, t) || (e[t] = null);
	return e;
}
function L(e) {
	let t = S(null);
	for (let r of ie(e)) {
		var n = h(r, 2);
		let i = n[0], a = n[1];
		j(e, i) && (O(a) ? t[i] = ve(a) : a && typeof a == "object" && a.constructor === Object ? t[i] = L(a) : t[i] = a);
	}
	return t;
}
function ye(e) {
	switch (typeof e) {
		case "string": return e;
		case "number": return pe(e);
		case "boolean": return me(e);
		case "bigint": return he ? he(e) : "0";
		case "symbol": return ge ? ge(e) : "Symbol()";
		case "undefined": return M(e);
		case "function":
		case "object": {
			if (e === null) return M(e);
			let t = e, n = R(t, "toString");
			if (typeof n == "function") {
				let e = n(t);
				return typeof e == "string" ? e : M(e);
			}
			return M(e);
		}
		default: return M(e);
	}
}
function R(e, t) {
	for (; e !== null;) {
		let n = y(e, t);
		if (n) {
			if (n.get) return F(n.get);
			if (typeof n.value == "function") return F(n.value);
		}
		e = ae(e);
	}
	function n() {
		return null;
	}
	return n;
}
function be(e) {
	try {
		return N(e, ""), !0;
	} catch {
		return !1;
	}
}
var xe = b(/* @__PURE__ */ "a.abbr.acronym.address.area.article.aside.audio.b.bdi.bdo.big.blink.blockquote.body.br.button.canvas.caption.center.cite.code.col.colgroup.content.data.datalist.dd.decorator.del.details.dfn.dialog.dir.div.dl.dt.element.em.fieldset.figcaption.figure.font.footer.form.h1.h2.h3.h4.h5.h6.head.header.hgroup.hr.html.i.img.input.ins.kbd.label.legend.li.main.map.mark.marquee.menu.menuitem.meter.nav.nobr.ol.optgroup.option.output.p.picture.pre.progress.q.rp.rt.ruby.s.samp.search.section.select.shadow.slot.small.source.spacer.span.strike.strong.style.sub.summary.sup.table.tbody.td.template.textarea.tfoot.th.thead.time.tr.track.tt.u.ul.var.video.wbr".split(".")), Se = b(/* @__PURE__ */ "svg.a.altglyph.altglyphdef.altglyphitem.animatecolor.animatemotion.animatetransform.circle.clippath.defs.desc.ellipse.enterkeyhint.exportparts.filter.font.g.glyph.glyphref.hkern.image.inputmode.line.lineargradient.marker.mask.metadata.mpath.part.path.pattern.polygon.polyline.radialgradient.rect.stop.style.switch.symbol.text.textpath.title.tref.tspan.view.vkern".split(".")), Ce = b([
	"feBlend",
	"feColorMatrix",
	"feComponentTransfer",
	"feComposite",
	"feConvolveMatrix",
	"feDiffuseLighting",
	"feDisplacementMap",
	"feDistantLight",
	"feDropShadow",
	"feFlood",
	"feFuncA",
	"feFuncB",
	"feFuncG",
	"feFuncR",
	"feGaussianBlur",
	"feImage",
	"feMerge",
	"feMergeNode",
	"feMorphology",
	"feOffset",
	"fePointLight",
	"feSpecularLighting",
	"feSpotLight",
	"feTile",
	"feTurbulence"
]), we = b([
	"animate",
	"color-profile",
	"cursor",
	"discard",
	"font-face",
	"font-face-format",
	"font-face-name",
	"font-face-src",
	"font-face-uri",
	"foreignobject",
	"hatch",
	"hatchpath",
	"mesh",
	"meshgradient",
	"meshpatch",
	"meshrow",
	"missing-glyph",
	"script",
	"set",
	"solidcolor",
	"unknown",
	"use"
]), Te = b(/* @__PURE__ */ "math.menclose.merror.mfenced.mfrac.mglyph.mi.mlabeledtr.mmultiscripts.mn.mo.mover.mpadded.mphantom.mroot.mrow.ms.mspace.msqrt.mstyle.msub.msup.msubsup.mtable.mtd.mtext.mtr.munder.munderover.mprescripts".split(".")), Ee = b([
	"maction",
	"maligngroup",
	"malignmark",
	"mlongdiv",
	"mscarries",
	"mscarry",
	"msgroup",
	"mstack",
	"msline",
	"msrow",
	"semantics",
	"annotation",
	"annotation-xml",
	"mprescripts",
	"none"
]), De = b(["#text"]), Oe = b(/* @__PURE__ */ "accept.action.align.alt.autocapitalize.autocomplete.autopictureinpicture.autoplay.background.bgcolor.border.capture.cellpadding.cellspacing.checked.cite.class.clear.color.cols.colspan.command.commandfor.controls.controlslist.coords.crossorigin.datetime.decoding.default.dir.disabled.disablepictureinpicture.disableremoteplayback.download.draggable.enctype.enterkeyhint.exportparts.face.for.headers.height.hidden.high.href.hreflang.id.inert.inputmode.integrity.ismap.kind.label.lang.list.loading.loop.low.max.maxlength.media.method.min.minlength.multiple.muted.name.nonce.noshade.novalidate.nowrap.open.optimum.part.pattern.placeholder.playsinline.popover.popovertarget.popovertargetaction.poster.preload.pubdate.radiogroup.readonly.rel.required.rev.reversed.role.rows.rowspan.spellcheck.scope.selected.shape.size.sizes.slot.span.srclang.start.src.srcset.step.style.summary.tabindex.title.translate.type.usemap.valign.value.width.wrap.xmlns".split(".")), ke = b(/* @__PURE__ */ "accent-height.accumulate.additive.alignment-baseline.amplitude.ascent.attributename.attributetype.azimuth.basefrequency.baseline-shift.begin.bias.by.class.clip.clippathunits.clip-path.clip-rule.color.color-interpolation.color-interpolation-filters.color-profile.color-rendering.cx.cy.d.dx.dy.diffuseconstant.direction.display.divisor.dominant-baseline.dur.edgemode.elevation.end.exponent.fill.fill-opacity.fill-rule.filter.filterunits.flood-color.flood-opacity.font-family.font-size.font-size-adjust.font-stretch.font-style.font-variant.font-weight.fx.fy.g1.g2.glyph-name.glyphref.gradientunits.gradienttransform.height.href.id.image-rendering.in.in2.intercept.k.k1.k2.k3.k4.kerning.keypoints.keysplines.keytimes.lang.lengthadjust.letter-spacing.kernelmatrix.kernelunitlength.lighting-color.local.marker-end.marker-mid.marker-start.markerheight.markerunits.markerwidth.maskcontentunits.maskunits.max.mask.mask-type.media.method.mode.min.name.numoctaves.offset.operator.opacity.order.orient.orientation.origin.overflow.paint-order.path.pathlength.patterncontentunits.patterntransform.patternunits.points.preservealpha.preserveaspectratio.primitiveunits.r.rx.ry.radius.refx.refy.repeatcount.repeatdur.restart.result.rotate.scale.seed.shape-rendering.slope.specularconstant.specularexponent.spreadmethod.startoffset.stddeviation.stitchtiles.stop-color.stop-opacity.stroke-dasharray.stroke-dashoffset.stroke-linecap.stroke-linejoin.stroke-miterlimit.stroke-opacity.stroke.stroke-width.style.surfacescale.systemlanguage.tabindex.tablevalues.targetx.targety.transform.transform-origin.text-anchor.text-decoration.text-orientation.text-rendering.textlength.type.u1.u2.unicode.values.viewbox.visibility.version.vert-adv-y.vert-origin-x.vert-origin-y.width.word-spacing.wrap.writing-mode.xchannelselector.ychannelselector.x.x1.x2.xmlns.y.y1.y2.z.zoomandpan".split(".")), Ae = b(/* @__PURE__ */ "accent.accentunder.align.bevelled.close.columnalign.columnlines.columnspacing.columnspan.denomalign.depth.dir.display.displaystyle.encoding.fence.frame.height.href.id.largeop.length.linethickness.lquote.lspace.mathbackground.mathcolor.mathsize.mathvariant.maxsize.minsize.movablelimits.notation.numalign.open.rowalign.rowlines.rowspacing.rowspan.rspace.rquote.scriptlevel.scriptminsize.scriptsizemultiplier.selection.separator.separators.stretchy.subscriptshift.supscriptshift.symmetric.voffset.width.xmlns".split(".")), je = b([
	"xlink:href",
	"xml:id",
	"xlink:title",
	"xml:space",
	"xmlns:xlink"
]), Me = x(/{{[\w\W]*|^[\w\W]*}}/g), Ne = x(/<%[\w\W]*|^[\w\W]*%>/g), Pe = x(/\${[\w\W]*/g), Fe = x(/^data-[\-\w.\u00B7-\uFFFF]+$/), Ie = x(/^aria-[\-\w]+$/), Le = x(/^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms|cid|xmpp|matrix):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i), Re = x(/^(?:\w+script|data):/i), ze = x(/[\u0000-\u0020\u00A0\u1680\u180E\u2000-\u2029\u205F\u3000]/g), Be = x(/^html$/i), Ve = x(/^[a-z][.\w]*(-[.\w]+)+$/i), He = x(/<[/\w!]/g), Ue = x(/<[/\w]/g), We = x(/<\/no(script|embed|frames)/i), Ge = x(/\/>/i), z = {
	element: 1,
	attribute: 2,
	text: 3,
	cdataSection: 4,
	entityReference: 5,
	entityNode: 6,
	processingInstruction: 7,
	comment: 8,
	document: 9,
	documentType: 10,
	documentFragment: 11,
	notation: 12
}, Ke = function() {
	return typeof window > "u" ? null : window;
}, qe = function(e, t) {
	if (typeof e != "object" || typeof e.createPolicy != "function") return null;
	let n = null, r = "data-tt-policy-suffix";
	t && t.hasAttribute(r) && (n = t.getAttribute(r));
	let i = "dompurify" + (n ? "#" + n : "");
	try {
		return e.createPolicy(i, {
			createHTML(e) {
				return e;
			},
			createScriptURL(e) {
				return e;
			}
		});
	} catch {
		return console.warn("TrustedTypes policy " + i + " could not be created."), null;
	}
}, Je = function() {
	return {
		afterSanitizeAttributes: [],
		afterSanitizeElements: [],
		afterSanitizeShadowDOM: [],
		beforeSanitizeAttributes: [],
		beforeSanitizeElements: [],
		beforeSanitizeShadowDOM: [],
		uponSanitizeAttribute: [],
		uponSanitizeElement: [],
		uponSanitizeShadowNode: []
	};
}, B = function(e, t, n, r) {
	return j(e, t) && O(e[t]) ? I(r.base ? L(r.base) : {}, e[t], r.transform) : n;
};
function Ye() {
	let e = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : Ke(), t = (e) => Ye(e);
	if (t.version = "3.4.12", t.removed = [], !e || !e.document || e.document.nodeType !== z.document || !e.Element) return t.isSupported = !1, t;
	let n = e.document, r = n, i = r.currentScript;
	e.DocumentFragment;
	let a = e.HTMLTemplateElement, o = e.Node, s = e.Element, c = e.NodeFilter;
	e.NamedNodeMap === void 0 && (e.NamedNodeMap || e.MozNamedAttrMap), e.HTMLFormElement;
	let l = e.DOMParser, u = e.trustedTypes, d = s.prototype, ee = R(d, "cloneNode"), te = R(d, "remove"), ne = R(d, "nextSibling"), f = R(d, "childNodes"), p = R(d, "parentNode"), re = R(d, "shadowRoot"), m = R(d, "attributes"), h = o && o.prototype ? R(o.prototype, "nodeType") : null, g = o && o.prototype ? R(o.prototype, "nodeName") : null;
	if (typeof a == "function") {
		let e = n.createElement("template");
		e.content && e.content.ownerDocument && (n = e.content.ownerDocument);
	}
	let _, v = "", ae, y = !1, C = 0, w = function() {
		if (C > 0) throw P("A configured TRUSTED_TYPES_POLICY callback (createHTML or createScriptURL) must not call DOMPurify.sanitize, as that causes infinite recursion. Do not pass a policy whose callbacks wrap DOMPurify as TRUSTED_TYPES_POLICY; see the \"DOMPurify and Trusted Types\" section of the README.");
	}, T = function(e) {
		w(), C++;
		try {
			return _.createHTML(e);
		} finally {
			C--;
		}
	}, pe = function(e) {
		w(), C++;
		try {
			return _.createScriptURL(e);
		} finally {
			C--;
		}
	}, me = function() {
		return y ||= (ae = qe(u, i), !0), ae;
	}, he = n, ge = he.implementation, M = he.createNodeIterator, F = he.createDocumentFragment, _e = he.getElementsByTagName, ve = r.importNode, V = Je();
	t.isSupported = typeof ie == "function" && typeof p == "function" && ge && ge.createHTMLDocument !== void 0;
	let Xe = Me, Ze = Ne, Qe = Pe, $e = Fe, et = Ie, tt = Re, nt = ze, rt = Ve, it = Le, H = null, at = I({}, [
		...xe,
		...Se,
		...Ce,
		...Te,
		...De
	]), U = null, ot = I({}, [
		...Oe,
		...ke,
		...Ae,
		...je
	]), W = Object.seal(S(null, {
		tagNameCheck: {
			writable: !0,
			configurable: !1,
			enumerable: !0,
			value: null
		},
		attributeNameCheck: {
			writable: !0,
			configurable: !1,
			enumerable: !0,
			value: null
		},
		allowCustomizedBuiltInElements: {
			writable: !0,
			configurable: !1,
			enumerable: !0,
			value: !1
		}
	})), st = null, ct = null, G = Object.seal(S(null, {
		tagCheck: {
			writable: !0,
			configurable: !1,
			enumerable: !0,
			value: null
		},
		attributeCheck: {
			writable: !0,
			configurable: !1,
			enumerable: !0,
			value: null
		}
	})), lt = !0, ut = !0, dt = !1, ft = !0, K = !1, q = !0, J = !1, pt = !1, mt = null, ht = null, gt = !1, _t = !1, vt = !1, yt = !1, bt = !0, xt = !1, St = "user-content-", Ct = !0, wt = !1, Tt = {}, Y = null, Et = I({}, /* @__PURE__ */ "annotation-xml.audio.colgroup.desc.foreignobject.head.iframe.math.mi.mn.mo.ms.mtext.noembed.noframes.noscript.plaintext.script.selectedcontent.style.svg.template.thead.title.video.xmp".split(".")), Dt = null, Ot = I({}, [
		"audio",
		"video",
		"img",
		"source",
		"image",
		"track"
	]), kt = null, At = I({}, [
		"alt",
		"class",
		"for",
		"id",
		"label",
		"name",
		"pattern",
		"placeholder",
		"role",
		"summary",
		"title",
		"value",
		"style",
		"xmlns"
	]), jt = "http://www.w3.org/1998/Math/MathML", Mt = "http://www.w3.org/2000/svg", X = "http://www.w3.org/1999/xhtml", Nt = X, Pt = !1, Ft = null, It = I({}, [
		jt,
		Mt,
		X
	], le), Lt = b([
		"mi",
		"mo",
		"mn",
		"ms",
		"mtext"
	]), Rt = I({}, Lt), zt = b(["annotation-xml"]), Bt = I({}, zt), Vt = I({}, [
		"title",
		"style",
		"font",
		"a",
		"script"
	]), Ht = null, Ut = ["application/xhtml+xml", "text/html"], Z = null, Wt = null, Gt = n.createElement("form"), Kt = function(e) {
		return e instanceof RegExp || e instanceof Function;
	}, qt = function() {
		let e = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
		if (Wt && Wt === e) return;
		(!e || typeof e != "object") && (e = {}), e = L(e), Ht = Ut.indexOf(e.PARSER_MEDIA_TYPE) === -1 ? "text/html" : e.PARSER_MEDIA_TYPE, Z = Ht === "application/xhtml+xml" ? le : k, H = B(e, "ALLOWED_TAGS", at, { transform: Z }), U = B(e, "ALLOWED_ATTR", ot, { transform: Z }), Ft = B(e, "ALLOWED_NAMESPACES", It, { transform: le }), kt = B(e, "ADD_URI_SAFE_ATTR", At, {
			transform: Z,
			base: At
		}), Dt = B(e, "ADD_DATA_URI_TAGS", Ot, {
			transform: Z,
			base: Ot
		}), Y = B(e, "FORBID_CONTENTS", Et, { transform: Z }), st = B(e, "FORBID_TAGS", L({}), { transform: Z }), ct = B(e, "FORBID_ATTR", L({}), { transform: Z }), Tt = j(e, "USE_PROFILES") ? e.USE_PROFILES && typeof e.USE_PROFILES == "object" ? L(e.USE_PROFILES) : e.USE_PROFILES : !1, lt = e.ALLOW_ARIA_ATTR !== !1, ut = e.ALLOW_DATA_ATTR !== !1, dt = e.ALLOW_UNKNOWN_PROTOCOLS || !1, ft = e.ALLOW_SELF_CLOSE_IN_ATTR !== !1, K = e.SAFE_FOR_TEMPLATES || !1, q = e.SAFE_FOR_XML !== !1, J = e.WHOLE_DOCUMENT || !1, _t = e.RETURN_DOM || !1, vt = e.RETURN_DOM_FRAGMENT || !1, yt = e.RETURN_TRUSTED_TYPE || !1, gt = e.FORCE_BODY || !1, bt = e.SANITIZE_DOM !== !1, xt = e.SANITIZE_NAMED_PROPS || !1, Ct = e.KEEP_CONTENT !== !1, wt = e.IN_PLACE || !1, it = be(e.ALLOWED_URI_REGEXP) ? e.ALLOWED_URI_REGEXP : Le, Nt = typeof e.NAMESPACE == "string" ? e.NAMESPACE : X, Rt = j(e, "MATHML_TEXT_INTEGRATION_POINTS") && e.MATHML_TEXT_INTEGRATION_POINTS && typeof e.MATHML_TEXT_INTEGRATION_POINTS == "object" ? L(e.MATHML_TEXT_INTEGRATION_POINTS) : I({}, Lt), Bt = j(e, "HTML_INTEGRATION_POINTS") && e.HTML_INTEGRATION_POINTS && typeof e.HTML_INTEGRATION_POINTS == "object" ? L(e.HTML_INTEGRATION_POINTS) : I({}, zt);
		let t = j(e, "CUSTOM_ELEMENT_HANDLING") && e.CUSTOM_ELEMENT_HANDLING && typeof e.CUSTOM_ELEMENT_HANDLING == "object" ? L(e.CUSTOM_ELEMENT_HANDLING) : S(null);
		if (W = S(null), j(t, "tagNameCheck") && Kt(t.tagNameCheck) && (W.tagNameCheck = t.tagNameCheck), j(t, "attributeNameCheck") && Kt(t.attributeNameCheck) && (W.attributeNameCheck = t.attributeNameCheck), j(t, "allowCustomizedBuiltInElements") && typeof t.allowCustomizedBuiltInElements == "boolean" && (W.allowCustomizedBuiltInElements = t.allowCustomizedBuiltInElements), x(W), K && (ut = !1), vt && (_t = !0), Tt && (H = I({}, De), U = S(null), Tt.html === !0 && (I(H, xe), I(U, Oe)), Tt.svg === !0 && (I(H, Se), I(U, ke), I(U, je)), Tt.svgFilters === !0 && (I(H, Ce), I(U, ke), I(U, je)), Tt.mathMl === !0 && (I(H, Te), I(U, Ae), I(U, je))), G.tagCheck = null, G.attributeCheck = null, j(e, "ADD_TAGS") && (typeof e.ADD_TAGS == "function" ? G.tagCheck = e.ADD_TAGS : O(e.ADD_TAGS) && (H === at && (H = L(H)), I(H, e.ADD_TAGS, Z))), j(e, "ADD_ATTR") && (typeof e.ADD_ATTR == "function" ? G.attributeCheck = e.ADD_ATTR : O(e.ADD_ATTR) && (U === ot && (U = L(U)), I(U, e.ADD_ATTR, Z))), j(e, "ADD_URI_SAFE_ATTR") && O(e.ADD_URI_SAFE_ATTR) && I(kt, e.ADD_URI_SAFE_ATTR, Z), j(e, "FORBID_CONTENTS") && O(e.FORBID_CONTENTS) && (Y === Et && (Y = L(Y)), I(Y, e.FORBID_CONTENTS, Z)), j(e, "ADD_FORBID_CONTENTS") && O(e.ADD_FORBID_CONTENTS) && (Y === Et && (Y = L(Y)), I(Y, e.ADD_FORBID_CONTENTS, Z)), Ct && (H["#text"] = !0), J && I(H, [
			"html",
			"head",
			"body"
		]), H.table && (I(H, ["tbody"]), delete st.tbody), e.TRUSTED_TYPES_POLICY) {
			if (typeof e.TRUSTED_TYPES_POLICY.createHTML != "function") throw P("TRUSTED_TYPES_POLICY configuration option must provide a \"createHTML\" hook.");
			if (typeof e.TRUSTED_TYPES_POLICY.createScriptURL != "function") throw P("TRUSTED_TYPES_POLICY configuration option must provide a \"createScriptURL\" hook.");
			let t = _;
			_ = e.TRUSTED_TYPES_POLICY;
			try {
				v = T("");
			} catch (e) {
				throw _ = t, e;
			}
		} else e.TRUSTED_TYPES_POLICY === null ? (_ = void 0, v = "") : (_ === void 0 && (_ = me()), _ && typeof v == "string" && (v = T("")));
		b && b(e), Wt = e;
	}, Jt = I({}, [
		...Se,
		...Ce,
		...we
	]), Yt = I({}, [...Te, ...Ee]), Xt = function(e, t, n) {
		return t.namespaceURI === X ? e === "svg" : t.namespaceURI === jt ? e === "svg" && (n === "annotation-xml" || Rt[n]) : !!Jt[e];
	}, Zt = function(e, t, n) {
		return t.namespaceURI === X ? e === "math" : t.namespaceURI === Mt ? e === "math" && Bt[n] : !!Yt[e];
	}, Qt = function(e, t, n) {
		return t.namespaceURI === Mt && !Bt[n] || t.namespaceURI === jt && !Rt[n] ? !1 : !Yt[e] && (Vt[e] || !Jt[e]);
	}, $t = function(e) {
		let t = p(e);
		(!t || !t.tagName) && (t = {
			namespaceURI: Nt,
			tagName: "template"
		});
		let n = k(e.tagName), r = k(t.tagName);
		return Ft[e.namespaceURI] ? e.namespaceURI === Mt ? Xt(n, t, r) : e.namespaceURI === jt ? Zt(n, t, r) : e.namespaceURI === X ? Qt(n, t, r) : !!(Ht === "application/xhtml+xml" && Ft[e.namespaceURI]) : !1;
	}, en = function(e) {
		D(t.removed, { element: e });
		try {
			p(e).removeChild(e);
		} catch {
			if (te(e), !p(e)) throw P("a node selected for removal could not be detached from its tree and cannot be safely returned; refusing to sanitize in place");
		}
	}, tn = function(e) {
		rn(e);
		let t = f(e);
		if (t) {
			let e = [];
			E(t, (t) => {
				D(e, t);
			}), E(e, (e) => {
				try {
					te(e);
				} catch {}
			});
		}
		let n = m(e);
		if (n) for (let t = n.length - 1; t >= 0; --t) {
			let r = n[t], i = r && r.name;
			if (typeof i == "string") try {
				e.removeAttribute(i);
			} catch {}
		}
	}, Q = function(e, n) {
		try {
			D(t.removed, {
				attribute: n.getAttributeNode(e),
				from: n
			});
		} catch {
			D(t.removed, {
				attribute: null,
				from: n
			});
		}
		if (n.removeAttribute(e), e === "is") if (_t || vt) try {
			en(n);
		} catch {}
		else try {
			n.setAttribute(e, "");
		} catch {}
	}, nn = function(e) {
		let t = m(e);
		if (t) for (let n = t.length - 1; n >= 0; --n) {
			let r = t[n], i = r && r.name;
			if (!(typeof i != "string" || U[Z(i)])) try {
				e.removeAttribute(i);
			} catch {}
		}
	}, rn = function(e) {
		let t = [e];
		for (; t.length > 0;) {
			let e = t.pop();
			(h ? h(e) : e.nodeType) === z.element && nn(e);
			let n = f(e);
			if (n) for (let e = n.length - 1; e >= 0; --e) t.push(n[e]);
		}
	}, an = function(e) {
		if (!q) return;
		let t = [e];
		for (; t.length > 0;) {
			let e = t.pop(), n = h ? h(e) : e.nodeType;
			if (n === z.processingInstruction || n === z.comment && N(Ue, e.data)) {
				try {
					te(e);
				} catch {}
				continue;
			}
			if (n === z.element) {
				let t = e, n = Z(g ? g(e) : e.nodeName);
				try {
					t.hasAttribute && t.hasAttribute("patchsrc") && t.removeAttribute("patchsrc"), t.hasAttribute && t.hasAttribute("for") && n !== "label" && n !== "output" && t.removeAttribute("for");
				} catch {}
			}
			let r = f(e);
			if (r) for (let e = r.length - 1; e >= 0; --e) t.push(r[e]);
		}
	}, on = function(e) {
		let t = null, r = null;
		if (gt) e = "<remove></remove>" + e;
		else {
			let t = ue(e, /^[\r\n\t ]+/);
			r = t && t[0];
		}
		Ht === "application/xhtml+xml" && Nt === X && (e = "<html xmlns=\"http://www.w3.org/1999/xhtml\"><head></head><body>" + e + "</body></html>");
		let i = _ ? T(e) : e;
		if (Nt === X) try {
			t = new l().parseFromString(i, Ht);
		} catch {}
		if (!t || !t.documentElement) {
			t = ge.createDocument(Nt, "template", null);
			try {
				t.documentElement.innerHTML = Pt ? v : i;
			} catch {}
		}
		let a = t.body || t.documentElement;
		return e && r && a.insertBefore(n.createTextNode(r), a.childNodes[0] || null), Nt === X ? _e.call(t, J ? "html" : "body")[0] : J ? t.documentElement : a;
	}, sn = function(e) {
		return M.call(e.ownerDocument || e, e, c.SHOW_ELEMENT | c.SHOW_COMMENT | c.SHOW_TEXT | c.SHOW_PROCESSING_INSTRUCTION | c.SHOW_CDATA_SECTION, null);
	}, cn = function(e) {
		return e = A(e, Xe, " "), e = A(e, Ze, " "), e = A(e, Qe, " "), e;
	}, ln = function(e) {
		e.normalize();
		let t = M.call(e.ownerDocument || e, e, c.SHOW_TEXT | c.SHOW_COMMENT | c.SHOW_CDATA_SECTION | c.SHOW_PROCESSING_INSTRUCTION, null), n = t.nextNode();
		for (; n;) n.data = cn(n.data), n = t.nextNode();
		let r = e.querySelectorAll?.call(e, "template");
		r && E(r, (e) => {
			dn(e.content) && ln(e.content);
		});
	}, un = function(e) {
		let t = g ? g(e) : null;
		return typeof t != "string" || Z(t) !== "form" ? !1 : typeof e.nodeName != "string" || typeof e.textContent != "string" || typeof e.removeChild != "function" || e.attributes !== m(e) || typeof e.removeAttribute != "function" || typeof e.setAttribute != "function" || typeof e.namespaceURI != "string" || typeof e.insertBefore != "function" || typeof e.hasChildNodes != "function" || e.nodeType !== h(e) || e.childNodes !== f(e);
	}, dn = function(e) {
		if (!h || typeof e != "object" || !e) return !1;
		try {
			return h(e) === z.documentFragment;
		} catch {
			return !1;
		}
	}, fn = function(e) {
		if (!h || typeof e != "object" || !e) return !1;
		try {
			return typeof h(e) == "number";
		} catch {
			return !1;
		}
	};
	function $(e, n, r) {
		e.length !== 0 && E(e, (e) => {
			e.call(t, n, r, Wt);
		});
	}
	let pn = function(e, t) {
		return !!(q && e.hasChildNodes() && !fn(e.firstElementChild) && N(He, e.textContent) && N(He, e.innerHTML) || q && e.namespaceURI === X && t === "style" && fn(e.firstElementChild) || e.nodeType === z.processingInstruction || q && e.nodeType === z.comment && N(Ue, e.data));
	}, mn = function(e, t) {
		if (!st[t] && vn(t) && (W.tagNameCheck instanceof RegExp && N(W.tagNameCheck, t) || W.tagNameCheck instanceof Function && W.tagNameCheck(t))) return !1;
		if (Ct && !Y[t]) {
			let t = p(e), n = f(e);
			if (n && t) {
				let r = n.length;
				for (let i = r - 1; i >= 0; --i) {
					let r = wt ? n[i] : ee(n[i], !0);
					t.insertBefore(r, ne(e));
				}
			}
		}
		return en(e), !0;
	}, hn = function(e, n) {
		if ($(V.beforeSanitizeElements, e, null), e !== n && p(e) === null) return !0;
		if (un(e)) return en(e), !0;
		let r = Z(g ? g(e) : e.nodeName);
		if ($(V.uponSanitizeElement, e, {
			tagName: r,
			allowedTags: H
		}), e !== n && p(e) === null) return !0;
		if (pn(e, r)) return en(e), !0;
		if (st[r] || !(G.tagCheck instanceof Function && G.tagCheck(r)) && !H[r]) {
			let t = mn(e, r);
			return t === !1 && $(V.afterSanitizeElements, e, null), t;
		}
		if ((h ? h(e) : e.nodeType) === z.element && !$t(e) || (r === "noscript" || r === "noembed" || r === "noframes") && N(We, e.innerHTML)) return en(e), !0;
		if (K && e.nodeType === z.text) {
			let n = cn(e.textContent);
			e.textContent !== n && (D(t.removed, { element: e.cloneNode() }), e.textContent = n);
		}
		return $(V.afterSanitizeElements, e, null), !1;
	}, gn = function(e, t, r) {
		if (ct[t] || q && t === "patchsrc" || q && t === "for" && e !== "label" && e !== "output" || bt && (t === "id" || t === "name") && (r in n || r in Gt)) return !1;
		let i = U[t] || G.attributeCheck instanceof Function && G.attributeCheck(t, e);
		if (!(ut && N($e, t)) && !(lt && N(et, t))) {
			if (!i) {
				if (!(vn(e) && (W.tagNameCheck instanceof RegExp && N(W.tagNameCheck, e) || W.tagNameCheck instanceof Function && W.tagNameCheck(e)) && (W.attributeNameCheck instanceof RegExp && N(W.attributeNameCheck, t) || W.attributeNameCheck instanceof Function && W.attributeNameCheck(t, e)) || t === "is" && W.allowCustomizedBuiltInElements && (W.tagNameCheck instanceof RegExp && N(W.tagNameCheck, r) || W.tagNameCheck instanceof Function && W.tagNameCheck(r)))) return !1;
			} else if (!kt[t] && !N(it, A(r, nt, "")) && !((t === "src" || t === "xlink:href" || t === "href") && e !== "script" && de(r, "data:") === 0 && Dt[e]) && !(dt && !N(tt, A(r, nt, ""))) && r) return !1;
		}
		return !0;
	}, _n = I({}, [
		"annotation-xml",
		"color-profile",
		"font-face",
		"font-face-format",
		"font-face-name",
		"font-face-src",
		"font-face-uri",
		"missing-glyph"
	]), vn = function(e) {
		return !_n[k(e)] && N(rt, e);
	}, yn = function(e, t, n, r) {
		if (_ && typeof u == "object" && typeof u.getAttributeType == "function" && !n) switch (u.getAttributeType(e, t)) {
			case "TrustedHTML": return T(r);
			case "TrustedScriptURL": return pe(r);
		}
		return r;
	}, bn = function(e, n, r, i) {
		try {
			r ? e.setAttributeNS(r, n, i) : e.setAttribute(n, i), un(e) ? en(e) : se(t.removed);
		} catch {
			Q(n, e);
		}
	}, xn = function(e) {
		$(V.beforeSanitizeAttributes, e, null);
		let t = e.attributes;
		if (!t || un(e)) return;
		let n = {
			attrName: "",
			attrValue: "",
			keepAttr: !0,
			allowedAttributes: U,
			forceKeepAttr: void 0
		}, r = t.length, i = Z(e.nodeName);
		for (; r--;) {
			let a = t[r], o = a.name, s = a.namespaceURI, c = a.value, l = Z(o), u = c, d = o === "value" ? u : fe(u);
			if (n.attrName = l, n.attrValue = d, n.keepAttr = !0, n.forceKeepAttr = void 0, $(V.uponSanitizeAttribute, e, n), d = n.attrValue, xt && (l === "id" || l === "name") && de(d, St) !== 0 && (Q(o, e), d = St + d), q && N(/((--!?|])>)|<\/(style|script|title|xmp|textarea|noscript|iframe|noembed|noframes)/i, d)) {
				Q(o, e);
				continue;
			}
			if (l === "attributename" && ue(d, "href")) {
				Q(o, e);
				continue;
			}
			if (!n.forceKeepAttr) {
				if (!n.keepAttr) {
					Q(o, e);
					continue;
				}
				if (!ft && N(Ge, d)) {
					Q(o, e);
					continue;
				}
				if (K && (d = cn(d)), !gn(i, l, d)) {
					Q(o, e);
					continue;
				}
				d = yn(i, l, s, d), d !== u && bn(e, o, s, d);
			}
		}
		$(V.afterSanitizeAttributes, e, null);
	}, Sn = function(e) {
		let t = null, n = sn(e);
		for ($(V.beforeSanitizeShadowDOM, e, null); t = n.nextNode();) if ($(V.uponSanitizeShadowNode, t, null), hn(t, e), xn(t), dn(t.content) && Sn(t.content), (h ? h(t) : t.nodeType) === z.element) {
			let e = re(t);
			dn(e) && (Cn(e), Sn(e));
		}
		$(V.afterSanitizeShadowDOM, e, null);
	}, Cn = function(e) {
		let t = [{
			node: e,
			shadow: null
		}];
		for (; t.length > 0;) {
			let e = t.pop();
			if (e.shadow) {
				Sn(e.shadow);
				continue;
			}
			let n = e.node, r = (h ? h(n) : n.nodeType) === z.element, i = f(n);
			if (i) for (let e = i.length - 1; e >= 0; --e) t.push({
				node: i[e],
				shadow: null
			});
			if (r) {
				let e = g ? g(n) : null;
				if (typeof e == "string" && Z(e) === "template") {
					let e = n.content;
					dn(e) && t.push({
						node: e,
						shadow: null
					});
				}
			}
			if (r) {
				let e = re(n);
				dn(e) && t.push({
					node: null,
					shadow: e
				}, {
					node: e,
					shadow: null
				});
			}
		}
	};
	return t.sanitize = function(e) {
		let n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, i = null, a = null, o = null, s = null;
		if (Pt = !e, Pt && (e = "<!-->"), typeof e != "string" && !fn(e) && (e = ye(e), typeof e != "string")) throw P("dirty is not a string, aborting");
		if (!t.isSupported) return e;
		pt ? (H = mt, U = ht) : qt(n), (V.uponSanitizeElement.length > 0 || V.uponSanitizeAttribute.length > 0) && (H = L(H)), V.uponSanitizeAttribute.length > 0 && (U = L(U)), t.removed = [];
		let c = wt && typeof e != "string" && fn(e);
		if (c) {
			an(e);
			let t = g ? g(e) : e.nodeName;
			if (typeof t == "string") {
				let n = Z(t);
				if (!H[n] || st[n]) throw tn(e), P("root node is forbidden and cannot be sanitized in-place");
			}
			if (un(e)) throw tn(e), P("root node is clobbered and cannot be sanitized in-place");
			try {
				Cn(e);
			} catch (t) {
				throw tn(e), t;
			}
		} else if (fn(e)) i = on("<!---->"), a = i.ownerDocument.importNode(e, !0), a.nodeType === z.element && a.nodeName === "BODY" || a.nodeName === "HTML" ? i = a : i.appendChild(a), Cn(a);
		else {
			if (!_t && !K && !J && e.indexOf("<") === -1) return _ && yt ? T(e) : e;
			if (i = on(e), !i) return _t ? null : yt ? v : "";
		}
		i && gt && en(i.firstChild);
		let l = c ? e : i, u = sn(l);
		try {
			for (; o = u.nextNode();) hn(o, l), xn(o), dn(o.content) && Sn(o.content);
		} catch (n) {
			throw c && (tn(e), E(t.removed, (e) => {
				e.element && rn(e.element);
			})), n;
		}
		if (c) return E(t.removed, (e) => {
			e.element && rn(e.element);
		}), K && ln(e), e;
		if (_t) {
			if (K && ln(i), vt) for (s = F.call(i.ownerDocument); i.firstChild;) s.appendChild(i.firstChild);
			else s = i;
			return (U.shadowroot || U.shadowrootmode) && (s = ve.call(r, s, !0)), s;
		}
		let d = J ? i.outerHTML : i.innerHTML;
		return J && H["!doctype"] && i.ownerDocument && i.ownerDocument.doctype && i.ownerDocument.doctype.name && N(Be, i.ownerDocument.doctype.name) && (d = "<!DOCTYPE " + i.ownerDocument.doctype.name + ">\n" + d), K && (d = cn(d)), _ && yt ? T(d) : d;
	}, t.setConfig = function() {
		let e = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
		qt(e), pt = !0, mt = H, ht = U;
	}, t.clearConfig = function() {
		Wt = null, pt = !1, mt = null, ht = null, _ = ae, v = "";
	}, t.isValidAttribute = function(e, t, n) {
		Wt || qt({});
		let r = Z(e), i = Z(t);
		return gn(r, i, n);
	}, t.addHook = function(e, t) {
		typeof t == "function" && j(V, e) && D(V[e], t);
	}, t.removeHook = function(e, t) {
		if (j(V, e)) {
			if (t !== void 0) {
				let n = oe(V[e], t);
				return n === -1 ? void 0 : ce(V[e], n, 1)[0];
			}
			return se(V[e]);
		}
	}, t.removeHooks = function(e) {
		j(V, e) && (V[e] = []);
	}, t.removeAllHooks = function() {
		V = Je();
	}, t;
}
var V = Ye();
//#endregion
//#region src/editor/preview.js
async function Xe({ client: e, url: t, form: n, content: r, mode: i, signal: a }) {
	let o = new FormData(n);
	o.set("preview", "1"), o.set("content", i === "markdown" ? te(r) : r);
	let s = await e.request(t || n.action, {
		method: "POST",
		body: o,
		signal: a
	});
	if (!s.ok) throw Error(`预览失败：${s.status}`);
	let c = s.headers.get("content-type") || "", l;
	if (c.includes("json")) {
		let e = await s.json();
		l = e.preview || e.content || e.html || "";
	} else {
		let e = new DOMParser().parseFromString(await s.text(), "text/html");
		l = e.querySelector(".preview,.content-preview,#preview,.user-content")?.innerHTML || e.body.innerHTML;
	}
	return V.sanitize(l, {
		FORBID_TAGS: [
			"script",
			"object",
			"embed"
		],
		FORBID_ATTR: ["style"]
	});
}
//#endregion
//#region src/editor/ubb.js
function Ze(e, t, n = t) {
	let r = e.selectionStart, i = e.selectionEnd, a = e.value.slice(r, i);
	e.setRangeText(`${t}${a}${n}`, r, i, "select"), e.dispatchEvent(new Event("input", { bubbles: !0 }));
}
function Qe(e, t) {
	Ze(e, `[${t}]`, `[/${t}]`);
}
//#endregion
//#region src/editor/toolbar.js
var $e = [
	[
		"标题",
		"## ",
		""
	],
	[
		"加粗",
		"**",
		"**"
	],
	[
		"引用",
		"> ",
		""
	],
	[
		"列表",
		"- ",
		""
	],
	[
		"代码",
		"```\n",
		"\n```"
	],
	[
		"链接",
		"[",
		"](https://)"
	]
];
function et({ textarea: t, getMode: n, onFormatLayout: r, onFormatCode: i, onChooseImage: a, onPreview: o }) {
	let s = e("div", { class: "hm-editor-actions" }), c = () => {
		s.replaceChildren(...n() === "markdown" ? $e.map(([n, r, i]) => e("button", {
			type: "button",
			onclick: () => Ze(t, r, i)
		}, n)) : [
			"b",
			"i",
			"u",
			"quote",
			"code",
			"url"
		].map((n) => e("button", {
			type: "button",
			onclick: () => Qe(t, n)
		}, n.toUpperCase())));
	};
	return c(), {
		node: e("div", { class: "hm-editor-toolbar" }, [s, e("div", { class: "hm-editor-tools" }, [
			e("button", {
				type: "button",
				onclick: r
			}, "辅助排版"),
			i ? e("button", {
				type: "button",
				onclick: i
			}, "格式化代码") : null,
			a ? e("button", {
				type: "button",
				onclick: a
			}, "添加图片") : null,
			e("button", {
				type: "button",
				onclick: o
			}, "服务器预览")
		])]),
		refresh: c
	};
}
//#endregion
//#region src/editor/controller.js
function tt(r) {
	let { form: s, textarea: c, titleInput: l, uid: d = 0, routeKey: f = "", targetId: p = "", previewUrl: re, services: m = {} } = r, h = r.mode === "ubb" ? "ubb" : "markdown", g, ie, _ = m.draftStore || i(m.storage || globalThis.localStorage), v = {
		uid: d,
		route: f,
		target: p
	}, ae = _.load(v), y = e("div", {
		class: "hm-editor-preview",
		"aria-live": "polite"
	}), b = e("div", { class: "hm-mode-switch" }), x = e("input", {
		type: "file",
		accept: "image/*",
		multiple: !0,
		hidden: !0
	}), S = e("div", {
		class: "hm-upload-status",
		"aria-live": "polite"
	}), C = n({
		upload: m.upload,
		insert: (e) => {
			let t = c.selectionStart ?? c.value.length, n = c.selectionEnd ?? t, r = `${t && !c.value.slice(0, t).endsWith("\n") ? "\n" : ""}${e}${n < c.value.length && !c.value.slice(n).startsWith("\n") ? "\n" : ""}`;
			c.setRangeText(r, t, n, "end"), c.dispatchEvent(new Event("input", { bubbles: !0 }));
		},
		getMode: () => h,
		onChange(t) {
			S.replaceChildren(...t.map((t) => e("span", { class: `is-${t.status}` }, t.status === "uploading" ? `${t.file.name} ${t.progress}%` : t.status === "success" ? `${t.file.name} 已插入` : t.status === "error" ? `${t.file.name}：${t.error}` : `${t.file.name} ${t.status}`)));
		}
	}), w = () => {
		clearTimeout(ie), ie = setTimeout(() => _.save({
			...v,
			mode: h,
			body: c.value,
			title: l?.value || ""
		}), 500);
	}, T = () => {
		let e = u(c.value);
		c.value = e.output, c.dispatchEvent(new Event("input", { bubbles: !0 })), m.toast?.({
			kind: "success",
			title: e.changes.length ? "排版已整理" : "正文已经很整齐"
		});
	}, E = async () => {
		let e = c.value, t = a(e, c.selectionStart || 0);
		if (!t) return m.toast?.({
			kind: "info",
			title: "请把光标放进代码块",
			message: "支持 Markdown 的 ``` 或 ~~~ 围栏代码块。"
		}), !1;
		let n = m.formatCode || (async (...e) => (await import("./registry-t3RgNTqX.js")).formatCode(...e));
		try {
			let r = await n(t.language, e.slice(t.contentStart, t.contentEnd));
			return c.value = o(e, t, r), c.setSelectionRange(t.contentStart, t.contentStart + String(r).trimEnd().length), c.dispatchEvent(new Event("input", { bubbles: !0 })), m.toast?.({
				kind: "success",
				title: "代码已格式化"
			}), !0;
		} catch (e) {
			return m.toast?.({
				kind: "error",
				title: "代码格式化失败，原文未修改",
				message: e?.message || String(e)
			}), !1;
		}
	}, oe = async () => {
		g?.abort(), g = new AbortController(), y.textContent = "正在生成服务器预览…";
		try {
			return y.innerHTML = await Xe({
				client: m.client,
				url: re,
				form: s,
				content: c.value,
				mode: h,
				signal: g.signal
			}), y.innerHTML;
		} catch (e) {
			throw e.name !== "AbortError" && (y.textContent = e.message, m.toast?.({
				kind: "error",
				title: "预览失败",
				message: e.message
			})), e;
		}
	}, se = et({
		textarea: c,
		getMode: () => h,
		onFormatLayout: T,
		onFormatCode: E,
		onChooseImage: () => x.click(),
		onPreview: oe
	}), D = () => {
		b.replaceChildren(...[["markdown", "Markdown"], ["ubb", "UBB"]].map(([t, n]) => e("button", {
			type: "button",
			"aria-pressed": h === t,
			onclick: () => A.setMode(t)
		}, n)));
	}, ce = ae ? e("div", {
		class: "hm-draft-banner",
		role: "status"
	}, [e("span", {}, "检测到这篇内容在本机保存的草稿。"), e("div", {}, [e("button", {
		type: "button",
		onclick: () => {
			A.restoreDraft(), ce.remove();
		}
	}, "恢复草稿"), e("button", {
		type: "button",
		onclick: () => {
			A.discardDraft(), ce.remove();
		}
	}, "丢弃草稿")])]) : null, O = e("div", { class: "hm-editor-pane" }, [
		e("div", { class: "hm-editor-head" }, [b, e("small", {}, "内容只在本机排版，预览由当前站点生成")]),
		ce,
		se.node,
		x,
		S
	]), k = e("section", { class: "hm-editor" }, [O, y]);
	c.before(k), O.append(c);
	let le = t({
		textarea: c,
		input: x,
		dropZone: O,
		queue: C
	}), ue = () => {
		h === "markdown" ? c.value = te(ne(c.value).output) : c.value = ee(c.value);
	};
	c.addEventListener("input", w), l?.addEventListener("input", w), s.addEventListener("submit", ue);
	let A = {
		getValue: () => ee(c.value),
		setValue(e) {
			c.value = ee(e);
		},
		getMode: () => h,
		setMode(e) {
			h = e === "ubb" ? "ubb" : "markdown", c.value = ee(c.value), D(), se.refresh();
		},
		preview: oe,
		restoreDraft() {
			let e = _.load(v);
			return e ? (c.value = e.body || "", l && (l.value = e.title || ""), A.setMode(e.mode), ce?.remove(), e) : null;
		},
		discardDraft() {
			_.remove(v), ce?.remove();
		},
		destroy() {
			clearTimeout(ie), g?.abort(), c.removeEventListener("input", w), l?.removeEventListener("input", w), s.removeEventListener("submit", ue), le(), k.before(c), k.remove();
		}
	};
	return D(), A;
}
//#endregion
export { tt as mountEditor };
