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
