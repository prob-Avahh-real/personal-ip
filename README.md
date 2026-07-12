# Avah 个人 IP 官网

IT Girl / IT Woman 个人品牌站点：关于、作品集、灵感取材、制作过程 vlog、作品介绍 vlog，以及合作入口。

视觉方向：**墨黑（ink）+ 瓷白（porcelain）+ 香槟铬（champagne）**，中文优先，轻量双语点缀。

## 本地运行

```bash
npm install
npm run dev
```

浏览器打开终端里提示的地址（默认 `http://localhost:5173`）。

| 命令 | 说明 |
|------|------|
| `npm run dev` / `npm start` | 开发服务器（热更新） |
| `npm run build` | 产出静态文件到 `dist/` |
| `npm run preview` | 预览构建结果 |

## 如何定制

几乎所有文案与链接都集中在：

**`src/content.js`**

可改字段包括：

- `brand` / `brandZh` / `title` / `description` — 品牌名与页面标题
- `hero` — 首屏标题、副文案、按钮
- `about` — 人设段落
- `works.portfolio` — 作品集入口（名称、简介、链接）
- `works.series` — 内容系列（`process` 制作过程 / `intro` 作品介绍 / `source` 灵感取材），每条可加 `items`
- `pillars.items` — 内容主张（默认：作品 / 取材 / 过程 / 介绍）
- `contact` — 邮箱与社交链接

改完保存即可在开发模式下即时刷新。

### 视觉微调

CSS 变量在 `src/styles.css` 顶部的 `:root`：

- `--ink-*` 背景墨阶
- `--porcelain` / `--porcelain-muted` 文字色
- `--champagne` 强调色（香槟铬）
- `--font-display` / `--font-serif-zh` / `--font-body` 字体

## 目录结构

```
personal-ip/
├── index.html          # 页面骨架
├── src/
│   ├── content.js      # ← 改文案主要改这里
│   ├── main.js         # 渲染与交互动效
│   └── styles.css      # 视觉与响应式
├── package.json
├── vite.config.js
└── AGENTS.md
```

## 技术栈

Vite + 原生 HTML / CSS / JS，无框架，便于维护与部署静态托管。

## 境外部署（Vercel）

本站以静态站点托管在 Vercel（无需中国 ICP）。构建命令：`npm run build`，产出目录：`dist/`。配置见根目录 `vercel.json`。

### 方式 A：从 GitHub 一键导入（推荐）

1. 打开 [vercel.com/new](https://vercel.com/new)，登录 Vercel  
2. Import 本仓库（Framework Preset 选 Vite，Output 为 `dist`）  
3. Deploy 后得到 `*.vercel.app` 生产地址  

之后每次 `git push` 主分支会自动重新部署。

### 方式 B：CLI

```bash
npm install -g vercel   # 如尚未安装
vercel login            # 浏览器授权一次
vercel --yes --prod     # 生产部署
```

### 认领（Claim）说明

旧版「无登录 claimable deploy」接口目前已改为引导使用 CLI / Dashboard，不再直接返回 Preview + Claim URL。若你仍拿到历史 Claim 链接，打开后登录即可把项目转到自己账号。

### 绑定自定义域名

1. 在 [Vercel Dashboard](https://vercel.com/dashboard) 打开本项目  
2. **Settings → Domains** → 添加域名（如 `avah.example.com`）  
3. 按提示在域名 DNS 添加记录（通常是 CNAME 到 `cname.vercel-dns.com`，或按面板显示配置）  
4. 证书由 Vercel 自动签发；生效后即可用该域名访问  

当前步骤不强制购买域名；可先用 `*.vercel.app` 预览地址上线。

### 备用：GitHub Pages

仓库已配置 Actions 部署到 GitHub Pages（境外、无 ICP），地址：

https://prob-avahh-real.github.io/personal-ip/

推送 `main` 会自动更新。正式品牌域名仍建议用 Vercel Domains 绑定。
