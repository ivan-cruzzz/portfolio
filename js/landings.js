/* ============================================================
   Ivan Cruz — портфолио
   Вкладка «Лендинги» (js/landings.js): каллажи скриншотов
   лендингов через GalleryView. Фото лежат локально,
   по отдельной папке на каждый лендинг:
   assets/landings/<slug>/01.jpg, 02.jpg, …
   Новый лендинг = папка с фото + запись в LANDINGS ниже.
   ============================================================ */

const LANDINGS = [
  {
    slug: 'pushkin',
    count: 5,
    short: { ru: 'Пушкин', en: 'Pushkin' },
    title: { ru: 'Музей Пушкина', en: 'Pushkin Museum' },
    subtitle: {
      ru: 'Виртуальный музей: экскурсия, жанровая лента, виртуальный тур и аудиогид.',
      en: 'A virtual museum: guided tour, genre feed, virtual walk and audio guide.',
    },
    captions: {
      ru: ['Главный экран: начать экскурсию или включить аудиогид'],
      en: ['Hero: start the tour or turn on the audio guide'],
    },
  },
  {
    slug: 'prisma',
    count: 4,
    short: { ru: 'Prisma', en: 'Prisma' },
    title: { ru: 'Лендинг-портфолио Prisma', en: 'Prisma Portfolio Landing' },
    subtitle: {
      ru: 'Портфолио сети визуальных художников и сторителлеров: иммерсивный хиро и подача работ.',
      en: 'Portfolio landing for a network of visual artists and storytellers: immersive hero and case showcase.',
    },
    captions: {
      ru: ['Хиро с 3D-островом над облаками'],
      en: ['Hero with a 3D island above the clouds'],
    },
  },
  {
    slug: 'grato',
    count: 10,
    short: { ru: 'Grato', en: 'Grato' },
    title: { ru: 'Магазин парфюмерии Grato', en: 'Grato Perfume Store' },
    subtitle: {
      ru: '«Благодарный свету»: вход и гостевой режим, каталог, корзина без сбора данных.',
      en: '“Grateful to the light”: sign-in and guest mode, catalogue, no-data cart.',
    },
    captions: {
      ru: ['Экран входа и гостевой режим'],
      en: ['Sign-in screen and guest mode'],
    },
  },
  {
    slug: 'crypto-wallet',
    count: 9,
    short: { ru: 'Крипта', en: 'Crypto' },
    title: { ru: 'Криптокошелёк с AI-помощником', en: 'Crypto Wallet with AI Assistant' },
    subtitle: {
      ru: 'Многостраничный сайт кошелька: «крипта, которая просто работает» — продукт, безопасность, тарифы.',
      en: 'Multi-page wallet website: “crypto that just works” — product, security, pricing.',
    },
    captions: {
      ru: ['Хиро с роботом-помощником'],
      en: ['Hero with the robot assistant'],
    },
  },
  {
    slug: 'marketplace',
    count: 4,
    short: { ru: 'RemWaves', en: 'RemWaves' },
    title: { ru: 'Маркетплейс RemWaves', en: 'RemWaves Marketplace' },
    subtitle: {
      ru: 'Сайт-маркетплейс принтов, постеров и мерча: «найди свою волну» — подбор и доставка.',
      en: 'Marketplace for prints, posters and merch: “find your wave” — picker and delivery.',
    },
    captions: {
      ru: ['Хиро с подбором категории'],
      en: ['Hero with the category picker'],
    },
  },
  {
    slug: 'neobrutalism',
    count: 1,
    short: { ru: 'Необрутализм', en: 'Neubrutalism' },
    title: { ru: 'Необрутализм — fullstack-разработчик', en: 'Neubrutalism — Fullstack Developer' },
    subtitle: {
      ru: '«Пишу код, который приносит деньги»: жирные чёрные контуры, офсет-тени и кричащие блоки — дерзкий, но выверенный до пикселя лендинг-манифест.',
      en: '“I write code that makes money”: bold black outlines, offset shadows and loud blocks — a defiant landing manifesto, pixel-perfect neubrutalism.',
    },
    captions: {
      ru: ['Кодовая карточка и стикер «OPEN TO WORK»'],
      en: ['Code card and the “OPEN TO WORK” sticker'],
    },
  },
  {
    slug: 'motion-cinematic',
    count: 1,
    short: { ru: 'Motion', en: 'Motion' },
    title: { ru: 'Кинематографичный — motion-дизайнер', en: 'Cinematic — Motion Designer' },
    subtitle: {
      ru: '«Движение, которое продаёт»: letterbox с таймкодом, метка REC, кинетическая типографика и живой WebGL-шейдер — портфолио как кадр из фильма.',
      en: '“Motion that sells”: letterbox with a timecode, REC mark, kinetic typography and a living WebGL shader — a portfolio like a film frame.',
    },
    captions: {
      ru: ['Хиро с шейдерным светом и стеклянной кнопкой play'],
      en: ['Hero with shader light and a glass play button'],
    },
  },
  {
    slug: 'editorial-brand',
    count: 1,
    short: { ru: 'Editorial', en: 'Editorial' },
    title: { ru: 'Editorial — бренд-дизайнер', en: 'Editorial — Brand Designer' },
    subtitle: {
      ru: '«Дизайн, который читают как журнал»: Issue Nº 04, бумага верже, киноварь, буквицы и развороты-кейсы — портфолио, которое листаешь, а не скроллишь.',
      en: '“Design you read like a magazine”: Issue Nº 04, textured paper, vermilion, drop caps and case spreads — a portfolio you flip through, not scroll.',
    },
    captions: {
      ru: ['Обложка выпуска: АЛИНА / de-Кастель'],
      en: ['Issue cover: ALINA / de-Castel'],
    },
  },
  {
    slug: 'data-dashboard',
    count: 1,
    short: { ru: 'Data', en: 'Data' },
    title: { ru: 'Data Dashboard — дата-сайентист', en: 'Data Dashboard — Data Scientist' },
    subtitle: {
      ru: '«Превращаю данные в решения, а не в отчёты»: прогноз выручки на Liquid Glass, живая линия forecast и KPI в tabular-цифрах.',
      en: '“Turning data into decisions, not reports”: a revenue forecast on Liquid Glass, a live forecast line and KPIs in tabular digits.',
    },
    captions: {
      ru: ['Прогноз выручки на стеклянной панели'],
      en: ['Revenue forecast on a glass panel'],
    },
  },
  {
    slug: 'swiss-bento-designer',
    count: 2,
    short: { ru: 'Swiss', en: 'Swiss' },
    title: { ru: 'Swiss Bento — продуктовый дизайнер', en: 'Swiss Bento — Product Designer' },
    subtitle: {
      ru: '«Дизайн, который считают метриками, а не вкусом»: швейцарская сетка, bento-раскладка кейсов и измеримая польза интерфейсов.',
      en: '“Design measured by metrics, not taste”: a Swiss grid, bento case layout and measurable interface impact.',
    },
    captions: {
      ru: ['Хиро с сеткой и метриками', 'Кейсы и процесс'],
      en: ['Hero with the grid and metrics', 'Cases and process'],
    },
  },
  {
    slug: 'ai-dark-glass',
    count: 2,
    short: { ru: 'AI', en: 'AI' },
    title: { ru: 'AI Dark Glass — AI/ML-инженер', en: 'AI Dark Glass — AI/ML Engineer' },
    subtitle: {
      ru: '«Делаю LLM-системы, которые работают в проде, а не в демо»: тёмное стекло, панель production-статуса и цифры p95, F1 и стоимости токенов.',
      en: '“I build LLM systems that run in prod, not in demos”: dark glass, a production-status panel and real p95, F1 and token-cost numbers.',
    },
    captions: {
      ru: ['Хиро с production-статусом', 'Стек навигации'],
      en: ['Hero with the production status', 'Navigation stack'],
    },
  },
  {
    slug: 'terminal-frontend',
    count: 2,
    short: { ru: 'Terminal', en: 'Terminal' },
    title: { ru: 'Terminal — frontend-разработчик', en: 'Terminal — Frontend Developer' },
    subtitle: {
      ru: 'Портфолио как терминал: навигация «~/about», навыки через npm ls, статус-бар как в редакторе и кнопка «npm run hire».',
      en: 'A portfolio as a terminal: “~/about” navigation, skills via npm ls, an editor-style status bar and an “npm run hire” button.',
    },
    captions: {
      ru: ['Хиро терминала', 'npm ls --skills'],
      en: ['Terminal hero', 'npm ls --skills'],
    },
  },
  {
    slug: 'neon-3d-artist',
    count: 2,
    short: { ru: 'Neon 3D', en: 'Neon 3D' },
    title: { ru: 'Neon 3D — 3D-художник и гейм-артист', en: 'Neon 3D — 3D Artist & Game Artist' },
    subtitle: {
      ru: '«Собираю миры из полигонов, света и шейдеров»: неоновый лендинг с 3D-сценами и работами по гейм-арту.',
      en: '“I assemble worlds from polygons, light and shaders”: a neon landing with 3D scenes and game-art works.',
    },
    captions: {
      ru: ['Неоновое хиро', 'Работы и шейдеры'],
      en: ['Neon hero', 'Works and shaders'],
    },
  },
  {
    slug: 'saas-bento-pm',
    count: 2,
    short: { ru: 'SaaS', en: 'SaaS' },
    title: { ru: 'SaaS Bento — продакт-менеджер', en: 'SaaS Bento — Product Manager' },
    subtitle: {
      ru: '«Продакт, который растит метрики, а не фичи»: bento-раскладка метрик, роадмапа и экспериментов с цифрами влияния.',
      en: '“A PM who grows metrics, not features”: a bento layout of metrics, roadmap and experiments with impact numbers.',
    },
    captions: {
      ru: ['Хиро с метриками', 'Роадмап и эксперименты'],
      en: ['Hero with metrics', 'Roadmap and experiments'],
    },
  },
  {
    slug: 'gallery-photographer',
    count: 2,
    short: { ru: 'Gallery', en: 'Gallery' },
    title: { ru: 'Gallery — фотограф', en: 'Gallery — Photographer' },
    subtitle: {
      ru: '«Меня интересует не поза, а пауза между позами»: галерейная сетка репортажа, портрета и стрита.',
      en: '“I am interested not in a pose but in the pause between poses”: a gallery grid of reportage, portrait and street work.',
    },
    captions: {
      ru: ['Галерейная обложка', 'Сетка работ'],
      en: ['Gallery cover', 'Works grid'],
    },
  },
];

(() => {
  'use strict';

  const pad = (n) => String(n).padStart(2, '0');

  const grid = document.getElementById('projects-grid');
  const view = document.getElementById('landings-view');
  const tabProjects = document.getElementById('tab-projects');
  const tabLandings = document.getElementById('tab-landings');
  const sub = document.getElementById('projects-sub');
  if (!view || !tabProjects || !tabLandings || !grid || !window.GalleryView) return;

  const SUBS = {
    ru: {
      projects: 'Нажмите на проект, чтобы посмотреть скриншоты и презентацию.',
      landings: 'Каллажи скриншотов моих лендингов — листайте стрелками или миниатюрами.',
    },
    en: {
      projects: 'Click a project to see screenshots and the deck.',
      landings: 'Collages of my landing pages — browse with arrows or thumbnails.',
    },
  };

  let lang = window.kcLang === 'en' ? 'en' : 'ru';
  let currentTab = 'projects';

  const build = () => {
    view.replaceChildren();
    LANDINGS.forEach((landing, index) => {
      const title = landing.title[lang];
      const images = [];
      for (let i = 1; i <= landing.count; i += 1) {
        images.push({
          src: `assets/landings/${landing.slug}/${pad(i)}.jpg`,
          alt: lang === 'en' ? `${title} — screen ${i}` : `${title} — экран ${i}`,
          caption: (landing.captions[lang] && landing.captions[lang][i - 1]) || null,
          badge: `${landing.short[lang] || landing.short.ru} / ${pad(i)}`,
        });
      }
      view.appendChild(
        window.GalleryView.createGalleryView({
          eyebrow: `${lang === 'en' ? 'Landing' : 'Лендинг'} / ${pad(index + 1)}`,
          title,
          subtitle: landing.subtitle[lang],
          credit: 'Ivan Cruz',
          images,
        })
      );
    });
  };

  const setTab = (which) => {
    currentTab = which;
    lang = window.kcLang === 'en' ? 'en' : 'ru';
    const isLandings = which === 'landings';
    tabProjects.classList.toggle('is-active', !isLandings);
    tabProjects.setAttribute('aria-selected', String(!isLandings));
    tabLandings.classList.toggle('is-active', isLandings);
    tabLandings.setAttribute('aria-selected', String(isLandings));
    grid.hidden = isLandings;
    view.hidden = !isLandings;
    if (sub) sub.textContent = isLandings ? SUBS[lang].landings : SUBS[lang].projects;
    if (isLandings) build();
  };

  tabProjects.addEventListener('click', () => setTab('projects'));
  tabLandings.addEventListener('click', () => setTab('landings'));

  /* Смена языка: пересобираем открытую вкладку лендингов */
  document.addEventListener('kc-lang', () => {
    lang = window.kcLang === 'en' ? 'en' : 'ru';
    if (currentTab === 'landings') {
      build();
      if (sub) sub.textContent = SUBS[lang].landings;
    } else if (sub) {
      sub.textContent = SUBS[lang].projects;
    }
  });
})();
