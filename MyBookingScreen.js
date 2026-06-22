import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import { COLORS, formatPrice, apiGet } from '../utils/api';

export default function MyBookingScreen() {
  const [phone, setPhone]       = useState('');
  const [booking, setBooking]   = useState(null);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');

  async function search() {
    if (!phone) { setError('ስልክ ቁጥር ያስገቡ'); return; }
    setLoading(true); setError(''); setBooking(null);
    try {
      const data = await apiGet('/api/admin/bookings');
      const found = (data.bookings||[]).find(b => b.phone === phone || b.phone === '+251'+phone.replace(/^0/,''));
      if (found) setBooking(found);
      else setError('በዚህ ስልክ ቁጥር ምንም ቦታ ማስያዝ አልተገኘም።');
    } catch { setError('ሰርቨር ጋር ለማገናኘት አልተቻለም'); }
    finally { setLoading(false); }
  }

  const statusColor = { pending:COLORS.gold, confirmed:COLORS.green, cancelled:COLORS.red };
  const statusLabel = { pending:'⏳ ይጠብቃል', confirmed:'✅ ተረጋግጧል', cancelled:'❌ ተሰርዟል' };
  const payLabel    = { unpaid:'💳 ያልተከፈለ', submitted:'📨 ክፍያ ቀርቧል', verified:'✅ ተረጋግጧል', rejected:'❌ ተቀባይነት አላገኘም' };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>የቦታ ማስያዝ ሁኔታ</Text>
        <Text style={styles.headerSub}>ስልክ ቁጥርዎን ያስገቡ</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.label}>ስልክ ቁጥር</Text>
        <TextInput style={styles.input} value={phone} onChangeText={setPhone}
          placeholder="+251 9__ __ __ __" placeholderTextColor='#aaa'
          keyboardType='phone-pad'/>
        <TouchableOpacity style={styles.searchBtn} onPress={search} disabled={loading}>
          {loading ? <ActivityIndicator color={COLORS.dark}/> : <Text style={styles.searchBtnText}>🔍 ፈልግ</Text>}
        </TouchableOpacity>

        {error ? <Text style={styles.error}>{error}</Text> : null}

        {booking && (
          <View style={styles.bookingCard}>
            <View style={styles.bookingHeader}>
              <Text style={styles.bookingName}>{booking.firstName} {booking.lastName||''}</Text>
              <View style={[styles.statusBadge, {backgroundColor: statusColor[booking.status]+'20'}]}>
                <Text style={[styles.statusText, {color: statusColor[booking.status]}]}>
                  {statusLabel[booking.status]}
                </Text>
              </View>
            </View>

            {[
              ['🎉 ፕሮግራም', booking.eventType],
              ['📅 ቀን', booking.eventDate],
              ['📍 ቦታ', booking.location||'—'],
              ['👥 እንግዶች', booking.guests||'—'],
              ['🥉 ጥቅል', booking.packageKey||'—'],
            ].map(([l,v],i) => (
              <View key={i} style={styles.infoRow}>
                <Text style={styles.infoLabel}>{l}</Text>
                <Text style={styles.infoValue}>{v}</Text>
              </View>
            ))}

            <View style={styles.divider}/>
            <Text style={styles.paymentTitle}>💳 የክፍያ ሁኔታ</Text>
            <View style={styles.paymentBadge}>
              <Text style={styles.paymentText}>{payLabel[booking.paymentStatus]||'💳 ያልተከፈለ'}</Text>
            </View>
            {booking.paymentBank && (
              <Text style={styles.paymentDetail}>ባንክ: {booking.paymentBank} | Ref: {booking.paymentTransRef}</Text>
            )}

            <View style={styles.refBox}>
              <Text style={styles.refLabel}>ማጣቀሻ ቁጥር</Text>
              <Text style={styles.refValue}>JE-{booking.id?.slice(-6).toUpperCase()}</Text>
            </View>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container:{ flex:1, backgroundColor:COLORS.ivory },
  header:{ backgroundColor:COLORS.burgundy, padding:24, paddingTop:48 },
  headerTitle:{ fontSize:22, fontWeight:'900', color:COLORS.goldLight },
  headerSub:{ color:'#d4a8b8', fontSize:13, marginTop:4 },
  content:{ padding:16 },
  label:{ fontSize:12, fontWeight:'700', color:COLORS.gray, marginBottom:5, marginTop:8 },
  input:{ backgroundColor:COLORS.white, borderWidth:2, borderColor:COLORS.border,
    borderRadius:10, padding:13, fontSize:15, color:COLORS.dark },
  searchBtn:{ backgroundColor:COLORS.gold, padding:15, borderRadius:12, alignItems:'center', marginTop:12, marginBottom:12 },
  searchBtnText:{ color:COLORS.dark, fontWeight:'900', fontSize:15 },
  error:{ color:COLORS.red, fontSize:13, textAlign:'center', marginTop:8 },
  bookingCard:{ backgroundColor:COLORS.white, borderRadius:14, padding:16, marginTop:8,
    shadowColor:'#000', shadowOpacity:.07, shadowRadius:10, elevation:4,
    borderLeftWidth:5, borderLeftColor:COLORS.gold },
  bookingHeader:{ flexDirection:'row', justifyContent:'space-between', alignItems:'center', marginBottom:14 },
  bookingName:{ fontSize:17, fontWeight:'900', color:COLORS.burgundy },
  statusBadge:{ paddingHorizontal:10, paddingVertical:4, borderRadius:20 },
  statusText:{ fontSize:12, fontWeight:'700' },
  infoRow:{ flexDirection:'row', justifyContent:'space-between', paddingVertical:7,
    borderBottomWidth:1, borderBottomColor:COLORS.border },
  infoLabel:{ fontSize:13, color:COLORS.gray, fontWeight:'600' },
  infoValue:{ fontSize:13, color:COLORS.dark, fontWeight:'700' },
  divider:{ height:1, backgroundColor:COLORS.border, marginVertical:14 },
  paymentTitle:{ fontSize:14, fontWeight:'800', color:COLORS.dark, marginBottom:8 },
  paymentBadge:{ backgroundColor:COLORS.ivory, borderRadius:8, padding:10, marginBottom:8 },
  paymentText:{ fontSize:13, fontWeight:'700', color:COLORS.dark },
  paymentDetail:{ fontSize:12, color:COLORS.gray, marginBottom:8 },
  refBox:{ backgroundColor:COLORS.burgundy, borderRadius:10, padding:12, alignItems:'center', marginTop:8 },
  refLabel:{ fontSize:11, color:'#d4a8b8', marginBottom:4 },
  refValue:{ fontSize:18, fontWeight:'900', color:COLORS.goldLight },
});
