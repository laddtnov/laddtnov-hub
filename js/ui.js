import { emit, EVENTS } from "./events.js";

/* ── Back-to-top button ─────────────────────────────────────── */
export function initBackToTop() {
  const btn = document.getElementById('back-to-top');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.hidden = window.scrollY < 400;
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ── Pause cyber-grid when tab is hidden (saves battery) ────── */
export function initPageVisibility() {
  const grid = document.querySelector('.cyber-grid');
  if (!grid) return;

  document.addEventListener('visibilitychange', () => {
    grid.style.animationPlayState = document.hidden ? 'paused' : 'running';
  });
}

/* ── Scroll entrance animations (IntersectionObserver) ──────── */
export function initScrollAnimations() {
  const targets = [...document.querySelectorAll('.scroll-animate')];
  if (!targets.length) return;

  // Under reduced-motion (OS or manual), skip animation — reveal immediately
  const prefersReduced = globalThis.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const manualReduced  = document.body.classList.contains('reduced-motion') ||
                         document.body.classList.contains('motion-off');

  if (prefersReduced || manualReduced) {
    targets.forEach(t => t.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target); // fire once, then stop watching
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  targets.forEach(t => observer.observe(t));
}

/* ── Typewriter effect on hero tagline ──────────────────────── */
export function initTypewriter() {
  const el = document.getElementById('hero-tagline');
  if (!el) return;

  const prefersReduced = globalThis.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const manualReduced  = document.body.dataset.motion && document.body.dataset.motion !== 'full';
  if (prefersReduced || manualReduced) return;

  const fullText = el.textContent.trim();
  el.setAttribute('aria-label', fullText); // screen readers get full text immediately
  el.textContent = '';

  const cursor = document.createElement('span');
  cursor.className = 'typewriter-cursor';
  cursor.setAttribute('aria-hidden', 'true');
  cursor.textContent = '|';
  el.appendChild(cursor);

  let i = 0;
  const type = () => {
    if (i < fullText.length) {
      el.insertBefore(document.createTextNode(fullText[i]), cursor);
      i++;
      setTimeout(type, 36);
    } else {
      cursor.classList.add('typewriter-cursor--done');
    }
  };

  setTimeout(type, 700);
}

/* ── Custom neon cursor (fine-pointer / desktop only) ────────── */
export function initCustomCursor() {
  if (!globalThis.matchMedia('(pointer: fine)').matches) return;

  const cursor = document.querySelector('.neon-cursor');
  if (!cursor) return;

  document.addEventListener('mousemove', (e) => {
    cursor.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
  }, { passive: true });

  document.addEventListener('mouseover', (e) => {
    if (e.target.closest('a, button, select, [role="button"]')) {
      cursor.classList.add('neon-cursor--active');
    }
  });

  document.addEventListener('mouseout', (e) => {
    if (e.target.closest('a, button, select, [role="button"]')) {
      cursor.classList.remove('neon-cursor--active');
    }
  });
}

export function initNavToggle() {
  const navbar = document.querySelector("#navbar");
  const toggle = document.querySelector(".nav-toggle");
  const navLinks = document.querySelector(".nav-links");

  if (!navbar || !toggle || !navLinks) return;

  // TODO: implement the hamburger toggle behavior (~8–10 lines)
  //
  // Toggle open/closed on button click
  toggle.addEventListener("click", () => {
    navbar.classList.toggle("nav-open");
    const isOpen = navbar.classList.contains("nav-open");
    toggle.setAttribute("aria-expanded", isOpen);
  });

  // Close the menu when any nav link is clicked (single-page navigation)
  navLinks.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => navbar.classList.remove("nav-open"));
  });
}

export function initUI() {
  const navLinks = [...document.querySelectorAll('.nav-links a[href^="#"]')];
  const sections = navLinks
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);

  if (!sections.length) {
    return;
  }

  const linkBySectionId = new Map(
    navLinks.map((link) => [link.getAttribute("href").slice(1), link])
  );

  const setActiveLink = (sectionId) => {
    navLinks.forEach((link) => link.removeAttribute("aria-current"));
    const activeLink = linkBySectionId.get(sectionId);
    if (activeLink) {
      activeLink.setAttribute("aria-current", "location");
      emit(EVENTS.NAV_SECTION_CHANGED, { sectionId });
    }
  };

  const observer = new IntersectionObserver(
    (entries) => {
      const topVisible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

      if (topVisible?.target?.id) {
        setActiveLink(topVisible.target.id);
      }
    },
    {
      threshold: [0.35, 0.6],
      rootMargin: "-20% 0px -55% 0px",
    }
  );

  sections.forEach((section) => observer.observe(section));
}
