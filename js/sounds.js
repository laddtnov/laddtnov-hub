/* ── Cyberpunk click sounds via Web Audio API (no audio files) ── */

let audioCtx = null;
let soundEnabled = false;

function getCtx() {
  if (!audioCtx) {
    audioCtx = new (globalThis.AudioContext || globalThis.webkitAudioContext)();
  }
  return audioCtx;
}

function playBlip({ freq = 660, endFreq, duration = 0.07, volume = 0.12, type = 'square' } = {}) {
  if (!soundEnabled) return;
  try {
    const ctx  = getCtx();
    const osc  = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    if (endFreq) {
      osc.frequency.exponentialRampToValueAtTime(endFreq, ctx.currentTime + duration);
    }
    gain.gain.setValueAtTime(volume, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + duration + 0.01);
  } catch {
    // AudioContext blocked or unsupported — fail silently
  }
}

export function setSoundEnabled(val) {
  soundEnabled = val === 'on';
}

export function initSounds() {
  document.addEventListener('click', (e) => {
    if (!soundEnabled) return;

    const target = e.target.closest('button, a, select');
    if (!target) return;

    if (target.classList.contains('filter-btn')) {
      // Filter click — short high blip
      playBlip({ freq: 880, endFreq: 660, duration: 0.06 });
    } else if (target.classList.contains('project-inspect-btn')) {
      // Inspect modal open — sci-fi open tone
      playBlip({ freq: 440, endFreq: 880, duration: 0.12, type: 'sawtooth', volume: 0.1 });
    } else if (target.classList.contains('project-modal-close') || target.classList.contains('easter-egg-close')) {
      // Close — descending
      playBlip({ freq: 660, endFreq: 330, duration: 0.1 });
    } else if (target.classList.contains('nav-toggle') || target.closest('#navbar a')) {
      // Nav — subtle click
      playBlip({ freq: 550, duration: 0.04, volume: 0.08 });
    } else if (target.classList.contains('setting-btn')) {
      // Settings toggle — quick confirm
      playBlip({ freq: 990, duration: 0.05, volume: 0.09 });
    } else {
      // Default — generic soft blip
      playBlip({ freq: 660, duration: 0.05, volume: 0.08 });
    }
  }, { passive: true });
}
