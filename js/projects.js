// "View project" opens a window with the full project details.
// The native <dialog> element handles focus and the Escape key.

const openModal = (dialog) => {
  dialog.showModal();
  document.body.classList.add('modal-open');
};

document.querySelectorAll('[data-modal]').forEach((button) => {
  const dialog = document.getElementById(button.dataset.modal);
  if (dialog) button.addEventListener('click', () => openModal(dialog));
});

document.querySelectorAll('.project-modal').forEach((dialog) => {
  dialog.addEventListener('close', () => document.body.classList.remove('modal-open'));

  dialog.addEventListener('click', (event) => {
    // A click on the dark backdrop lands on the dialog itself.
    if (event.target === dialog || event.target.closest('[data-close]')) dialog.close();
  });
});
