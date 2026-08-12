import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';

const BookingSuccessScreen = ({ navigation, route }: { navigation: any; route: any }) => {
  const field = route?.params?.field;
  const totalPrice = route?.params?.totalPrice || 0;
  const bookingCode = route?.params?.bookingCode || 'Đang cập nhật';

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.content}>
        <View style={styles.iconCircle}>
          <Ionicons name="checkmark" size={48} color="#fff" />
        </View>

        <Text style={styles.title}>Đặt sân thành công!</Text>
        <Text style={styles.subtitle}>
          Đơn đặt sân của bạn đã được xác nhận. Mã đặt sân của bạn là:
        </Text>
        <Text style={styles.bookingCode}>{bookingCode}</Text>

        <View style={styles.summaryBox}>
          <View style={styles.summaryRow}>
            <Ionicons name="location-outline" size={16} color="#6b7280" />
            <Text style={styles.summaryText}>
              {field?.name || 'Sân chưa xác định'}
            </Text>
          </View>
          <View style={styles.summaryRow}>
            <Ionicons name="calendar-outline" size={16} color="#6b7280" />
            <Text style={styles.summaryText}>
              {field?.date || 'N/A'} • {field?.time || 'N/A'}
            </Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.summaryRow}>
            <Text style={styles.totalLabel}>Tổng thanh toán</Text>
            <Text style={styles.totalValue}>
              {totalPrice.toLocaleString('vi-VN')}đ
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() =>
            navigation.navigate('TicketDetail', { bookingCode, field, totalPrice })
          }
        >
          <Text style={styles.primaryButtonText}>Xem chi tiết vé</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => navigation.navigate('MainTab', { screen: 'Home' })}
        >
          <Text style={styles.secondaryButtonText}>Về trang chủ</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', justifyContent: 'space-between' },
  content: { flex: 1, alignItems: 'center', paddingHorizontal: 24, paddingTop: 48 },
  iconCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: '#22c55e',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: { fontSize: 20, fontWeight: '700', color: '#111827', marginBottom: 8 },
  subtitle: { fontSize: 13, color: '#6b7280', textAlign: 'center', lineHeight: 19 },
  bookingCode: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E40AF',
    marginTop: 8,
    marginBottom: 24,
    letterSpacing: 1,
  },
  summaryBox: {
    width: '100%',
    backgroundColor: '#f9fafb',
    borderRadius: 16,
    padding: 16,
  },
  summaryRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10 },
  summaryText: { fontSize: 13, color: '#374151', flexShrink: 1 },
  divider: { height: 1, backgroundColor: '#e5e7eb', marginVertical: 6 },
  totalLabel: { fontSize: 13, color: '#6b7280', flex: 1 },
  totalValue: { fontSize: 16, fontWeight: '700', color: '#22c55e' },
  footer: { padding: 16, gap: 10 },
  primaryButton: {
    backgroundColor: '#22c55e',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
  },
  primaryButtonText: { color: '#fff', fontWeight: '700', fontSize: 15 },
  secondaryButton: {
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  secondaryButtonText: { color: '#374151', fontWeight: '600', fontSize: 15 },
});

export default BookingSuccessScreen;
