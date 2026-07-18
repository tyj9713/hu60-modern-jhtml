import { createHu60Client } from "./client.js";
import { createNavigation } from "./navigation.js";
import { createRouteRegistry } from "./registry.js";
import { detectRoute } from "./route.js";
import { toBidUrl } from "./urls.js";
import { renderFallback } from "../pages/fallback.js";
import { confirmDialog } from "../ui/dialog.js";
import { toast } from "../ui/feedback.js";
import { createShell } from "../ui/shell.js";

const pageModules = {
  home: () => import("../pages/home.js"),
  forum: () => import("../pages/forum.js"),
  topic: () => import("../pages/topic.js"),
  search: () => import("../pages/search.js"),
  forms: () => import("../pages/forms.js"),
  user: () => import("../pages/user.js"),
  messages: () => import("../pages/messages.js"),
  chat: () => import("../pages/chat.js"),
  webplug: () => import("../pages/webplug.js"),
  tools: () => import("../pages/tools.js")
};

const page = (cid, pid, source, moduleName, auth = "optional") => ({
  cid,
  pid,
  auth,
  source,
  userFields: ["avatar", "name", "uid"],
  myselfFields: ["newMsg", "newAtInfo", "newChats"],
  load: pageModules[moduleName],
  fallbackBid: "html"
});

export const routeDefinitions = [
  page("index", "index", "json", "home"),

  page("bbs", "forum", "json", "forum"),
  page("bbs", "topic", "json", "topic"),
  page("bbs", "search", "json", "search"),
  page("bbs", "myfavorite", "json", "search", "required"),
  page("bbs", "newtopic", "html-form", "forms", "required"),
  page("bbs", "newreply", "json", "forms", "required"),
  page("bbs", "edittopic", "html-form", "forms", "required"),
  page("bbs", "deltopic", "html-form", "forms", "required"),
  page("bbs", "setfavoritetopic", "html-form", "forms", "required"),
  page("bbs", "unsetfavoritetopic", "html-form", "forms", "required"),
  page("bbs", "setessencetopic", "html-form", "forms", "required"),
  page("bbs", "unsetessencetopic", "html-form", "forms", "required"),
  page("bbs", "movetopic", "html-form", "forms", "required"),
  page("bbs", "sinktopic", "html-form", "forms", "required"),
  page("bbs", "lockreply", "html-form", "forms", "required"),
  page("bbs", "review", "html-form", "forms", "required"),

  page("user", "index", "json", "user", "required"),
  page("user", "info", "json", "user"),
  page("user", "login", "html-form", "forms"),
  page("user", "reg", "html-form", "forms"),
  page("user", "active", "html-form", "forms"),
  page("user", "reset_pwd", "html-form", "forms"),
  page("user", "exit", "html-form", "forms", "required"),
  page("user", "chpwd", "html-form", "forms", "required"),
  page("user", "chname", "html-form", "forms", "required"),
  page("user", "chinfo", "html-form", "forms", "required"),
  page("user", "avatar", "html-form", "forms", "required"),
  page("user", "relationship", "json", "user", "required"),
  page("user", "block_post", "html-form", "forms", "required"),
  page("user", "wechat", "html-form", "forms", "required"),

  page("msg", "index", "json", "messages", "required"),
  page("addin", "chat", "json", "chat"),
  page("addin", "webplug", "api", "webplug", "required"),
  page("tools", "ua", "json", "tools"),
  page("tools", "coder", "html-form", "tools"),

  page("bbs", "*", "html-form", "forms"),
  page("user", "*", "html-form", "forms"),
  page("msg", "*", "html-form", "messages", "required")
];

function createServices(client) {
  return {
    client,
    toast,
    confirmDialog,
    async mountEditor(options) {
      const { mountEditor } = await import("../editor/controller.js");
      return mountEditor(options);
    },
    async formatCode(...args) {
      const { formatCode } = await import("../formatters/registry.js");
      return formatCode(...args);
    },
    async createUploadQueue(options) {
      const { createUploadQueue } = await import("../editor/upload.js");
      return createUploadQueue(options);
    }
  };
}

export async function bootstrap(options = {}) {
  const client = options.client || createHu60Client();
  const registry = createRouteRegistry(
    options.routeDefinitions || routeDefinitions
  );
  let shell;

  const render = async (target) => {
    const url = target instanceof URL ? target : new URL(target, location.href);
    const route = detectRoute(url);
    if (route.cid === "admin") {
      const ordinaryUrl = toBidUrl(route, "html");
      (options.location || location).replace(ordinaryUrl);
      return;
    }

    const definition = registry.resolve(route);
    shell = (options.createShell || createShell)({ route, user: null });
    try {
      if (!definition) {
        throw new Error("当前页面尚未注册现代适配器");
      }
      const module = await definition.load();
      await module.mount({
        route,
        client,
        shell,
        definition,
        services: createServices(client)
      });
    } catch (error) {
      shell.setTitle("兼容模式");
      shell.setMain(
        renderFallback({
          route,
          error,
          ordinaryUrl: toBidUrl(route, "html")
        })
      );
      shell.setSidebar(document.createElement("div"));
    }
  };

  await render(options.url || location.href);
  const disposeNavigation =
    options.navigation === false
      ? () => {}
      : createNavigation({ onNavigate: render });
  return { render, disposeNavigation, get shell() { return shell; } };
}
