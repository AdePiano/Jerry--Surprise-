import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, RefreshControl, Alert, ActivityIndicator } from 'react-native';
import { COLORS, formatPrice, apiGet, apiPatch, apiDelete } from '../utils/api';

export default function DashboardScreen({ onLogout }) {
  const [stats,    setStats]    = useState(null);
  const [bookings, setBookings] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [refresh,  setRefresh]  = useState(false);
  const [tab,      setTab]      = useState('bookings'); // bookings | payments

  const load = useCallback(async (isRefresh=false) => {
    if (isRefresh) setRefresh(true); else setLoading(true);
    try {
      const [s, b, p] = await Promise.all([
        apiGet('/api/admin/stats'),
        apiGet('/api/admin/bookings'),
        apiGet('/api/admin/payments'),
      ]);
      if (s.success) setStats(s.stats);
      setBookings(b.bookings||[]);
      setPayments(p.payments||[]);
    } catch(e) { Alert.alert('❌', 'ዳታ ሊጫን አልቻለም'); }
    finally { setLoading(false); setRefresh(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  async function confirmBooking(id, status) {
    const res = await apiPatch('/api/admin/bookings/'+id+'/status', { status });
    if (res.success) { Alert.alert('✅', status==='confirmed'?'ቦታ ማስያዝ ተረጋግጧል':'ተሰርዟል'); load(); }
  }

  async function deleteBooking(id) {
    Alert.alert('ያረጋግጡ', 'ይህን ቦታ ማስያዝ ለማጥፋት?', [
      { text:'አይ', style:'cancel' },
      { text:'አዎ', style:'destructive', onPress: async () => {
        await apiDelete('/api/admin/bookings/'+id); load();
      }}
    ]);
  }

  async function verifyPayment(id, ok) {
    const res = await apiPatch('/api/admin/payment/'+id+'/verify', { verified: ok });
    if (res.success) { Alert.alert('✅', ok?'ክፍያ ተረጋግጧል!':'ክፍያ ተቀባይነት አላገኘም'); load(); }
  }

  const SBadge = ({ s }) => {
    const map = { pending:{bg:'#FFF3E0',c:'#E65100',t:'⏳ ይጠብቃል'}, confirmed:{bg:'#E8F5E9',c:'#1B5E20',t:'✅ ተረጋግጧል'}, cancelled:{bg:'#FFEBEE',c:'#B71C1C',t:'❌ ተሰርዟል'} };
    const m = map[s]||map.pending;
    return <View style={[styles.badge,{backgroundColor:m.bg}]}><Text style={[styles.badgeText,{color:m.c}]}>{m.t}</Text></View>;
  };
  const PBadge = ({ s }) => {
    const map = { unpaid:{bg:'#F3E5F5',c:'#6A1B9A',t:'💳 ያልተከፈለ'}, submitted:{bg:'#FFF8E1',c:'#F57F17',t:'📨 ቀርቧል'}, verified:{bg:'#E8F5E9',c:'#1B5E20',t:'✅ ተረጋግጧል'}, rejected:{bg:'#FFEBEE',c:'#B71C1C',t:'❌ ተቀባይነት አላገኘም'} };
    const m = map[s]||map.unpaid;
    return <View style={[styles.badge,{backgroundColor:m.bg}]}><Text style={[styles.badgeText,{color:m.c}]}>{m.t}</Text></View>;
  };

  if (loading) return (
    <View style={styles.loadWrap}>
      <ActivityIndicator size="large" color={COLORS.gold}/>
      <Text style={styles.loadText}>ዳታ እየጫናል...</Text>
    </View>
  );

  return (
    <ScrollView style={styles.container}
      refreshControl={<RefreshControl refreshing={refresh} onRefresh={() => load(true)} tintColor={COLORS.gold}/>}>

      {/* HEADER */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Admin Dashboard</Text>
          <Text style={styles.headerSub}>ጄሪ ኢቨንት ኦርጋናይዘርስ</Text>
        </View>
        <TouchableOpacity onPress={onLogout} style={styles.logoutBtn}>
          <Text style={styles.logoutText}>ውጣ</Text>
        </TouchableOpacity>
      </View>

      {/* STATS */}
      {stats && (
        <View style={styles.statsGrid}>
          {[
            ['ጠቅላላ', stats.total,     COLORS.burgundy],
            ['⏳ ይጠብቃል', stats.pending, '#E65100'],
            ['✅ ተረጋግጧል', stats.confirmed, COLORS.green],
            ['📨 ክፍያ ቀርቧል', stats.submitted||0, '#9C27B0'],
            ['✅ ክፍያ ተረጋግጧል', stats.verified||0, COLORS.green],
            ['💰 ጠቅላላ ዲፖዚት', 'ETB '+(stats.totalDeposits||0).toLocaleString(), COLORS.gold],
          ].map(([l,v,c],i)=>(
            <View key={i} style={[styles.statCard,{borderLeftColor:c}]}>
              <Text style={[styles.statNum,{color:c,fontSize:typeof v==='string'?13:24}]}>{v}</Text>
              <Text style={styles.statLabel}>{l}</Text>
            </View>
          ))}
        </View>
      )}

      {/* TABS */}
      <View style={styles.tabs}>
        {[['bookings','📋 ቦታ ማስያዝ'],['payments','💳 ክፍያዎች']].map(([k,l])=>(
          <TouchableOpacity key={k} style={[styles.tab, tab===k && styles.tabActive]} onPress={()=>setTab(k)}>
            <Text style={[styles.tabText, tab===k && styles.tabTextActive]}>{l}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* BOOKINGS LIST */}
      {tab==='bookings' && (
        <View style={styles.listWrap}>
          {!bookings.length
            ? <View style={styles.empty}><Text style={styles.emptyText}>📭 ቦታ ማስያዝ አልተመዘገበም</Text></View>
            : bookings.map((b,i) => (
              <View key={i} style={styles.card}>
                <View style={styles.cardHeader}>
                  <View>
                    <Text style={styles.cardName}>{b.firstName} {b.lastName||''}</Text>
                    <Text style={styles.cardPhone}>📞 {b.phone}</Text>
                  </View>
                  <SBadge s={b.status}/>
                </View>
                <View style={styles.cardBody}>
                  {[['🎉',b.eventType],['📅',b.eventDate],['📍',b.location||'—'],['👥',b.guests||'—']].map(([icon,val],j)=>(
                    <Text key={j} style={styles.cardInfo}>{icon} {val}</Text>
                  ))}
                  <PBadge s={b.paymentStatus}/>
                </View>
                <View style={styles.cardActions}>
                  {b.status!=='confirmed' && (
                    <TouchableOpacity style={styles.btnConfirm} onPress={()=>confirmBooking(b.id,'confirmed')}>
                      <Text style={styles.btnConfirmText}>✓ አረጋግጥ</Text>
                    </TouchableOpacity>
                  )}
                  {b.status!=='cancelled' && (
                    <TouchableOpacity style={styles.btnCancel} onPress={()=>confirmBooking(b.id,'cancelled')}>
                      <Text style={styles.btnCancelText}>✕ ሰርዝ</Text>
                    </TouchableOpacity>
                  )}
                  <TouchableOpacity style={styles.btnDelete} onPress={()=>deleteBooking(b.id)}>
                    <Text style={styles.btnDeleteText}>🗑</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))
          }
        </View>
      )}

      {/* PAYMENTS LIST */}
      {tab==='payments' && (
        <View style={styles.listWrap}>
          {!bookings.length
            ? <View style={styles.empty}><Text style={styles.emptyText}>💳 ምንም ክፍያ የለም</Text></View>
            : bookings.map((b,i) => {
                const pmt = payments.find(p=>p.bookingId===b.id);
                return (
                  <View key={i} style={styles.card}>
                    <View style={styles.cardHeader}>
                      <View>
                        <Text style={styles.cardName}>{b.firstName} {b.lastName||''}</Text>
                        <Text style={styles.cardPhone}>📞 {b.phone}</Text>
                      </View>
                      <PBadge s={b.paymentStatus}/>
                    </View>
                    <View style={styles.cardBody}>
                      <Text style={styles.cardInfo}>🎉 {b.eventType} | 📅 {b.eventDate}</Text>
                      {pmt && <Text style={[styles.cardInfo,{fontWeight:'800',color:COLORS.burgundy}]}>ጠቅላላ: {formatPrice(pmt.totalPrice)} | ዲፖዚት: {formatPrice(pmt.deposit)}</Text>}
                      {b.paymentBank && <Text style={styles.cardInfo}>🏦 {b.paymentBank} | Ref: {b.paymentTransRef||'—'}</Text>}
                    </View>
                    {b.paymentStatus==='submitted' && (
                      <View style={styles.cardActions}>
                        <TouchableOpacity style={styles.btnConfirm} onPress={()=>verifyPayment(b.id,true)}>
                          <Text style={styles.btnConfirmText}>✅ ክፍያ አረጋግጥ</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.btnCancel} onPress={()=>verifyPayment(b.id,false)}>
                          <Text style={styles.btnCancelText}>❌ ቀልዱ</Text>
                        </TouchableOpacity>
                      </View>
                    )}
                  </View>
                );
              })
          }
        </View>
      )}

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container:{ flex:1, backgroundColor:'#f0ece8' },
  loadWrap:{ flex:1, alignItems:'center', justifyContent:'center', gap:12 },
  loadText:{ color:COLORS.gray, fontSize:14 },
  header:{ backgroundColor:COLORS.burgundy, padding:20, paddingTop:48, flexDirection:'row', justifyContent:'space-between', alignItems:'center' },
  headerTitle:{ fontSize:20, fontWeight:'900', color:COLORS.goldLight },
  headerSub:{ color:'#d4a8b8', fontSize:12, marginTop:2 },
  logoutBtn:{ backgroundColor:'rgba(255,255,255,.1)', paddingHorizontal:14, paddingVertical:7, borderRadius:20, borderWidth:1, borderColor:'rgba(255,255,255,.2)' },
  logoutText:{ color:'#e0c8d0', fontSize:13, fontWeight:'700' },
  statsGrid:{ flexDirection:'row', flexWrap:'wrap', padding:12, gap:8 },
  statCard:{ backgroundColor:COLORS.white, borderRadius:10, padding:12, borderLeftWidth:4, width:'47%',
    shadowColor:'#000', shadowOpacity:.06, shadowRadius:5, elevation:2 },
  statNum:{ fontSize:24, fontWeight:'900', color:COLORS.burgundy },
  statLabel:{ fontSize:11, color:COLORS.gray, marginTop:3, fontWeight:'600' },
  tabs:{ flexDirection:'row', margin:12, backgroundColor:COLORS.white, borderRadius:12, overflow:'hidden',
    shadowColor:'#000', shadowOpacity:.05, shadowRadius:4, elevation:2 },
  tab:{ flex:1, padding:12, alignItems:'center' },
  tabActive:{ backgroundColor:COLORS.burgundy },
  tabText:{ fontSize:13, fontWeight:'700', color:COLORS.gray },
  tabTextActive:{ color:COLORS.goldLight },
  listWrap:{ paddingHorizontal:12, paddingBottom:20 },
  empty:{ padding:40, alignItems:'center' },
  emptyText:{ color:COLORS.gray, fontSize:14 },
  card:{ backgroundColor:COLORS.white, borderRadius:14, marginBottom:10, overflow:'hidden',
    shadowColor:'#000', shadowOpacity:.07, shadowRadius:8, elevation:3 },
  cardHeader:{ flexDirection:'row', justifyContent:'space-between', alignItems:'center', padding:14, borderBottomWidth:1, borderBottomColor:COLORS.border },
  cardName:{ fontSize:15, fontWeight:'800', color:COLORS.dark },
  cardPhone:{ fontSize:12, color:COLORS.gray, marginTop:2 },
  cardBody:{ padding:14, gap:5 },
  cardInfo:{ fontSize:13, color:COLORS.gray },
  cardActions:{ flexDirection:'row', gap:8, padding:12, borderTopWidth:1, borderTopColor:COLORS.border },
  btnConfirm:{ flex:1, backgroundColor:'#E8F5E9', padding:10, borderRadius:8, alignItems:'center' },
  btnConfirmText:{ color:COLORS.green, fontWeight:'800', fontSize:13 },
  btnCancel:{ flex:1, backgroundColor:'#FFEBEE', padding:10, borderRadius:8, alignItems:'center' },
  btnCancelText:{ color:COLORS.red, fontWeight:'800', fontSize:13 },
  btnDelete:{ backgroundColor:'#f5f5f5', padding:10, borderRadius:8, alignItems:'center', paddingHorizontal:14 },
  btnDeleteText:{ fontSize:15 },
  badge:{ paddingHorizontal:8, paddingVertical:3, borderRadius:15 },
  badgeText:{ fontSize:11, fontWeight:'700' },
});
