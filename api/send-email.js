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

    const from = process.env.SMTP_FROM || `Aniket Kumar | Portfolio <${user}>`;
    const to = process.env.TO_EMAIL || 'akaniketkumar532015@gmail.com';

    const esc = (s = '') => String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
    const isValidEmail = (e) => /[^@\s]+@[^@\s]+\.[^@\s]+/.test(String(e || '').trim());

    const prettySubject = (subject && subject.trim()) ? `${subject.trim()} — ${name || 'Visitor'}` : `New portfolio message — ${name || 'Visitor'}`;

    const avatarUrl = process.env.SIGNATURE_AVATAR_URL;
    const avatarHtml = avatarUrl ? `<img src='${avatarUrl}' width='36' height='36' style='display:inline-block;border-radius:50%;vertical-align:middle;border:1px solid rgba(255,255,255,0.2);box-shadow:0 4px 12px rgba(255,0,238,.18);margin-right:10px;' alt='Avatar'/>` : '';
    const signatureBlock = `
      <div style='margin-top:18px;padding-top:14px;border-top:1px solid rgba(255,255,255,0.08);font-size:13px;opacity:.9;'>
        <div style='display:flex;align-items:center;'>
          ${avatarHtml}
          <div>
            <div style='font-weight:600;'>Aniket Kumar</div>
            <div style='opacity:.85;'>Software Engineer</div>
          </div>
        </div>
        <div style='margin-top:8px;'>
          <a href='https://aniket.uk' style='color:#ff7af6;text-decoration:none;'>aniket.uk</a> •
          <a href='mailto:akaniketkumar532015@gmail.com' style='color:#7ad7ff;text-decoration:none;'>Email</a> •
          <a href='https://linkedin.com/in/aniketkumar/' style='color:#7ad7ff;text-decoration:none;'>LinkedIn</a> •
          <a href='https://github.com/aniket532015' style='color:#7ad7ff;text-decoration:none;'>GitHub</a>
        </div>
      </div>`;

    const htmlOwner = `<!doctype html><html><head><meta charset='utf-8'><meta name='viewport' content='width=device-width'><title>New Contact</title></head>
<body style='margin:0;background:#0b0f14;font-family:Inter,Arial,sans-serif;color:#e6e6e6;'>
  <table role='presentation' width='100%' cellpadding='0' cellspacing='0' style='background:#0b0f14;padding:24px 0;'>
    <tr><td align='center'>
      <table role='presentation' width='620' cellpadding='0' cellspacing='0' style='width:620px;max-width:90%;background:#111827;border:1px solid rgba(255,255,255,0.08);border-radius:12px;box-shadow:0 10px 30px rgba(255,0,238,0.06);overflow:hidden;'>
        <tr><td style='padding:20px 24px;background:linear-gradient(90deg,#ff00ee,#00d4ff);color:#0b0f14;font-weight:700;font-size:18px;'>New contact form submission</td></tr>
        <tr><td style='padding:24px;'>
          <p style='margin:0 0 12px;font-size:16px;opacity:.9;'>You received a new message from your portfolio.</p>
          <table width='100%' cellpadding='0' cellspacing='0' style='font-size:14px;line-height:1.6;'>
            <tr><td style='padding:8px 0;width:140px;opacity:.7;'>Name</td><td style='padding:8px 0;'>${esc(name)}</td></tr>
            <tr><td style='padding:8px 0;width:140px;opacity:.7;'>Email</td><td style='padding:8px 0;'>${esc(email)}</td></tr>
            <tr><td style='padding:8px 0;width:140px;opacity:.7;'>Phone</td><td style='padding:8px 0;'>${esc(phonenumber)}</td></tr>
            <tr><td style='padding:8px 0;width:140px;opacity:.7;'>Subject</td><td style='padding:8px 0;'>${esc(subject)}</td></tr>
          </table>
          <div style='margin:16px 0;padding:16px;border:1px solid rgba(255,255,255,0.12);border-radius:10px;background:rgba(255,255,255,0.03);'>
            <div style='opacity:.7;margin-bottom:8px;'>Message</div>
            <div style='white-space:pre-wrap;font-size:14px;'>${esc(message)}</div>
          </div>
          ${signatureBlock}
          <p style='margin-top:16px;font-size:12px;opacity:.6;'>Sent on ${new Date().toLocaleString()}</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`;

    const greetingName = name || 'there';
    const htmlUser = `<!doctype html><html><head><meta charset='utf-8'><meta name='viewport' content='width=device-width'><title>Thanks for contacting</title></head>
<body style='margin:0;background:#0b0f14;font-family:Inter,Arial,sans-serif;color:#e6e6e6;'>
  <table role='presentation' width='100%' cellpadding='0' cellspacing='0' style='background:#0b0f14;padding:24px 0;'>
    <tr><td align='center'>
      <table role='presentation' width='620' cellpadding='0' cellspacing='0' style='width:620px;max-width:90%;background:#111827;border:1px solid rgba(255,255,255,0.08);border-radius:12px;box-shadow:0 10px 30px rgba(255,0,238,0.06);overflow:hidden;'>
        <tr><td style='padding:20px 24px;background:linear-gradient(90deg,#ff00ee,#00d4ff);color:#0b0f14;font-weight:700;font-size:18px;'>Thanks for reaching out, ${esc(greetingName)}!</td></tr>
        <tr><td style='padding:24px;'>
          <p style='margin:0 0 10px;font-size:16px;'>I got your message and will get back to you soon. You can reply to this email to continue the conversation.</p>
          <p style='margin:0 0 14px;font-size:14px;opacity:.85;'>Here’s a quick summary of what you sent:</p>
          <table width='100%' cellpadding='0' cellspacing='0' style='font-size:14px;line-height:1.6;'>
            <tr><td style='padding:8px 0;width:140px;opacity:.7;'>Subject</td><td style='padding:8px 0;'>${esc(subject || 'Contact')}</td></tr>
          </table>
          <div style='margin:12px 0 16px;padding:14px;border:1px solid rgba(255,255,255,0.12);border-radius:10px;background:rgba(255,255,255,0.03);'>
            <div style='opacity:.7;margin-bottom:8px;'>Your message</div>
            <div style='white-space:pre-wrap;font-size:14px;'>${esc(message)}</div>
          </div>
          <a href='https://aniket.uk' style='display:inline-block;padding:10px 16px;border-radius:10px;background:#ff00ee;color:#0b0f14;text-decoration:none;font-weight:600;box-shadow:0 6px 18px rgba(255,0,238,.25);'>View my portfolio</a>
          ${signatureBlock}
          <p style='margin:18px 0 0;font-size:12px;opacity:.6;'>If this wasn’t you, you can ignore this email.</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`;

    // Send email to you (owner)
    await transporter.sendMail({
      from,
      to,
      subject: prettySubject,
      text,
      html: htmlOwner,
      replyTo: isValidEmail(email) ? email : undefined,
    });

    // Send acknowledgment to user (if email is valid)
    if (isValidEmail(email)) {
      const ackText = [
        `Hi ${greetingName},`,
        '',
        'Thanks for contacting me via my portfolio. I received your message and will reply soon. You can reply to this email to continue the conversation.',
        '',
        `Subject: ${subject || 'Contact'}`,
        'Message:',
        message,
        '',
        '— Aniket Kumar',
        'aniket.uk',
        'LinkedIn: https://linkedin.com/in/aniketkumar/',
        'GitHub: https://github.com/aniket532015',
      ].join('\n');

      try {
        await transporter.sendMail({
          from,
          to: email,
          subject: 'Thanks — I received your message',
          text: ackText,
          html: htmlUser,
          replyTo: to,
        });
      } catch (ackErr) {
        console.error('Ack email failed:', ackErr);
        // Do not fail the overall request if ack fails
      }
    }

    res.status(200).json({ message: 'Message sent successfully!' });
  } catch (e) {
    console.error('SMTP handler error:', e);
    res.status(500).json({ message: 'Failed to send the message.' });
  }
}

