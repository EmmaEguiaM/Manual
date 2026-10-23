(function () {
  'use strict';

  var CM = window.CM;
  var D = CM.data;
  var DESKTOP = window.matchMedia('(min-width: 1024px)');

  function parse(hash) {
    var h = (hash || '').replace(/^#/, '');
    if (h.charAt(0) !== '/') h = '/' + h;
    var parts = h.split('/').filter(Boolean).map(function (s) {
      try { return decodeURIComponent(s); } catch (e) { return s; }
    });
    var r = { view: 'notfound', id: null, anchor: null, raw: hash };
    if (!parts.length) { r.view = 'home'; return r; }
    switch (parts[0]) {
      case 'procedimientos':
        if (!parts[1]) { r.view = 'list'; return r; }
        r.view = CM.procById[parts[1]] ? 'procedure' : 'notfound';
        r.id = parts[1];
        r.anchor = parts[2] || null;
        return r;
      case 'categoria':
        r.view = CM.catById[parts[1]] ? 'list' : 'notfound';
        r.id = parts[1];
        return r;
      case 'favoritos': r.view = 'favorites'; return r;
      case 'herramientas': r.view = 'tools'; return r;
      case 'directorio': r.view = 'directory'; r.anchor = parts[1] || null; return r;
      case 'sistemas':
        r.view = CM.sysById[parts[1]] && CM.sysById[parts[1]].page ? 'system' : 'notfound';
        r.id = parts[1];
        return r;
      default: return r;
    }
  }

  function matchKey(r) {
    if (r.view === 'procedure') return 'proc:' + r.id;
    if (r.view === 'system') return 'system:' + r.id;
    return r.view;
  }

  function renderMenu() {
    var collapsed = CM.prefs.get('collapsedGroups', []);
    var html = D.menu.map(function (g) {
      var isCol = collapsed.indexOf(g.id) !== -1;
      var items = g.items.map(function (it) {
        var label, href, icon, key, badge = '';
        if (it.proc) {
          var p = CM.procById[it.proc];
          label = it.label || p.title;
          href = '#/procedimientos/' + p.id;
          icon = p.icon;
          key = 'proc:' + p.id;
        } else {
          label = it.label;
          href = it.href;
          icon = it.icon;
          key = it.match;
          if (it.match === 'favorites') badge = '<span class="nav-badge" data-fav-count></span>';
        }
        return '<li><a class="nav-link" href="' + href + '" data-match="' + key + '">' + CM.icon(icon) + '<span>' + CM.esc(label) + '</span>' + badge + '</a></li>';
      }).join('');
      return '<div class="nav-group' + (isCol ? ' is-collapsed' : '') + '" data-group="' + g.id + '">' +
        '<button type="button" class="nav-group-btn" aria-expanded="' + !isCol + '" aria-controls="nav-' + g.id + '">' +
        '<span>' + CM.esc(g.title) + '</span>' + CM.icon('chevron-down', 'icon--sm') + '</button>' +
        '<ul class="nav-list" id="nav-' + g.id + '">' + items + '</ul></div>';
    }).join('');
    document.getElementById('sidebar-menu').innerHTML = html;
    updateFavCount();
  }

  function updateFavCount() {
    var n = CM.favs.all().length;
    Array.prototype.forEach.call(document.querySelectorAll('[data-fav-count]'), function (el) {
      el.textContent = n ? String(n) : '';
      el.hidden = !n;
    });
  }

  function setActive(r) {
    var key = matchKey(r);
    var activeLink = null;
    Array.prototype.forEach.call(document.querySelectorAll('.nav-link'), function (a) {
      var on = a.getAttribute('data-match') === key;
      if (on) { a.setAttribute('aria-current', 'page'); activeLink = a; }
      else a.removeAttribute('aria-current');
    });
    if (activeLink) {
      var group = activeLink.closest('.nav-group');
      if (group && group.classList.contains('is-collapsed')) toggleGroup(group, false);
      var sc = document.getElementById('sidebar-menu');
      var lr = activeLink.getBoundingClientRect();
      var sr = sc.getBoundingClientRect();
      if (lr.top < sr.top || lr.bottom > sr.bottom) activeLink.scrollIntoView({ block: 'nearest' });
    }
  }

  function toggleGroup(group, collapse) {
    var id = group.getAttribute('data-group');
    var isCol = collapse == null ? !group.classList.contains('is-collapsed') : collapse;
    group.classList.toggle('is-collapsed', isCol);
    group.querySelector('.nav-group-btn').setAttribute('aria-expanded', String(!isCol));
    var list = CM.prefs.get('collapsedGroups', []).filter(function (g) { return g !== id; });
    if (isCol) list.push(id);
    CM.prefs.set('collapsedGroups', list);
  }

  var toggleBtn, overlay;

  function isDesktop() { return DESKTOP.matches; }

  function syncToggle() {
    var expanded = isDesktop() ? !document.body.classList.contains('nav-collapsed') : document.body.classList.contains('nav-open');
    toggleBtn.setAttribute('aria-expanded', String(expanded));
  }

  function openDrawer() {
    document.body.classList.add('nav-open');
    overlay.hidden = false;
    syncToggle();
    var first = document.querySelector('#sidebar .nav-link[aria-current]') || document.querySelector('#sidebar .nav-link');
    setTimeout(function () { if (first) first.focus({ preventScroll: false }); }, 60);
  }

  function closeDrawer(restore) {
    if (!document.body.classList.contains('nav-open')) return;
    document.body.classList.remove('nav-open');
    syncToggle();
    setTimeout(function () { if (!document.body.classList.contains('nav-open')) overlay.hidden = true; }, 220);
    if (restore) toggleBtn.focus();
  }

  function onToggle() {
    if (isDesktop()) {
      var col = !document.body.classList.contains('nav-collapsed');
      document.body.classList.toggle('nav-collapsed', col);
      CM.prefs.set('navCollapsed', col);
      syncToggle();
    } else if (document.body.classList.contains('nav-open')) {
      closeDrawer(true);
    } else {
      openDrawer();
    }
  }

  function initNav() {
    toggleBtn = document.getElementById('nav-toggle');
    overlay = document.getElementById('nav-overlay');
    renderMenu();

    if (CM.prefs.get('navCollapsed', false)) document.body.classList.add('nav-collapsed');
    syncToggle();

    toggleBtn.addEventListener('click', onToggle);
    overlay.addEventListener('click', function () { closeDrawer(true); });
    document.getElementById('nav-close').addEventListener('click', function () { closeDrawer(true); });

    document.getElementById('sidebar').addEventListener('click', function (ev) {
      var btn = ev.target.closest('.nav-group-btn');
      if (btn) { toggleGroup(btn.closest('.nav-group')); return; }
      if (ev.target.closest('.nav-link') && !isDesktop()) closeDrawer(false);
    });

    document.getElementById('sidebar').addEventListener('keydown', function (ev) {
      if (ev.key === 'Escape' && !isDesktop()) closeDrawer(true);
      if (ev.key === 'Tab' && document.body.classList.contains('nav-open') && !isDesktop()) {
        var f = Array.prototype.slice.call(document.querySelectorAll('#sidebar button, #sidebar a[href]')).filter(function (el) { return el.offsetParent !== null; });
        if (!f.length) return;
        if (ev.shiftKey && document.activeElement === f[0]) { ev.preventDefault(); f[f.length - 1].focus(); }
        else if (!ev.shiftKey && document.activeElement === f[f.length - 1]) { ev.preventDefault(); f[0].focus(); }
      }
    });

    var onChange = function () {
      if (isDesktop()) { document.body.classList.remove('nav-open'); overlay.hidden = true; }
      syncToggle();
    };
    if (DESKTOP.addEventListener) DESKTOP.addEventListener('change', onChange);
    else if (DESKTOP.addListener) DESKTOP.addListener(onChange);

    document.querySelector('[data-skip]').addEventListener('click', function (ev) {
      ev.preventDefault();
      var main = document.getElementById('contenido');
      main.focus();
      main.scrollIntoView();
    });

    document.addEventListener('click', function (ev) {
      if (ev.defaultPrevented || ev.button !== 0 || ev.metaKey || ev.ctrlKey || ev.shiftKey || ev.altKey) return;
      var a = ev.target.closest('a[href^="#/"], a[href="#"]');
      if (!a) return;
      var href = a.getAttribute('href');
      if (href === '#' || href === location.hash || (href === '#/' && (location.hash === '' || location.hash === '#'))) {
        ev.preventDefault();
        if (href !== '#') handle(true);
      }
    });
  }

  var current = null;

  function handle(force) {
    var r = parse(location.hash);
    var prev = current;
    current = r;
    CM.search.close(false);
    closeDrawer(false);
    setActive(r);
    var samePage = prev && prev.view === r.view && prev.id === r.id && (r.view === 'procedure' || r.view === 'directory') && document.querySelector('[data-page]');
    if (samePage && !force) {
      CM.app.focusAnchor(r);
      return;
    }
    if (samePage && force) {
      CM.app.focusAnchor(r);
      return;
    }
    CM.app.render(r, !!prev);
  }

  function go(href) {
    if (href === location.hash) handle(true);
    else location.hash = href;
  }

  CM.router = { parse: parse, handle: handle, go: go, current: function () { return current; } };
  CM.nav = { init: initNav, setActive: setActive, updateFavCount: updateFavCount, closeDrawer: closeDrawer };
})();
