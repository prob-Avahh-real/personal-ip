/**
 * 站点文案与链接 — 改这里即可定制个人 IP
 * 修改后保存，开发服务器会自动热更新
 */
export const site = {
  brand: 'Avah',
  brandZh: 'IT Girl',
  title: 'Avah--IT Girl',
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
    intro:
      '作品集是入口——先点进可玩的现场；灵感取材、过程与介绍，让每一件作品从何而来、如何做成，都被看懂。',
    portfolio: {
      tag: 'Featured · Playable',
      name: '空气陀螺',
      nameEn: 'Air Top',
      blurb:
        '用空中手势抽打虚拟陀螺：戒指调倾角与款式，手杖抽打与点地。木质 / 金属 / 霓虹 / 琉璃四款，转速、倾角与音效一体。手机触控也能玩——点进去，就是现场。',
      href: './air-top/',
      cta: '立即体验',
      external: true,
    },
    series: [
      {
        id: 'process',
        tag: 'Process Vlog',
        name: '制作过程',
        nameEn: 'Behind the Make',
        blurb: '从构思、选材到成片——公开审美决策与动手现场。',
        href: '#process',
        cta: '看过程',
        items: [
          {
            title: '空气陀螺：物理与四款皮肤怎么定',
            note: '待更新 · 摩擦、惯量与倒下阈值',
            href: '#',
          },
          {
            title: '戒指 / 手杖手势怎么接到陀螺上',
            note: '待更新 · 倾角、抽打与点地',
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
        href: '#intro',
        cta: '看介绍',
        items: [
          {
            title: '空气陀螺：一分钟看懂怎么玩',
            note: '待更新 · 触控兜底与可穿戴输入',
            href: './air-top/',
            external: true,
          },
          {
            title: '为什么是「抽打」而不是按钮连点',
            note: '待更新 · 手势语感与身体感',
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
        href: '#source',
        cta: '看取材',
        items: [
          {
            title: '木质陀螺的磨损边缘',
            note: '待更新 · 摩擦声 → 木质款衰减曲线',
            href: '#',
          },
          {
            title: '霓虹灯管的冷绿残影',
            note: '待更新 · 夜色 → 霓虹款色板',
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
      { label: 'Telegram', href: 'https://t.me/' },
      { label: 'Discord', href: 'https://discord.gg/' },
    ],
  },

  footer: {
    note: 'Aesthetic · Source · Process · Presence',
  },
};
