import "./styles/tokens.css";
import "./styles/base.css";
import "./styles/shell.css";
import "./styles/components.css";
import "./styles/pages.css";
import "./styles/editor.css";
import "./styles/responsive.css";
import { bootstrap } from "./core/bootstrap.js";

bootstrap().catch((error) => {
  document.documentElement.dataset.hu60ModernFailed = "true";
  console.error("[hu60-modern]", error);
});
