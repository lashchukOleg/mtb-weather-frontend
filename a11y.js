const A11Y_STORAGE_KEYS = {
  contrast: 'a11y_high_contrast',
  fontScale: 'a11y_font_scale',
};

const FONT_SCALE = {
  min: 0.9,
  max: 1.5,
  step: 0.1,
  default: 1,
};

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function readBool(key, fallback = false) {
  const raw = localStorage.getItem(key);
  if (raw === null) return fallback;
  return raw === '1';
}

function writeBool(key, value) {
  localStorage.setItem(key, value ? '1' : '0');
}

function readNumber(key, fallback) {
  const raw = localStorage.getItem(key);
  if (raw === null) return fallback;
  const parsed = Number(raw);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function writeNumber(key, value) {
  localStorage.setItem(key, String(value));
}

function applyContrast(enabled) {
  document.documentElement.classList.toggle('theme-hc', enabled);
}

function applyFontScale(scale) {
  const normalized = clamp(scale, FONT_SCALE.min, FONT_SCALE.max);
  document.documentElement.style.setProperty('--font-scale', String(normalized));
}

function createButton({ label, title, ariaLabel, onClick }) {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'a11y-btn';
  button.textContent = label;
  if (title) button.title = title;
  if (ariaLabel) button.setAttribute('aria-label', ariaLabel);
  button.addEventListener('click', onClick);
  return button;
}

function ensureA11yControls() {
  const navList = document.querySelector('.main-header nav ul');
  if (!navList) return;
  if (navList.querySelector('.a11y-controls')) return;

  const li = document.createElement('li');
  const controls = document.createElement('div');
  controls.className = 'a11y-controls';

  let contrastEnabled = readBool(A11Y_STORAGE_KEYS.contrast, false);
  let fontScale = readNumber(A11Y_STORAGE_KEYS.fontScale, FONT_SCALE.default);

  applyContrast(contrastEnabled);
  applyFontScale(fontScale);

  const contrastButton = createButton({
    label: 'Contrast',
    title: 'High contrast mode',
    ariaLabel: 'Toggle high contrast mode',
    onClick: () => {
      contrastEnabled = !contrastEnabled;
      writeBool(A11Y_STORAGE_KEYS.contrast, contrastEnabled);
      applyContrast(contrastEnabled);
      contrastButton.setAttribute('aria-pressed', contrastEnabled ? 'true' : 'false');
    },
  });
  contrastButton.setAttribute('aria-pressed', contrastEnabled ? 'true' : 'false');

  const decreaseButton = createButton({
    label: 'A-',
    title: 'Decrease text size',
    ariaLabel: 'Decrease text size',
    onClick: () => {
      fontScale = clamp(Number((fontScale - FONT_SCALE.step).toFixed(2)), FONT_SCALE.min, FONT_SCALE.max);
      writeNumber(A11Y_STORAGE_KEYS.fontScale, fontScale);
      applyFontScale(fontScale);
    },
  });

  const resetButton = createButton({
    label: 'A',
    title: 'Reset text size',
    ariaLabel: 'Reset text size',
    onClick: () => {
      fontScale = FONT_SCALE.default;
      writeNumber(A11Y_STORAGE_KEYS.fontScale, fontScale);
      applyFontScale(fontScale);
    },
  });

  const increaseButton = createButton({
    label: 'A+',
    title: 'Increase text size',
    ariaLabel: 'Increase text size',
    onClick: () => {
      fontScale = clamp(Number((fontScale + FONT_SCALE.step).toFixed(2)), FONT_SCALE.min, FONT_SCALE.max);
      writeNumber(A11Y_STORAGE_KEYS.fontScale, fontScale);
      applyFontScale(fontScale);
    },
  });

  controls.append(contrastButton, decreaseButton, resetButton, increaseButton);
  li.appendChild(controls);
  navList.appendChild(li);
}

function ensureResponsiveNav() {
  const header = document.querySelector('.main-header');
  if (!header) return;

  const nav = header.querySelector('nav.container');
  if (!nav) return;

  const navList = nav.querySelector('ul');
  if (!navList) return;

  if (!navList.id) navList.id = 'site-nav';

  let toggle = nav.querySelector('.nav-toggle');
  if (!toggle) {
    toggle = document.createElement('button');
    toggle.type = 'button';
    toggle.className = 'nav-toggle';
    toggle.setAttribute('aria-controls', navList.id);
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Toggle navigation menu');
    toggle.innerHTML = '<span></span><span></span><span></span>';
    nav.insertBefore(toggle, navList);
  }

  function isMobileLayout() {
    return window.matchMedia('(max-width: 800px)').matches;
  }

  function setOpen(open) {
    header.classList.toggle('nav-open', open);
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  }

  toggle.addEventListener('click', () => {
    setOpen(!header.classList.contains('nav-open'));
  });

  navList.addEventListener('click', (e) => {
    const target = e.target;
    if (!(target instanceof Element)) return;
    if (target.closest('a') && isMobileLayout()) setOpen(false);
  });

  window.addEventListener('resize', () => {
    if (!isMobileLayout()) setOpen(false);
  });

  setOpen(false);
}

document.addEventListener('DOMContentLoaded', () => {
  try {
    ensureResponsiveNav();
    ensureA11yControls();
  } catch (_) {
  }
});
