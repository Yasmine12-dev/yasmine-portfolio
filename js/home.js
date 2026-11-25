// Home page: slides the CTA boarding pass in when it scrolls into view.
// Without JavaScript (or with reduced motion) the pass simply shows.

const cta = document.querySelector('.home-v2-cta');
const calm = matchMedia('(prefers-reduced-motion: reduce)').matches;

if (cta && 'IntersectionObserver' in window && !calm) {
  cta.classList.add('cta-armed');

  const watcher = new IntersectionObserver((entries) => {
    if (entries.some((entry) => entry.isIntersecting)) {
      cta.classList.add('is-in');
      watcher.disconnect();
    }
  }, { threshold: 0.35 });

  watcher.observe(cta);
}
