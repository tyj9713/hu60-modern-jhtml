import { expect, it, vi } from "vitest";
import { extractFormModel } from "../../src/adapters/html-form.js";
import {
  bindAsyncFormSubmit,
  renderForm
} from "../../src/ui/forms.js";

it("preserves names, tokens, selected options and action", () => {
  const model = extractFormModel(
    `
      <form action="user.login.json" method="post">
        <input name="token" type="hidden" value="abc">
        <label>登录方式
          <select name="type"><option value="name" selected>用户名</option></select>
        </label>
        <label for="account">账号</label><input id="account" name="account" value="">
        <button name="go" value="1">登录</button>
      </form>
    `,
    "form"
  );

  expect(model.action).toBe("user.login.json");
  expect(model.method).toBe("post");
  expect(model.fields.find((field) => field.name === "token").value).toBe(
    "abc"
  );
  expect(model.fields.find((field) => field.name === "type").value).toBe(
    "name"
  );
  expect(model.fields.find((field) => field.name === "account").label).toBe(
    "账号"
  );
  expect(model.submitters[0]).toMatchObject({
    name: "go",
    value: "1",
    label: "登录"
  });
});

it("uses Chinese labels for unlabeled post fields", () => {
  const model = extractFormModel(`
    <h1>发布主题</h1>
    <form action="bbs.newtopic.215.html" method="post">
      <input name="title">
      <textarea name="content"></textarea>
      <button type="submit">发布</button>
    </form>
  `);

  expect(model.fields.find((field) => field.name === "title").label).toBe(
    "标题"
  );
  expect(model.fields.find((field) => field.name === "content").label).toBe(
    "正文"
  );
});

it("renders the original field names and delegates submission", () => {
  const onSubmit = vi.fn((event) => event.preventDefault());
  const form = renderForm(
    {
      action: "user.login.json",
      method: "post",
      fields: [
        {
          tag: "input",
          type: "hidden",
          name: "token",
          value: "abc",
          label: "token"
        },
        {
          tag: "input",
          type: "password",
          name: "password",
          value: "",
          label: "密码",
          required: true
        }
      ],
      submitters: [{ name: "go", value: "1", label: "登录" }]
    },
    { onSubmit }
  );

  expect(form.querySelector('[name="token"]').value).toBe("abc");
  expect(form.querySelector('[name="password"]').autocomplete).toBe(
    "current-password"
  );
  form.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));
  expect(onSubmit).toHaveBeenCalledOnce();
});

it("submits JSON forms without leaving the modern page", async () => {
  document.body.innerHTML = `
    <form action="addin.chat.room.json" method="post">
      <textarea name="content">正文</textarea>
      <button type="submit" name="go" value="发送">发送</button>
    </form>
  `;
  const form = document.querySelector("form");
  const controller = {
    getValue: vi.fn(() => "正文"),
    setValue: vi.fn(),
    discardDraft: vi.fn()
  };
  const toast = vi.fn();
  const request = vi.fn(async () =>
    new Response(JSON.stringify({ success: true, url: "addin.chat.room.jhtml" }), {
      status: 200,
      headers: { "content-type": "application/json" }
    })
  );
  bindAsyncFormSubmit(form, { client: { request }, controller, toast });

  form.requestSubmit(form.querySelector("button"));
  await vi.waitFor(() => expect(request).toHaveBeenCalledOnce());
  await vi.waitFor(() => expect(controller.setValue).toHaveBeenCalledWith(""));

  expect(request.mock.calls[0][1].body.get("go")).toBe("发送");
  expect(controller.discardDraft).toHaveBeenCalledOnce();
  expect(toast).toHaveBeenCalledWith(
    expect.objectContaining({ kind: "success" })
  );
});

it("keeps editor content when an async form submission fails", async () => {
  document.body.innerHTML = `
    <form action="msg.index.send.9.json" method="post">
      <textarea name="content">不能丢失</textarea>
      <button type="submit">回复</button>
    </form>
  `;
  const form = document.querySelector("form");
  const controller = {
    getValue: vi.fn(() => "不能丢失"),
    setValue: vi.fn(),
    discardDraft: vi.fn()
  };
  const toast = vi.fn();
  bindAsyncFormSubmit(form, {
    client: {
      request: vi.fn(async () => {
        throw new Error("网络不可用");
      })
    },
    controller,
    toast
  });

  form.requestSubmit();
  await vi.waitFor(() =>
    expect(toast).toHaveBeenCalledWith(
      expect.objectContaining({ kind: "error", message: "网络不可用" })
    )
  );

  expect(controller.setValue).toHaveBeenCalledWith("不能丢失");
  expect(controller.discardDraft).not.toHaveBeenCalled();
});
