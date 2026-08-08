import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';

const OTP_LENGTH = 6;
const RESEND_SECONDS = 60;

const OTPVerificationScreen = ({ navigation, route }: { navigation: any; route: any }) => {
  const email = route?.params?.email || 'vidu@gmail.com';
  const context = route?.params?.context || 'forgot-password';
  const [otp, setOtp] = useState(Array(OTP_LENGTH).fill(''));
  const [countdown, setCountdown] = useState(RESEND_SECONDS);
  const inputRefs = useRef<Array<TextInput | null>>([]);

  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleChange = (text: string, index: number) => {
    const value = text.replace(/[^0-9]/g, '');
    const next = [...otp];
    next[index] = value.slice(-1);
    setOtp(next);
    if (value && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const isComplete = otp.every((d) => d !== '');

  const handleVerify = () => {
    if (context === 'forgot-password') {
      navigation.navigate('ResetPassword', { email });
    } else {
      navigation.goBack();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#1a1a1a" />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <View style={styles.iconCircle}>
          <Ionicons name="shield-checkmark-outline" size={36} color="#1E40AF" />
        </View>

        <Text style={styles.title}>Nhập mã OTP</Text>
        <Text style={styles.subtitle}>
          Mã xác nhận gồm {OTP_LENGTH} số đã được gửi đến{'\n'}
          <Text style={styles.emailText}>{email}</Text>
        </Text>

        <View style={styles.otpRow}>
          {otp.map((digit, index) => (
            <TextInput
              key={index}
              ref={(ref) => (inputRefs.current[index] = ref)}
              style={[styles.otpBox, digit !== '' && styles.otpBoxFilled]}
              value={digit}
              onChangeText={(text) => handleChange(text, index)}
              onKeyPress={(e) => handleKeyPress(e, index)}
              keyboardType="number-pad"
              maxLength={1}
              textAlign="center"
            />
          ))}
        </View>

        <TouchableOpacity disabled={countdown > 0} style={styles.resendRow}>
          <Text style={styles.resendText}>
            {countdown > 0
              ? `Gửi lại mã sau ${countdown}s`
              : 'Gửi lại mã'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.submitButton, !isComplete && styles.submitButtonDisabled]}
          disabled={!isComplete}
          onPress={handleVerify}
        >
          <Text style={styles.submitButtonText}>Xác nhận</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { paddingHorizontal: 20, paddingTop: 12 },
  content: { paddingHorizontal: 24, paddingTop: 24, alignItems: 'center' },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#eff6ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: { fontSize: 22, fontWeight: 'bold', color: '#1a1a1a', marginBottom: 8 },
  subtitle: { fontSize: 14, color: '#666', textAlign: 'center', lineHeight: 20, marginBottom: 28 },
  emailText: { fontWeight: '700', color: '#1a1a1a' },
  otpRow: { flexDirection: 'row', gap: 10, marginBottom: 20 },
  otpBox: {
    width: 44,
    height: 52,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#e2e8f0',
    backgroundColor: '#f2f4f6',
    fontSize: 20,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  otpBoxFilled: { borderColor: '#22c55e', backgroundColor: '#e6f4ea' },
  resendRow: { marginBottom: 28 },
  resendText: { fontSize: 13, fontWeight: '600', color: '#1E40AF' },
  submitButton: {
    width: '100%',
    backgroundColor: '#22c55e',
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
  },
  submitButtonDisabled: { backgroundColor: '#d1d5db' },
  submitButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 15 },
});

export default OTPVerificationScreen;
