import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, ADMIN_PASS } from '../utils/api';

export default function LoginScreen({ onLogin }) {
  const [pass, setPass] = useState('');

  function login() {
    if (pass === ADMIN_PASS) { onLogin(); }
    else Alert.alert('❌ ስህተት', 'የይለፍ ቃል ትክክል አይደለም');
  }

  return (
    <LinearGradient colors={[COLORS.burgundy,'#8B2E52']} style={styles.container}>
      <Text style={styles.logo}>ጄሪ ኢቨንት</Text>
      <Text style={styles.subtitle}>Admin Dashboard</Text>
      <View style={styles.card}>
        <Text style={styles.title}>🔐 ይግቡ</Text>
        <Text style={styles.label}>የይለፍ ቃል</Text>
        <TextInput style={styles.input} value={pass} onChangeText={setPass}
          placeholder="••••••••" placeholderTextColor='#aaa'
          secureTextEntry autoCapitalize='none'/>
        <TouchableOpacity style={styles.btn} onPress={login}>
          <Text style={styles.btnText}>ግባ →</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.footer}>ጄሪ ኢቨንት ኦርጋናይዘርስ{'\n'}ሆሳዕና, ኢትዮጵያ 🇪🇹</Text>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container:{ flex:1, alignItems:'center', justifyContent:'center', padding:24 },
  logo:{ fontSize:32, fontWeight:'900', color:COLORS.goldLight, marginBottom:4 },
  subtitle:{ color:'#d4a8b8', fontSize:14, marginBottom:40 },
  card:{ backgroundColor:'rgba(255,255,255,.08)', borderRadius:20, padding:24, width:'100%',
    borderWidth:1, borderColor:'rgba(255,255,255,.15)' },
  title:{ fontSize:20, fontWeight:'900', color:'white', marginBottom:20, textAlign:'center' },
  label:{ fontSize:12, fontWeight:'700', color:'#d4a8b8', marginBottom:6 },
  input:{ backgroundColor:'rgba(255,255,255,.1)', borderWidth:1, borderColor:'rgba(255,255,255,.2)',
    borderRadius:10, padding:14, fontSize:16, color:'white', marginBottom:16 },
  btn:{ backgroundColor:COLORS.gold, padding:16, borderRadius:12, alignItems:'center' },
  btnText:{ color:COLORS.dark, fontWeight:'900', fontSize:16 },
  footer:{ color:'#b8909c', fontSize:12, marginTop:40, textAlign:'center', lineHeight:20 },
});
