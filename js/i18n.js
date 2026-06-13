const TARGETS = '[data-i18n-ua]';

export function applyLanguage(lang) {
  document.querySelectorAll(TARGETS).forEach((el) => {
    if (!el.dataset.i18nEn) {
      el.dataset.i18nEn = el.textContent;
    }
    el.textContent = lang === 'ua' ? el.dataset.i18nUa : el.dataset.i18nEn;
  });

  document.documentElement.lang = lang === 'ua' ? 'uk' : 'en';
}
