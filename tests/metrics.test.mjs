import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { DatabaseSync } from 'node:sqlite';
import vm from 'node:vm';

const source = readFileSync('functions/api/metrics.js', 'utf8');
const { onRequest } = await import('data:text/javascript;base64,' + Buffer.from(source).toString('base64'));
const db = new DatabaseSync(':memory:');
db.exec(readFileSync('scripts/metrics-schema.sql', 'utf8'));
const D1 = {
  prepare(sql) {
    const statement = db.prepare(sql);
    return { bind(...args) { return { async run() { return statement.run(...args); }, async all() { return { results: statement.all(...args) }; } }; } };
  },
  async batch(statements) { return Promise.all(statements.map(s => s.all())); }
};
const env = { JP_METRICS: D1, JP_SUPABASE_URL: 'https://auth.example.invalid', JP_SUPABASE_ANON_KEY: 'public-test-key' };
const url = 'https://jeanpiagetsullana.pages.dev/api/metrics';
const origin = 'https://jeanpiagetsullana.pages.dev';
const payload = { page: '/', event: 'page_view', source: 'direct', device: 'desktop' };
const run = (request, e = env) => onRequest({ request, env: e, waitUntil(p) { return p; } });
const post = (data, headers = {}) => run(new Request(url, { method: 'POST', headers: { Origin: origin, 'Content-Type': 'text/plain', ...headers }, body: typeof data === 'string' ? data : JSON.stringify(data) }));
const count = () => db.prepare('SELECT COALESCE(SUM(count),0) AS value FROM metric_daily').get().value;

test('collector: aggregates counters in SQLite, rejects private and unknown fields', async () => {
  assert.equal((await post(payload)).status, 204);
  assert.equal((await post(payload)).status, 204);
  assert.equal(count(), 2);
  assert.equal(db.prepare('SELECT COUNT(*) AS n FROM metric_daily').get().n, 1);
  for (const invalid of [{ ...payload, email: 'private@example.invalid' }, { ...payload, page: '/admin' }, { ...payload, page: '/?q=private' }, { ...payload, event: 'contact_success' }, [], null]) {
    assert.equal((await post(invalid)).status, 400);
  }
  assert.equal((await post('invalid JSON')).status, 400);
  assert.equal((await post(' '.repeat(513))).status, 413);
  assert.equal((await post(payload, { 'Content-Type': 'application/xml' })).status, 415);
  assert.equal(count(), 2);
});

test('collector: respects opt-out, blocks other origins, excludes previews and bots', async () => {
  assert.equal((await post(payload, { DNT: '1' })).status, 204);
  assert.equal((await post(payload, { 'Sec-GPC': '1' })).status, 204);
  assert.equal((await post(payload, { 'User-Agent': 'Googlebot' })).status, 204);
  assert.equal(count(), 2);
  assert.equal((await post(payload, { Origin: 'https://unrelated.example' })).status, 403);
  assert.equal((await post(payload, { Origin: 'https://adrinoaimar.github.io' })).status, 403);
  assert.equal((await run(new Request(url.replace('jeanpiagetsullana', 'preview.jeanpiagetsullana')))).status, 404);
  assert.equal((await run(new Request(url, { method: 'DELETE' }))).status, 405);
  const cors = await run(new Request(url, { method: 'OPTIONS', headers: { Origin: 'https://adrinoaimar.github.io' } }));
  assert.equal(cors.status, 204);
  assert.equal(cors.headers.get('Access-Control-Allow-Origin'), 'https://adrinoaimar.github.io');
});

test('reports: anonymous and non-admin sessions cannot read counts; existing admin can', async () => {
  assert.equal((await run(new Request(url))).status, 401);
  const savedFetch = globalThis.fetch;
  try {
    globalThis.fetch = async (target, options) => {
      assert.equal(options.headers.Authorization, 'Bearer sample-session');
      return Response.json(target.includes('/auth/v1/user') ? { id: 'test-admin' } : []);
    };
    const request = () => new Request(url + '?days=28', { headers: { Authorization: 'Bearer sample-session', Origin: 'https://adrinoaimar.github.io' } });
    assert.equal((await run(request())).status, 401);
    globalThis.fetch = async (target) => Response.json(target.includes('/auth/v1/user') ? { id: 'test-admin' } : [{ user_id: 'someone-else' }]);
    assert.equal((await run(request())).status, 401);
    globalThis.fetch = async (target) => Response.json(target.includes('/auth/v1/user') ? { id: 'test-admin' } : [{ user_id: 'test-admin' }]);
    const result = await run(request());
    assert.equal(result.status, 200);
    assert.equal(result.headers.get('Cache-Control'), 'no-store');
    const data = await result.json();
    assert.equal(data.events.find(row => row.event === 'page_view').count, 2);
    assert.equal(data.pages[0].page, '/');
    assert.equal(data.timezone, 'America/Lima');
    assert.equal((await run(new Request(url + '?days=100000', { headers: { Authorization: 'Bearer sample-session' } }))).status, 400);
    assert.equal((await run(new Request(url, { headers: { Authorization: 'Bearer sample-session', Origin: 'https://unrelated.example' } }))).status, 403);
  } finally { globalThis.fetch = savedFetch; }
});

test('collector: best-effort abuse cap and database failure leave site independent', async () => {
  for (let i = 0; i < 90; i++) assert.equal((await post(payload, { 'CF-Connecting-IP': '192.0.2.10' })).status, 204);
  assert.equal((await post(payload, { 'CF-Connecting-IP': '192.0.2.10' })).status, 429);
  assert.equal((await run(new Request(url, { method: 'POST', headers: { Origin: origin, 'Content-Type': 'application/json' }, body: JSON.stringify(payload) }), {})).status, 503);
});

function browser({ host = 'jeanpiagetsullana.pages.dev', dnt = false, referrer = '', query = '', pathname = '/' } = {}) {
  const sent = [], handlers = {};
  const context = { location: { hostname: host, pathname, search: query, href: 'https://' + host + pathname + query }, navigator: { doNotTrack: dnt ? '1' : '0' }, innerWidth: 390, URL, URLSearchParams, Date, JSON,
    fetch: async (...args) => { sent.push(args); return { ok: true }; },
    document: { referrer, visibilityState: 'visible', readyState: 'complete', addEventListener(name, callback) { handlers[name] = callback; }, removeEventListener() {} }
  };
  vm.runInNewContext(readFileSync('js/metrics.js', 'utf8'), context);
  return { sent, handlers };
}

test('browser: sends only allowlisted dimensions, never query strings or form content', () => {
  const b = browser({ query: '?email=private@example.invalid&utm_source=facebook', referrer: 'https://example.invalid/private?email=secret' });
  assert.equal(b.sent.length, 1);
  assert.deepEqual(JSON.parse(b.sent[0][1].body), { page: '/', event: 'page_view', source: 'facebook', device: 'mobile' });
  assert.equal(b.sent[0][1].referrerPolicy, 'no-referrer');
  assert.equal(b.sent[0][1].credentials, 'omit');
  b.handlers.click({ target: { closest() { return { href: 'https://wa.me/51959425312' }; } } });
  assert.equal(JSON.parse(b.sent[1][1].body).event, 'whatsapp_click');
  assert.equal(browser({ dnt: true }).sent.length, 0);
  assert.equal(browser({ host: 'adrinoaimar.github.io' }).sent.length, 0);
  assert.equal(browser({ pathname: '/admin' }).sent.length, 0);
  const fakeGoogle = browser({ referrer: 'https://google.evil.example/' });
  assert.equal(JSON.parse(fakeGoogle.sent[0][1].body).source, 'other');
  const contact = browser({ pathname: '/contacto' });
  contact.handlers['jp:form-success']({ detail: { type: 'contacto', nombre: 'private' } });
  assert.equal(JSON.parse(contact.sent[1][1].body).event, 'contact_success');
  assert.equal(contact.sent[1][1].body.includes('private'), false);
});
