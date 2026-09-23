/**
 * Light / dark theme.
 
 */
(function initTheme() {
  const STORAGE_KEY = 'coffee-house-theme';
  const root = document.documentElement;

  function readSavedTheme() {
    try {
      return localStorage.getItem(STORAGE_KEY);
    } catch (error) {
      // localStorage may be unavailable (e.g. privacy settings)
      return null;
    }
  }

  function saveTheme(theme) {
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch (error) {
      // Nothing to do: the theme still works for the current page
    }
  }

  function getInitialTheme() {
    const saved = readSavedTheme();

    if (saved === 'light' || saved === 'dark') {
      return saved;
    }

    // No saved choice yet: follow the operating system setting
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  function applyTheme(theme) {
    root.dataset.theme = theme;

    document.querySelectorAll('.theme-switch').forEach((button) => {
      button.setAttribute('aria-pressed', String(theme === 'dark'));
    });
  }

  applyTheme(getInitialTheme());

  document.addEventListener('DOMContentLoaded', () => {
    applyTheme(root.dataset.theme);

    document.querySelectorAll('.theme-switch').forEach((button) => {
      button.addEventListener('click', () => {
        const nextTheme = root.dataset.theme === 'dark' ? 'light' : 'dark';

        applyTheme(nextTheme);
        saveTheme(nextTheme);
      });
    });
  });
})();
