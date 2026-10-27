/* ============================================================
   Ivan Cruz — портфолио
   Компоненты Kokonut UI (kokonutui.com, MIT), портированные
   на vanilla JS: физика и константы взяты из оригиналов.
     - NowPlaying   (liquid-glass-card) — виниловый плеер
     - CardFlip     (card-flip)         — визитка с QR
     - SwitchButton (switch-button)     — тумблер темы
     - PullCord     (pull-cord)         — лампа в футере
     - MorphPopover (morph-popover)     — кнопка-отзыв
   Всё отключается при prefers-reduced-motion.
   ============================================================ */

(() => {
  'use strict';

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Отправка отзыва в Telegram: создайте бота у @BotFather, вставьте токен
     и свой chat_id (узнать: @userinfobot). Пусто — форма в демо-режиме. */
  const FEEDBACK = {
    botToken: '',
    chatId: '',
  };

  const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
  const damp = (distance, max) => max * (1 - Math.exp(-distance / max));

  /* ============================================================
     Тема сайта — единое состояние для тумблера и лампы
     ============================================================ */
  const THEME_KEY = 'kc-theme';

  const getTheme = () =>
    document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';

  const applyTheme = (theme) => {
    document.documentElement.setAttribute('data-theme', theme);
    document.documentElement.style.colorScheme = theme;
    try {
      localStorage.setItem(THEME_KEY, theme);
    } catch (e) {
      /* приватный режим — тема просто не сохранится */
    }
    document.dispatchEvent(new CustomEvent('kc-theme', { detail: { theme } }));
  };

  /* Разовый SVG-фильтр преломления для жидкого стекла (Chromium) */
  const injectGlassFilter = () => {
    if (document.getElementById('kc-glass-filter')) return;
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('aria-hidden', 'true');
    svg.style.position = 'absolute';
    svg.style.width = '0';
    svg.style.height = '0';
    svg.innerHTML =
      '<defs><filter id="kc-glass-filter" color-interpolation-filters="sRGB" x="-50%" y="-50%" width="200%" height="200%">' +
      '<feTurbulence type="fractalNoise" baseFrequency="0.05 0.05" numOctaves="1" seed="1" result="turbulence"/>' +
      '<feGaussianBlur in="turbulence" stdDeviation="2" result="blurredNoise"/>' +
      '<feDisplacementMap in="SourceGraphic" in2="blurredNoise" scale="30" xChannelSelector="R" yChannelSelector="B" result="displaced"/>' +
      '<feGaussianBlur in="displaced" stdDeviation="4"/>' +
      '</filter></defs>';
    document.body.appendChild(svg);
  };

  /* ============================================================
     SwitchButton — тумблер темы с WAAPI-морфом и круговым
     раскрытием темы через View Transitions (Chromium)
     ============================================================ */
  const initSwitchButton = () => {
    const button = document.querySelector('.kc-switch');
    if (!button) return;

    const REVEAL_CSS =
      'html[data-theme-reveal]::view-transition-old(root),' +
      'html[data-theme-reveal]::view-transition-new(root){animation:none;mix-blend-mode:normal}';
    let revealRunning = false;

    const timing = (el, toDark) => {
      const part = el.dataset.part;
      const i = Number(el.dataset.index || '0');
      switch (part) {
        case 'ray':
          return { delay: toDark ? i * 18 : 140 + i * 22, duration: 260, easing: 'cubic-bezier(0.23, 1, 0.32, 1)' };
        case 'bite':
          return { delay: toDark ? 60 : 0, duration: 380, easing: 'cubic-bezier(0.65, 0, 0.35, 1)' };
        case 'disc':
          return { delay: toDark ? 40 : 0, duration: 380, easing: 'cubic-bezier(0.23, 1, 0.32, 1)' };
        default:
          return { duration: 240, easing: 'cubic-bezier(0.23, 1, 0.32, 1)' };
      }
    };

    const morph = (from, toDark) => {
      if (prefersReduced) return;
      from.forEach((frame, el) => {
        el.animate([frame, {}], { ...timing(el, toDark), fill: 'backwards' });
      });
    };

    const revealFrom = (el, apply) => {
      const doc = document;
      if (
        typeof doc.startViewTransition !== 'function' ||
        prefersReduced ||
        revealRunning ||
        doc.activeViewTransition
      ) {
        apply();
        return;
      }
      const rect = el.getBoundingClientRect();
      const x = rect.left + rect.width / 2;
      const y = rect.top + rect.height / 2;
      const radius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));

      let style = document.getElementById('kc-reveal-style');
      if (!style) {
        style = document.createElement('style');
        style.id = 'kc-reveal-style';
        style.textContent = REVEAL_CSS;
        document.head.appendChild(style);
      }
      document.documentElement.setAttribute('data-theme-reveal', '');
      revealRunning = true;

      let transition;
      try {
        transition = doc.startViewTransition(apply);
      } catch (e) {
        document.documentElement.removeAttribute('data-theme-reveal');
        revealRunning = false;
        apply();
        return;
      }
      transition.ready
        .then(() => {
          document.documentElement.animate(
            { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
            { duration: 500, easing: 'cubic-bezier(0.4, 0, 0.2, 1)', pseudoElement: '::view-transition-new(root)' }
          );
        })
        .catch(() => {});
      transition.finished
        .catch(() => {})
        .finally(() => {
          document.documentElement.removeAttribute('data-theme-reveal');
          revealRunning = false;
        });
    };

    const syncPressed = () => {
      button.setAttribute('aria-pressed', String(getTheme() === 'dark'));
    };
    syncPressed();
    document.addEventListener('kc-theme', syncPressed);

    button.addEventListener('click', () => {
      const next = getTheme() === 'dark' ? 'light' : 'dark';
      const parts = Array.from(button.querySelectorAll('[data-part]'));
      const before = new Map();
      if (!prefersReduced) {
        parts.forEach((el) => {
          const style = getComputedStyle(el);
          const frame = {};
          ['opacity', 'scale', 'translate', 'filter'].forEach((prop) => {
            frame[prop] = style.getPropertyValue(prop);
          });
          before.set(el, frame);
        });
      }
      const apply = () => {
        applyTheme(next);
        morph(before, next === 'dark');
      };
      revealFrom(button, apply);
    });
  };

  /* ============================================================
     NowPlaying — виниловый плеер на жидком стекле
     ============================================================ */
  const CRUISE = 200; // 33⅓ об/мин = 200°/с, оборот за 1.8 с
  const CRUISE_MS = 1800;
  const MAX_OMEGA = 2160;
  const COAST_TAU = 0.45;
  const SPIN_UP_TAU = 0.22;
  const SPIN_DOWN_TAU = 0.2;
  const SETTLE_EPSILON = 2;
  const DEAD_ZONE = 10;
  const VELOCITY_WINDOW_MS = 80;
  const STALE_MOVE_MS = 60;
  const HOLD_SETTLE_S = 0.05;
  const BAR_REST = 0.14;
  const BAR_DECAY_S = 0.3;
  const BAR_ATTACK_S = 0.08;
  const RUBBER_MAX = 18;
  const SEEK_STEP = 5;
  const RESTART_THRESHOLD = 3;
  const MAX_DT = 0.05;
  const ROLL_MS = 220;
  const RUBBER_RETURN = 'transform 450ms cubic-bezier(0.34, 1.4, 0.64, 1)';
  const PREVIEW_DUR = 30; // длина превью Deezer

  const scrubGain = (speed) => {
    const excess = Math.max(0, Math.abs(speed) - CRUISE) / CRUISE;
    return 1 + 1.5 * excess ** 1.5;
  };

  const trackRate = (omega) => (omega / CRUISE) * scrubGain(omega);

  const formatTime = (seconds) => {
    const s = Math.max(0, Math.floor(seconds));
    return `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;
  };

  /* Детерминированный шум для эквалайзера — функция позиции трека */
  const hash = (n) => {
    const s = Math.sin(n * 127.1) * 43758.5453;
    return s - Math.floor(s);
  };
  const noise = (x) => {
    const i = Math.floor(x);
    const f = x - i;
    const u = f * f * (3 - 2 * f);
    return hash(i) * (1 - u) + hash(i + 1) * u;
  };
  const barLevel = (index, t) =>
    0.6 * noise(t * 4.3 + index * 17.3) + 0.4 * noise(t * 9.1 + index * 31.7 + 100);

  /* Поиск превью в Deezer через JSONP (у API нет CORS-заголовков) */
  const deezerSearch = (query, callback) => {
    const fn = `__dz_${Math.random().toString(36).slice(2)}`;
    const script = document.createElement('script');
    const cleanup = () => {
      clearTimeout(timer);
      delete window[fn];
      script.remove();
    };
    const timer = setTimeout(() => {
      cleanup();
      callback(null);
    }, 6000);
    window[fn] = (data) => {
      cleanup();
      callback(data);
    };
    script.src =
      'https://api.deezer.com/search?limit=8&output=jsonp&callback=' + fn + '&q=' + encodeURIComponent(query);
    script.onerror = () => {
      cleanup();
      callback(null);
    };
    document.head.appendChild(script);
  };

  /* Печатный рисунок на этикетке пластинки */
  const labelArt = (variant) => {
    const ink = '#3f3f46';
    const accent = 'var(--now-playing-accent)';
    if (variant === 1) {
      return (
        `<path fill="${accent}" d="M50 50 L50 8 A42 42 0 0 1 92 50 Z"/>` +
        `<path fill="${ink}" d="M50 50 L8 50 A42 42 0 0 1 50 8 Z"/>` +
        `<rect fill="${ink}" height="6" rx="1" width="30" x="50" y="62"/>` +
        `<rect fill="${ink}" height="6" rx="1" width="20" x="50" y="72"/>`
      );
    }
    if (variant === 2) {
      let dots = '';
      for (let i = 0; i < 25; i++) {
        const x = 26 + (i % 5) * 12;
        const y = 26 + Math.floor(i / 5) * 12;
        const lit = i === 8;
        dots += `<circle fill="${lit ? accent : ink}" cx="${x}" cy="${y}" r="${lit ? 5.5 : 2.6}"/>`;
      }
      return dots;
    }
    return (
      `<circle fill="${accent}" cx="64" cy="36" r="20"/>` +
      `<rect fill="${ink}" height="5" width="64" x="18" y="60"/>` +
      `<rect fill="${ink}" height="5" width="52" x="18" y="70"/>` +
      `<rect fill="${ink}" height="5" width="40" x="18" y="80"/>`
    );
  };

  const discSvg = (artwork) => {
    const grooves = [28, 31, 34, 37, 40, 43, 46]
      .map((r) => `<circle fill="none" stroke="rgba(255,255,255,0.08)" stroke-width="0.6" cx="50" cy="50" r="${r}"/>`)
      .join('');
    const clip = 'kc-label-clip-' + Math.random().toString(36).slice(2);
    return (
      '<svg viewBox="0 0 100 100" aria-hidden="true">' +
      '<circle fill="#18181b" cx="50" cy="50" r="50"/>' +
      grooves +
      '<circle fill="none" stroke="rgba(255,255,255,0.16)" stroke-width="0.8" cx="50" cy="50" r="49"/>' +
      `<clipPath id="${clip}"><circle cx="50" cy="50" r="24"/></clipPath>` +
      '<circle fill="#f4f4f5" cx="50" cy="50" r="24"/>' +
      `<g clip-path="url(#${clip})" transform="translate(26 26) scale(0.48)">` +
      labelArt(artwork) +
      '</g>' +
      '<circle fill="#ffffff" cx="50" cy="50" r="1.8"/>' +
      '</svg>'
    );
  };

  const tonearmSvg =
    '<svg viewBox="0 0 40 110" aria-hidden="true">' +
    '<circle fill="#e4e4e7" stroke="#d4d4d8" cx="31" cy="11" r="8"/>' +
    '<circle fill="#a1a1aa" cx="31" cy="11" r="3"/>' +
    '<path fill="none" stroke="#a1a1aa" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" d="M31 11 L31 70 L18 92"/>' +
    '<rect fill="#52525b" height="12" rx="1.5" transform="rotate(32 16 96)" width="7" x="12.5" y="90"/>' +
    '</svg>';

  const rotate = (angle) => `rotate(${Math.round((angle % 360) * 100) / 100}deg)`;

  /* Прокручивающиеся цифры времени */
  const DIGIT_ANIMS = {
    1: ['now-playing-in-up', 'now-playing-out-up'],
    [-1]: ['now-playing-in-down', 'now-playing-out-down'],
  };

  const renderClock = (el, seconds, dir) => {
    const chars = formatTime(seconds).split('').reverse();
    const slots = el.querySelectorAll('.kc-np__digit');
    if (slots.length !== chars.length) {
      el.innerHTML = chars
        .map((c) =>
          c === ':' ? '<span>:</span>' : `<span class="kc-np__digit" data-v="${c}"><span>${c}</span></span>`
        )
        .join('');
      return;
    }
    chars.forEach((c, i) => {
      const slot = slots[i];
      if (c === ':') return;
      if (slot.dataset.v === c) return;
      const prev = slot.dataset.v;
      slot.dataset.v = c;
      slot.innerHTML = '';
      if (!prefersReduced) {
        const [inAnim, outAnim] = DIGIT_ANIMS[dir >= 0 ? 1 : -1];
        const timing = `${ROLL_MS}ms cubic-bezier(0.23, 1, 0.32, 1) both`;
        const out = document.createElement('span');
        out.className = 'kc-np__digit-prev';
        out.textContent = prev;
        out.style.animation = `${outAnim} ${timing}`;
        const cur = document.createElement('span');
        cur.textContent = c;
        cur.style.animation = `${inAnim} ${timing}`;
        slot.append(out, cur);
      } else {
        const cur = document.createElement('span');
        cur.textContent = c;
        slot.append(cur);
      }
    });
  };

  class NowPlaying {
    constructor(root) {
      this.root = root;
      /* Список треков лежит в <script type="application/json"> внутри карточки */
      const host = root.closest('.kc-glass') || root;
      const dataEl = host.querySelector('.kc-np-data');
      let tracks = [];
      if (dataEl) {
        try {
          tracks = JSON.parse(dataEl.textContent).tracks || [];
        } catch (e) {
          tracks = [];
        }
      }
      if (!tracks.length) {
        /* Резерв: один трек из data-атрибутов обёртки */
        tracks = [{
          title: root.dataset.title || '',
          artist: root.dataset.artist || '',
          duration: Number(root.dataset.duration) || 200,
          artwork: Number(root.dataset.artwork) || 0,
          accent: root.dataset.accent || '',
          query: root.dataset.query || '',
          yt: root.dataset.youtube || '',
          artistMatch: root.dataset.artistMatch || '.',
          titleMatch: root.dataset.titleMatch || '.',
        }];
      }
      this.tracks = tracks.map((t) => ({
        title: t.title || '',
        artist: t.artist || '',
        duration: Number(t.duration) || 200,
        artwork: Number(t.artwork) || 0,
        accent: t.accent || '',
        query: t.query || '',
        yt: t.yt || '',
        artistRe: new RegExp(t.artistMatch || '.', 'i'),
        titleRe: new RegExp(t.titleMatch || '.', 'i'),
      }));
      this.trackIndex = 0;

      const disc = root.querySelector('.kc-np__disc');
      this.els = {
        disc,
        deck: root.querySelector('.kc-np__deck'),
        fill: root.querySelector('.kc-np__fill'),
        rail: root.querySelector('.kc-np__rail'),
        seek: root.querySelector('.kc-np__seek'),
        rpm: root.querySelector('.kc-np__rpm'),
        clock: root.querySelector('.kc-np__clock'),
        total: root.querySelector('.kc-np__total'),
        title: root.querySelector('.kc-np__title'),
        artist: root.querySelector('.kc-np__artist'),
        bars: Array.from(root.querySelectorAll('.kc-np__bar')),
        play: root.querySelector('.kc-np__play'),
        prev: root.querySelector('.kc-np__prev'),
        next: root.querySelector('.kc-np__next'),
      };

      /* Тонарм вставляется после диска */
      this.els.deck.insertAdjacentHTML('beforeend', tonearmSvg.replace('<svg ', '<svg class="kc-np__tonearm" '));

      this.engine = {
        angle: 0,
        omega: 0,
        time: 0,
        duration: this.tracks[0].duration,
        playing: false,
        held: false,
        barDrag: false,
        pointerId: null,
        visible: true,
        reduced: prefersReduced,
        env: 0,
        scrubOmega: 0,
        pointerAngle: 0,
        center: { x: 0, y: 0 },
        lastMoveAt: 0,
        samples: [],
        cruise: null,
        cruiseAngle: 0,
      };
      this.clockSeconds = 0;
      this.clockDir = 1;
      this.raf = 0;
      this.last = 0;

      this.audio = new Audio();
      this.audio.preload = 'none';
      this.audioState = 'none'; // none → pending → ok | fail

      this.applyTrack(0, false);
      this.bindEvents();
      this.setupVisibility();
    }

    /* Показывает трек i: обложка, акцент, подписи, длительность */
    applyTrack(index, keepPlaying) {
      const e = this.engine;
      const n = this.tracks.length;
      this.trackIndex = ((index % n) + n) % n;
      const track = this.tracks[this.trackIndex];

      e.time = 0;
      e.duration = track.duration;
      if (e.cruise) this.stopCruise();
      this.audio.pause();
      try {
        this.audio.currentTime = 0;
      } catch (err) {
        /* ещё не загружен */
      }
      this.audioState = 'none';

      const host = this.root.closest('.kc-glass') || this.root;
      host.style.setProperty('--now-playing-accent', track.accent || '#f97316');
      this.els.disc.innerHTML = discSvg(track.artwork);
      this.els.title.innerHTML = track.yt
        ? `<a href="${track.yt}" target="_blank" rel="noopener" title="Слушать целиком">${track.title}</a>`
        : track.title;
      this.els.artist.textContent = track.artist;
      this.els.total.textContent = formatTime(e.duration);
      this.els.seek.setAttribute('aria-valuemax', String(e.duration));
      this.els.seek.setAttribute('aria-valuenow', '0');
      this.syncLike();

      if (keepPlaying && e.playing) {
        this.resolvePreview().then(() => {
          if (e.playing) this.startAudio();
        });
      }
      this.wake();
    }

    readLikes() {
      try {
        return JSON.parse(localStorage.getItem('kc-likes') || '{}');
      } catch (e) {
        return {};
      }
    }

    syncLike() {
      if (!this.likeBtn) return;
      const liked = !!this.readLikes()[this.trackIndex];
      this.likeBtn.classList.toggle('is-liked', liked);
      this.likeBtn.setAttribute('aria-pressed', String(liked));
    }

    toggleLike() {
      const likes = this.readLikes();
      likes[this.trackIndex] = !likes[this.trackIndex];
      try {
        localStorage.setItem('kc-likes', JSON.stringify(likes));
      } catch (e) { /* no storage */ }
      this.syncLike();
      if (likes[this.trackIndex] && this.likeBtn) {
        const svg = this.likeBtn.querySelector('svg');
        if (svg) {
          svg.style.animation = 'none';
          void svg.offsetWidth;
          svg.style.animation = '';
        }
      }
    }

    resolvePreview() {
      if (this.audioState !== 'none') return Promise.resolve();
      const track = this.tracks[this.trackIndex];
      this.audioState = 'pending';
      return new Promise((resolve) => {
        deezerSearch(track.query, (data) => {
          const hit = (data && data.data ? data.data : []).find(
            (item) => track.artistRe.test(item.artist.name) && track.titleRe.test(item.title) && item.preview
          );
          if (hit) {
            this.audioState = 'ok';
            this.audio.src = hit.preview;
            this.engine.duration = PREVIEW_DUR;
            this.engine.time = Math.min(this.engine.time, PREVIEW_DUR);
            this.els.total.textContent = formatTime(PREVIEW_DUR);
          } else {
            this.audioState = 'fail';
          }
          resolve();
        });
      });
    }

    startAudio() {
      const audio = this.audio;
      if (this.audioState !== 'ok' || !audio.src) return;
      try {
        audio.currentTime = Math.min(this.engine.time, PREVIEW_DUR - 0.05);
      } catch (e) {
        /* seek до загрузки — начнём с нуля */
      }
      audio.muted = this.engine.held || this.engine.barDrag;
      audio.play().catch(() => {});
    }

    readAngle() {
      const e = this.engine;
      if (e.cruise && e.cruise.currentTime !== null) {
        return e.cruiseAngle + (Number(e.cruise.currentTime) / CRUISE_MS) * 360;
      }
      return e.angle;
    }

    stopCruise() {
      const e = this.engine;
      if (!e.cruise) return;
      e.angle = this.readAngle();
      this.els.disc.style.transform = rotate(e.angle);
      e.cruise.cancel();
      e.cruise = null;
    }

    startCruise() {
      const e = this.engine;
      if (e.cruise || e.reduced || typeof this.els.disc.animate !== 'function') return;
      e.angle %= 360;
      e.cruiseAngle = e.angle;
      e.cruise = this.els.disc.animate(
        [{ transform: rotate(e.angle) }, { transform: rotate(e.angle + 360) }],
        { duration: CRUISE_MS, iterations: Infinity }
      );
      if (!e.visible) e.cruise.pause();
    }

    integrateDisc(dt) {
      const e = this.engine;
      const target = e.playing ? CRUISE : 0;
      if (e.reduced) {
        e.omega = target;
        e.time += e.playing ? dt : 0;
        return;
      }
      if (e.cruise) {
        e.omega = CRUISE;
        e.time += dt;
        return;
      }
      let tau = SPIN_UP_TAU;
      if (Math.abs(e.omega) > Math.abs(target)) {
        tau = e.playing ? COAST_TAU : SPIN_DOWN_TAU;
      }
      e.omega = target + (e.omega - target) * Math.exp(-dt / tau);
      if (Math.abs(e.omega - target) < SETTLE_EPSILON) e.omega = target;
      e.angle += e.omega * dt;
      e.time += trackRate(e.omega) * dt;
      if (e.playing && e.omega === CRUISE) this.startCruise();
    }

    updateMeter(dt) {
      const e = this.engine;
      const target = e.held
        ? clamp(Math.abs(e.scrubOmega) / CRUISE, 0, 1)
        : clamp(Math.abs(e.omega) / CRUISE, 0, 1);
      if (e.reduced) {
        e.env = e.playing ? 1 : 0;
      } else if (target > e.env) {
        e.env = Math.min(target, e.env + dt / BAR_ATTACK_S);
      } else {
        e.env = Math.max(target, e.env - dt / BAR_DECAY_S);
      }
      const t = e.reduced ? 0.37 : e.time;
      this.els.bars.forEach((bar, i) => {
        const level = BAR_REST + (1 - BAR_REST) * barLevel(i, t) * e.env;
        bar.style.transform = `scaleY(${level.toFixed(3)})`;
      });
    }

    rpmLabel() {
      const e = this.engine;
      if (e.held) return `${Math.round(e.scrubOmega / 6)} rpm`;
      if (e.omega === CRUISE) return '33⅓ rpm';
      return `${Math.round(e.omega / 6)} rpm`;
    }

    paint() {
      const e = this.engine;
      if (!e.cruise) this.els.disc.style.transform = rotate(e.angle);
      const p = e.duration > 0 ? clamp(e.time / e.duration, 0, 1) : 0;
      this.els.fill.style.transform = `scaleX(${p.toFixed(4)})`;
      const label = this.rpmLabel();
      if (this.els.rpm.textContent !== label) this.els.rpm.textContent = label;
    }

    handleEnds() {
      const e = this.engine;
      if (e.time >= e.duration) {
        if (e.playing && !e.held && !e.barDrag) {
          /* Песни сменяют друг друга: следующий трек по кругу */
          this.applyTrack(this.trackIndex + 1, true);
          return;
        }
        e.time = e.duration;
      }
      if (e.time < 0) e.time = 0;
    }

    setupVisibility() {
      const e = this.engine;
      let inView = true;
      const sync = () => {
        e.visible = inView && !document.hidden;
        if (e.visible) {
          if (e.cruise) e.cruise.play();
          this.wake();
        } else {
          if (e.cruise) e.cruise.pause();
          cancelAnimationFrame(this.raf);
          this.raf = 0;
        }
      };
      const observer = new IntersectionObserver(
        (entries) => {
          inView = entries[0] ? entries[0].isIntersecting : true;
          sync();
        },
        { threshold: 0.05 }
      );
      observer.observe(this.root);
      document.addEventListener('visibilitychange', sync);

      const media = window.matchMedia('(prefers-reduced-motion: reduce)');
      const syncMotion = () => {
        e.reduced = media.matches;
        if (e.reduced) this.stopCruise();
        this.wake();
      };
      media.addEventListener('change', syncMotion);
    }

    isAwake() {
      const e = this.engine;
      return e.playing || e.held || e.barDrag || e.omega !== 0 || e.env > 0;
    }

    tick = (now) => {
      const e = this.engine;
      const dt = this.last ? Math.min((now - this.last) / 1000, MAX_DT) : 0;
      this.last = now;
      if (e.held) {
        e.scrubOmega *= Math.exp(-dt / HOLD_SETTLE_S);
      } else if (!e.barDrag) {
        this.integrateDisc(dt);
      }
      this.handleEnds();
      /* Аудио — источник истины, пока играет и его не скрабят */
      if (
        this.audioState === 'ok' &&
        this.audio.src &&
        !this.audio.paused &&
        !e.held &&
        !e.barDrag &&
        this.audio.readyState >= 2
      ) {
        e.time = this.audio.currentTime;
      }
      this.updateMeter(dt);
      this.paint();

      const s = Math.floor(e.time);
      if (s !== this.clockSeconds) {
        this.clockDir = s > this.clockSeconds ? 1 : -1;
        this.clockSeconds = s;
        renderClock(this.els.clock, e.time, this.clockDir);
        this.els.seek.setAttribute('aria-valuenow', String(s));
        this.els.seek.setAttribute('aria-valuetext', `${formatTime(e.time)} из ${formatTime(e.duration)}`);
      }

      if (this.isAwake() && e.visible) {
        this.raf = requestAnimationFrame(this.tick);
      } else {
        this.raf = 0;
        this.last = 0;
      }
    };

    wake() {
      this.paint();
      if (this.raf === 0 && this.engine.visible) {
        this.last = 0;
        this.raf = requestAnimationFrame(this.tick);
      }
    }

    togglePlay() {
      const e = this.engine;
      const nextPlaying = !e.playing;
      if (nextPlaying && e.time >= e.duration) e.time = 0;
      e.playing = nextPlaying;
      this.root.classList.toggle('is-playing', nextPlaying);
      this.els.play.setAttribute('aria-label', nextPlaying ? 'Пауза' : 'Слушать');
      this.els.play.innerHTML = nextPlaying
        ? '<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M7 5h4v14H7zM13 5h4v14h-4z"/></svg>'
        : '<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5.14v14l11-7-11-7Z"/></svg>';
      if (nextPlaying) {
        this.resolvePreview().then(() => {
          if (e.playing) this.startAudio();
        });
      } else {
        this.stopCruise();
        this.audio.pause();
      }
      this.wake();
    }

    pointerAngle(clientX, clientY) {
      const e = this.engine;
      const dx = clientX - e.center.x;
      const dy = clientY - e.center.y;
      return { angle: (Math.atan2(dy, dx) * 180) / Math.PI, distance: Math.hypot(dx, dy) };
    }

    onDiscDown = (event) => {
      const e = this.engine;
      if (event.button !== 0 || e.pointerId !== null) return;
      e.pointerId = event.pointerId;
      try { event.currentTarget.setPointerCapture(event.pointerId); } catch (err) {}
      const rect = event.currentTarget.getBoundingClientRect();
      e.center = { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
      this.stopCruise();
      e.held = true;
      e.omega = 0;
      e.scrubOmega = 0;
      const pa = this.pointerAngle(event.clientX, event.clientY);
      e.pointerAngle = pa.angle;
      e.lastMoveAt = performance.now();
      e.samples = [{ t: e.lastMoveAt, a: e.angle }];
      this.audio.muted = true;
      this.wake();
    };

    onDiscMove = (event) => {
      const e = this.engine;
      if (!e.held || e.pointerId !== event.pointerId) return;
      const { angle, distance } = this.pointerAngle(event.clientX, event.clientY);
      if (distance < DEAD_ZONE) {
        e.pointerAngle = angle;
        return;
      }
      let delta = angle - e.pointerAngle;
      delta -= Math.round(delta / 360) * 360;
      e.pointerAngle = angle;

      const now = performance.now();
      const dt = Math.max(now - e.lastMoveAt, 1) / 1000;
      e.lastMoveAt = now;
      const instant = clamp(delta / dt, -MAX_OMEGA, MAX_OMEGA);
      e.scrubOmega += (instant - e.scrubOmega) * 0.35;

      e.angle += delta;
      const audioMax = this.audioState === 'ok' ? PREVIEW_DUR : e.duration;
      e.time = clamp(e.time + (delta / CRUISE) * scrubGain(e.scrubOmega), 0, audioMax);
      if (this.audioState === 'ok' && this.audio.src && this.audio.readyState >= 2) {
        try {
          this.audio.currentTime = e.time;
        } catch (err) {
          /* ignore */
        }
      }

      e.samples.push({ t: now, a: e.angle });
      while (e.samples.length > 2 && now - e.samples[0].t > VELOCITY_WINDOW_MS) e.samples.shift();
      this.els.disc.style.transform = rotate(e.angle);
    };

    onDiscUp = (event) => {
      const e = this.engine;
      if (!e.held || e.pointerId !== event.pointerId) return;
      e.pointerId = null;
      e.held = false;
      const now = performance.now();
      const first = e.samples[0];
      let velocity = 0;
      if (first && now - e.lastMoveAt < STALE_MOVE_MS && now > first.t) {
        velocity = ((e.angle - first.a) / (now - first.t)) * 1000;
      }
      e.omega = e.reduced ? 0 : clamp(velocity, -MAX_OMEGA, MAX_OMEGA);
      e.scrubOmega = 0;
      this.audio.muted = false;
      this.wake();
    };

    seekFromPointer(clientX) {
      const e = this.engine;
      const rail = this.els.rail;
      if (!(rail && rail.parentElement)) return;
      const rect = rail.parentElement.getBoundingClientRect();
      const x = clientX - rect.left;
      const audioMax = this.audioState === 'ok' ? PREVIEW_DUR : e.duration;
      e.time = clamp(x / rect.width, 0, 1) * audioMax;
      if (this.audioState === 'ok' && this.audio.src && this.audio.readyState >= 2) {
        try {
          this.audio.currentTime = e.time;
        } catch (err) {
          /* ignore */
        }
      }
      let over = 0;
      if (x < 0) over = -damp(-x, RUBBER_MAX);
      else if (x > rect.width) over = damp(x - rect.width, RUBBER_MAX);
      const stretch = 1 + Math.abs(over) / rect.width;
      const thin = 1 - (0.35 * Math.abs(over)) / RUBBER_MAX;
      rail.style.transition = 'none';
      rail.style.transformOrigin = over < 0 ? 'right center' : 'left center';
      rail.style.transform = over === 0 ? '' : `scale(${stretch.toFixed(4)}, ${thin.toFixed(3)})`;
      this.wake();
    }

    onBarDown = (event) => {
      const e = this.engine;
      if (event.button !== 0 || e.pointerId !== null) return;
      e.pointerId = event.pointerId;
      try { event.currentTarget.setPointerCapture(event.pointerId); } catch (err) {}
      e.barDrag = true;
      this.audio.muted = true;
      this.seekFromPointer(event.clientX);
    };

    onBarMove = (event) => {
      const e = this.engine;
      if (e.barDrag && e.pointerId === event.pointerId) this.seekFromPointer(event.clientX);
    };

    onBarUp = (event) => {
      const e = this.engine;
      if (!e.barDrag || e.pointerId !== event.pointerId) return;
      e.pointerId = null;
      e.barDrag = false;
      this.audio.muted = false;
      const rail = this.els.rail;
      rail.style.transition = RUBBER_RETURN;
      rail.style.transform = '';
      this.wake();
    };

    onBarKey = (event) => {
      const e = this.engine;
      const targets = {
        ArrowRight: e.time + SEEK_STEP,
        ArrowUp: e.time + SEEK_STEP,
        ArrowLeft: e.time - SEEK_STEP,
        ArrowDown: e.time - SEEK_STEP,
        Home: 0,
        End: e.duration - 1,
      };
      const target = targets[event.key];
      if (target === undefined) return;
      event.preventDefault();
      e.time = clamp(target, 0, e.duration);
      this.wake();
    };

    bindEvents() {
      const d = this.els.disc;
      d.addEventListener('pointerdown', this.onDiscDown);
      d.addEventListener('pointermove', this.onDiscMove);
      d.addEventListener('pointerup', this.onDiscUp);
      d.addEventListener('pointercancel', this.onDiscUp);
      d.addEventListener('lostpointercapture', this.onDiscUp);

      const seek = this.els.seek;
      seek.addEventListener('pointerdown', this.onBarDown);
      seek.addEventListener('pointermove', this.onBarMove);
      seek.addEventListener('pointerup', this.onBarUp);
      seek.addEventListener('pointercancel', this.onBarUp);
      seek.addEventListener('lostpointercapture', this.onBarUp);
      seek.addEventListener('keydown', this.onBarKey);

      this.els.play.addEventListener('click', () => this.togglePlay());
      this.els.prev.addEventListener('click', () => {
        if (this.engine.time > RESTART_THRESHOLD) {
          this.engine.time = 0;
          if (this.audioState === 'ok' && this.audio.src) {
            try {
              this.audio.currentTime = 0;
            } catch (err) {
              /* ignore */
            }
          }
          this.wake();
        } else {
          this.applyTrack(this.trackIndex - 1, true);
        }
      });
      this.els.next.addEventListener('click', () => this.applyTrack(this.trackIndex + 1, true));

      /* Лайк текущего трека (хранится локально) */
      const controls = this.root.querySelector('.kc-np__controls');
      if (controls) {
        this.likeBtn = document.createElement('button');
        this.likeBtn.type = 'button';
        this.likeBtn.className = 'kc-np__btn kc-np__like';
        this.likeBtn.setAttribute('aria-label', 'Понравилось');
        this.likeBtn.setAttribute('aria-pressed', 'false');
        this.likeBtn.innerHTML =
          '<svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>';
        controls.appendChild(this.likeBtn);
        this.likeBtn.addEventListener('click', () => this.toggleLike());
      }
      this.syncLike();
      this.audio.addEventListener('ended', () => {
        this.engine.time = this.engine.duration;
        this.wake();
      });
    }
  }

  const initNowPlaying = () => {
    injectGlassFilter();
    document.querySelectorAll('.kc-np').forEach((root) => new NowPlaying(root));
  };

  /* ============================================================
     CardFlip — визитка с пружиной и физикой щелчка
     ============================================================ */
  const DEG_PER_PX = 0.6;
  const FLIP_STIFFNESS = 170;
  const FLIP_DAMPING = 20;
  const PROJECTION = 0.22;
  const FLICK_SPEED = 450;
  const MAX_HALF_TURNS = 6;
  const DRAG_SLOP = 4;
  const FLIP_LIFT = 36;
  const FLIP_TILT = 6;
  const THICKNESS = 6;
  const SLICES = 7;
  const SLICE_DEPTHS = Array.from(
    { length: SLICES },
    (_, i) => -THICKNESS / 2 + (THICKNESS * (i + 0.5)) / SLICES
  );
  const FLIP_SUBSTEP = 1 / 240;
  const FLIP_VELOCITY_WINDOW = 80;
  const FLIP_INTERACTIVE = 'button, a, input, select, textarea, [data-no-flip]';

  const mod2 = (n) => ((n % 2) + 2) % 2;
  const sideOf = (angle) => mod2(Math.round(angle / 180)) === 1;
  const nearestFace = (angle) => Math.round(angle / 180) * 180;

  const cardTransform = (axis, angle, lift) => {
    const rot = axis === 'y' ? 'rotateY' : 'rotateX';
    return `translateZ(${lift.toFixed(2)}px) ${rot}(${angle.toFixed(2)}deg)`;
  };

  const paintLight = (axis, sin, bands, shades) => {
    const turn = Math.abs(sin);
    const shift = `${(sin * 140).toFixed(1)}%`;
    const transform =
      axis === 'y' ? `translateX(${shift}) rotate(18deg)` : `translateY(${shift}) rotate(72deg)`;
    bands.forEach((band) => {
      if (band) {
        band.style.opacity = (turn * 0.12).toFixed(3);
        band.style.transform = transform;
      }
    });
    shades.forEach((shade) => {
      if (shade) shade.style.opacity = (turn * 0.14).toFixed(3);
    });
  };

  const releaseVelocity = (samples, now) => {
    const last = samples[samples.length - 1];
    if (!last || now - last.t > FLIP_VELOCITY_WINDOW) return 0;
    let first = samples[0];
    for (const p of samples) {
      if (last.t - p.t <= FLIP_VELOCITY_WINDOW) {
        first = p;
        break;
      }
    }
    if (!first || last.t <= first.t) return 0;
    return ((last.a - first.a) / (last.t - first.t)) * 1000;
  };

  class CardFlip {
    constructor(root) {
      this.root = root;
      this.axis = root.dataset.axis || 'y';
      const card = root.querySelector('.kc-flip__card');
      const faces = root.querySelectorAll('.kc-flip__face');

      SLICE_DEPTHS.forEach((z) => {
        const slice = document.createElement('div');
        slice.className = 'kc-flip__slice';
        slice.setAttribute('aria-hidden', 'true');
        slice.style.transform = `translateZ(${z.toFixed(3)}px)`;
        card.insertBefore(slice, faces[0]);
      });

      /* Слои световой полосы и затемнения на каждой стороне */
      faces.forEach((face) => {
        const wrap = document.createElement('div');
        wrap.className = 'kc-flip__bandwrap';
        wrap.setAttribute('aria-hidden', 'true');
        const shade = document.createElement('div');
        shade.className = 'kc-flip__shade';
        const band = document.createElement('div');
        band.className = 'kc-flip__band';
        wrap.append(shade, band);
        face.appendChild(wrap);
      });

      this.el = {
        tilt: root.querySelector('.kc-flip__tilt'),
        card,
        shadow: root.querySelector('.kc-flip__shadow'),
        front: faces[0],
        back: faces[1],
        bands: root.querySelectorAll('.kc-flip__band'),
        shades: root.querySelectorAll('.kc-flip__shade'),
      };

      this.sim = {
        angle: 0,
        velocity: 0,
        target: 0,
        raf: 0,
        last: 0,
        reduceMotion: prefersReduced,
        pointerId: null,
        startX: 0,
        startY: 0,
        startAngle: 0,
        dragging: false,
        samples: [],
      };
      this.flipped = false;
      this.backVisible = false;

      this.el.front.style.transform = `translateZ(${THICKNESS / 2}px)`;
      this.el.back.style.transform = `${this.axis === 'y' ? 'rotateY' : 'rotateX'}(180deg) translateZ(${THICKNESS / 2}px)`;

      this.bindEvents();
      this.render();

      if ('IntersectionObserver' in window && !this.sim.reduceMotion) {
        const once = new IntersectionObserver(
          (entries) => {
            if (entries[0] && entries[0].isIntersecting) {
              once.disconnect();
              this.peek();
            }
          },
          { threshold: 0.55 }
        );
        once.observe(root);
      }
    }

    render() {
      const s = this.sim;
      const rad = (s.angle * Math.PI) / 180;
      const sin = Math.sin(rad);
      const turn = Math.abs(sin);
      const facing = Math.abs(Math.cos(rad));

      this.el.card.style.transform = cardTransform(this.axis, s.angle, turn * FLIP_LIFT);
      const narrow = (0.16 + 0.84 * facing).toFixed(3);
      const soft = (1 - turn * 0.12).toFixed(3);
      this.el.shadow.style.transform =
        this.axis === 'y' ? `scale(${narrow}, ${soft})` : `scale(${soft}, ${narrow})`;
      this.el.shadow.style.opacity = (1 - turn * 0.45).toFixed(3);
      paintLight(this.axis, sin, this.el.bands, this.el.shades);

      const showsBack = sideOf(s.angle);
      if (showsBack !== this.backVisible) {
        this.backVisible = showsBack;
        this.el.front.setAttribute('aria-hidden', String(showsBack));
        this.el.back.setAttribute('aria-hidden', String(!showsBack));
        if ('inert' in this.el.front) {
          this.el.front.inert = showsBack;
          this.el.back.inert = !showsBack;
        }
      }
    }

    step = (now) => {
      const s = this.sim;
      const dt = Math.min(0.05, (now - s.last) / 1000);
      s.last = now;
      const n = Math.max(1, Math.ceil(dt / FLIP_SUBSTEP));
      const h = dt / n;
      for (let i = 0; i < n; i++) {
        const force = -FLIP_STIFFNESS * (s.angle - s.target) - FLIP_DAMPING * s.velocity;
        s.velocity += force * h;
        s.angle += s.velocity * h;
      }
      /* Намёк: почти доехали до 16° — пружиним обратно к 0 */
      if (s.peek && Math.abs(s.angle - s.target) < 1.2 && Math.abs(s.velocity) < 6) {
        s.peek = false;
        s.target = 0;
      }
      if (Math.abs(s.angle - s.target) < 0.05 && Math.abs(s.velocity) < 0.5) {
        s.target = sideOf(s.target) ? 180 : 0;
        s.angle = s.target;
        s.velocity = 0;
        s.raf = 0;
        this.render();
        return;
      }
      this.render();
      s.raf = requestAnimationFrame(this.step);
    };

    settle() {
      const s = this.sim;
      if (s.reduceMotion) {
        cancelAnimationFrame(s.raf);
        s.raf = 0;
        s.target = sideOf(s.target) ? 180 : 0;
        s.angle = s.target;
        s.velocity = 0;
        this.render();
        return;
      }
      if (!s.raf) {
        s.last = performance.now();
        s.raf = requestAnimationFrame(this.step);
      }
    }

    /* Полуфлип-намёк при первом появлении в viewport */
    peek() {
      const s = this.sim;
      s.peek = true;
      s.target = 16;
      this.settle();
    }

    aim(target) {
      this.sim.target = target;
      const next = sideOf(target);
      if (next !== this.flipped) this.flipped = next;
      this.settle();
    }

    flipBy(direction) {
      this.aim(nearestFace(this.sim.target) + 180 * direction);
    }

    setTilt(x, y) {
      if (this.el.tilt) {
        this.el.tilt.style.transform = `rotateX(${(-y * FLIP_TILT).toFixed(2)}deg) rotateY(${(x * FLIP_TILT).toFixed(2)}deg)`;
      }
    }

    hoverTilt(event) {
      if (event.pointerType !== 'mouse' || this.sim.reduceMotion) return;
      const r = this.root.getBoundingClientRect();
      this.setTilt(
        ((event.clientX - r.left) / r.width) * 2 - 1,
        ((event.clientY - r.top) / r.height) * 2 - 1
      );
    }

    onPointerDown = (event) => {
      const s = this.sim;
      if (s.pointerId !== null || event.button !== 0 || event.target.closest(FLIP_INTERACTIVE)) {
        return;
      }
      s.pointerId = event.pointerId;
      s.startX = event.clientX;
      s.startY = event.clientY;
      s.startAngle = s.angle;
      s.dragging = false;
      s.samples = [{ t: event.timeStamp, a: s.angle }];
      try { event.currentTarget.setPointerCapture(event.pointerId); } catch (err) {}
    };

    onPointerMove = (event) => {
      const s = this.sim;
      if (s.pointerId !== event.pointerId) {
        this.hoverTilt(event);
        return;
      }
      const dx = event.clientX - s.startX;
      const dy = event.clientY - s.startY;
      if (!s.dragging) {
        if (Math.hypot(dx, dy) < DRAG_SLOP) return;
        s.dragging = true;
        cancelAnimationFrame(s.raf);
        s.raf = 0;
        s.velocity = 0;
        this.setTilt(0, 0);
      }
      s.angle = s.startAngle + (this.axis === 'y' ? dx : -dy) * DEG_PER_PX;
      s.samples.push({ t: event.timeStamp, a: s.angle });
      if (s.samples.length > 8) s.samples.shift();
      this.render();
    };

    release = (event, cancelled) => {
      const s = this.sim;
      if (s.pointerId !== event.pointerId) return;
      s.pointerId = null;
      if (!s.dragging) {
        if (!cancelled) {
          const r = this.root.getBoundingClientRect();
          const pushed =
            this.axis === 'y'
              ? event.clientX > r.left + r.width / 2
              : event.clientY < r.top + r.height / 2;
          this.flipBy(pushed ? 1 : -1);
        }
        return;
      }
      s.dragging = false;
      const velocity = cancelled ? 0 : releaseVelocity(s.samples, event.timeStamp);
      const from = nearestFace(s.startAngle);
      let target = nearestFace(s.angle + velocity * PROJECTION);
      if (Math.abs(velocity) > FLICK_SPEED && target === from) {
        target = from + 180 * Math.sign(velocity);
      }
      const limit = MAX_HALF_TURNS * 180;
      target = Math.max(from - limit, Math.min(from + limit, target));
      s.velocity = velocity;
      this.aim(target);
    };

    onKeyDown = (event) => {
      if (event.target !== this.root) return;
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        this.flipBy(1);
      }
    };

    bindEvents() {
      this.root.addEventListener('pointerdown', this.onPointerDown);
      this.root.addEventListener('pointermove', this.onPointerMove);
      this.root.addEventListener('pointerup', (e) => this.release(e, false));
      this.root.addEventListener('pointercancel', (e) => this.release(e, true));
      this.root.addEventListener('lostpointercapture', (e) => this.release(e, true));
      this.root.addEventListener('pointerleave', () => {
        if (this.sim.pointerId === null) this.setTilt(0, 0);
      });
      this.root.addEventListener('keydown', this.onKeyDown);
    }
  }

  /* Настоящий QR-код на обороте визитки (qrcode-generator, MIT) */
  const buildQrPath = (text) => {
    if (typeof window.qrcode !== 'function') return null;
    const qr = window.qrcode(0, 'M');
    qr.addData(text);
    qr.make();
    const n = qr.getModuleCount();
    let d = '';
    for (let y = 0; y < n; y++) {
      for (let x = 0; x < n; x++) {
        if (qr.isDark(y, x)) d += `M${x} ${y}h1v1h-1z`;
      }
    }
    return { d, n };
  };

  const initCardFlip = () => {
    const qrSvg = document.querySelector('.vcard__qr svg');
    if (qrSvg) {
      const qr = buildQrPath('https://t.me/CruzITdevv');
      if (qr) {
        qrSvg.querySelector('path').setAttribute('d', qr.d);
        qrSvg.setAttribute('viewBox', `0 0 ${qr.n} ${qr.n}`);
      }
    }
    document.querySelectorAll('.kc-flip').forEach((root) => new CardFlip(root));
  };

  /* ============================================================
     MorphPopover — кнопка, вырастающая в форму отзыва
     ============================================================ */
  class MorphPopover {
    constructor(root) {
      this.root = root;
      this.phase = 'idle';
      this.els = {
        shell: root.querySelector('.kc-morph__shell'),
        idle: root.querySelector('.kc-morph__idle'),
        form: root.querySelector('.kc-morph__form'),
        textarea: root.querySelector('.kc-morph__textarea'),
        send: root.querySelector('.kc-morph__send'),
        sizerIdle: root.querySelector('.kc-morph__sizer--idle'),
        sizerSent: root.querySelector('.kc-morph__sizer--sent'),
        kbd: root.querySelector('.kc-morph__kbd kbd'),
      };
      this.sentTimer = 0;

      if (this.els.kbd && /Mac|iPhone|iPad/.test(navigator.platform)) {
        this.els.kbd.textContent = '⌘';
      }
      this.measure();
      if ('ResizeObserver' in window) {
        const observer = new ResizeObserver(() => this.measure());
        observer.observe(this.els.sizerIdle);
        observer.observe(this.els.sizerSent);
      }

      this.els.idle.addEventListener('click', () => this.open());
      this.els.form.addEventListener('submit', (event) => {
        event.preventDefault();
        this.submit();
      });
      this.els.textarea.addEventListener('input', () => {
        this.els.send.disabled = !this.els.textarea.value.trim() || this.phase === 'sending';
      });
      document.addEventListener('pointerdown', (event) => {
        if (this.phase === 'open' && !root.contains(event.target)) this.close();
      });
      root.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && this.phase === 'open') {
          event.stopPropagation();
          this.close();
        }
        if (event.key === 'Enter' && (event.metaKey || event.ctrlKey)) {
          event.preventDefault();
          this.submit();
        }
      });
    }

    measure() {
      this.idleWidth = (this.els.sizerIdle && this.els.sizerIdle.offsetWidth) || 120;
      this.sentWidth = (this.els.sizerSent && this.els.sizerSent.offsetWidth) || 110;
      this.paintIdle();
    }

    paintIdle() {
      if (this.phase === 'open' || this.phase === 'sending') return;
      this.els.shell.style.width = (this.phase === 'sent' ? this.sentWidth : this.idleWidth) + 'px';
    }

    open() {
      if (this.phase !== 'idle') return;
      clearTimeout(this.sentTimer);
      this.phase = 'open';
      this.root.classList.remove('is-sent', 'is-closing');
      this.root.classList.add('is-expanded');
      const width = Math.min(340, window.innerWidth - 48);
      this.els.shell.style.width = width + 'px';
      this.els.shell.style.height = this.els.form.offsetHeight + 2 + 'px';
      this.els.textarea.value = '';
      this.els.send.disabled = true;
      this.els.textarea.focus({ preventScroll: true });
    }

    close() {
      if (this.phase !== 'open') return;
      this.phase = 'closing';
      this.root.classList.add('is-closing');
      this.els.shell.style.width = this.idleWidth + 'px';
      this.els.shell.style.height = '36px';
      setTimeout(() => {
        this.phase = 'idle';
        this.root.classList.remove('is-expanded', 'is-closing');
        this.els.idle.focus({ preventScroll: true });
      }, 120);
    }

    submit() {
      const text = this.els.textarea.value.trim();
      if (!text || this.phase !== 'open') return;
      this.phase = 'sending';
      this.els.send.disabled = true;
      this.els.send.innerHTML =
        '<svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">' +
        '<circle cx="8" cy="8" r="6" stroke="currentColor" stroke-opacity="0.25" stroke-width="2"/>' +
        '<path d="M14 8a6 6 0 0 0-6-6" stroke="currentColor" stroke-linecap="round" stroke-width="2"/></svg>Отправка';
      const deliver = () => {
        if (FEEDBACK.botToken && FEEDBACK.chatId) {
          return fetch('https://api.telegram.org/bot' + FEEDBACK.botToken + '/sendMessage', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              chat_id: FEEDBACK.chatId,
              text: 'Отзыв с портфолио:\n' + text,
            }),
          }).then((res) => {
            if (!res.ok) throw new Error("send failed");
          });
        }
        /* Демо-режим без бэкенда */
        return new Promise((resolve) => setTimeout(resolve, 700));
      };
      deliver()
        .then(() => {
          this.els.send.innerHTML = 'Отправить';
          this.phase = 'sent';
          this.root.classList.remove('is-expanded');
          this.root.classList.add('is-sent');
          this.els.shell.style.width = this.sentWidth + 'px';
          this.els.shell.style.height = '36px';
          this.sentTimer = setTimeout(() => {
            this.phase = 'idle';
            this.root.classList.remove('is-sent');
            this.paintIdle();
          }, 1600);
        })
        .catch(() => {
          /* Ошибка: возвращаем форму */
          this.els.send.innerHTML = 'Отправить';
          this.phase = 'open';
          this.els.send.disabled = false;
        });
    }
  }

  /* ============================================================
     Инициализация
     ============================================================ */
  const init = () => {
    initSwitchButton();
    initNowPlaying();
    initCardFlip();
    document.querySelectorAll('.kc-morph').forEach((root) => new MorphPopover(root));
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
