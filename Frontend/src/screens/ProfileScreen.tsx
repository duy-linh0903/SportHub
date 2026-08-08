import React from 'react';
import { View, Text, StyleSheet,TouchableOpacity, ScrollView } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { SafeAreaView } from 'react-native-safe-area-context';

const ProfileScreen = ({ navigation }: { navigation: any }) => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.userHeader}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>NA</Text>
          </View>
          <Text style={styles.userName}>Nguyễn Văn A</Text>
          <Text style={styles.userEmail}>nguyenvana@gmail.com</Text>
        </View>

        <View style={styles.menuSection}>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => navigation.navigate('EditProfile')}
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
          onPress={() => navigation.replace('Login')}
        >
          <Ionicons name="swap-horizontal-outline" size={20} color="#1E40AF" />
          <Text style={styles.switchAccountText}>Đổi tài khoản</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.logoutBtn}
          onPress={() => navigation.replace('Login')}
        >
          <Ionicons name="log-out-outline" size={20} color="#ba1a1a" />
          <Text style={styles.logoutText}>Đăng xuất</Text>
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
  logoutBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff', padding: 16, borderRadius: 16, borderWidth: 1, borderColor: '#ffdada', gap: 8 },
  logoutText: { color: '#ba1a1a', fontSize: 16, fontWeight: 'bold' },
  switchAccountBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff', padding: 16, borderRadius: 16, borderWidth: 1, borderColor: '#dbeafe', gap: 8, marginBottom: 12 },
  switchAccountText: { color: '#1E40AF', fontSize: 16, fontWeight: 'bold' }
});

export default ProfileScreen;