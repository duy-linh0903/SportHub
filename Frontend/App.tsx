import React from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useEffect } from 'react';
import { useAuthStore } from './src/store/useAuthStore';
import NotificationService from './src/services/NotificationService';

import SplashScreen from './src/screens/SplashScreen';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import RoleSelectionScreen from './src/screens/RoleSelectionScreen';
import MainTabNavigator from './src/navigation/MainTabNavigator';
import AdminTabNavigator from './src/navigation/AdminTabNavigator';
import AdminEditFieldScreen from './src/screens/AdminEditFieldScreen';
import DetailScreen from './src/screens/DetailScreen';
import SelectTimeScreen from './src/screens/SelectTimeScreen';
import VenueListScreen from './src/screens/VenueListScreen';
import AddonServiceScreen from './src/screens/AddonServiceScreen';
import CheckoutScreen from './src/screens/CheckoutScreen';
import PaymentMethodScreen from './src/screens/PaymentMethodScreen';
import BookingSuccessScreen from './src/screens/BookingSuccessScreen';
import TicketDetailScreen from './src/screens/TicketDetailScreen';
import WriteReviewScreen from './src/screens/WriteReviewScreen';
import ReviewListScreen from './src/screens/ReviewListScreen';
import ForgotPasswordScreen from './src/screens/ForgotPasswordScreen';
import OTPVerificationScreen from './src/screens/OTPVerificationScreen';
import ResetPasswordScreen from './src/screens/ResetPasswordScreen';
import ChangePasswordScreen from './src/screens/ChangePasswordScreen';
import NotificationScreen from './src/screens/NotificationScreen';
import EditProfileScreen from './src/screens/EditProfileScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import PrivacyPolicyScreen from './src/screens/PrivacyPolicyScreen';
import TermsOfServiceScreen from './src/screens/TermsOfServiceScreen';
import AboutScreen from './src/screens/AboutScreen';
import MapScreen from './src/screens/MapScreen';
import PaymentScreen from './src/screens/PaymentScreen';
import AdminFieldListScreen from './src/screens/AdminFieldListScreen';
import AdminEditSubFieldScreen from './src/screens/AdminEditSubFieldScreen';
import AdminReviewListScreen from './src/screens/AdminReviewListScreen';
import AdminTimeSlotScreen from './src/screens/AdminTimeSlotScreen';
import AdminServiceScreen from './src/screens/AdminServiceScreen';

export type RootStackParamList = {
  Splash: undefined;
  Login: undefined;
  Register: undefined;
  RoleSelection: undefined;
  MainTab: undefined;
  AdminTab: undefined;
  AdminEditField: { field?: any } | undefined;
  Detail: { sportCenterId: string } | undefined;
  SelectTime: { sportCenterId: string; sportCenterAddress?: string; sportCenterName?: string } | undefined;
  VenueList: undefined;
  Addon: { bookingData: any } | undefined;
  Checkout: { bookingData?: any; selectedServices?: any[] } | undefined;
  PaymentMethod: { currentMethod?: string } | undefined;
  BookingSuccess: { field?: any; totalPrice?: number; paymentMethod?: string } | undefined;
  TicketDetail: { bookingCode?: string; field?: any; totalPrice?: number } | undefined;
  WriteReview: { field?: any } | undefined;
  ReviewList: { fieldName?: string; sportCenterId?: string } | undefined;
  ForgotPassword: undefined;
  OTPVerification: { email?: string; context?: 'forgot-password' } | undefined;
  ResetPassword: { email?: string } | undefined;
  ChangePassword: undefined;
  Notification: undefined;
  EditProfile: { profile?: any } | undefined;
  Settings: undefined;
  PrivacyPolicy: undefined;
  TermsOfService: undefined;
  About: undefined;
  Map: undefined;
  Payment: { paymentUrl: string; bookingData: any; totalPrice: number; selectedPayment: string } | undefined;
  AdminFieldList: { sportCenter: any } | undefined;
  AdminEditSubField: { sportCenterId: string; subField?: any } | undefined;
  AdminReviewList: undefined;
  AdminTimeSlot: { sportCenterId: string; sportCenterName: string } | undefined;
  AdminService: { sportCenterId: string; sportCenterName: string } | undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  const { isAuthenticated } = useAuthStore();
  
  useEffect(() => {
    if (isAuthenticated) {
      NotificationService.startConnection();
    } else {
      NotificationService.stopConnection();
    }
  }, [isAuthenticated]);

  return (
    <NavigationContainer theme={DefaultTheme}>
      <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Splash">
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="RoleSelection" component={RoleSelectionScreen} />
        <Stack.Screen name="MainTab" component={MainTabNavigator} />
        <Stack.Screen name="AdminTab" component={AdminTabNavigator} />
        <Stack.Screen name="AdminEditField" component={AdminEditFieldScreen} />
        <Stack.Screen name="Detail" component={DetailScreen} />
        <Stack.Screen name="SelectTime" component={SelectTimeScreen} />
        <Stack.Screen name="VenueList" component={VenueListScreen} />
        <Stack.Screen name="Addon" component={AddonServiceScreen} />
        <Stack.Screen name="Checkout" component={CheckoutScreen} />
        <Stack.Screen name="PaymentMethod" component={PaymentMethodScreen} />
        <Stack.Screen name="BookingSuccess" component={BookingSuccessScreen} />
        <Stack.Screen name="TicketDetail" component={TicketDetailScreen} />
        <Stack.Screen name="WriteReview" component={WriteReviewScreen} />
        <Stack.Screen name="ReviewList" component={ReviewListScreen} />
        <Stack.Screen name="AdminFieldList" component={AdminFieldListScreen} />
        <Stack.Screen name="AdminEditSubField" component={AdminEditSubFieldScreen} />
        <Stack.Screen name="AdminReviewList" component={AdminReviewListScreen} />
        <Stack.Screen name="AdminTimeSlot" component={AdminTimeSlotScreen} />
        <Stack.Screen name="AdminService" component={AdminServiceScreen} />
        <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
        <Stack.Screen name="OTPVerification" component={OTPVerificationScreen} />
        <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
        <Stack.Screen name="ChangePassword" component={ChangePasswordScreen} />
        <Stack.Screen name="Notification" component={NotificationScreen} />
        <Stack.Screen name="EditProfile" component={EditProfileScreen} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
        <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicyScreen} />
        <Stack.Screen name="TermsOfService" component={TermsOfServiceScreen} />
        <Stack.Screen name="About" component={AboutScreen} />
        <Stack.Screen name="Map" component={MapScreen} />
        <Stack.Screen name="Payment" component={PaymentScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
