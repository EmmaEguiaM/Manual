(function () {
  'use strict';

  var KEY = 'construmac-manual:key';
  var SCRIPTS = ['js/utils.js', 'js/search.js', 'js/navigation.js', 'js/app.js'];
  var enc = window.CM_ENC;

  var gate = document.getElementById('gate');
  var form = document.getElementById('gate-form');
  var input = document.getElementById('gate-pass');
  var field = document.getElementById('gate-field');
  var errorEl = document.getElementById('gate-error');
  var remember = document.getElementById('gate-remember');
  var submit = document.getElementById('gate-submit');
  var toggle = document.getElementById('gate-toggle');
  var lock = document.getElementById('gate-lock');

  function toBytes(b64) {
    var bin = atob(b64);
    var out = new Uint8Array(bin.length);
    for (var i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
    return out;
  }

  function toB64(buf) {
    var bytes = new Uint8Array(buf);
    var s = '';
    for (var i = 0; i < bytes.length; i++) s += String.fromCharCode(bytes[i]);
    return btoa(s);
  }

  function read(store) {
    try { return window[store].getItem(KEY); } catch (e) { return null; }
  }

  function write(store, value) {
    try { window[store].setItem(KEY, value); } catch (e) { }
  }

  function forget() {
    ['sessionStorage', 'localStorage'].forEach(function (s) {
      try { window[s].removeItem(KEY); } catch (e) { }
    });
  }

  function deriveKey(password) {
    return crypto.subtle.importKey('raw', new TextEncoder().encode(password), 'PBKDF2', false, ['deriveKey']).then(function (base) {
      return crypto.subtle.deriveKey(
        { name: 'PBKDF2', salt: toBytes(enc.salt), iterations: enc.iter, hash: 'SHA-256' },
        base,
        { name: 'AES-GCM', length: 256 },
        true,
        ['decrypt']
      );
    });
  }

  function decrypt(key) {
    return crypto.subtle.decrypt({ name: 'AES-GCM', iv: toBytes(enc.iv) }, key, toBytes(enc.data)).then(function (buf) {
      return JSON.parse(new TextDecoder().decode(buf));
    });
  }

  function loadScripts(list) {
    if (!list.length) return;
    var s = document.createElement('script');
    s.src = list[0];
    s.onload = function () { loadScripts(list.slice(1)); };
    s.onerror = function () { fatal('No se pudo cargar ' + list[0] + '. Recarga la página.'); };
    document.body.appendChild(s);
  }

  function start(data, key, persist) {
    window.CM_DATA = data;
    crypto.subtle.exportKey('raw', key).then(function (raw) {
      var value = toB64(raw);
      write('sessionStorage', value);
      if (persist) write('localStorage', value);
    }).catch(function () { });
    gate.hidden = true;
    document.body.classList.remove('is-locked');
    loadScripts(SCRIPTS);
  }

  function setError(message) {
    errorEl.textContent = message;
    field.classList.toggle('is-error', !!message);
    if (message) input.setAttribute('aria-invalid', 'true');
    else input.removeAttribute('aria-invalid');
  }

  function busy(on) {
    submit.disabled = on;
    submit.setAttribute('aria-busy', String(on));
    submit.textContent = on ? 'Verificando…' : 'Entrar';
  }

  function showGate() {
    gate.hidden = false;
    input.focus();
  }

  function fatal(message) {
    gate.hidden = false;
    document.body.classList.add('is-locked');
    setError(message);
    Array.prototype.forEach.call(form.elements, function (el) { el.disabled = true; });
  }

  form.addEventListener('submit', function (ev) {
    ev.preventDefault();
    var password = input.value;
    if (!password) { setError('Escribe la contraseña.'); input.focus(); return; }
    busy(true);
    setError('');
    deriveKey(password).then(function (key) {
      return decrypt(key).then(function (data) { start(data, key, remember.checked); });
    }).catch(function () {
      busy(false);
      setError('Contraseña incorrecta.');
      input.focus();
      input.select();
    });
  });

  input.addEventListener('input', function () { if (errorEl.textContent) setError(''); });

  toggle.addEventListener('click', function () {
    var show = input.type === 'password';
    input.type = show ? 'text' : 'password';
    toggle.setAttribute('aria-pressed', String(show));
    toggle.setAttribute('aria-label', show ? 'Ocultar contraseña' : 'Mostrar contraseña');
    input.focus();
  });

  lock.addEventListener('click', function () {
    forget();
    window.location.reload();
  });

  if (!enc || !enc.data) { fatal('Falta el archivo js/procedures.enc.js.'); return; }
  if (!window.crypto || !window.crypto.subtle) { fatal('Abre el manual desde una dirección segura (https).'); return; }

  var stored = read('sessionStorage') || read('localStorage');
  if (!stored) { showGate(); return; }
  var persisted = !!read('localStorage');
  crypto.subtle.importKey('raw', toBytes(stored), { name: 'AES-GCM' }, true, ['decrypt']).then(function (key) {
    return decrypt(key).then(function (data) { start(data, key, persisted); });
  }).catch(function () {
    forget();
    showGate();
  });
})();
