const KONAMI = [
  'ArrowUp','ArrowUp',
  'ArrowDown','ArrowDown',
  'ArrowLeft','ArrowRight',
  'ArrowLeft','ArrowRight',
  'b','a',
];

export function initEasterEgg() {
  let seq = [];

  document.addEventListener('keydown', (e) => {
    seq.push(e.key);
    if (seq.length > KONAMI.length) seq.shift();
    if (seq.join(',') === KONAMI.join(',')) {
      seq = [];
      triggerEasterEgg();
    }
  });
}

function makeEl(tag, cls, text) {
  const el = document.createElement(tag);
  if (cls) el.className = cls;
  if (text) el.textContent = text;
  return el;
}

function triggerEasterEgg() {
  if (document.querySelector('.easter-egg-overlay')) return;

  const overlay = document.createElement('div');
  overlay.className = 'easter-egg-overlay';
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-modal', 'true');
  overlay.setAttribute('aria-label', 'Secret unlocked');

  const content = makeEl('div', 'easter-egg-content');

  const title = makeEl('p', 'easter-egg-title', 'ACCESS GRANTED');
  title.dataset.text = 'ACCESS GRANTED';

  const sub  = makeEl('p', 'easter-egg-sub',  '>_ KONAMI SEQUENCE ACCEPTED');
  const msg  = makeEl('p', 'easter-egg-msg');
  msg.textContent = 'Hello, curious one. You found the secret.';
  const br1  = document.createElement('br');
  const br2  = document.createElement('br');
  const flag = document.createTextNode('\u{1F1FA}\u{1F1E6}  Слава Україні');
  msg.append(br1, br2, flag);

  const closeBtn = makeEl('button', 'easter-egg-close', '[ CLOSE TRANSMISSION ]');
  closeBtn.type = 'button';

  content.append(title, sub, msg, closeBtn);
  overlay.appendChild(content);
  document.body.appendChild(overlay);

  closeBtn.focus();

  const dismiss = () => {
    overlay.classList.add('easter-egg-overlay--out');
    overlay.addEventListener('animationend', () => overlay.remove(), { once: true });
    document.removeEventListener('keydown', onKey);
  };

  const onKey = (e) => { if (e.key === 'Escape') dismiss(); };

  closeBtn.addEventListener('click', dismiss);
  document.addEventListener('keydown', onKey);
  setTimeout(dismiss, 12000);
}
