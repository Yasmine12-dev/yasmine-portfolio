// Light / dark switch. A small inline script in <head> picks the starting theme
// before the stylesheet loads, so the page never flashes the wrong colours.

const button = document.querySelector('.theme');

const LABELS = {
  en: { dark: 'Switch to light theme', light: 'Switch to dark theme' },
  fr: { dark: 'Passer au thème clair', light: 'Passer au thème sombre' },
};

const labels = LABELS[document.documentElement.lang] || LABELS.en;

if (button) {
  const apply = (theme) => {
    document.documentElement.dataset.theme = theme;
    button.setAttribute('aria-label', theme === 'dark' ? labels.dark : labels.light);
  };

  apply(document.documentElement.dataset.theme);

  button.addEventListener('click', () => {
    const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
    apply(next);

    try {
      localStorage.setItem('theme', next);
    } catch (error) {
      // Private browsing can refuse storage; the theme still applies for this page.
    }
  });
}
