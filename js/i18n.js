/* ============================================================
   Ivan Cruz — портфолио
   RU/EN переключатель (js/i18n.js).
   Русский текст живёт в HTML; английский — в словаре ниже.
   Переключение сохраняется в localStorage('kc-lang') и
   рассылает событие 'kc-lang' (его слушает модалка проектов).
   ============================================================ */

(() => {
  'use strict';

  /* EN-версии содержимого модалки проектов (ключ = data-project) */
  const MODAL_EN = {
    m8: {
      title: 'M8 — Chess Learning',
      desc: 'An interactive chess-learning app in a Duolingo style. Lessons form a chain: solve puzzles to unlock new topics and earn XP, with progress visible on the lesson map with a weekly streak. Inside — a custom chess engine (negamax with alpha-beta pruning in a Web Worker) with 8 difficulty levels, play against the AI or on one device, an AI coach with hints and game analysis, daily missions, an Elo rating and a weekly league. Ships as a web PWA, a Windows desktop app and a mobile app, with offline support.',
      features: [
        '30+ themed puzzles: mate in 1–2, forks, pins, deflections, endgames',
        '13 lessons with rising difficulty',
        'Custom chess engine: negamax with alpha-beta pruning in a Web Worker, 8 difficulty levels',
        'AI coach (LLM): hints and post-game analysis',
        'XP, levels, streaks and achievements',
        'Two sign-in modes: offline accounts (PBKDF2) or Supabase with e-mail confirmation',
        'RU/EN localisation, dark theme, keyboard navigation, offline PWA mode',
        '46 tests; AI-layer coverage threshold — 85%',
      ],
    },
    aq: {
      title: 'Action & Quality',
      desc: 'An app against procrastination, for discipline. Each day starts with a ritual: a morning mood check-in with a living cloud → quote of the day → habits → focus session. Habits follow a weekly schedule with reminders, plans split into day, week and month with subtasks, and statistics collect charts, an activity heatmap and a mood diary. XP, levels with titles, streaks with a multiplier and achievements keep you going, and an arcade of 4 mini-games offers a break between tasks. Works offline as a PWA, syncs with Supabase, ships for Android, Windows and iOS.',
      features: [
        'The living cloud changes shape and colour with your mood (5 states)',
        'Habits with weekly schedules, reminders and animated checkboxes',
        'Plans (day/week/month) with subtasks and .ics calendar import',
        'An arcade of 4 mini-games: mood catcher, breathing practice, author quiz, habit pairs',
        'Statistics: line charts, a 15-week activity heatmap, a mood diary',
        'XP, levels with titles, streaks with a ×1.5 multiplier, 8 achievements',
        'Offline mode with a write queue and Supabase sync',
        'Builds: Android APK, Windows installer (Tauri), iOS, single-file offline version',
      ],
    },
    matiland: {
      title: 'Matiland',
      desc: 'A maths trainer where kids learn by playing. A journey across a land of 12 topic islands from the grades 1–4 curriculum — from counting to 20 up to money, clocks, shapes and word problems — with adaptive difficulty. Rounds run in four modes: Classic, Timed, Survival and Perfect, plus a daily challenge with a chest and a 5-stage Olympiad. Correct answers earn coins and mastery stars, chests, a lucky wheel and a hero room to furnish: 5 characters, constructor pets, 45+ items. Parents get a PIN-protected zone: a daily play limit, accuracy stats and weak topics. No sign-up, works offline as a PWA.',
      features: [
        '12 curriculum topics for grades 1–4 with adaptive difficulty: from counting to 20 — up to money, clocks, shapes and word problems',
        '4 round modes: Classic, Timed, Survival and Perfect — plus a daily challenge with a chest for 6+ correct answers',
        'Mini-games: Catch the Answers, Pairs, 3×3 maths lotto, a 5-stage Olympiad and a Duel on one device',
        'Reward economy: coins per answer, gems, chests, a lucky wheel, quests and a 30-level season pass',
        'Your hero and room: 5 characters in 8 colours, constructor pets, 45+ items and 16 achievements',
        'Parent zone behind a PIN: daily play limit, accuracy stats and weak topics, multiple kids on one device',
        'PWA: data stays in the browser, offline mode, dark theme, sounds and install support',
      ],
    },
    crm: {
      title: 'Potok CRM',
      desc: 'A full-stack CRM MVP for small companies (2–20 people): deals under control — from a kanban board to automations and reports. Deals move across the kanban with drag-and-drop, undo and keyboard shortcuts, the funnel and KPIs show conversion rates and deltas, and a leaderboard ranks the best managers. The client profile keeps a timeline and warns about duplicates, trigger-based automations send e-mail and Telegram steps with delays and quiet hours. Access is role-based: checks in route handlers plus Row Level Security in Postgres, reports export to Excel and PDF. Built on free-tier services.',
      features: [
        'Deal kanban: drag-and-drop with keyboard shortcuts, undo (5 seconds), optimistic updates',
        'Analytics: funnel with conversion rates, KPIs with deltas, manager leaderboard',
        'Clients: sortable table, profile with a timeline, duplicate warnings',
        'Automations: 3 trigger types, e-mail/Telegram/task steps with delays and quiet hours (22:00–09:00)',
        'RBAC: role checks in route handlers + Row Level Security policies in Postgres',
        'Excel and PDF report export',
      ],
    },
    school: {
      title: 'Tochka Rosta',
      desc: 'A website for an online exam-prep school: a landing page with study directions, a course and pricing catalogue, a blog and a demo student dashboard. Trial-lesson requests pass server-side validation and are spam-protected: a honeypot and a limit of 5 requests per 10 minutes per IP. SEO is configured in code: sitemap.xml, robots.txt and security headers.',
      features: [
        'Landing page, course catalogue, pricing and blog',
        'Demo student dashboard',
        'Trial-lesson request form: server-side validation, honeypot, 5 requests per 10 minutes per IP',
        'SEO: sitemap.xml, robots.txt and security headers configured in code',
      ],
    },
    a11ylens: {
      title: 'A11yLens',
      desc: 'One-minute website accessibility (WCAG 2.2) and cybersecurity audit. A11yLens opens the page in a real browser (Playwright), runs 60+ axe-core rules, audits security headers, cookies and mixed content — and packs everything into one visual report with scores, violation screenshots and fix recipes.',
      features: [
        'Real-browser scanning: Playwright + axe-core, 60+ rules for WCAG AA/AAA and Section 508, desktop and mobile viewports',
        '0–100 score weighted by severity, plus a bento report board with draggable widgets',
        'A screenshot of every violation with a full-screen lightbox',
        'Scan comparison (diff): what got fixed and what appeared, with an animated score delta',
        'Website monitoring: a watchlist with scores and an up/down indicator on rescan',
        '19 passive security checks: CSP, HSTS, clickjacking, cookie flags, mixed content, SRI, .git/.env probes',
        'Exports: a client-ready PDF report plus machine-readable JSON and CSV',
        'AI tips and an in-chat AI assistant: report breakdowns with recipes and WCAG criteria links',
        'Free/Pro/Business plans, ⌘K command palette, history with sparklines, an interactive WCAG 2.2 guide, a README SVG badge, RU/EN',
      ],
    },
  };

  /* EN-тексты статичной страницы: [селектор, текст, режим?] */
  const EN = [
    ['.skip-link', 'Skip to projects'],
    ['.site-header__nav a:nth-child(1)', 'Stack'],
    ['.site-header__nav a:nth-child(2)', 'Projects'],
    ['.site-header__nav a:nth-child(3)', 'Contacts'],
    ['.hero__greeting', "Hi, I'm"],
    ['.hero__role', 'Frontend / Multimedia Developer'],
    ['.hero__desc', 'I build apps for web, desktop and mobile: TypeScript, React, Three.js. I love WebGL, shaders and crisp animations.'],
    ['.hero__actions .flow-btn .flow-btn__label', 'Message me on Telegram'],
    ['.stat:nth-child(1) .stat__label', 'completed projects'],
    ['.stat:nth-child(3) .stat__label', 'platforms: web, desktop, mobile'],
    ['#stack .section__head h2', 'Stack'],
    ['#stack .section__sub', 'Tools I work with.'],
    ['#projects .section__head h2', 'Projects'],
    ['#projects .section__sub', 'Click a project to see screenshots and the deck.'],
    ['#tab-projects', 'Projects'],
    ['#tab-landings', 'Landings'],
    ['#path .section__head h2', 'Journey'],
    ['#path .section__sub', 'A short story of how I got here.'],
    ['.timeline__item:nth-child(1) .timeline__card h3', 'First line of code'],
    ['.timeline__item:nth-child(1) .timeline__card p', 'Started with Python and quickly realised the web and interfaces were my thing.'],
    ['.timeline__item:nth-child(2) .timeline__card h3', 'Frontend'],
    ['.timeline__item:nth-child(2) .timeline__card p', 'TypeScript, React, first pet projects and full-stack experiments.'],
    ['.timeline__item:nth-child(3) .timeline__card h3', 'Multimedia & 3D'],
    ['.timeline__item:nth-child(3) .timeline__card p', 'Three.js, WebGL, shaders — fell in love with animation and living interfaces.'],
    ['.timeline__item:nth-child(4) .timeline__card h3', 'Product projects'],
    ['.timeline__item:nth-child(4) .timeline__card p', 'M8, Action & Quality, Potok CRM — from idea to release on every platform.'],
    ['.contact__title', 'Contacts'],
    ['.contact__sub', 'Message me on Telegram or check out the code on GitHub.'],
    ['.contact__actions .flow-btn .flow-btn__label', 'Telegram: @CruzITdevv'],
    ['[data-i18n="resume-btn"]', 'Resume (PDF)'],
    ['[data-i18n="copy-hint"]', 'or copy:'],
    ['.kc-np__eyebrow', 'Now playing'],
    ['.kc-switch__labels span:nth-child(1)', 'Light'],
    ['.kc-switch__labels span:nth-child(2)', 'Dark'],
    ['.dock-item[data-target="top"] .dock-item__tooltip', 'Top'],
    ['.dock-item[data-target="stack"] .dock-item__tooltip', 'Stack'],
    ['.dock-item[data-target="projects"] .dock-item__tooltip', 'Projects'],
    ['.dock-item[data-target="contact"] .dock-item__tooltip', 'Contacts'],
    ['.dock-item[href*="github"] .dock-item__tooltip', 'GitHub'],
    ['.dock-item[href*="t.me"] .dock-item__tooltip', 'Telegram'],
    ['#kc-flip-hint', 'Flip card: press Enter, Space or drag to turn it over.'],
    ['#project-modal-pin', 'Main project'],
  ];

  /* EN-тексты карточек проектов и мелких меток */
  const EN_CARDS = [
    ['.projects-grid li:nth-child(1) h3', 'M8 — Chess Learning'],
    ['.projects-grid li:nth-child(1) p', 'An interactive chess-learning app in a Duolingo style: themed puzzles, XP and levels, a custom chess engine and an AI coach.'],
    ['.projects-grid li:nth-child(2) h3', 'Action & Quality'],
    ['.projects-grid li:nth-child(2) p', 'An app against procrastination, for discipline: a mood cloud, habits, focus sessions and an arcade of mini-games. Works offline as a PWA.'],
    ['.projects-grid li:nth-child(3) h3', 'A11yLens'],
    ['.projects-grid li:nth-child(3) p', 'One-minute WCAG 2.2 and security audit: a real browser, 60+ axe-core rules, security-header checks and one visual report with scores and fix recipes.'],
    ['.projects-grid li:nth-child(4) h3', 'Matiland'],
    ['.projects-grid li:nth-child(4) p', 'A game-based maths trainer for grades 1–4: 12 topic islands, 4 round modes, mini-games and hero rewards. No sign-up, works offline as a PWA.'],
    ['.projects-grid li:nth-child(5) h3', 'Potok CRM'],
    ['.projects-grid li:nth-child(5) p', 'A full-stack CRM MVP for small teams: deal kanban, funnel analytics, e-mail/Telegram automations and access roles.'],
    ['.projects-grid li:nth-child(6) h3', 'Tochka Rosta'],
    ['.projects-grid li:nth-child(6) p', 'A website for an online exam-prep school: landing page, course catalogue, pricing, blog and a demo student dashboard.'],
  ];

  const ruCache = new Map();
  let lang = 'ru';

  try {
    lang = localStorage.getItem('kc-lang') === 'en' ? 'en' : 'ru';
  } catch (e) { /* no storage */ }

  const remember = (el, text, mode) => {
    if (!ruCache.has(el)) ruCache.set(el, { ru: text, mode });
  };

  /* Заменяет только текстовый узел среди детей (для кнопок с иконками) */
  const textNodeOf = (el) =>
    Array.from(el.childNodes).find((n) => n.nodeType === 3 && n.textContent.trim());

  const apply = (next) => {
    lang = next;
    document.documentElement.setAttribute('data-lang', lang);
    document.documentElement.lang = lang === 'en' ? 'en' : 'ru';
    try {
      localStorage.setItem('kc-lang', lang);
    } catch (e) { /* no storage */ }

    EN.forEach(([sel, en]) => {
      document.querySelectorAll(sel).forEach((el) => {
        if (el.classList.contains('kc-morph__textarea')) {
          remember(el, el.placeholder, 'placeholder');
          el.placeholder = lang === 'en' ? en : ruCache.get(el).ru;
          return;
        }
        if (el.children.length > 0 && el.querySelector('svg, span')) {
          const node = textNodeOf(el);
          if (!node) return;
          remember(el, node.textContent, 'node');
          node.textContent = lang === 'en' ? en : ruCache.get(el).ru;
          return;
        }
        remember(el, el.textContent, 'text');
        el.textContent = lang === 'en' ? en : ruCache.get(el).ru;
      });
    });

    /* Кнопки «Код» и «Подробнее» + закреп «Основной проект» на карточках */
    document.querySelectorAll('.card-link:not(.card-link--btn)').forEach((el) => {
      remember(el, el.textContent, 'text');
      el.textContent = lang === 'en' ? 'Code' : ruCache.get(el).ru;
    });
    document.querySelectorAll('.project-card__open').forEach((el) => {
      const node = textNodeOf(el);
      if (!node) return;
      remember(el, node.textContent, 'node');
      node.textContent = lang === 'en' ? 'Details' : ruCache.get(el).ru;
    });
    document.querySelectorAll('.project-card--main .project-card__pin').forEach((el) => {
      const node = textNodeOf(el);
      if (!node) return;
      remember(el, node.textContent, 'node');
      node.textContent = lang === 'en' ? 'Main project' : ruCache.get(el).ru;
    });

    EN_CARDS.forEach(([sel, en]) => {
      document.querySelectorAll(sel).forEach((el) => {
        remember(el, el.textContent, 'text');
        el.textContent = lang === 'en' ? en : ruCache.get(el).ru;
      });
    });

    /* Морф-поповер: метки с иконками, плейсхолдер, «Отправить», «Спасибо» */
    document.querySelectorAll('.kc-morph__idle, .kc-morph__head').forEach((el) => {
      const node = textNodeOf(el);
      if (!node) return;
      remember(el, node.textContent, 'node');
      node.textContent = lang === 'en' ? 'Feedback' : ruCache.get(el).ru;
    });
    const send = document.querySelector('.kc-morph__send');
    if (send) {
      const node = textNodeOf(send);
      if (node) {
        remember(send, node.textContent, 'node');
        node.textContent = lang === 'en' ? 'Send' : ruCache.get(send).ru;
      }
    }
    const sent = document.querySelector('.kc-morph__sent');
    if (sent) {
      const node = textNodeOf(sent);
      if (node) {
        remember(sent, node.textContent, 'node');
        node.textContent = lang === 'en' ? 'Thanks!' : ruCache.get(sent).ru;
      }
    }
    const kbdHint = document.querySelector('.kc-morph__kbd span');
    if (kbdHint) {
      remember(kbdHint, kbdHint.textContent, 'text');
      kbdHint.textContent = lang === 'en' ? 'to send' : ruCache.get(kbdHint).ru;
    }

    document.querySelectorAll('.lang-toggle__opt').forEach((btn) => {
      const active = btn.dataset.lang === lang;
      btn.classList.toggle('is-active', active);
      btn.setAttribute('aria-pressed', String(active));
    });

    window.kcLang = lang;
    document.dispatchEvent(new CustomEvent('kc-lang', { detail: { lang } }));
  };

  const init = () => {
    document.querySelectorAll('.lang-toggle__opt').forEach((btn) => {
      btn.addEventListener('click', () => {
        if (btn.dataset.lang !== lang) apply(btn.dataset.lang);
      });
    });
    apply(lang);

    /* Словарь модалки для main.js */
    window.I18N = {
      get lang() {
        return lang;
      },
      modal(key) {
        return lang === 'en' ? MODAL_EN[key] || null : null;
      },
    };
    window.kcLang = lang;
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
