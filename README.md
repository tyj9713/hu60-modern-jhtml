# hu60-modern-jhtml

面向 hu60wap6 的现代响应式 JHTML 前端包。它不修改 PHP、数据库或管理后台，通过同源 JSON/HTML 接口渐进增强普通用户页面。

## 安装

把以下两行保存为站点的 JHTML 自定义内容：

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/tyj9713/hu60-modern-jhtml@v1.0.2/dist/theme.min.css">
<script type="module" src="https://cdn.jsdelivr.net/gh/tyj9713/hu60-modern-jhtml@v1.0.2/dist/app.min.js"></script>
```

发布地址固定到 Git 标签 `v1.0.2`，避免 CDN 上游更新导致已部署站点在未验证的情况下变化。回滚时清空这两行，或改回上一个已验证版本；普通 `.html` 页面始终保留为兼容入口。

## 覆盖范围

- 首页、虎友网站、最新聊天室消息
- 版块、主题、搜索、收藏与显式分页
- 发帖、编辑、回复及常见操作结果页
- 用户主页、个人中心、设置、登录、注册、激活与找回密码
- 收件箱、发件箱、@消息、单条消息、私聊
- 公共聊天室、网页插件、浏览器 UA、编码解码器

管理后台不会被接管，相关链接继续使用普通 `.html`。1.0.x 只提供浅色主题，不包含深色模式。

## 编辑器

默认使用 Markdown，可随时切换 UBB。提交时写入 hu60 现有 UBBParser 可识别的 Markdown 兼容标记；老用户和已有 UBB 内容可直接使用 UBB 模式。编辑器支持本地草稿、纯本地辅助排版、服务器预览、图片粘贴/拖放上传，以及 JavaScript、TypeScript、JSON、HTML、CSS、Markdown、PHP、Python、SQL、Shell 围栏代码块格式化。

辅助排版不会上传内容。服务器预览和图片上传会把对应内容发送到当前 hu60 站点的同源接口；格式化器在浏览器本地运行。jsDelivr 只提供静态包文件，但 CDN 仍会收到常规网络请求元数据。

## 开发与验证

```powershell
pnpm install --frozen-lockfile
pnpm test:coverage
pnpm build
pnpm verify:dist
pnpm test:browser
```

浏览器回归覆盖 390×844、768×1024、1440×900 三档视口。
