// ============================================================
// JERRY EVENT ORGANIZERS — Notification System
// 1. Email (Gmail via Nodemailer)
// 2. Telegram Bot
// 3. SMS (Africa's Talking)
// ============================================================

const nodemailer = require('nodemailer');
const TelegramBot = require('node-telegram-bot-api');
const AfricasTalking = require('africastalking');

// ============================================================
// CONFIGURATION — loaded from environment variables
// Set these in Railway Dashboard → Variables
// ============================================================
const CONFIG = {
  // --- EMAIL (Gmail) ---
  gmail_user:     process.env.GMAIL_USER     || 'adaneera538@gmail.com',
  gmail_password: process.env.GMAIL_PASSWORD || '',   // Gmail App Password (NOT normal password)
  notify_email:   process.env.NOTIFY_EMAIL   || 'adaneera538@gmail.com',

  // --- TELEGRAM ---
  telegram_token:   process.env.TELEGRAM_TOKEN   || '',  // from @BotFather
  telegram_chat_id: process.env.TELEGRAM_CHAT_ID || '',  // Jerry's chat ID

  // --- AFRICA'S TALKING (SMS) ---
  at_api_key:   process.env.AT_API_KEY   || '',   // from africastalking.com dashboard
  at_username:  process.env.AT_USERNAME  || '',   // your AT username
  at_from:      process.env.AT_FROM      || 'JerryEv', // sender name (max 11 chars)
  jerry_phone:  process.env.JERRY_PHONE  || '+251932981847',
};

// ============================================================
// 1. EMAIL NOTIFICATION
// ============================================================
async function sendEmailAlert(booking) {
  if (!CONFIG.gmail_user || !CONFIG.gmail_password) {
    console.log('📧 Email skipped — GMAIL_USER or GMAIL_PASSWORD not set');
    return { success: false, reason: 'not configured' };
  }

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: CONFIG.gmail_user,
        pass: CONFIG.gmail_password, // Must be Gmail App Password
      },
    });

    const emailHTML = `
      <div style="font-family:Arial,sans-serif;max-width:500px;margin:0 auto;border:1px solid #e0e0e0;border-radius:12px;overflow:hidden;">
        <div style="background:#4A1228;padding:1.5rem;text-align:center;">
          <h2 style="color:#F0C060;margin:0;">🎊 ጄሪ ኢቨንት ኦርጋናይዘርስ</h2>
          <p style="color:#d4a8b8;margin:.4rem 0 0;">አዲስ የቦታ ማስያዝ ተመዝግቧል!</p>
        </div>
        <div style="padding:1.5rem;background:#FAF6F0;">
          <table style="width:100%;border-collapse:collapse;">
            <tr><td style="padding:.5rem;color:#6B6258;font-weight:bold;width:130px;">👤 ደንበኛ:</td><td style="padding:.5rem;font-weight:800;">${booking.firstName} ${booking.lastName || ''}</td></tr>
            <tr style="background:#fff;"><td style="padding:.5rem;color:#6B6258;font-weight:bold;">📞 ስልክ:</td><td style="padding:.5rem;"><a href="tel:${booking.phone}" style="color:#4A1228;font-weight:700;">${booking.phone}</a></td></tr>
            <tr><td style="padding:.5rem;color:#6B6258;font-weight:bold;">🎉 ፕሮግራም:</td><td style="padding:.5rem;">${booking.eventType}</td></tr>
            <tr style="background:#fff;"><td style="padding:.5rem;color:#6B6258;font-weight:bold;">📅 ቀን:</td><td style="padding:.5rem;">${booking.eventDate}</td></tr>
            <tr><td style="padding:.5rem;color:#6B6258;font-weight:bold;">📍 ቦታ:</td><td style="padding:.5rem;">${booking.location || '—'}</td></tr>
            <tr style="background:#fff;"><td style="padding:.5rem;color:#6B6258;font-weight:bold;">👥 እንግዶች:</td><td style="padding:.5rem;">${booking.guests || '—'}</td></tr>
            ${booking.notes ? `<tr><td style="padding:.5rem;color:#6B6258;font-weight:bold;">📝 ማስታወሻ:</td><td style="padding:.5rem;">${booking.notes}</td></tr>` : ''}
          </table>
          <div style="margin-top:1.5rem;text-align:center;">
            <a href="${process.env.RAILWAY_PUBLIC_DOMAIN ? 'https://'+process.env.RAILWAY_PUBLIC_DOMAIN : ''}/admin.html"
               style="background:#C9932A;color:#1C1008;padding:.8rem 2rem;border-radius:25px;font-weight:800;text-decoration:none;display:inline-block;">
              📊 Admin Dashboard ክፈት
            </a>
          </div>
        </div>
        <div style="background:#1C1008;padding:1rem;text-align:center;">
          <p style="color:#9a9090;font-size:.8rem;margin:0;">ጄሪ ኢቨንት ኦርጋናይዘርስ — ሆሳዕና, ኢትዮጵያ 🇪🇹</p>
        </div>
      </div>`;

    await transporter.sendMail({
      from:    `"ጄሪ ኢቨንት System" <${CONFIG.gmail_user}>`,
      to:      CONFIG.notify_email || CONFIG.gmail_user,
      subject: `🎊 አዲስ ቦታ ማስያዝ — ${booking.firstName} | ${booking.eventType} | ${booking.eventDate}`,
      html:    emailHTML,
    });

    console.log('📧 Email alert sent to:', CONFIG.notify_email || CONFIG.gmail_user);
    return { success: true };
  } catch (err) {
    console.error('📧 Email error:', err.message);
    return { success: false, error: err.message };
  }
}

// ============================================================
// 2. TELEGRAM NOTIFICATION
// ============================================================
async function sendTelegramAlert(booking) {
  if (!CONFIG.telegram_token || !CONFIG.telegram_chat_id) {
    console.log('📱 Telegram skipped — TELEGRAM_TOKEN or TELEGRAM_CHAT_ID not set');
    return { success: false, reason: 'not configured' };
  }

  try {
    const bot = new TelegramBot(CONFIG.telegram_token);
    const message =
`🎊 *አዲስ የቦታ ማስያዝ — ጄሪ ኢቨንት*

👤 *ደንበኛ:* ${booking.firstName} ${booking.lastName || ''}
📞 *ስልክ:* [${booking.phone}](tel:${booking.phone})
🎉 *ፕሮግራም:* ${booking.eventType}
📅 *ቀን:* ${booking.eventDate}
📍 *ቦታ:* ${booking.location || '—'}
👥 *እንግዶች:* ${booking.guests || '—'}
${booking.notes ? `📝 *ማስታወሻ:* ${booking.notes}` : ''}

🕐 _${new Date().toLocaleString('am-ET')}_`;

    await bot.sendMessage(CONFIG.telegram_chat_id, message, {
      parse_mode: 'Markdown',
    });

    console.log('📱 Telegram alert sent to chat:', CONFIG.telegram_chat_id);
    return { success: true };
  } catch (err) {
    console.error('📱 Telegram error:', err.message);
    return { success: false, error: err.message };
  }
}

// ============================================================
// 3. SMS NOTIFICATION (Africa's Talking)
// ============================================================
async function sendSMSAlert(booking) {
  // Always log to console
  console.log('\n' + '='.repeat(50));
  console.log('📱 SMS ALERT TO JERRY:');
  console.log(`👤 ${booking.firstName} ${booking.lastName || ''}`);
  console.log(`📞 ${booking.phone}`);
  console.log(`🎉 ${booking.eventType} | 📅 ${booking.eventDate}`);
  console.log(`📍 ${booking.location} | 👥 ${booking.guests} እንግዶች`);
  console.log('='.repeat(50) + '\n');

  if (!CONFIG.at_api_key || !CONFIG.at_username || !CONFIG.jerry_phone) {
    console.log('📟 SMS skipped — AT_API_KEY, AT_USERNAME or JERRY_PHONE not set');
    return { success: false, reason: 'not configured' };
  }

  try {
    const AT  = AfricasTalking({
      apiKey:   CONFIG.at_api_key,
      username: CONFIG.at_username,
    });

    const smsText =
`Jerry Event: Booking!
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
  } catch (err) {
    console.error('📟 SMS error:', err.message);
    return { success: false, error: err.message };
  }
}

// ============================================================
// MASTER FUNCTION — send all notifications at once
// ============================================================
async function notifyJerry(booking) {
  console.log('\n🔔 Sending notifications for booking:', booking.id);

  const [emailResult, telegramResult, smsResult] = await Promise.allSettled([
    sendEmailAlert(booking),
    sendTelegramAlert(booking),
    sendSMSAlert(booking),
  ]);

  return {
    email:    emailResult.value    || { success: false },
    telegram: telegramResult.value || { success: false },
    sms:      smsResult.value      || { success: false },
  };
}

module.exports = { notifyJerry, sendEmailAlert, sendTelegramAlert, sendSMSAlert };
