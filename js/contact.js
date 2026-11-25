// Checks the fields, then posts the message to /api/contact (a Vercel function
// that emails it to Gmail). If that fails, it falls back to a mailto link.

const EMAIL = 'yasmiiineeeeb@gmail.com';

const COPY = {
  en: {
    name: 'Please enter your name.',
    email: 'Please enter a valid email address.',
    subject: 'Please add a subject.',
    message: 'Please write a short message.',
    invalid: 'Some fields still need attention.',
    sending: 'Sending...',
    ok: 'Thank you! Your message has been sent. I will reply soon.',
    fallback: 'The message could not be sent, so your email app should open instead. Or write to ',
  },
  fr: {
    name: 'Merci d\'indiquer votre nom.',
    email: 'Merci d\'indiquer une adresse e-mail valide.',
    subject: 'Merci d\'ajouter un objet.',
    message: 'Merci d\'écrire un court message.',
    invalid: 'Certains champs sont encore à compléter.',
    sending: 'Envoi en cours...',
    ok: 'Merci ! Votre message a bien été envoyé. Je vous répondrai bientôt.',
    fallback: 'Le message n\'a pas pu être envoyé, votre messagerie devrait donc s\'ouvrir. Sinon, écrivez à ',
  },
};

const copy = COPY[document.documentElement.lang] || COPY.en;

const isBlank = (field) => field.value.trim() === '';
const isBadEmail = (field) => field.type === 'email' && !/^\S+@\S+\.\S+$/.test(field.value);

document.querySelectorAll('form.mailform').forEach((form) => {
  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const fields = form.querySelectorAll('input:not([type=hidden]):not([name=website]), textarea');
    const status = form.querySelector('.status');
    let valid = true;

    fields.forEach((field) => {
      const invalid = isBlank(field) || isBadEmail(field);
      const message = field.parentElement.querySelector('.err');

      field.setAttribute('aria-invalid', String(invalid));
      if (message) message.textContent = invalid ? copy[field.name] || copy.name : '';
      if (invalid) valid = false;
    });

    if (!valid) {
      status.textContent = copy.invalid;
      return;
    }

    const data = Object.fromEntries(new FormData(form));
    const button = form.querySelector('button[type=submit]');
    button.disabled = true;
    status.textContent = copy.sending;

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error(String(response.status));
      form.reset();
      status.textContent = copy.ok;
    } catch (error) {
      const body = data.message + '\n\n' + data.name + '\n' + data.email;
      status.textContent = copy.fallback + EMAIL + '.';
      location.href = 'mailto:' + EMAIL
        + '?subject=' + encodeURIComponent(data.subject)
        + '&body=' + encodeURIComponent(body);
    } finally {
      button.disabled = false;
    }
  });
});
