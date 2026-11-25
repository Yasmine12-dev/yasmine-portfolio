// Mobile menu toggle, and the "you are here" marker in the nav.

const burger = document.querySelector('.burger');
const menu = document.getElementById('menu');

if (burger && menu) {
  const closeMenu = () => {
    menu.classList.remove('open');
    burger.setAttribute('aria-expanded', 'false');
  };

  burger.addEventListener('click', () => {
    const open = menu.classList.toggle('open');
    burger.setAttribute('aria-expanded', String(open));
  });

  // Tapping a link or pressing Escape should leave the menu closed.
  menu.addEventListener('click', (event) => {
    if (event.target.closest('a')) closeMenu();
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeMenu();
  });
}

const currentPage = location.pathname.split('/').pop() || 'index.html';

document.querySelectorAll('#menu a').forEach((link) => {
  if (link.getAttribute('href') === currentPage) {
    link.setAttribute('aria-current', 'page');
  }
});
