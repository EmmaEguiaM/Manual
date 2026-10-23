(function () {
  'use strict';

  var CM = window.CM = window.CM || {};
  CM.data = window.CM_DATA;
  CM.state = { zoneQuery: null, guided: {}, lastRoute: null };

  var ICONS = {
    home: '<path d="M3 10.5 12 3l9 7.5"/><path d="M5 9.5V21h14V9.5"/><path d="M10 21v-6h4v6"/>',
    list: '<path d="M9 6h12M9 12h12M9 18h12"/><path d="M4.5 6h.01M4.5 12h.01M4.5 18h.01" stroke-width="2.6"/>',
    star: '<path d="M12 3.6l2.55 5.17 5.7.83-4.13 4.02.98 5.68L12 16.62l-5.1 2.68.98-5.68L3.75 9.6l5.7-.83z"/>',
    key: '<circle cx="8" cy="15" r="4"/><path d="M10.9 12.1 19 4M15.5 7.5l2.5 2.5M13.5 9.5l2 2"/>',
    link: '<path d="M10 14a4 4 0 0 0 5.66 0l3-3a4 4 0 0 0-5.66-5.66l-1 1"/><path d="M14 10a4 4 0 0 0-5.66 0l-3 3a4 4 0 0 0 5.66 5.66l1-1"/>',
    'file-text': '<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5M9 13h6M9 17h6"/>',
    'file-check': '<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5"/><path d="M9 14.5l2 2 4-4"/>',
    excel: '<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5"/><path d="M9.5 12.5l5 5M14.5 12.5l-5 5"/>',
    calendar: '<rect x="3.5" y="5" width="17" height="15.5" rx="2"/><path d="M3.5 10h17M8 3v4M16 3v4"/><path d="M8 14h3v3H8z"/>',
    chart: '<path d="M3.5 20.5h17"/><path d="M6.5 16.5v-5M11 16.5V6.5M15.5 16.5v-3.5M20 16.5V9"/>',
    pie: '<path d="M12 3a9 9 0 1 0 9 9h-9z"/><path d="M15 3.5A9 9 0 0 1 20.5 9H15z"/>',
    presentation: '<rect x="3" y="4" width="18" height="12" rx="1.5"/><path d="M12 16v4M8 20.5h8"/><path d="M7 12.5l3-3 2.2 2.2L16.5 7.5"/>',
    briefcase: '<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2M3 13h18"/>',
    database: '<ellipse cx="12" cy="5.5" rx="7.5" ry="2.5"/><path d="M4.5 5.5v13c0 1.38 3.36 2.5 7.5 2.5s7.5-1.12 7.5-2.5v-13"/><path d="M4.5 12c0 1.38 3.36 2.5 7.5 2.5s7.5-1.12 7.5-2.5"/>',
    tag: '<path d="M3.5 12.2V4.5a1 1 0 0 1 1-1h7.7l8.3 8.3-8.7 8.7z"/><circle cx="8" cy="8" r="1.5"/>',
    receipt: '<path d="M5.5 3h13v18l-2.6-1.6L13.3 21 12 20.2 10.7 21l-2.6-1.6L5.5 21z"/><path d="M9 8h6M9 12h6M9 16h3.5"/>',
    server: '<rect x="3.5" y="4" width="17" height="7" rx="1.5"/><rect x="3.5" y="13" width="17" height="7" rx="1.5"/><path d="M7.5 7.5h.01M7.5 16.5h.01" stroke-width="2.6"/>',
    shield: '<path d="M12 3l7.5 2.8v6.1c0 4.4-3.2 8-7.5 9.1-4.3-1.1-7.5-4.7-7.5-9.1V5.8z"/><path d="M9 12l2 2 4-4"/>',
    folder: '<path d="M3.5 7a2 2 0 0 1 2-2h4l2 2h7a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-13a2 2 0 0 1-2-2z"/>',
    video: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M10 9.2v5.6l4.8-2.8z"/>',
    play: '<path d="M8 5.5v13l10.5-6.5z"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/>',
    copy: '<rect x="9" y="9" width="11.5" height="11.5" rx="2"/><path d="M5.5 15H5a1.5 1.5 0 0 1-1.5-1.5v-8A1.5 1.5 0 0 1 5 4h8.5A1.5 1.5 0 0 1 15 5.5V6"/>',
    check: '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
    external: '<path d="M14 4h6v6M20 4l-9 9"/><path d="M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/>',
    'chevron-right': '<path d="M9 6l6 6-6 6"/>',
    'chevron-left': '<path d="M15 6l-6 6 6 6"/>',
    'chevron-down': '<path d="M6 9l6 6 6-6"/>',
    'arrow-right': '<path d="M5 12h14M13 6l6 6-6 6"/>',
    printer: '<path d="M7 9V3.5h10V9"/><rect x="3" y="9" width="18" height="8" rx="2"/><path d="M7 14h10v6.5H7z"/>',
    reset: '<path d="M4 12a8 8 0 1 0 2.35-5.65"/><path d="M4 4.5v4h4"/>',
    alert: '<path d="M12 4l9 16H3z"/><path d="M12 10v4.5M12 17.3h.01"/>',
    info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5.5M12 7.7h.01"/>',
    help: '<circle cx="12" cy="12" r="9"/><path d="M9.6 9.5a2.5 2.5 0 1 1 3.4 2.33c-.6.25-1 .8-1 1.45v.72M12 17h.01"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.2 2"/>',
    mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3.5 6.5l8.5 6.5 8.5-6.5"/>',
    pin: '<path d="M12 21s-7-6.1-7-11.4a7 7 0 0 1 14 0C19 14.9 12 21 12 21z"/><circle cx="12" cy="9.6" r="2.5"/>',
    globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.4 2.6 3.7 5.6 3.7 9s-1.3 6.4-3.7 9c-2.4-2.6-3.7-5.6-3.7-9S9.6 5.6 12 3z"/>',
    target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.2"/>',
    checklist: '<path d="M4 6.5l1.5 1.5L8.5 5M4 12.5l1.5 1.5 3-3M4 18.5l1.5 1.5 3-3M11.5 6.5H20M11.5 12.5H20M11.5 18.5H20"/>',
    layers: '<path d="M12 3l9 5-9 5-9-5z"/><path d="M3 13l9 5 9-5"/>',
    book: '<path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5z"/><path d="M4 20.5A2.5 2.5 0 0 0 6.5 23H20v-5"/>',
    history: '<path d="M3.5 12a8.5 8.5 0 1 0 2.5-6"/><path d="M3.5 4v4h4M12 8v4.5l3 1.8"/>',
    steps: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    scroll: '<path d="M4 6h16M4 10h16M4 14h16M4 18h10"/>',
    terminal: '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M7 9l3 3-3 3M12.5 15H17"/>',
    hash: '<path d="M5 9h14M5 15h14M10 4l-2 16M16 4l-2 16"/>',
    monitor: '<rect x="3" y="4" width="18" height="12" rx="2"/><path d="M8 20h8M12 16v4"/>',
    user: '<circle cx="12" cy="8" r="4"/><path d="M4.5 20.5c1.2-3.6 4-5.5 7.5-5.5s6.3 1.9 7.5 5.5"/>',
    x: '<path d="M6 6l12 12M18 6L6 18"/>',
    menu: '<path d="M4 6h16M4 12h16M4 18h16"/>'
  };

  CM.icon = function (name, cls) {
    var body = ICONS[name] || ICONS.info;
    return '<svg class="icon' + (cls ? ' ' + cls : '') + '" viewBox="0 0 24 24" aria-hidden="true" focusable="false">' + body + '</svg>';
  };

  CM.esc = function (s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  };

  var COMBINING = /[̀-ͯ]/g;

  CM.norm = function (s) {
    return String(s == null ? '' : s).normalize('NFD').replace(COMBINING, '').toLowerCase();
  };

  CM.normMap = function (s) {
    s = String(s == null ? '' : s);
    var out = '';
    var map = [];
    for (var i = 0; i < s.length; i++) {
      var n = s[i].normalize('NFD').replace(COMBINING, '').toLowerCase();
      for (var j = 0; j < n.length; j++) { out += n[j]; map.push(i); }
    }
    return { text: out, map: map };
  };

  CM.md = function (text) {
    return CM.esc(text)
      .replace(/\*\*(.+?)\*\*/g, '<strong class="ui">$1</strong>')
      .replace(/`(.+?)`/g, '<code>$1</code>');
  };

  CM.plain = function (text) {
    return String(text == null ? '' : text).replace(/\*\*(.+?)\*\*/g, '$1').replace(/`(.+?)`/g, '$1');
  };

  CM.highlight = function (text, tokens) {
    text = String(text == null ? '' : text);
    if (!tokens || !tokens.length) return CM.esc(text);
    var nm = CM.normMap(text);
    var ranges = [];
    tokens.forEach(function (tok) {
      if (!tok) return;
      var from = 0;
      var idx;
      while ((idx = nm.text.indexOf(tok, from)) !== -1) {
        var start = nm.map[idx];
        var end = nm.map[idx + tok.length - 1] + 1;
        ranges.push([start, end]);
        from = idx + tok.length;
      }
    });
    if (!ranges.length) return CM.esc(text);
    ranges.sort(function (a, b) { return a[0] - b[0]; });
    var merged = [ranges[0].slice()];
    for (var i = 1; i < ranges.length; i++) {
      var last = merged[merged.length - 1];
      if (ranges[i][0] <= last[1]) last[1] = Math.max(last[1], ranges[i][1]);
      else merged.push(ranges[i].slice());
    }
    var out = '';
    var pos = 0;
    merged.forEach(function (r) {
      out += CM.esc(text.slice(pos, r[0])) + '<mark>' + CM.esc(text.slice(r[0], r[1])) + '</mark>';
      pos = r[1];
    });
    return out + CM.esc(text.slice(pos));
  };

  CM.snippet = function (text, tokens, size) {
    text = String(text == null ? '' : text);
    size = size || 150;
    if (text.length <= size) return CM.highlight(text, tokens);
    var nm = CM.normMap(text);
    var first = -1;
    (tokens || []).forEach(function (t) {
      var i = nm.text.indexOf(t);
      if (i !== -1 && (first === -1 || i < first)) first = i;
    });
    var center = first === -1 ? 0 : nm.map[first];
    var start = Math.max(0, center - Math.floor(size * 0.35));
    var end = Math.min(text.length, start + size);
    start = Math.max(0, end - size);
    if (start > 0) {
      var sp = text.indexOf(' ', start);
      if (sp !== -1 && sp < center) start = sp + 1;
    }
    if (end < text.length) {
      var sp2 = text.lastIndexOf(' ', end);
      if (sp2 > center) end = sp2;
    }
    return (start > 0 ? '… ' : '') + CM.highlight(text.slice(start, end), tokens) + (end < text.length ? ' …' : '');
  };

  var memory = {};
  CM.store = {
    get: function (key, fallback) {
      try {
        var raw = window.localStorage.getItem('construmac-manual:' + key);
        if (raw != null) return JSON.parse(raw);
      } catch (e) { }
      return Object.prototype.hasOwnProperty.call(memory, key) ? memory[key] : fallback;
    },
    set: function (key, value) {
      memory[key] = value;
      try { window.localStorage.setItem('construmac-manual:' + key, JSON.stringify(value)); } catch (e) { }
    },
    remove: function (key) {
      delete memory[key];
      try { window.localStorage.removeItem('construmac-manual:' + key); } catch (e) { }
    }
  };

  var toastTimer = null;
  CM.toast = function (message, type) {
    var el = document.getElementById('toast');
    if (!el) return;
    el.className = 'toast' + (type === 'error' ? ' is-error' : '');
    el.innerHTML = CM.icon(type === 'error' ? 'alert' : 'check') + '<span>' + CM.esc(message) + '</span>';
    void el.offsetWidth;
    el.classList.add('is-visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { el.classList.remove('is-visible'); }, type === 'error' ? 4200 : 2200);
  };

  function legacyCopy(text) {
    var ta = document.createElement('textarea');
    ta.value = text;
    ta.setAttribute('readonly', '');
    ta.style.position = 'fixed';
    ta.style.top = '-1000px';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    var ok = false;
    try { ok = document.execCommand('copy'); } catch (e) { ok = false; }
    document.body.removeChild(ta);
    return ok;
  }

  CM.copy = function (text, label, button) {
    function done() {
      CM.toast((label || 'Texto') + ' copiado al portapapeles');
      if (button) {
        button.classList.add('is-copied');
        var original = button.getAttribute('data-label-html');
        if (!original) button.setAttribute('data-label-html', button.innerHTML);
        button.innerHTML = CM.icon('check') + '<span>Copiado</span>';
        setTimeout(function () {
          button.classList.remove('is-copied');
          button.innerHTML = button.getAttribute('data-label-html');
        }, 1600);
      }
    }
    function fail() {
      CM.toast('No se pudo copiar automáticamente. Selecciona el texto y usa Ctrl+C.', 'error');
    }
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(done, function () {
        if (legacyCopy(text)) done(); else fail();
      });
    } else if (legacyCopy(text)) {
      done();
    } else {
      fail();
    }
  };

  CM.procById = {};
  CM.data.procedures.forEach(function (p) {
    CM.procById[p.id] = p;
    var n = 0;
    p.stepList = [];
    p.phases.forEach(function (ph, pi) {
      ph.index = pi;
      ph.number = pi + 1;
      ph.anchor = 'fase-' + (pi + 1);
      ph.steps.forEach(function (st, si) {
        st.number = n;
        st.anchor = 'paso-' + n;
        st.phase = ph;
        st.key = st.id || ('s' + hash(p.id + '|' + ph.title + '|' + st.t));
        st.order = n;
        p.stepList.push(st);
        n++;
      });
    });
    p.totalSteps = n;
  });

  function hash(str) {
    var h = 5381;
    for (var i = 0; i < str.length; i++) h = ((h << 5) + h + str.charCodeAt(i)) | 0;
    return (h >>> 0).toString(36);
  }

  CM.catById = {};
  CM.data.categories.forEach(function (c) { CM.catById[c.id] = c; });
  CM.resById = {};
  CM.data.resources.forEach(function (r) { CM.resById[r.id] = r; });
  CM.sysById = {};
  CM.data.systems.forEach(function (s) { CM.sysById[s.id] = s; });

  CM.procTitle = function (p) { return p.shortTitle || p.title; };

  CM.progress = {
    get: function (id) { return CM.store.get('progress:' + id, []); },
    set: function (id, keys) { CM.store.set('progress:' + id, keys); },
    has: function (id, key) { return CM.progress.get(id).indexOf(key) !== -1; },
    toggle: function (id, key, on) {
      var list = CM.progress.get(id).filter(function (k) { return k !== key; });
      if (on) list.push(key);
      CM.progress.set(id, list);
    },
    count: function (p) {
      var done = CM.progress.get(p.id);
      return p.stepList.filter(function (s) { return done.indexOf(s.key) !== -1; }).length;
    },
    pct: function (p) { return p.totalSteps ? Math.round(CM.progress.count(p) / p.totalSteps * 100) : 0; },
    reset: function (id) {
      CM.store.remove('progress:' + id);
      CM.store.remove('checks:' + id);
    }
  };

  CM.checks = {
    get: function (id) { return CM.store.get('checks:' + id, []); },
    toggle: function (id, key, on) {
      var list = CM.checks.get(id).filter(function (k) { return k !== key; });
      if (on) list.push(key);
      CM.store.set('checks:' + id, list);
    }
  };

  CM.favs = {
    all: function () { return CM.store.get('favorites', []).filter(function (id) { return CM.procById[id]; }); },
    has: function (id) { return CM.favs.all().indexOf(id) !== -1; },
    toggle: function (id) {
      var list = CM.favs.all();
      var on = list.indexOf(id) === -1;
      list = list.filter(function (x) { return x !== id; });
      if (on) list.unshift(id);
      CM.store.set('favorites', list);
      return on;
    }
  };

  CM.history = {
    all: function () { return CM.store.get('history', []).filter(function (h) { return h && CM.procById[h.id]; }); },
    push: function (id) {
      var list = CM.history.all().filter(function (h) { return h.id !== id; });
      list.unshift({ id: id, ts: Date.now() });
      CM.store.set('history', list.slice(0, 8));
    }
  };

  CM.prefs = {
    get: function (k, d) { var p = CM.store.get('prefs', {}); return Object.prototype.hasOwnProperty.call(p, k) ? p[k] : d; },
    set: function (k, v) { var p = CM.store.get('prefs', {}); p[k] = v; CM.store.set('prefs', p); }
  };

  CM.timeAgo = function (ts) {
    var diff = Math.max(0, Date.now() - ts) / 1000;
    if (diff < 60) return 'hace un momento';
    if (diff < 3600) return 'hace ' + Math.round(diff / 60) + ' min';
    if (diff < 86400) return 'hace ' + Math.round(diff / 3600) + ' h';
    var d = Math.round(diff / 86400);
    return d === 1 ? 'ayer' : 'hace ' + d + ' días';
  };

  CM.isMac = /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent || '');
  CM.reducedMotion = function () {
    return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  };
})();
