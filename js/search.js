(function () {
  'use strict';

  var CM = window.CM;
  var D = CM.data;
  var entries = [];
  var orderIndex = {};
  D.order.forEach(function (id, i) { orderIndex[id] = i; });

  var TYPE_LABEL = { excel: 'Archivo de Excel', carpeta: 'Carpeta', video: 'Video' };

  function add(e) {
    e.title = e.title || '';
    e.text = e.text || '';
    e.kw = e.kw || '';
    e.nt = CM.norm(e.title);
    e.nk = CM.norm(e.kw);
    e.n = e.nt + '\n' + CM.norm(e.text) + '\n' + e.nk;
    e.weight = e.weight || 0;
    entries.push(e);
  }

  function valuesText(vals) {
    return (vals || []).map(function (v) { return v.label + ' ' + v.value; }).join(' · ');
  }

  function buildIndex() {
    entries = [];
    D.procedures.forEach(function (p) {
      var cat = CM.catById[p.category];
      var base = { group: p.id, cat: p.category, systems: p.systems };
      var route = '#/procedimientos/' + p.id;
      var single = p.phases.length === 1;

      add(Object.assign({}, base, {
        type: 'proc',
        title: p.title + (p.shortTitle ? ' · ' + p.shortTitle : ''),
        text: [p.objective, p.summary, cat.name, p.systems.join(' '), p.frequency || ''].join(' · '),
        kw: p.keywords.join(' · '),
        route: route,
        weight: 8
      }));

      p.phases.forEach(function (ph) {
        if (!single) {
          add(Object.assign({}, base, {
            type: 'phase',
            label: 'Fase ' + ph.number,
            title: ph.title,
            text: ph.short || '',
            route: route + '/' + ph.anchor,
            weight: 3
          }));
        }
        ph.steps.forEach(function (st) {
          var parts = [CM.plain(st.t), valuesText(st.v)];
          if (st.note) parts.push(st.note);
          if (st.warn) parts.push(st.warn);
          if (st.pend) parts.push('Información pendiente de confirmar: ' + st.pend);
          if (st.table) parts.push(st.table.head.join(' ') + ' ' + st.table.rows.map(function (r) { return r.join(' '); }).join(' '));
          if (st.copyAll) parts.push(st.copyAll.value);
          add(Object.assign({}, base, {
            type: 'step',
            label: (single ? '' : 'Fase ' + ph.number + ' · ') + 'Paso ' + st.number,
            text: parts.filter(Boolean).join(' · '),
            route: route + '/' + st.anchor,
            order: st.order,
            weight: 1
          }));
        });
      });

      (p.notices || []).forEach(function (n) {
        add(Object.assign({}, base, {
          type: 'notice',
          label: n.type === 'warn' ? 'Advertencia' : n.type === 'pending' ? 'Información pendiente de confirmar' : 'Nota',
          text: CM.plain(n.text),
          route: route + '/avisos'
        }));
      });

      if (p.requirements && p.requirements.length) {
        add(Object.assign({}, base, { type: 'req', label: 'Antes de comenzar', text: p.requirements.join(' · '), route: route + '/requisitos' }));
      }
      if (p.verification && p.verification.length) {
        add(Object.assign({}, base, { type: 'verif', label: 'Verificación final', text: p.verification.join(' · '), route: route + '/verificacion' }));
      }
      (p.faq || []).forEach(function (f) {
        add(Object.assign({}, base, { type: 'faq', label: 'Pregunta frecuente', title: f.q, text: f.a, route: route + '/faq', weight: 1 }));
      });
    });

    D.zones.forEach(function (z) {
      var base = { group: 'junta-trimestral', cat: 'reportes', systems: CM.procById['junta-trimestral'].systems, route: '#/procedimientos/junta-trimestral/zonas' };
      add(Object.assign({}, base, {
        type: 'zone',
        label: 'Distribución de zonas',
        title: 'Zona ' + z.name,
        text: 'Sucursales: ' + z.branches.join(', '),
        kw: 'zona zonas sucursales',
        weight: 4
      }));
      z.branches.forEach(function (b) {
        add(Object.assign({}, base, {
          type: 'branch',
          label: 'Sucursal',
          title: b,
          display: b + ' → Zona ' + z.name,
          text: 'Pertenece a la zona ' + z.name,
          kw: 'sucursal',
          zoneQuery: b,
          weight: 6
        }));
      });
    });

    add({
      group: 'zonas', cat: 'recursos', systems: [],
      type: 'page',
      label: 'Tabla y buscador',
      title: 'Sucursales por zona',
      text: D.zones.map(function (z) { return z.name + ': ' + z.branches.join(', '); }).join(' · '),
      kw: 'distribución zonas zona sucursal sucursales',
      route: '#/zonas',
      weight: 2
    });

    D.resources.forEach(function (r) {
      var sys = [];
      if (r.type === 'excel') sys.push('Excel');
      if (r.url) sys.push('SharePoint');
      if (r.path) sys.push('Explorador de Windows');
      add({
        group: 'directorio', cat: 'recursos', systems: sys,
        type: 'resource',
        label: TYPE_LABEL[r.type] || 'Recurso',
        title: r.name,
        text: [r.description, r.path || '', r.url || ''].join(' · '),
        kw: (TYPE_LABEL[r.type] || '') + ' archivo',
        route: '#/directorio/res-' + r.id,
        weight: 3
      });
    });

    D.contacts.forEach(function (c) {
      add({
        group: 'directorio', cat: 'recursos', systems: ['Correo'],
        type: 'contact',
        label: c.isAccount ? 'Cuenta' : 'Correo',
        title: c.name,
        text: c.email + ' · ' + c.role,
        kw: 'correo email contacto',
        route: '#/directorio/con-' + c.id,
        weight: 3
      });
    });

    D.systems.forEach(function (s) {
      add({
        group: 'sistemas', cat: 'sistemas', systems: [s.name],
        type: 'system',
        label: s.kind,
        title: s.name,
        text: [s.description, s.url || '', s.ip || '', s.pending || ''].join(' · '),
        kw: 'sistema acceso',
        route: s.page ? '#/sistemas/' + s.id : (s.id === 'vpn' ? '#/procedimientos/vpn' : '#/directorio/sys-' + s.id),
        weight: 5
      });
    });
  }

  var STOP = {};
  ['de', 'del', 'la', 'el', 'los', 'las', 'y', 'e', 'o', 'u', 'en', 'a', 'al', 'un', 'una', 'por', 'para', 'con', 'que', 'se', 'lo', 'mi', 'como'].forEach(function (w) { STOP[w] = true; });

  function tokenizeAll(q) {
    var seen = {};
    return CM.norm(q).split(/[\s,;]+/).filter(function (t) {
      if (!t || seen[t]) return false;
      seen[t] = true;
      return true;
    });
  }

  function tokenize(q) {
    var all = tokenizeAll(q);
    var main = all.filter(function (t) { return !STOP[t]; });
    return main.length ? main : all;
  }

  function atWordStart(hay, tok) {
    var i = hay.indexOf(tok);
    while (i !== -1) {
      if (i === 0 || /[^a-z0-9]/.test(hay[i - 1])) return true;
      i = hay.indexOf(tok, i + 1);
    }
    return false;
  }

  function score(e, tokens, phrase) {
    var s = 0;
    for (var i = 0; i < tokens.length; i++) {
      var t = tokens[i];
      if (e.n.indexOf(t) === -1) return -1;
      if (e.nt.indexOf(t) !== -1) s += 10 + (atWordStart(e.nt, t) ? 5 : 0);
      else if (e.nk.indexOf(t) !== -1) s += 6 + (atWordStart(e.nk, t) ? 2 : 0);
      else s += 2 + (atWordStart(e.n, t) ? 1 : 0);
    }
    if (tokens.length > 1 && e.n.indexOf(phrase) !== -1) s += 8;
    if (e.nt === phrase) s += 16;
    return s + e.weight;
  }

  function groupMeta(key) {
    if (key === 'directorio') return { title: 'Directorio de enlaces', href: '#/directorio', icon: 'link', meta: 'Archivos, carpetas y correos', desc: '' };
    if (key === 'zonas') return { title: 'Distribución de zonas', href: '#/zonas', icon: 'pin', meta: 'Recursos', desc: '' };
    if (key === 'sistemas') return { title: 'Accesos y herramientas', href: '#/herramientas', icon: 'key', meta: 'Sistemas', desc: '' };
    var p = CM.procById[key];
    return {
      title: p.title,
      href: '#/procedimientos/' + p.id,
      icon: p.icon,
      meta: CM.catById[p.category].name + ' · ' + p.systems.join(', '),
      desc: p.summary
    };
  }

  function run(query, filters) {
    filters = filters || {};
    var tokens = tokenize(query);
    if (!tokens.length) return { tokens: tokens, groups: [], total: 0 };
    var phrase = tokenizeAll(query).join(' ');
    var groups = {};
    var total = 0;
    entries.forEach(function (e) {
      if (filters.cat && e.cat !== filters.cat) return;
      if (filters.sys && (!e.systems || e.systems.indexOf(filters.sys) === -1)) return;
      var s = score(e, tokens, phrase);
      if (s < 0) return;
      total++;
      var g = groups[e.group] || (groups[e.group] = { key: e.group, hits: [], head: null, best: 0 });
      if (e.type === 'proc') g.head = { entry: e, score: s };
      else g.hits.push({ entry: e, score: s });
      if (s > g.best) g.best = s;
    });
    var list = Object.keys(groups).map(function (k) {
      var g = groups[k];
      g.hits.sort(function (a, b) {
        return (b.score - a.score) || ((a.entry.order || 0) - (b.entry.order || 0));
      });
      g.rank = g.best + Math.min(g.hits.length, 6) + (g.head ? 4 : 0) - (CM.procById[k] ? 0 : 12);
      g.meta = groupMeta(k);
      return g;
    });
    list.sort(function (a, b) {
      return (b.rank - a.rank) || ((orderIndex[a.key] == null ? 99 : orderIndex[a.key]) - (orderIndex[b.key] == null ? 99 : orderIndex[b.key]));
    });
    return { tokens: tokens, groups: list, total: total };
  }

  function hitHtml(h, tokens, idx) {
    var e = h.entry;
    var title = e.display || e.title;
    var body = '';
    if (title) body += '<span class="sr-title">' + CM.highlight(title, tokens) + '</span>';
    if (e.text && e.type !== 'phase') body += '<span class="sr-snippet">' + CM.snippet(e.text, tokens, 160) + '</span>';
    return '<a class="sr-item sr-hit" role="option" id="sr-opt-' + idx + '" href="' + CM.esc(e.route) + '"' +
      (e.zoneQuery ? ' data-zone="' + CM.esc(e.zoneQuery) + '"' : '') + '>' +
      (e.label ? '<span class="sr-hit-label">' + CM.esc(e.label) + '</span>' : '') + body + '</a>';
  }

  function renderGroups(result, opts) {
    opts = opts || {};
    var maxGroups = opts.maxGroups || 30;
    var maxHits = opts.maxHits == null ? 3 : opts.maxHits;
    var idx = 0;
    return result.groups.slice(0, maxGroups).map(function (g) {
      var m = g.meta;
      var html = '<div class="sr-group" role="group" aria-label="' + CM.esc(m.title) + '">';
      html += '<a class="sr-item sr-head" role="option" id="sr-opt-' + (idx++) + '" href="' + CM.esc(m.href) + '">' +
        '<span class="card-icon">' + CM.icon(m.icon) + '</span>' +
        '<span class="sr-head-text"><span class="sr-title">' + CM.highlight(m.title, result.tokens) + '</span>' +
        '<span class="sr-meta">' + CM.esc(m.meta) + '</span>' +
        (m.desc && !opts.compact ? '<span class="sr-desc">' + CM.highlight(m.desc, result.tokens) + '</span>' : '') +
        '</span></a>';
      g.hits.slice(0, maxHits).forEach(function (h) { html += hitHtml(h, result.tokens, idx++); });
      var rest = g.hits.length - maxHits;
      if (rest > 0 && !opts.compact) {
        html += '<a class="sr-more" href="' + CM.esc(m.href) + '" tabindex="-1">+' + rest + ' coincidencia' + (rest === 1 ? '' : 's') + ' más en esta sección</a>';
      }
      return html + '</div>';
    }).join('');
  }

  var modal, input, results, statusEl, filterCat, filterSys;
  var filters = { cat: null, sys: null };
  var active = -1;
  var lastFocus = null;

  function options() { return Array.prototype.slice.call(results.querySelectorAll('.sr-item')); }

  function setActive(i, scroll) {
    var opts = options();
    if (!opts.length) { active = -1; input.removeAttribute('aria-activedescendant'); return; }
    if (i < 0) i = opts.length - 1;
    if (i >= opts.length) i = 0;
    opts.forEach(function (o) { o.classList.remove('is-active'); o.setAttribute('aria-selected', 'false'); });
    active = i;
    var el = opts[i];
    el.classList.add('is-active');
    el.setAttribute('aria-selected', 'true');
    input.setAttribute('aria-activedescendant', el.id);
    if (scroll) el.scrollIntoView({ block: 'nearest' });
  }

  function systemsList() {
    var counts = {};
    D.procedures.forEach(function (p) { p.systems.forEach(function (s) { counts[s] = (counts[s] || 0) + 1; }); });
    return Object.keys(counts).sort(function (a, b) { return (counts[b] - counts[a]) || a.localeCompare(b, 'es'); });
  }

  function renderFilters() {
    filterCat.innerHTML = '<span class="filter-row-label">Categoría</span>' +
      chip('cat', null, 'Todas') + D.categories.map(function (c) { return chip('cat', c.id, c.name); }).join('');
    filterSys.innerHTML = '<span class="filter-row-label">Sistema</span>' +
      chip('sys', null, 'Todos') + systemsList().map(function (s) { return chip('sys', s, s); }).join('');
  }

  function chip(kind, value, label) {
    var on = filters[kind] === value;
    return '<button type="button" class="chip" data-filter="' + kind + '" data-value="' + CM.esc(value || '') + '" aria-pressed="' + on + '">' + CM.esc(label) + '</button>';
  }

  function suggestedHtml() {
    var recent = CM.history.all().slice(0, 4);
    var html = '<div class="search-suggested"><h3>Búsquedas sugeridas</h3><div class="chips">' +
      D.suggested.map(function (s) { return '<button type="button" class="chip" data-suggest="' + CM.esc(s) + '">' + CM.esc(s) + '</button>'; }).join('') +
      '</div></div>';
    if (recent.length) {
      html += '<div class="search-suggested"><h3>Consultados recientemente</h3></div><div class="sr-group">' +
        recent.map(function (h, i) {
          var p = CM.procById[h.id];
          return '<a class="sr-item sr-head" role="option" id="sr-opt-' + i + '" href="#/procedimientos/' + p.id + '">' +
            '<span class="card-icon">' + CM.icon(p.icon) + '</span><span class="sr-head-text"><span class="sr-title">' + CM.esc(p.title) + '</span>' +
            '<span class="sr-meta">' + CM.esc(CM.catById[p.category].name) + '</span></span></a>';
        }).join('') + '</div>';
    }
    return html;
  }

  function render() {
    var q = input.value.trim();
    active = -1;
    input.removeAttribute('aria-activedescendant');
    if (!q) {
      statusEl.textContent = '';
      results.innerHTML = suggestedHtml();
      return;
    }
    var r = run(q, filters);
    if (!r.groups.length) {
      var filtered = filters.cat || filters.sys;
      statusEl.textContent = 'Sin resultados';
      results.innerHTML = '<div class="search-empty"><strong>Sin resultados para “' + CM.esc(q) + '”</strong>' +
        '<span>' + (filtered ? 'Hay filtros activos. Prueba quitarlos o usar otra palabra.' : 'Prueba con otra palabra: un sistema, un código, un correo, un archivo o una sucursal.') + '</span>' +
        (filtered ? '<button type="button" class="btn btn--sm" data-clear-filters>Quitar filtros</button>' : '') +
        '</div>' + suggestedHtml();
      return;
    }
    statusEl.textContent = r.total + ' coincidencia' + (r.total === 1 ? '' : 's') + ' en ' + r.groups.length + ' sección' + (r.groups.length === 1 ? '' : 'es');
    results.innerHTML = renderGroups(r, { maxHits: 3 });
    setActive(0, false);
  }

  function open(q) {
    if (!modal.hidden) { if (q != null) { input.value = q; render(); } input.focus(); return; }
    lastFocus = document.activeElement;
    modal.hidden = false;
    document.body.style.overflow = 'hidden';
    if (q != null) input.value = q;
    render();
    input.focus();
    if (q == null) input.select();
    else input.setSelectionRange(input.value.length, input.value.length);
  }

  function close(restore) {
    if (modal.hidden) return;
    modal.hidden = true;
    document.body.style.overflow = '';
    if (restore !== false && lastFocus && document.body.contains(lastFocus)) {
      try { lastFocus.focus({ preventScroll: true }); } catch (e) { lastFocus.focus(); }
    }
  }

  function trapTab(ev) {
    var f = Array.prototype.slice.call(modal.querySelectorAll('input, button, a[href]')).filter(function (el) {
      return el.offsetParent !== null && el.getAttribute('tabindex') !== '-1';
    });
    if (!f.length) return;
    var first = f[0];
    var last = f[f.length - 1];
    if (ev.shiftKey && document.activeElement === first) { ev.preventDefault(); last.focus(); }
    else if (!ev.shiftKey && document.activeElement === last) { ev.preventDefault(); first.focus(); }
  }

  function prepareNavigation(link) {
    var z = link.getAttribute('data-zone');
    if (z) CM.state.zoneQuery = z;
  }

  function initModal() {
    modal = document.getElementById('search-modal');
    input = document.getElementById('search-input');
    results = document.getElementById('search-results');
    statusEl = document.getElementById('search-status');
    filterCat = document.getElementById('filter-cat');
    filterSys = document.getElementById('filter-sys');

    renderFilters();

    document.getElementById('search-open').addEventListener('click', function () { open(); });
    document.getElementById('search-kbd').textContent = CM.isMac ? '⌘ K' : 'Ctrl K';

    input.addEventListener('input', render);

    input.addEventListener('keydown', function (ev) {
      if (ev.key === 'ArrowDown') { ev.preventDefault(); setActive(active + 1, true); }
      else if (ev.key === 'ArrowUp') { ev.preventDefault(); setActive(active - 1, true); }
      else if (ev.key === 'Enter') {
        var opts = options();
        var el = opts[active >= 0 ? active : 0];
        if (el) { ev.preventDefault(); prepareNavigation(el); close(false); CM.router.go(el.getAttribute('href')); }
      }
    });

    modal.addEventListener('keydown', function (ev) {
      if (ev.key === 'Escape') { ev.preventDefault(); close(); }
      else if (ev.key === 'Tab') trapTab(ev);
    });

    modal.addEventListener('click', function (ev) {
      if (ev.target.closest('[data-search-close]')) { close(); return; }
      var f = ev.target.closest('[data-filter]');
      if (f) {
        var kind = f.getAttribute('data-filter');
        filters[kind] = f.getAttribute('data-value') || null;
        renderFilters();
        render();
        return;
      }
      if (ev.target.closest('[data-clear-filters]')) {
        filters.cat = null; filters.sys = null;
        renderFilters(); render(); input.focus();
        return;
      }
      var s = ev.target.closest('[data-suggest]');
      if (s) { input.value = s.getAttribute('data-suggest'); render(); input.focus(); return; }
      var link = ev.target.closest('a[href^="#/"]');
      if (link) { prepareNavigation(link); close(false); }
    });

    results.addEventListener('mousemove', function (ev) {
      var item = ev.target.closest('.sr-item');
      if (!item) return;
      var i = options().indexOf(item);
      if (i !== -1 && i !== active) setActive(i, false);
    });

    document.addEventListener('keydown', function (ev) {
      if ((ev.ctrlKey || ev.metaKey) && !ev.altKey && (ev.key === 'k' || ev.key === 'K')) {
        ev.preventDefault();
        if (modal.hidden) open(); else close();
      }
    });
  }

  var inlineHide = null;
  var inlineBox = null;
  var inlineField = null;
  document.addEventListener('click', function (ev) {
    if (inlineBox && !inlineBox.hidden && document.body.contains(inlineBox) && !inlineBox.contains(ev.target) && ev.target !== inlineField) inlineHide();
  });

  function attachInline(field, box) {
    var focusIdx = -1;

    function hide() { box.hidden = true; box.innerHTML = ''; field.setAttribute('aria-expanded', 'false'); focusIdx = -1; }
    inlineHide = hide;
    inlineBox = box;
    inlineField = field;

    function show() {
      var q = field.value.trim();
      if (!q) { hide(); return; }
      var r = run(q, {});
      var html = r.groups.length
        ? renderGroups(r, { maxGroups: 5, maxHits: 1, compact: true })
        : '<div class="search-empty"><strong>Sin resultados para “' + CM.esc(q) + '”</strong><span>Prueba con otra palabra o abre la búsqueda avanzada.</span></div>';
      html += '<button type="button" class="hero-suggest-all" data-open-full><span>' +
        (r.groups.length ? 'Ver todos los resultados (' + r.total + ') y filtrar' : 'Abrir búsqueda con filtros') +
        '</span><kbd>Enter</kbd></button>';
      box.innerHTML = html.replace(/ id="sr-opt-\d+"/g, '');
      box.hidden = false;
      field.setAttribute('aria-expanded', 'true');
      focusIdx = -1;
    }

    function items() { return Array.prototype.slice.call(box.querySelectorAll('.sr-item, [data-open-full]')); }

    function moveFocus(d) {
      var list = items();
      if (!list.length) return;
      focusIdx = (focusIdx + d + list.length) % list.length;
      list[focusIdx].focus();
    }

    field.addEventListener('input', show);
    field.addEventListener('focus', function () { if (field.value.trim()) show(); });
    field.addEventListener('keydown', function (ev) {
      if (ev.key === 'ArrowDown') { ev.preventDefault(); if (box.hidden) show(); moveFocus(1); }
      else if (ev.key === 'Enter') { ev.preventDefault(); var q = field.value; hide(); open(q); }
      else if (ev.key === 'Escape') { hide(); }
    });
    box.addEventListener('keydown', function (ev) {
      if (ev.key === 'ArrowDown') { ev.preventDefault(); moveFocus(1); }
      else if (ev.key === 'ArrowUp') {
        ev.preventDefault();
        if (focusIdx <= 0) { focusIdx = -1; field.focus(); } else moveFocus(-1);
      } else if (ev.key === 'Escape') { hide(); field.focus(); }
    });
    box.addEventListener('click', function (ev) {
      if (ev.target.closest('[data-open-full]')) { var q = field.value; hide(); open(q); return; }
      var link = ev.target.closest('a[href^="#/"]');
      if (link) { prepareNavigation(link); hide(); }
    });
  }

  buildIndex();

  CM.search = {
    run: run,
    open: open,
    close: close,
    init: initModal,
    attachInline: attachInline,
    isOpen: function () { return modal && !modal.hidden; },
    entries: function () { return entries; }
  };
})();
