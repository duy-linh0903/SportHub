import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuthStore } from '../store/useAuthStore';
import { usersApi } from '../api/usersApi';
import { UserResponseDto } from '../types/api';

const SettingsScreen = ({ navigation }: { navigation: any }) => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const { userId, logout } = useAuthStore();
  const [user, setUser] = useState<UserResponseDto | null>(null);
  const [loading, setLoading] = useState(false);

  // Static Colors
  const bgColor = '#f2f4f6';
  const cardColor = '#fff';
  const textColor = '#1a1a1a';
  const subTextColor = '#666';
  const borderColor = '#e2e8f0';

  useEffect(() => {
    if (userId) {
      fetchProfile();
    }
    loadSettings();
  }, [userId]);

  const loadSettings = async () => {
    try {
      const notiState = await AsyncStorage.getItem('notificationsEnabled');
      if (notiState !== null) {
        setNotificationsEnabled(notiState === 'true');
      }
    } catch (e) {
      console.error('Failed to load settings');
    }
  };

  const toggleNotifications = async () => {
    const newState = !notificationsEnabled;
    setNotificationsEnabled(newState);
    try {
      await AsyncStorage.setItem('notificationsEnabled', newState.toString());
    } catch (e) {
      console.error('Failed to save settings');
    }
  };

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const data = await usersApi.getById(userId!);
      setUser(data);
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Xác nhận xóa tài khoản',
      'Bạn có chắc chắn muốn xóa tài khoản này? Hành động này sẽ xóa dữ liệu tài khoản của bạn và không thể hoàn tác.',
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Xóa vĩnh viễn',
          style: 'destructive',
          onPress: async () => {
            try {
              if (userId) {
                await usersApi.delete(userId);
              }
              await logout();
              Alert.alert('Thành công', 'Tài khoản của bạn đã được xóa.');
              navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
            } catch (error) {
              console.error('Delete account error:', error);
              Alert.alert('Lỗi', 'Không thể xóa tài khoản. Vui lòng thử lại sau.');
            }
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: bgColor }]}>
      <View style={[styles.header, { backgroundColor: cardColor, borderBottomColor: borderColor }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={textColor} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: textColor }]}>Cài đặt</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={[styles.userCard, { backgroundColor: cardColor, borderColor }]}>
          {loading ? (
             <ActivityIndicator size="small" color="#006e2f" style={{ marginHorizontal: 'auto' }} />
          ) : user ? (
            <>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{user.name ? user.name.charAt(0).toUpperCase() : 'U'}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.userName, { color: textColor }]}>{user.name}</Text>
                <Text style={styles.userRank}>Người chơi hạng Đồng</Text>
              </View>
              <TouchableOpacity onPress={() => navigation.navigate('EditProfile', { profile: user })}>
                <Ionicons name="pencil-outline" size={20} color={textColor} />
              </TouchableOpacity>
            </>
          ) : (
            <Text style={{ textAlign: 'center', width: '100%' }}>Không thể tải thông tin</Text>
          )}
        </View>

        <Text style={styles.sectionLabel}>ỨNG DỤNG</Text>
        <View style={[styles.section, { backgroundColor: cardColor, borderColor }]}>
          <View style={styles.menuItem}>
            <View style={styles.menuLeft}>
              <Ionicons name="notifications-outline" size={20} color={textColor} />
              <Text style={[styles.menuText, { color: textColor }]}>Thông báo</Text>
            </View>
            <TouchableOpacity
              style={[styles.toggle, notificationsEnabled && styles.toggleOn]}
              onPress={toggleNotifications}
            >
              <View style={[styles.toggleDot, notificationsEnabled && styles.toggleDotOn]} />
            </TouchableOpacity>
          </View>
          <View style={[styles.divider, { backgroundColor: bgColor }]} />
          <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('ChangePassword')}>
            <View style={styles.menuLeft}>
              <Ionicons name="key-outline" size={20} color={textColor} />
              <Text style={[styles.menuText, { color: textColor }]}>Đổi mật khẩu</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#999" />
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionLabel}>THÔNG TIN</Text>
        <View style={[styles.section, { backgroundColor: cardColor, borderColor }]}>
          <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('PrivacyPolicy')}>
            <View style={styles.menuLeft}>
              <Ionicons name="shield-checkmark-outline" size={20} color={textColor} />
              <Text style={[styles.menuText, { color: textColor }]}>Chính sách bảo mật</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#999" />
          </TouchableOpacity>
          <View style={[styles.divider, { backgroundColor: bgColor }]} />
          <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('TermsOfService')}>
            <View style={styles.menuLeft}>
              <Ionicons name="document-text-outline" size={20} color={textColor} />
              <Text style={[styles.menuText, { color: textColor }]}>Điều khoản sử dụng</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#999" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={[styles.logoutBtn, { backgroundColor: cardColor, borderColor: '#ffdada' }]} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={20} color="#ba1a1a" />
          <Text style={styles.logoutText}>Đăng xuất</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.deleteBtn, { backgroundColor: cardColor, borderColor: '#fee2e2' }]} onPress={handleDeleteAccount}>
          <Ionicons name="trash-outline" size={20} color="#dc2626" />
          <Text style={styles.deleteText}>Xóa tài khoản</Text>
        </TouchableOpacity>

        <Text style={styles.versionText}>Phiên bản 2.4.0 (Build 1032)</Text>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f2f4f6' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  headerTitle: { fontSize: 16, fontWeight: 'bold', color: '#1a1a1a' },
  content: { padding: 16, paddingBottom: 32 },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    gap: 12,
    minHeight: 80,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#22c55e',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
  userName: { fontSize: 15, fontWeight: 'bold', color: '#1a1a1a' },
  userRank: { fontSize: 12, color: '#F97316', fontWeight: '600', marginTop: 2 },
  appId: { fontSize: 11, color: '#9ca3af' },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#9ca3af',
    marginBottom: 8,
    marginLeft: 4,
    letterSpacing: 0.5,
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingHorizontal: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
  },
  menuLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  menuText: { fontSize: 14, color: '#333', fontWeight: '500' },
  menuRight: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  menuValue: { fontSize: 13, color: '#666' },
  divider: { height: 1, backgroundColor: '#f2f4f6' },
  toggle: {
    width: 44,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#d1d5db',
    padding: 3,
    justifyContent: 'center',
  },
  toggleOn: { backgroundColor: '#22c55e' },
  toggleDot: { width: 20, height: 20, borderRadius: 10, backgroundColor: '#fff' },
  toggleDotOn: { alignSelf: 'flex-end' },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#ffdada',
    gap: 8,
    marginBottom: 12,
  },
  logoutText: { color: '#ba1a1a', fontSize: 15, fontWeight: 'bold' },
  deleteBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#fecaca',
    gap: 8,
    marginBottom: 16,
  },
  deleteText: { color: '#dc2626', fontSize: 15, fontWeight: 'bold' },
  versionText: { textAlign: 'center', fontSize: 12, color: '#9ca3af' },
});

export default SettingsScreen;
