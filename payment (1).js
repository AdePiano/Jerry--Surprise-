// ============================================================
// JERRY EVENT ORGANIZERS — Payment System
// Supports: Telebirr, CBE, Awash, Dashen, QR Code
// Model: 30% deposit online + 70% on event day
// ============================================================
const QRCode = require('qrcode');

// Jerry's real bank account details
const JERRY_ACCOUNTS = {
  telebirr: {
    name:    'Telebirr',
    icon:    '📱',
    color:   '#E91E8C',
    number:  '+251932981847',
    account_name: 'Adane Era',
    instruction: 'Telebirr ከፍቱ → ላክ → ቁጥር ያስገቡ → ይክፈሉ',
  },
  cbe: {
    name:    'CBE (ኢ.ኮ.ባ)',
    icon:    '🏦',
    color:   '#1565C0',
    number:  '1000123456789',
    account_name: 'Adane Era Jerry Event',
    instruction: 'CBE Birr ወይም ቅርንጫፍ → ቁጥር ያስገቡ → ስም ያረጋግጡ → ይክፈሉ',
  },
  awash: {
    name:    'Awash Bank',
    icon:    '🏧',
    color:   '#E65100',
    number:  '0132456789012',
    account_name: 'Adane Era Jerry Event',
    instruction: 'Awash ቅርንጫፍ ወይም ሞባይል ባንኪንግ → ያስገቡ → ይክፈሉ',
  },
  dashen: {
    name:    'Dashen Bank',
    icon:    '💳',
    color:   '#2E7D32',
    number:  '0114567890123',
    account_name: 'Adane Era Jerry Event',
    instruction: 'Dashen ቅርንጫፍ ወይም amole → ያስገቡ → ይክፈሉ',
  },
};

// Package prices
const PACKAGES = {
  basic:    { name_am: 'መሠረታዊ',  name_en: 'Basic',    price: 8000  },
  premium:  { name_am: 'ፕሪሚየም',  name_en: 'Premium',  price: 20000 },
  platinum: { name_am: 'ፕላቲኑም', name_en: 'Platinum', price: 45000 },
  custom:   { name_am: 'ብጁ',      name_en: 'Custom',   price: 0     },
};

// Calculate deposit (30%)
function calcDeposit(totalPrice) {
  return Math.round(totalPrice * 0.30);
}

// Generate QR code as base64 image
async function generateQRCode(paymentData) {
  const qrText = JSON.stringify({
    merchant: 'Jerry Event Organizers',
    account:  paymentData.account_number,
    amount:   paymentData.amount,
    ref:      paymentData.reference,
    name:     paymentData.account_name,
  });
  try {
    const qrBase64 = await QRCode.toDataURL(qrText, {
      width: 200,
      margin: 2,
      color: { dark: '#4A1228', light: '#FAF6F0' }
    });
    return qrBase64;
  } catch(e) {
    console.error('QR error:', e.message);
    return null;
  }
}

// Generate payment reference number
function generateRef(bookingId) {
  return 'JE-' + bookingId.slice(-6).toUpperCase();
}

// Build full payment info for a booking
async function buildPaymentInfo(booking, packageKey, customPrice) {
  const pkg       = PACKAGES[packageKey] || PACKAGES.custom;
  const totalPrice = customPrice || pkg.price;
  const deposit   = calcDeposit(totalPrice);
  const remaining = totalPrice - deposit;
  const reference = generateRef(booking.id);

  // Generate QR codes for each bank
  const qrCodes = {};
  for (const [key, bank] of Object.entries(JERRY_ACCOUNTS)) {
    qrCodes[key] = await generateQRCode({
      account_number: bank.number,
      account_name:   bank.account_name,
      amount:         deposit,
      reference,
    });
  }

  return {
    bookingId:   booking.id,
    reference,
    clientName:  `${booking.firstName} ${booking.lastName || ''}`,
    eventType:   booking.eventType,
    eventDate:   booking.eventDate,
    packageName: pkg.name_am + ' / ' + pkg.name_en,
    totalPrice,
    deposit,
    remaining,
    depositPercent: 30,
    accounts:    JERRY_ACCOUNTS,
    qrCodes,
    createdAt:   new Date().toISOString(),
    status:      'pending_payment',
  };
}

module.exports = { buildPaymentInfo, PACKAGES, JERRY_ACCOUNTS, calcDeposit, generateRef };
