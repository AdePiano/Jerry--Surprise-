import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, StyleSheet, Alert, ActivityIndicator, Clipboard } from 'react-native';
import { COLORS, BANKS, formatPrice, calcDeposit, apiPost } from '../utils/api';

export default function PaymentScreen({ route, navigation }) {
  const { bookingId, paymentInfo, package: pkg } = route.params || {};
  const deposit = paymentInfo?.deposit || calcDeposit(pkg?.price || 0);
  const ref     = paymentInfo?.reference || 'JE-' + (bookingId||'').slice(-6).toUpperCase();

  const [selectedBank, setSelectedBank] = useState(BANKS[0]);
  const [transRef, setTransRef]         = useState('');
  const [note, setNote]                 = useState('');
  const [loading, setLoading]           = useState(false);
  const [done, setDone]                 = useState(false);

  function copy(text) {
    Clipboard.setString(text);
    Alert.alert('✅ ተቀድቷል', text);
  }

  async function confirm() {
    if (!transRef) { Alert.alert('⚠️', 'የግብይት ቁጥር ያስገቡ'); return; }
    setLoading(true);
    try {
      const data = await apiPost('/api/payment/confirm', {
        bookingId, bankUsed: selectedBank.name, transactionRef: transRef, screenshotNote: note,
      });
      if (data.success) setDone(true);
      else Alert.alert('❌', data.message || 'ስህተት ተፈጥሯል');
    } catch { Alert.alert('❌', 'ሰርቨር ጋር ለማገናኘት አልተቻለም'); }
    finally { setLoading(false); }
  }

  if (done) return (
    <View style={styles.successWrap}>
      <Text style={styles.successIcon}>🎊</Text>
      <Text style={styles.successTitle}>ክፍያዎ ቀርቧል!</Text>
      <Text style={styles.successSub}>ጄሪ ኢቨንት ቡድን ክፍያዎን ካረጋገጡ{'\n'}ቦታ ማስያዝዎ ይረጋገጣል።{'\n'}በ24 ሰዓት ውስጥ ያነጋግርዎታለን።</Text>
      <View style={styles.refBox}><Text style={styles.refText}>ማጣቀሻ: {ref}</Text></View>
      <TouchableOpacity style={styles.homeBtn} onPress={() => navigation.navigate('Home')}>
        <Text style={styles.homeBtnText}>🏠 ወደ ዋናው ገጽ</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>

      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>💳 ክፍያ</Text>
        <Text style={styles.headerSub}>ዲፖዚት (30%) ይክፈሉ</Text>
      </View>

      <View style={styles.content}>

        {/* AMOUNT */}
        <View style={styles.amountCard}>
          <Text style={styles.amountLabel}>አሁን የሚከፈለው መጠን</Text>
          <Text style={styles.amountValue}>{formatPrice(deposit)}</Text>
          <Text style={styles.amountSub}>30% ቀዳሚ ክፍያ | ማጣቀሻ: {ref}</Text>
        </View>

        {/* BANK SELECTOR */}
        <Text style={styles.sectionTitle}>ባንክ ወይም ሞባይል ክፍያ ይምረጡ</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{marginBottom:16}}>
          {BANKS.map((bank, i) => (
            <TouchableOpacity key={i}
              style={[styles.bankTab, selectedBank.key===bank.key && styles.bankTabActive]}
              onPress={() => setSelectedBank(bank)}>
              <Text style={styles.bankIcon}>{bank.icon}</Text>
              <Text style={[styles.bankName, selectedBank.key===bank.key && {color:COLORS.goldLight}]}>{bank.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* BANK DETAIL */}
        <View style={styles.bankDetail}>
          <View style={styles.bankDetailHeader}>
            <Text style={styles.bankDetailIcon}>{selectedBank.icon}</Text>
            <Text style={styles.bankDetailName}>{selectedBank.name}</Text>
          </View>

          <View style={styles.accountBox}>
            <View style={styles.accountRow}>
              <Text style={styles.accountLabel}>{selectedBank.label}</Text>
              <View style={styles.accountValueRow}>
                <Text style={styles.accountValue}>{selectedBank.number}</Text>
                <TouchableOpacity style={styles.copyBtn} onPress={() => copy(selectedBank.number)}>
                  <Text style={styles.copyBtnText}>ቅዳ</Text>
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.accountRow}>
              <Text style={styles.accountLabel}>👤 ስም</Text>
              <Text style={styles.accountValue}>Adane Era Jerry Event</Text>
            </View>
            <View style={styles.accountRow}>
              <Text style={styles.accountLabel}>📝 ማጣቀሻ</Text>
              <View style={styles.accountValueRow}>
                <Text style={[styles.accountValue, {color:COLORS.gold}]}>{ref}</Text>
                <TouchableOpacity style={styles.copyBtn} onPress={() => copy(ref)}>
                  <Text style={styles.copyBtnText}>ቅዳ</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <View style={styles.instructionBox}>
            <Text style={styles.instructionText}>
              {selectedBank.key==='telebirr'
                ? '📲 Telebirr → ላኩ → ቁጥር ያስገቡ → ማጣቀሻ ያስቀምጡ → ይክፈሉ'
                : `🏦 ${selectedBank.name} → Transfer → ቁጥር ያስገቡ → ስምን ያረጋግጡ → ማጣቀሻ ያስቀምጡ → ይክፈሉ`}
            </Text>
          </View>
        </View>

        {/* CONFIRMATION FORM */}
        <View style={styles.confirmCard}>
          <Text style={styles.confirmTitle}>✅ ክፍያ ማረጋገጫ</Text>
          <Text style={styles.confirmSub}>ከፈሉ? ከዚህ በታች ያረጋግጡ</Text>

          <Text style={styles.label}>የግብይት ቁጥር (Transaction Ref) *</Text>
          <TextInput style={styles.input} value={transRef} onChangeText={setTransRef}
            placeholder="TXN123456789" placeholderTextColor='#aaa'/>

          <Text style={styles.label}>ማስታወሻ (አማራጭ)</Text>
          <TextInput style={styles.input} value={note} onChangeText={setNote}
            placeholder="ተጨማሪ መረጃ..." placeholderTextColor='#aaa'/>

          <TouchableOpacity style={styles.submitBtn} onPress={confirm} disabled={loading}>
            {loading
              ? <ActivityIndicator color={COLORS.dark}/>
              : <Text style={styles.submitText}>📨 ክፍያ ማረጋገጫ ላኩ</Text>
            }
          </TouchableOpacity>
        </View>

      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container:{ flex:1, backgroundColor:COLORS.ivory },
  header:{ backgroundColor:COLORS.burgundy, padding:24, paddingTop:48 },
  headerTitle:{ fontSize:24, fontWeight:'900', color:COLORS.goldLight },
  headerSub:{ color:'#d4a8b8', fontSize:13, marginTop:4 },
  content:{ padding:16 },
  // Amount
  amountCard:{ backgroundColor:COLORS.burgundy, borderRadius:14, padding:20, marginBottom:20, alignItems:'center' },
  amountLabel:{ color:'#d4a8b8', fontSize:12, marginBottom:6 },
  amountValue:{ fontSize:36, fontWeight:'900', color:COLORS.goldLight },
  amountSub:{ color:'#b8909c', fontSize:11, marginTop:6, textAlign:'center' },
  sectionTitle:{ fontSize:14, fontWeight:'800', color:COLORS.dark, marginBottom:10 },
  // Bank tabs
  bankTab:{ backgroundColor:COLORS.white, borderWidth:2, borderColor:COLORS.border,
    borderRadius:12, padding:12, marginRight:8, alignItems:'center', minWidth:75 },
  bankTabActive:{ borderColor:COLORS.burgundy, backgroundColor:'rgba(74,18,40,.06)' },
  bankIcon:{ fontSize:20, marginBottom:4 },
  bankName:{ fontSize:11, fontWeight:'700', color:COLORS.gray },
  // Bank detail
  bankDetail:{ backgroundColor:COLORS.white, borderRadius:14, overflow:'hidden', marginBottom:16,
    shadowColor:'#000', shadowOpacity:.06, shadowRadius:8, elevation:3 },
  bankDetailHeader:{ backgroundColor:COLORS.ivory, padding:14, flexDirection:'row', alignItems:'center', gap:10,
    borderBottomWidth:1, borderBottomColor:COLORS.border },
  bankDetailIcon:{ fontSize:24 },
  bankDetailName:{ fontSize:15, fontWeight:'800', color:COLORS.dark },
  accountBox:{ padding:14 },
  accountRow:{ marginBottom:12 },
  accountLabel:{ fontSize:11, color:COLORS.gray, fontWeight:'600', marginBottom:4 },
  accountValueRow:{ flexDirection:'row', alignItems:'center', justifyContent:'space-between' },
  accountValue:{ fontSize:15, fontWeight:'800', color:COLORS.dark, flex:1 },
  copyBtn:{ backgroundColor:COLORS.gold, paddingHorizontal:10, paddingVertical:4, borderRadius:6 },
  copyBtnText:{ fontSize:11, fontWeight:'700', color:COLORS.dark },
  instructionBox:{ backgroundColor:'#E8F5E9', margin:14, marginTop:0, borderRadius:10, padding:12 },
  instructionText:{ fontSize:12, color:'#1B5E20', lineHeight:20 },
  // Confirm
  confirmCard:{ backgroundColor:COLORS.white, borderRadius:14, padding:16, marginBottom:30,
    shadowColor:'#000', shadowOpacity:.06, shadowRadius:8, elevation:3 },
  confirmTitle:{ fontSize:16, fontWeight:'800', color:COLORS.burgundy, marginBottom:4 },
  confirmSub:{ fontSize:12, color:COLORS.gray, marginBottom:14 },
  label:{ fontSize:12, fontWeight:'700', color:COLORS.gray, marginBottom:5 },
  input:{ backgroundColor:COLORS.ivory, borderWidth:2, borderColor:COLORS.border,
    borderRadius:10, padding:12, fontSize:14, color:COLORS.dark, marginBottom:12 },
  submitBtn:{ backgroundColor:COLORS.burgundy, padding:16, borderRadius:12, alignItems:'center' },
  submitText:{ color:'white', fontWeight:'900', fontSize:15 },
  // Success
  successWrap:{ flex:1, alignItems:'center', justifyContent:'center', padding:30, backgroundColor:COLORS.ivory },
  successIcon:{ fontSize:64, marginBottom:16 },
  successTitle:{ fontSize:26, fontWeight:'900', color:COLORS.green, marginBottom:10 },
  successSub:{ fontSize:14, color:COLORS.gray, textAlign:'center', lineHeight:22, marginBottom:20 },
  refBox:{ backgroundColor:COLORS.ivory, borderWidth:2, borderColor:COLORS.gold,
    borderRadius:12, paddingVertical:12, paddingHorizontal:24, marginBottom:24 },
  refText:{ fontSize:16, fontWeight:'800', color:COLORS.burgundy },
  homeBtn:{ backgroundColor:COLORS.burgundy, paddingVertical:14, paddingHorizontal:32, borderRadius:30 },
  homeBtnText:{ color:'white', fontWeight:'800', fontSize:15 },
});
