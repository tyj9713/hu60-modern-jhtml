import { enhanceCodeBlocks, markCodeBlocks } from "./code.js";
import { applyFaceImageConstraints } from "./faces.js";
import { enhanceLinks } from "./links.js";

export function enhanceContentSync(root) {
  applyFaceImageConstraints(root);
  enhanceLinks(root);
  markCodeBlocks(root);
}

export async function enhanceContent(root) {
  applyFaceImageConstraints(root);
  enhanceLinks(root);
  await enhanceCodeBlocks(root);
}
