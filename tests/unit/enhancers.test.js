import { afterEach, expect, it, vi } from "vitest";
import { markCodeBlocks } from "../../src/enhancers/code.js";
import { applyFaceImageConstraints } from "../../src/enhancers/faces.js";
import { enhanceLinks } from "../../src/enhancers/links.js";

afterEach(() => document.body.replaceChildren());

it("limits hu60 face images without rounding them", () => {
  document.body.innerHTML =
    '<div id="root"><img src="/img/face/e59b9e.gif"></div>';
  applyFaceImageConstraints(document.querySelector("#root"));
  expect(document.querySelector("img").classList).toContain("hm-face-image");
});

it("marks code blocks idempotently with usable controls", () => {
  document.body.innerHTML =
    '<pre class="hu60_code"><code class="javascript">const x=1</code></pre>';
  markCodeBlocks(document.body);
  markCodeBlocks(document.body);

  expect(document.querySelectorAll(".hm-code-toolbar")).toHaveLength(1);
  expect(document.querySelector(".hm-code-language").textContent).toBe(
    "JavaScript"
  );
  expect(document.querySelector('[data-action="copy-code"]')).not.toBeNull();
  expect(document.querySelector("pre").dataset.hmCodeEnhanced).toBe("1");
});

it("copies code using the injected clipboard", async () => {
  const writeText = vi.fn(async () => {});
  document.body.innerHTML = "<pre><code>echo hello</code></pre>";
  markCodeBlocks(document.body, { clipboard: { writeText } });

  document.querySelector('[data-action="copy-code"]').click();
  await vi.waitFor(() => expect(writeText).toHaveBeenCalledWith("echo hello"));
});

it("protects external links without changing same-origin links", () => {
  document.body.innerHTML = `
    <a id="local" href="/q.php/index.index.html">站内</a>
    <a id="external" href="https://example.com/">站外</a>
  `;
  enhanceLinks(document.body);

  expect(document.querySelector("#local").getAttribute("target")).toBeNull();
  expect(document.querySelector("#external").getAttribute("target")).toBe(
    "_blank"
  );
  expect(document.querySelector("#external").getAttribute("rel")).toContain(
    "noopener"
  );
});
