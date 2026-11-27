/* EWD engagement: visible time-on-page + pages-per-session -> leads sheet. Free, no cookies. */
(function () {
  if (/[?&]skipgc/.test(location.search)) return; /* agent QA exclusion */
  var EP = "https://docs.google.com/forms/d/e/1FAIpQLSfNq0vO6vQ_xnKRbRfdsKi-5nTCpWVfWoUap0wNBNiPXUkz6g/formResponse";
  var F_PAGE = "entry.1939704440", F_SRC = "entry.1845683284", F_CTY = "entry.1095789539", F_DET = "entry.349734728";
  try {
    var t0 = performance.now(), vis = document.visibilityState === "visible", acc = 0, last = t0;
    function tick() { var n = performance.now(); if (vis) acc += n - last; last = n; }
    document.addEventListener("visibilitychange", function () { tick(); vis = document.visibilityState === "visible"; });
    var pc = 1;
    try { pc = (+sessionStorage.getItem("ewd_pc") || 0) + 1; sessionStorage.setItem("ewd_pc", pc); } catch (e) {}
    var cty = "";
    try { cty = sessionStorage.getItem("ewd_cty") || ""; } catch (e) {}
    if (!cty) {
      try {
        fetch("https://ipapi.co/json/").then(function (r) { return r.json(); }).then(function (j) {
          cty = (j && j.country_name) || "";
          try { sessionStorage.setItem("ewd_cty", cty); } catch (e) {}
        }).catch(function () {});
      } catch (e) {}
    }
    var sent = false;
    function send() {
      tick();
      if (sent) return; sent = true;
      var sec = Math.round(acc / 1000);
      var src = "direct", m = location.search.match(/utm_source=([^&]+)/);
      if (m) src = decodeURIComponent(m[1]);
      else if (document.referrer) { try { src = new URL(document.referrer).hostname; } catch (e) {} }
      var mob = /Mobi|Android/i.test(navigator.userAgent) ? "mobile" : "desktop";
      var det = "engagement | " + sec + "s visible | page " + pc + " in session | " + mob + " | lang=" + navigator.language;
      try {
        var fd = new FormData();
        fd.append(F_PAGE, location.pathname);
        fd.append(F_SRC, src);
        fd.append(F_CTY, cty);
        fd.append(F_DET, det);
        navigator.sendBeacon(EP, fd);
      } catch (e) {}
    }
    window.addEventListener("pagehide", send);
  } catch (e) {}
})();
