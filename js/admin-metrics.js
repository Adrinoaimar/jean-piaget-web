/* Private aggregate report: uses the same authorized Supabase session as the inbox. */
(function () {
  'use strict';
  var revision = 0;
  var $ = function (id) { return document.getElementById(id); };
  var labels = { direct: 'Directo o sin referencia', internal: 'Navegación interna', google: 'Google', bing: 'Bing', facebook: 'Facebook', instagram: 'Instagram', tiktok: 'TikTok', whatsapp: 'WhatsApp', other: 'Otros', mobile: 'Móvil', desktop: 'Escritorio' };
  var counters = { page_view: 'web-views', whatsapp_click: 'web-whatsapp', phone_click: 'web-phone', admission_click: 'web-admission', contact_success: 'web-contact-success', admission_success: 'web-admission-success' };
  function clear() {
    revision++;
    Object.values(counters).forEach(function (id) { $(id).textContent = '—'; });
    ['web-pages', 'web-sources', 'web-devices', 'web-days'].forEach(function (id) { $(id).replaceChildren(); });
    $('web-metric-status').textContent = '';
    $('web-period-label').textContent = '';
  }
  function renderRows(id, rows, key) {
    var body = $(id);
    body.replaceChildren();
    rows.forEach(function (row) {
      var tr = document.createElement('tr');
      var name = document.createElement('td');
      name.textContent = labels[row[key]] || row[key];
      var value = document.createElement('td');
      value.textContent = Number(row.count).toLocaleString('es-PE');
      tr.append(name, value);
      body.append(tr);
    });
    if (!rows.length) {
      var tr = document.createElement('tr');
      var empty = document.createElement('td');
      empty.colSpan = 2;
      empty.textContent = 'Todavía no hay datos en este período.';
      tr.append(empty);
      body.append(tr);
    }
  }
  async function load(token) {
    var current = ++revision;
    $('web-metric-status').textContent = 'Actualizando métricas de la web…';
    try {
      var res = await fetch('https://jeanpiagetsullana.pages.dev/api/metrics?days=' + $('web-metric-period').value, {
        headers: { Authorization: 'Bearer ' + token }, cache: 'no-store', credentials: 'omit', referrerPolicy: 'no-referrer', signal: AbortSignal.timeout(15000)
      });
      if (!res.ok) throw new Error(res.status === 401 ? 'Tu sesión no permite consultar las métricas.' : 'Las métricas no están disponibles en este momento.');
      var data = await res.json();
      if (current !== revision) return;
      var values = {};
      data.events.forEach(function (row) { values[row.event] = Number(row.count); });
      Object.keys(counters).forEach(function (key) { $(counters[key]).textContent = (values[key] || 0).toLocaleString('es-PE'); });
      renderRows('web-pages', data.pages, 'page');
      renderRows('web-sources', data.sources, 'source');
      renderRows('web-devices', data.devices, 'device');
      renderRows('web-days', data.daily, 'day');
      $('web-period-label').textContent = data.start + ' al ' + data.end + ' · Hora de Lima · Hoy es parcial';
      $('web-metric-status').textContent = data.events.length ? 'Métricas actualizadas.' : 'La medición está activa. Los datos aparecerán a partir de las primeras visitas.';
    } catch (error) {
      if (current !== revision) return;
      clear();
      $('web-metric-status').textContent = error.message || 'No se pudieron actualizar las métricas.';
    }
  }
  window.JP_ADMIN_METRICS = { load: load, clear: clear };
}());
