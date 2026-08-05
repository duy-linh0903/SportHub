import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';

import AdminDashboardScreen from '../screens/AdminDashboardScreen';
import AdminManageFieldsScreen from '../screens/AdminManageFieldsScreen';
import AdminBookingListScreen from '../screens/AdminBookingListScreen';
import AdminQRScannerScreen from '../screens/AdminQRScannerScreen';
import AdminProfileScreen from '../screens/AdminProfileScreen';

const Tab = createBottomTabNavigator();

const AdminTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#1a1f24',
          borderTopColor: '#333',
          paddingBottom: 5,
          height: 60,
        },
        tabBarActiveTintColor: '#22c55e',
        tabBarInactiveTintColor: '#888',
        tabBarIcon: ({ focused, color, size }) => {
          let iconName = '';

          if (route.name === 'AdminDashboard') {
            iconName = focused ? 'grid' : 'grid-outline';
          } else if (route.name === 'AdminManageFields') {
            iconName = focused ? 'business' : 'business-outline';
          } else if (route.name === 'AdminQRScanner') {
            iconName = focused ? 'qr-code' : 'qr-code-outline';
          } else if (route.name === 'AdminBookingList') {
            iconName = focused ? 'checkmark-done-circle' : 'checkmark-done-circle-outline';
          } else if (route.name === 'AdminProfile') { // Thêm icon cho Profile
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size={24} color={color} />;
        },
      })}
    >
      <Tab.Screen name="AdminDashboard" component={AdminDashboardScreen} options={{ tabBarLabel: 'Tổng quan' }} />
      <Tab.Screen name="AdminManageFields" component={AdminManageFieldsScreen} options={{ tabBarLabel: 'Quản lý sân' }} />
      <Tab.Screen name="AdminQRScanner" component={AdminQRScannerScreen} options={{ tabBarLabel: 'Quét QR' }} />
      <Tab.Screen name="AdminBookingList" component={AdminBookingListScreen} options={{ tabBarLabel: 'Duyệt đơn' }} />
      {/* Đăng ký màn hình Profile vào Tab */}
      <Tab.Screen name="AdminProfile" component={AdminProfileScreen} options={{ tabBarLabel: 'Tài khoản' }} />
    </Tab.Navigator>
  );
};

export default AdminTabNavigator;