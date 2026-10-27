/* ============================================================
   Ivan Cruz — портфолио
   Анимации сайта на anime.js (v4, локальная сборка).
   Сцена: прелоадер-пластинка → шапка → hero → счётчики → док,
   дальше — появление групп по скроллу.
   Прогрессивное улучшение: без anime.js или при
   prefers-reduced-motion весь контент просто виден.
   ============================================================ */

(() => {
  'use strict';

  const anime = window.anime;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!anime || typeof anime.animate !== 'function' || reduced) {
    const stale = document.getElementById('preloader');
    if (stale) stale.remove();
    document.body.classList.remove('preloading');
    return;
  }

  const { animate, createTimeline, stagger } = anime;

  /* ---------- Скрытие до анимации (только при работающем anime) ---------- */
  const hide = (el) => {
    el.style.opacity = '0';
  };

  /* После анимации возвращаем элементам CSS-состояние (нужны ховер-эффекты) */
  const reveal = (els) => {
    els.forEach((el) => {
      el.style.opacity = '';
      el.style.transform = '';
    });
  };

  /* ---------- Вступительная сцена ---------- */
  const startIntro = () => {
    const heroEls = [
      '.hero__greeting',
      '.hero__name',
      '.hero__role',
      '.hero__desc',
      '.hero__actions',
      '.hero__stats',
    ]
      .map((sel) => document.querySelector(sel))
      .filter(Boolean);

    heroEls.forEach(hide);

    const intro = createTimeline({
      defaults: { ease: 'out(2)', duration: 900 },
    });

    intro.add('.site-header__inner', {
      translateY: [-16, 0],
      opacity: [0, 1],
      duration: 750,
    });

    heroEls.forEach((el, i) => {
      intro.add(
        el,
        {
          translateY: [i === 1 ? 26 : 18, 0],
          opacity: [0, 1],
        },
        160 + i * 120
      );
    });

    /* Счётчики статистики */
    const counters = Array.from(document.querySelectorAll('.stat__num'));
    counters.forEach((el, i) => {
      const text = el.textContent.trim();
      const match = text.match(/^([\d\s.,]+)(.*)$/);
      if (!match) return;
      const target = parseFloat(match[1].replace(/\s/g, '').replace(',', '.'));
      if (Number.isNaN(target)) return;
      const suffix = match[2] || '';
      const proxy = { v: 0 };
      setTimeout(() => {
        animate(proxy, {
          v: target,
          duration: 1500,
          ease: 'out(2)',
          onUpdate: () => {
            el.textContent = Math.round(proxy.v) + suffix;
          },
        });
      }, 900 + i * 120);
    });

    /* Каскад дока */
    const dockItems = document.querySelectorAll('.dock-item');
    if (dockItems.length) {
      dockItems.forEach(hide);
      animate(dockItems, {
        scale: [0.4, 1],
        opacity: [0, 1],
        delay: stagger(70, { start: 1000 }),
        duration: 650,
        ease: 'out(3)',
        onComplete: () => reveal(dockItems),
      });
    }
  };

  /* ---------- Прелоадер-пластинка ---------- */
  const preloader = document.getElementById('preloader');
  const startedAt = performance.now();
  const MIN_SHOW = 900; /* минимальное время показа пластинки */

  if (!preloader) {
    document.body.classList.remove('preloading');
    startIntro();
  } else {
    const disc = preloader.querySelector('.preloader__disc');
    const wait = Math.max(0, MIN_SHOW - (performance.now() - startedAt)) + 400;
    setTimeout(() => {
      document.body.classList.remove('preloading');
      if (disc) {
        animate(disc, {
          scale: [1, 1.7],
          rotate: { from: 0, to: 200 },
          duration: 800,
          ease: 'in(2)',
        });
      }
      animate(preloader, {
        opacity: [1, 0],
        duration: 800,
        ease: 'in(2)',
        onComplete: () => {
          preloader.remove();
          startIntro();
        },
      });
    }, wait);
  }

  /* ---------- Появление по скроллу (группы со stagger) ---------- */
  const groups = [
    { selector: '.stack-chips', children: '.stack-chips li', gap: 55 },
    { selector: '.projects-grid', children: '.project-card', gap: 110 },
    { selector: '.timeline', children: '.timeline__item', gap: 150 },
    {
      selector: '.contact__inner',
      children: '.contact__copy, .kc-glass, .kc-flip',
      gap: 170,
    },
  ];

  const observeGroup = (group) => {
    const parent = document.querySelector(group.selector);
    if (!parent) return;
    const children = Array.from(parent.querySelectorAll(group.children));
    if (!children.length) return;

    if (!('IntersectionObserver' in window)) return; // останутся видимыми

    children.forEach(hide);
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          observer.unobserve(entry.target);
          animate(children, {
            translateY: [28, 0],
            opacity: [0, 1],
            delay: stagger(group.gap),
            duration: 1100,
            ease: 'out(2)',
            onComplete: () => reveal(children),
          });
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );
    observer.observe(parent);
  };

  groups.forEach(observeGroup);
})();
