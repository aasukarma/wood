// Motion Woods — lead + consent logger (Vercel serverless function)
// Runs at  POST /api/lead
//
// Why this exists: the site is static, so consent timestamps generated in the
// browser can be tampered with. This function stamps its OWN server-side
// timestamp (trusted clock), records the client's IP + user agent, and appends
// the record to a Google Sheet you own — a tamper-resistant consent/lead log.
//
// SETUP: see BACKEND-SETUP.md. In short — create a Google Sheet + Apps Script
// Web App, then add its URL as a Vercel Environment Variable named
// SHEET_WEBHOOK_URL. Without that variable the function still works: it validates
// consent and logs to Vercel's own function logs (viewable in the dashboard).

module.exports = async (req, res) => {
  // Allow the interiors demo (possibly a different path/subdomain) to call it too.
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') { res.status(204).end(); return; }
  if (req.method !== 'POST') { res.status(405).json({ ok: false, error: 'Method not allowed' }); return; }

  // Body may arrive parsed (object) or raw (string) depending on runtime.
  let body = req.body;
  if (typeof body === 'string') { try { body = JSON.parse(body); } catch (e) { body = {}; } }
  body = body || {};

  // Consent is mandatory — no consent, no record.
  if (body.consent !== true) {
    res.status(400).json({ ok: false, error: 'Consent is required' });
    return;
  }

  const serverTimestamp = new Date().toISOString(); // trusted server clock (UTC)
  const ip = (req.headers['x-forwarded-for'] || '').split(',')[0].trim() || null;

  const record = {
    serverTimestamp: serverTimestamp,
    clientTimestamp: body.clientTimestamp || null, // what the browser reported (for comparison)
    form: body.form || 'unknown',                  // 'contact' or 'interiors'
    name: (body.name || '').toString().slice(0, 200),
    phone: (body.phone || '').toString().slice(0, 40),
    city: (body.city || '').toString().slice(0, 120),
    requirement: (body.requirement || '').toString().slice(0, 200),
    details: (body.details || '').toString().slice(0, 2000),
    consent: true,
    privacyVersion: body.privacyVersion || 'unknown',
    ip: ip,
    userAgent: (req.headers['user-agent'] || '').toString().slice(0, 400)
  };

  // Forward to your Google Sheet (append-only log) if configured.
  const url = process.env.SHEET_WEBHOOK_URL;
  if (url) {
    try {
      await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(record)
      });
    } catch (e) {
      console.error('Sheet forward failed:', e && e.message);
      // We still return ok so the visitor isn't blocked; the record is in logs below.
    }
  }

  // Always emit to Vercel function logs as a fallback record.
  console.log('MW_LEAD ' + JSON.stringify(record));

  res.status(200).json({ ok: true, serverTimestamp: serverTimestamp });
};
