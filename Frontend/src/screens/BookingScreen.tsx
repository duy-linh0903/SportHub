import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { SafeAreaView } from 'react-native-safe-area-context';

interface BookingItem {
  id: string;
  name: string;
  date: string;
  time: string;
  address: string;
  status: 'confirmed' | 'completed' | 'cancelled';
  price: string;
}

const BOOKINGS: BookingItem[] = [
  { id: '1', name: 'Sân bóng Đá Ca Nhân Tạo', date: '25 Tháng 10, 2023', time: '19:00 - 19:30', address: 'Bình Chánh Cao Cấp', status: 'confirmed', price: '240.000đ' },
  { id: '2', name: 'Cầu lông quốc tế Cí...', date: '18 Tháng 10, 2023', time: '19:00 - 21:00', address: 'Quận 10', status: 'completed', price: '180.000đ' },
  { id: '3', name: 'Tennis Rooftop...', date: '30 Tháng 10, 2023', time: '08:00 - 10:00', address: 'Quận 3', status: 'cancelled', price: '350.000đ' },
];

const TABS = [
  { key: 'all', label: 'Tất cả' },
  { key: 'confirmed', label: 'Sắp tới' },
  { key: 'completed', label: 'Đã xong' },
] as const;

const STATUS_META: Record<BookingItem['status'], { label: string; bg: string; color: string }> = {
  confirmed: { label: 'ĐÃ THANH TOÁN', bg: '#e6f4ea', color: '#22c55e' },
  completed: { label: 'ĐÃ XONG', bg: '#f2f4f6', color: '#666' },
  cancelled: { label: 'ĐÃ HỦY', bg: '#fef2f2', color: '#ba1a1a' },
};

const BookingScreen = ({ navigation }: { navigation: any }) => {
  const [tab, setTab] = useState<'all' | 'confirmed' | 'completed'>('all');
  const [query, setQuery] = useState('');

  const filtered = BOOKINGS.filter((b) => {
    const matchesTab = tab === 'all' || b.status === tab;
    const matchesQuery = b.name.toLowerCase().includes(query.toLowerCase());
    return matchesTab && matchesQuery;
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Lịch đặt sân</Text>
        <Ionicons name="notifications-outline" size={22} color="#1a1a1a" />
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
                <Text style={styles.infoText}>{item.date} • {item.time}</Text>
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
});

export default BookingScreen;
