(function () {
  'use strict';

  var CM = window.CM;
  var D = CM.data;
  var view;
  var spy = null;
  var SUFFIX = ' · Manual de procedimientos · Construmac';

  var KIND = {
    url: { label: 'URL web', icon: 'globe', toast: 'Enlace' },
    path: { label: 'Ruta de Windows', icon: 'folder', toast: 'Ruta' },
    email: { label: 'Correo', icon: 'mail', toast: 'Correo' },
    account: { label: 'Cuenta', icon: 'user', toast: 'Cuenta' },
    code: { label: 'Código', icon: 'hash', toast: null },
    ip: { label: 'Dirección IP', icon: 'monitor', toast: 'IP' },
    example: { label: 'Ejemplo', icon: 'info', toast: 'Ejemplo' },
    formula: { label: 'Fórmula', icon: 'hash', toast: 'Fórmula' }
  };

  var RES_TYPE = {
    excel: { label: 'Archivo de Excel', icon: 'excel' },
    carpeta: { label: 'Carpeta', icon: 'folder' },
    video: { label: 'Video', icon: 'video' }
  };

  var SYS_BY_NAME = {};
  D.systems.forEach(function (s) { SYS_BY_NAME[s.name] = s; });

  function esc(s) { return CM.esc(s); }
  function icon(n, c) { return CM.icon(n, c); }

  function copyBtn(value, label, toastLabel, extraClass) {
    return '<button type="button" class="btn btn--sm' + (extraClass ? ' ' + extraClass : '') + '" data-copy="' + esc(value) + '" data-copy-label="' + esc(toastLabel || 'Texto') + '">' +
      icon('copy') + '<span>' + esc(label) + '</span></button>';
  }

  function openBtn(href, label, primary) {
    return '<a class="btn btn--sm' + (primary ? ' btn--primary' : '') + '" href="' + esc(href) + '" target="_blank" rel="noopener noreferrer">' +
      icon('external') + '<span>' + esc(label || 'Abrir') + '</span><span class="sr-only"> (se abre en una pestaña nueva)</span></a>';
  }

  function mailBtn(to, cc, label) {
    var href = 'mailto:' + to.join(',') + (cc && cc.length ? '?cc=' + cc.join(',') : '');
    return '<a class="btn btn--sm" href="' + esc(href) + '">' + icon('mail') + '<span>' + esc(label || 'Redactar correo') + '</span></a>';
  }

  function valueHtml(v) {
    var k = KIND[v.k] || KIND.code;
    var shown = esc(v.value);
    if (v.k === 'email' || v.k === 'account') shown = '<a href="mailto:' + esc(v.value) + '">' + esc(v.value) + '</a>';
    var actions = '';
    if (v.k === 'url') actions += openBtn(v.value, 'Abrir', true);
    if (v.k === 'email') actions += mailBtn([v.value], null, 'Redactar');
    actions += copyBtn(v.value, v.copyLabel || 'Copiar', k.toast || v.label);
    var hint = '';
    if (v.k === 'path') hint = '<span class="val-hint">Pégala en la barra de direcciones del Explorador de archivos. Puede variar según el usuario de Windows o la sincronización de OneDrive.</span>';
    if (v.k === 'url') hint = '<span class="val-hint">Puede pedir inicio de sesión con tu cuenta corporativa.</span>';
    if (v.k === 'example') hint = '<span class="val-hint">Formato de referencia; no es un valor real.</span>';
    return '<div class="val val--' + v.k + '">' +
      '<div class="val-main"><div class="val-head"><span class="val-kind val-kind--' + v.k + '">' + icon(k.icon) + esc(k.label) + '</span>' +
      '<span class="val-label">' + esc(v.label) + '</span></div>' +
      '<div class="val-value">' + shown + '</div>' + hint + '</div>' +
      '<div class="val-actions">' + actions + '</div></div>';
  }

  var NOTE = {
    warn: { icon: 'alert', label: 'Advertencia' },
    pending: { icon: 'help', label: 'Información pendiente de confirmar' },
    info: { icon: 'info', label: 'Nota' }
  };

  function noteHtml(type, text) {
    var n = NOTE[type] || NOTE.info;
    return '<div class="note note--' + type + '">' + icon(n.icon) + '<div><span class="note-label">' + n.label + '</span>' + CM.md(text) + '</div></div>';
  }

  function tableHtml(t) {
    return '<div class="table-wrap"><table>' + (t.caption ? '<caption>' + esc(t.caption) + '</caption>' : '') +
      '<thead><tr>' + t.head.map(function (h) { return '<th scope="col">' + esc(h) + '</th>'; }).join('') + '</tr></thead><tbody>' +
      t.rows.map(function (r) { return '<tr>' + r.map(function (c) { return '<td class="mono">' + esc(c) + '</td>'; }).join('') + '</tr>'; }).join('') +
      '</tbody></table></div>';
  }

  function zonesHtml(prefix) {
    var id = prefix + 'zone-q';
    return '<div class="zones" data-zones' + (prefix ? '' : ' id="sec-zonas"') + '>' +
      '<div class="zone-finder"><label for="' + id + '">Buscar la zona de una sucursal</label>' +
      '<div class="zone-input">' + icon('pin') + '<input id="' + id + '" type="search" autocomplete="off" placeholder="Ej. Guadalajara" data-zone-input></div>' +
      '<div class="zone-result" role="status" aria-live="polite" data-zone-result>Escribe el nombre de una sucursal para ver su zona.</div></div>' +
      '<div class="table-wrap"><table class="zone-table"><caption>Distribución documentada de sucursales por zona</caption>' +
      '<thead><tr><th scope="col">Zona</th><th scope="col">Sucursales</th></tr></thead><tbody>' +
      D.zones.map(function (z) {
        return '<tr data-zone-row="' + z.id + '"><td>' + esc(z.name) + '</td><td><div class="zone-chips">' +
          z.branches.map(function (b) {
            return '<button type="button" class="chip zone-chip" data-zone-pick="' + esc(b) + '">' + esc(b) + '</button>';
          }).join('') + '</div></td></tr>';
      }).join('') + '</tbody></table></div></div>';
  }

  function zoneLookup(q) {
    var nq = CM.norm(q).trim();
    if (!nq) return null;
    var exact = [];
    var partial = [];
    D.zones.forEach(function (z) {
      z.branches.forEach(function (b) {
        var nb = CM.norm(b);
        if (nb === nq) exact.push({ b: b, z: z });
        else if (nb.indexOf(nq) !== -1 || nq.indexOf(nb) !== -1) partial.push({ b: b, z: z });
      });
    });
    return { exact: exact, partial: partial };
  }

  function updateZones(root, q) {
    var res = root.querySelector('[data-zone-result]');
    var r = zoneLookup(q);
    var hits = [];
    if (!r) {
      res.innerHTML = 'Escribe el nombre de una sucursal para ver su zona.';
    } else if (r.exact.length) {
      hits = r.exact;
      res.innerHTML = '<strong>' + esc(r.exact[0].b) + '</strong> pertenece a la zona <strong>' + esc(r.exact[0].z.name) + '</strong>.';
    } else if (r.partial.length) {
      hits = r.partial;
      res.innerHTML = 'Coincidencias: ' + r.partial.map(function (h) { return '<strong>' + esc(h.b) + '</strong> → ' + esc(h.z.name); }).join(' · ');
    } else {
      res.innerHTML = '<span class="is-missing">Sucursal no encontrada en la distribución documentada</span>';
    }
    var hitBranches = hits.map(function (h) { return h.b; });
    var hitZones = hits.map(function (h) { return h.z.id; });
    Array.prototype.forEach.call(root.querySelectorAll('[data-zone-pick]'), function (c) {
      c.classList.toggle('is-hit', hitBranches.indexOf(c.getAttribute('data-zone-pick')) !== -1);
    });
    Array.prototype.forEach.call(root.querySelectorAll('[data-zone-row]'), function (row) {
      row.classList.toggle('is-hit', hitZones.indexOf(row.getAttribute('data-zone-row')) !== -1);
    });
  }

  function videosHtml() {
    return '<div class="video-list">' + D.resources.filter(function (r) { return r.type === 'video'; }).map(function (r) {
      return '<div class="video-card"><span class="video-thumb">' + icon('play', 'icon--fill') + '</span>' +
        '<div class="video-info"><strong>' + esc(r.name) + '</strong><span>' + esc(r.description) + '</span></div>' +
        '<div class="val-actions">' + openBtn(r.url, 'Abrir en SharePoint', true) + copyBtn(r.url, 'Copiar enlace', 'Enlace') + '</div></div>';
    }).join('') + '</div>';
  }

  function stepHtml(p, st, ctx) {
    var prefix = ctx === 'guided' ? 'g-' : '';
    var h = '<li class="step"' + (ctx === 'full' ? ' id="sec-' + st.anchor + '"' : '') + '>';
    h += '<div class="step-num" aria-hidden="true"><span>' + st.number + '</span></div>';
    h += '<div class="step-body"><p class="step-label">Paso ' + st.number + '</p><div class="step-text">' + CM.md(st.t) + '</div>';
    if (st.v && st.v.length) h += '<div class="vals">' + st.v.map(valueHtml).join('') + '</div>';
    if (st.compose || st.copyAll) {
      h += '<div class="compose-row">' +
        (st.compose ? mailBtn(st.compose.to, st.compose.cc, st.compose.label) : '') +
        (st.copyAll ? copyBtn(st.copyAll.value, st.copyAll.label, 'Correos') : '') + '</div>';
    }
    if (st.table) h += tableHtml(st.table);
    if (st.component === 'zones') h += zonesHtml(prefix);
    if (st.component === 'videos') h += videosHtml();
    if (st.warn) h += noteHtml('warn', st.warn);
    if (st.pend) h += noteHtml('pending', st.pend);
    if (st.note) h += noteHtml('info', st.note);
    h += '</div>';
    return h + '</li>';
  }

  function procedureLinks(ids, exclude) {
    return ids.filter(function (id) { return id !== exclude && CM.procById[id]; }).map(function (id) {
      return '<a href="#/procedimientos/' + id + '">' + esc(CM.procById[id].title) + '</a>';
    }).join(', ');
  }

  function resourceHtml(r, opts) {
    opts = opts || {};
    var t = RES_TYPE[r.type] || RES_TYPE.carpeta;
    var actions = '';
    if (r.url) actions += openBtn(r.url, 'Abrir recurso', true) + copyBtn(r.url, 'Copiar enlace', 'Enlace');
    if (r.path) actions += copyBtn(r.path, 'Copiar ruta', 'Ruta');
    var lines = '';
    if (r.url) lines += '<div class="res-line"><span class="res-line-label">URL web</span><span class="val-value">' + esc(r.url) + '</span></div>';
    if (r.path) lines += '<div class="res-line"><span class="res-line-label">Ruta de Windows' + (r.pathLabel ? ' · ' + esc(r.pathLabel) : '') + '</span><span class="val-value">' + esc(r.path) + '</span></div>';
    var procs = procedureLinks(r.procs, opts.exclude);
    var text = CM.norm([r.name, r.description, r.url || '', r.path || '', t.label].join(' '));
    return '<article class="res"' + (opts.anchor ? ' id="sec-res-' + r.id + '"' : '') + ' data-dir-item data-type="' + r.type + '" data-text="' + esc(text) + '">' +
      '<span class="res-icon">' + icon(t.icon) + '</span><div class="res-body">' +
      '<div class="res-title">' + esc(r.name) + '<span class="tag tag--outline">' + esc(t.label) + '</span></div>' +
      '<p class="res-desc">' + esc(r.description) + '</p>' + lines +
      '<div class="res-actions">' + actions + '</div>' +
      (procs ? '<div class="res-procs">' + (opts.exclude ? 'También se usa en: ' : 'Se usa en: ') + procs + '</div>' : '') +
      '</div></article>';
  }

  function contactHtml(c, opts) {
    opts = opts || {};
    var procs = procedureLinks(c.procs, opts.exclude);
    var text = CM.norm([c.name, c.email, c.role].join(' '));
    return '<article class="res"' + (opts.anchor ? ' id="sec-con-' + c.id + '"' : '') + ' data-dir-item data-type="correo" data-text="' + esc(text) + '">' +
      '<span class="res-icon">' + icon(c.isAccount ? 'user' : 'mail') + '</span><div class="res-body">' +
      '<div class="res-title">' + esc(c.name) + '<span class="tag tag--outline">' + (c.isAccount ? 'Cuenta' : 'Correo') + '</span></div>' +
      '<p class="res-desc">' + esc(c.role) + '</p>' +
      '<div class="res-line"><span class="res-line-label">Correo</span><span class="val-value"><a href="mailto:' + esc(c.email) + '">' + esc(c.email) + '</a></span></div>' +
      '<div class="res-actions">' + mailBtn([c.email], null, 'Redactar correo') + copyBtn(c.email, 'Copiar correo', 'Correo') + '</div>' +
      (procs ? '<div class="res-procs">' + (opts.exclude ? 'También se usa en: ' : 'Se usa en: ') + procs + '</div>' : '') +
      '</div></article>';
  }

  function systemHtml(s, opts) {
    opts = opts || {};
    var actions = '';
    if (s.url) actions += openBtn(s.url, 'Abrir ' + s.name, true) + copyBtn(s.url, 'Copiar enlace', 'Enlace');
    if (s.ip) actions += copyBtn(s.ip, 'Copiar IP', 'IP');
    if (s.page) actions += '<a class="btn btn--sm btn--ghost" href="#/sistemas/' + s.id + '">' + icon('arrow-right') + '<span>Pasos de acceso</span></a>';
    if (s.id === 'vpn') actions += '<a class="btn btn--sm btn--ghost" href="#/procedimientos/vpn">' + icon('arrow-right') + '<span>Ver procedimiento</span></a>';
    var lines = '';
    if (s.url) lines += '<div class="res-line"><span class="res-line-label">URL web</span><span class="val-value">' + esc(s.url) + '</span></div>';
    if (s.ip) lines += '<div class="res-line"><span class="res-line-label">Dirección VPN</span><span class="val-value">' + esc(s.ip) + '</span></div>';
    var pending = s.pending ? noteHtml('pending', s.pending) : '';
    var procs = procedureLinks(s.procs, opts.exclude);
    var text = CM.norm([s.name, s.kind, s.description, s.url || '', s.ip || '', s.pending || ''].join(' '));
    return '<article class="res"' + (opts.anchor ? ' id="sec-sys-' + s.id + '"' : '') + ' data-dir-item data-type="sistema" data-text="' + esc(text) + '">' +
      '<span class="res-icon">' + icon(s.icon) + '</span><div class="res-body">' +
      '<div class="res-title">' + esc(s.name) + '<span class="tag tag--outline">' + esc(s.kind) + '</span></div>' +
      '<p class="res-desc">' + esc(s.description) + '</p>' + lines + pending +
      (actions ? '<div class="res-actions">' + actions + '</div>' : '') +
      (procs ? '<div class="res-procs">' + (opts.exclude ? 'También se usa en: ' : 'Se usa en: ') + procs + '</div>' : '') +
      '</div></article>';
  }

  function sysTags(p) {
    return p.systems.map(function (s) { return '<span class="tag">' + esc(s) + '</span>'; }).join('');
  }

  function procCard(p) {
    var cat = CM.catById[p.category];
    return '<a class="card" href="#/procedimientos/' + p.id + '">' +
      '<div class="card-top"><span class="card-icon">' + icon(p.icon) + '</span>' + icon('arrow-right', 'card-arrow') + '</div>' +
      '<div><div class="card-cat">' + esc(cat.name) + '</div><div class="card-title">' + esc(CM.procTitle(p)) + '</div></div>' +
      '<p class="card-desc">' + esc(p.summary) + '</p>' +
      '<div class="card-meta">' + (p.frequency ? '<span class="tag tag--red">' + icon('clock') + esc(p.frequency.split(' · ')[0]) + '</span>' : '') +
      '<span class="tag">' + p.totalSteps + ' pasos</span></div>' +
      '</a>';
  }

  function favButton(p, small) {
    var on = CM.favs.has(p.id);
    var label = (on ? 'Quitar de favoritos: ' : 'Agregar a favoritos: ') + p.title;
    return '<button type="button" class="btn ' + (small ? 'btn--sm btn--ghost ' : '') + 'btn--fav" data-fav="' + p.id + '" aria-pressed="' + on + '" aria-label="' + esc(label) + '" title="' + esc(on ? 'Quitar de favoritos' : 'Agregar a favoritos') + '">' +
      icon('star') + (small ? '' : '<span data-fav-text>' + (on ? 'En favoritos' : 'Agregar a favoritos') + '</span>') + '</button>';
  }

  function procRow(p) {
    return '<li class="proc-row" data-row="' + p.id + '">' +
      '<span class="card-icon">' + icon(p.icon) + '</span>' +
      '<div class="proc-row-main"><a class="proc-row-title" href="#/procedimientos/' + p.id + '">' + esc(p.title) + '</a>' +
      '<p class="proc-row-desc">' + esc(p.summary) + '</p>' +
      '<div class="proc-row-meta">' + (p.frequency ? '<span class="tag tag--red">' + icon('clock') + esc(p.frequency) + '</span>' : '') + sysTags(p) +
      '<span class="tag tag--outline">' + p.phases.length + ' fase' + (p.phases.length === 1 ? '' : 's') + ' · ' + p.totalSteps + ' pasos</span></div></div>' +
      favButton(p, true) + '</li>';
  }

  function crumbs(items) {
    return '<nav class="breadcrumbs" aria-label="Ruta de navegación"><ol>' + items.map(function (it, i) {
      var last = i === items.length - 1;
      return '<li>' + (last ? '<span aria-current="page">' + esc(it.label) + '</span>' : '<a href="' + it.href + '">' + esc(it.label) + '</a>') + '</li>';
    }).join('') + '</ol></nav>';
  }

  function viewHome() {
    var quick = D.quick.map(function (id) { return procCard(CM.procById[id]); }).join('');
    var secondary = D.secondary.map(function (id) {
      var p = CM.procById[id];
      return '<a class="card card--wide" href="#/procedimientos/' + p.id + '"><span class="card-icon">' + icon(p.icon) + '</span>' +
        '<span class="card-body"><span class="card-title">' + esc(p.title) + '</span><span class="card-desc">' + esc(p.summary) + '</span></span>' + icon('arrow-right', 'card-arrow') + '</a>';
    }).join('') +
      '<a class="card card--wide" href="#/directorio"><span class="card-icon">' + icon('link') + '</span>' +
      '<span class="card-body"><span class="card-title">Directorio de enlaces</span><span class="card-desc">Sistemas, archivos, carpetas y correos en un solo lugar.</span></span>' + icon('arrow-right', 'card-arrow') + '</a>' +
      '<a class="card card--wide" href="#/zonas"><span class="card-icon">' + icon('pin') + '</span>' +
      '<span class="card-body"><span class="card-title">Distribución de zonas</span><span class="card-desc">Sucursales por zona: Centro, Noroeste, Noreste, Occidente y Sureste.</span></span>' + icon('arrow-right', 'card-arrow') + '</a>';

    var favs = CM.favs.all();
    var favHtml = favs.length
      ? '<ul class="mini-list">' + favs.map(function (id) {
        var p = CM.procById[id];
        return '<li class="mini-item"><a href="#/procedimientos/' + id + '">' + esc(p.title) + '<span class="mini-sub">' + esc(CM.catById[p.category].name) + '</span></a></li>';
      }).join('') + '</ul>'
      : '<div class="empty"><strong>Aún no tienes favoritos</strong><span>Abre un procedimiento y presiona “Agregar a favoritos” para tenerlo a la mano aquí.</span></div>';

    var hist = CM.history.all().slice(0, 5);
    var histHtml = hist.length
      ? '<ul class="mini-list">' + hist.map(function (h) {
        var p = CM.procById[h.id];
        return '<li class="mini-item"><a href="#/procedimientos/' + h.id + '">' + esc(p.title) + '<span class="mini-sub">' + esc(CM.timeAgo(h.ts)) + '</span></a></li>';
      }).join('') + '</ul>'
      : '<div class="empty"><strong>Sin consultas recientes</strong><span>Los últimos procedimientos que abras aparecerán aquí.</span></div>';

    return '<div data-page="home">' +
      '<section class="hero" aria-labelledby="home-title"><span class="hero-deco" aria-hidden="true"></span>' +
      '<h1 class="hero-title" id="home-title">MANUAL DE PROCEDIMIENTOS</h1>' +
      '<p class="hero-sub">Construmac | Guía operativa interna</p>' +
      '<p class="hero-desc">Encuentra procedimientos, herramientas, archivos y accesos necesarios para realizar tus actividades</p>' +
      '<div class="hero-search">' +
      '<div class="hero-search-field">' + icon('search') +
      '<input id="home-search" type="search" placeholder="¿Qué necesitas hacer?" autocomplete="off" spellcheck="false" aria-label="Buscar en el manual" aria-controls="home-suggest" aria-expanded="false">' +
      '<kbd class="search-trigger-kbd">' + (CM.isMac ? '⌘ K' : 'Ctrl K') + '</kbd></div>' +
      '<div class="hero-suggest" id="home-suggest" hidden></div></div>' +
      '<div class="hero-chips"><span class="hero-chips-label">Búsquedas frecuentes:</span>' +
      D.suggested.slice(0, 6).map(function (s) { return '<button type="button" class="chip" data-search-term="' + esc(s) + '">' + esc(s) + '</button>'; }).join('') +
      '</div></section>' +
      '<section class="section" aria-labelledby="quick-title"><div class="section-head"><h2 class="section-title" id="quick-title">Accesos rápidos</h2>' +
      '<a href="#/procedimientos" class="section-sub">Ver todos los procedimientos</a></div><div class="card-grid">' + quick + '</div></section>' +
      '<section class="section" aria-labelledby="res-title"><div class="section-head"><h2 class="section-title" id="res-title">Recursos</h2></div><div class="card-grid card-grid--wide">' + secondary + '</div></section>' +
      '<section class="section home-cols">' +
      '<div class="panel"><h2 class="panel-title">' + icon('star') + 'Favoritos</h2>' + favHtml + '</div>' +
      '<div class="panel"><h2 class="panel-title">' + icon('history') + 'Consultados recientemente</h2>' + histHtml + '</div>' +
      '</section></div>';
  }

  function viewList(catId) {
    var cats = D.categories.filter(function (c) { return !catId || c.id === catId; });
    var chips = '<a class="chip" href="#/procedimientos" aria-pressed="' + !catId + '">Todas</a>' + D.categories.map(function (c) {
      return '<a class="chip" href="#/categoria/' + c.id + '" aria-pressed="' + (c.id === catId) + '">' + esc(c.name) + '</a>';
    }).join('');
    var groups = cats.map(function (c) {
      var ps = D.order.map(function (id) { return CM.procById[id]; }).filter(function (p) { return p.category === c.id; });
      if (!ps.length) return '';
      return '<section class="proc-group"><h2 class="proc-group-title">' + icon(c.icon) + esc(c.name) + '</h2><ul class="proc-rows">' + ps.map(procRow).join('') + '</ul></section>';
    }).join('');
    var cat = catId ? CM.catById[catId] : null;
    return '<div data-page="list">' +
      crumbs(cat ? [{ label: 'Inicio', href: '#/' }, { label: 'Todos los procedimientos', href: '#/procedimientos' }, { label: cat.name }] : [{ label: 'Inicio', href: '#/' }, { label: 'Todos los procedimientos' }]) +
      '<header class="page-head"><h1>' + (cat ? esc(cat.name) : 'Todos los procedimientos') + '</h1>' +
      '<p class="lead">' + D.procedures.length + ' procedimientos documentados. Cada uno inicia desde el paso cero e incluye sus propios accesos.</p></header>' +
      '<nav class="filter-bar" aria-label="Filtrar por categoría">' + chips + '</nav>' + groups + '</div>';
  }

  function viewFavorites() {
    var favs = CM.favs.all();
    return '<div data-page="favorites">' + crumbs([{ label: 'Inicio', href: '#/' }, { label: 'Favoritos' }]) +
      '<header class="page-head"><h1>Favoritos</h1><p class="lead">Procedimientos marcados con la estrella. Se guardan solo en este navegador.</p></header>' +
      (favs.length
        ? '<ul class="proc-rows">' + favs.map(function (id) { return procRow(CM.procById[id]); }).join('') + '</ul>'
        : '<div class="panel"><div class="empty"><strong>Aún no tienes favoritos</strong><span>Abre cualquier procedimiento y presiona “Agregar a favoritos”.</span><a class="btn btn--sm" href="#/procedimientos">' + icon('list') + '<span>Ver todos los procedimientos</span></a></div></div>') +
      '</div>';
  }

  function viewTools() {
    var files = D.resources.filter(function (r) { return r.type === 'excel'; });
    return '<div data-page="tools">' + crumbs([{ label: 'Inicio', href: '#/' }, { label: 'Accesos y herramientas' }]) +
      '<header class="page-head"><span class="eyebrow">' + icon('key') + 'Inicio</span><h1>Accesos y herramientas</h1>' +
      '<p class="lead">Sistemas que se usan en los procedimientos. Los enlaces privados pueden pedir inicio de sesión con tu cuenta corporativa; eso es normal.</p></header>' +
      '<div class="res-list">' + D.systems.map(function (s) { return systemHtml(s); }).join('') + '</div>' +
      '<section class="section"><div class="section-head"><h2 class="section-title">Archivos de Excel principales</h2><a class="section-sub" href="#/directorio">Ver directorio completo</a></div>' +
      '<div class="res-list">' + files.map(function (r) { return resourceHtml(r); }).join('') + '</div></section></div>';
  }

  function viewDirectory() {
    var types = [
      { id: '', label: 'Todos' }, { id: 'sistema', label: 'Sistemas' }, { id: 'excel', label: 'Archivos de Excel' },
      { id: 'carpeta', label: 'Carpetas' }, { id: 'video', label: 'Videos' }, { id: 'correo', label: 'Correos' }
    ];
    return '<div data-page="directory">' + crumbs([{ label: 'Inicio', href: '#/' }, { label: 'Recursos', href: '#/categoria/recursos' }, { label: 'Directorio de enlaces' }]) +
      '<header class="page-head"><span class="eyebrow">' + icon('link') + 'Recursos</span><h1>Directorio de enlaces</h1>' +
      '<p class="lead">Todos los sistemas, archivos, carpetas y correos que aparecen en los procedimientos.</p></header>' +
      '<div class="notes-stack" style="margin-bottom:20px">' +
      noteHtml('info', 'Las rutas de Windows (C:\\Users\\…) no se pueden abrir desde el navegador: cópialas y pégalas en el Explorador de archivos. El usuario “' + ((/Users\\([^\\]+)/.exec(D.paths.base) || [])[1] || '') + '” corresponde al equipo de referencia y puede variar. Los enlaces de SharePoint, Extend y CRM pueden pedir inicio de sesión corporativo.') +
      '</div>' +
      '<div class="dir-tools"><div class="dir-search">' + icon('search') + '<input type="search" placeholder="Filtrar por nombre, correo, ruta o URL" aria-label="Filtrar el directorio" data-dir-search autocomplete="off"></div>' +
      '<div class="filter-bar" role="group" aria-label="Filtrar por tipo">' + types.map(function (t) {
        return '<button type="button" class="chip" data-dir-type="' + t.id + '" aria-pressed="' + (t.id === '') + '">' + esc(t.label) + '</button>';
      }).join('') + '</div><p class="dir-count" role="status" aria-live="polite" data-dir-count></p></div>' +
      '<section class="section dir-section" data-dir-section><div class="section-head"><h2 class="section-title">Sistemas</h2></div><div class="res-list">' +
      D.systems.map(function (s) { return systemHtml(s, { anchor: true }); }).join('') + '</div></section>' +
      '<section class="section dir-section" data-dir-section><div class="section-head"><h2 class="section-title">Archivos y carpetas</h2></div><div class="res-list">' +
      D.resources.map(function (r) { return resourceHtml(r, { anchor: true }); }).join('') + '</div></section>' +
      '<section class="section dir-section" data-dir-section><div class="section-head"><h2 class="section-title">Correos</h2></div><div class="res-list">' +
      D.contacts.map(function (c) { return contactHtml(c, { anchor: true }); }).join('') + '</div></section></div>';
  }

  function filterDirectory() {
    var root = view.querySelector('[data-page="directory"]');
    if (!root) return;
    var q = CM.norm(root.querySelector('[data-dir-search]').value).trim();
    var typeBtn = root.querySelector('[data-dir-type][aria-pressed="true"]');
    var type = typeBtn ? typeBtn.getAttribute('data-dir-type') : '';
    var tokens = q ? q.split(/\s+/) : [];
    var shown = 0;
    Array.prototype.forEach.call(root.querySelectorAll('[data-dir-item]'), function (el) {
      var okType = !type || el.getAttribute('data-type') === type;
      var text = el.getAttribute('data-text');
      var okText = tokens.every(function (t) { return text.indexOf(t) !== -1; });
      el.hidden = !(okType && okText);
      if (!el.hidden) shown++;
    });
    Array.prototype.forEach.call(root.querySelectorAll('[data-dir-section]'), function (s) {
      s.hidden = !s.querySelector('[data-dir-item]:not([hidden])');
    });
    root.querySelector('[data-dir-count]').textContent = shown ? shown + ' elemento' + (shown === 1 ? '' : 's') : 'Sin elementos que coincidan con el filtro.';
  }

  function viewSystem(id) {
    var s = CM.sysById[id];
    var procs = s.procs.map(function (pid) { return procCard(CM.procById[pid]); }).join('');
    return '<div data-page="system">' + crumbs([{ label: 'Inicio', href: '#/' }, { label: 'Sistemas', href: '#/herramientas' }, { label: 'Acceso a ' + s.name }]) +
      '<header class="page-head"><span class="eyebrow">' + icon(s.icon) + 'Sistemas</span><h1>Acceso a ' + esc(s.name) + '</h1><p class="lead">' + esc(s.description) + '</p></header>' +
      '<div class="notes-stack">' + noteHtml('info', 'Página complementaria. Cada procedimiento que usa ' + s.name + ' incluye sus propios pasos de ingreso, así que no necesitas venir aquí primero.') +
      (s.notes || []).map(function (n) { return noteHtml(n.type, n.text); }).join('') + '</div>' +
      '<section class="section"><h2 class="section-title" style="margin-bottom:12px">Dirección</h2><div class="vals">' + valueHtml({ k: 'url', label: s.name, value: s.url, copyLabel: 'Copiar enlace' }) + '</div></section>' +
      '<section class="section"><h2 class="section-title" style="margin-bottom:12px">Pasos de ingreso</h2><ol class="access-steps">' +
      s.access.map(function (a) { return '<li>' + CM.md(a) + '</li>'; }).join('') + '</ol></section>' +
      (s.faq && s.faq.length ? '<section class="section"><h2 class="section-title" style="margin-bottom:12px">Preguntas frecuentes</h2>' + s.faq.map(faqHtml).join('') + '</section>' : '') +
      '<section class="section"><div class="section-head"><h2 class="section-title">Procedimientos que usan ' + esc(s.name) + '</h2></div><div class="card-grid">' + procs + '</div></section></div>';
  }

  function viewZones() {
    return '<div data-page="zones">' + crumbs([{ label: 'Inicio', href: '#/' }, { label: 'Recursos', href: '#/categoria/recursos' }, { label: 'Distribución de zonas' }]) +
      '<header class="page-head"><span class="eyebrow">' + icon('pin') + 'Recursos</span><h1>Distribución de zonas</h1>' +
      '<p class="lead">Distribución documentada de sucursales por zona. Escribe una sucursal para conocer su zona.</p></header>' +
      zonesHtml('r-') +
      '<p class="related">Se usa en: ' + procedureLinks(['junta-trimestral']) + '</p></div>';
  }

  function faqHtml(f) {
    return '<details class="acc"><summary>' + esc(f.q) + icon('chevron-down') + '</summary><div class="acc-body"><p>' + CM.md(f.a) + '</p>' +
      (f.v && f.v.length ? '<div class="vals">' + f.v.map(valueHtml).join('') + '</div>' : '') + '</div></details>';
  }

  function railHtml(p, mobile) {
    var items = [];
    items.push('<li><a href="#/procedimientos/' + p.id + '/requisitos" data-rail="requisitos"><span class="rail-num rail-num--icon">' + icon('checklist', 'icon--sm') + '</span><span class="rail-label">Antes de comenzar</span></a></li>');
    if (p.notices && p.notices.length) items.push('<li><a href="#/procedimientos/' + p.id + '/avisos" data-rail="avisos"><span class="rail-num rail-num--icon">' + icon('alert', 'icon--sm') + '</span><span class="rail-label">Avisos importantes</span></a></li>');
    p.phases.forEach(function (ph) {
      items.push('<li><a href="#/procedimientos/' + p.id + '/' + ph.anchor + '" data-rail="' + ph.anchor + '" data-rail-phase="' + ph.index + '">' +
        '<span class="rail-num">' + ph.number + '</span><span class="rail-label">' + esc(ph.short || ph.title) + '</span></a></li>');
    });
    items.push('<li class="rail-sep" role="presentation"></li>');
    items.push('<li><a href="#/procedimientos/' + p.id + '/verificacion" data-rail="verificacion"><span class="rail-num rail-num--icon">' + icon('check', 'icon--sm') + '</span><span class="rail-label">Verificación final</span></a></li>');
    items.push('<li><a href="#/procedimientos/' + p.id + '/recursos" data-rail="recursos"><span class="rail-num rail-num--icon">' + icon('link', 'icon--sm') + '</span><span class="rail-label">Recursos y enlaces</span></a></li>');
    if (p.faq && p.faq.length) items.push('<li><a href="#/procedimientos/' + p.id + '/faq" data-rail="faq"><span class="rail-num rail-num--icon">' + icon('help', 'icon--sm') + '</span><span class="rail-label">Preguntas frecuentes</span></a></li>');
    var list = '<ul class="rail-list">' + items.join('') + '</ul>';
    if (mobile) {
      return '<details class="acc toc-mobile"><summary>' + icon('list', 'icon--sm') + 'Índice: ' + p.phases.length + ' fase' + (p.phases.length === 1 ? '' : 's') + ' · ' + p.totalSteps + ' pasos' + icon('chevron-down') + '</summary><div class="acc-body">' + list + '</div></details>';
    }
    return '<aside class="proc-rail" aria-label="Índice del procedimiento"><p class="rail-title">En esta página</p>' + list + '</aside>';
  }

  function viewProcedure(id) {
    var p = CM.procById[id];
    var cat = CM.catById[p.category];
    var guided = CM.prefs.get('mode', 'full') === 'guided';
    var idx = D.order.indexOf(p.id);
    var prev = idx > 0 ? CM.procById[D.order[idx - 1]] : null;
    var next = idx < D.order.length - 1 ? CM.procById[D.order[idx + 1]] : null;

    var meta = '<dl class="proc-meta">' +
      '<div><dt>Categoría</dt><dd>' + esc(cat.name) + '</dd></div>' +
      (p.frequency ? '<div><dt>Frecuencia</dt><dd>' + esc(p.frequency) + '</dd></div>' : '') +
      '<div><dt>Sistemas y herramientas</dt><dd>' + sysTags(p) + '</dd></div>' +
      '<div><dt>Extensión</dt><dd>' + p.phases.length + ' fase' + (p.phases.length === 1 ? '' : 's') + ' · ' + p.totalSteps + ' pasos</dd></div></dl>';

    var head = '<header class="proc-head">' +
      '<span class="eyebrow">' + icon(cat.icon) + esc(cat.name) + '</span>' +
      '<h1>' + esc(p.title) + '</h1>' +
      '<p class="proc-objective"><strong>Objetivo:</strong> ' + esc(p.objective) + '</p>' + meta +
      '<div class="proc-toolbar">' +
      '<div class="segmented" role="group" aria-label="Modo de lectura">' +
      '<button type="button" data-mode="full" aria-pressed="' + !guided + '">' + icon('scroll') + 'Vista completa</button>' +
      '<button type="button" data-mode="guided" aria-pressed="' + guided + '">' + icon('steps') + 'Vista guiada</button></div>' +
      '<span class="spacer"></span>' + favButton(p) +
      '</div></header>';

    var req = '<section class="block" id="sec-requisitos" data-spy="requisitos"><h2 class="block-title">' + icon('checklist') + 'Antes de comenzar</h2>' +
      '<ul class="check-list">' + p.requirements.map(function (r) {
        return '<li class="check-item"><span>' + CM.md(r) + '</span></li>';
      }).join('') + '</ul></section>';

    var notices = p.notices && p.notices.length
      ? '<section class="block" id="sec-avisos" data-spy="avisos"><h2 class="block-title">' + icon('alert') + 'Avisos importantes</h2><div class="notes-stack">' +
        p.notices.map(function (n) { return noteHtml(n.type, n.text); }).join('') + '</div></section>'
      : '';

    var steps = '<section class="block steps-full" id="sec-pasos" aria-labelledby="pasos-title"><h2 class="block-title" id="pasos-title">' + icon('list') + 'Pasos</h2>' +
      p.phases.map(function (ph) {
        return '<section class="phase" id="sec-' + ph.anchor + '" data-spy="' + ph.anchor + '" aria-labelledby="t-' + ph.anchor + '">' +
          '<div class="phase-head"><span class="phase-num" aria-hidden="true">' + ph.number + '</span>' +
          '<h3 class="phase-title" id="t-' + ph.anchor + '"><span class="sr-only">Fase ' + ph.number + ': </span>' + esc(ph.title) + '</h3></div>' +
          '<ol class="steps">' + ph.steps.map(function (st) { return stepHtml(p, st, 'full'); }).join('') + '</ol></section>';
      }).join('') + '</section>';

    var guidedHtml = '<section class="block guided" id="sec-guiada" data-spy="guided" aria-label="Vista guiada"><h2 class="block-title">' + icon('steps') + 'Pasos · vista guiada</h2>' +
      '<div class="guided-card" data-guided></div><p class="guided-hint">Usa las flechas ← y → del teclado para moverte entre pasos.</p></section>';

    var verif = '<section class="block" id="sec-verificacion" data-spy="verificacion"><h2 class="block-title">' + icon('check') + 'Verificación final</h2>' +
      '<ul class="check-list">' + p.verification.map(function (v) {
        return '<li class="check-item"><span>' + CM.md(v) + '</span></li>';
      }).join('') + '</ul></section>';

    var sysItems = p.systems.map(function (n) { return SYS_BY_NAME[n]; }).filter(Boolean);
    var contacts = D.contacts.filter(function (c) { return c.procs.indexOf(p.id) !== -1; });
    var resources = (p.resources || []).map(function (rid) { return CM.resById[rid]; }).filter(Boolean);
    var related = (p.related || []).filter(function (r) { return CM.procById[r]; });
    var recursos = '<section class="block" id="sec-recursos" data-spy="recursos"><h2 class="block-title">' + icon('link') + 'Recursos y enlaces</h2><div class="res-list">' +
      sysItems.map(function (s) { return systemHtml(s, { exclude: p.id }); }).join('') +
      resources.map(function (r) { return resourceHtml(r, { exclude: p.id }); }).join('') +
      contacts.map(function (c) { return contactHtml(c, { exclude: p.id }); }).join('') +
      (!sysItems.length && !resources.length && !contacts.length ? '<p class="res-desc">Este procedimiento no tiene enlaces adicionales.</p>' : '') +
      '</div>' +
      (related.length ? '<p class="related">Procedimiento relacionado: ' + procedureLinks(related) + '</p>' : '') + '</section>';

    var faq = p.faq && p.faq.length
      ? '<section class="block" id="sec-faq" data-spy="faq"><h2 class="block-title">' + icon('help') + 'Preguntas frecuentes</h2>' + p.faq.map(faqHtml).join('') + '</section>'
      : '';

    var source = p.source && p.source.length
      ? '<section class="block" id="sec-original"><details class="acc"><summary>' + icon('book', 'icon--sm') + 'Texto original del manual' + icon('chevron-down') + '</summary>' +
        '<div class="acc-body"><ul class="source-text">' + p.source.map(function (s) { return '<li>' + esc(s) + '</li>'; }).join('') + '</ul></div></details></section>'
      : '';

    var pager = '<nav class="pager" aria-label="Procedimiento anterior y siguiente">' +
      (prev ? '<a class="prev" href="#/procedimientos/' + prev.id + '"><small>← Anterior</small><strong>' + esc(prev.title) + '</strong></a>' : '<span></span>') +
      (next ? '<a class="next" href="#/procedimientos/' + next.id + '"><small>Siguiente →</small><strong>' + esc(next.title) + '</strong></a>' : '') + '</nav>';

    return '<article class="proc' + (guided ? ' is-guided' : '') + '" data-page="procedure" data-proc="' + p.id + '">' +
      crumbs([{ label: 'Inicio', href: '#/' }, { label: cat.name, href: '#/categoria/' + cat.id }, { label: p.title }]) +
      head +
      '<div class="proc-layout"><div class="proc-main">' + railHtml(p, true) + req + notices + steps + guidedHtml + verif + recursos + faq + source + pager + '</div>' +
      railHtml(p, false) + '</div></article>';
  }

  function viewNotFound() {
    return '<div class="notfound" data-page="notfound"><span class="eyebrow">' + icon('alert') + 'Página no encontrada</span>' +
      '<h1>No encontramos esta sección</h1><p class="lead" style="color:var(--muted)">La dirección no corresponde a ningún procedimiento documentado.</p>' +
      '<div style="display:flex;gap:8px;flex-wrap:wrap"><a class="btn btn--primary" href="#/">' + icon('home') + '<span>Ir al inicio</span></a>' +
      '<button type="button" class="btn" data-open-search>' + icon('search') + '<span>Buscar en el manual</span></button></div></div>';
  }

  function currentProc() {
    var el = view.querySelector('[data-page="procedure"]');
    return el ? CM.procById[el.getAttribute('data-proc')] : null;
  }

  function guidedIndex(p) {
    if (CM.state.guided[p.id] == null) CM.state.guided[p.id] = 0;
    return CM.state.guided[p.id];
  }

  function renderGuided(p) {
    var box = view.querySelector('[data-guided]');
    if (!box) return;
    var i = Math.max(0, Math.min(p.stepList.length - 1, guidedIndex(p)));
    CM.state.guided[p.id] = i;
    var st = p.stepList[i];
    var ph = st.phase;
    var last = i === p.stepList.length - 1;
    box.innerHTML =
      '<div class="guided-top"><span class="guided-phase">Fase ' + ph.number + ' de ' + p.phases.length + ' <span>· ' + esc(ph.title) + '</span></span>' +
      '<span class="guided-count">Paso ' + st.number + ' · ' + (i + 1) + ' de ' + p.stepList.length + '</span></div>' +
      '<div class="guided-body"><ol class="steps">' + stepHtml(p, st, 'guided') + '</ol></div>' +
      '<div class="guided-segs" aria-hidden="true">' + p.stepList.map(function (s, k) {
        return '<button type="button" tabindex="-1" data-guided-go="' + k + '" title="Paso ' + s.number + '" class="' + (k === i ? 'is-current' : '') + '"></button>';
      }).join('') + '</div>' +
      '<div class="guided-nav">' +
      '<button type="button" class="btn" data-guided-nav="prev"' + (i === 0 ? ' disabled' : '') + '>' + icon('chevron-left') + '<span>Anterior</span></button>' +
      (last
        ? '<a class="btn btn--primary" href="#/procedimientos/' + p.id + '/verificacion">' + icon('check') + '<span>Ir a verificación final</span></a>'
        : '<button type="button" class="btn btn--primary" data-guided-nav="next"><span>Siguiente</span>' + icon('chevron-right') + '</button>') +
      '</div>';
    var zones = box.querySelector('[data-zones]');
    if (zones) updateZones(zones, zones.querySelector('[data-zone-input]').value);
  }

  function setGuided(p, i, focus) {
    CM.state.guided[p.id] = i;
    renderGuided(p);
    if (focus) {
      var card = view.querySelector('[data-guided]');
      var r = card.getBoundingClientRect();
      if (r.top < 60 || r.top > window.innerHeight * 0.6) {
        view.querySelector('#sec-guiada').scrollIntoView({ block: 'start', behavior: CM.reducedMotion() ? 'auto' : 'smooth' });
      }
    }
  }

  function setMode(p, mode) {
    CM.prefs.set('mode', mode);
    var art = view.querySelector('[data-page="procedure"]');
    art.classList.toggle('is-guided', mode === 'guided');
    Array.prototype.forEach.call(view.querySelectorAll('[data-mode]'), function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-mode') === mode)); });
    if (mode === 'guided') renderGuided(p);
    setupSpy();
  }

  function computeSpy() {
    var p = currentProc();
    if (!p) return;
    var targets = Array.prototype.slice.call(view.querySelectorAll('[data-spy]')).filter(function (el) { return el.offsetParent !== null; });
    if (!targets.length) return;
    var line = (document.querySelector('.topbar').offsetHeight || 64) + 70;
    var active = null;
    targets.forEach(function (el) { if (el.getBoundingClientRect().top <= line) active = el.getAttribute('data-spy'); });
    var doc = document.documentElement;
    if (window.innerHeight + window.scrollY >= doc.scrollHeight - 4) active = targets[targets.length - 1].getAttribute('data-spy');
    if (active === 'guided') active = p.stepList[guidedIndex(p)].phase.anchor;
    markRail(active);
  }

  function setupSpy() {
    if (spy) { window.removeEventListener('scroll', spy); spy = null; }
    if (!currentProc()) return;
    var ticking = false;
    spy = function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () { ticking = false; computeSpy(); });
    };
    window.addEventListener('scroll', spy, { passive: true });
    computeSpy();
  }

  function markRail(key) {
    Array.prototype.forEach.call(view.querySelectorAll('[data-rail]'), function (a) {
      var on = a.getAttribute('data-rail') === key;
      a.classList.toggle('is-active', on);
      if (on) a.setAttribute('aria-current', 'location'); else a.removeAttribute('aria-current');
    });
  }

  function flash(el) {
    if (!el) return;
    el.classList.remove('is-target');
    void el.offsetWidth;
    el.classList.add('is-target');
    setTimeout(function () { el.classList.remove('is-target'); }, 1900);
  }

  function scrollToEl(el, smooth) {
    if (!el) return;
    var details = el.closest('details');
    if (details && !details.open && el.tagName !== 'DETAILS') details.open = true;
    el.scrollIntoView({ block: 'start', behavior: smooth && !CM.reducedMotion() ? 'smooth' : 'auto' });
  }

  function focusAnchor(r, smoothOverride) {
    var smooth = smoothOverride == null ? true : smoothOverride;
    if (r.view === 'directory') {
      if (!r.anchor) return;
      var root = view.querySelector('[data-page="directory"]');
      var target = document.getElementById('sec-' + r.anchor);
      if (target && target.hidden) {
        root.querySelector('[data-dir-search]').value = '';
        Array.prototype.forEach.call(root.querySelectorAll('[data-dir-type]'), function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-dir-type') === '')); });
        filterDirectory();
      }
      scrollToEl(target, smooth);
      flash(target);
      return;
    }
    if (r.view !== 'procedure') return;
    var p = CM.procById[r.id];
    var a = r.anchor;
    if (!a) { window.scrollTo(0, 0); return; }
    var guided = view.querySelector('.proc.is-guided');
    var m = /^(paso|fase)-(\d+)$/.exec(a);
    if (guided && (m || a === 'zonas' || a === 'pasos')) {
      var idx = 0;
      if (m && m[1] === 'paso') idx = Math.min(+m[2], p.stepList.length - 1);
      else if (m && m[1] === 'fase') {
        var ph = p.phases[Math.min(+m[2] - 1, p.phases.length - 1)];
        idx = ph.steps[0].order;
      } else if (a === 'zonas') {
        p.stepList.forEach(function (s) { if (s.component === 'zones') idx = s.order; });
      } else idx = guidedIndex(p);
      CM.state.guided[p.id] = idx;
      renderGuided(p);
      markRail(p.stepList[idx].phase.anchor);
      scrollToEl(view.querySelector('#sec-guiada'), smooth);
      flash(view.querySelector('[data-guided] .step'));
      prefillZones();
      return;
    }
    var el = document.getElementById('sec-' + a);
    if (!el) { window.scrollTo(0, 0); return; }
    scrollToEl(el, smooth);
    if (el.classList.contains('step')) flash(el);
    if (a === 'zonas') prefillZones();
    if (m && m[1] === 'fase') markRail(a);
  }

  function prefillZones() {
    var q = CM.state.zoneQuery;
    if (!q) return;
    CM.state.zoneQuery = null;
    Array.prototype.forEach.call(view.querySelectorAll('[data-zones]'), function (root) {
      var input = root.querySelector('[data-zone-input]');
      input.value = q;
      updateZones(root, q);
    });
  }

  function titleFor(r) {
    switch (r.view) {
      case 'home': return 'Manual de procedimientos · Construmac';
      case 'list': return (r.id ? CM.catById[r.id].name : 'Todos los procedimientos') + SUFFIX;
      case 'favorites': return 'Favoritos' + SUFFIX;
      case 'tools': return 'Accesos y herramientas' + SUFFIX;
      case 'directory': return 'Directorio de enlaces' + SUFFIX;
      case 'zones': return 'Distribución de zonas' + SUFFIX;
      case 'system': return 'Acceso a ' + CM.sysById[r.id].name + SUFFIX;
      case 'procedure': return CM.procById[r.id].title + SUFFIX;
      default: return 'Página no encontrada' + SUFFIX;
    }
  }

  function render(r, userNav) {
    if (spy) { window.removeEventListener('scroll', spy); spy = null; }
    var html;
    switch (r.view) {
      case 'home': html = viewHome(); break;
      case 'list': html = viewList(r.id); break;
      case 'favorites': html = viewFavorites(); break;
      case 'tools': html = viewTools(); break;
      case 'directory': html = viewDirectory(); break;
      case 'zones': html = viewZones(); break;
      case 'system': html = viewSystem(r.id); break;
      case 'procedure': CM.history.push(r.id); html = viewProcedure(r.id); break;
      default: html = viewNotFound();
    }
    view.innerHTML = html;
    document.title = titleFor(r);
    if (userNav) {
      view.classList.remove('is-entering');
      void view.offsetWidth;
      view.classList.add('is-entering');
    }

    if (r.view === 'home') {
      CM.search.attachInline(document.getElementById('home-search'), document.getElementById('home-suggest'));
    }
    if (r.view === 'directory') filterDirectory();
    if (r.view === 'procedure') {
      var p = CM.procById[r.id];
      if (view.querySelector('.proc.is-guided')) renderGuided(p);
    }

    var hasAnchor = !!r.anchor;
    if (!hasAnchor) {
      window.scrollTo(0, 0);
      if (userNav) {
        var h1 = view.querySelector('h1');
        if (h1) { h1.setAttribute('tabindex', '-1'); h1.focus({ preventScroll: true }); }
      }
    }
    requestAnimationFrame(function () {
      if (hasAnchor) focusAnchor(r, false);
      if (r.view === 'procedure') { setupSpy(); prefillZones(); }
    });
  }

  function onClick(ev) {
    var t = ev.target;

    var copy = t.closest('[data-copy]');
    if (copy) { CM.copy(copy.getAttribute('data-copy'), copy.getAttribute('data-copy-label'), copy); return; }

    var fav = t.closest('[data-fav]');
    if (fav) {
      var id = fav.getAttribute('data-fav');
      var p = CM.procById[id];
      var on = CM.favs.toggle(id);
      Array.prototype.forEach.call(document.querySelectorAll('[data-fav="' + id + '"]'), function (b) {
        b.setAttribute('aria-pressed', String(on));
        b.setAttribute('aria-label', (on ? 'Quitar de favoritos: ' : 'Agregar a favoritos: ') + p.title);
        b.setAttribute('title', on ? 'Quitar de favoritos' : 'Agregar a favoritos');
        var txt = b.querySelector('[data-fav-text]');
        if (txt) txt.textContent = on ? 'En favoritos' : 'Agregar a favoritos';
      });
      CM.nav.updateFavCount();
      CM.toast(on ? 'Agregado a favoritos' : 'Quitado de favoritos');
      if (!on && view.querySelector('[data-page="favorites"]')) {
        var row = view.querySelector('[data-row="' + id + '"]');
        if (row) row.remove();
        if (!view.querySelector('[data-row]')) render(CM.router.current(), false);
      }
      return;
    }

    var mode = t.closest('[data-mode]');
    if (mode) { var mp = currentProc(); if (mp) setMode(mp, mode.getAttribute('data-mode')); return; }

    var gnav = t.closest('[data-guided-nav]');
    if (gnav) {
      var gp = currentProc();
      var i = guidedIndex(gp);
      var action = gnav.getAttribute('data-guided-nav');
      if (action === 'next') i = Math.min(gp.stepList.length - 1, i + 1);
      else if (action === 'prev') i = Math.max(0, i - 1);
      setGuided(gp, i, true);
      markRail(gp.stepList[i].phase.anchor);
      var focusTarget = view.querySelector('[data-guided-nav="' + action + '"]') || view.querySelector('[data-guided-nav]:not([disabled])');
      if (focusTarget && !focusTarget.disabled) focusTarget.focus({ preventScroll: true });
      return;
    }

    var go = t.closest('[data-guided-go]');
    if (go) { var gop = currentProc(); var gi = +go.getAttribute('data-guided-go'); setGuided(gop, gi, false); markRail(gop.stepList[gi].phase.anchor); return; }

    var pick = t.closest('[data-zone-pick]');
    if (pick) {
      var zr = pick.closest('[data-zones]');
      var zi = zr.querySelector('[data-zone-input]');
      zi.value = pick.getAttribute('data-zone-pick');
      updateZones(zr, zi.value);
      return;
    }

    var dt = t.closest('[data-dir-type]');
    if (dt) {
      Array.prototype.forEach.call(view.querySelectorAll('[data-dir-type]'), function (b) { b.setAttribute('aria-pressed', String(b === dt)); });
      filterDirectory();
      return;
    }

    var term = t.closest('[data-search-term]');
    if (term) { CM.search.open(term.getAttribute('data-search-term')); return; }

    if (t.closest('[data-open-search]')) { CM.search.open(); return; }
  }

  function onInput(ev) {
    var t = ev.target;
    if (t.matches('[data-zone-input]')) { updateZones(t.closest('[data-zones]'), t.value); return; }
    if (t.matches('[data-dir-search]')) filterDirectory();
  }

  function onKey(ev) {
    if (ev.defaultPrevented || ev.altKey || ev.ctrlKey || ev.metaKey) return;
    if (ev.key !== 'ArrowLeft' && ev.key !== 'ArrowRight') return;
    if (CM.search.isOpen()) return;
    var tag = (ev.target.tagName || '').toLowerCase();
    if (tag === 'input' || tag === 'textarea' || tag === 'select' || ev.target.isContentEditable) return;
    var p = currentProc();
    if (!p || !view.querySelector('.proc.is-guided')) return;
    var i = guidedIndex(p);
    var n = ev.key === 'ArrowRight' ? Math.min(p.stepList.length - 1, i + 1) : Math.max(0, i - 1);
    if (n === i) return;
    ev.preventDefault();
    setGuided(p, n, false);
    markRail(p.stepList[n].phase.anchor);
  }

  var printOpened = [];
  window.addEventListener('beforeprint', function () {
    printOpened = Array.prototype.slice.call(document.querySelectorAll('#view details:not([open])'));
    printOpened.forEach(function (d) { d.open = true; });
  });
  window.addEventListener('afterprint', function () {
    printOpened.forEach(function (d) { d.open = false; });
    printOpened = [];
  });

  function init() {
    view = document.getElementById('view');
    view.addEventListener('click', onClick);
    view.addEventListener('input', onInput);
    document.addEventListener('keydown', onKey);
    CM.nav.init();
    CM.search.init();
    window.addEventListener('hashchange', function () { CM.router.handle(false); });
    CM.router.handle(false);
  }

  CM.app = { render: render, focusAnchor: focusAnchor };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
