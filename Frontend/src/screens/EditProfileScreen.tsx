import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';

const EditProfileScreen = ({ navigation, route }: { navigation: any; route: any }) => {
  const [fullName, setFullName] = useState(route?.params?.fullName || 'Nguyễn Văn An');
  const [phone, setPhone] = useState(route?.params?.phone || '0901 234 567');
  const [email, setEmail] = useState(route?.params?.email || 'an.nguyen@example.com');
  const [area, setArea] = useState(route?.params?.area || 'Quận 7, TP. Hồ Chí Minh');
  const [publicProfile, setPublicProfile] = useState(true);

  const handleSave = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#1a1a1a" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Chỉnh sửa hồ sơ</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.avatarSection}>
          <View style={styles.avatarWrap}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{fullName.charAt(0)}</Text>
            </View>
            <TouchableOpacity style={styles.avatarEditButton}>
              <Ionicons name="camera-outline" size={16} color="#fff" />
            </TouchableOpacity>
          </View>
          <TouchableOpacity>
            <Text style={styles.changeAvatarText}>Thay đổi ảnh đại diện</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.label}>Họ và tên</Text>
        <View style={styles.inputWrap}>
          <Ionicons name="person-outline" size={18} color="#666" />
          <TextInput style={styles.input} value={fullName} onChangeText={setFullName} placeholder="Họ và tên" placeholderTextColor="#999" />
        </View>

        <Text style={styles.label}>Số điện thoại</Text>
        <View style={styles.inputWrap}>
          <Ionicons name="call-outline" size={18} color="#666" />
          <TextInput
            style={styles.input}
            value={phone}
            onChangeText={setPhone}
            placeholder="Số điện thoại"
            placeholderTextColor="#999"
            keyboardType="phone-pad"
          />
        </View>

        <Text style={styles.label}>Email</Text>
        <View style={styles.inputWrap}>
          <Ionicons name="mail-outline" size={18} color="#666" />
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="Email"
            placeholderTextColor="#999"
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <Text style={styles.label}>Khu vực thường chơi</Text>
        <TouchableOpacity style={styles.inputWrap}>
          <Ionicons name="location-outline" size={18} color="#666" />
          <Text style={styles.selectText}>{area}</Text>
          <Ionicons name="chevron-down" size={16} color="#999" />
        </TouchableOpacity>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Bảo mật & Quyền riêng tư</Text>
          <View style={styles.menuItem}>
            <Text style={styles.menuText}>Hiển thị hồ sơ công khai</Text>
            <TouchableOpacity
              style={[styles.toggle, publicProfile && styles.toggleOn]}
              onPress={() => setPublicProfile((v) => !v)}
            >
              <View style={[styles.toggleDot, publicProfile && styles.toggleDotOn]} />
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Ionicons name="save-outline" size={18} color="#fff" />
          <Text style={styles.saveButtonText}>Lưu thay đổi</Text>
        </TouchableOpacity>
      </ScrollView>
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
    borderBottomWidth: 1,
    borderBottomColor: '#f2f4f6',
  },
  headerTitle: { fontSize: 16, fontWeight: 'bold', color: '#1a1a1a' },
  content: { padding: 20, paddingBottom: 40 },
  avatarSection: { alignItems: 'center', marginBottom: 24 },
  avatarWrap: { position: 'relative', marginBottom: 10 },
  avatar: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: '#22c55e',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: { color: '#fff', fontSize: 30, fontWeight: 'bold' },
  avatarEditButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#1E40AF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  changeAvatarText: { color: '#1E40AF', fontSize: 13, fontWeight: '600' },
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
  selectText: { flex: 1, fontSize: 14, color: '#1a1a1a' },
  section: {
    backgroundColor: '#f2f4f6',
    borderRadius: 14,
    padding: 16,
    marginTop: 8,
    marginBottom: 24,
  },
  sectionTitle: { fontSize: 13, fontWeight: '700', color: '#666', marginBottom: 12 },
  menuItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  menuText: { fontSize: 14, color: '#1a1a1a', fontWeight: '500' },
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
  saveButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#22c55e',
    paddingVertical: 15,
    borderRadius: 12,
  },
  saveButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 15 },
});

export default EditProfileScreen;
