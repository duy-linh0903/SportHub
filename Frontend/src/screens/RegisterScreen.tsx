import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet,ScrollView } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { RootStackParamList } from '../../App';
import { SafeAreaView } from 'react-native-safe-area-context';
type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Register'>;
};

const RegisterScreen = ({ navigation }: Props) => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
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
            <View style={styles.inputContainer}>
              <Ionicons name="person-outline" size={20} color="#666" style={styles.inputIcon} />
              <TextInput style={styles.input} placeholder="Nguyễn Văn A" placeholderTextColor="#999" />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Số điện thoại</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="call-outline" size={20} color="#666" style={styles.inputIcon} />
              <TextInput style={styles.input} placeholder="09xx xxx xxx" placeholderTextColor="#999" keyboardType="phone-pad" />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="mail-outline" size={20} color="#666" style={styles.inputIcon} />
              <TextInput style={styles.input} placeholder="example@gmail.com" placeholderTextColor="#999" keyboardType="email-address" />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Mật khẩu</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="lock-closed-outline" size={20} color="#666" style={styles.inputIcon} />
              <TextInput style={styles.input} placeholder="••••••••" placeholderTextColor="#999" secureTextEntry />
              <TouchableOpacity style={styles.eyeIcon}>
                <Ionicons name="eye-outline" size={20} color="#999" />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Xác nhận mật khẩu</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="shield-checkmark-outline" size={20} color="#666" style={styles.inputIcon} />
              <TextInput style={styles.input} placeholder="••••••••" placeholderTextColor="#999" secureTextEntry />
              <TouchableOpacity style={styles.eyeIcon}>
                <Ionicons name="eye-outline" size={20} color="#999" />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.checkboxContainer}>
            <View style={styles.checkbox} />
            <Text style={styles.checkboxText}>
              Tôi đồng ý với <Text style={styles.linkText}>Điều khoản sử dụng</Text> và <Text style={styles.linkText}>Chính sách bảo mật</Text> của SportHub.
            </Text>
          </View>

          <TouchableOpacity style={styles.primaryButton}>
            <Text style={styles.primaryButtonText}>Đăng ký ngay →</Text>
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
  inputIcon: { marginRight: 10 },
  eyeIcon: { marginLeft: 10, padding: 4 },
  input: { flex: 1, color: '#333', fontSize: 14, height: '100%' },
  checkboxContainer: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 24, paddingRight: 10 },
  checkbox: { width: 20, height: 20, borderWidth: 1, borderColor: '#ccc', borderRadius: 4, marginRight: 10, marginTop: 2 },
  checkboxText: { flex: 1, fontSize: 12, color: '#666', lineHeight: 18 },
  linkText: { color: '#006e2f', fontWeight: 'bold' },
  primaryButton: {
    backgroundColor: '#22c55e',
    height: 50,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  primaryButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  footer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 10 },
  footerText: { color: '#666', fontSize: 14 },
  footerLink: { color: '#006e2f', fontSize: 14, fontWeight: 'bold' },
});

export default RegisterScreen;