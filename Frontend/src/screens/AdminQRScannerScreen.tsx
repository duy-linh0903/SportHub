import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';

// Dummy - vé giả lập sau khi "quét" thành công. Khi tích hợp thật sẽ thay bằng
// react-native-vision-camera hoặc expo-camera + kết quả trả về từ API check-in.
const DUMMY_SCANNED_TICKET = {
  bookingCode: 'SH-29384-XB',
  fieldName: 'Sân Cầu Lông A1',
  timeSlot: '17:00 - 18:30',
  customerName: 'Nguyễn Văn An',
  totalGuests: 22,
  checkedInGuests: 14,
};

const AdminQRScannerScreen = () => {
  const [scanned, setScanned] = useState(false);

  const handleSimulateScan = () => setScanned(true);
  const handleRescan = () => setScanned(false);

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
          <TouchableOpacity style={styles.simulateBtn} onPress={handleSimulateScan}>
            <Ionicons name="qr-code-outline" size={16} color="#fff" />
            <Text style={styles.simulateBtnText}>Giả lập quét thành công</Text>
          </TouchableOpacity>
        )}
      </View>

      {scanned && (
        <View style={styles.resultCard}>
          <View style={styles.resultHeaderRow}>
            <Ionicons name="checkmark-circle" size={18} color="#22c55e" />
            <Text style={styles.resultHeaderText}>Đã tìm thấy vé</Text>
          </View>

          <Text style={styles.sectionLabel}>Thông tin sân</Text>
          <Text style={styles.fieldName}>{DUMMY_SCANNED_TICKET.fieldName}</Text>
          <Text style={styles.fieldMeta}>{DUMMY_SCANNED_TICKET.timeSlot}</Text>

          <View style={styles.divider} />

          <Text style={styles.sectionLabel}>Thông tin khách</Text>
          <Text style={styles.fieldName}>{DUMMY_SCANNED_TICKET.customerName}</Text>
          <Text style={styles.fieldMeta}>Mã đặt sân: {DUMMY_SCANNED_TICKET.bookingCode}</Text>

          <View style={styles.guestCountBox}>
            <Text style={styles.guestCountValue}>
              {DUMMY_SCANNED_TICKET.checkedInGuests}
              <Text style={styles.guestCountTotal}> / {DUMMY_SCANNED_TICKET.totalGuests} khách</Text>
            </Text>
            <Text style={styles.guestCountLabel}>đã check-in</Text>
          </View>

          <View style={styles.actionRow}>
            <TouchableOpacity style={styles.rescanBtn} onPress={handleRescan}>
              <Text style={styles.rescanText}>Quét lại</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.confirmBtn} onPress={handleRescan}>
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
