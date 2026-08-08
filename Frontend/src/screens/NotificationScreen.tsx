import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';

interface Notification {
  id: string;
  type: 'booking' | 'promo' | 'system';
  title: string;
  message: string;
  time: string;
  read: boolean;
}

const DUMMY_NOTIFICATIONS: Notification[] = [
  { id: 'N1', type: 'booking', title: 'Đặt sân thành công', message: 'Sân Cầu Lông SportHub A1 - 19:00, 25/10/2023', time: '5 phút trước', read: false },
  { id: 'N2', type: 'promo', title: 'Ưu đãi 20% cho lượt đặt tiếp theo', message: 'Áp dụng đến hết 31/10/2023', time: '2 giờ trước', read: false },
  { id: 'N3', type: 'booking', title: 'Nhắc lịch đặt sân', message: 'Bạn có lịch đặt sân vào 18:00 hôm nay', time: '1 ngày trước', read: true },
  { id: 'N4', type: 'system', title: 'Cập nhật ứng dụng', message: 'SportHub vừa cập nhật phiên bản 2.4.0', time: '3 ngày trước', read: true },
];

const ICON_MAP: Record<Notification['type'], { icon: string; bg: string; color: string }> = {
  booking: { icon: 'calendar-outline', bg: '#e6f4ea', color: '#22c55e' },
  promo: { icon: 'pricetag-outline', bg: '#fff7ed', color: '#F97316' },
  system: { icon: 'information-circle-outline', bg: '#eff6ff', color: '#1E40AF' },
};

const NotificationScreen = ({ navigation }: { navigation: any }) => {
  const [notifications, setNotifications] = useState(DUMMY_NOTIFICATIONS);

  const markAsRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#1a1a1a" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Thông báo</Text>
        <View style={{ width: 24 }} />
      </View>

      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="notifications-off-outline" size={48} color="#d1d5db" />
            <Text style={styles.emptyText}>Chưa có thông báo nào</Text>
          </View>
        }
        renderItem={({ item }) => {
          const meta = ICON_MAP[item.type];
          return (
            <TouchableOpacity
              style={[styles.card, !item.read && styles.cardUnread]}
              onPress={() => markAsRead(item.id)}
            >
              <View style={[styles.iconWrap, { backgroundColor: meta.bg }]}>
                <Ionicons name={meta.icon} size={20} color={meta.color} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.notifTitle}>{item.title}</Text>
                <Text style={styles.notifMessage}>{item.message}</Text>
                <Text style={styles.notifTime}>{item.time}</Text>
              </View>
              {!item.read && <View style={styles.unreadDot} />}
            </TouchableOpacity>
          );
        }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f2f4f6' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  headerTitle: { fontSize: 16, fontWeight: 'bold', color: '#1a1a1a' },
  list: { padding: 16, gap: 12 },
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    gap: 12,
    marginBottom: 12,
  },
  cardUnread: { borderColor: '#bbf7d0', backgroundColor: '#f0fdf4' },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notifTitle: { fontSize: 14, fontWeight: '700', color: '#1a1a1a', marginBottom: 3 },
  notifMessage: { fontSize: 12, color: '#666', marginBottom: 6, lineHeight: 17 },
  notifTime: { fontSize: 11, color: '#9ca3af' },
  unreadDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#22c55e', marginTop: 4 },
  emptyState: { alignItems: 'center', paddingTop: 100, gap: 12 },
  emptyText: { fontSize: 14, color: '#9ca3af' },
});

export default NotificationScreen;
