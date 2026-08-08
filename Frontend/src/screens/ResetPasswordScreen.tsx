import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';

const ResetPasswordScreen = ({ navigation }: { navigation: any }) => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const isLongEnough = password.length >= 8;
  const isMatching = password.length > 0 && password === confirmPassword;
  const canSubmit = isLongEnough && isMatching;

  const handleSubmit = () => {
    navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#1a1a1a" />
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          <View style={styles.iconCircle}>
            <Ionicons name="key-outline" size={36} color="#22c55e" />
          </View>

          <Text style={styles.title}>Đặt lại mật khẩu</Text>
          <Text style={styles.subtitle}>Tạo mật khẩu mới, tối thiểu 8 ký tự.</Text>

          <Text style={styles.label}>Mật khẩu mới</Text>
          <View style={styles.inputWrap}>
            <Ionicons name="lock-closed-outline" size={18} color="#666" />
            <TextInput
              style={styles.input}
              placeholder="••••••••"
              placeholderTextColor="#999"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity onPress={() => setShowPassword((s) => !s)}>
              <Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={18} color="#666" />
            </TouchableOpacity>
          </View>

          <Text style={styles.label}>Xác nhận mật khẩu</Text>
          <View style={styles.inputWrap}>
            <Ionicons name="lock-closed-outline" size={18} color="#666" />
            <TextInput
              style={styles.input}
              placeholder="••••••••"
              placeholderTextColor="#999"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={!showPassword}
            />
          </View>
          {confirmPassword.length > 0 && !isMatching && (
            <Text style={styles.errorText}>Mật khẩu xác nhận không khớp</Text>
          )}

          <TouchableOpacity
            style={[styles.submitButton, !canSubmit && styles.submitButtonDisabled]}
            disabled={!canSubmit}
            onPress={handleSubmit}
          >
            <Text style={styles.submitButtonText}>Đặt lại mật khẩu</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
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
    backgroundColor: '#e6f4ea',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: { fontSize: 22, fontWeight: 'bold', color: '#1a1a1a', marginBottom: 8 },
  subtitle: { fontSize: 14, color: '#666', textAlign: 'center', lineHeight: 20, marginBottom: 24 },
  label: { alignSelf: 'flex-start', fontSize: 13, fontWeight: '600', color: '#333', marginBottom: 8 },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    backgroundColor: '#f2f4f6',
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 50,
    gap: 10,
    marginBottom: 16,
  },
  input: { flex: 1, fontSize: 14, color: '#1a1a1a' },
  errorText: { alignSelf: 'flex-start', fontSize: 12, color: '#ba1a1a', marginTop: -8, marginBottom: 16 },
  submitButton: {
    width: '100%',
    backgroundColor: '#22c55e',
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  submitButtonDisabled: { backgroundColor: '#d1d5db' },
  submitButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 15 },
});

export default ResetPasswordScreen;
