// ============================================================
// JERRY EVENT ORGANIZERS — Safe Notification System
// Each channel loads independently — one failure never
// crashes the server or blocks other notifications
// ============================================================

const CONFIG = {
  gmail_user:       process.env.GMAIL_USER       || 'adaneera538@gmail.com',
  gmail_password:   process.env.GMAIL_PASSWORD   || '',
  notify_email:     process.env.NOTIFY_EMAIL     || 'adaneera538@gmail.com',
  telegram_token:   process.env.TELEGRAM_TOKEN   || '',
  telegram_chat_id: process.env.TELEGRAM_CHAT_ID || '',
  at_api_key:       process.env.AT_API_KEY       || '',
  at_username:      process.env.AT_USERNAME      || '',
  at_from:          process.env.AT_FROM          || 'JerryEv',
  jerry_phone:      process.env.JERRY_PHONE      || '+251932981847',
};

// ---- Safe require: never crash if package missing ----
function safeRequire(pkg) {
  try { return require(pkg); }
  catch(e) { console.warn('⚠️  Package not found:', pkg); return null; }
}

// ============================================================
// 1. EMAIL
// ============================================================
async function sendEmailAlert(booking) {
  if (!CONFIG.gmail_password) {
    console.log('📧 Email skipped — GMAIL_PASSWORD not set in Railway Variables');
    return { success: false, reason: 'not configured' };
  }
  const nodemailer = safeRequire('nodemailer');
  if (!nodemailer) return { success: false, reason: 'nodemailer not installed' };

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { user: CONFIG.gmail_user, pass: CONFIG.gmail_password },
    });

    const html = `
<div style="font-family:Arial,sans-serif;max-width:520px;margin:0 auto;border-radius:12px;overflow:hidden;border:1px solid #e0d0d8;">
  <div style="background:#4A1228;padding:1.5rem;text-align:center;">
    <h2 style="color:#F0C060;margin:0;font-size:1.3rem;">🎊 ጄሪ ኢቨንት ኦርጋናይዘርስ</h2>
    <p style="color:#d4a8b8;margin:.3rem 0 0;font-size:.9rem;">አዲስ የቦታ ማስያዝ ተመዝግቧል!</p>
  </div>
  <div style="padding:1.5rem;background:#FAF6F0;">
    <table style="width:100%;border-collapse:collapse;">
      <tr><td style="padding:.6rem;font-weight:bold;color:#6B6258;width:120px;">👤 ደንበኛ</td><td style="padding:.6rem;font-weight:800;font-size:1.1rem;">${booking.firstName} ${booking.lastName||''}</td></tr>
      <tr style="background:#fff;"><td style="padding:.6rem;font-weight:bold;color:#6B6258;">📞 ስልክ</td><td style="padding:.6rem;"><a href="tel:${booking.phone}" style="color:#4A1228;font-weight:700;font-size:1rem;">${booking.phone}</a></td></tr>
      <tr><td style="padding:.6rem;font-weight:bold;color:#6B6258;">🎉 ፕሮግራም</td><td style="padding:.6rem;">${booking.eventType}</td></tr>
      <tr style="background:#fff;"><td style="padding:.6rem;font-weight:bold;color:#6B6258;">📅 ቀን</td><td style="padding:.6rem;">${booking.eventDate}</td></tr>
      <tr><td style="padding:.6rem;font-weight:bold;color:#6B6258;">📍 ቦታ</td><td style="padding:.6rem;">${booking.location||'—'}</td></tr>
      <tr style="background:#fff;"><td style="padding:.6rem;font-weight:bold;color:#6B6258;">👥 እንግዶች</td><td style="padding:.6rem;">${booking.guests||'—'}</td></tr>
      ${booking.notes ? `<tr><td style="padding:.6rem;font-weight:bold;color:#6B6258;">📝 ማስታወሻ</td><td style="padding:.6rem;">${booking.notes}</td></tr>` : ''}
    </table>
    <div style="margin-top:1.5rem;text-align:center;">
      <a href="${process.env.RAILWAY_PUBLIC_DOMAIN ? 'https://'+process.env.RAILWAY_PUBLIC_DOMAIN : '#'}/admin.html"
         style="background:#C9932A;color:#1C1008;padding:.8rem 2rem;border-radius:25px;font-weight:800;text-decoration:none;display:inline-block;font-size:.95rem;">
        📊 Admin Dashboard ክፈት
      </a>
    </div>
  </div>
  <div style="background:#1C1008;padding:.8rem;text-align:center;">
    <p style="color:#9a9090;font-size:.75rem;margin:0;">ጄሪ ኢቨንት ኦርጋናይዘርስ — ሆሳዕና, ኢትዮጵያ 🇪🇹</p>
  </div>
</div>`;

    await transporter.sendMail({
      from:    `"ጄሪ ኢቨንት" <${CONFIG.gmail_user}>`,
      to:      CONFIG.notify_email,
      subject: `🎊 አዲስ ቦታ ማስያዝ — ${booking.firstName} | ${booking.eventType} | ${booking.eventDate}`,
      html,
    });
    console.log('📧 Email sent to:', CONFIG.notify_email);
    return { success: true };
  } catch(err) {
    console.error('📧 Email error:', err.message);
    return { success: false, error: err.message };
  }
}

// ============================================================
// 2. TELEGRAM
// ============================================================
async function sendTelegramAlert(booking) {
  if (!CONFIG.telegram_token || !CONFIG.telegram_chat_id) {
    console.log('📱 Telegram skipped — TELEGRAM_TOKEN or TELEGRAM_CHAT_ID not set');
    return { success: false, reason: 'not configured' };
  }
  const TelegramBot = safeRequire('node-telegram-bot-api');
  if (!TelegramBot) return { success: false, reason: 'telegram package not installed' };

  try {
    const bot = new TelegramBot(CONFIG.telegram_token);
    const msg =
`🎊 *አዲስ ቦታ ማስያዝ — ጄሪ ኢቨንት*

👤 *ደንበኛ:* ${booking.firstName} ${booking.lastName||''}
📞 *ስልክ:* ${booking.phone}
🎉 *ፕሮግራም:* ${booking.eventType}
📅 *ቀን:* ${booking.eventDate}
📍 *ቦታ:* ${booking.location||'—'}
👥 *እንግዶች:* ${booking.guests||'—'}
${booking.notes ? `📝 *ማስታወሻ:* ${booking.notes}` : ''}

🕐 _${new Date().toLocaleString()}_`;

    await bot.sendMessage(CONFIG.telegram_chat_id, msg, { parse_mode: 'Markdown' });
    console.log('📱 Telegram sent to chat:', CONFIG.telegram_chat_id);
    return { success: true };
  } catch(err) {
    console.error('📱 Telegram error:', err.message);
    return { success: false, error: err.message };
  }
}

// ============================================================
// 3. SMS (Africa's Talking)
// ============================================================
async function sendSMSAlert(booking) {
  // Always log to console
  console.log('\n' + '='.repeat(50));
  console.log('📟 SMS ALERT TO JERRY (+251932981847):');
  console.log(`👤 ${booking.firstName} ${booking.lastName||''} | 📞 ${booking.phone}`);
  console.log(`🎉 ${booking.eventType} | 📅 ${booking.eventDate}`);
  console.log(`📍 ${booking.location||'—'} | 👥 ${booking.guests||'—'} እንግዶች`);
  console.log('='.repeat(50) + '\n');

  if (!CONFIG.at_api_key || !CONFIG.at_username) {
    console.log('📟 SMS skipped — AT_API_KEY or AT_USERNAME not set');
    return { success: false, reason: 'not configured' };
  }
  const AfricasTalking = safeRequire('africastalking');
  if (!AfricasTalking) return { success: false, reason: 'africastalking package not installed' };

  try {
    const AT = AfricasTalking({ apiKey: CONFIG.at_api_key, username: CONFIG.at_username });
    const smsText =
`Jerry Event: New Booking!
${booking.firstName} ${booking.lastName||''}
Tel: ${booking.phone}
${booking.eventType} - ${booking.eventDate}
${booking.location||''} - ${booking.guests||'?'} guests`;

    const result = await AT.SMS.send({
      to:      [CONFIG.jerry_phone],
      message: smsText,
      from:    CONFIG.at_from,
    });
    console.log('📟 SMS sent:', JSON.stringify(result));
    return { success: true, result };
  } catch(err) {
    console.error('📟 SMS error:', err.message);
    return { success: false, error: err.message };
  }
}

// ============================================================
// MASTER — fire all 3, none blocks the others
// ============================================================
async function notifyJerry(booking) {
  console.log('\n🔔 Notifying Jerry about booking:', booking.id);
  const [e, t, s] = await Promise.allSettled([
    sendEmailAlert(booking),
    sendTelegramAlert(booking),
    sendSMSAlert(booking),
  ]);
  return {
    email:    e.value || { success: false },
    telegram: t.value || { success: false },
    sms:      s.value || { success: false },
  };
}

module.exports = { notifyJerry };
