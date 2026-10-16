(() => {
  'use strict';
  const menuButton = document.querySelector('#menu-toggle');
  const menu = document.querySelector('#mobile-menu');
  const nav = document.querySelector('.site-nav');
  const closeMenu = () => {
    if (!menu || !menuButton) return;
    menu.classList.add('hidden');
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.setAttribute('aria-label', 'Open navigation menu');
  };

  if (menuButton && menu) {
    menuButton.addEventListener('click', () => {
      const open = menuButton.getAttribute('aria-expanded') !== 'true';
      menu.classList.toggle('hidden', !open);
      menuButton.setAttribute('aria-expanded', String(open));
      menuButton.setAttribute('aria-label', open ? 'Close navigation menu' : 'Open navigation menu');
    });
    menu.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape' && menuButton.getAttribute('aria-expanded') === 'true') {
        closeMenu();
        menuButton.focus();
      }
    });
    document.addEventListener('click', event => {
      if (menuButton.getAttribute('aria-expanded') === 'true' && !menu.contains(event.target) && !menuButton.contains(event.target)) closeMenu();
    });
  }

  const updateNav = () => nav?.classList.toggle('is-scrolled', window.scrollY > 16);
  updateNav();
  window.addEventListener('scroll', updateNav, { passive: true });

  const revealItems = document.querySelectorAll('.reveal:not(.is-visible)');
  if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    }), { threshold: 0.12 });
    revealItems.forEach(item => observer.observe(item));
  } else revealItems.forEach(item => item.classList.add('is-visible'));

  const year = document.querySelector('#year');
  if (year) year.textContent = String(new Date().getFullYear());

  const form = document.querySelector('#contact-form');
  if (!form) return;
  const submitButton = form.querySelector('#submit-button');
  const status = form.querySelector('#form-status');
  const errorMap = { name: 'name-error', email: 'email-error', service: 'service-error', details: 'details-error', consent: 'consent-error' };
  const fields = Object.keys(errorMap).map(name => form.elements.namedItem(name));

  const validateField = field => {
    const error = document.getElementById(errorMap[field.name]);
    let message = '';
    if (field.validity.valueMissing) message = field.type === 'checkbox' ? 'Please agree before sending your inquiry.' : 'Please complete this required field.';
    else if (field.type === 'email' && field.validity.typeMismatch) message = 'Enter a valid email address.';
    field.setAttribute('aria-invalid', String(Boolean(message)));
    if (error) error.textContent = message;
    return !message;
  };
  fields.forEach(field => {
    field.addEventListener('blur', () => validateField(field));
    field.addEventListener(field.type === 'checkbox' ? 'change' : 'input', () => {
      if (field.getAttribute('aria-invalid') === 'true') validateField(field);
    });
  });

  form.addEventListener('submit', async event => {
    event.preventDefault();
    status.textContent = '';
    const invalid = fields.filter(field => !validateField(field));
    if (invalid.length) {
      status.textContent = 'Please review the highlighted fields.';
      invalid[0].focus();
      return;
    }
    const endpoint = window.NEXORA_CONFIG?.contactApiUrl?.trim();
    if (!endpoint) {
      status.textContent = 'Demo mode: your inquiry has not been sent. Connect a secure contact API to receive submissions.';
      return;
    }
    submitButton.disabled = true;
    submitButton.textContent = 'Sending…';
    status.textContent = 'Sending your inquiry…';
    const payload = Object.fromEntries(new FormData(form).entries());
    payload.consent = form.elements.namedItem('consent').checked;
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(payload)
      });
      let result;
      try { result = await response.json(); } catch { throw new Error('The server returned an unreadable response.'); }
      if (!response.ok) throw new Error(typeof result.message === 'string' ? result.message : 'The server could not accept your inquiry. Please try again.');
      status.textContent = typeof result.message === 'string' ? result.message : 'Your inquiry was sent successfully.';
      form.reset();
      fields.forEach(field => { field.removeAttribute('aria-invalid'); const error = document.getElementById(errorMap[field.name]); if (error) error.textContent = ''; });
    } catch (error) {
      status.textContent = error instanceof TypeError ? 'We could not reach the contact service. Your details are still here; please try again later.' : error.message;
    } finally {
      submitButton.disabled = false;
      submitButton.textContent = 'Send Project Inquiry ↗';
    }
  });
})();
