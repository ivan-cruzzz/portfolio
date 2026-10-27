/* ============================================================
   Ivan Cruz — портфолио
   Микро-взаимодействия (js/fx.js):
     - плавный скролл по якорям (мягкая кривая ~1.1 с)
     - магнитные чипы стека
     - кнопка «Резюме (PDF)» → печать
     - копирование @CruzITdev
   Всё отключается при prefers-reduced-motion.
   ============================================================ */

(() => {
  'use strict';

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- 1. Плавный скролл по якорям ---------- */
  const initSmoothScroll = () => {
    if (reduced) return;

    /* Анимируем сами: нативный smooth конфликтует с rAF-анимацией */
    document.documentElement.style.scrollBehavior = 'auto';

    const easeInOutQuint = (t) =>
      t < 0.5 ? 16 * t * t * t * t * t : 1 - Math.pow(-2 * t + 2, 5) / 2;

    let raf = 0;
    const scrollToY = (targetY, duration = 1100) => {
      cancelAnimationFrame(raf);
      const startY = window.scrollY;
      const delta = targetY - startY;
      if (Math.abs(delta) < 2) return;
      const t0 = performance.now();
      const step = (now) => {
        const p = Math.min(1, (now - t0) / duration);
        window.scrollTo(0, startY + delta * easeInOutQuint(p));
        if (p < 1) raf = requestAnimationFrame(step);
      };
      raf = requestAnimationFrame(step);
    };
    /* Ручной скролл мгновенно прерывает анимацию */
    window.addEventListener('wheel', () => cancelAnimationFrame(raf), { passive: true });
    window.addEventListener('touchstart', () => cancelAnimationFrame(raf), { passive: true });

    document.querySelectorAll('a[href^="#"]').forEach((link) => {
      link.addEventListener('click', (event) => {
        const id = link.getAttribute('href');
        if (!id || id.length < 2) return;
        const target = document.querySelector(id);
        if (!target) return;
        event.preventDefault();
        const y = target.getBoundingClientRect().top + window.scrollY - 16;
        scrollToY(Math.max(0, y));
        history.pushState(null, '', id);
      });
    });
  };

  /* ---------- 2. Магнитные чипы стека ---------- */
  const initMagneticChips = () => {
    if (reduced) return;
    const list = document.querySelector('.stack-chips');
    if (!list || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

    const chips = Array.from(list.querySelectorAll('li')).map((el) => ({
      el,
      x: 0,
      y: 0,
      tx: 0,
      ty: 0,
    }));
    const RADIUS = 130;
    const PULL = 14;
    let raf = 0;

    const tick = () => {
      let alive = false;
      chips.forEach((chip) => {
        chip.x += (chip.tx - chip.x) * 0.14;
        chip.y += (chip.ty - chip.y) * 0.14;
        if (Math.abs(chip.tx - chip.x) > 0.05 || Math.abs(chip.ty - chip.y) > 0.05) alive = true;
        chip.el.style.transform = `translate(${chip.x.toFixed(2)}px, ${chip.y.toFixed(2)}px)`;
      });
      raf = alive ? requestAnimationFrame(tick) : 0;
    };

    const wake = () => {
      if (!raf) raf = requestAnimationFrame(tick);
    };

    list.addEventListener('pointermove', (event) => {
      chips.forEach((chip) => {
        const rect = chip.el.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = event.clientX - cx;
        const dy = event.clientY - cy;
        const dist = Math.hypot(dx, dy);
        if (dist < RADIUS) {
          const force = (1 - dist / RADIUS) * PULL;
          chip.tx = (dx / (dist || 1)) * force;
          chip.ty = (dy / (dist || 1)) * force;
        } else {
          chip.tx = 0;
          chip.ty = 0;
        }
      });
      wake();
    });

    list.addEventListener('pointerleave', () => {
      chips.forEach((chip) => {
        chip.tx = 0;
        chip.ty = 0;
      });
      wake();
    });
  };

  /* ---------- 3. Резюме (печать в PDF) ---------- */
  const initPrint = () => {
    const btn = document.getElementById('print-resume');
    if (!btn) return;
    btn.addEventListener('click', () => window.print());
  };

  /* ---------- 4. Копирование Telegram ---------- */
  const initCopy = () => {
    const chip = document.getElementById('copy-tg');
    if (!chip) return;
    let timer = 0;
    chip.addEventListener('click', async () => {
      const value = 'https://t.me/CruzITdevv';
      try {
        await navigator.clipboard.writeText(value);
      } catch (e) {
        /* fallback для старых браузеров */
        const area = document.createElement('textarea');
        area.value = value;
        area.style.position = 'fixed';
        area.style.opacity = '0';
        document.body.appendChild(area);
        area.select();
        try {
          document.execCommand('copy');
        } catch (err) { /* ignore */ }
        area.remove();
      }
      chip.classList.add('is-copied');
      clearTimeout(timer);
      timer = setTimeout(() => chip.classList.remove('is-copied'), 1600);
    });
  };

  const init = () => {
    initSmoothScroll();
    initMagneticChips();
    initPrint();
    initCopy();
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
