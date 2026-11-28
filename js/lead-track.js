/* EWD lead tracking: logs every WhatsApp click to the leads sheet. No PII beyond country lookup; click-only.
   v2 (2026-11-28): fixes lost leads - WA links now open in a new tab (site stays loaded) and the
   click posts synchronously with the pre-fetched country instead of racing an async lookup against
   page unload. Also tracks the #waBook form and injects a sticky mobile booking bar on pages that
   lack one. */
(function () {
  var ENDPOINT = 'https://docs.google.com/forms/d/e/1FAIpQLSfNq0vO6vQ_xnKRbRfdsKi-5nTCpWVfWoUap0wNBNiPXUkz6g/formResponse';
  var F_PAGE = 'entry.1939704440', F_SOURCE = 'entry.1845683284', F_COUNTRY = 'entry.1095789539', F_DETAILS = 'entry.349734728';

  /* country: kick off lookup at load, cache in sessionStorage, never block the click post */
  var cty = '';
  try { cty = sessionStorage.getItem('ewd_cty') || ''; } catch (e) {}
  if (!cty) {
    try {
      fetch('https://ipapi.co/json/', { mode: 'cors' }).then(function (r) { return r.json(); }).then(function (j) {
        cty = (j && j.country_name) || '';
        if (cty) { try { sessionStorage.setItem('ewd_cty', cty); } catch (e) {} }
      }).catch(function () {});
    } catch (e) {}
  }

  function source() {
    try {
      var q = new URLSearchParams(location.search), u = [];
      ['utm_source', 'utm_medium', 'utm_campaign'].forEach(function (k) {
        var v = q.get(k); if (v) u.push(k.replace('utm_', '') + '=' + v);
      });
      if (u.length) return u.join(' ');
      var r = document.referrer;
      if (r) return 'ref=' + (new URL(r)).hostname;
      return 'direct';
    } catch (e) { return 'unknown'; }
  }

  function post(details) {
    try {
      var fd = new FormData();
      fd.append(F_PAGE, location.pathname);
      fd.append(F_SOURCE, source());
      fd.append(F_COUNTRY, cty || '?');
      fd.append(F_DETAILS, details);
      if (navigator.sendBeacon && navigator.sendBeacon(ENDPOINT, fd)) return;
      fetch(ENDPOINT, { method: 'POST', mode: 'no-cors', body: fd });
    } catch (e) {}
  }

  function device() { return /Mobi|Android/i.test(navigator.userAgent) ? 'mobile' : 'desktop'; }

  function send(link) {
    post(new Date().toISOString() + ' | ' + device() + ' | ' + (link.textContent || '').trim().slice(0, 60) + ' | lang=' + (navigator.language || '?'));
  }

  function sendFunnel(link) {
    post('funnel | home->' + (link.getAttribute('data-funnel') || '?') + ' | ' + device() + ' | lang=' + (navigator.language || '?'));
  }

  document.addEventListener('click', function (ev) {
    if (!ev.target || !ev.target.closest) return;
    var a = ev.target.closest('a[href*="wa.me/201278220004"]');
    if (a) {
      /* keep our tab alive so the beacon and the visit both survive */
      if (!a.target) a.target = '_blank';
      send(a);
      return;
    }
    var f = ev.target.closest('a[data-funnel]');
    if (f) sendFunnel(f);
  }, true);

  /* the booking mini-form opens WhatsApp via window.open: count it too */
  document.addEventListener('submit', function (ev) {
    if (ev.target && ev.target.id === 'waBook') {
      post(new Date().toISOString() + ' | ' + device() + ' | waBook form submit | lang=' + (navigator.language || '?'));
    }
  }, true);

  /* sticky mobile booking bar for pages that do not ship one */
  function injectSticky() {
    try {
      if (document.querySelector('.sticky')) return;
      var pick = document.querySelector('a.btn[href*="wa.me/201278220004"][href*="text="]')
        || document.querySelector('a[href*="wa.me/201278220004"][href*="text="]')
        || document.querySelector('a[href*="wa.me/201278220004"]');
      var href = pick ? pick.getAttribute('href') : 'https://wa.me/201278220004';
      var label = 'Book on WhatsApp';
      if (pick && /btn/.test(pick.className)) {
        var t = (pick.textContent || '').trim();
        if (t && t.length <= 40) label = t;
      }
      var st = document.createElement('style');
      st.textContent = '.sticky{position:fixed;left:16px;right:16px;bottom:16px;z-index:50;display:flex;justify-content:center;pointer-events:none}'
        + '.sticky .btn{pointer-events:auto;width:100%;max-width:420px;justify-content:center;box-shadow:0 10px 30px rgba(0,0,0,.35)}'
        + '@media(min-width:821px){.sticky{left:auto;right:24px;bottom:24px}.sticky .btn{width:auto}}'
        + '@media(max-width:760px){body:has(.sticky){padding-bottom:108px}}';
      document.head.appendChild(st);
      var d = document.createElement('div');
      d.className = 'sticky';
      var a = document.createElement('a');
      a.className = 'btn';
      a.href = href;
      a.target = '_blank';
      a.rel = 'noopener';
      a.textContent = label;
      d.appendChild(a);
      document.body.appendChild(d);
    } catch (e) {}
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', injectSticky);
  else injectSticky();
})();
