// ================================================
// JERRY EVENT ORGANIZERS - All Data & Translations
// ================================================

// --- Language System ---
let currentLang = 'am'; // default: Amharic

const translations = {
  am: {
    // Navbar
    nav_home: 'መነሻ',
    nav_services: 'አገልግሎቶች',
    nav_packages: 'ጥቅሎች',
    nav_gallery: 'ፎቶዎች',
    nav_locations: 'ቦታዎች',
    nav_contact: 'ያግኙን',
    nav_book: 'አሁን ይያዙ',

    // Hero
    hero_eyebrow: '🇪🇹 ሆሳዕና፣ ሃዲያ ዞን',
    hero_title: 'ትዝታ የሚሆን',
    hero_title_accent: 'ፕሮግራም',
    hero_title2: 'እናዘጋጅለዎታለን',
    hero_sub: 'ጄሪ ኢቨንት ኦርጋናይዘርስ — ሠርግ፣ ልደት፣ ቀብር፣ ኮርፖሬት እና ባህላዊ ፕሮግራሞችዎን ከፍ ባለ ጥራት እናዘጋጃለን።',
    hero_btn1: 'ፕሮግራም ይያዙ',
    hero_btn2: 'አገልግሎቶቻችን',
    stat1_num: '500+', stat1_label: 'የተሳካ ፕሮግራም',
    stat2_num: '50+',  stat2_label: 'የሚሸፈኑ ቦታዎች',
    stat3_num: '8+',   stat3_label: 'ዓመታት ልምድ',

    // Services
    services_label: 'አገልግሎቶቻችን',
    services_title: 'ምን ዓይነት ፕሮግራሞች እናዘጋጃለን?',
    services_sub: 'ከሠርግ እስከ ቀብር — ሁሉንም ዓይነት ፕሮግራሞች በሙያዊ ጥንቃቄ እናስተዳድራለን',
    svc1_name: 'ሠርግ', svc1_desc: 'ልዩ የሠርግ ቀንዎን ከማስጌጥ እስከ ፎቶ፣ ሙዚቃ፣ ምግብ — ሁሉን እናዘጋጃለን።', svc1_price: 'ከ ETB 15,000',
    svc2_name: 'ልደት', svc2_desc: 'ለሕፃናት ወይም ለጎልማሶች ልዩ የልደት ዝግጅት — ኬክ፣ ማስጌጥ፣ አስተናጋጅ።', svc2_price: 'ከ ETB 5,000',
    svc3_name: 'ኮርፖሬት', svc3_desc: 'ሴሚናር፣ ስብሰባ፣ የሽልማት ምሽቶች — ለድርጅቶች ሙያዊ አደራጅ።', svc3_price: 'ከ ETB 20,000',
    svc4_name: 'ባህላዊ', svc4_desc: 'የሃዲያ፣ ሲዳማ፣ ጉራጌ ባህላዊ ሥርዓቶችን በአካባቢ ባህል እናከብራለን።', svc4_price: 'ከ ETB 10,000',
    svc5_name: 'ቀብር', svc5_desc: 'በሐዘን ጊዜ ሁሉን ነገር ለቤተሰብ ቀለል ለማድረግ — ሐዘን ቤት ዝግጅት።', svc5_price: 'ከ ETB 8,000',

    // Booking
    book_label: 'ፕሮግራም ይያዙ',
    book_title: 'ዛሬ ቀኑን ያስያዙ',
    book_sub: 'ቅፁን ይሙሉ — ቡድናችን በ24 ሰዓት ውስጥ ያገኝዎታል',
    f_fname: 'ስም', f_lname: 'የአባት ስም',
    f_phone: 'ስልክ ቁጥር', f_email: 'ኢሜይል (አማራጭ)',
    f_type: 'የፕሮግራም ዓይነት', f_type_ph: '-- ዓይነት ይምረጡ --',
    f_date: 'የፕሮግራሙ ቀን',
    f_location: 'ቦታ', f_location_ph: '-- ቦታ ይምረጡ --',
    f_guests: 'የእንግዶች ብዛት', f_guests_ph: 'ለምሳሌ፡ 200',
    f_note: 'ተጨማሪ ማስታወሻ', f_note_ph: 'ማንኛውም ተጨማሪ መረጃ...',
    f_submit: 'ጥያቄ ላኩ 📨',
    info_title: 'ለምን ጄሪ ይምረጡ?',
    info1_t: 'ፈጣን ምላሽ', info1_p: 'ጥያቄዎን በ24 ሰዓት ውስጥ እንመልሳለን',
    info2_t: 'ሙሉ አገልግሎት', info2_p: 'ከዕቅድ እስከ ትግበራ — ሁሉን እኛ እናስተዳድራለን',
    info3_t: 'ምርጥ ዋጋ', info3_p: 'ጥራት ሳናስቀር ምቹ ዋጋ እናቀርባለን',
    info4_t: '50+ ቦታዎች', info4_p: 'ሆሳዕናና ዙሪያዋ ሁሉ እናሸፍናለን',

    // Packages
    pkg_label: 'ጥቅሎቻችን',
    pkg_title: 'ለበጀትዎ የሚስማማ ጥቅል',
    pkg_sub: 'ሶስት ዋና ጥቅሎቻችን — ሁሉም ሙሉ አገልግሎት ያካትታሉ',
    pkg1_name: 'መሠረታዊ', pkg1_price: 'ETB 8,000', pkg1_from: 'ከ',
    pkg1_features: ['ማስጌጥ (መሠረታዊ)', 'ሙዚቃ (DJ)', 'አስተናጋጅ', 'ፎቶግራፍ (2 ሰዓት)', 'እቃ ማስቀመጫ'],
    pkg2_name: 'ፕሪሚየም', pkg2_price: 'ETB 20,000', pkg2_from: 'ከ',
    pkg2_features: ['ቅንጡ ማስጌጥ', 'ሙዚቃ + ቀጥታ ዝማሬ', 'ሙሉ ቀን ፎቶ + ቪዲዮ', 'ምግብ አዘገጃጀት', 'ትራንስፖርት', 'MC/አስተናጋጅ'],
    pkg3_name: 'ፕላቲኑም', pkg3_price: 'ETB 45,000', pkg3_from: 'ከ',
    pkg3_features: ['ሙሉ ምክክር', 'ቅንጡ ስፍራ ምርጫ', 'ምርጥ ፎቶ + ሲኒማ ቪዲዮ', 'ዓለም አቀፍ ምግብ', 'ኬክ + ስጦታ', 'ሙሉ ዕቀባ'],
    pkg_btn: 'ይህን ጥቅል ይምረጡ',

    // Gallery
    gallery_label: 'ፎቶ ጋለሪ',
    gallery_title: 'ካለፉ ፕሮግራሞቻችን',
    gallery_sub: 'ያዘጋጀናቸው አንዳንድ ልዩ ፕሮግራሞች',

    // Locations
    loc_label: 'አገልግሎት ቦታዎች',
    loc_title: 'የምናሸፍናቸው ቦታዎች',
    loc_sub: 'ሆሳዕናና ዙሪያዋ — ማዕከላዊ ኢትዮጵያ',

    // Contact
    contact_label: 'ያግኙን',
    contact_title: 'እናናግርዎ',
    contact_sub: 'ጥያቄ ካለዎት ያጫውቱን — ሁሌ ዝግጁ ነን',
    c_name: 'ሙሉ ስም', c_phone: 'ስልክ ቁጥር',
    c_subject: 'ርዕሰ ጉዳይ', c_msg: 'መልዕክት',
    c_send: 'ላኩ',
    c_info_title: 'አድራሻ',

    // Footer
    footer_copy: '© 2025 ጄሪ ኢቨንት ኦርጋናይዘርስ — ሆሳዕና፣ ኢትዮጵያ',

    // Toast
    toast_book: '✅ ጥያቄዎ ተልኳል! በ24 ሰዓት እናገኝዎታለን።',
    toast_contact: '✅ መልዕክትዎ ደረሰን! እናመሰግናለን።',
    toast_error: '⚠️ እባክዎ ሁሉንም ክፍሎች ይሙሉ።',
    lang_switch: 'English',
  },
  en: {
    nav_home: 'Home', nav_services: 'Services', nav_packages: 'Packages',
    nav_gallery: 'Gallery', nav_locations: 'Locations', nav_contact: 'Contact',
    nav_book: 'Book Now',
    hero_eyebrow: '🇪🇹 Hossana, Hadiya Zone',
    hero_title: 'Memorable Events,',
    hero_title_accent: 'Expertly',
    hero_title2: 'Organized',
    hero_sub: 'Jerry Event Organizers — Weddings, Birthdays, Funerals, Corporate & Cultural events organized with excellence across Central Ethiopia.',
    hero_btn1: 'Book an Event', hero_btn2: 'Our Services',
    stat1_num: '500+', stat1_label: 'Successful Events',
    stat2_num: '50+', stat2_label: 'Locations Covered',
    stat3_num: '8+', stat3_label: 'Years Experience',
    services_label: 'OUR SERVICES', services_title: 'What Events Do We Organize?',
    services_sub: 'From weddings to memorial services — we handle every event type with care and professionalism',
    svc1_name: 'Weddings', svc1_desc: 'Full wedding planning from decoration to photography, music, catering, and logistics.', svc1_price: 'From ETB 15,000',
    svc2_name: 'Birthdays', svc2_desc: 'Kids or adult birthday parties — cake, decorations, entertainment, and hosting.', svc2_price: 'From ETB 5,000',
    svc3_name: 'Corporate', svc3_desc: 'Seminars, award nights, and corporate gatherings organized professionally.', svc3_price: 'From ETB 20,000',
    svc4_name: 'Cultural', svc4_desc: 'Hadiya, Sidama, Gurage traditional ceremonies celebrated with authenticity.', svc4_price: 'From ETB 10,000',
    svc5_name: 'Memorial', svc5_desc: 'Compassionate funeral home arrangement so families can focus on grieving.', svc5_price: 'From ETB 8,000',
    book_label: 'BOOK AN EVENT', book_title: 'Reserve Your Date Today',
    book_sub: 'Fill the form — our team will reach you within 24 hours',
    f_fname: 'First Name', f_lname: 'Last Name',
    f_phone: 'Phone Number', f_email: 'Email (Optional)',
    f_type: 'Event Type', f_type_ph: '-- Select type --',
    f_date: 'Event Date', f_location: 'Location', f_location_ph: '-- Select location --',
    f_guests: 'Number of Guests', f_guests_ph: 'e.g. 200',
    f_note: 'Additional Notes', f_note_ph: 'Any extra details...',
    f_submit: 'Send Request 📨',
    info_title: 'Why Choose Jerry?',
    info1_t: 'Fast Response', info1_p: 'We reply to every inquiry within 24 hours',
    info2_t: 'Full Service', info2_p: 'From planning to execution — we handle everything',
    info3_t: 'Best Price', info3_p: 'Quality service at affordable rates',
    info4_t: '50+ Locations', info4_p: 'We cover Hossana and all surrounding areas',
    pkg_label: 'PACKAGES', pkg_title: 'Choose Your Package',
    pkg_sub: 'Three main packages to suit every budget and occasion',
    pkg1_name: 'Basic', pkg1_price: 'ETB 8,000', pkg1_from: 'From',
    pkg1_features: ['Basic Decoration', 'DJ Music', 'Host/MC', 'Photography (2hrs)', 'Tent & Chairs'],
    pkg2_name: 'Premium', pkg2_price: 'ETB 20,000', pkg2_from: 'From',
    pkg2_features: ['Luxury Decoration', 'Music + Live Singer', 'Full-day Photo + Video', 'Catering Service', 'Transportation', 'Professional MC'],
    pkg3_name: 'Platinum', pkg3_price: 'ETB 45,000', pkg3_from: 'From',
    pkg3_features: ['Full Consultation', 'Premium Venue Selection', 'Cinematic Video', 'International Menu', 'Custom Cake + Gifts', 'Full Coordination'],
    pkg_btn: 'Choose This Package',
    gallery_label: 'PHOTO GALLERY', gallery_title: 'From Our Past Events',
    gallery_sub: 'A glimpse of the beautiful events we have organized',
    loc_label: 'SERVICE AREAS', loc_title: 'Locations We Cover',
    loc_sub: 'Hossana and surrounding areas — Central Ethiopia',
    contact_label: 'CONTACT US', contact_title: "Let's Talk",
    contact_sub: 'Have a question? Reach out — we are always ready',
    c_name: 'Full Name', c_phone: 'Phone Number',
    c_subject: 'Subject', c_msg: 'Message', c_send: 'Send Message',
    c_info_title: 'Our Address',
    footer_copy: '© 2025 Jerry Event Organizers — Hossana, Ethiopia',
    toast_book: '✅ Request sent! We will contact you within 24 hours.',
    toast_contact: '✅ Message received! Thank you.',
    toast_error: '⚠️ Please fill in all required fields.',
    lang_switch: 'አማርኛ',
  }
};

// --- Event Types ---
const eventTypes = {
  am: ['ሠርግ', 'ልደት', 'ኮርፖሬት', 'ባህላዊ ሥርዓት', 'ቀብር / ሐዘን', 'ሌላ'],
  en: ['Wedding', 'Birthday', 'Corporate', 'Cultural Ceremony', 'Memorial / Funeral', 'Other']
};

// --- Locations (Central Ethiopia) ---
const locations = [
  { icon: '🏙️', name_am: 'ሆሳዕና', name_en: 'Hossana', region_am: 'ሃዲያ ዞን', region_en: 'Hadiya Zone' },
  { icon: '🌄', name_am: 'ወልቂጤ', name_en: 'Welkite', region_am: 'ጉራጌ ዞን', region_en: 'Gurage Zone' },
  { icon: '🌿', name_am: 'ዱቤ', name_en: 'Dube', region_am: 'ሃዲያ ዞን', region_en: 'Hadiya Zone' },
  { icon: '🏔️', name_am: 'ቡታጅራ', name_en: 'Butajira', region_am: 'ሲልጤ ዞን', region_en: 'Silte Zone' },
  { icon: '🌾', name_am: 'ሶዶ', name_en: 'Sodo', region_am: 'ወላይታ ዞን', region_en: 'Wolayita Zone' },
  { icon: '🌲', name_am: 'ሻሸመኔ', name_en: 'Shashemene', region_am: 'ምዕ/አርሲ ዞን', region_en: 'West Arsi Zone' },
  { icon: '🏞️', name_am: 'አዋሳ', name_en: 'Hawassa', region_am: 'ሲዳማ ክልል', region_en: 'Sidama Region' },
  { icon: '🏘️', name_am: 'ዲላ', name_en: 'Dilla', region_am: 'ጌዲኦ ዞን', region_en: 'Gedeo Zone' },
  { icon: '🌳', name_am: 'ጅማ', name_en: 'Jimma', region_am: 'ኦሮሚያ ክልል', region_en: 'Oromia Region' },
  { icon: '🗺️', name_am: 'ሀላባ', name_en: 'Halaba', region_am: 'ሃዲያ ዞን', region_en: 'Hadiya Zone' },
  { icon: '🏡', name_am: 'ዓላባ ኩልቶ', name_en: 'Alaba Kulito', region_am: 'ሃዲያ ዞን', region_en: 'Hadiya Zone' },
  { icon: '🌄', name_am: 'ቦሳ', name_en: 'Bosa', region_am: 'ሃዲያ ዞን', region_en: 'Hadiya Zone' },
];

// --- Gallery Items ---
const gallery = [
  { img: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=600', label_am: 'ሠርግ', label_en: 'Wedding' },
  { img: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=600', label_am: 'ፓርቲ', label_en: 'Party' },
  { img: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=600', label_am: 'ኮርፖሬት', label_en: 'Corporate' },
  { img: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=600', label_am: 'ልደት', label_en: 'Birthday' },
  { img: 'https://images.unsplash.com/photo-1469371670807-013ccf25f16a?w=600', label_am: 'ሠርግ', label_en: 'Wedding' },
];

// --- Services icons ---
const serviceIcons = ['💍', '🎂', '🏢', '🥁', '🕊️'];

// --- Helper: get translation ---
function t(key) { return translations[currentLang][key] || key; }

// --- Toggle Language ---
function toggleLang() {
  currentLang = currentLang === 'am' ? 'en' : 'am';
  renderAll();
}

// --- Toast ---
function showToast(msg) {
  const el = document.getElementById('toast');
  el.textContent = msg; el.classList.add('show');
  setTimeout(() => el.classList.remove('show'), 3500);
}
