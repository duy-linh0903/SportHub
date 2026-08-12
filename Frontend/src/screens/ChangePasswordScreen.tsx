import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { authApi } from '../api/authApi';
import { useThemeStore } from '../store/useThemeStore';

const ChangePasswordScreen = ({ navigation }: { navigation: any }) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { isDarkMode } = useThemeStore();

  const bgColor = isDarkMode ? '#121212' : '#fff';
  const headerColor = isDarkMode ? '#1e1e1e' : '#fff';
  const textColor = isDarkMode ? '#fff' : '#1a1a1a';
  const subTextColor = isDarkMode ? '#a1a1aa' : '#666';
  const inputBgColor = isDarkMode ? '#2c2c2e' : '#f2f4f6';

  const isMatching = newPassword.length > 0 && newPassword === confirmPassword;
  const canSubmit = currentPassword.length > 0 && newPassword.length >= 8 && isMatching;

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await authApi.changePassword({
        oldPassword: currentPassword,
        newPassword: newPassword,
        verifyPassword: confirmPassword,
      });
      Alert.alert('Thành công', 'Đổi mật khẩu thành công.', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } catch (error: any) {
      console.error('Change password error', error);
      const msg = error?.response?.data?.message || 'Có lỗi xảy ra, vui lòng thử lại.';
      Alert.alert('Lỗi', msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: bgColor }]}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={[styles.header, { backgroundColor: headerColor }]}>
          <TouchableOpacity onPress={() => navigation.goBack()} disabled={loading}>
            <Ionicons name="arrow-back" size={24} color={textColor} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: textColor }]}>Đổi mật khẩu</Text>
          <View style={{ width: 24 }} />
        </View>

        <View style={styles.content}>
          <Text style={[styles.label, { color: textColor }]}>Mật khẩu hiện tại</Text>
          <View style={[styles.inputWrap, { backgroundColor: inputBgColor }]}>
            <Ionicons name="lock-closed-outline" size={18} color={subTextColor} />
            <TextInput
              style={[styles.input, { color: textColor }]}
              placeholder="••••••••"
              placeholderTextColor="#999"
              value={currentPassword}
              onChangeText={setCurrentPassword}
              secureTextEntry
            />
          </View>

          <Text style={[styles.label, { color: textColor }]}>Mật khẩu mới</Text>
          <View style={[styles.inputWrap, { backgroundColor: inputBgColor }]}>
            <Ionicons name="key-outline" size={18} color={subTextColor} />
            <TextInput
              style={[styles.input, { color: textColor }]}
              placeholder="Tối thiểu 8 ký tự"
              placeholderTextColor="#999"
              value={newPassword}
              onChangeText={setNewPassword}
              secureTextEntry
            />
          </View>

          <Text style={[styles.label, { color: textColor }]}>Xác nhận mật khẩu mới</Text>
          <View style={[styles.inputWrap, { backgroundColor: inputBgColor }]}>
            <Ionicons name="key-outline" size={18} color={subTextColor} />
            <TextInput
              style={[styles.input, { color: textColor }]}
              placeholder="••••••••"
              placeholderTextColor="#999"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
            />
          </View>
          {confirmPassword.length > 0 && !isMatching && (
            <Text style={styles.errorText}>Mật khẩu xác nhận không khớp</Text>
          )}

          <TouchableOpacity
            style={[styles.submitButton, (!canSubmit || loading) && styles.submitButtonDisabled]}
            disabled={!canSubmit || loading}
            onPress={handleSubmit}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.submitButtonText}>Lưu thay đổi</Text>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  headerTitle: { fontSize: 16, fontWeight: 'bold', color: '#1a1a1a' },
  content: { paddingHorizontal: 24, paddingTop: 16 },
  label: { fontSize: 13, fontWeight: '600', color: '#333', marginBottom: 8 },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f2f4f6',
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 50,
    gap: 10,
    marginBottom: 16,
  },
  input: { flex: 1, fontSize: 14, color: '#1a1a1a' },
  errorText: { fontSize: 12, color: '#ba1a1a', marginTop: -8, marginBottom: 16 },
  submitButton: {
    backgroundColor: '#22c55e',
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  submitButtonDisabled: { backgroundColor: '#d1d5db' },
  submitButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 15 },
});

export default ChangePasswordScreen;
