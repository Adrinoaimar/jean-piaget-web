/* First-party aggregate analytics. No cookies, IDs or form values. */
(function () {
  'use strict';
  if (location.hostname !== 'jeanpiagetsullana.pages.dev' || navigator.doNotTrack === '1' || navigator.globalPrivacyControl === true) return;
  var page = location.pathname.replace(/\.html$/, '').replace(/\/$/, '') || '/';
  if (page === '/index') page = '/';
  if (!['/', '/nosotros', '/niveles', '/admision', '/contacto', '/galeria', '/vida-escolar', '/innovacion', '/jean-piaget', '/taller-familiar', '/privacidad', '/terminos'].includes(page)) return;
  var source = 'direct';
  var campaign = new URLSearchParams(location.search).get('utm_source');
  var known = ['google', 'bing', 'facebook', 'instagram', 'tiktok', 'whatsapp'];
  if (campaign && known.includes(campaign.toLowerCase())) source = campaign.toLowerCase();
  else if (document.referrer) {
    try {
      var host = new URL(document.referrer).hostname.toLowerCase();
      if (host === location.hostname) source = 'internal';
      else if (/(^|\.)google\.(com|[a-z]{2}|com\.[a-z]{2}|co\.[a-z]{2})$/.test(host)) source = 'google';
      else if (/(^|\.)bing\.com$/.test(host)) source = 'bing';
      else if (/(^|\.)(facebook\.com|fb\.com|fb\.me)$/.test(host)) source = 'facebook';
      else if (/(^|\.)instagram\.com$/.test(host)) source = 'instagram';
      else if (/(^|\.)tiktok\.com$/.test(host)) source = 'tiktok';
      else if (/(^|\.)(whatsapp\.com|wa\.me)$/.test(host)) source = 'whatsapp';
      else source = 'other';
    } catch (_) { source = 'other'; }
  }
  var lastSent = {};
  function track(event) {
    try {
      var now = Date.now();
      if (lastSent[event] && now - lastSent[event] < 700) return;
      lastSent[event] = now;
      var payload = JSON.stringify({ page: page, event: event, source: source, device: innerWidth < 768 ? 'mobile' : 'desktop' });
      fetch('/api/metrics', { method: 'POST', headers: { 'Content-Type': 'text/plain;charset=UTF-8' }, body: payload, credentials: 'omit', referrerPolicy: 'no-referrer', keepalive: true }).catch(function () {});
    } catch (_) { /* Measurement must never interrupt a visit or a form. */ }
  }
  function init() {
    var viewed = false;
    function view() {
      if (viewed || document.visibilityState === 'hidden') return;
      viewed = true;
      track('page_view');
      document.removeEventListener('visibilitychange', view);
    }
    view();
    if (!viewed) document.addEventListener('visibilitychange', view);
    document.addEventListener('click', function (event) {
      var link = event.target.closest && event.target.closest('a[href]');
      if (!link) return;
      try {
        var url = new URL(link.href, location.href);
        if (url.hostname === 'wa.me' || url.hostname === 'api.whatsapp.com') track('whatsapp_click');
        else if (url.protocol === 'tel:') track('phone_click');
        else if (url.hostname === location.hostname && /^\/admision(?:\.html)?\/?$/.test(url.pathname)) track('admission_click');
      } catch (_) {}
    });
    document.addEventListener('jp:form-success', function (event) {
      if (event.detail && event.detail.type === 'contacto' && page === '/contacto') track('contact_success');
      if (event.detail && event.detail.type === 'admision' && page === '/admision') track('admission_success');
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
}());
