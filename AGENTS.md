# personal-ip

个人 IP（个人品牌）官网。中文优先，定位：**Avah — IT Girl / IT Woman**。

## 用途与 Target 判定

交付形态就是**网站**（Vercel/静态），不是消费级 App。

- 移动端：不适用（响应式网页即可，不要求 APK）
- 智能硬件：不适用

## 命令

```bash
npm install
npm run dev    # 或 npm start
npm run build
npm run preview
```

## 验证环 / Done

- `npm run build` 成功
- 本地 `preview` 首屏品牌/视觉符合本文件约定

## 约定

- **文案入口**：`src/content.js`
- **结构**：单页多 section（hero → about → works → pillars → contact）
- **视觉**：孔雀绿底（teal-emerald / peacock）+ 漆红/石榴红字；勿改成紫渐变 / 奶油衬线 / 报纸排版等 AI 默认风
- **设计**：首屏品牌优先、全幅视觉、无卡片堆砌、无 hero 浮层徽章
- 除非用户明确要求，不要擅自 `git commit`

## Harness / Loop（助手）

- 遵循根 `/Users/skat/AGENTS.md`：**Harness Engineering** + **Loop Engineering**
- Guide = 本文件；Sensor = 下方验证命令；同类失误第二次须沉淀规则或测试（棘轮）
- 开干前写清 **Done**；每切片过验证环；显式停止（成功 / 上限 / 无进展 / 人审）
- 详解：`docs/HARNESS_ENGINEERING.md`、`docs/LOOP_ENGINEERING.md`
