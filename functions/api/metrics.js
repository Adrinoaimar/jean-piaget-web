/* Aggregate counters only. No form content, visitor IDs or raw referrers. */
const HOST = 'jeanpiagetsullana.pages.dev';
const PUBLIC_ORIGIN = 'https://' + HOST;
const READ_ORIGINS = new Set([PUBLIC_ORIGIN, 'https://adrinoaimar.github.io']);
const PAGES = new Set(['/', '/nosotros', '/niveles', '/admision', '/contacto', '/galeria', '/vida-escolar', '/innovacion', '/jean-piaget', '/taller-familiar', '/privacidad', '/terminos']);
const EVENTS = new Set(['page_view', 'whatsapp_click', 'phone_click', 'admission_click', 'contact_success', 'admission_success']);
const SOURCES = new Set(['direct', 'internal', 'google', 'bing', 'facebook', 'instagram', 'tiktok', 'whatsapp', 'other']);
const DEVICES = new Set(['mobile', 'desktop']);
const rateWindows = new Map();
let lastMinute = 0;

function headers(origin) {
  const value = { 'Cache-Control': 'no-store', 'Content-Type': 'application/json; charset=utf-8', 'X-Robots-Tag': 'noindex', 'Vary': 'Origin', 'X-Content-Type-Options': 'nosniff' };
  if (READ_ORIGINS.has(origin)) {
    value['Access-Control-Allow-Origin'] = origin;
    value['Access-Control-Allow-Methods'] = 'GET, POST, OPTIONS';
    value['Access-Control-Allow-Headers'] = 'Authorization, Content-Type';
  }
  return value;
}

function response(origin, status, data) {
  return new Response(status === 204 ? null : JSON.stringify(data), { status, headers: headers(origin) });
}

function limaDay(time = Date.now()) {
  return new Date(time - 5 * 60 * 60 * 1000).toISOString().slice(0, 10);
}

// Best-effort per-isolate abuse cap. The IP is never written to D1 or logs.
function limited(request) {
  const key = request.headers.get('CF-Connecting-IP');
  if (!key) return false;
  const minute = Math.floor(Date.now() / 60000);
  if (minute !== lastMinute) { rateWindows.clear(); lastMinute = minute; }
  const entry = rateWindows.get(key);
  if (rateWindows.size > 2000) rateWindows.clear();
  if (!entry || entry.minute !== minute) {
    rateWindows.set(key, { minute, count: 1 });
    return false;
  }
  entry.count += 1;
  return entry.count > 90;
}

async function collect(request, env, origin) {
  if (origin !== PUBLIC_ORIGIN) return response(origin, 403, { error: 'Origen no permitido.' });
  if (request.headers.get('DNT') === '1' || request.headers.get('Sec-GPC') === '1' || /bot|crawler|spider/i.test(request.headers.get('User-Agent') || '')) return response(origin, 204);
  if (limited(request)) return response(origin, 429, { error: 'Límite temporal.' });
  if (!/^(application\/json|text\/plain)(;|$)/i.test(request.headers.get('Content-Type') || '')) return response(origin, 415, { error: 'Formato no permitido.' });
  if (Number(request.headers.get('Content-Length') || 0) > 512) return response(origin, 413, { error: 'Solicitud demasiado grande.' });
  const raw = await request.text();
  if (new TextEncoder().encode(raw).length > 512) return response(origin, 413, { error: 'Solicitud demasiado grande.' });
  let data;
  try { data = JSON.parse(raw); } catch { return response(origin, 400, { error: 'Formato inválido.' }); }
  if (!data || Array.isArray(data) || typeof data !== 'object' || Object.keys(data).some(key => !['page', 'event', 'source', 'device'].includes(key)) || !PAGES.has(data.page) || !EVENTS.has(data.event) || !SOURCES.has(data.source) || !DEVICES.has(data.device)) return response(origin, 400, { error: 'Métrica no válida.' });
  if (data.event === 'contact_success' && data.page !== '/contacto' || data.event === 'admission_success' && data.page !== '/admision') return response(origin, 400, { error: 'Página no válida para el evento.' });
  if (!env.JP_METRICS) return response(origin, 503, { error: 'Métricas temporalmente no disponibles.' });
  await env.JP_METRICS.prepare('INSERT INTO metric_daily (day, page, event, source, device, count) VALUES (?, ?, ?, ?, ?, 1) ON CONFLICT (day, page, event, source, device) DO UPDATE SET count = count + 1')
    .bind(limaDay(), data.page, data.event, data.source, data.device).run();
  return response(origin, 204);
}

async function authorized(request, env) {
  const bearer = request.headers.get('Authorization') || '';
  if (!/^Bearer \S+$/.test(bearer)) return false;
  if (!env.JP_SUPABASE_URL || !env.JP_SUPABASE_ANON_KEY) throw new Error('Auth not configured');
  const authHeaders = { apikey: env.JP_SUPABASE_ANON_KEY, Authorization: bearer };
  const options = { headers: authHeaders, cache: 'no-store', signal: AbortSignal.timeout(8000) };
  // Validate with Auth, then check the existing RLS-protected administrator list.
  const userResponse = await fetch(env.JP_SUPABASE_URL + '/auth/v1/user', options);
  if (!userResponse.ok) return false;
  const user = await userResponse.json();
  if (!user.id || user.is_anonymous) return false;
  const members = await fetch(env.JP_SUPABASE_URL + '/rest/v1/jean_piaget_admins?select=user_id&user_id=eq.' + encodeURIComponent(user.id), options);
  if (!members.ok) return false;
  const rows = await members.json();
  return Array.isArray(rows) && rows.some(row => row.user_id === user.id);
}

async function report(request, env, origin) {
  if (origin && !READ_ORIGINS.has(origin)) return response(origin, 403, { error: 'Origen no permitido.' });
  if (!await authorized(request, env)) return response(origin, 401, { error: 'Acceso exclusivo para administradores.' });
  const days = Number(new URL(request.url).searchParams.get('days') || 28);
  if (![7, 28, 90].includes(days)) return response(origin, 400, { error: 'Período no válido.' });
  const start = limaDay(Date.now() - (days - 1) * 86400000);
  const end = limaDay();
  const period = [start, end];
  const statements = [
    'SELECT event, SUM(count) AS count FROM metric_daily WHERE day BETWEEN ? AND ? GROUP BY event',
    "SELECT page, SUM(count) AS count FROM metric_daily WHERE day BETWEEN ? AND ? AND event = 'page_view' GROUP BY page ORDER BY count DESC, page",
    "SELECT source, SUM(count) AS count FROM metric_daily WHERE day BETWEEN ? AND ? AND event = 'page_view' GROUP BY source ORDER BY count DESC, source",
    "SELECT device, SUM(count) AS count FROM metric_daily WHERE day BETWEEN ? AND ? AND event = 'page_view' GROUP BY device ORDER BY count DESC, device",
    "SELECT day, SUM(count) AS count FROM metric_daily WHERE day BETWEEN ? AND ? AND event = 'page_view' GROUP BY day ORDER BY day"
  ];
  const rows = await env.JP_METRICS.batch(statements.map(sql => env.JP_METRICS.prepare(sql).bind(...period)));
  return response(origin, 200, { start, end, timezone: 'America/Lima', generated_at: new Date().toISOString(), events: rows[0].results, pages: rows[1].results, sources: rows[2].results, devices: rows[3].results, daily: rows[4].results });
}

export async function onRequest({ request, env, waitUntil }) {
  const origin = request.headers.get('Origin') || '';
  if (new URL(request.url).hostname !== HOST) return response(origin, 404, { error: 'No disponible.' });
  try {
    if (request.method === 'OPTIONS') return READ_ORIGINS.has(origin) ? response(origin, 204) : response(origin, 403, { error: 'Origen no permitido.' });
    if (request.method === 'GET') return await report(request, env, origin);
    if (request.method !== 'POST') return response(origin, 405, { error: 'Método no permitido.' });
    const result = await collect(request, env, origin);
    // Aggregate retention is 90 days. Infrequent housekeeping avoids an extra query per view.
    if (result.status === 204 && env.JP_METRICS && Math.random() < 0.01) waitUntil(env.JP_METRICS.prepare('DELETE FROM metric_daily WHERE day < ?').bind(limaDay(Date.now() - 89 * 86400000)).run().catch(() => {}));
    return result;
  } catch {
    return response(origin, 503, { error: 'Métricas temporalmente no disponibles.' });
  }
}
