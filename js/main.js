/* Ivan Cruz — портфолио
   Поведение: появление секций при скролле, подсветка активного
   раздела в доке (scrollspy), каскадный масштаб иконок дока,
   модалка с характеристиками проектов.
   Все эффекты отключаются при prefers-reduced-motion. */

/* Характеристики проектов — из README репозиториев.
   Скриншоты и презентации лежат локально в assets/ и не зависят от GitHub. */
const PROJECTS = {
  m8: {
    title: 'M8 — обучение шахматам',
    main: true,
    tags: ['React 19', 'TypeScript', 'Tauri', 'Capacitor', 'Supabase'],
    desc: 'Интерактивное приложение для обучения шахматам в стиле Duolingo. Уроки выстроены в цепочку: решаешь задачи — открываешь новые темы и зарабатываешь XP, а прогресс виден на карте уроков с еженедельной серией. Внутри собственный шахматный движок (negamax с альфа-бета отсечением в Web Worker) с 8 уровнями сложности, режимы игры против AI и на одном устройстве, AI-тренер с подсказками и разбором партий, ежедневные миссии, рейтинг Elo и недельная лига. Работает как веб-PWA, десктоп-приложение (Windows) и мобильное приложение, поддерживает офлайн-режим.',
    features: [
      '30+ задач по темам: мат в 1–2 хода, вилки, связки, отвлечения, эндшпили',
      '13 уроков с возрастающей сложностью',
      'Собственный шахматный движок: negamax с альфа-бета отсечением в Web Worker, 8 уровней сложности',
      'AI-тренер (LLM): подсказки и разбор партий после игры',
      'XP, уровни, серии и достижения',
      'Два режима входа: офлайн-аккаунты (PBKDF2) или Supabase с подтверждением e-mail',
      'RU/EN локализация, тёмная тема, клавиатурная навигация, офлайн-режим PWA',
      '46 тестов; порог покрытия AI-слоя — 85%',
    ],
    images: [
      { src: 'assets/img/m8-lessons.png', alt: 'M8 — карта уроков с еженедельной серией' },
      { src: 'assets/img/m8-puzzle.png', alt: 'M8 — задача с доской, подсказками и ИИ-тренером' },
      { src: 'assets/img/m8-play.png', alt: 'M8 — партия против движка' },
      { src: 'assets/img/m8-profile.png', alt: 'M8 — профиль с рейтингом и недельной лигой' },
    ],
    pdf: { src: 'assets/pdf/m8-presentation.pdf', label: 'Презентация проекта (PDF)' },
    github: 'https://github.com/ivan-cruzzz/m8-chess',
  },
  aq: {
    title: 'Action & Quality',
    main: true,
    tags: ['React 18', 'TypeScript', 'Supabase', 'Capacitor', 'Tauri', 'PWA'],
    desc: 'Приложение против лени и за дисциплину. Каждый день начинается с ритуала: утренний чек-ин настроения с живым облачком → цитата дня → привычки → фокус-сессия. Привычки живут по недельному расписанию с напоминаниями, планы делятся на день, неделю и месяц с подзадачами, а статистика собирает графики, тепловую карту активности и дневник настроения. Прогресс подстёгивают XP, уровни с титулами, серии с множителем и достижения, а аркада из 4 мини-игр даёт передохнуть между делами. Работает офлайн как PWA, данные синхронизируются с Supabase, есть сборки под Android, Windows и iOS.',
    features: [
      'Живое облачко меняет форму и цвет в зависимости от настроения (5 состояний)',
      'Привычки с недельным расписанием, напоминаниями и анимированными чекбоксами',
      'Планы (день/неделя/месяц) с подзадачами и импортом .ics в календарь',
      'Аркада из 4 мини-игр: ловец настроения, дыхательная практика, угадай автора, пары привычек',
      'Статистика: линейные графики, тепловая карта активности за 15 недель, дневник настроения',
      'XP, уровни с титулами, серии с множителем ×1.5, 8 достижений',
      'Офлайн-режим с очередью записи и синхронизацией через Supabase',
      'Сборки: Android APK, Windows-установщик (Tauri), iOS, однофайловая офлайн-версия',
    ],
    images: [
      { src: 'assets/img/aq-home.png', alt: 'Action & Quality — главный экран' },
      { src: 'assets/img/aq-mood.png', alt: 'Action & Quality — чек-ин настроения с облачком' },
      { src: 'assets/img/aq-games.png', alt: 'Action & Quality — аркада мини-игр' },
      { src: 'assets/img/aq-stats.png', alt: 'Action & Quality — экран статистики' },
    ],
    pdf: null,
    github: 'https://github.com/ivan-cruzzz/Action-y-Quality',
  },
  matiland: {
    title: 'Матилэнд',
    main: false,
    tags: ['React 18', 'TypeScript', 'Vite', 'Tailwind CSS', 'framer-motion', 'PWA'],
    desc: 'Тренажёр математики, в котором ребёнок учится, играя. Путешествие по стране из 12 островов-тем по программе 1–4 класса — от счёта до 20 до денег, часов, фигур и текстовых задач, с адаптивной сложностью. Раунды идут в четырёх режимах: Классика, На время, Выживание и Без ошибок, плюс ежедневный вызов с сундуком и Олимпиада из 5 этапов. За верные ответы ребёнок получает монеты и звёзды мастерства, открывает сундуки, крутит колесо удачи и обустраивает комнату героя: 5 персонажей, питомцы из конструктора, 45+ вещей. Для родителей — зона по PIN-коду: лимит игры в день, статистика точности и слабых тем. Без регистрации, работает офлайн как PWA.',
    features: [
      '12 тем программы 1–4 класса с адаптивной сложностью: от счёта до 20 — до денег, часов, фигур и текстовых задач',
      '4 режима раундов: Классика, На время, Выживание, Без ошибок — плюс ежедневный вызов с сундуком за 6+ верных',
      'Мини-игры: «Ловим ответы», «Парочки», математическое лото 3×3, Олимпиада из 5 этапов и Дуэль на одном устройстве',
      'Экономика наград: монеты за ответы, самоцветы, сундуки, колесо удачи, квесты и сезонный пропуск на 30 уровней',
      'Свой герой и комната: 5 персонажей и 8 цветов, питомцы из конструктора, 45+ вещей и 16 достижений',
      'Родительская зона по PIN-коду: лимит игры в день, статистика точности и слабых тем, несколько детей на одном устройстве',
      'PWA: данные в браузере, офлайн-режим, тёмная тема, звуки и установка на устройство',
    ],
    images: [
      { src: 'assets/img/matiland-5.jpg', alt: 'Матилэнд — главный экран с картой мира' },
      { src: 'assets/img/matiland-12.jpg', alt: 'Матилэнд — ежедневный вызов, колесо удачи и сезонный пропуск' },
      { src: 'assets/img/matiland-20.jpg', alt: 'Матилэнд — острова-темы на карте' },
      { src: 'assets/img/matiland-30.jpg', alt: 'Матилэнд — игровой раунд' },
      { src: 'assets/img/matiland-35.jpg', alt: 'Матилэнд — итоги раунда' },
    ],
    pdf: { src: 'assets/pdf/matiland-presentation.pdf', label: 'Презентация проекта (PDF, 10 слайдов)' },
    github: 'https://github.com/ivan-cruzzz/matiland',
    demo: 'https://ivan-cruzzz.github.io/matiland',
  },
  crm: {
    title: 'Поток CRM',
    main: false,
    tags: ['Next.js 15', 'Supabase', 'Prisma', 'Recharts', 'dnd-kit'],
    desc: 'Фулстек-MVP CRM для малых компаний (2–20 человек): продажи под контролем — от канбана сделок до автоматизаций и отчётов. Сделки двигаются по канбану drag-and-drop с undo и клавиатурными шорткатами, воронка и KPI показывают конверсии и дельты, рейтинг собирает лучших менеджеров. Карточка клиента хранит таймлайн и предупреждает о дублях, автоматизации по триггерам отправляют email и Telegram-шаги с задержками и тихими часами. Доступ разграничен ролями: проверки в обработчиках маршрутов плюс Row Level Security в Postgres, отчёты выгружаются в Excel и PDF. Построена на бесплатных тарифах сервисов.',
    features: [
      'Канбан сделок: drag-and-drop с клавиатурными шорткатами, undo (5 секунд), оптимистичные обновления',
      'Аналитика: воронка с конверсиями, KPI с дельтами, рейтинг менеджеров',
      'Клиенты: сортируемая таблица, карточка с таймлайном, предупреждения о дублях',
      'Автоматизации: 3 типа триггеров, шаги email/Telegram/задачи с задержками и тихими часами (22:00–09:00)',
      'RBAC: проверки ролей в обработчиках маршрутов + политики Row Level Security в Postgres',
      'Экспорт отчётов в Excel и PDF',
    ],
    images: [
      { src: 'assets/img/crm-kanban.png', alt: 'Поток CRM — канбан сделок' },
      { src: 'assets/img/crm-analytics.png', alt: 'Поток CRM — аналитика воронки' },
      { src: 'assets/img/crm-clients.png', alt: 'Поток CRM — список клиентов' },
      { src: 'assets/img/crm-automations.png', alt: 'Поток CRM — автоматизации' },
    ],
    pdf: { src: 'assets/pdf/crm-presentation.pdf', label: 'Презентация проекта (PDF, 16 слайдов)' },
    github: null,
  },
  school: {
    title: 'Точка Роста',
    main: false,
    tags: ['Next.js 14', 'TypeScript', 'Tailwind CSS'],
    desc: 'Сайт онлайн-школы подготовки к ОГЭ и ЕГЭ: лендинг с направлениями подготовки, каталог курсов и тарифов, блог и демо-личный кабинет ученика. Заявка на пробный урок проходит серверную валидацию и защищена от спама: honeypot и лимит 5 заявок за 10 минут с одного IP. SEO настроено в коде: sitemap.xml, robots.txt и security-заголовки.',
    features: [
      'Лендинг, каталог курсов, тарифы и блог',
      'Демо-личный кабинет ученика',
      'Форма заявки на пробный урок: серверная валидация, honeypot, лимит 5 заявок за 10 минут с одного IP',
      'SEO: sitemap.xml, robots.txt и security-заголовки настроены в коде',
    ],
    images: [
      { src: 'assets/img/school-hero.png', alt: 'Точка Роста — главная страница сайта' },
    ],
    pdf: { src: 'assets/pdf/school-presentation.pdf', label: 'Презентация проекта (PDF, 11 слайдов)' },
    github: null,
  },
  a11ylens: {
    title: 'A11yLens',
    main: true,
    tags: ['TypeScript', 'Playwright', 'axe-core', 'Node.js'],
    desc: 'Проверка доступности (WCAG 2.2) и кибербезопасности сайта за одну минуту. A11yLens открывает страницу в настоящем браузере (Playwright), прогоняет 60+ правил axe-core, аудирует заголовки безопасности, куки и mixed content — и собирает всё в один наглядный отчёт с оценками, скриншотами нарушений и рецептами исправления.',
    features: [
      'Сканирование реальным браузером: Playwright + axe-core, 60+ правил WCAG AA/AAA и Section 508, десктоп и мобильные вьюпорты',
      'Оценка 0–100 с весами по критичности и bento-панель отчёта с перетаскиваемыми виджетами',
      'Скриншоты каждого нарушения с полноэкранным лайтбоксом',
      'Сравнение сканов (diff): что исправилось и что появилось, дельта оценки с анимацией',
      'Мониторинг сайтов: watchlist с баллами и индикатором динамики при рескане',
      '19 пассивных проверок безопасности: CSP, HSTS, clickjacking, флаги кук, mixed content, SRI, пробы .git/.env',
      'Экспорт: PDF-отчёт для клиента, машинночитаемые JSON и CSV',
      'ИИ-советы и ИИ-помощник в чате: разбор отчёта с рецептами и ссылками на критерии WCAG',
      'Подписки Free/Pro/Business, command palette ⌘K, история со спарклайнами, гайд по WCAG 2.2, SVG-бейдж для README, RU/EN',
    ],
    images: [
      { src: 'assets/img/a11ylens/landing.png', alt: 'A11yLens — лендинг' },
      { src: 'assets/img/a11ylens/scanner-start.png', alt: 'A11yLens — панель запуска сканирования' },
      { src: 'assets/img/a11ylens/report-overview.png', alt: 'A11yLens — отчёт: счётчик доступности и категории нарушений' },
      { src: 'assets/img/a11ylens/report-security.png', alt: 'A11yLens — находки безопасности с критичностью' },
      { src: 'assets/img/a11ylens/pricing.png', alt: 'A11yLens — тарифы' },
      { src: 'assets/img/a11ylens/guide.png', alt: 'A11yLens — интерактивный гайд по WCAG 2.2' },
    ],
    pdf: null,
    github: 'https://github.com/ivan-cruzzz/A11yLens',
  },
};

(() => {
  'use strict';

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Появление секций при попадании в viewport */
  const revealEls = document.querySelectorAll('.reveal');
  if (prefersReduced || !('IntersectionObserver' in window)) {
    revealEls.forEach((el) => el.classList.add('is-visible'));
  } else {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    );
    revealEls.forEach((el) => revealObserver.observe(el));
  }

  /* Scrollspy: активный пункт дока по текущей секции */
  const sectionIds = ['top', 'stack', 'projects', 'contact'];
  const sections = sectionIds
    .map((id) => document.getElementById(id))
    .filter(Boolean);
  const dockLinks = document.querySelectorAll('.dock-item[data-target]');

  const setActive = (id) => {
    dockLinks.forEach((link) => {
      const isActive = link.dataset.target === id;
      link.classList.toggle('is-active', isActive);
      if (isActive) {
        link.setAttribute('aria-current', 'true');
      } else {
        link.removeAttribute('aria-current');
      }
    });
  };

  if ('IntersectionObserver' in window && sections.length) {
    const spy = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActive(entry.target.id);
          }
        });
      },
      { rootMargin: '-45% 0px -50% 0px' }
    );
    sections.forEach((section) => spy.observe(section));
  }

  /* Каскадный масштаб иконок дока по расстоянию от курсора:
     сам элемент 1.4, соседи 1.2, через один 1.1 */
  const dock = document.querySelector('.dock');
  const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (dock && canHover && !prefersReduced) {
    const items = Array.from(dock.querySelectorAll('.dock-item'));
    dock.addEventListener('mousemove', (event) => {
      const mouseX = event.clientX;
      items.forEach((item) => {
        const rect = item.getBoundingClientRect();
        const distance = Math.abs(mouseX - (rect.left + rect.width / 2));
        let scale = 1;
        if (distance < 60) scale = 1.4;
        else if (distance < 110) scale = 1.2;
        else if (distance < 160) scale = 1.1;
        item.style.setProperty('--dock-scale', scale);
      });
    });
    dock.addEventListener('mouseleave', () => {
      items.forEach((item) => item.style.setProperty('--dock-scale', 1));
    });
  }

  /* ---------- Модалка проекта ---------- */
  const modal = document.getElementById('project-modal');
  if (!modal) return;

  const els = {
    pin: document.getElementById('project-modal-pin'),
    title: document.getElementById('project-modal-title'),
    tags: document.getElementById('project-modal-tags'),
    desc: document.getElementById('project-modal-desc'),
    features: document.getElementById('project-modal-features'),
    shots: document.getElementById('project-modal-shots'),
    links: document.getElementById('project-modal-links'),
    close: document.getElementById('project-modal-close'),
  };

  const GITHUB_ICON =
    '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>';
  const PDF_ICON =
    '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/></svg>';

  const openModal = (key) => {
    const project = PROJECTS[key];
    if (!project) return;

    /* EN-версия из словаря i18n.js, если включён английский */
    const en = window.I18N && window.I18N.lang === 'en' ? window.I18N.modal(key) : null;
    const title = (en && en.title) || project.title;
    const desc = (en && en.desc) || project.desc;
    const features = en && en.features && en.features.length ? en.features : project.features;

    els.pin.hidden = !project.main;
    els.title.textContent = title;

    els.tags.replaceChildren(
      ...project.tags.map((tag) => {
        const li = document.createElement('li');
        li.textContent = tag;
        return li;
      })
    );

    els.desc.textContent = desc;

    els.features.replaceChildren(
      ...features.map((text) => {
        const li = document.createElement('li');
        li.textContent = text;
        return li;
      })
    );
    els.features.hidden = features.length === 0;

    /* Фото — каллажем через GalleryView (сцена + миниатюры);
       фолбэк — прежняя сетка, если gallery.js не загрузился */
    if (project.images.length && window.GalleryView) {
      els.shots.replaceChildren(
        window.GalleryView.createGalleryView({
          images: project.images.map((image) => ({
            src: image.src,
            alt: image.alt,
            caption: image.alt,
          })),
          compact: true,
        })
      );
      els.shots.hidden = false;
    } else {
      els.shots.replaceChildren(
        ...(project.video
          ? (() => {
              const video = document.createElement('video');
              video.src = project.video.src;
              video.controls = true;
              video.preload = 'metadata';
              video.playsInline = true;
              video.className = 'modal-video';
              video.setAttribute('aria-label', project.video.label);
              return [video];
            })()
          : []),
        ...project.images.map((image) => {
          const img = document.createElement('img');
          img.src = image.src;
          img.alt = image.alt;
          img.decoding = 'async';
          return img;
        })
      );
      els.shots.classList.toggle('modal-shots--wide', !project.video && project.images.length === 1);
      els.shots.hidden = !project.video && project.images.length === 0;
    }

    els.links.replaceChildren();
    if (project.pdf) {
      const pdfLink = document.createElement('a');
      pdfLink.className = 'modal-link modal-link--primary';
      pdfLink.href = project.pdf.src;
      pdfLink.target = '_blank';
      pdfLink.rel = 'noopener';
      pdfLink.innerHTML = PDF_ICON;
      pdfLink.appendChild(document.createTextNode(project.pdf.label));
      els.links.appendChild(pdfLink);
    }
    if (project.github) {
      const ghLink = document.createElement('a');
      ghLink.className = 'modal-link';
      ghLink.href = project.github;
      ghLink.target = '_blank';
      ghLink.rel = 'noopener';
      ghLink.innerHTML = GITHUB_ICON;
      ghLink.appendChild(document.createTextNode('Код на GitHub'));
      els.links.appendChild(ghLink);
    }
    if (project.demo) {
      const demoLink = document.createElement('a');
      demoLink.className = 'modal-link modal-link--primary';
      demoLink.href = project.demo;
      demoLink.target = '_blank';
      demoLink.rel = 'noopener';
      demoLink.innerHTML =
        '<svg class="icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5.14v14l11-7-11-7Z"/></svg>';
      demoLink.appendChild(
        document.createTextNode(window.kcLang === 'en' ? 'Play online' : 'Играть онлайн')
      );
      els.links.appendChild(demoLink);
    }
    els.links.hidden = !project.pdf && !project.github && !project.demo;

    modal.showModal();
  };

  document.querySelectorAll('.project-card__open').forEach((button) => {
    button.addEventListener('click', () => openModal(button.dataset.project));
  });

  /* Предзагрузка скриншотов при наведении/фокусе на кнопку карточки:
     к моменту открытия модалки фото уже в кэше и видны сразу */
  document.querySelectorAll('.project-card__open').forEach((button) => {
    const project = PROJECTS[button.dataset.project];
    if (!project || project.images.length === 0) return;
    const preload = () => {
      project.images.forEach((image) => {
        new Image().src = image.src;
      });
    };
    button.addEventListener('mouseenter', preload, { once: true });
    button.addEventListener('focus', preload, { once: true });
  });

  els.close.addEventListener('click', () => modal.close());

  /* Клик по затемнению закрывает модалку */
  modal.addEventListener('click', (event) => {
    if (event.target === modal) modal.close();
  });
})();
