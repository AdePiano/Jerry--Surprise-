import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Text } from 'react-native';
import { COLORS } from './src/utils/api';

import HomeScreen      from './src/screens/HomeScreen';
import BookingScreen   from './src/screens/BookingScreen';
import PaymentScreen   from './src/screens/PaymentScreen';
import MyBookingScreen from './src/screens/MyBookingScreen';

const Tab   = createBottomTabNavigator();
const Stack = createStackNavigator();

// Booking Stack (Booking → Payment)
function BookingStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Booking"  component={BookingScreen}/>
      <Stack.Screen name="Payment"  component={PaymentScreen}/>
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="light"/>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarStyle:{ backgroundColor:COLORS.burgundy, borderTopColor:'rgba(201,147,42,.3)', height:60, paddingBottom:6 },
          tabBarActiveTintColor:   COLORS.goldLight,
          tabBarInactiveTintColor: '#b8909c',
          tabBarLabelStyle:{ fontSize:10, fontWeight:'700' },
          tabBarIcon: ({ color, size }) => {
            const icons = { Home:'🏠', BookStack:'📋', MyBooking:'🔍' };
            return <Text style={{ fontSize:20 }}>{icons[route.name]||'📱'}</Text>;
          },
        })}>
        <Tab.Screen name="Home"      component={HomeScreen}      options={{ title:'ዋናው ገጽ' }}/>
        <Tab.Screen name="BookStack" component={BookingStack}    options={{ title:'ቦታ ያዙ' }}/>
        <Tab.Screen name="MyBooking" component={MyBookingScreen} options={{ title:'ያስያዙት' }}/>
      </Tab.Navigator>
    </NavigationContainer>
  );
}
