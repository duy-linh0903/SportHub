import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { bookingsApi } from '../api/bookingsApi';
import { fieldsApi } from '../api/fieldsApi';
import { usersApi } from '../api/usersApi';
import { BookingResponseDto, FieldResponseDto, UserResponseDto } from '../types/api';

const AdminQRScannerScreen = () => {
  const [scanned, setScanned] = useState(false);
  const [bookingIdInput, setBookingIdInput] = useState('');
  const [loading, setLoading] = useState(false);

  const [booking, setBooking] = useState<BookingResponseDto | null>(null);
  const [field, setField] = useState<FieldResponseDto | null>(null);
  const [user, setUser] = useState<UserResponseDto | null>(null);

  const handleSimulateScan = async () => {
    if (!bookingIdInput.trim()) {
      Alert.alert('Thông báo', 'Vui lòng nhập mã booking để mô phỏng quét!');
      return;
    }
    setLoading(true);
    try {
      const b = await bookingsApi.getById(bookingIdInput.trim());
      setBooking(b);
      const f = await fieldsApi.getById(b.fieldId);
      setField(f);
      try {
        const u = await usersApi.getById(b.userId);
        setUser(u);
      } catch (err) {
        console.log('Cannot fetch user', err);
      }
      setScanned(true);
    } catch (err) {
      Alert.alert('Thông báo', 'Không tìm thấy mã booking này trên hệ thống!');
    } finally {
      setLoading(false);
    }
  };

  const handleRescan = () => {
    setScanned(false);
    setBooking(null);
    setField(null);
    setUser(null);
    setBookingIdInput('');
  };

  const handleConfirm = async () => {
    if (!booking) return;
    try {
      await bookingsApi.updateStatus(booking.bookingId, { status: 'Completed' });
      Alert.alert('Thông báo', 'Check-in thành công!');
      handleRescan();
    } catch (err) {
      Alert.alert('Thông báo', 'Cập nhật trạng thái thất bại!');
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Quét mã check-in</Text>
      </View>

      <View style={styles.cameraArea}>
        <View style={styles.scanFrame}>
          <View style={[styles.corner, styles.cornerTL]} />
          <View style={[styles.corner, styles.cornerTR]} />
          <View style={[styles.corner, styles.cornerBL]} />
          <View style={[styles.corner, styles.cornerBR]} />
        </View>
        <Text style={styles.cameraHint}>Đưa mã QR của khách vào khung hình</Text>

        {!scanned && (
          <View style={{ marginTop: 20, width: '80%' }}>
            <TextInput
              style={{ backgroundColor: '#fff', borderRadius: 8, padding: 12, marginBottom: 12 }}
              placeholder="Nhập mã đặt sân (Booking ID)"
              value={bookingIdInput}
              onChangeText={setBookingIdInput}
            />
            <TouchableOpacity style={styles.simulateBtn} onPress={handleSimulateScan} disabled={loading}>
              <Ionicons name="search-outline" size={16} color="#fff" />
              <Text style={styles.simulateBtnText}>{loading ? 'Đang tìm...' : 'Tìm kiếm vé'}</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {scanned && booking && (
        <View style={styles.resultCard}>
          <View style={styles.resultHeaderRow}>
            <Ionicons name="checkmark-circle" size={18} color="#22c55e" />
            <Text style={styles.resultHeaderText}>Đã tìm thấy vé</Text>
          </View>

          <Text style={styles.sectionLabel}>Thông tin sân</Text>
          <Text style={styles.fieldName}>{field?.name || 'Sân chưa xác định'}</Text>
          <Text style={styles.fieldMeta}>{new Date(booking.bookingDate).toLocaleDateString('vi-VN')}</Text>

          <View style={styles.divider} />

          <Text style={styles.sectionLabel}>Thông tin khách</Text>
          <Text style={styles.fieldName}>{user?.name || 'Khách hàng'}</Text>
          <Text style={styles.fieldMeta}>Mã đặt sân: {booking.bookingId}</Text>

          <View style={styles.guestCountBox}>
            <Text style={styles.guestCountValue}>
              {booking.status === 'Completed' ? 'Đã Check-in' : 'Chưa Check-in'}
            </Text>
          </View>

          <View style={styles.actionRow}>
            <TouchableOpacity style={styles.rescanBtn} onPress={handleRescan}>
              <Text style={styles.rescanText}>Quét lại</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.confirmBtn, booking.status === 'Completed' && { backgroundColor: '#ccc' }]} 
              onPress={handleConfirm}
              disabled={booking.status === 'Completed'}
            >
              <Ionicons name="checkmark" size={16} color="#fff" />
              <Text style={styles.confirmText}>Xác nhận check-in</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a' },
  header: { paddingHorizontal: 20, paddingVertical: 14 },
  headerTitle: { fontSize: 16, fontWeight: 'bold', color: '#fff' },
  cameraArea: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 20 },
  scanFrame: { width: 220, height: 220, position: 'relative' },
  corner: { position: 'absolute', width: 32, height: 32, borderColor: '#22c55e' },
  cornerTL: { top: 0, left: 0, borderTopWidth: 3, borderLeftWidth: 3, borderTopLeftRadius: 8 },
  cornerTR: { top: 0, right: 0, borderTopWidth: 3, borderRightWidth: 3, borderTopRightRadius: 8 },
  cornerBL: { bottom: 0, left: 0, borderBottomWidth: 3, borderLeftWidth: 3, borderBottomLeftRadius: 8 },
  cornerBR: { bottom: 0, right: 0, borderBottomWidth: 3, borderRightWidth: 3, borderBottomRightRadius: 8 },
  cameraHint: { color: '#cbd5e1', fontSize: 13 },
  simulateBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#1E40AF',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
  },
  simulateBtnText: { color: '#fff', fontSize: 12, fontWeight: '600' },
  resultCard: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
  },
  resultHeaderRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 16 },
  resultHeaderText: { fontSize: 14, fontWeight: '700', color: '#22c55e' },
  sectionLabel: { fontSize: 11, color: '#9ca3af', fontWeight: '700', marginBottom: 4 },
  fieldName: { fontSize: 15, fontWeight: 'bold', color: '#1a1a1a', marginBottom: 2 },
  fieldMeta: { fontSize: 12, color: '#666' },
  divider: { height: 1, backgroundColor: '#f2f4f6', marginVertical: 14 },
  guestCountBox: {
    backgroundColor: '#f0fdf4',
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 16,
  },
  guestCountValue: { fontSize: 22, fontWeight: 'bold', color: '#22c55e' },
  guestCountTotal: { fontSize: 14, fontWeight: '600', color: '#666' },
  guestCountLabel: { fontSize: 11, color: '#666', marginTop: 2 },
  actionRow: { flexDirection: 'row', gap: 10 },
  rescanBtn: { flex: 1, alignItems: 'center', paddingVertical: 13, borderRadius: 12, borderWidth: 1, borderColor: '#e2e8f0' },
  rescanText: { fontSize: 14, fontWeight: '700', color: '#666' },
  confirmBtn: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#22c55e',
    paddingVertical: 13,
    borderRadius: 12,
  },
  confirmText: { fontSize: 14, fontWeight: '700', color: '#fff' },
});

export default AdminQRScannerScreen;
