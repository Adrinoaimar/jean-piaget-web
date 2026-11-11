const origins = new Set(['https://adrinoaimar.github.io', 'http://127.0.0.1:8874', 'http://localhost:8874']);
Deno.serve(async (req: Request) => {
  const origin = req.headers.get('origin') || '';
  const headers = { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': origins.has(origin) ? origin : 'https://adrinoaimar.github.io', 'Access-Control-Allow-Headers': 'authorization, apikey, content-type', 'Access-Control-Allow-Methods': 'POST, OPTIONS', 'Vary': 'Origin', 'Cache-Control': 'no-store' };
  const reply = (status: number, message: string) => new Response(JSON.stringify({success: status === 200, message}), {status, headers});
  if (!origins.has(origin)) return reply(403, 'Origen no permitido.');
  if (req.method === 'OPTIONS') return new Response(null, {status: 204, headers});
  if (req.method !== 'POST') return reply(405, 'Método no permitido.');
  if (!(req.headers.get('content-type') || '').includes('application/json')) return reply(415, 'Formato no válido.');
  try {
    const raw = await req.text();
    if (new TextEncoder().encode(raw).length > 12000) return reply(413, 'Mensaje demasiado largo.');
    const body = JSON.parse(raw);
    if (body.website) return reply(400, 'No se pudo validar la consulta.');
    if (body.consentimiento !== true) return reply(400, 'Acepta el tratamiento de tus datos para enviar.');
    const tipo = body.tipo;
    if (!['contacto', 'admision'].includes(tipo)) return reply(400, 'Formulario no válido.');
    const text = (name: string, max: number) => {
      const v = body[name];
      if (v != null && typeof v !== 'string') throw new Error('validation');
      const result = (v || '').trim();
      if (result.length > max) throw new Error('validation');
      return result;
    };
    const data = { id:text('id',36), tipo, nombre:text('nombre',100), email:text('email',254), telefono:text('telefono',30), postulante:text('postulante',100), grado:text('grado',30), motivo:text('motivo',30), mensaje:text('mensaje',3000) };
    if (!/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(data.id) || data.nombre.length<2 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) return reply(400, 'Revisa nombre y correo.');
    if (data.telefono && !/^[+\d\s().-]{6,30}$/.test(data.telefono)) return reply(400,'Revisa el teléfono.');
    if (tipo==='admision' && (data.postulante.length<2 || !data.telefono || !/^(inicial-[345]|primaria-[1-6])$/.test(data.grado))) return reply(400,'Revisa los datos de admisión.');
    if (tipo==='contacto' && (data.mensaje.length<10 || !['admision','inicial','primaria','otro'].includes(data.motivo))) return reply(400,'Revisa el motivo y el mensaje.');
    const secretKeys = JSON.parse(Deno.env.get('SUPABASE_SECRET_KEYS') || '{}');
    const key = secretKeys.default || Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
    const hash = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(key + ':' + ip));
    const ipHash = Array.from(new Uint8Array(hash)).map(b=>b.toString(16).padStart(2,'0')).join('');
    const authHeaders: Record<string,string> = {'apikey':key,'Content-Type':'application/json'};
    if (!key.startsWith('sb_secret_')) authHeaders.Authorization = 'Bearer '+key;
    const result = await fetch(Deno.env.get('SUPABASE_URL')+'/rest/v1/rpc/jean_piaget_submit', {method:'POST',headers:authHeaders,body:JSON.stringify({p_payload:data,p_ip_hash:ipHash})});
    if (!result.ok) return reply(503,'No pudimos guardar la consulta. Inténtalo de nuevo o escríbenos por WhatsApp.');
    if (await result.json()==='limited') return reply(429,'Has enviado varias consultas. Inténtalo más tarde o escríbenos por WhatsApp.');
    return reply(200,'Tu consulta quedó registrada. El colegio podrá contactarte con los datos que indicaste.');
  } catch (error) {
    return reply(error instanceof SyntaxError || (error instanceof Error && error.message==='validation') ? 400 : 503, 'No pudimos procesar la consulta. Revisa los campos e inténtalo nuevamente.');
  }
});
