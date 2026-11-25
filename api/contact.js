// Vercel serverless function: receives the contact form and emails it to Gmail.
// Needs two environment variables in Vercel (see README):
//   GMAIL_USER          the Gmail address configured in Vercel
//   GMAIL_APP_PASSWORD  a 16-character Google "App password" (NOT your normal password)

const nodemailer = require('nodemailer');

const esc = (s) => String(s).replace(/[&<>"']/g, (c) => (
  { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
));

// Tiny in-memory throttle (per warm instance): 5 messages / 10 min / IP.
const hits = new Map();
const tooMany = (ip) => {
  const now = Date.now();
  const recent = (hits.get(ip) || []).filter((t) => now - t < 600000);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > 5;
};

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false, error: 'method' });
  }

  const body = typeof req.body === 'string' ? safeParse(req.body) : (req.body || {});
  const name = String(body.name || '').trim().slice(0, 120);
  const email = String(body.email || '').trim().slice(0, 200);
  const subject = String(body.subject || '').trim().slice(0, 200);
  const message = String(body.message || '').trim().slice(0, 5000);

  // Honeypot: real visitors never fill this hidden field, bots do.
  if (body.website) return res.status(200).json({ ok: true });

  if (!name || !subject || !message || !/^\S+@\S+\.\S+$/.test(email)) {
    return res.status(400).json({ ok: false, error: 'invalid' });
  }

  const ip = String(req.headers['x-forwarded-for'] || '').split(',')[0].trim() || 'unknown';
  if (tooMany(ip)) return res.status(429).json({ ok: false, error: 'rate' });

  const { GMAIL_USER, GMAIL_APP_PASSWORD } = process.env;
  if (!GMAIL_USER || !GMAIL_APP_PASSWORD) {
    console.error('Missing GMAIL_USER or GMAIL_APP_PASSWORD');
    return res.status(500).json({ ok: false, error: 'config' });
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user: GMAIL_USER, pass: GMAIL_APP_PASSWORD },
  });

  try {
    await transporter.sendMail({
      from: `"Portfolio contact" <${GMAIL_USER}>`,
      to: GMAIL_USER,
      replyTo: `"${name.replace(/"/g, '')}" <${email}>`, // hitting Reply answers the visitor
      subject: `[Portfolio] ${subject}`,
      text: `${message}\n\n-- \n${name} <${email}>`,
      html: `<div style="font-family:system-ui,sans-serif;max-width:560px">
        <p style="color:#6b45a5;font-size:12px;letter-spacing:.1em;margin:0 0 8px">NEW PORTFOLIO MESSAGE</p>
        <h2 style="margin:0 0 4px">${esc(subject)}</h2>
        <p style="margin:0 0 16px;color:#555">From <strong>${esc(name)}</strong> &lt;${esc(email)}&gt;</p>
        <div style="white-space:pre-wrap;border-left:3px solid #c4a6f0;padding-left:12px">${esc(message)}</div>
      </div>`,
    });
    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('Mail error:', err.message);
    return res.status(500).json({ ok: false, error: 'send' });
  }
};

function safeParse(s) { try { return JSON.parse(s); } catch { return {}; } }

