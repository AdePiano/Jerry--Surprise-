// ============================================================
// JERRY EVENT ORGANIZERS — Production Server
// Safe version: server always starts even if notifications fail
// ============================================================
const express = require('express');
const cors    = require('cors');
const path    = require('path');
const fs      = require('fs');

const app  = express();
const PORT = process.env.PORT || 3000;

// ---- Safe-load notifications (never crash server if it fails) ----
let notifyJerry = async (booking) => {
  console.log('📬 Notification system not loaded — skipping');
  return { email: false, telegram: false, sms: false };
};
try {
  const notif = require('./notifications');
  notifyJerry = notif.notifyJerry;
  console.log('✅ Notification system loaded');
} catch(e) {
  console.warn('⚠️  Notification system failed to load:', e.message);
}

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname), {
  setHeaders: (res, filePath) => {
    if (filePath.endsWith('.css')) res.setHeader('Content-Type', 'text/css');
    if (filePath.endsWith('.js'))  res.setHeader('Content-Type', 'application/javascript');
  }
}));

// ---- Database (stored in /tmp — persists during session) ----
const DB_FILE = '/tmp/jerry_bookings.json';

function readDB() {
  try {
    if (!fs.existsSync(DB_FILE)) {
      const empty = { bookings: [], contacts: [] };
      fs.writeFileSync(DB_FILE, JSON.stringify(empty));
      return empty;
    }
    return JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
  } catch(e) {
    console.error('DB read error:', e.message);
    return { bookings: [], contacts: [] };
  }
}

function writeDB(data) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
    return true;
  } catch(e) {
    console.error('DB write error:', e.message);
    return false;
  }
}

// ============================================================
// ROUTES
// ============================================================

// Health check — admin dashboard uses this to show green/red dot
app.get('/health', (req, res) => {
  const db = readDB();
  res.json({
    status:        'ok',
    app:           'Jerry Event Organizers',
    bookingsCount: db.bookings.length,
    notifications: {
      email:    !!process.env.GMAIL_PASSWORD,
      telegram: !!process.env.TELEGRAM_TOKEN,
      sms:      !!process.env.AT_API_KEY,
    }
  });
});

// POST /api/bookings — save booking + notify Jerry
app.post('/api/bookings', async (req, res) => {
  try {
    const { firstName, lastName, phone, email, eventType, eventDate, location, guests, notes } = req.body;

    if (!firstName || !phone || !eventType || !eventDate) {
      return res.status(400).json({ success: false, message: 'Required fields missing' });
    }

    const booking = {
      id:        Date.now().toString(),
      firstName, lastName:  lastName  || '',
      phone,     email:     email     || '',
      eventType, eventDate,
      location:  location  || '',
      guests:    guests    || 0,
      notes:     notes     || '',
      status:    'pending',
      createdAt: new Date().toISOString()
    };

    const db = readDB();
    db.bookings.push(booking);
    writeDB(db);

    console.log('✅ Booking saved:', booking.id, booking.firstName, booking.eventType);

    // Fire notifications without blocking response
    notifyJerry(booking)
      .then(r  => console.log('📬 Notifications:', JSON.stringify(r)))
      .catch(e => console.error('📬 Notification error:', e.message));

    res.status(201).json({ success: true, bookingId: booking.id });

  } catch(e) {
    console.error('POST /api/bookings error:', e.message);
    res.status(500).json({ success: false, message: 'Server error: ' + e.message });
  }
});

// POST /api/contacts — save contact message
app.post('/api/contacts', (req, res) => {
  try {
    const { name, phone, subject, message } = req.body;
    if (!name || !phone || !message)
      return res.status(400).json({ success: false, message: 'Required fields missing' });

    const db = readDB();
    db.contacts.push({
      id: Date.now().toString(), name, phone,
      subject: subject || '', message,
      createdAt: new Date().toISOString()
    });
    writeDB(db);
    res.status(201).json({ success: true });
  } catch(e) {
    res.status(500).json({ success: false, message: e.message });
  }
});

// GET /api/admin/bookings
app.get('/api/admin/bookings', (req, res) => {
  try {
    const db = readDB();
    const bookings = (db.bookings || [])
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    console.log('📋 Admin fetched bookings:', bookings.length);
    res.json({ success: true, bookings, total: bookings.length });
  } catch(e) {
    res.json({ success: true, bookings: [], total: 0 });
  }
});

// GET /api/admin/contacts
app.get('/api/admin/contacts', (req, res) => {
  try {
    const db = readDB();
    const contacts = (db.contacts || [])
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    res.json({ success: true, contacts, total: contacts.length });
  } catch(e) {
    res.json({ success: true, contacts: [], total: 0 });
  }
});

// GET /api/admin/stats
app.get('/api/admin/stats', (req, res) => {
  try {
    const db = readDB();
    const b = db.bookings || [];
    res.json({ success: true, stats: {
      total:     b.length,
      pending:   b.filter(x => x.status === 'pending').length,
      confirmed: b.filter(x => x.status === 'confirmed').length,
      cancelled: b.filter(x => x.status === 'cancelled').length,
    }});
  } catch(e) {
    res.json({ success: true, stats: { total:0, pending:0, confirmed:0, cancelled:0 } });
  }
});

// PATCH /api/admin/bookings/:id/status
app.patch('/api/admin/bookings/:id/status', (req, res) => {
  try {
    const db  = readDB();
    const idx = db.bookings.findIndex(b => b.id === req.params.id);
    if (idx === -1) return res.status(404).json({ success: false, message: 'Booking not found' });
    db.bookings[idx].status = req.body.status;
    writeDB(db);
    res.json({ success: true, booking: db.bookings[idx] });
  } catch(e) {
    res.status(500).json({ success: false, message: e.message });
  }
});

// DELETE /api/admin/bookings/:id
app.delete('/api/admin/bookings/:id', (req, res) => {
  try {
    const db = readDB();
    db.bookings = db.bookings.filter(b => b.id !== req.params.id);
    writeDB(db);
    res.json({ success: true });
  } catch(e) {
    res.status(500).json({ success: false });
  }
});

// Catch-all: serve index.html for any unmatched route
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// ---- Start ----
app.listen(PORT, '0.0.0.0', () => {
  console.log(`\n${'='.repeat(50)}`);
  console.log(`🎊 Jerry Event Organizers — Server Started`);
  console.log(`🌐 Port: ${PORT}`);
  console.log(`📧 Email:    ${process.env.GMAIL_PASSWORD ? '✅ ready' : '⚠️  GMAIL_PASSWORD not set'}`);
  console.log(`📱 Telegram: ${process.env.TELEGRAM_TOKEN ? '✅ ready' : '⚠️  TELEGRAM_TOKEN not set'}`);
  console.log(`📟 SMS:      ${process.env.AT_API_KEY     ? '✅ ready' : '⚠️  AT_API_KEY not set'}`);
  console.log(`${'='.repeat(50)}\n`);
});
