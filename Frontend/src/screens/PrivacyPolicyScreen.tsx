import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';

const SECTIONS = [
  {
    title: '1. Thông tin chúng tôi thu thập',
    body: 'SportHub thu thập thông tin cá nhân bạn cung cấp khi đăng ký tài khoản (họ tên, email, số điện thoại), thông tin đặt sân, lịch sử giao dịch và dữ liệu vị trí khi bạn cho phép để gợi ý sân gần bạn.',
  },
  {
    title: '2. Mục đích sử dụng thông tin',
    body: 'Thông tin được sử dụng để xử lý đơn đặt sân, xác thực tài khoản, gửi thông báo liên quan đến lịch đặt, cải thiện chất lượng dịch vụ và hỗ trợ khách hàng khi cần thiết.',
  },
  {
    title: '3. Chia sẻ thông tin',
    body: 'SportHub không bán thông tin cá nhân của bạn cho bên thứ ba. Thông tin đặt sân có thể được chia sẻ với chủ sân để xác nhận và phục vụ lịch đặt của bạn.',
  },
  {
    title: '4. Bảo mật dữ liệu',
    body: 'Chúng tôi áp dụng các biện pháp kỹ thuật và tổ chức phù hợp để bảo vệ thông tin cá nhân khỏi truy cập, thay đổi hoặc tiết lộ trái phép.',
  },
  {
    title: '5. Quyền của người dùng',
    body: 'Bạn có quyền truy cập, chỉnh sửa hoặc yêu cầu xóa thông tin cá nhân của mình thông qua mục Chỉnh sửa hồ sơ hoặc liên hệ bộ phận hỗ trợ.',
  },
];

const PrivacyPolicyScreen = ({ navigation }: { navigation: any }) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#1a1a1a" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Chính sách bảo mật</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.updatedText}>Cập nhật lần cuối: 01/10/2023</Text>

        {SECTIONS.map((section) => (
          <View key={section.title} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <Text style={styles.sectionBody}>{section.body}</Text>
          </View>
        ))}

        <View style={styles.contactBox}>
          <Ionicons name="mail-outline" size={18} color="#1E40AF" />
          <Text style={styles.contactText}>
            Mọi thắc mắc về chính sách bảo mật, vui lòng liên hệ support@sporthub.vn
          </Text>
        </View>
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
  content: { padding: 20, paddingBottom: 32 },
  updatedText: { fontSize: 12, color: '#9ca3af', marginBottom: 20 },
  section: { marginBottom: 20 },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: '#1a1a1a', marginBottom: 8 },
  sectionBody: { fontSize: 13, color: '#666', lineHeight: 20 },
  contactBox: {
    flexDirection: 'row',
    backgroundColor: '#eff6ff',
    borderRadius: 12,
    padding: 14,
    gap: 10,
    marginTop: 8,
  },
  contactText: { flex: 1, fontSize: 12, color: '#1E40AF', lineHeight: 18 },
});

export default PrivacyPolicyScreen;
