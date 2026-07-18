import { extractFormModel } from "./html-form.js";

export function normalizeUa(payload = {}) {
  const headers = {};
  for (const [name, value] of Object.entries(payload.header || payload.headers || {})) {
    if (name.toLowerCase() === "cookie") continue;
    headers[name.toLowerCase()] = String(value);
  }
  return {
    ip: String(payload.ip || ""),
    location: String(payload.location || ""),
    proxy: String(payload.proxy || ""),
    headers
  };
}

export function extractCoderForm(html) {
  return extractFormModel(html, "form");
}
