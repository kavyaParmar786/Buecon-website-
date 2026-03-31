/* ═══════════════════════════════════════════
   BUECON — Contact API (Node.js + Nodemailer)
   
   SETUP:
   1. npm install express nodemailer cors dotenv
   2. Create .env file with credentials
   3. node api/contact.js
   ═══════════════════════════════════════════ */

/* .env file should contain:
   PORT=3001
   EMAIL_USER=kavyaparmar7866@gmail.com
   EMAIL_PASS=your_gmail_app_password
   EMAIL_TO=kavyaparmar7866@gmail.com
*/

const express    = require('express');
const nodemailer = require('nodemailer');
const cors       = require('cors');
require('dotenv').config();

const app  = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

/* ── Nodemailer transporter ── */
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,   /* Use Gmail App Password, not account password */
  },
});

/* ── POST /api/contact ── */
app.post('/api/contact', async (req, res) => {
  const { name, email, phone, interest, message } = req.body;

  /* Validate */
  if (!name?.trim() || !email?.trim() || !message?.trim()) {
    return res.status(422).json({ error: 'Required fields missing' });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(422).json({ error: 'Invalid email' });
  }

  /* Mail options */
  const mailOptions = {
    from:    `"BUECON Website" <${process.env.EMAIL_USER}>`,
    to:      process.env.EMAIL_TO || 'kavyaparmar7866@gmail.com',
    replyTo: email,
    subject: `BUECON Enquiry — ${name}`,
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;color:#333">
        <h2 style="color:#C5A46D;font-family:serif">New BUECON Enquiry</h2>
        <table style="width:100%;border-collapse:collapse">
          <tr><td style="padding:8px 0;color:#666;width:120px">Name</td><td style="padding:8px 0"><strong>${name}</strong></td></tr>
          <tr><td style="padding:8px 0;color:#666">Email</td><td style="padding:8px 0"><a href="mailto:${email}">${email}</a></td></tr>
          <tr><td style="padding:8px 0;color:#666">Phone</td><td style="padding:8px 0">${phone || '—'}</td></tr>
          <tr><td style="padding:8px 0;color:#666">Interest</td><td style="padding:8px 0">${interest || '—'}</td></tr>
        </table>
        <hr style="border:1px solid #eee;margin:20px 0"/>
        <h4 style="color:#666;margin-bottom:8px">Message</h4>
        <p style="line-height:1.7">${message.replace(/\n/g,'<br>')}</p>
        <hr style="border:1px solid #eee;margin:20px 0"/>
        <p style="color:#999;font-size:0.8rem">Sent via BUECON website contact form</p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.json({ success: true });
  } catch (err) {
    console.error('Mail error:', err);
    res.status(500).json({ error: 'Failed to send email' });
  }
});

app.listen(PORT, () => console.log(`BUECON API running on port ${PORT}`));
