function fieldLabel(field) {
  return (
    field.labels?.[0]?.textContent?.trim() ||
    field.getAttribute("placeholder") ||
    field.name
  );
}

export function extractFormModel(html, selector = "form") {
  const doc = new DOMParser().parseFromString(html, "text/html");
  const form = doc.querySelector(selector);
  if (!form) throw new Error("页面中没有找到可适配的表单");

  const elements = [...form.elements];
  const fields = elements
    .filter(
      (field) =>
        field.name && !["submit", "button", "reset"].includes(field.type)
    )
    .map((field) => ({
      tag: field.tagName.toLowerCase(),
      type: field.type || "",
      name: field.name,
      value: field.value,
      label: fieldLabel(field),
      placeholder: field.getAttribute("placeholder") || "",
      required: field.required,
      disabled: field.disabled,
      checked: Boolean(field.checked),
      accept: field.getAttribute("accept") || "",
      options:
        field.tagName === "SELECT"
          ? [...field.options].map((option) => ({
              value: option.value,
              label: option.text,
              selected: option.selected
            }))
          : []
    }));
  const submitters = elements
    .filter((field) => ["submit", "button"].includes(field.type))
    .map((field) => ({
      name: field.name,
      value: field.value,
      label: field.textContent?.trim() || field.value || "提交"
    }));

  return {
    action: form.getAttribute("action") || location.href,
    method: (form.getAttribute("method") || "get").toLowerCase(),
    enctype:
      form.getAttribute("enctype") ||
      "application/x-www-form-urlencoded",
    title:
      doc.querySelector("h1,h2,title")?.textContent?.trim() || "表单",
    fields,
    submitters
  };
}
