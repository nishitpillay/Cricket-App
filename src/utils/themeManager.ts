export type ThemeMode = 'day' | 'night';

const THEME_STORAGE_KEY = 'pitch_precision_theme';

export function getStoredTheme(): ThemeMode {
  try {
    const saved = localStorage.getItem(THEME_STORAGE_KEY);
    if (saved === 'day' || saved === 'night') {
      return saved;
    }
  } catch (e) {
    console.warn('Could not read theme from localStorage', e);
  }
  return 'night';
}

export function applyTheme(theme: ThemeMode): void {
  try {
    const root = document.documentElement;
    const body = document.body;

    if (theme === 'day') {
      root.classList.add('day-mode');
      root.classList.remove('night-mode');
      root.setAttribute('data-theme', 'day');

      if (body) {
        body.classList.add('day-mode');
        body.classList.remove('night-mode');
        body.style.backgroundColor = '#f8fafc';
        body.style.color = '#0f172a';
      }
    } else {
      root.classList.remove('day-mode');
      root.classList.add('night-mode');
      root.setAttribute('data-theme', 'night');

      if (body) {
        body.classList.remove('day-mode');
        body.classList.add('night-mode');
        body.style.backgroundColor = '#131313';
        body.style.color = '#e5e2e1';
      }
    }

    window.dispatchEvent(new CustomEvent('pitch_precision_theme_change', { detail: { theme } }));
  } catch (e) {
    console.warn('Error applying theme', e);
  }
}

export function setStoredTheme(theme: ThemeMode): void {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch (e) {
    console.warn('Could not save theme to localStorage', e);
  }
  applyTheme(theme);
}

export function toggleStoredTheme(): ThemeMode {
  const current = getStoredTheme();
  const next: ThemeMode = current === 'day' ? 'night' : 'day';
  setStoredTheme(next);
  return next;
}
