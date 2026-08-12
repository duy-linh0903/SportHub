import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, ActivityIndicator, Alert } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { useAuthStore } from '../store/useAuthStore';
import { bookingsApi } from '../api/bookingsApi';
import { fieldsApi } from '../api/fieldsApi';
import { BookingResponseDto, FieldResponseDto } from '../types/api';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

interface BookingItem {
  id: string;
  name: string;
  date: string;
  time: string;
  address: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  price: string;
  originalData: BookingResponseDto;
}

const TABS = [
  { key: 'all', label: 'Tất cả' },
  { key: 'pending', label: 'Chờ duyệt' },
  { key: 'confirmed', label: 'Sắp tới' },
  { key: 'completed', label: 'Đã xong' },
] as const;

const STATUS_META: Record<BookingItem['status'], { label: string; bg: string; color: string }> = {
  pending: { label: 'CHỜ DUYỆT', bg: '#fff7ed', color: '#F97316' },
  confirmed: { label: 'ĐÃ THANH TOÁN', bg: '#e6f4ea', color: '#22c55e' },
  completed: { label: 'ĐÃ XONG', bg: '#f2f4f6', color: '#666' },
  cancelled: { label: 'ĐÃ HỦY', bg: '#fef2f2', color: '#ba1a1a' },
};

const BookingScreen = ({ navigation }: { navigation: any }) => {
  const { userId, isAuthenticated } = useAuthStore();
  const [tab, setTab] = useState<'all' | 'pending' | 'confirmed' | 'completed'>('all');
  const [query, setQuery] = useState('');
  
  const [bookings, setBookings] = useState<BookingItem[]>([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      if (isAuthenticated && userId) {
        fetchBookings();
      } else {
        setLoading(false);
      }
    }, [isAuthenticated, userId])
  );

  const fetchBookings = async () => {
    setLoading(true);
    try {
      // Fetch bookings for the user
      const userBookings = await bookingsApi.getByUser(userId!);
      // Fetch all fields to map the names
      const allFields = await fieldsApi.getAll();
      const fieldMap = new Map<string, FieldResponseDto>();
      allFields.forEach(f => fieldMap.set(f.fieldId, f));

      const mappedBookings: BookingItem[] = userBookings.map(b => {
        const field = fieldMap.get(b.fieldId);
        let status: 'pending' | 'confirmed' | 'completed' | 'cancelled' = 'pending';
        const bStatus = String(b.status).toLowerCase();
        if (bStatus === 'confirmed' || bStatus === '1') status = 'confirmed';
        if (bStatus === 'completed' || bStatus === '3') status = 'completed';
        if (bStatus === 'cancelled' || bStatus === '2') status = 'cancelled';

        let formattedDate = b.bookingDate;
        try {
          formattedDate = format(new Date(b.bookingDate), 'dd MMMM, yyyy', { locale: vi });
        } catch (e) {}

        return {
          id: b.bookingId,
          name: b.sportCenterName || field?.name || 'Sân thể thao',
          date: formattedDate,
          time: b.timeSlots || '',
          address: b.sportCenterAddress || 'Địa chỉ sân',
          status: status,
          price: `${b.totalPrice.toLocaleString('vi-VN')}đ`,
          originalData: b
        };
      });

      // Sort by date descending
      mappedBookings.sort((a, b) => new Date(b.originalData.bookingDate).getTime() - new Date(a.originalData.bookingDate).getTime());

      setBookings(mappedBookings);
    } catch (error) {
      console.error('Failed to fetch bookings:', error);
      Alert.alert('Lỗi', 'Không thể tải danh sách đặt sân.');
    } finally {
      setLoading(false);
    }
  };

  const filtered = bookings.filter((b) => {
    const matchesTab = tab === 'all' || b.status === tab;
    const matchesQuery = b.name.toLowerCase().includes(query.toLowerCase());
    return matchesTab && matchesQuery;
  });

  if (!isAuthenticated) {
    return (
      <SafeAreaView style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Ionicons name="lock-closed-outline" size={64} color="#d1d5db" />
        <Text style={{ marginTop: 16, fontSize: 16, color: '#666' }}>Vui lòng đăng nhập để xem lịch đặt sân</Text>
        <TouchableOpacity style={styles.loginBtn} onPress={() => navigation.navigate('Login')}>
          <Text style={styles.loginBtnText}>Đăng nhập</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Lịch đặt sân</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Notification')}>
          <Ionicons name="notifications-outline" size={22} color="#1a1a1a" />
        </TouchableOpacity>
      </View>

      <View style={styles.searchBar}>
        <Ionicons name="search-outline" size={18} color="#666" style={{ marginRight: 8 }} />
        <TextInput
          style={styles.searchInput}
          placeholder="Tìm kiếm lịch sử đặt sân..."
          placeholderTextColor="#999"
          value={query}
          onChangeText={setQuery}
        />
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
              <Ionicons name="calendar-outline" size={44} color="#d1d5db" />
              <Text style={styles.emptyText}>Không có lịch đặt nào</Text>
            </View>
          }
          renderItem={({ item }) => {
            const meta = STATUS_META[item.status];
            return (
              <TouchableOpacity
                style={styles.card}
                onPress={() => navigation.navigate('TicketDetail', { bookingCode: item.id, field: item })}
              >
                <View style={styles.thumb}>
                  <Ionicons name="tennisball-outline" size={22} color="#22c55e" />
                </View>
                <View style={{ flex: 1 }}>
                  <View style={styles.cardHeaderRow}>
                    <Text style={styles.venueName} numberOfLines={1}>{item.name}</Text>
                    <View style={[styles.badge, { backgroundColor: meta.bg }]}>
                      <Text style={[styles.badgeText, { color: meta.color }]}>{meta.label}</Text>
                    </View>
                  </View>
                  <Text style={styles.infoText}>{item.date}</Text>
                  <View style={styles.cardFooter}>
                    <Text style={styles.price}>{item.price}</Text>
                    {item.status === 'confirmed' ? (
                      <TouchableOpacity
                        style={styles.qrBtn}
                        onPress={() => navigation.navigate('TicketDetail', { bookingCode: item.id, field: item })}
                      >
                        <Ionicons name="qr-code-outline" size={14} color="#fff" />
                        <Text style={styles.qrText}>Lấy mã QR</Text>
                      </TouchableOpacity>
                    ) : (
                      <TouchableOpacity style={styles.rebookBtn} onPress={() => navigation.navigate('SelectTime')}>
                        <Text style={styles.rebookText}>Đặt lại sân</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              </TouchableOpacity>
            );
          }}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f2f4f6' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#e2e8f0' },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#1a1a1a' },
  searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f2f4f6', borderRadius: 12, paddingHorizontal: 12, height: 42, marginHorizontal: 16, marginTop: 12 },
  searchInput: { flex: 1, fontSize: 13, color: '#333' },
  tabRow: { flexDirection: 'row', paddingHorizontal: 16, paddingVertical: 12, gap: 10 },
  tabBtn: { flex: 1, paddingVertical: 9, alignItems: 'center', borderRadius: 8, backgroundColor: '#fff', borderWidth: 1, borderColor: '#e2e8f0' },
  tabActive: { backgroundColor: '#22c55e', borderColor: '#22c55e' },
  tabText: { fontSize: 13, fontWeight: '600', color: '#666' },
  tabTextActive: { color: '#fff' },
  list: { paddingHorizontal: 16, paddingBottom: 16, gap: 12 },
  card: { flexDirection: 'row', backgroundColor: '#fff', borderRadius: 16, padding: 12, borderWidth: 1, borderColor: '#e2e8f0', marginBottom: 12, gap: 12 },
  thumb: { width: 52, height: 52, borderRadius: 12, backgroundColor: '#e6f4ea', justifyContent: 'center', alignItems: 'center' },
  cardHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6, gap: 8 },
  venueName: { fontSize: 14, fontWeight: 'bold', color: '#1a1a1a', flex: 1 },
  badge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  badgeText: { fontSize: 10, fontWeight: 'bold' },
  infoText: { fontSize: 12, color: '#666', marginBottom: 10 },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  price: { fontSize: 14, fontWeight: 'bold', color: '#006e2f' },
  qrBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1E40AF', paddingHorizontal: 10, paddingVertical: 7, borderRadius: 8, gap: 5 },
  qrText: { color: '#fff', fontSize: 11, fontWeight: '600' },
  rebookBtn: { borderWidth: 1, borderColor: '#22c55e', paddingHorizontal: 10, paddingVertical: 7, borderRadius: 8 },
  rebookText: { color: '#22c55e', fontSize: 11, fontWeight: '700' },
  emptyState: { alignItems: 'center', paddingTop: 100, gap: 12 },
  emptyText: { fontSize: 14, color: '#9ca3af' },
  loginBtn: { marginTop: 24, backgroundColor: '#22c55e', paddingHorizontal: 32, paddingVertical: 12, borderRadius: 12 },
  loginBtnText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});

export default BookingScreen;
