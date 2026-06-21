// ============================================================
// JERRY EVENT ORGANIZERS — Full Production Server
// Payment System + Notifications + Admin Dashboard
// ============================================================
const express = require('express');
const cors    = require('cors');
const path    = require('path');
const fs      = require('fs');

const app  = express();
const PORT = process.env.PORT || 3000;

// Safe-load modules
function safeRequire(mod) {
  try { return require(mod); }
  catch(e) { console.warn('⚠️  Could not load:', mod, e.message); return null; }
}

const paymentModule = safeRequire('./payment');
const notifModule   = safeRequire('./notifications');

const buildPaymentInfo = paymentModule ? paymentModule.buildPaymentInfo : null;
const notifyJerry      = notifModule   ? notifModule.notifyJerry        : async () => {};

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname), {
  setHeaders: (res, fp) => {
    if (fp.endsWith('.css')) res.setHeader('Content-Type', 'text/css');
    if (fp.endsWith('.js'))  res.setHeader('Content-Type', 'application/javascript');
  }
}));

// ---- Database ----
const DB_FILE = '/tmp/jerry_db.json';
function readDB() {
  try {
    if (!fs.existsSync(DB_FILE)) {
      const empty = { bookings: [], contacts: [], payments: [] };
      fs.writeFileSync(DB_FILE, JSON.stringify(empty)); return empty;
    }
    const data = JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
    if (!data.payments) data.payments = [];
    return data;
  } catch { return { bookings: [], contacts: [], payments: [] }; }
}
function writeDB(data) {
  try { fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2)); return true; }
  catch(e) { console.error('DB write error:', e.message); return false; }
}

// ============================================================
// ROUTES
// ============================================================

app.get('/health', (req, res) => {
  const db = readDB();
  res.json({ status: 'ok', app: 'Jerry Event Organizers',
    bookings: db.bookings.length, payments: db.payments.length,
    notifications: {
      email:    !!process.env.GMAIL_PASSWORD,
      telegram: !!process.env.TELEGRAM_TOKEN,
      sms:      !!process.env.AT_API_KEY,
    }
  });
});

// ---- POST /api/bookings ----
app.post('/api/bookings', async (req, res) => {
  try {
    const { firstName, lastName, phone, email, eventType, eventDate,
            location, guests, notes, packageKey, customPrice } = req.body;

    if (!firstName || !phone || !eventType || !eventDate)
      return res.status(400).json({ success: false, message: 'Required fields missing' });

    const booking = {
      id: Date.now().toString(), firstName,
      lastName: lastName||'', phone, email: email||'',
      eventType, eventDate, location: location||'',
      guests: guests||0, notes: notes||'',
      packageKey: packageKey || 'custom',
      customPrice: customPrice || 0,
      status: 'pending', paymentStatus: 'unpaid',
      createdAt: new Date().toISOString()
    };

    const db = readDB();
    db.bookings.push(booking);
    writeDB(db);

    // Build payment info
    let paymentInfo = null;
    if (buildPaymentInfo) {
      paymentInfo = await buildPaymentInfo(booking, packageKey || 'custom', customPrice || 0);
      db.payments.push(paymentInfo);
      writeDB(db);
    }

    // Notify Jerry
    notifyJerry(booking).catch(e => console.error('Notify error:', e.message));

    res.status(201).json({ success: true, bookingId: booking.id, paymentInfo });
  } catch(e) {
    console.error('Booking error:', e.message);
    res.status(500).json({ success: false, message: 'Server error: ' + e.message });
  }
});

// ---- POST /api/contacts ----
app.post('/api/contacts', (req, res) => {
  try {
    const { name, phone, subject, message } = req.body;
    if (!name || !phone || !message)
      return res.status(400).json({ success: false, message: 'Required fields missing' });
    const db = readDB();
    db.contacts.push({ id: Date.now().toString(), name, phone, subject: subject||'', message, createdAt: new Date().toISOString() });
    writeDB(db);
    res.status(201).json({ success: true });
  } catch(e) { res.status(500).json({ success: false, message: e.message }); }
});

// ---- GET /api/payment/:bookingId — get payment info ----
app.get('/api/payment/:bookingId', (req, res) => {
  try {
    const db = readDB();
    const payment = db.payments.find(p => p.bookingId === req.params.bookingId);
    if (!payment) return res.status(404).json({ success: false, message: 'Payment info not found' });
    res.json({ success: true, payment });
  } catch(e) { res.status(500).json({ success: false }); }
});

// ---- POST /api/payment/confirm — client uploads screenshot ----
app.post('/api/payment/confirm', (req, res) => {
  try {
    const { bookingId, bankUsed, transactionRef, screenshotNote } = req.body;
    const db = readDB();
    const bIdx = db.bookings.findIndex(b => b.id === bookingId);
    const pIdx = db.payments.findIndex(p => p.bookingId === bookingId);
    if (bIdx === -1) return res.status(404).json({ success: false });

    db.bookings[bIdx].paymentStatus      = 'submitted';
    db.bookings[bIdx].paymentBank        = bankUsed;
    db.bookings[bIdx].paymentTransRef    = transactionRef;
    db.bookings[bIdx].paymentScreenNote  = screenshotNote || '';
    db.bookings[bIdx].paymentSubmittedAt = new Date().toISOString();

    if (pIdx > -1) db.payments[pIdx].status = 'submitted';
    writeDB(db);

    // Notify Jerry about payment submission
    const booking = db.bookings[bIdx];
    notifyJerry({ ...booking,
      firstName: `💰 ክፍያ ቀርቧል — ${booking.firstName}`,
      eventType: `${bankUsed} | Ref: ${transactionRef}`
    }).catch(() => {});

    res.json({ success: true, message: 'Payment confirmation submitted' });
  } catch(e) { res.status(500).json({ success: false }); }
});

// ---- PATCH /api/admin/payment/:bookingId/verify — Jerry verifies payment ----
app.patch('/api/admin/payment/:bookingId/verify', (req, res) => {
  try {
    const { verified } = req.body;
    const db  = readDB();
    const idx = db.bookings.findIndex(b => b.id === req.params.bookingId);
    if (idx === -1) return res.status(404).json({ success: false });
    db.bookings[idx].paymentStatus = verified ? 'verified' : 'rejected';
    db.bookings[idx].status        = verified ? 'confirmed' : 'pending';
    const pIdx = db.payments.findIndex(p => p.bookingId === req.params.bookingId);
    if (pIdx > -1) db.payments[pIdx].status = verified ? 'verified' : 'rejected';
    writeDB(db);
    res.json({ success: true });
  } catch(e) { res.status(500).json({ success: false }); }
});

// ---- Admin routes ----
app.get('/api/admin/bookings', (req, res) => {
  try {
    const db = readDB();
    res.json({ success: true, bookings: (db.bookings||[]).sort((a,b) => new Date(b.createdAt)-new Date(a.createdAt)), total: db.bookings.length });
  } catch { res.json({ success: true, bookings: [], total: 0 }); }
});
app.get('/api/admin/contacts', (req, res) => {
  try {
    const db = readDB();
    res.json({ success: true, contacts: (db.contacts||[]).sort((a,b)=>new Date(b.createdAt)-new Date(a.createdAt)) });
  } catch { res.json({ success: true, contacts: [] }); }
});
app.get('/api/admin/payments', (req, res) => {
  try {
    const db = readDB();
    res.json({ success: true, payments: (db.payments||[]).sort((a,b)=>new Date(b.createdAt)-new Date(a.createdAt)) });
  } catch { res.json({ success: true, payments: [] }); }
});
app.get('/api/admin/stats', (req, res) => {
  try {
    const db = readDB(); const b = db.bookings||[]; const p = db.payments||[];
    res.json({ success: true, stats: {
      total: b.length,
      pending:   b.filter(x=>x.status==='pending').length,
      confirmed: b.filter(x=>x.status==='confirmed').length,
      cancelled: b.filter(x=>x.status==='cancelled').length,
      unpaid:    b.filter(x=>x.paymentStatus==='unpaid').length,
      submitted: b.filter(x=>x.paymentStatus==='submitted').length,
      verified:  b.filter(x=>x.paymentStatus==='verified').length,
      totalDeposits: p.filter(x=>x.status==='verified').reduce((s,x)=>s+(x.deposit||0),0),
    }});
  } catch { res.json({ success: true, stats:{total:0,pending:0,confirmed:0,cancelled:0,unpaid:0,submitted:0,verified:0,totalDeposits:0} }); }
});
app.patch('/api/admin/bookings/:id/status', (req, res) => {
  try {
    const db = readDB(); const idx = db.bookings.findIndex(b=>b.id===req.params.id);
    if (idx===-1) return res.status(404).json({success:false});
    db.bookings[idx].status = req.body.status; writeDB(db);
    res.json({ success: true, booking: db.bookings[idx] });
  } catch { res.status(500).json({success:false}); }
});
app.delete('/api/admin/bookings/:id', (req, res) => {
  try {
    const db = readDB();
    db.bookings = db.bookings.filter(b=>b.id!==req.params.id); writeDB(db);
    res.json({ success: true });
  } catch { res.status(500).json({success:false}); }
});

app.get('*', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));

app.listen(PORT, '0.0.0.0', () => {
  console.log(`\n${'='.repeat(50)}\n🎊 Jerry Event Server — Port ${PORT}`);
  console.log(`💳 Payment system: ${buildPaymentInfo ? '✅' : '❌'}`);
  console.log(`📧 Email: ${process.env.GMAIL_PASSWORD?'✅':'⚠️ not set'}`);
  console.log(`📱 Telegram: ${process.env.TELEGRAM_TOKEN?'✅':'⚠️ not set'}`);
  console.log(`${'='.repeat(50)}\n`);
});
