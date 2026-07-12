/**
 * 站点文案与链接 — 改这里即可定制个人 IP
 * 修改后保存，开发服务器会自动热更新
 */
export const site = {
  brand: 'Avah',
  brandZh: 'IT Girl',
  title: 'Avah — IT Girl 个人品牌',
  description:
    'Avah：审美驱动的数字时代女性。作品集、灵感取材、制作过程与作品介绍，持续更新。',

  hero: {
    headline: '把审美，做成看得见的内容',
    support: 'IT Girl · 时尚科技感 · 独立而清晰的个人表达',
    primaryCta: { label: '进入作品集', href: '#works' },
    secondaryCta: { label: '商务合作', href: '#contact' },
  },

  nav: [
    { label: '关于', href: '#about' },
    { label: '内容', href: '#works' },
    { label: '主张', href: '#pillars' },
    { label: '合作', href: '#contact' },
  ],

  about: {
    eyebrow: 'About',
    title: '关于 Avah',
    body: [
      '我是 Avah——以审美为起点的 IT Girl。关注穿搭、数字生活与内容创作，把「好看」和「好玩」同时做出来。',
      '这里不只是作品陈列：你会看到灵感取材、完成的作品、制作过程的 vlog，以及介绍作品本身的短片。取材、过程、介绍、作品，四条线一起生长。',
    ],
  },

  works: {
    eyebrow: 'Studio',
    title: '作品与影像',
    intro: '作品集是入口；灵感取材、过程与介绍，让每一件作品从何而来、如何做成，都被看懂。',
    portfolio: {
      tag: 'Portfolio',
      name: '作品集',
      nameEn: 'Full Portfolio',
      blurb: '精选项目与视觉作品的完整入口。持续更新，从成片到可点击的现场。',
      href: '#',
      cta: '打开作品集',
    },
    series: [
      {
        id: 'process',
        tag: 'Process Vlog',
        name: '制作过程',
        nameEn: 'Behind the Make',
        blurb: '从构思、选材到成片——公开审美决策与动手现场。',
        href: '#',
        cta: '看过程',
        items: [
          {
            title: '一套 Look 是怎么定下来的',
            note: '从 moodboard 到上身试色',
            href: '#',
          },
          {
            title: '拍摄日：灯光、节奏与取舍',
            note: '成片背后的现场记录',
            href: '#',
          },
        ],
      },
      {
        id: 'intro',
        tag: 'Showcase Vlog',
        name: '作品介绍',
        nameEn: 'The Piece Itself',
        blurb: '用短片讲清楚一件作品：灵感、结构、以及为什么这样呈现。',
        href: '#',
        cta: '看介绍',
        items: [
          {
            title: '新作发布：本季视觉主题',
            note: '成片导览与灵感来源',
            href: '#',
          },
          {
            title: '为什么选择这组材质与配色',
            note: '审美逻辑拆解',
            href: '#',
          },
        ],
      },
      {
        id: 'source',
        tag: 'Source Notes',
        name: '灵感取材',
        nameEn: 'Caught Anywhere',
        blurb: '随地取大小材——街头、物件、材质与瞬间，收成作品的起点。',
        href: '#',
        cta: '看取材',
        items: [
          {
            title: '地铁扶手上的磨损铬色',
            note: '金属氧化 → 下一季配饰色板',
            href: '#',
          },
          {
            title: '便利店冷柜的雾面玻璃',
            note: '凝结水珠 → 半透明层叠质感',
            href: '#',
          },
          {
            title: '雨后柏油路上的霓虹倒影',
            note: '碎光条纹 → 动态片头节奏',
            href: '#',
          },
        ],
      },
    ],
  },

  pillars: {
    eyebrow: 'Pillars',
    title: '内容怎么生长',
    items: [
      {
        name: '作品',
        detail: '可被收藏、可被点击的成品——作品集是一切的入口。',
      },
      {
        name: '取材',
        detail: '灵感取材：随地取大小材——街头、物件、材质，收成作品的种子。',
      },
      {
        name: '过程',
        detail: '制作过程 vlog：展示怎么做、怎么选、怎么改到满意。',
      },
      {
        name: '介绍',
        detail: '作品介绍 vlog：把灵感、结构与完成态讲清楚，方便传播与合作。',
      },
    ],
  },

  contact: {
    eyebrow: 'Connect',
    title: '合作与联络',
    body: '品牌联名、内容共创、出镜合作，或只是想认识一下——欢迎来信。',
    email: 'hello@avah.studio',
    emailHref: 'mailto:hello@avah.studio',
    socials: [
      { label: '小红书', href: '#' },
      { label: 'Instagram', href: '#' },
      { label: 'Bilibili', href: '#' },
    ],
  },

  footer: {
    note: 'Aesthetic · Source · Process · Presence',
  },
};
