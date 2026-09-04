export function initMotionPreferences() {
  const motionQuery = globalThis.matchMedia("(prefers-reduced-motion: reduce)");

  const applyMotionPreference = () => {
    const reduced = motionQuery.matches;
    document.body.classList.toggle("reduced-motion", reduced);
  };

  applyMotionPreference();
  motionQuery.addEventListener("change", applyMotionPreference);
}
