import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
  Modal,
  FlatList
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { usersApi } from '../api/usersApi';
import { useAuthStore } from '../store/useAuthStore';
import { useThemeStore } from '../store/useThemeStore';
import { UpdateProfileDto } from '../types/api';

const EditProfileScreen = ({ navigation, route }: { navigation: any; route: any }) => {
  const profile = route?.params?.profile;
  const { userId } = useAuthStore();
  
  const [fullName, setFullName] = useState(profile?.name || '');
  const [phone, setPhone] = useState(profile?.phoneNumber || '');
  const [email, setEmail] = useState(profile?.email || '');
  const [area, setArea] = useState('Quận 7, TP. Hồ Chí Minh');
  const [publicProfile, setPublicProfile] = useState(true);
  const [loading, setLoading] = useState(false);
  const [areaModalVisible, setAreaModalVisible] = useState(false);
  const { isDarkMode } = useThemeStore();

  const areas = [
    'Quận 1, TP. Hồ Chí Minh',
    'Quận 2, TP. Hồ Chí Minh',
    'Quận 3, TP. Hồ Chí Minh',
    'Quận 4, TP. Hồ Chí Minh',
    'Quận 5, TP. Hồ Chí Minh',
    'Quận 7, TP. Hồ Chí Minh',
    'Quận 10, TP. Hồ Chí Minh',
    'Tân Bình, TP. Hồ Chí Minh',
    'Phú Nhuận, TP. Hồ Chí Minh',
    'Bình Thạnh, TP. Hồ Chí Minh'
  ];

  const bgColor = isDarkMode ? '#121212' : '#fff';
  const headerColor = isDarkMode ? '#1e1e1e' : '#fff';
  const textColor = isDarkMode ? '#fff' : '#1a1a1a';
  const subTextColor = isDarkMode ? '#a1a1aa' : '#666';
  const inputBgColor = isDarkMode ? '#2c2c2e' : '#f2f4f6';
  const borderColor = isDarkMode ? '#2c2c2e' : '#f2f4f6';

  const handleSave = async () => {
    if (!userId) {
      Alert.alert('Lỗi', 'Vui lòng đăng nhập để lưu thay đổi.');
      return;
    }

    setLoading(true);
    try {
      const dto: UpdateProfileDto = {
        name: fullName,
        phoneNumber: phone,
        email: email,
        // Avatar URL omitted for now
      };

      await usersApi.update(userId, dto);
      Alert.alert('Thành công', 'Thông tin của bạn đã được cập nhật.', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } catch (error) {
      console.error('Update profile error', error);
      Alert.alert('Lỗi', 'Không thể cập nhật hồ sơ.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: bgColor }]}>
      <View style={[styles.header, { backgroundColor: headerColor, borderBottomColor: borderColor }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} disabled={loading}>
          <Ionicons name="arrow-back" size={24} color={textColor} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: textColor }]}>Chỉnh sửa hồ sơ</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.avatarSection}>
          <View style={styles.avatarWrap}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{fullName ? fullName.charAt(0).toUpperCase() : 'N'}</Text>
            </View>
            <TouchableOpacity style={styles.avatarEditButton}>
              <Ionicons name="camera-outline" size={16} color="#fff" />
            </TouchableOpacity>
          </View>
          <TouchableOpacity>
            <Text style={styles.changeAvatarText}>Thay đổi ảnh đại diện</Text>
          </TouchableOpacity>
        </View>

        <Text style={[styles.label, { color: textColor }]}>Họ và tên</Text>
        <View style={[styles.inputWrap, { backgroundColor: inputBgColor }]}>
          <Ionicons name="person-outline" size={18} color={subTextColor} />
          <TextInput style={[styles.input, { color: textColor }]} value={fullName} onChangeText={setFullName} placeholder="Họ và tên" placeholderTextColor="#999" />
        </View>

        <Text style={[styles.label, { color: textColor }]}>Số điện thoại</Text>
        <View style={[styles.inputWrap, { backgroundColor: inputBgColor }]}>
          <Ionicons name="call-outline" size={18} color={subTextColor} />
          <TextInput
            style={[styles.input, { color: textColor }]}
            value={phone}
            onChangeText={setPhone}
            placeholder="Số điện thoại"
            placeholderTextColor="#999"
            keyboardType="phone-pad"
          />
        </View>

        <Text style={[styles.label, { color: textColor }]}>Email</Text>
        <View style={[styles.inputWrap, { backgroundColor: inputBgColor }]}>
          <Ionicons name="mail-outline" size={18} color={subTextColor} />
          <TextInput
            style={[styles.input, { color: textColor }]}
            value={email}
            onChangeText={setEmail}
            placeholder="Email"
            placeholderTextColor="#999"
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <Text style={[styles.label, { color: textColor }]}>Khu vực thường chơi</Text>
        <TouchableOpacity 
          style={[styles.inputWrap, { backgroundColor: inputBgColor }]}
          onPress={() => setAreaModalVisible(true)}
        >
          <Ionicons name="location-outline" size={18} color={subTextColor} />
          <Text style={[styles.selectText, { color: textColor }]}>{area}</Text>
          <Ionicons name="chevron-down" size={16} color="#999" />
        </TouchableOpacity>

        <View style={[styles.section, { backgroundColor: inputBgColor }]}>
          <Text style={[styles.sectionTitle, { color: subTextColor }]}>Bảo mật & Quyền riêng tư</Text>
          <View style={styles.menuItem}>
            <Text style={[styles.menuText, { color: textColor }]}>Hiển thị hồ sơ công khai</Text>
            <TouchableOpacity
              style={[styles.toggle, publicProfile && styles.toggleOn]}
              onPress={() => setPublicProfile((v) => !v)}
            >
              <View style={[styles.toggleDot, publicProfile && styles.toggleDotOn]} />
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity 
          style={[styles.saveButton, loading && { opacity: 0.7 }]} 
          onPress={handleSave}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Ionicons name="save-outline" size={18} color="#fff" />
              <Text style={styles.saveButtonText}>Lưu thay đổi</Text>
            </>
          )}
        </TouchableOpacity>
      </ScrollView>

      <Modal
        visible={areaModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setAreaModalVisible(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay} 
          activeOpacity={1} 
          onPress={() => setAreaModalVisible(false)}
        >
          <View style={[styles.modalContent, { backgroundColor: bgColor }]}>
            <Text style={[styles.modalTitle, { color: textColor }]}>Chọn khu vực thường chơi</Text>
            <FlatList
              data={areas}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity 
                  style={[styles.modalItem, { borderBottomColor: borderColor }]}
                  onPress={() => {
                    setArea(item);
                    setAreaModalVisible(false);
                  }}
                >
                  <Text style={[styles.modalItemText, { color: item === area ? '#22c55e' : textColor }]}>{item}</Text>
                  {item === area && <Ionicons name="checkmark" size={20} color="#22c55e" />}
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>
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
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '70%',
  },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 15, textAlign: 'center' },
  modalItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 15,
    borderBottomWidth: 1,
  },
  modalItemText: { fontSize: 16 },
});

export default EditProfileScreen;
