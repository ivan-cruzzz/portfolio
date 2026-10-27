/* ============================================================
   Ivan Cruz — портфолио
   Каллаж-галерея (js/gallery.js): ванильный порт компонента
   thumbnail-image-viewer — сцена 16:10, счётчик, стрелки,
   подпись с автором и лента миниатюр с клавиатурой
   (←/→/Home/End) и ARIA-ролями tablist/tab/tabpanel.
   Используется во вкладке «Лендинги» и в модалках проектов.
   ============================================================ */

(() => {
  'use strict';

  const pad = (n) => String(n).padStart(2, '0');

  const ARROW_LEFT =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m15 18-6-6 6-6"/></svg>';
  const ARROW_RIGHT =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m9 18 6-6-6-6"/></svg>';

  /* images: [{ src, alt, caption?, badge? }] */
  const createGalleryView = ({ images = [], eyebrow = '', title = '', subtitle = '', credit = '', compact = false } = {}) => {
    const root = document.createElement('section');
    root.className = 'gallery-view' + (compact ? ' gallery-view--compact' : '');
    if (!images.length) return root;

    let active = 0;
    const id = 'gv-' + Math.random().toString(36).slice(2, 8);
    let counter = null;

    /* Шапка с заголовком и счётчиком (в модалке скрыта) */
    if (!compact && (eyebrow || title || subtitle)) {
      const head = document.createElement('header');
      head.className = 'gallery-view__head';
      const meta = document.createElement('div');
      meta.className = 'gallery-view__meta';
      if (eyebrow) {
        const el = document.createElement('span');
        el.className = 'gallery-view__eyebrow';
        el.textContent = eyebrow;
        meta.appendChild(el);
      }
      if (title) {
        const el = document.createElement('h3');
        el.className = 'gallery-view__title';
        el.textContent = title;
        meta.appendChild(el);
      }
      if (subtitle) {
        const el = document.createElement('p');
        el.className = 'gallery-view__subtitle';
        el.textContent = subtitle;
        meta.appendChild(el);
      }
      counter = document.createElement('span');
      counter.className = 'gallery-view__counter';
      head.append(meta, counter);
      root.appendChild(head);
    }

    /* Сцена: большое фото + виньетка, бейдж и стрелки */
    const stage = document.createElement('div');
    stage.className = 'gallery-view__stage';
    stage.id = `${id}-panel`;
    stage.setAttribute('role', 'tabpanel');

    const img = document.createElement('img');
    img.className = 'gallery-view__img';
    img.decoding = 'async';
    img.draggable = false;

    const shade = document.createElement('span');
    shade.className = 'gallery-view__shade';
    shade.setAttribute('aria-hidden', 'true');

    const badge = document.createElement('span');
    badge.className = 'gallery-view__badge';

    const stageCounter = document.createElement('span');
    stageCounter.className = 'gallery-view__counter gallery-view__counter--overlay';
    if (compact) stage.appendChild(stageCounter);

    const nav = document.createElement('div');
    nav.className = 'gallery-view__nav';
    const prev = document.createElement('button');
    prev.type = 'button';
    prev.className = 'gallery-view__arrow';
    prev.setAttribute('aria-label', 'Предыдущее фото');
    prev.innerHTML = ARROW_LEFT;
    const next = document.createElement('button');
    next.type = 'button';
    next.className = 'gallery-view__arrow';
    next.setAttribute('aria-label', 'Следующее фото');
    next.innerHTML = ARROW_RIGHT;
    nav.append(prev, next);

    stage.append(img, shade, badge, ...(compact ? [stageCounter] : []), nav);
    root.appendChild(stage);

    /* Подпись: название кадра + автор */
    const caption = document.createElement('div');
    caption.className = 'gallery-view__caption';
    caption.setAttribute('aria-live', 'polite');
    const capTitle = document.createElement('h4');
    capTitle.className = 'gallery-view__caption-title';
    const capCredit = document.createElement('span');
    capCredit.className = 'gallery-view__credit';
    caption.append(capTitle, capCredit);
    root.appendChild(caption);

    /* Лента миниатюр с клавиатурной навигацией */
    const thumbs = document.createElement('div');
    thumbs.className = 'gallery-view__thumbs';
    thumbs.setAttribute('role', 'tablist');
    thumbs.setAttribute('aria-label', 'Выбрать фото');

    const thumbButtons = images.map((image, i) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'gallery-view__thumb';
      b.id = `${id}-tab-${i}`;
      b.setAttribute('role', 'tab');
      b.setAttribute('aria-controls', stage.id);
      b.setAttribute('aria-label', image.caption || image.alt || `Фото ${i + 1}`);
      const t = document.createElement('img');
      t.src = image.src;
      t.alt = '';
      t.loading = 'lazy';
      t.decoding = 'async';
      t.draggable = false;
      const num = document.createElement('span');
      num.textContent = pad(i + 1);
      num.setAttribute('aria-hidden', 'true');
      b.append(t, num);
      b.addEventListener('click', () => choose(i));
      return b;
    });
    thumbs.append(...thumbButtons);
    root.appendChild(thumbs);

    thumbs.addEventListener('keydown', (event) => {
      let n = null;
      if (event.key === 'ArrowRight') n = (active + 1) % images.length;
      else if (event.key === 'ArrowLeft') n = (active - 1 + images.length) % images.length;
      else if (event.key === 'Home') n = 0;
      else if (event.key === 'End') n = images.length - 1;
      if (n === null) return;
      event.preventDefault();
      choose(n);
      thumbButtons[n].focus();
    });

    const updateCounter = () => {
      const html = `${pad(active + 1)}<span> / ${pad(images.length)}</span>`;
      if (counter) counter.innerHTML = html;
      stageCounter.innerHTML = html;
    };

    const choose = (n) => {
      active = (n + images.length) % images.length;
      const image = images[active];
      img.src = image.src;
      img.alt = image.alt || '';
      badge.textContent = image.badge || '';
      badge.hidden = !image.badge;
      capTitle.textContent = image.caption || '';
      capTitle.hidden = !image.caption;
      capCredit.textContent = credit;
      capCredit.hidden = !credit;
      updateCounter();
      thumbButtons.forEach((b, i) => {
        const selected = i === active;
        b.classList.toggle('is-active', selected);
        b.setAttribute('aria-selected', String(selected));
        b.tabIndex = selected ? 0 : -1;
      });
    };

    prev.addEventListener('click', () => choose(active - 1));
    next.addEventListener('click', () => choose(active + 1));

    choose(0);
    return root;
  };

  window.GalleryView = { createGalleryView };
})();
