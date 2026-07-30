/* ============================================================
   Hijdra Advies & Projectmanagement
   Interactie: navigatie, onthulling, jaartal, config-injectie
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  const cfg = window.HIJDRA_CONFIG || {};

  /* --- Config-injectie: teksten en links op één plek beheren --- */
  document.querySelectorAll('[data-config-tekst]').forEach((el) => {
    const sleutel = el.dataset.configTekst;
    if (cfg[sleutel]) el.textContent = cfg[sleutel];
  });
  document.querySelectorAll('[data-config-href]').forEach((el) => {
    const sleutel = el.dataset.configHref;
    if (cfg[sleutel]) el.href = cfg[sleutel];
  });
  document.querySelectorAll('[data-config-mailto]').forEach((el) => {
    if (cfg.email) el.href = 'mailto:' + cfg.email;
  });
  document.querySelectorAll('[data-config-tel]').forEach((el) => {
    if (cfg.telefoon) el.href = 'tel:' + cfg.telefoon.replace(/\s+/g, '');
  });
  /* Rijen die pas verschijnen zodra het gegeven is ingevuld */
  document.querySelectorAll('[data-config-rij]').forEach((el) => {
    const sleutel = el.dataset.configRij;
    if (cfg[sleutel]) el.hidden = false;
  });

  /* --- Jaartal in footer --- */
  const jaarEl = document.getElementById('jaar');
  if (jaarEl) jaarEl.textContent = new Date().getFullYear();

  /* --- Navigatie: achtergrond bij scrollen --- */
  const nav = document.getElementById('nav');
  const bijScroll = () => nav.classList.toggle('nav--gescrold', window.scrollY > 40);
  bijScroll();
  window.addEventListener('scroll', bijScroll, { passive: true });

  /* --- Mobiel menu --- */
  const toggle = document.getElementById('navToggle');
  if (toggle) {
    toggle.addEventListener('click', () => {
      const open = nav.classList.toggle('nav--open');
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Menu sluiten' : 'Menu openen');
    });
    nav.querySelectorAll('.nav__links a').forEach((link) =>
      link.addEventListener('click', () => {
        nav.classList.remove('nav--open');
        toggle.setAttribute('aria-expanded', 'false');
      })
    );
  }

  /* --- Subtiele onthulling bij scrollen --- */
  const beperkt = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const elementen = document.querySelectorAll('.onthul');
  if (!beperkt && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('zichtbaar');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -6% 0px' }
    );
    elementen.forEach((el) => io.observe(el));
  } else {
    elementen.forEach((el) => el.classList.add('zichtbaar'));
  }
});
