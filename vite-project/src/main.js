import './input.css'
import './style.css'
import javascriptLogo from './javascript.svg'
import viteLogo from '/vite.svg'
import { setupCounter } from './counter.js'

document.querySelector('#app').innerHTML = `
  <div>
    <a href="https://vite.dev" target="_blank">
      <img src="${viteLogo}" class="logo" alt="Vite logo" />
    </a>
    <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript" target="_blank">
      <img src="${javascriptLogo}" class="logo vanilla" alt="JavaScript logo" />
    </a>
    <h1>Hello Vite!</h1>
    <div class="card">
      <button id="counter" type="button"></button>
    </div>
    <p class="read-the-docs">
      Click on the Vite logo to learn more
    </p>
  </div>
`

setupCounter(document.querySelector('#counter'))

/* =========================
   Lightweight scroll-reveal & project tilt
   Paste this at the bottom of main.js
   ========================= */

/* ===== lightweight scroll-reveal (uses IntersectionObserver) ===== */
(function () {
  // Respect reduced motion
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('is-visible')
        io.unobserve(e.target)
      }
    })
  }, { root: null, rootMargin: '0px 0px -8% 0px', threshold: 0.12 })

  document.querySelectorAll('.reveal').forEach(el => io.observe(el))
})()

/* ===== project card tilt (mouse move) ===== */
(function () {
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const cards = document.querySelectorAll('.proj-card')
  cards.forEach(card => {
    const inner = card.querySelector('.proj-card-inner')
    if (!inner) return

    // pointer move handler
    function onMove(e) {
      const r = card.getBoundingClientRect()
      const clientX = e.touches ? e.touches[0].clientX : e.clientX
      const clientY = e.touches ? e.touches[0].clientY : e.clientY
      const px = (clientX - r.left) / r.width
      const py = (clientY - r.top) / r.height
      const rotY = (px - 0.5) * -12
      const rotX = (py - 0.5) * 8
      inner.style.transform = `translateY(-6px) rotateX(${rotX}deg) rotateY(${rotY}deg)`
    }

    function onLeave() {
      inner.style.transform = ''
    }

    card.addEventListener('mousemove', onMove)
    card.addEventListener('mouseleave', onLeave)

    // touch fallback: small lift on touchstart
    card.addEventListener('touchstart', () => { inner.style.transform = 'translateY(-6px)' }, { passive: true })
    card.addEventListener('touchend', () => { inner.style.transform = '' }, { passive: true })
  })
})()
// Robust modern theme toggle — works with Tailwind dark: 'class'
(function () {
  const btn = document.getElementById('theme-toggle');
  if (!btn) return;

  function applyTheme(isDark) {
    document.documentElement.classList.toggle('dark', isDark);
    btn.setAttribute('aria-pressed', isDark ? 'true' : 'false');
    btn.dataset.theme = isDark ? 'dark' : 'light';
  }

  // read saved preference, otherwise use system preference
  const saved = localStorage.getItem('theme');
  if (saved === 'dark' || saved === 'light') {
    applyTheme(saved === 'dark');
  } else {
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    applyTheme(!!prefersDark);
  }

  // toggle on click
  btn.addEventListener('click', () => {
    const nowDark = !document.documentElement.classList.contains('dark');
    applyTheme(nowDark);
    localStorage.setItem('theme', nowDark ? 'dark' : 'light');
  });

  // keyboard support (Enter/Space)
  btn.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      btn.click();
    }
  });

  // system preference changes (only update UI if user hasn't explicitly chosen)
  const mq = window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null;
  if (mq && mq.addEventListener) {
    mq.addEventListener('change', (e) => {
      if (!localStorage.getItem('theme')) applyTheme(e.matches);
    });
  }
})();
