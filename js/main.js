import { initMotionPreferences } from './motion.js';
import { initUI, initNavToggle, initBackToTop, initPageVisibility, initScrollAnimations, initScrollProgress, initTypewriter, initCustomCursor, initGithubStats, initCopyEmail } from './ui.js';
import { initProjects } from './projects.js';
import { initSettings } from './settings.js';
import { initEasterEgg } from './easter-egg.js';
import { initSounds } from './sounds.js';
import { initContactForm } from './contact.js';
import { initAgent, initPetSwitcher } from './agent.js';
import { on, EVENTS } from './events.js';

function init() {
  initMotionPreferences();
  initUI();
  initNavToggle();
  initBackToTop();
  initScrollProgress();
  initPageVisibility();
  initScrollAnimations();
  initProjects();
  initSettings();    // must run before typewriter — applies body.dataset.motion
  initTypewriter();
  initCustomCursor();
  initEasterEgg();
  initSounds();
  initCopyEmail();
  initGithubStats();
  initContactForm();
  initAgent();
  initPetSwitcher();

  on(EVENTS.NAV_SECTION_CHANGED, ({ sectionId }) => {
    document.body.dataset.activeSection = sectionId;
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init, { once: true });
} else {
  init();
}

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {
      // offline support is a progressive enhancement — ignore registration failures
    });
  });
}
