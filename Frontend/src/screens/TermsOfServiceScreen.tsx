import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';

const SECTIONS = [
  {
    title: '1. Chấp nhận điều khoản',
    body: 'Khi tạo tài khoản và sử dụng SportHub, bạn đồng ý tuân thủ các điều khoản sử dụng này cùng mọi quy định liên quan được cập nhật theo thời gian.',
  },
  {
    title: '2. Đặt sân và thanh toán',
    body: 'Đơn đặt sân chỉ được xác nhận sau khi thanh toán thành công hoặc được chủ sân duyệt (đối với hình thức thanh toán tại quầy). Giá hiển thị đã bao gồm các loại phí áp dụng, trừ khi có ghi chú khác.',
  },
  {
    title: '3. Hủy và hoàn tiền',
    body: 'Người dùng có thể hủy lịch đặt trước giờ chơi tối thiểu 4 tiếng để được hoàn tiền. Các trường hợp hủy trễ hoặc không đến sẽ không được hoàn tiền, tùy theo chính sách của từng sân.',
  },
  {
    title: '4. Trách nhiệm người dùng',
    body: 'Người dùng cam kết cung cấp thông tin chính xác, giữ gìn cơ sở vật chất của sân trong quá trình sử dụng và chịu trách nhiệm bồi thường nếu gây hư hỏng do lỗi cá nhân.',
  },
  {
    title: '5. Thay đổi điều khoản',
    body: 'SportHub có quyền cập nhật điều khoản sử dụng bất kỳ lúc nào. Phiên bản mới nhất sẽ luôn được hiển thị trong ứng dụng.',
  },
];

const TermsOfServiceScreen = ({ navigation }: { navigation: any }) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#1a1a1a" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Điều khoản sử dụng</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.updatedText}>Có hiệu lực từ: 01/10/2023</Text>

        {SECTIONS.map((section) => (
          <View key={section.title} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <Text style={styles.sectionBody}>{section.body}</Text>
          </View>
        ))}
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
});

export default TermsOfServiceScreen;
