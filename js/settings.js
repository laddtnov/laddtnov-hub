import { emit, EVENTS } from './events.js';
import { setSoundEnabled } from './sounds.js';

const STORAGE_KEY = '_settings';

const defaults = { crt: '0', motion: 'full', sound: 'off', theme: 'dark' };

function load() {
  try {
    return { ...defaults, ...JSON.parse(localStorage.getItem(STORAGE_KEY)) };
  } catch {
    return { ...defaults };
  }
}

function save(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // private mode or quota exceeded — settings not persisted
  }
}

function applyCrt(value) {
  document.documentElement.style.setProperty('--crt-intensity', value);
}

function applyMotion(value) {
  document.body.dataset.motion = value;
  emit(EVENTS.MOTION_CHANGED, { reduced: value !== 'full' });
}

function applyTheme(value) {
  if (value === 'light') {
    document.documentElement.dataset.theme = 'light';
  } else {
    delete document.documentElement.dataset.theme;
  }
}

function syncButtons(panel, state) {
  panel.querySelectorAll('.setting-btn').forEach((btn) => {
    const { setting, value } = btn.dataset;
    let active = false;
    if (setting === 'crt')         active = value === state.crt;
    else if (setting === 'motion') active = value === state.motion;
    else if (setting === 'sound')  active = value === state.sound;
    else if (setting === 'theme')  active = value === state.theme;
    btn.classList.toggle('is-active', active);
    btn.setAttribute('aria-pressed', String(active));
  });
}

export function initSettings() {
  const panel = document.getElementById('settings-panel');
  const toggle = document.getElementById('settings-toggle');
  const content = document.getElementById('settings-content');

  if (!panel || !toggle || !content) return;

  const state = load();
  applyCrt(state.crt);
  applyMotion(state.motion);
  applyTheme(state.theme);
  setSoundEnabled(state.sound);
  syncButtons(panel, state);

  toggle.addEventListener('click', () => {
    const open = content.hidden;
    content.hidden = !open;
    toggle.setAttribute('aria-expanded', String(open));
  });

  document.addEventListener('click', (e) => {
    if (!panel.contains(e.target) && !content.hidden) {
      content.hidden = true;
      toggle.setAttribute('aria-expanded', 'false');
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !content.hidden) {
      content.hidden = true;
      toggle.setAttribute('aria-expanded', 'false');
      toggle.focus();
    }
  });

  panel.addEventListener('click', (e) => {
    const btn = e.target.closest('.setting-btn');
    if (!btn) return;

    const { setting, value } = btn.dataset;
    if (setting === 'crt') {
      state.crt = value;
      applyCrt(value);
    } else if (setting === 'motion') {
      state.motion = value;
      applyMotion(value);
    } else if (setting === 'sound') {
      state.sound = value;
      setSoundEnabled(value);
    } else if (setting === 'theme') {
      state.theme = value;
      applyTheme(value);
    }

    save(state);
    syncButtons(panel, state);
  });
}
