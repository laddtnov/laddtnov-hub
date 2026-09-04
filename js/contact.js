const API_URL = 'https://laddtnov-hub-contact.fly.dev/api/contact';

const MESSAGES = {
  sending: { en: 'Sending...', ua: 'Надсилання...', es: 'Enviando...' },
  success: {
    en: 'Message sent — thanks! I\'ll get back to you soon.',
    ua: 'Повідомлення надіслано — дякую! Скоро відповім.',
    es: '¡Mensaje enviado, gracias! Te responderé pronto.',
  },
  error: {
    en: 'Something went wrong — please try again or email me directly.',
    ua: 'Щось пішло не так — спробуйте ще раз або напишіть мені напряму.',
    es: 'Algo salió mal — inténtalo de nuevo o escríbeme directamente.',
  },
};

function getLang() {
  try {
    const settings = JSON.parse(localStorage.getItem('_settings'));
    return settings?.lang ?? 'en';
  } catch {
    return 'en';
  }
}

// The API answers with { ok, errors: { name?, email?, message?, _? } }.
// "_" carries whole-request problems (rate limit, bad JSON, send failure).
function firstFieldError(body) {
  const errors = body?.errors;
  if (!errors || typeof errors !== 'object') return null;
  for (const key of ['_', 'name', 'email', 'message']) {
    if (typeof errors[key] === 'string' && errors[key]) return errors[key];
  }
  return null;
}

function setStatus(statusEl, key) {
  const lang = getLang();
  statusEl.textContent = MESSAGES[key][lang] ?? MESSAGES[key].en;
  statusEl.dataset.state = key;
}

export function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  const statusEl = document.getElementById('contact-form-status');
  const submitBtn = form.querySelector('.contact-form-submit');

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const formData = new FormData(form);
    const payload = {
      name: formData.get('name'),
      email: formData.get('email'),
      message: formData.get('message'),
      website: formData.get('website') ?? '', // honeypot — empty for real people
    };

    submitBtn.disabled = true;
    setStatus(statusEl, 'sending');

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        // The API returns a field -> message map. Show it instead of the
        // generic error, so "message is too short" reaches the person who
        // wrote the short message.
        const body = await response.json().catch(() => null);
        const detail = firstFieldError(body);
        if (detail) {
          statusEl.textContent = detail;
          statusEl.dataset.state = 'error';
          return;
        }
        throw new Error('request failed');
      }

      setStatus(statusEl, 'success');
      form.reset();
    } catch {
      setStatus(statusEl, 'error');
    } finally {
      submitBtn.disabled = false;
    }
  });
}
