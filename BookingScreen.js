import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { COLORS, PACKAGES, EVENT_TYPES, LOCATIONS, calcDeposit, formatPrice, apiPost } from '../utils/api';

export default function BookingScreen({ navigation }) {
  const [form, setForm] = useState({
    firstName:'', lastName:'', phone:'', email:'',
    eventType:'', eventDate:'', location:'', guests:'', notes:'',
  });
  const [selectedPkg, setSelectedPkg] = useState(PACKAGES[0]);
  const [loading, setLoading] = useState(false);
  const [showTypeList, setShowTypeList]   = useState(false);
  const [showLocList,  setShowLocList]    = useState(false);

  const deposit   = calcDeposit(selectedPkg.price);
  const remaining = selectedPkg.price - deposit;

  async function submit() {
    if (!form.firstName || !form.phone || !form.eventType || !form.eventDate) {
      Alert.alert('⚠️ ስህተት', 'ስም፣ ስልክ፣ ፕሮግራም ዓይነት እና ቀን ያስገቡ።'); return;
    }
    setLoading(true);
    try {
      const data = await apiPost('/api/bookings', {
        ...form, packageKey: selectedPkg.key, customPrice: selectedPkg.price,
      });
      if (data.success) {
        navigation.navigate('Payment', { bookingId: data.bookingId, paymentInfo: data.paymentInfo, package: selectedPkg });
      } else {
        Alert.alert('❌ ስህተት', data.message || 'ሰርቨር ጋር ችግር ተፈጥሯል');
      }
    } catch(e) {
      Alert.alert('❌ ስህተት', 'ሰርቨር ጋር ለማገናኘት አልተቻለም');
    } finally { setLoading(false); }
  }

  const Field = ({ label, field, placeholder, keyboardType, multiline }) => (
    <View style={styles.formGroup}>
      <Text style={styles.label}>{label}</Text>
      <TextInput style={[styles.input, multiline && {height:80, textAlignVertical:'top'}]}
        value={form[field]} onChangeText={v => setForm({...form,[field]:v})}
        placeholder={placeholder} placeholderTextColor='#9a7a86'
        keyboardType={keyboardType||'default'} multiline={multiline}/>
    </View>
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>ቦታ ይያዙ</Text>
        <Text style={styles.headerSub}>ቅጹን ይሙሉ → ወዲያው ወደ ክፍያ ይሄዳሉ</Text>
      </View>

      <View style={styles.form}>
        {/* NAME ROW */}
        <View style={styles.row}>
          <View style={{flex:1, marginRight:8}}>
            <Field label="ስም *" field="firstName" placeholder="አቤቤ"/>
          </View>
          <View style={{flex:1}}>
            <Field label="የአባት ስም" field="lastName" placeholder="በቀለ"/>
          </View>
        </View>

        <Field label="ስልክ ቁጥር *" field="phone" placeholder="+251 9__ __ __ __" keyboardType="phone-pad"/>
        <Field label="ኢሜይል (አማራጭ)" field="email" placeholder="abebe@example.com" keyboardType="email-address"/>

        {/* EVENT TYPE PICKER */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>የፕሮግራም ዓይነት *</Text>
          <TouchableOpacity style={styles.picker} onPress={() => setShowTypeList(!showTypeList)}>
            <Text style={form.eventType ? styles.pickerValue : styles.pickerPlaceholder}>
              {form.eventType || '-- ዓይነት ይምረጡ --'}
            </Text>
            <Text style={{color:COLORS.gold}}>▾</Text>
          </TouchableOpacity>
          {showTypeList && (
            <View style={styles.dropdown}>
              {EVENT_TYPES.map((t,i) => (
                <TouchableOpacity key={i} style={styles.dropItem} onPress={() => { setForm({...form,eventType:t}); setShowTypeList(false); }}>
                  <Text style={styles.dropItemText}>{t}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        <Field label="የፕሮግራሙ ቀን * (YYYY-MM-DD)" field="eventDate" placeholder="2025-12-25"/>

        {/* LOCATION PICKER */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>ቦታ</Text>
          <TouchableOpacity style={styles.picker} onPress={() => setShowLocList(!showLocList)}>
            <Text style={form.location ? styles.pickerValue : styles.pickerPlaceholder}>
              {form.location || '-- ቦታ ይምረጡ --'}
            </Text>
            <Text style={{color:COLORS.gold}}>▾</Text>
          </TouchableOpacity>
          {showLocList && (
            <View style={styles.dropdown}>
              {LOCATIONS.map((l,i) => (
                <TouchableOpacity key={i} style={styles.dropItem} onPress={() => { setForm({...form,location:l}); setShowLocList(false); }}>
                  <Text style={styles.dropItemText}>{l}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        <Field label="የእንግዶች ብዛት" field="guests" placeholder="200" keyboardType="numeric"/>
        <Field label="ተጨማሪ ማስታወሻ" field="notes" placeholder="ማንኛውም ተጨማሪ መረጃ..." multiline/>

        {/* PACKAGE SELECTOR */}
        <Text style={styles.pkgTitle}>ጥቅል ይምረጡ</Text>
        <View style={styles.pkgGrid}>
          {PACKAGES.map((pkg, i) => (
            <TouchableOpacity key={i}
              style={[styles.pkgCard, selectedPkg.key === pkg.key && styles.pkgCardSelected]}
              onPress={() => setSelectedPkg(pkg)}>
              <Text style={styles.pkgName}>{pkg.name}</Text>
              <Text style={[styles.pkgPrice, selectedPkg.key===pkg.key && {color:COLORS.goldLight}]}>
                {pkg.price > 0 ? formatPrice(pkg.price) : 'ጄሪ ይወስናሉ'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* PRICE PREVIEW */}
        {selectedPkg.price > 0 && (
          <View style={styles.priceBox}>
            <Text style={styles.priceBoxTitle}>💰 የዋጋ ማጠቃለያ</Text>
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>ጠቅላላ ዋጋ</Text>
              <Text style={styles.priceValue}>{formatPrice(selectedPkg.price)}</Text>
            </View>
            <View style={[styles.priceRow, styles.priceRowHighlight]}>
              <Text style={styles.priceLabel}>አሁን ይክፈሉ — ዲፖዚት 30%</Text>
              <Text style={[styles.priceValue, {color:COLORS.goldLight, fontSize:18}]}>{formatPrice(deposit)}</Text>
            </View>
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>በፕሮግራሙ ቀን 70%</Text>
              <Text style={styles.priceValue}>{formatPrice(remaining)}</Text>
            </View>
          </View>
        )}

        {/* SUBMIT */}
        <TouchableOpacity style={styles.submitBtn} onPress={submit} disabled={loading}>
          {loading
            ? <ActivityIndicator color={COLORS.dark}/>
            : <Text style={styles.submitText}>ቀጥልና ይክፈሉ →</Text>
          }
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container:{ flex:1, backgroundColor:COLORS.ivory },
  header:{ backgroundColor:COLORS.burgundy, padding:24, paddingTop:48 },
  headerTitle:{ fontSize:24, fontWeight:'900', color:COLORS.goldLight },
  headerSub:{ color:'#d4a8b8', fontSize:13, marginTop:4 },
  form:{ padding:16 },
  row:{ flexDirection:'row' },
  formGroup:{ marginBottom:14 },
  label:{ fontSize:12, fontWeight:'700', color:COLORS.gray, marginBottom:5 },
  input:{ backgroundColor:COLORS.white, borderWidth:2, borderColor:COLORS.border, borderRadius:10,
    padding:12, fontSize:14, color:COLORS.dark },
  picker:{ backgroundColor:COLORS.white, borderWidth:2, borderColor:COLORS.border, borderRadius:10,
    padding:12, flexDirection:'row', justifyContent:'space-between', alignItems:'center' },
  pickerValue:{ fontSize:14, color:COLORS.dark },
  pickerPlaceholder:{ fontSize:14, color:'#aaa' },
  dropdown:{ backgroundColor:COLORS.white, borderWidth:2, borderColor:COLORS.gold, borderRadius:10,
    marginTop:4, maxHeight:200, overflow:'hidden', elevation:5 },
  dropItem:{ padding:12, borderBottomWidth:1, borderBottomColor:COLORS.border },
  dropItemText:{ fontSize:13, color:COLORS.dark },
  pkgTitle:{ fontSize:14, fontWeight:'800', color:COLORS.dark, marginBottom:10, marginTop:4 },
  pkgGrid:{ flexDirection:'row', flexWrap:'wrap', gap:8, marginBottom:14 },
  pkgCard:{ width:'48%', backgroundColor:COLORS.white, borderWidth:2, borderColor:COLORS.border,
    borderRadius:12, padding:12, alignItems:'center' },
  pkgCardSelected:{ borderColor:COLORS.gold, backgroundColor:'rgba(201,147,42,.08)' },
  pkgName:{ fontSize:12, fontWeight:'800', color:COLORS.dark, textAlign:'center' },
  pkgPrice:{ fontSize:12, color:COLORS.gold, fontWeight:'700', marginTop:4 },
  priceBox:{ backgroundColor:COLORS.burgundy, borderRadius:12, padding:16, marginBottom:16 },
  priceBoxTitle:{ fontSize:12, fontWeight:'700', color:'#d4a8b8', marginBottom:10, textTransform:'uppercase', letterSpacing:1 },
  priceRow:{ flexDirection:'row', justifyContent:'space-between', paddingVertical:6 },
  priceRowHighlight:{ borderTopWidth:1, borderTopColor:'rgba(201,147,42,.3)', marginTop:6, paddingTop:10 },
  priceLabel:{ color:'#d4a8b8', fontSize:13 },
  priceValue:{ color:'white', fontWeight:'800', fontSize:14 },
  submitBtn:{ backgroundColor:COLORS.gold, padding:18, borderRadius:14, alignItems:'center', marginBottom:30 },
  submitText:{ color:COLORS.dark, fontWeight:'900', fontSize:16 },
});
