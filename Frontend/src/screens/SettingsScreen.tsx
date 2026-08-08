import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';

const DUMMY_USER = {
  name: 'Nguyễn Văn An',
  rank: 'Người chơi hạng Vàng',
  appId: 'SportHub ID: 8829',
};

const SettingsScreen = ({ navigation }: { navigation: any }) => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const handleLogout = () => {
    navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#1a1a1a" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Cài đặt</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.userCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{DUMMY_USER.name.charAt(0)}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.userName}>{DUMMY_USER.name}</Text>
            <Text style={styles.userRank}>{DUMMY_USER.rank}</Text>
          </View>
          <Text style={styles.appId}>{DUMMY_USER.appId}</Text>
        </View>

        <Text style={styles.sectionLabel}>ỨNG DỤNG</Text>
        <View style={styles.section}>
          <View style={styles.menuItem}>
            <View style={styles.menuLeft}>
              <Ionicons name="notifications-outline" size={20} color="#333" />
              <Text style={styles.menuText}>Thông báo</Text>
            </View>
            <TouchableOpacity
              style={[styles.toggle, notificationsEnabled && styles.toggleOn]}
              onPress={() => setNotificationsEnabled((v) => !v)}
            >
              <View style={[styles.toggleDot, notificationsEnabled && styles.toggleDotOn]} />
            </TouchableOpacity>
          </View>
          <View style={styles.divider} />
          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuLeft}>
              <Ionicons name="language-outline" size={20} color="#333" />
              <Text style={styles.menuText}>Ngôn ngữ</Text>
            </View>
            <View style={styles.menuRight}>
              <Text style={styles.menuValue}>Tiếng Việt</Text>
              <Ionicons name="chevron-forward" size={18} color="#999" />
            </View>
          </TouchableOpacity>
          <View style={styles.divider} />
          <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('ChangePassword')}>
            <View style={styles.menuLeft}>
              <Ionicons name="key-outline" size={20} color="#333" />
              <Text style={styles.menuText}>Đổi mật khẩu</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#999" />
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionLabel}>THÔNG TIN</Text>
        <View style={styles.section}>
          <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('PrivacyPolicy')}>
            <View style={styles.menuLeft}>
              <Ionicons name="shield-checkmark-outline" size={20} color="#333" />
              <Text style={styles.menuText}>Chính sách bảo mật</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#999" />
          </TouchableOpacity>
          <View style={styles.divider} />
          <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('TermsOfService')}>
            <View style={styles.menuLeft}>
              <Ionicons name="document-text-outline" size={20} color="#333" />
              <Text style={styles.menuText}>Điều khoản sử dụng</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#999" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={20} color="#ba1a1a" />
          <Text style={styles.logoutText}>Đăng xuất</Text>
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
    marginBottom: 16,
  },
  logoutText: { color: '#ba1a1a', fontSize: 15, fontWeight: 'bold' },
  versionText: { textAlign: 'center', fontSize: 12, color: '#9ca3af' },
});

export default SettingsScreen;
