/* ═══════════════════════════════════════════
   BUECON — Contact API (Vercel Serverless)
   Fixed: proper error handling + Supabase log
   ═══════════════════════════════════════════ */

const nodemailer = require('nodemailer');

const SUPABASE_URL  = 'https://qjpomdhpvheudpduywjj.supabase.co';
const SUPABASE_ANON = process.env.SUPABASE_ANON_KEY || '';

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { name, email, phone, interest, message } = req.body || {};
  if (!name?.trim() || !email?.trim() || !message?.trim())
    return res.status(422).json({ error: 'Required fields missing' });
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    return res.status(422).json({ error: 'Invalid email' });

  /* Log to Supabase (non-fatal) */
  try {
    if (SUPABASE_ANON) {
      await fetch(`${SUPABASE_URL}/rest/v1/messages`, {
        method: 'POST',
        headers: {
          'apikey': SUPABASE_ANON,
          'Authorization': `Bearer ${SUPABASE_ANON}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=minimal',
        },
        body: JSON.stringify({ name, email, phone, interest, message }),
      });
    }
  } catch(e) { console.warn('Supabase log failed:', e.message); }

  /* Validate env vars */
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.error('EMAIL_USER or EMAIL_PASS not set');
    return res.status(500).json({ error: 'Email not configured on server' });
  }

  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  try {
    await transporter.verify();
    await transporter.sendMail({
      from:    `"BUECON Website" <${process.env.EMAIL_USER}>`,
      to:      process.env.EMAIL_TO || 'kavyaparmar7866@gmail.com',
      replyTo: email,
      subject: `BUECON Enquiry — ${name}`,
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;background:#0B1C2C;color:#BFC7D5;padding:32px;border-radius:12px">
          <h2 style="color:#C5A46D;font-family:Georgia,serif;margin-bottom:24px">New Enquiry</h2>
          <table style="width:100%;border-collapse:collapse">
            <tr><td style="padding:8px 0;color:#7A8A9C;width:100px">Name</td><td style="color:#fff"><strong>${name}</strong></td></tr>
            <tr><td style="padding:8px 0;color:#7A8A9C">Email</td><td><a href="mailto:${email}" style="color:#C5A46D">${email}</a></td></tr>
            <tr><td style="padding:8px 0;color:#7A8A9C">Phone</td><td>${phone||'—'}</td></tr>
            <tr><td style="padding:8px 0;color:#7A8A9C">Interest</td><td>${interest||'—'}</td></tr>
          </table>
          <div style="border-top:1px solid rgba(197,164,109,0.2);margin:20px 0;padding-top:16px">
            <p style="color:#7A8A9C;font-size:0.8rem;margin-bottom:6px;text-transform:uppercase;letter-spacing:0.1em">Message</p>
            <p style="line-height:1.7">${message.replace(/\n/g,'<br>')}</p>
          </div>
          <p style="color:#3A4A5A;font-size:0.72rem;margin-top:20px">Sent via buecon-website.vercel.app</p>
        </div>`,
    });
    return res.status(200).json({ success: true });
  } catch(err) {
    console.error('Mail error:', err.message);
    return res.status(500).json({ error: 'Failed to send email: ' + err.message });
  }
};
