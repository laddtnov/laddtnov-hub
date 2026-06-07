import { emit, EVENTS } from "./events.js";

export function initMotionPreferences() {
  const motionQuery = globalThis.matchMedia("(prefers-reduced-motion: reduce)");

  const applyMotionPreference = () => {
    const reduced = motionQuery.matches;
    document.body.classList.toggle("reduced-motion", reduced);
    emit(EVENTS.MOTION_CHANGED, { reduced });
  };

  applyMotionPreference();
  motionQuery.addEventListener("change", applyMotionPreference);
}
