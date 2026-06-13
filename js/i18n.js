const TARGETS = '[data-i18n-ua], [data-i18n-es]';

const HTML_LANG = { ua: 'uk', es: 'es', en: 'en' };

export function applyLanguage(lang) {
  document.querySelectorAll(TARGETS).forEach((el) => {
    if (!el.dataset.i18nEn) {
      el.dataset.i18nEn = el.textContent;
    }

    if (lang === 'ua' && el.dataset.i18nUa) {
      el.textContent = el.dataset.i18nUa;
    } else if (lang === 'es' && el.dataset.i18nEs) {
      el.textContent = el.dataset.i18nEs;
    } else {
      el.textContent = el.dataset.i18nEn;
    }
  });

  document.documentElement.lang = HTML_LANG[lang] ?? 'en';
}
