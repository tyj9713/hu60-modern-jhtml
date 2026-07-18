import { el } from "./dom.js";

function renderControl(field) {
  const common = {
    name: field.name,
    required: field.required,
    disabled: field.disabled,
    placeholder: field.placeholder || null
  };
  let control;

  if (field.tag === "textarea") {
    control = el("textarea", common, field.value || "");
  } else if (field.tag === "select") {
    control = el(
      "select",
      common,
      (field.options || []).map((option) =>
        el(
          "option",
          {
            value: option.value,
            selected: option.selected
          },
          option.label
        )
      )
    );
  } else {
    const type = field.type || "text";
    control = el("input", {
      ...common,
      type,
      value: ["file", "checkbox", "radio"].includes(type)
        ? null
        : field.value || "",
      checked: field.checked,
      accept: field.accept || null,
      autocomplete:
        type === "password" ? "current-password" : null
    });
  }
  control.classList.add("hm-form-control");
  return control;
}

export function renderForm(model, services = {}) {
  const form = el("form", {
    class: "hm-form",
    action: model.action,
    method: model.method,
    enctype: model.enctype,
    onsubmit: services.onSubmit || null
  });

  for (const field of model.fields) {
    const control = renderControl(field);
    if (field.type === "hidden") {
      form.append(control);
      continue;
    }
    const inline = ["checkbox", "radio"].includes(field.type);
    form.append(
      el(
        "label",
        { class: `hm-form-field${inline ? " is-inline" : ""}` },
        inline
          ? [control, el("span", {}, field.label)]
          : [el("span", {}, field.label), control]
      )
    );
  }

  form.append(
    el(
      "div",
      { class: "hm-form-actions" },
      (model.submitters?.length
        ? model.submitters
        : [{ name: "", value: "", label: "提交" }]
      ).map((item) =>
        el(
          "button",
          {
            class: "hm-button is-primary",
            type: "submit",
            name: item.name || null,
            value: item.value || null
          },
          item.label
        )
      )
    )
  );
  return form;
}

export function bindAsyncFormSubmit(
  form,
  { client, controller, toast = () => {}, onSuccess = () => {} }
) {
  let submitting = false;
  const submit = async (event) => {
    event.preventDefault();
    if (submitting) return;
    submitting = true;
    const previous = controller?.getValue?.() ??
      form.querySelector('textarea[name="content"]')?.value ??
      "";
    const buttons = [...form.querySelectorAll('button[type="submit"],input[type="submit"]')];
    buttons.forEach((button) => {
      button.disabled = true;
    });

    try {
      const body = new FormData(form);
      if (event.submitter?.name) {
        body.set(event.submitter.name, event.submitter.value);
      }
      const response = await client.request(form.getAttribute("action"), {
        method: (form.getAttribute("method") || "post").toUpperCase(),
        body
      });
      if (!response.ok) throw new Error(`请求失败：${response.status}`);

      const type = response.headers.get("content-type") || "";
      const payload = type.includes("json") ? await response.json() : {};
      if (payload.success === false || payload.ok === false || payload.error) {
        throw new Error(payload.error || payload.message || "提交失败");
      }

      controller?.setValue?.("");
      controller?.discardDraft?.();
      toast({ kind: "success", title: "发送成功" });
      await onSuccess(payload);
    } catch (error) {
      controller?.setValue?.(previous);
      toast({
        kind: "error",
        title: "发送失败，内容已保留",
        message: error?.message || String(error)
      });
    } finally {
      submitting = false;
      buttons.forEach((button) => {
        button.disabled = false;
      });
    }
  };

  form.addEventListener("submit", submit);
  return () => form.removeEventListener("submit", submit);
}
