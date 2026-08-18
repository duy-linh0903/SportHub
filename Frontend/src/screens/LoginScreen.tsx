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
import { LoginRequestDto } from '../types/api';

import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import { LoginManager, AccessToken } from 'react-native-fbsdk-next';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Login'>;
};

const loginSchema = yup.object().shape({
  email: yup.string().email('Email không hợp lệ').required('Email là bắt buộc'),
  password: yup.string().required('Mật khẩu là bắt buộc'),
});

// Ensure GoogleSignin is configured before calling signIn
GoogleSignin.configure({
  webClientId: '822337579211-994ko9cihjsb49v6elndd5tnt1h6oa74.apps.googleusercontent.com',
});

const LoginScreen = ({ navigation }: Props) => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { setToken } = useAuthStore();

  type LoginFormValues = yup.InferType<typeof loginSchema>;

  const { control, handleSubmit, formState: { errors } } = useForm<LoginFormValues>({
    resolver: yupResolver(loginSchema),
    defaultValues: { email: '', password: '' }
  });

  const onSubmit = async (data: LoginFormValues) => {
    setLoading(true);
    try {
      const response = await authApi.login(data);
      await setToken(response.accessToken);
      navigation.replace('RoleSelection');
    } catch (error: any) {
      console.error('Login error', error);
      Alert.alert('Đăng nhập thất bại', 'Vui lòng kiểm tra lại email hoặc mật khẩu.');
    } finally {
      setLoading(false);
    }
  };

  const onGoogleButtonPress = async () => {
    try {
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
      try {
        await GoogleSignin.signOut();
      } catch (e) {
        // ignore if already signed out
      }
      const response = await GoogleSignin.signIn();
      const idToken = response.data?.idToken || (response as any).idToken;
      
      if (!idToken) {
        throw new Error('Không lấy được Google ID Token');
      }

      setLoading(true);
      const apiResponse = await authApi.externalLogin({ provider: 'Google', idToken });
      await setToken(apiResponse.accessToken);
      navigation.replace('RoleSelection');
    } catch (error: any) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // user cancelled the login flow
      } else if (error.code === statusCodes.IN_PROGRESS) {
        // operation (e.g. sign in) is in progress already
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        Alert.alert('Lỗi', 'Google Play Services không khả dụng hoặc đã cũ.');
      } else {
        console.error('Google Sign-In Error:', error);
        Alert.alert('Lỗi', `Đăng nhập Google thất bại: ${error?.message || error?.code || 'Vui lòng thử lại.'}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const onFacebookButtonPress = async () => {
    try {
      try {
        LoginManager.logOut();
      } catch (e) {
        // ignore if already logged out
      }
      const result = await LoginManager.logInWithPermissions(['public_profile', 'email']);
      
      if (result.isCancelled) {
        return;
      }
      
      const data = await AccessToken.getCurrentAccessToken();
      if (!data) {
        throw new Error('Không thể lấy Facebook Access Token');
      }

      setLoading(true);
      const apiResponse = await authApi.externalLogin({ provider: 'Facebook', idToken: data.accessToken });
      await setToken(apiResponse.accessToken);
      navigation.replace('RoleSelection');
    } catch (error: any) {
      console.error('Facebook Sign-In Error:', error);
      Alert.alert('Lỗi', `Đăng nhập Facebook thất bại: ${error?.message || 'Vui lòng thử lại.'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <Text style={styles.brandName}>SportHub</Text>
          <Text style={styles.subtitle}>Chào mừng trở lại</Text>
          <Text style={styles.description}>Hãy đăng nhập để tiếp tục hành trình tập luyện của bạn.</Text>
        </View>

        <View style={styles.form}>
          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, onBlur, value } }) => (
              <View style={[styles.inputContainer, errors.email && styles.inputError]}>
                <Ionicons name="mail-outline" size={20} color="#666" style={styles.inputIcon} />
                <TextInput 
                  style={styles.input} 
                  placeholder="Email" 
                  placeholderTextColor="#999" 
                  keyboardType="email-address"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  autoCapitalize="none"
                />
              </View>
            )}
          />
          {errors.email && <Text style={styles.errorText}>{errors.email.message}</Text>}

          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, onBlur, value } }) => (
              <View style={[styles.inputContainer, errors.password && styles.inputError]}>
                <Ionicons name="lock-closed-outline" size={20} color="#666" style={styles.inputIcon} />
                <TextInput 
                  style={styles.input} 
                  placeholder="Mật khẩu" 
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

          <TouchableOpacity
            style={styles.forgotPassword}
            onPress={() => navigation.navigate('ForgotPassword')}
          >
            <Text style={styles.forgotPasswordText}>Quên mật khẩu?</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.primaryButton}
            onPress={handleSubmit(onSubmit)} 
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.primaryButtonText}>Đăng nhập →</Text>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.dividerContainer}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>HOẶC TIẾP TỤC VỚI</Text>
          <View style={styles.dividerLine} />
        </View>

        <View style={styles.socialContainer}>
          <TouchableOpacity style={styles.socialButton} onPress={onGoogleButtonPress} disabled={loading}>
            <Ionicons name="logo-google" size={18} color="#DB4437" />
            <Text style={styles.socialText}>Google</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.socialButton} onPress={onFacebookButtonPress} disabled={loading}>
            <Ionicons name="logo-facebook" size={18} color="#4267B2" />
            <Text style={styles.socialText}>Facebook</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Chưa có tài khoản? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Register')}>
            <Text style={styles.footerLink}>Đăng ký ngay</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f4f6f8' },
  scrollContent: { flexGrow: 1, padding: 24, justifyContent: 'center' },
  header: { marginBottom: 32 },
  brandName: { fontSize: 28, fontWeight: 'bold', color: '#006e2f', marginBottom: 8 },
  subtitle: { fontSize: 18, fontWeight: '600', color: '#1a1a1a', marginBottom: 4 },
  description: { fontSize: 14, color: '#666', lineHeight: 20 },
  form: { marginBottom: 24 },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 8,
    height: 50,
  },
  inputError: { borderColor: '#e74c3c' },
  errorText: { color: '#e74c3c', fontSize: 12, marginBottom: 16, marginLeft: 4 },
  inputIcon: { marginRight: 12 },
  eyeIcon: { marginLeft: 12, padding: 4 },
  input: { flex: 1, color: '#333', fontSize: 14, height: '100%' },
  forgotPassword: { alignSelf: 'flex-end', marginBottom: 24, marginTop: 8 },
  forgotPasswordText: { color: '#006e2f', fontSize: 14, fontWeight: '600' },
  primaryButton: {
    backgroundColor: '#006e2f',
    height: 50,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  primaryButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  dividerContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 24 },
  dividerLine: { flex: 1, height: 1, backgroundColor: '#e0e0e0' },
  dividerText: { marginHorizontal: 16, color: '#999', fontSize: 12, fontWeight: '600' },
  socialContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 32 },
  socialButton: {
    flex: 1,
    flexDirection: 'row',
    height: 48,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 4,
  },
  socialText: { color: '#333', fontSize: 14, fontWeight: '500', marginLeft: 8 },
  footer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  footerText: { color: '#666', fontSize: 14 },
  footerLink: { color: '#006e2f', fontSize: 14, fontWeight: 'bold' },
});

export default LoginScreen;