// ============================================================
// JERRY EVENT ORGANIZERS — Production Server
// ============================================================
const express = require('express');
const cors    = require('cors');
const path    = require('path');
const fs      = require('fs');

const app  = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Serve static files with explicit options
app.use(express.static(path.join(__dirname), {
  setHeaders: (res, filePath) => {
    if (filePath.endsWith('.css')) res.setHeader('Content-Type', 'text/css');
    if (filePath.endsWith('.js'))  res.setHeader('Content-Type', 'application/javascript');
  }
}));

// ---- Simple File-based Database ----
const DB_FILE = '/tmp/bookings_db.json';

function readDB() {
  try {
    if (!fs.existsSync(DB_FILE)) return { bookings: [], contacts: [] };
    return JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
  } catch { return { bookings: [], contacts: [] }; }
}

function writeDB(data) {
  try { fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2)); }
  catch (e) { console.error('DB write error:', e); }
}

// ---- SMS Simulation ----
function sendSMSAlert(booking) {
  console.log('\n' + '='.repeat(50));
  console.log('📱 SMS ALERT TO JERRY:');
  console.log(`👤 ${booking.firstName} ${booking.lastName}`);
  console.log(`📞 ${booking.phone}`);
  console.log(`🎉 ${booking.eventType}`);
  console.log(`📅 ${booking.eventDate}`);
  console.log(`📍 ${booking.location}`);
  console.log(`👥 እንግዶች: ${booking.guests}`);
  console.log('='.repeat(50) + '\n');
}

// ============================================================
// API ROUTES
// ============================================================

app.get('/health', (req, res) => {
  res.json({ status: 'ok', app: 'Jerry Event Organizers', port: PORT });
});

app.post('/api/bookings', (req, res) => {
  try {
    const { firstName, lastName, phone, email, eventType, eventDate, location, guests, notes } = req.body;
    if (!firstName || !phone || !eventType || !eventDate)
      return res.status(400).json({ success: false, message: 'Required fields missing' });

    const db = readDB();
    const booking = {
      id: Date.now().toString(),
      firstName, lastName: lastName||'', phone, email: email||'',
      eventType, eventDate, location: location||'',
      guests: guests||0, notes: notes||'',
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    db.bookings.push(booking);
    writeDB(db);
    sendSMSAlert(booking);
    res.status(201).json({ success: true, bookingId: booking.id });
  } catch (e) {
    console.error('Booking error:', e);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.post('/api/contacts', (req, res) => {
  try {
    const { name, phone, subject, message } = req.body;
    if (!name || !phone || !message)
      return res.status(400).json({ success: false, message: 'Required fields missing' });
    const db = readDB();
    db.contacts.push({
      id: Date.now().toString(), name, phone,
      subject: subject||'', message,
      createdAt: new Date().toISOString()
    });
    writeDB(db);
    res.status(201).json({ success: true });
  } catch { res.status(500).json({ success: false }); }
});

app.get('/api/admin/bookings', (req, res) => {
  try {
    const db = readDB();
    const bookings = (db.bookings||[]).sort((a,b) => new Date(b.createdAt)-new Date(a.createdAt));
    res.json({ success: true, bookings, total: bookings.length });
  } catch { res.json({ success: true, bookings: [], total: 0 }); }
});

app.patch('/api/admin/bookings/:id/status', (req, res) => {
  try {
    const db = readDB();
    const idx = db.bookings.findIndex(b => b.id === req.params.id);
    if (idx === -1) return res.status(404).json({ success: false });
    db.bookings[idx].status = req.body.status;
    writeDB(db);
    res.json({ success: true, booking: db.bookings[idx] });
  } catch { res.status(500).json({ success: false }); }
});

app.delete('/api/admin/bookings/:id', (req, res) => {
  try {
    const db = readDB();
    db.bookings = db.bookings.filter(b => b.id !== req.params.id);
    writeDB(db);
    res.json({ success: true });
  } catch { res.status(500).json({ success: false }); }
});

app.get('/api/admin/stats', (req, res) => {
  try {
    const db = readDB();
    const b = db.bookings||[];
    res.json({ success: true, stats: {
      total:     b.length,
      pending:   b.filter(x=>x.status==='pending').length,
      confirmed: b.filter(x=>x.status==='confirmed').length,
      cancelled: b.filter(x=>x.status==='cancelled').length,
    }});
  } catch { res.json({ success: true, stats:{total:0,pending:0,confirmed:0,cancelled:0} }); }
});

// Catch-all: serve index.html for any unknown route
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// ---- Start ----
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Jerry Event Server running on port ${PORT}`);
  console.log(`🌐 http://localhost:${PORT}`);
  console.log(`📊 http://localhost:${PORT}/admin.html`);
});
