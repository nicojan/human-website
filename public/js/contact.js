/*
 * contact.js — progressive enhancement for the contact form.
 *
 *   - native HTML5 required-field validation (the browser handles it)
 *   - aria-live status messages for API-level success / failure
 *   - honeypot filtering
 *   - preferred-method dropdown retargets the handle input's label, type,
 *     and placeholder so one field handles email / WeChat / Line / WhatsApp / SMS
 *   - POSTs JSON to form[data-endpoint]; stubs success in local dev
 */

(() => {
  'use strict';

  const IS_DEV =
    location.hostname === 'localhost' ||
    location.hostname === '127.0.0.1' ||
    location.hostname.endsWith('.local');

  const form = document.querySelector('[data-contact-form]');
  if (!form) return;
  const ENDPOINT = resolveEndpoint(form);

  const submitBtn = form.querySelector('[data-submit]');
  const submitLabel = form.querySelector('[data-submit-label]');
  const statusEl = form.querySelector('[data-form-status]');
  const methodSelect = form.querySelector('[data-contact-method]');
  const handleInput = form.querySelector('[data-contact-handle]');
  const handleLabel = form.querySelector('[data-contact-handle-label]');

  const HANDLE_FIELDS = {
    email: {
      labelHtml: 'Email address · <span lang="zh-Hant">電郵地址</span>',
      type: 'email',
      placeholder: 'name@example.com',
      autocomplete: 'email',
      inputMode: 'email',
    },
    wechat: {
      labelHtml: 'WeChat ID · <span lang="zh-Hant">微信號</span>',
      type: 'text',
      placeholder: 'e.g. classwithnico',
      autocomplete: 'off',
      inputMode: 'text',
    },
    line: {
      labelHtml: 'Line ID · <span lang="zh-Hant">Line 帳號</span>',
      type: 'text',
      placeholder: 'e.g. classwithnico',
      autocomplete: 'off',
      inputMode: 'text',
    },
    whatsapp: {
      labelHtml: 'WhatsApp number · <span lang="zh-Hant">WhatsApp 號碼</span>',
      type: 'tel',
      placeholder: '+1 604 555 0123',
      autocomplete: 'tel',
      inputMode: 'tel',
    },
    text: {
      labelHtml: 'Phone number · <span lang="zh-Hant">手機號碼</span>',
      type: 'tel',
      placeholder: '+1 604 555 0123',
      autocomplete: 'tel',
      inputMode: 'tel',
    },
  };

  if (methodSelect && handleInput && handleLabel) {
    methodSelect.addEventListener('change', () => {
      applyHandleMethod(methodSelect.value);
    });
    applyHandleMethod(methodSelect.value);
  }

  form.addEventListener('submit', onSubmit);

  function applyHandleMethod(method) {
    const config = HANDLE_FIELDS[method] || HANDLE_FIELDS.email;
    handleLabel.innerHTML = config.labelHtml;
    handleInput.type = config.type;
    handleInput.placeholder = config.placeholder;
    handleInput.autocomplete = config.autocomplete;
    handleInput.inputMode = config.inputMode;
    /* Clear any lingering browser-validation state when switching types. */
    handleInput.setCustomValidity('');
  }

  const copy = getCopy();

  async function onSubmit(event) {
    event.preventDefault();
    clearStatus();

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
      console.error('[contact.js] submission failed:', { endpoint: ENDPOINT, error: err });
      const isNetworkError = err instanceof TypeError;
      showStatus(isNetworkError ? copy.endpointUnreachable : copy.failed, 'error');
      setSubmitting(false);
    }
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
    /* Bilingual strings (EN · ZH) — the contact page serves both audiences. */
    return {
      send: 'Send Message · 傳送訊息',
      sending: 'Sending · 傳送中',
      sent: "Got it. We'll be in touch soon. · 收到了，我們很快會回覆您。",
      failed: "Your message didn't go through. Please try again, or email contact@forhuman.ca. · 訊息沒送出。請稍後再試，或寫信到 contact@forhuman.ca。",
      endpointUnreachable: 'We could not reach the message server. Please try again, or email contact@forhuman.ca. · 目前無法連線。請稍後再試，或寫信到 contact@forhuman.ca。',
      completeSecurityCheck: 'Please complete the security check first. · 請先完成「我不是機器人」驗證。',
    };
  }

  function resolveEndpoint(formEl) {
    const configured = (formEl.getAttribute('data-endpoint') || '').trim();
    const fallback = '/api/contact';
    try {
      return new URL(configured || fallback, location.origin).toString();
    } catch (_) {
      return new URL(fallback, location.origin).toString();
    }
  }
})();
