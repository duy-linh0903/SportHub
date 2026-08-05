import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';

interface AdminBooking {
  id: string;
  customerName: string;
  fieldName: string;
  date: string;
  time: string;
  price: string;
  status: 'pending' | 'confirmed' | 'rejected';
}

const INITIAL_BOOKINGS: AdminBooking[] = [
  { id: 'B1', customerName: 'Nguyễn Văn An', fieldName: 'Sân Cầu Lông A1', date: '25 Thg 10, 2023', time: '19:00 - 20:00', price: '240.000đ', status: 'pending' },
  { id: 'B2', customerName: 'Trần Thị Hồng B', fieldName: 'Sân Bóng đá Mini B2', date: '25 Thg 10, 2023', time: '20:00 - 21:30', price: '450.000đ', status: 'pending' },
  { id: 'B3', customerName: 'Lê Hoàng Nam', fieldName: 'Sân Tennis T1', date: '24 Thg 10, 2023', time: '08:00 - 09:00', price: '280.000đ', status: 'confirmed' },
];

const TABS = [
  { key: 'all', label: 'Tất cả' },
  { key: 'pending', label: 'Chờ duyệt' },
] as const;

const AdminBookingListScreen = () => {
  const [bookings, setBookings] = useState(INITIAL_BOOKINGS);
  const [tab, setTab] = useState<'all' | 'pending'>('pending');

  const filtered = bookings.filter((b) => tab === 'all' || b.status === 'pending');
  const pendingCount = bookings.filter((b) => b.status === 'pending').length;

  const updateStatus = (id: string, status: 'confirmed' | 'rejected') => {
    setBookings((prev) => prev.map((b) => (b.id === id ? { ...b, status } : b)));
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Duyệt lịch đặt sân</Text>
        {pendingCount > 0 && (
          <View style={styles.pendingBadge}>
            <Text style={styles.pendingBadgeText}>{pendingCount} chờ duyệt</Text>
          </View>
        )}
      </View>

      <View style={styles.tabRow}>
        {TABS.map((t) => (
          <TouchableOpacity
            key={t.key}
            style={[styles.tabBtn, tab === t.key && styles.tabActive]}
            onPress={() => setTab(t.key)}
          >
            <Text style={[styles.tabText, tab === t.key && styles.tabTextActive]}>{t.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="checkmark-done-circle-outline" size={44} color="#d1d5db" />
            <Text style={styles.emptyText}>Không có đơn nào</Text>
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardHeaderRow}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{item.customerName.charAt(0)}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.customerName}>{item.customerName}</Text>
                <Text style={styles.fieldName}>{item.fieldName}</Text>
              </View>
              {item.status !== 'pending' && (
                <View
                  style={[
                    styles.statusBadge,
                    { backgroundColor: item.status === 'confirmed' ? '#e6f4ea' : '#fef2f2' },
                  ]}
                >
                  <Text style={[styles.statusText, { color: item.status === 'confirmed' ? '#22c55e' : '#ba1a1a' }]}>
                    {item.status === 'confirmed' ? 'ĐÃ DUYỆT' : 'ĐÃ TỪ CHỐI'}
                  </Text>
                </View>
              )}
            </View>

            <View style={styles.infoRow}>
              <Ionicons name="calendar-outline" size={13} color="#666" />
              <Text style={styles.infoText}>{item.date} • {item.time}</Text>
            </View>
            <View style={styles.infoRow}>
              <Ionicons name="cash-outline" size={13} color="#666" />
              <Text style={styles.infoText}>{item.price}</Text>
            </View>

            {item.status === 'pending' && (
              <View style={styles.actionRow}>
                <TouchableOpacity
                  style={styles.rejectBtn}
                  onPress={() => updateStatus(item.id, 'rejected')}
                >
                  <Text style={styles.rejectText}>Từ chối</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.approveBtn}
                  onPress={() => updateStatus(item.id, 'confirmed')}
                >
                  <Ionicons name="checkmark" size={16} color="#fff" />
                  <Text style={styles.approveText}>Duyệt đơn</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f2f4f6' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#1a1a1a' },
  pendingBadge: { backgroundColor: '#fff7ed', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8 },
  pendingBadgeText: { fontSize: 11, fontWeight: '700', color: '#F97316' },
  tabRow: { flexDirection: 'row', paddingHorizontal: 16, paddingVertical: 12, gap: 10 },
  tabBtn: { flex: 1, paddingVertical: 9, alignItems: 'center', borderRadius: 8, backgroundColor: '#fff', borderWidth: 1, borderColor: '#e2e8f0' },
  tabActive: { backgroundColor: '#22c55e', borderColor: '#22c55e' },
  tabText: { fontSize: 13, fontWeight: '600', color: '#666' },
  tabTextActive: { color: '#fff' },
  list: { paddingHorizontal: 16, paddingBottom: 16 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 12,
  },
  cardHeaderRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10 },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#1E40AF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: { color: '#fff', fontWeight: '700', fontSize: 15 },
  customerName: { fontSize: 14, fontWeight: '700', color: '#1a1a1a' },
  fieldName: { fontSize: 12, color: '#666', marginTop: 2 },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  statusText: { fontSize: 10, fontWeight: 'bold' },
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 6 },
  infoText: { fontSize: 12, color: '#666' },
  actionRow: { flexDirection: 'row', gap: 10, marginTop: 10 },
  rejectBtn: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 11,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  rejectText: { fontSize: 13, fontWeight: '700', color: '#666' },
  approveBtn: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#22c55e',
    paddingVertical: 11,
    borderRadius: 10,
  },
  approveText: { fontSize: 13, fontWeight: '700', color: '#fff' },
  emptyState: { alignItems: 'center', paddingTop: 100, gap: 12 },
  emptyText: { fontSize: 14, color: '#9ca3af' },
});

export default AdminBookingListScreen;
