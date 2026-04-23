/*
 * contact.js — progressive enhancement for the contact form.
 *
 *   - inline validation on blur + submit (required fields, email format)
 *   - aria-live status messages
 *   - honeypot filtering
 *   - POSTs JSON to the endpoint; falls back to a stubbed success in dev
 *
 * The real endpoint lives in human-dashboard (sub-project B). Until that
 * ships, the form shows the success state without sending anywhere.
 */

(() => {
  'use strict';

  const ENDPOINT = 'https://dashboard.forhuman.ca/api/contact';
  const IS_DEV =
    location.hostname === 'localhost' ||
    location.hostname === '127.0.0.1' ||
    location.hostname.endsWith('.local');

  const form = document.querySelector('[data-contact-form]');
  if (!form) return;

  const submitBtn = form.querySelector('[data-submit]');
  const submitLabel = form.querySelector('[data-submit-label]');
  const statusEl = form.querySelector('[data-form-status]');

  const copy = getCopy();

  /* Inline validation */
  form.querySelectorAll('[required]').forEach((input) => {
    input.addEventListener('blur', () => validateField(input));
    input.addEventListener('input', () => {
      if (input.getAttribute('aria-invalid') === 'true') validateField(input);
    });
  });

  form.addEventListener('submit', onSubmit);

  async function onSubmit(event) {
    event.preventDefault();
    clearStatus();

    const requiredFields = Array.from(form.querySelectorAll('[required]'));
    const invalid = requiredFields.filter((el) => !validateField(el));
    if (invalid.length) {
      invalid[0].focus();
      showStatus(copy.fixErrorsAbove, 'error');
      return;
    }

    /* Honeypot: any value here means bot */
    const honeypot = form.querySelector('input[name="company"]');
    if (honeypot && honeypot.value) {
      showStatus(copy.sent, 'success');
      form.classList.add('contact-form--sent');
      return;
    }

    const payload = serialize(form);
    const hasTurnstileWidget = Boolean(form.querySelector('.cf-turnstile'));
    const hasTurnstileToken = Boolean(payload['cf-turnstile-response']);
    if (hasTurnstileWidget && !hasTurnstileToken) {
      showStatus(copy.completeSecurityCheck, 'error');
      form.querySelector('.cf-turnstile')?.scrollIntoView({ block: 'center', behavior: 'smooth' });
      return;
    }

    setSubmitting(true);
    try {
      if (IS_DEV) {
        /* Dev stub: log the payload and fake a success response */
        console.info('[contact.js] dev submission (not sent):', payload);
        await wait(400);
      } else {
        const res = await fetch(ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
          credentials: 'omit',
        });
        if (!res.ok) {
          const detail = (await res.text().catch(() => '')).trim();
          throw new Error(`HTTP ${res.status}${detail ? `: ${detail.slice(0, 300)}` : ''}`);
        }
      }

      form.classList.add('contact-form--sent');
      showStatus(copy.sent, 'success');
    } catch (err) {
      console.error('[contact.js] submission failed:', err);
      showStatus(copy.failed, 'error');
      setSubmitting(false);
    }
  }

  function validateField(input) {
    const name = input.getAttribute('name');
    const errorEl = form.querySelector(`[data-field-error="${name}"]`);
    const field = input.closest('.field');
    const value = (input.value || '').trim();

    let ok = true;
    if (input.hasAttribute('required') && !value) {
      ok = false;
    } else if (input.type === 'email' && value && !isEmail(value)) {
      ok = false;
    }

    if (field) field.classList.toggle('field--error', !ok);
    if (errorEl) errorEl.hidden = ok;
    input.setAttribute('aria-invalid', String(!ok));
    if (errorEl) {
      const id = errorEl.id || `${input.id || name}-error`;
      errorEl.id = id;
      input.setAttribute('aria-describedby', id);
    }
    return ok;
  }

  function isEmail(v) {
    /* Lightweight check; real validation happens server-side. */
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
  }

  function serialize(el) {
    const data = {};
    const fd = new FormData(el);
    fd.forEach((value, key) => {
      data[key] = typeof value === 'string' ? value.trim() : value;
    });
    data._lang = document.documentElement.lang || 'en';
    data._submitted_at = new Date().toISOString();
    return data;
  }

  function setSubmitting(on) {
    submitBtn.disabled = on;
    submitBtn.setAttribute('aria-busy', String(on));
    if (on) {
      submitLabel.innerHTML = `<span class="spinner" aria-hidden="true"></span> ${escapeHTML(copy.sending)}`;
    } else {
      submitLabel.textContent = copy.send;
    }
  }

  function showStatus(message, variant) {
    statusEl.textContent = message;
    statusEl.classList.add('is-visible');
    statusEl.classList.remove('contact-form__status--success', 'contact-form__status--error');
    statusEl.classList.add(`contact-form__status--${variant}`);
  }

  function clearStatus() {
    statusEl.classList.remove('is-visible', 'contact-form__status--success', 'contact-form__status--error');
    statusEl.textContent = '';
  }

  function wait(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  function escapeHTML(s) {
    return String(s).replace(/[&<>"']/g, (c) => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
    }[c]));
  }

  function getCopy() {
    const isZh = (document.documentElement.lang || '').toLowerCase().startsWith('zh');
    if (isZh) {
      return {
        send: '傳送訊息',
        sending: '傳送中',
        sent: '收到了。我們會在兩個工作天內回覆。',
        failed: '訊息沒送出。請稍後再試，或寫信到 contact@forhuman.ca。',
        fixErrorsAbove: '請先填寫標示的欄位。',
        completeSecurityCheck: '請先完成「我不是機器人」驗證。',
      };
    }
    return {
      send: 'Send Message',
      sending: 'Sending',
      sent: "Got it. We'll be in touch within two business days.",
      failed: "Your message didn't go through. Please try again, or email contact@forhuman.ca.",
      fixErrorsAbove: 'Please fix the highlighted fields.',
      completeSecurityCheck: 'Please complete the security check first.',
    };
  }
})();
