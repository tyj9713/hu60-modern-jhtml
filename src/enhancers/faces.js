export function applyFaceImageConstraints(root) {
  for (const image of root.querySelectorAll('img[src*="/img/face/"]')) {
    image.classList.add("hm-face-image");
  }
}
