// Supabase Edge Function (Deno): emails the team when a new estimate request arrives.
// Deploy: supabase functions deploy notify-estimate
// Secrets: supabase secrets set RESEND_API_KEY=... NOTIFY_TO=team@yourdomain.com NOTIFY_FROM=leads@yourdomain.com
const cors = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type' };

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors });
  const lead = await req.json();
  const esc = (s: unknown) => String(s ?? '').replace(/[<>&]/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;' }[c]!));
  const rows = ['full_name', 'phone', 'email', 'service', 'surface_type', 'property_type', 'location', 'description', 'photo_count']
    .map((k) => `<tr><td style="padding:4px 12px 4px 0;color:#888">${k}</td><td>${esc(lead[k])}</td></tr>`).join('');
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${Deno.env.get('RESEND_API_KEY')}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: Deno.env.get('NOTIFY_FROM'), to: Deno.env.get('NOTIFY_TO'), reply_to: lead.email,
      subject: `New estimate request — ${esc(lead.full_name)} (${esc(lead.service)})`,
      html: `<h2>New estimate request</h2><table>${rows}</table>`,
    }),
  });
  return new Response(JSON.stringify({ ok: res.ok }), { status: res.ok ? 200 : 502, headers: { ...cors, 'Content-Type': 'application/json' } });
});
