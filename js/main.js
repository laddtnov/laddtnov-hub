import { initMotionPreferences } from './motion.js';
import { initUI, initNavToggle, initBackToTop, initPageVisibility, initScrollAnimations, initTypewriter, initCustomCursor } from './ui.js';
import { initProjects } from './projects.js';
import { initSettings } from './settings.js';
import { initAnalytics } from './analytics.js';
import { initEasterEgg } from './easter-egg.js';
import { initSounds } from './sounds.js';
import { on, EVENTS } from './events.js';

function init() {
  initMotionPreferences();
  initUI();
  initNavToggle();
  initBackToTop();
  initPageVisibility();
  initScrollAnimations();
  initProjects();
  initSettings();    // must run before typewriter — applies body.dataset.motion
  initTypewriter();
  initCustomCursor();
  initEasterEgg();
  initSounds();
  initAnalytics();

  on(EVENTS.NAV_SECTION_CHANGED, ({ sectionId }) => {
    document.body.dataset.activeSection = sectionId;
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init, { once: true });
} else {
  init();
}
