/*
 * matomo.js — analytics tracker for self-hosted Matomo at analytics.forhuman.ca.
 *
 * Privacy-respecting by design:
 *   - skips when the browser sends Do Not Track
 *   - skips on localhost + loopback (dev)
 *   - pairs with Matomo's "Anonymize IP (last 2 bytes)" and
 *     "Disable browser fingerprint" privacy settings
 *
 * Deploy checklist:
 *   - In Matomo, create the site and copy its numeric siteId.
 *   - Replace SITE_ID_PLACEHOLDER below with that id.
 *   - Verify events appear at https://analytics.forhuman.ca/ under the site.
 */

(() => {
  'use strict';

  const MATOMO_URL = 'https://analytics.forhuman.ca/';
  const SITE_ID = 'SITE_ID_PLACEHOLDER';

  /* Respect Do Not Track */
  const dnt =
    navigator.doNotTrack === '1' ||
    window.doNotTrack === '1' ||
    navigator.msDoNotTrack === '1';
  if (dnt) return;

  /* Skip dev hosts */
  const host = location.hostname;
  if (
    host === 'localhost' ||
    host === '127.0.0.1' ||
    host.endsWith('.local') ||
    host.endsWith('.test')
  ) {
    return;
  }

  /* Skip if the site id hasn't been configured yet — log once so the
     operator sees it in console but don't break the page. */
  if (SITE_ID === 'SITE_ID_PLACEHOLDER' || !SITE_ID) {
    console.info('[matomo] tracking disabled: SITE_ID not configured');
    return;
  }

  window._paq = window._paq || [];
  const _paq = window._paq;

  /* Privacy defaults */
  _paq.push(['disableCookies']);
  _paq.push(['enableHeartBeatTimer']);
  _paq.push(['trackPageView']);
  _paq.push(['enableLinkTracking']);
  _paq.push(['setTrackerUrl', MATOMO_URL + 'matomo.php']);
  _paq.push(['setSiteId', SITE_ID]);

  const s = document.createElement('script');
  s.async = true;
  s.defer = true;
  s.src = MATOMO_URL + 'matomo.js';
  document.head.appendChild(s);
})();
