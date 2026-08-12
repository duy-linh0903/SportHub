import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { bookingsApi } from '../api/bookingsApi';
import { fieldsApi } from '../api/fieldsApi';
import { usersApi } from '../api/usersApi';
import { BookingResponseDto, FieldResponseDto, UserResponseDto } from '../types/api';

interface AdminBooking {
  id: string;
  customerName: string;
  fieldName: string;
  date: string;
  time: string;
  price: string;
  status: 'Pending' | 'Confirmed' | 'Cancelled' | 'Completed' | string;
  originalData: BookingResponseDto;
}

const TABS = [
  { key: 'all', label: 'Tất cả' },
  { key: 'Pending', label: 'Chờ duyệt' },
] as const;

const AdminBookingListScreen = ({ navigation }: { navigation: any }) => {
  const [bookings, setBookings] = useState<AdminBooking[]>([]);
  const [tab, setTab] = useState<'all' | 'Pending'>('Pending');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const allBookings = await bookingsApi.getAll();
      const allFields = await fieldsApi.getAll();
      
      const fieldMap = new Map<string, FieldResponseDto>();
      allFields.forEach(f => fieldMap.set(f.fieldId, f));

      const mappedBookings: AdminBooking[] = [];
      for (const b of allBookings) {
        const field = fieldMap.get(b.fieldId);
        
        let customerName = 'Khách hàng';
        try {
          // Attempt to get user name
          const user = await usersApi.getById(b.userId);
          if (user) customerName = user.name;
        } catch(e) {}

        mappedBookings.push({
          id: b.bookingId,
          customerName: customerName,
          fieldName: field ? field.name : 'Sân thể thao',
          date: b.bookingDate,
          time: '',
          price: `${b.totalPrice.toLocaleString('vi-VN')}đ`,
          status: b.status,
          originalData: b
        });
      }

      mappedBookings.sort((a, b) => new Date(b.originalData.createdAt).getTime() - new Date(a.originalData.createdAt).getTime());
      setBookings(mappedBookings);
    } catch (error) {
      console.error(error);
      Alert.alert('Lỗi', 'Không thể tải danh sách đơn.');
    } finally {
      setLoading(false);
    }
  };

  const filtered = bookings.filter((b) => tab === 'all' || b.status === tab);
  const pendingCount = bookings.filter((b) => b.status === 'Pending').length;

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      await bookingsApi.updateStatus(id, { status: newStatus });
      setBookings((prev) => prev.map((b) => (b.id === id ? { ...b, status: newStatus } : b)));
    } catch (error) {
      console.error('Failed to update status', error);
      Alert.alert('Lỗi', 'Không thể cập nhật trạng thái đơn.');
    }
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

      {loading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#22c55e" />
        </View>
      ) : (
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
            <TouchableOpacity 
              style={styles.card}
              onPress={() => navigation.navigate('TicketDetail', { bookingCode: item.id })}
              activeOpacity={0.7}
            >
              <View style={styles.cardHeaderRow}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>{item.customerName.charAt(0).toUpperCase()}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.customerName}>{item.customerName}</Text>
                  <Text style={styles.fieldName}>{item.fieldName}</Text>
                </View>
                {item.status !== 'Pending' && (
                  <View
                    style={[
                      styles.statusBadge,
                      { backgroundColor: item.status === 'Confirmed' ? '#e6f4ea' : '#fef2f2' },
                    ]}
                  >
                    <Text style={[styles.statusText, { color: item.status === 'Confirmed' ? '#22c55e' : '#ba1a1a' }]}>
                      {item.status === 'Confirmed' ? 'ĐÃ DUYỆT' : (item.status === 'Cancelled' ? 'ĐÃ TỪ CHỐI' : item.status.toUpperCase())}
                    </Text>
                  </View>
                )}
              </View>

              <View style={styles.infoRow}>
                <Ionicons name="calendar-outline" size={13} color="#666" />
                <Text style={styles.infoText}>{item.date} {item.time ? '• ' + item.time : ''}</Text>
              </View>
              <View style={styles.infoRow}>
                <Ionicons name="cash-outline" size={13} color="#666" />
                <Text style={styles.infoText}>{item.price}</Text>
              </View>

              {item.status === 'Pending' && (
                <View style={styles.actionRow}>
                  <TouchableOpacity
                    style={styles.rejectBtn}
                    onPress={() => updateStatus(item.id, 'Cancelled')}
                  >
                    <Text style={styles.rejectText}>Từ chối</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.approveBtn}
                    onPress={() => updateStatus(item.id, 'Confirmed')}
                  >
                    <Ionicons name="checkmark" size={16} color="#fff" />
                    <Text style={styles.approveText}>Duyệt đơn</Text>
                  </TouchableOpacity>
                </View>
              )}
            </TouchableOpacity>
          )}
        />
      )}
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
