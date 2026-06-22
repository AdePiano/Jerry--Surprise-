import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Image, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '../utils/api';

const { width } = Dimensions.get('window');

const SERVICES = [
  { icon:'💍', name:'ሠርግ / Wedding',     desc:'ሙሉ የሠርግ አደረጃጀት',          price:'ከ ETB 15,000' },
  { icon:'🎂', name:'ልደት / Birthday',    desc:'ልዩ የልደት ዝግጅት',            price:'ከ ETB 5,000'  },
  { icon:'🏢', name:'ኮርፖሬት / Corporate', desc:'ሴሚናር እና ስብሰባ አደረጃጀት',    price:'ከ ETB 20,000' },
  { icon:'🥁', name:'ባህላዊ / Cultural',   desc:'ባህላዊ ሥርዓቶች አከባበር',        price:'ከ ETB 10,000' },
  { icon:'🕊️', name:'ቀብር / Memorial',    desc:'የሐዘን ቤት አደረጃጀት',          price:'ከ ETB 8,000'  },
];

const GALLERY = [
  'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=400',
  'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=400',
  'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=400',
];

export default function HomeScreen({ navigation }) {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>

      {/* HERO */}
      <LinearGradient colors={[COLORS.burgundy, COLORS.burgundyLight, '#8B2E52']} style={styles.hero}>
        <Text style={styles.heroEyebrow}>🇪🇹 ሆሳዕና፣ ሃዲያ ዞን</Text>
        <Text style={styles.heroTitle}>ትዝታ የሚሆን{'\n'}
          <Text style={{ color: COLORS.goldLight }}>ፕሮግራም</Text>{'\n'}እናዘጋጅለዎታለን
        </Text>
        <Text style={styles.heroSub}>
          ሠርግ፣ ልደት፣ ቀብር፣ ኮርፖሬት እና ባህላዊ ፕሮግራሞችዎን ከፍ ባለ ጥራት እናዘጋጃለን።
        </Text>
        <TouchableOpacity style={styles.heroBtn} onPress={() => navigation.navigate('Booking')}>
          <Text style={styles.heroBtnText}>ፕሮግራም ይያዙ →</Text>
        </TouchableOpacity>

        {/* Stats */}
        <View style={styles.statsRow}>
          {[['500+','ፕሮግራሞች'],['50+','ቦታዎች'],['8+','ዓመታት']].map(([n,l],i) => (
            <View key={i} style={styles.statItem}>
              <Text style={styles.statNum}>{n}</Text>
              <Text style={styles.statLabel}>{l}</Text>
            </View>
          ))}
        </View>
      </LinearGradient>

      {/* SERVICES */}
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>አገልግሎቶቻችን</Text>
        <Text style={styles.sectionTitle}>ምን ዓይነት ፕሮግራሞች?</Text>
        <View style={styles.titleLine}/>
        {SERVICES.map((s, i) => (
          <TouchableOpacity key={i} style={styles.serviceCard} onPress={() => navigation.navigate('Booking')}>
            <Text style={styles.serviceIcon}>{s.icon}</Text>
            <View style={styles.serviceInfo}>
              <Text style={styles.serviceName}>{s.name}</Text>
              <Text style={styles.serviceDesc}>{s.desc}</Text>
              <Text style={styles.servicePrice}>{s.price}</Text>
            </View>
            <Text style={styles.serviceArrow}>›</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* GALLERY */}
      <View style={[styles.section, { backgroundColor: COLORS.white }]}>
        <Text style={styles.sectionLabel}>ፎቶ ጋለሪ</Text>
        <Text style={styles.sectionTitle}>ካለፉ ፕሮግራሞቻችን</Text>
        <View style={styles.titleLine}/>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {GALLERY.map((uri, i) => (
            <Image key={i} source={{ uri }} style={styles.galleryImg}/>
          ))}
        </ScrollView>
      </View>

      {/* CONTACT */}
      <View style={[styles.section, { backgroundColor: COLORS.burgundy }]}>
        <Text style={[styles.sectionTitle, { color: COLORS.goldLight }]}>አድራሻ</Text>
        <View style={styles.titleLine}/>
        {[['📍','ሆሳዕና፣ ሃዲያ ዞን፣ ደቡብ ኢትዮጵያ'],['📞','+251 93 298 1847'],['✉️','adaneera538@gmail.com'],['🕐','ሰኞ–ቅዳሜ: 8:00–6:00']].map(([icon,text],i)=>(
          <View key={i} style={styles.contactRow}>
            <Text style={styles.contactIcon}>{icon}</Text>
            <Text style={styles.contactText}>{text}</Text>
          </View>
        ))}
        <TouchableOpacity style={styles.bookNowBtn} onPress={() => navigation.navigate('Booking')}>
          <Text style={styles.bookNowText}>አሁን ቦታ ያስይዙ 🎊</Text>
        </TouchableOpacity>
      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container:{ flex:1, backgroundColor:COLORS.ivory },
  // Hero
  hero:{ padding:24, paddingTop:50, paddingBottom:30 },
  heroEyebrow:{ color:COLORS.goldLight, fontSize:12, fontWeight:'700', letterSpacing:1, marginBottom:12,
    backgroundColor:'rgba(201,147,42,.2)', alignSelf:'flex-start', paddingHorizontal:12, paddingVertical:4, borderRadius:20 },
  heroTitle:{ fontSize:30, fontWeight:'900', color:'#fff', lineHeight:40, marginBottom:12 },
  heroSub:{ color:'#e0c8d0', fontSize:14, lineHeight:22, marginBottom:20 },
  heroBtn:{ backgroundColor:COLORS.gold, paddingVertical:14, paddingHorizontal:28, borderRadius:30, alignSelf:'flex-start' },
  heroBtnText:{ color:COLORS.dark, fontWeight:'800', fontSize:15 },
  statsRow:{ flexDirection:'row', marginTop:24, paddingTop:20, borderTopWidth:1, borderTopColor:'rgba(255,255,255,.2)' },
  statItem:{ flex:1, alignItems:'center' },
  statNum:{ fontSize:22, fontWeight:'900', color:COLORS.goldLight },
  statLabel:{ fontSize:11, color:'#c8aab4', marginTop:2 },
  // Section
  section:{ padding:20, backgroundColor:COLORS.ivory },
  sectionLabel:{ color:COLORS.gold, fontSize:11, fontWeight:'700', letterSpacing:2, textTransform:'uppercase', marginBottom:4 },
  sectionTitle:{ fontSize:20, fontWeight:'900', color:COLORS.dark, marginBottom:4 },
  titleLine:{ width:40, height:4, backgroundColor:COLORS.gold, borderRadius:2, marginBottom:16 },
  // Services
  serviceCard:{ flexDirection:'row', alignItems:'center', backgroundColor:COLORS.white, borderRadius:12,
    padding:14, marginBottom:10, shadowColor:'#000', shadowOpacity:.06, shadowRadius:8, elevation:3,
    borderLeftWidth:4, borderLeftColor:COLORS.gold },
  serviceIcon:{ fontSize:26, marginRight:12 },
  serviceInfo:{ flex:1 },
  serviceName:{ fontSize:14, fontWeight:'800', color:COLORS.dark },
  serviceDesc:{ fontSize:12, color:COLORS.gray, marginTop:2 },
  servicePrice:{ fontSize:12, fontWeight:'700', color:COLORS.burgundy, marginTop:4 },
  serviceArrow:{ fontSize:24, color:COLORS.gold, fontWeight:'300' },
  // Gallery
  galleryImg:{ width:200, height:140, borderRadius:10, marginRight:10 },
  // Contact
  contactRow:{ flexDirection:'row', alignItems:'center', marginBottom:12 },
  contactIcon:{ fontSize:18, marginRight:10 },
  contactText:{ color:'#e0c8d0', fontSize:13 },
  bookNowBtn:{ backgroundColor:COLORS.gold, padding:16, borderRadius:12, alignItems:'center', marginTop:20 },
  bookNowText:{ color:COLORS.dark, fontWeight:'900', fontSize:16 },
});
