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
    };

    submitBtn.disabled = true;
    setStatus(statusEl, 'sending');

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error('request failed');

      setStatus(statusEl, 'success');
      form.reset();
    } catch {
      setStatus(statusEl, 'error');
    } finally {
      submitBtn.disabled = false;
    }
  });
}
