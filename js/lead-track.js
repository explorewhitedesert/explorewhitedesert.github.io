/* EWD lead tracking: logs every WhatsApp click to the leads sheet. No PII beyond country lookup; click-only. */
(function () {
  var ENDPOINT = 'https://docs.google.com/forms/d/e/1FAIpQLSfNq0vO6vQ_xnKRbRfdsKi-5nTCpWVfWoUap0wNBNiPXUkz6g/formResponse';
  var F_PAGE = 'entry.1939704440', F_SOURCE = 'entry.1845683284', F_COUNTRY = 'entry.1095789539', F_DETAILS = 'entry.349734728';

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

  function country(cb) {
    try {
      var c = sessionStorage.getItem('ewd_cty');
      if (c) return cb(c);
      var done = false;
      var fallback = function () {
        if (done) return; done = true;
        var tz = ''; try { tz = Intl.DateTimeFormat().resolvedOptions().timeZone || ''; } catch (e) {}
        cb(tz || (navigator.language || '?'));
      };
      setTimeout(fallback, 2500);
      fetch('https://ipapi.co/json/', { mode: 'cors' }).then(function (r) { return r.json(); }).then(function (j) {
        if (done) return; done = true;
        var v = j && j.country_name ? j.country_name : fallback() || '?';
        try { sessionStorage.setItem('ewd_cty', v); } catch (e) {}
        cb(v);
      }).catch(fallback);
    } catch (e) { cb('?'); }
  }

  function post(details) {
    country(function (cty) {
      try {
        var fd = new FormData();
        fd.append(F_PAGE, location.pathname);
        fd.append(F_SOURCE, source());
        fd.append(F_COUNTRY, cty);
        fd.append(F_DETAILS, details);
        if (navigator.sendBeacon && navigator.sendBeacon(ENDPOINT, fd)) return;
        fetch(ENDPOINT, { method: 'POST', mode: 'no-cors', body: fd });
      } catch (e) {}
    });
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
    if (a) { send(a); return; }
    var f = ev.target.closest('a[data-funnel]');
    if (f) sendFunnel(f);
  }, true);
})();
