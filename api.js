export const API_BASE = 'https://jerry-surprise-production.up.railway.app';

export const COLORS = {
  burgundy:'#4A1228', burgundyLight:'#6B1E3A', gold:'#C9932A',
  goldLight:'#F0C060', ivory:'#FAF6F0', dark:'#1C1008',
  gray:'#6B6258', border:'#E8DDD4', white:'#FFFFFF',
  green:'#2E7D32', red:'#C62828',
};

export const PACKAGES = [
  { key:'basic',    name:'🥉 መሠረታዊ / Basic',    price:8000  },
  { key:'premium',  name:'🥈 ፕሪሚየም / Premium',  price:20000 },
  { key:'platinum', name:'🥇 ፕላቲኑም / Platinum', price:45000 },
  { key:'custom',   name:'✏️ ብጁ / Custom',        price:0     },
];

export const EVENT_TYPES = [
  'ሠርግ / Wedding','ልደት / Birthday','ኮርፖሬት / Corporate',
  'ባህላዊ / Cultural','ቀብር / Memorial','ሌላ / Other',
];

export const LOCATIONS = [
  'ሆሳዕና / Hossana','ወልቂጤ / Welkite','ቡታጅራ / Butajira',
  'ሶዶ / Sodo','አዋሳ / Hawassa','ሻሸመኔ / Shashemene',
  'ዲላ / Dilla','ጅማ / Jimma','ሀላባ / Halaba',
  'ዓላባ ኩልቶ / Alaba Kulito','ዱቤ / Dube','ቦሳ / Bosa',
];

export const BANKS = [
  { key:'telebirr', name:'Telebirr',    icon:'📱', number:'+251932981847',  label:'ስልክ ቁጥር' },
  { key:'cbe',      name:'CBE',         icon:'🏦', number:'1000123456789', label:'የሂሳብ ቁጥር' },
  { key:'awash',    name:'Awash Bank',  icon:'🏧', number:'0132456789012', label:'የሂሳብ ቁጥር' },
  { key:'dashen',   name:'Dashen Bank', icon:'💳', number:'0114567890123', label:'የሂሳብ ቁጥር' },
];

export const calcDeposit = (price) => Math.round(price * 0.30);
export const formatPrice = (n) => 'ETB ' + Number(n).toLocaleString();

export async function apiPost(endpoint, body) {
  const res = await fetch(API_BASE + endpoint, {
    method:'POST', headers:{'Content-Type':'application/json'},
    body: JSON.stringify(body),
  });
  return res.json();
}
export async function apiGet(endpoint) {
  const res = await fetch(API_BASE + endpoint);
  return res.json();
}
