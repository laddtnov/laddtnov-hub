// Sentry error monitoring — production only.
// Get a Loader Script URL from Sentry (Settings → Projects → <project> → Client Keys (DSN)
// → Loader Script) and paste it below. Leave as-is to keep monitoring disabled.
const SENTRY_LOADER_URL = '';

const PRODUCTION_HOSTS = ['laddtnov.xyz', 'www.laddtnov.xyz'];

export function initErrorMonitoring() {
  if (!SENTRY_LOADER_URL) return;
  if (!PRODUCTION_HOSTS.includes(location.hostname)) return;

  const script = document.createElement('script');
  script.src = SENTRY_LOADER_URL;
  script.crossOrigin = 'anonymous';
  document.head.appendChild(script);
}
