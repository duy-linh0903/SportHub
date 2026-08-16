import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Switch, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useAuthStore } from '../store/useAuthStore';
import { usersApi } from '../api/usersApi';

const AdminProfileScreen = ({ navigation }: { navigation: any }) => {
  const { userId, logout } = useAuthStore();
  const [loading, setLoading] = useState(true);
  // State quản lý thông tin cá nhân
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  // State quản lý cài đặt hệ thống
  const [notify, setNotify] = useState(true);

  useEffect(() => {
    if (userId) {
      fetchProfile();
    }
  }, [userId]);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const data = await usersApi.getById(userId!);
      setName(data.name || '');
      setEmail(data.email || '');
      setPhone(data.phoneNumber || '');
    } catch (error) {
      console.error('Failed to fetch admin profile', error);
      Alert.alert('Lỗi', 'Không thể tải thông tin cá nhân.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
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

  const handleSwitchAccount = () => {
    navigation.replace('RoleSelection');
  };

  const handleSaveProfile = async () => {
    try {
      await usersApi.update(userId!, { name, email, phoneNumber: phone });
      Alert.alert('Thành công', 'Đã cập nhật thông tin.');
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update profile', error);
      Alert.alert('Lỗi', 'Không thể cập nhật thông tin cá nhân.');
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#1E40AF" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Hồ sơ Chủ sân</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* 1. Phần Thông tin Admin (Có thể chỉnh sửa) */}
        <View style={styles.profileSection}>
          <TouchableOpacity style={styles.avatarBtn}>
            <Text style={styles.avatarText}>{name ? name.charAt(0).toUpperCase() : 'A'}</Text>
          </TouchableOpacity>
          
          {isEditing ? (
            <View style={styles.editForm}>
              <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="Họ và tên" />
              <TextInput style={styles.input} value={email} onChangeText={setEmail} placeholder="Email" keyboardType="email-address" />
              <TextInput style={styles.input} value={phone} onChangeText={setPhone} placeholder="Số điện thoại" keyboardType="phone-pad" />
              
              <View style={styles.editActionRow}>
                <TouchableOpacity style={styles.cancelBtn} onPress={() => setIsEditing(false)}>
                  <Text style={styles.cancelBtnText}>Hủy</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.saveBtn} onPress={handleSaveProfile}>
                  <Text style={styles.saveBtnText}>Lưu thông tin</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <>
              <Text style={styles.adminName}>{name || 'Chủ sân'}</Text>
              <Text style={styles.adminEmail}>{email}{phone ? ` • ${phone}` : ''}</Text>
              
              <View style={styles.roleBadge}>
                <Ionicons name="shield-checkmark" size={14} color="#1E40AF" />
                <Text style={styles.roleText}>Tài khoản Quản lý</Text>
              </View>

              <TouchableOpacity style={styles.editToggleBtn} onPress={() => setIsEditing(true)}>
                <Ionicons name="pencil" size={16} color="#1E40AF" />
                <Text style={styles.editToggleText}>Chỉnh sửa hồ sơ</Text>
              </TouchableOpacity>
            </>
          )}
        </View>

        {/* 2. Cài đặt hệ thống (Gạt Switch trực tiếp) */}
        <View style={styles.menuSection}>
          <Text style={styles.sectionTitle}>Cài đặt hệ thống</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.menuLeft}>
              <View style={[styles.menuIcon, { backgroundColor: '#eff6ff' }]}>
                <Ionicons name="notifications-outline" size={20} color="#1E40AF" />
              </View>
              <Text style={styles.menuText}>Nhận thông báo đơn mới</Text>
            </View>
            <Switch 
              value={notify} 
              onValueChange={setNotify} 
              trackColor={{ false: '#d1d5db', true: '#22c55e' }}
              thumbColor="#ffffff"
            />
          </View>

        </View>

        {/* 3. Cụm Nút Đổi tài khoản & Đăng xuất */}
        <View style={styles.actionSection}>
          <TouchableOpacity style={styles.switchAccountBtn} onPress={handleSwitchAccount}>
            <Ionicons name="swap-horizontal-outline" size={20} color="#4b5563" />
            <Text style={styles.switchAccountText}>Đổi tài khoản</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={20} color="#ef4444" />
            <Text style={styles.logoutText}>Đăng xuất</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb' },
  header: { paddingHorizontal: 20, paddingVertical: 16, backgroundColor: '#ffffff', borderBottomWidth: 1, borderBottomColor: '#f3f4f6', alignItems: 'center' },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#111827' },
  scrollContent: { padding: 20, paddingBottom: 40 },
  
  // Profile Card
  profileSection: { backgroundColor: '#ffffff', borderRadius: 16, padding: 24, alignItems: 'center', marginBottom: 24, borderWidth: 1, borderColor: '#e5e7eb', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
  avatarBtn: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#1E40AF', justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
  avatarText: { fontSize: 32, fontWeight: 'bold', color: '#ffffff' },
  adminName: { fontSize: 20, fontWeight: 'bold', color: '#111827', marginBottom: 4 },
  adminEmail: { fontSize: 14, color: '#6b7280', marginBottom: 12 },
  roleBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#eff6ff', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, gap: 6, marginBottom: 16 },
  roleText: { fontSize: 13, fontWeight: '600', color: '#1E40AF' },
  
  // Nút bật Edit Mode
  editToggleBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f3f4f6', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8, gap: 8 },
  editToggleText: { color: '#1E40AF', fontWeight: '600', fontSize: 14 },
  
  // Form Edit
  editForm: { width: '100%', marginTop: 8 },
  input: { backgroundColor: '#f9fafb', borderWidth: 1, borderColor: '#d1d5db', borderRadius: 10, paddingHorizontal: 16, paddingVertical: 12, fontSize: 15, color: '#111827', marginBottom: 12 },
  editActionRow: { flexDirection: 'row', gap: 12, marginTop: 8 },
  cancelBtn: { flex: 1, paddingVertical: 14, borderRadius: 10, backgroundColor: '#f3f4f6', alignItems: 'center' },
  cancelBtnText: { color: '#4b5563', fontWeight: 'bold', fontSize: 15 },
  saveBtn: { flex: 2, paddingVertical: 14, borderRadius: 10, backgroundColor: '#1E40AF', alignItems: 'center' },
  saveBtnText: { color: '#ffffff', fontWeight: 'bold', fontSize: 15 },

  // Cài đặt hệ thống
  menuSection: { marginBottom: 32 },
  sectionTitle: { fontSize: 14, fontWeight: '700', color: '#9ca3af', textTransform: 'uppercase', marginBottom: 12, marginLeft: 4 },
  settingItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#ffffff', padding: 16, borderRadius: 16, marginBottom: 12, borderWidth: 1, borderColor: '#e5e7eb' },
  menuLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  menuIcon: { width: 40, height: 40, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  menuText: { fontSize: 15, fontWeight: '500', color: '#111827' },

  // Action Buttons
  actionSection: { gap: 12 },
  switchAccountBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#ffffff', paddingVertical: 16, borderRadius: 16, borderWidth: 1, borderColor: '#d1d5db', gap: 8 },
  switchAccountText: { fontSize: 15, fontWeight: '600', color: '#4b5563' },
  logoutBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#fef2f2', paddingVertical: 16, borderRadius: 16, borderWidth: 1, borderColor: '#fecaca', gap: 8 },
  logoutText: { fontSize: 15, fontWeight: 'bold', color: '#ef4444' },
});

export default AdminProfileScreen;