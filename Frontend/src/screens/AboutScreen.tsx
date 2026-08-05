import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';

const STATS = [
  { label: 'Sân đối tác', value: '50+' },
  { label: 'Lượt đặt sân', value: '1K+' },
  { label: 'Hỗ trợ', value: '24/7' },
  { label: 'Hài lòng', value: '100%' },
];

const FEATURES = [
  { icon: 'flash-outline', title: 'Đặt sân nhanh chóng', desc: 'Chỉ vài chạm để giữ chỗ sân yêu thích, không cần gọi điện chờ đợi.' },
  { icon: 'card-outline', title: 'Thanh toán linh hoạt', desc: 'Hỗ trợ ví điện tử, thẻ ngân hàng và tiền mặt tại quầy.' },
  { icon: 'qr-code-outline', title: 'Check-in bằng QR', desc: 'Vé điện tử kèm mã QR, không cần in giấy khi đến sân.' },
];

const AboutScreen = ({ navigation }: { navigation: any }) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#1a1a1a" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Giới thiệu</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.logoBox}>
          <View style={styles.logoCircle}>
            <Ionicons name="football" size={32} color="#fff" />
          </View>
          <Text style={styles.appName}>SportHub</Text>
          <Text style={styles.appTagline}>Đặt sân thể thao dễ dàng, mọi lúc mọi nơi</Text>
        </View>

        <View style={styles.statsRow}>
          {STATS.map((s) => (
            <View key={s.label} style={styles.statBox}>
              <Text style={styles.statValue}>{s.value}</Text>
              <Text style={styles.statLabel}>{s.label}</Text>
            </View>
          ))}
        </View>

        <Text style={styles.aboutText}>
          SportHub là nền tảng kết nối người chơi thể thao với các sân bóng đá, cầu lông, tennis, bóng rổ và gym trên toàn quốc. Chúng tôi giúp bạn tìm sân, đặt lịch và thanh toán chỉ trong vài phút, đồng thời hỗ trợ chủ sân quản lý hoạt động kinh doanh hiệu quả hơn.
        </Text>

        <Text style={styles.sectionTitle}>Vì sao chọn SportHub?</Text>
        {FEATURES.map((f) => (
          <View key={f.title} style={styles.featureCard}>
            <View style={styles.featureIconWrap}>
              <Ionicons name={f.icon} size={20} color="#22c55e" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.featureTitle}>{f.title}</Text>
              <Text style={styles.featureDesc}>{f.desc}</Text>
            </View>
          </View>
        ))}

        <View style={styles.contactSection}>
          <Text style={styles.sectionTitle}>Liên hệ</Text>
          <TouchableOpacity style={styles.contactRow} onPress={() => Linking.openURL('mailto:support@sporthub.vn')}>
            <Ionicons name="mail-outline" size={18} color="#666" />
            <Text style={styles.contactText}>support@sporthub.vn</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.contactRow} onPress={() => Linking.openURL('tel:19001234')}>
            <Ionicons name="call-outline" size={18} color="#666" />
            <Text style={styles.contactText}>1900 1234</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.versionText}>Phiên bản 2.4.0 (Build 1032)</Text>
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
  logoBox: { alignItems: 'center', marginBottom: 24 },
  logoCircle: {
    width: 72,
    height: 72,
    borderRadius: 20,
    backgroundColor: '#22c55e',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  appName: { fontSize: 22, fontWeight: 'bold', color: '#1a1a1a', marginBottom: 4 },
  appTagline: { fontSize: 13, color: '#666', textAlign: 'center' },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: '#f2f4f6',
    borderRadius: 16,
    paddingVertical: 16,
    marginBottom: 24,
  },
  statBox: { flex: 1, alignItems: 'center' },
  statValue: { fontSize: 18, fontWeight: 'bold', color: '#22c55e' },
  statLabel: { fontSize: 11, color: '#666', marginTop: 4 },
  aboutText: { fontSize: 13, color: '#666', lineHeight: 21, marginBottom: 24 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#1a1a1a', marginBottom: 14 },
  featureCard: {
    flexDirection: 'row',
    backgroundColor: '#f8fafc',
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    gap: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  featureIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#e6f4ea',
    justifyContent: 'center',
    alignItems: 'center',
  },
  featureTitle: { fontSize: 14, fontWeight: '700', color: '#1a1a1a', marginBottom: 3 },
  featureDesc: { fontSize: 12, color: '#666', lineHeight: 17 },
  contactSection: { marginTop: 12, marginBottom: 24 },
  contactRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 12 },
  contactText: { fontSize: 13, color: '#333' },
  versionText: { textAlign: 'center', fontSize: 12, color: '#9ca3af' },
});

export default AboutScreen;
