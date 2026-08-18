import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator, Alert } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '../store/useAuthStore';
import { usersApi } from '../api/usersApi';
import { UserResponseDto } from '../types/api';

const ProfileScreen = ({ navigation }: { navigation: any }) => {
  const { userId, isAuthenticated, logout } = useAuthStore();
  const [profile, setProfile] = useState<UserResponseDto | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isAuthenticated && userId) {
      fetchProfile();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated, userId]);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const data = await usersApi.getById(userId!);
      setProfile(data);
    } catch (error) {
      console.error('Failed to fetch profile', error);
      Alert.alert('Lỗi', 'Không thể tải thông tin cá nhân.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    Alert.alert('Xác nhận', 'Bạn có chắc chắn muốn đăng xuất?', [
      { text: 'Hủy', style: 'cancel' },
      { 
        text: 'Đăng xuất', 
        style: 'destructive',
        onPress: async () => {
          await logout();
          navigation.replace('Login');
        }
      }
    ]);
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
              navigation.replace('Login');
            } catch (error) {
              console.error('Delete account error:', error);
              Alert.alert('Lỗi', 'Không thể xóa tài khoản. Vui lòng thử lại sau.');
            }
          },
        },
      ]
    );
  };

  if (!isAuthenticated) {
    return (
      <SafeAreaView style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Ionicons name="person-circle-outline" size={64} color="#d1d5db" />
        <Text style={{ marginTop: 16, fontSize: 16, color: '#666' }}>Vui lòng đăng nhập để xem hồ sơ</Text>
        <TouchableOpacity style={styles.loginBtn} onPress={() => navigation.navigate('Login')}>
          <Text style={styles.loginBtnText}>Đăng nhập</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#22c55e" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.userHeader}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {profile?.name ? profile.name.charAt(0).toUpperCase() : 'NA'}
            </Text>
          </View>
          <Text style={styles.userName}>{profile?.name || 'Người dùng'}</Text>
          <Text style={styles.userEmail}>{profile?.email || 'Chưa cập nhật'}</Text>
        </View>

        <View style={styles.menuSection}>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => navigation.navigate('FavoriteCenters')}
          >
            <Ionicons name="heart-outline" size={20} color="#333" />
            <Text style={styles.menuText}>Sân yêu thích</Text>
            <Ionicons name="chevron-forward" size={18} color="#999" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => navigation.navigate('EditProfile', { profile })}
          >
            <Ionicons name="person-outline" size={20} color="#333" />
            <Text style={styles.menuText}>Chỉnh sửa thông tin</Text>
            <Ionicons name="chevron-forward" size={18} color="#999" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => navigation.navigate('Settings')}
          >
            <Ionicons name="settings-outline" size={20} color="#333" />
            <Text style={styles.menuText}>Cài đặt ứng dụng</Text>
            <Ionicons name="chevron-forward" size={18} color="#999" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => navigation.navigate('About')}
          >
            <Ionicons name="information-circle-outline" size={20} color="#333" />
            <Text style={styles.menuText}>Giới thiệu về SportHub</Text>
            <Ionicons name="chevron-forward" size={18} color="#999" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.switchAccountBtn}
          onPress={handleLogout}
        >
          <Ionicons name="swap-horizontal-outline" size={20} color="#1E40AF" />
          <Text style={styles.switchAccountText}>Đổi tài khoản</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.logoutBtn}
          onPress={handleLogout}
        >
          <Ionicons name="log-out-outline" size={20} color="#ba1a1a" />
          <Text style={styles.logoutText}>Đăng xuất</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.deleteBtn}
          onPress={handleDeleteAccount}
        >
          <Ionicons name="trash-outline" size={20} color="#dc2626" />
          <Text style={styles.deleteText}>Xóa tài khoản</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f2f4f6' },
  scroll: { padding: 20 },
  userHeader: { alignItems: 'center', backgroundColor: '#fff', padding: 24, borderRadius: 16, marginBottom: 20, borderWidth: 1, borderColor: '#e2e8f0' },
  avatar: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#22c55e', justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  avatarText: { color: '#fff', fontSize: 24, fontWeight: 'bold' },
  userName: { fontSize: 18, fontWeight: 'bold', color: '#1a1a1a', marginBottom: 4 },
  userEmail: { fontSize: 14, color: '#666' },
  menuSection: { backgroundColor: '#fff', borderRadius: 16, paddingHorizontal: 16, marginBottom: 24, borderWidth: 1, borderColor: '#e2e8f0' },
  menuItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: '#f2f4f6', gap: 12 },
  menuText: { flex: 1, fontSize: 15, color: '#333', fontWeight: '500' },
  logoutBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff', padding: 16, borderRadius: 16, borderWidth: 1, borderColor: '#ffdada', gap: 8, marginBottom: 12 },
  logoutText: { color: '#ba1a1a', fontSize: 16, fontWeight: 'bold' },
  deleteBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff', padding: 16, borderRadius: 16, borderWidth: 1, borderColor: '#fecaca', gap: 8 },
  deleteText: { color: '#dc2626', fontSize: 16, fontWeight: 'bold' },
  switchAccountBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff', padding: 16, borderRadius: 16, borderWidth: 1, borderColor: '#dbeafe', gap: 8, marginBottom: 12 },
  switchAccountText: { color: '#1E40AF', fontSize: 16, fontWeight: 'bold' },
  loginBtn: { marginTop: 24, backgroundColor: '#22c55e', paddingHorizontal: 32, paddingVertical: 12, borderRadius: 12 },
  loginBtnText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});

export default ProfileScreen;