# AGENTS.md — personal-ip

个人 IP（个人品牌）官网项目。中文优先，定位：**Avah — IT Girl / IT Woman**（时尚科技感、审美驱动）。

## 命令

- 安装：`npm install`
- 开发：`npm run dev` 或 `npm start`
- 构建：`npm run build`
- 预览：`npm run preview`

## 约定

- **文案入口**：`src/content.js`（品牌名、人设、作品集、灵感取材/过程/介绍 vlog、主张、联系方式）
- **结构**：单页多 section（hero → about → works → pillars → contact）
- **内容形态**：作品集入口 + 灵感取材 + 制作过程 vlog + 作品介绍 vlog（可在 `works.series` 扩展）
- **视觉**：墨黑 + 瓷白 + 香槟铬；勿改成紫渐变 / 奶油衬线 / 报纸排版等 AI 默认风
- **设计约束**：首屏品牌优先、全幅视觉、无卡片堆砌、无 hero 浮层徽章
- 除非用户明确要求，不要擅自 `git commit`
