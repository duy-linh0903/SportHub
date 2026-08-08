import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';

// Mô phỏng model CheckInCode / Booking từ backend
const DUMMY_TICKET = {
  bookingCode: 'SH-29384-XB',
  status: 'Thành công',
  fieldName: 'Sân Cầu Lông SportHub A1',
  address: 'Thiên Sơn Cao Cấp, Q7, TP.HCM',
  date: '25 Tháng 10, 2023',
  time: '19:00 - 20:00',
  fieldNumber: 'Sân số 04',
  totalPrice: 300000,
};

// Placeholder QR: lưới ô vuông ngẫu nhiên giả lập, thay bằng thư viện QR thật khi tích hợp API
const QR_PATTERN = Array.from({ length: 49 }, (_, i) => (i * 7) % 3 === 0);

const QrPlaceholder = () => (
  <View style={styles.qrGrid}>
    {QR_PATTERN.map((filled, i) => (
      <View
        key={i}
        style={[styles.qrCell, filled && styles.qrCellFilled]}
      />
    ))}
  </View>
);

const TicketDetailScreen = ({ navigation, route }: { navigation: any; route: any }) => {
  const bookingCode = route?.params?.bookingCode || DUMMY_TICKET.bookingCode;
  const field = route?.params?.field;
  const totalPrice = route?.params?.totalPrice || DUMMY_TICKET.totalPrice;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={26} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Chi tiết đặt sân</Text>
        <TouchableOpacity>
          <Ionicons name="share-outline" size={22} color="#111827" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.statusBadge}>
          <Ionicons name="checkmark-circle" size={14} color="#16a34a" />
          <Text style={styles.statusText}>{DUMMY_TICKET.status}</Text>
        </View>

        <View style={styles.ticketCard}>
          <Text style={styles.qrLabel}>MÃ VÉ ĐẶT SÂN</Text>
          <QrPlaceholder />
          <Text style={styles.bookingCode}>{bookingCode}</Text>

          <View style={styles.dashedDivider} />

          <View style={styles.infoGrid}>
            <View style={styles.infoCol}>
              <Text style={styles.infoLabel}>Sân số</Text>
              <Text style={styles.infoValue}>{field?.fieldNumber || DUMMY_TICKET.fieldNumber}</Text>
            </View>
            <View style={styles.infoCol}>
              <Text style={styles.infoLabel}>Ngày đặt</Text>
              <Text style={styles.infoValue}>{field?.date || DUMMY_TICKET.date}</Text>
            </View>
          </View>
          <View style={styles.infoGrid}>
            <View style={styles.infoCol}>
              <Text style={styles.infoLabel}>Khung giờ</Text>
              <Text style={styles.infoValue}>{field?.time || DUMMY_TICKET.time}</Text>
            </View>
            <View style={styles.infoCol}>
              <Text style={styles.infoLabel}>Tổng tiền</Text>
              <Text style={[styles.infoValue, { color: '#22c55e' }]}>
                {totalPrice.toLocaleString('vi-VN')}đ
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.venueCard}>
          <View style={styles.venueThumb}>
            <Ionicons name="tennisball-outline" size={22} color="#22c55e" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.venueName}>{field?.name || DUMMY_TICKET.fieldName}</Text>
            <Text style={styles.venueAddress}>{field?.address || DUMMY_TICKET.address}</Text>
          </View>
        </View>

        <View style={styles.actionRow}>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="navigate-outline" size={18} color="#374151" />
            <Text style={styles.actionButtonText}>Chỉ đường</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="call-outline" size={18} color="#374151" />
            <Text style={styles.actionButtonText}>Liên hệ chủ sân</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.saveButton}>
          <Ionicons name="download-outline" size={18} color="#fff" />
          <Text style={styles.saveButtonText}>Lưu vào ảnh</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  headerTitle: { fontSize: 16, fontWeight: '600', color: '#111827' },
  scrollContent: { padding: 16, paddingBottom: 24, alignItems: 'center' },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#dcfce7',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 16,
  },
  statusText: { fontSize: 12, fontWeight: '700', color: '#16a34a' },
  ticketCard: {
    width: '100%',
    backgroundColor: '#f9fafb',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginBottom: 16,
  },
  qrLabel: { fontSize: 11, color: '#9ca3af', fontWeight: '700', letterSpacing: 1, marginBottom: 12 },
  qrGrid: {
    width: 140,
    height: 140,
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 6,
  },
  qrCell: { width: '14.28%', height: '14.28%' },
  qrCellFilled: { backgroundColor: '#111827' },
  bookingCode: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
    marginTop: 12,
    letterSpacing: 1,
  },
  dashedDivider: {
    width: '100%',
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor: '#d1d5db',
    marginVertical: 16,
  },
  infoGrid: { flexDirection: 'row', width: '100%', marginBottom: 12 },
  infoCol: { flex: 1 },
  infoLabel: { fontSize: 11, color: '#9ca3af', marginBottom: 4 },
  infoValue: { fontSize: 13, fontWeight: '600', color: '#111827' },
  venueCard: {
    flexDirection: 'row',
    width: '100%',
    backgroundColor: '#f9fafb',
    borderRadius: 14,
    padding: 12,
    marginBottom: 16,
  },
  venueThumb: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#dcfce7',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  venueName: { fontSize: 14, fontWeight: '700', color: '#111827' },
  venueAddress: { fontSize: 12, color: '#6b7280', marginTop: 2 },
  actionRow: { flexDirection: 'row', width: '100%', gap: 12 },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    paddingVertical: 12,
  },
  actionButtonText: { fontSize: 13, fontWeight: '600', color: '#374151' },
  footer: { padding: 16, borderTopWidth: 1, borderTopColor: '#f0f0f0' },
  saveButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#22c55e',
    paddingVertical: 14,
    borderRadius: 14,
  },
  saveButtonText: { color: '#fff', fontWeight: '700', fontSize: 15 },
});

export default TicketDetailScreen;
