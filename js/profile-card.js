// About page profile card: a gentle 3D tilt and a light that follows the pointer.
// Skipped on touch screens and for people who prefer reduced motion.

const card = document.querySelector('[data-tilt]');
const canHover = matchMedia('(hover: hover) and (pointer: fine)').matches;
const calm = matchMedia('(prefers-reduced-motion: reduce)').matches;

if (card && canHover && !calm) {
  const art = card.querySelector('.about-v2-monogram');
  const MAX = 6; // degrees

  card.addEventListener('pointermove', (event) => {
    const box = card.getBoundingClientRect();
    const x = (event.clientX - box.left) / box.width;
    const y = (event.clientY - box.top) / box.height;

    card.style.setProperty('--ry', ((x - 0.5) * 2 * MAX).toFixed(2) + 'deg');
    card.style.setProperty('--rx', ((0.5 - y) * 2 * MAX).toFixed(2) + 'deg');

    if (art) {
      const a = art.getBoundingClientRect();
      art.style.setProperty('--mx', (event.clientX - a.left) + 'px');
      art.style.setProperty('--my', (event.clientY - a.top) + 'px');
    }
  });

  card.addEventListener('pointerleave', () => {
    card.style.setProperty('--rx', '0deg');
    card.style.setProperty('--ry', '0deg');
  });
}
