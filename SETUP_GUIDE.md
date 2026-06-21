# 🔔 Jerry Event — Notification Setup Guide
## ጄሪ ኢቨንት — የማሳወቂያ ስርዓት አዋቀር

---

## STEP 1 — Gmail Email Alerts 📧

### A. Create a Gmail App Password
Normal Gmail password won't work. You need an "App Password":

1. Go to: https://myaccount.google.com
2. Click **Security** (ደህንነት)
3. Enable **2-Step Verification** if not already on
4. Go back to Security → scroll down → click **App passwords**
5. Select app: **Mail** → Select device: **Other** → type "Jerry Events"
6. Click **Generate** → copy the 16-character password shown (e.g. `abcd efgh ijkl mnop`)

### B. Add to Railway Environment Variables
In Railway dashboard → your project → **Variables** tab → add:

| Variable Name  | Value                        |
|----------------|------------------------------|
| GMAIL_USER     | adaneera538@gmail.com              |
| GMAIL_PASSWORD | abcdefghijklmnop (app password, no spaces) |
| NOTIFY_EMAIL   | adaneera538@gmail.com              |

---

## STEP 2 — Telegram Bot Alerts 📱

### A. Create a Telegram Bot (2 minutes)
1. Open Telegram on your phone
2. Search for **@BotFather** → tap Start
3. Send: `/newbot`
4. Enter bot name: `Jerry Event Bot`
5. Enter username: `jerry_event_bot` (must end in 'bot')
6. BotFather gives you a TOKEN like: `7123456789:AAHxxx...`
7. **Copy and save this token!**

### B. Get Jerry's Chat ID
1. Search for your new bot on Telegram → tap Start
2. Open this URL in browser (replace YOUR_TOKEN):
   `https://api.telegram.org/botYOUR_TOKEN/getUpdates`
3. You'll see JSON with `"chat":{"id": 123456789}` — that number is the Chat ID

### C. Add to Railway Variables

| Variable Name    | Value              |
|------------------|--------------------|
| TELEGRAM_TOKEN   | 7123456789:AAHxxx  |
| TELEGRAM_CHAT_ID | 123456789          |

---

## STEP 3 — Real SMS via Africa's Talking 📟

### A. Create Africa's Talking Account
1. Go to: https://africastalking.com
2. Click **Register** → fill details
3. Verify your email
4. Go to dashboard → **Settings** → **API Key** → copy it
5. Your username is what you registered with

### B. Add Ethiopian Phone Number
1. In AT dashboard → **SMS** → **Sender IDs** → register `JerryEv`
   (Or use sandbox for testing first)

### C. Add to Railway Variables

| Variable Name | Value              |
|---------------|--------------------|
| AT_API_KEY    | your_api_key_here  |
| AT_USERNAME   | your_at_username   |
| AT_FROM       | JerryEv            |
| JERRY_PHONE   | +251932981847      |

---

## STEP 4 — Redeploy on Railway
After adding all variables:
1. Railway automatically redeploys
2. Check logs — you should see:
   ```
   📧 Email:    ✅ configured
   📱 Telegram: ✅ configured
   📟 SMS:      ✅ configured
   ```
3. Submit a test booking from the website
4. Jerry should receive Email + Telegram + SMS within seconds!

---

## ✅ Testing Checklist
- [ ] Submit test booking on website
- [ ] Check email inbox (may be in spam first time)
- [ ] Check Telegram bot for message
- [ ] Check phone for SMS
- [ ] Open admin.html — booking appears in table

## 🆘 Need Help?
Each notification fails silently — the website still works even if
email/telegram/SMS is not configured. Check Railway logs for error messages.
