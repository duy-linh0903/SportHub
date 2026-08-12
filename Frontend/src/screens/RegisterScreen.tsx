import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { RootStackParamList } from '../../App';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { authApi } from '../api/authApi';
import { useAuthStore } from '../store/useAuthStore';
import { RegisterRequestDto } from '../types/api';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Register'>;
};

const registerSchema = yup.object().shape({
  name: yup.string().required('Họ tên là bắt buộc').max(100, 'Họ tên tối đa 100 ký tự'),
  phoneNumber: yup.string().required('Số điện thoại là bắt buộc').max(20, 'Số điện thoại tối đa 20 ký tự'),
  email: yup.string().email('Email không hợp lệ').required('Email là bắt buộc').max(256, 'Email tối đa 256 ký tự'),
  password: yup.string().required('Mật khẩu là bắt buộc'),
  verifyPassword: yup.string().required('Xác nhận mật khẩu là bắt buộc').oneOf([yup.ref('password')], 'Mật khẩu xác nhận không khớp'),
});

const RegisterScreen = ({ navigation }: Props) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showVerifyPassword, setShowVerifyPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const { setToken } = useAuthStore();

  const { control, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(registerSchema) as any,
    defaultValues: { name: '', phoneNumber: '', email: '', password: '', verifyPassword: '' }
  });

  const onSubmit = async (data: RegisterRequestDto) => {
    if (!agreedToTerms) {
      Alert.alert('Thông báo', 'Bạn cần đồng ý với Điều khoản sử dụng và Chính sách bảo mật.');
      return;
    }
    setLoading(true);
    try {
      const response = await authApi.register(data);
      await setToken(response.accessToken);
      Alert.alert('Thành công', 'Đăng ký tài khoản thành công!');
      navigation.replace('RoleSelection');
    } catch (error: any) {
      console.error('Register error', error);
      Alert.alert('Đăng ký thất bại', 'Vui lòng kiểm tra lại thông tin.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={20} color="#006e2f" style={{ marginRight: 4 }} />
          <Text style={styles.backButtonText}>Quay lại</Text>
        </TouchableOpacity>

        <View style={styles.header}>
          <Text style={styles.title}>Tạo tài khoản mới</Text>
          <Text style={styles.description}>Chào mừng bạn gia nhập hệ sinh thái thể thao SportHub.</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Họ tên</Text>
            <Controller
              control={control}
              name="name"
              render={({ field: { onChange, onBlur, value } }) => (
                <View style={[styles.inputContainer, errors.name && styles.inputError]}>
                  <Ionicons name="person-outline" size={20} color="#666" style={styles.inputIcon} />
                  <TextInput 
                    style={styles.input} 
                    placeholder="Nguyễn Văn A" 
                    placeholderTextColor="#999" 
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                  />
                </View>
              )}
            />
            {errors.name && <Text style={styles.errorText}>{errors.name.message}</Text>}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Số điện thoại</Text>
            <Controller
              control={control}
              name="phoneNumber"
              render={({ field: { onChange, onBlur, value } }) => (
                <View style={[styles.inputContainer, errors.phoneNumber && styles.inputError]}>
                  <Ionicons name="call-outline" size={20} color="#666" style={styles.inputIcon} />
                  <TextInput 
                    style={styles.input} 
                    placeholder="09xx xxx xxx" 
                    placeholderTextColor="#999" 
                    keyboardType="phone-pad"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                  />
                </View>
              )}
            />
            {errors.phoneNumber && <Text style={styles.errorText}>{errors.phoneNumber.message}</Text>}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email</Text>
            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, onBlur, value } }) => (
                <View style={[styles.inputContainer, errors.email && styles.inputError]}>
                  <Ionicons name="mail-outline" size={20} color="#666" style={styles.inputIcon} />
                  <TextInput 
                    style={styles.input} 
                    placeholder="example@gmail.com" 
                    placeholderTextColor="#999" 
                    keyboardType="email-address"
                    autoCapitalize="none"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                  />
                </View>
              )}
            />
            {errors.email && <Text style={styles.errorText}>{errors.email.message}</Text>}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Mật khẩu</Text>
            <Controller
              control={control}
              name="password"
              render={({ field: { onChange, onBlur, value } }) => (
                <View style={[styles.inputContainer, errors.password && styles.inputError]}>
                  <Ionicons name="lock-closed-outline" size={20} color="#666" style={styles.inputIcon} />
                  <TextInput 
                    style={styles.input} 
                    placeholder="••••••••" 
                    placeholderTextColor="#999" 
                    secureTextEntry={!showPassword}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                  />
                  <TouchableOpacity style={styles.eyeIcon} onPress={() => setShowPassword(!showPassword)}>
                    <Ionicons name={showPassword ? "eye-off-outline" : "eye-outline"} size={20} color="#999" />
                  </TouchableOpacity>
                </View>
              )}
            />
            {errors.password && <Text style={styles.errorText}>{errors.password.message}</Text>}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Xác nhận mật khẩu</Text>
            <Controller
              control={control}
              name="verifyPassword"
              render={({ field: { onChange, onBlur, value } }) => (
                <View style={[styles.inputContainer, errors.verifyPassword && styles.inputError]}>
                  <Ionicons name="shield-checkmark-outline" size={20} color="#666" style={styles.inputIcon} />
                  <TextInput 
                    style={styles.input} 
                    placeholder="••••••••" 
                    placeholderTextColor="#999" 
                    secureTextEntry={!showVerifyPassword}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                  />
                  <TouchableOpacity style={styles.eyeIcon} onPress={() => setShowVerifyPassword(!showVerifyPassword)}>
                    <Ionicons name={showVerifyPassword ? "eye-off-outline" : "eye-outline"} size={20} color="#999" />
                  </TouchableOpacity>
                </View>
              )}
            />
            {errors.verifyPassword && <Text style={styles.errorText}>{errors.verifyPassword.message}</Text>}
          </View>

          <View style={styles.checkboxContainer}>
            <TouchableOpacity 
              style={[styles.checkbox, agreedToTerms && styles.checkboxChecked]} 
              onPress={() => setAgreedToTerms(!agreedToTerms)}
            >
              {agreedToTerms && <Ionicons name="checkmark" size={16} color="#fff" />}
            </TouchableOpacity>
            <Text style={styles.checkboxText}>
              Tôi đồng ý với <Text style={styles.linkText}>Điều khoản sử dụng</Text> và <Text style={styles.linkText}>Chính sách bảo mật</Text> của SportHub.
            </Text>
          </View>

          <TouchableOpacity 
            style={[styles.primaryButton, !agreedToTerms && styles.disabledButton]} 
            onPress={handleSubmit(onSubmit)}
            disabled={loading || !agreedToTerms}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.primaryButtonText}>Đăng ký ngay →</Text>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Đã có tài khoản? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.footerLink}>Đăng nhập</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f4f6f8' },
  scrollContent: { flexGrow: 1, padding: 24 },
  backButton: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  backButtonText: { color: '#006e2f', fontSize: 16, fontWeight: '600' },
  header: { marginBottom: 24 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#1a1a1a', marginBottom: 8 },
  description: { fontSize: 14, color: '#666', lineHeight: 20 },
  form: { marginBottom: 24 },
  inputGroup: { marginBottom: 16 },
  label: { fontSize: 12, fontWeight: '600', color: '#333', marginBottom: 6 },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 48,
  },
  inputError: { borderColor: '#e74c3c' },
  errorText: { color: '#e74c3c', fontSize: 12, marginTop: 4, marginLeft: 4 },
  inputIcon: { marginRight: 10 },
  eyeIcon: { marginLeft: 10, padding: 4 },
  input: { flex: 1, color: '#333', fontSize: 14, height: '100%' },
  checkboxContainer: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 24, paddingRight: 10 },
  checkbox: { width: 20, height: 20, borderWidth: 1, borderColor: '#ccc', borderRadius: 4, marginRight: 10, marginTop: 2, justifyContent: 'center', alignItems: 'center' },
  checkboxChecked: { backgroundColor: '#006e2f', borderColor: '#006e2f' },
  checkboxText: { flex: 1, fontSize: 12, color: '#666', lineHeight: 18 },
  linkText: { color: '#006e2f', fontWeight: 'bold' },
  primaryButton: {
    backgroundColor: '#22c55e',
    height: 50,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  disabledButton: { backgroundColor: '#9ca3af' },
  primaryButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  footer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 10 },
  footerText: { color: '#666', fontSize: 14 },
  footerLink: { color: '#006e2f', fontSize: 14, fontWeight: 'bold' },
});

export default RegisterScreen;