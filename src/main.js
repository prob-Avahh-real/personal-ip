import { site } from './content.js';

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

function renderBrand() {
  $$('[data-brand]').forEach((el) => {
    el.textContent = site.brand;
  });
  $$('[data-brand-hero]').forEach((el) => {
    el.textContent = site.brand;
  });
  $$('[data-brand-footer]').forEach((el) => {
    el.textContent = site.brand;
  });
  const sub = $('[data-brand-sub]');
  if (sub) sub.textContent = `${site.brandZh} · Personal Brand`;
  const logo = $('.logo');
  if (logo) logo.setAttribute('aria-label', `${site.brand} 首页`);
}

function renderNav() {
  const links = site.nav
    .map((item) => `<a href="${item.href}">${item.label}</a>`)
    .join('');
  $('[data-nav]').innerHTML = links;
  $('[data-mobile-nav]').innerHTML = links;
}

function renderHero() {
  $('[data-headline]').textContent = site.hero.headline;
  $('[data-support]').textContent = site.hero.support;
  $('[data-ctas]').innerHTML = `
    <a class="btn btn-primary" href="${site.hero.primaryCta.href}">${site.hero.primaryCta.label}</a>
    <a class="btn btn-ghost" href="${site.hero.secondaryCta.href}">${site.hero.secondaryCta.label}</a>
  `;
}

function renderAbout() {
  $('[data-about-eyebrow]').textContent = site.about.eyebrow;
  $('[data-about-title]').textContent = site.about.title;
  $('[data-about-body]').innerHTML = site.about.body
    .map((p) => `<p>${p}</p>`)
    .join('');
}

function renderVlogItems(items) {
  return items
    .map(
      (item) => `
      <li>
        <a class="vlog-item" href="${item.href}">
          <span class="vlog-title">${item.title}</span>
          <span class="vlog-note">${item.note}</span>
        </a>
      </li>
    `,
    )
    .join('');
}

function renderWorks() {
  $('[data-works-eyebrow]').textContent = site.works.eyebrow;
  $('[data-works-title]').textContent = site.works.title;
  $('[data-works-intro]').textContent = site.works.intro;

  const portfolio = site.works.portfolio;
  const seriesHtml = site.works.series
    .map(
      (series) => `
      <div class="series-block" id="${series.id}">
        <span class="block-tag">${series.tag}</span>
        <span class="block-name">${series.name}<span class="block-name-en">${series.nameEn}</span></span>
        <p class="block-blurb">${series.blurb}</p>
        <ul class="vlog-list">${renderVlogItems(series.items)}</ul>
        <a class="btn-text" href="${series.href}">${series.cta} →</a>
      </div>
    `,
    )
    .join('');

  $('[data-works-body]').innerHTML = `
    <a class="portfolio-block" href="${portfolio.href}">
      <span class="block-tag">${portfolio.tag}</span>
      <span class="block-name">${portfolio.name}<span class="block-name-en">${portfolio.nameEn}</span></span>
      <p class="block-blurb">${portfolio.blurb}</p>
      <span class="btn-text">${portfolio.cta} →</span>
    </a>
    ${seriesHtml}
  `;
}

function renderPillars() {
  $('[data-pillars-eyebrow]').textContent = site.pillars.eyebrow;
  $('[data-pillars-title]').textContent = site.pillars.title;
  $('[data-pillars-list]').innerHTML = site.pillars.items
    .map(
      (item) => `
      <li class="pillar">
        <h3>${item.name}</h3>
        <p>${item.detail}</p>
      </li>
    `,
    )
    .join('');
}

function renderContact() {
  $('[data-contact-eyebrow]').textContent = site.contact.eyebrow;
  $('[data-contact-title]').textContent = site.contact.title;
  $('[data-contact-body]').textContent = site.contact.body;
  $('[data-contact-actions]').innerHTML = `
    <a class="contact-email" href="${site.contact.emailHref}">${site.contact.email}</a>
    <ul class="socials">
      ${site.contact.socials
        .map((s) => `<li><a href="${s.href}" rel="noopener noreferrer">${s.label}</a></li>`)
        .join('')}
    </ul>
  `;
}

function renderFooter() {
  $('[data-footer-note]').textContent = site.footer.note;
  $('[data-footer-year]').textContent = `© ${new Date().getFullYear()}`;
  document.title = site.title;
  const meta = document.querySelector('meta[name="description"]');
  if (meta) meta.setAttribute('content', site.description);
}

function bindHeader() {
  const header = $('[data-header]');
  const toggle = $('[data-nav-toggle]');
  const mobileNav = $('[data-mobile-nav]');

  const onScroll = () => {
    header.classList.toggle('is-scrolled', window.scrollY > 24);
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  toggle?.addEventListener('click', () => {
    const open = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!open));
    mobileNav.hidden = open;
  });

  mobileNav?.addEventListener('click', (e) => {
    if (e.target.matches('a')) {
      toggle.setAttribute('aria-expanded', 'false');
      mobileNav.hidden = true;
    }
  });
}

function bindScrollReveal() {
  const sections = $$('.section');
  if (!('IntersectionObserver' in window)) {
    sections.forEach((s) => s.classList.add('is-inview'));
    return;
  }

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-inview');
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.18, rootMargin: '0px 0px -8% 0px' },
  );

  sections.forEach((s) => io.observe(s));
}

function bindDeviceParallax() {
  const device = $('.hero-device');
  if (!device || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return;
  }

  let ticking = false;
  window.addEventListener(
    'scroll',
    () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = Math.min(window.scrollY, 600);
        device.style.transform = `translateY(calc(-46% + ${y * 0.08}px))`;
        ticking = false;
      });
    },
    { passive: true },
  );
}

renderBrand();
renderNav();
renderHero();
renderAbout();
renderWorks();
renderPillars();
renderContact();
renderFooter();
bindHeader();
bindScrollReveal();
bindDeviceParallax();
