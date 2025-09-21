export default async function handler(req, res) {
  // CORS (safe even though requests are same-origin from your site)
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ message: 'Method Not Allowed' });
    return;
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    const { name = '', email = '', phonenumber = '', subject = '', message = '' } = body || {};

    const text = [
      'New contact form submission:',
      '',
      `Name: ${name}`,
      `Email: ${email}`,
      `PhoneNumber: ${phonenumber}`,
      `Subject: ${subject}`,
      'Message:',
      message,
    ].join('\n');

    // Dynamically import nodemailer (works without setting type: module)
    const nodemailer = (await import('nodemailer')).default;

    const host = process.env.SMTP_HOST || 'smtp.gmail.com';
    const port = Number(process.env.SMTP_PORT || '587');
    const secure = (process.env.SMTP_SECURE || 'false') === 'true'; // true for 465, false for 587
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;

    if (!user || !pass) {
      res.status(500).json({ message: 'Email service not configured. Please set SMTP_USER and SMTP_PASS in Vercel Environment Variables.' });
      return;
    }

    const transporter = nodemailer.createTransport({
      host,
      port,
      secure,
      auth: { user, pass },
    });

    const from = process.env.SMTP_FROM || `Portfolio <${user}>`;
    const to = process.env.TO_EMAIL || 'akaniketkumar532015@gmail.com';

    await transporter.sendMail({
      from,
      to,
      subject: `${subject} ${name}`.trim() || 'New portfolio message',
      text,
    });

    res.status(200).json({ message: 'Message sent successfully!' });
  } catch (e) {
    console.error('SMTP handler error:', e);
    res.status(500).json({ message: 'Failed to send the message.' });
  }
}

