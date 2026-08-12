import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNotificationStore, AppNotification } from '../store/useNotificationStore';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';

const ICON_MAP: Record<AppNotification['type'], { icon: string; bg: string; color: string }> = {
  booking: { icon: 'calendar-outline', bg: '#e6f4ea', color: '#22c55e' },
  promo: { icon: 'pricetag-outline', bg: '#fff7ed', color: '#F97316' },
  system: { icon: 'information-circle-outline', bg: '#eff6ff', color: '#1E40AF' },
};

const NotificationScreen = ({ navigation }: { navigation: any }) => {
  const { notifications, markAsRead, clearAll } = useNotificationStore();

  const formatTime = (isoString: string) => {
    try {
      return formatDistanceToNow(new Date(isoString), { addSuffix: true, locale: vi });
    } catch {
      return 'Vừa xong';
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: '#f2f4f6' }]} edges={['top']}>
      <View style={[styles.header, { backgroundColor: '#fff', borderBottomColor: '#e2e8f0' }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#1a1a1a" />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: '#1a1a1a' }]}>Thông báo</Text>
        <TouchableOpacity onPress={clearAll}>
          <Ionicons name="trash-outline" size={22} color="#666" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="notifications-off-outline" size={48} color="#9ca3af" />
            <Text style={[styles.emptyText, { color: '#9ca3af' }]}>Chưa có thông báo nào</Text>
          </View>
        }
        renderItem={({ item }) => {
          const meta = ICON_MAP[item.type];
          return (
            <TouchableOpacity
              style={[
                styles.card,
                { backgroundColor: '#fff', borderColor: '#e2e8f0' },
                !item.read && { borderColor: '#bbf7d0', backgroundColor: '#f0fdf4' }
              ]}
              onPress={() => markAsRead(item.id)}
            >
              <View style={[styles.iconWrap, { backgroundColor: meta.bg }]}>
                <Ionicons name={meta.icon} size={20} color={meta.color} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.notifTitle, { color: '#1a1a1a' }]}>{item.title}</Text>
                <Text style={[styles.notifMessage, { color: '#666' }]}>{item.message}</Text>
                <Text style={[styles.notifTime, { color: '#9ca3af' }]}>{formatTime(item.time)}</Text>
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
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  headerTitle: { fontSize: 16, fontWeight: 'bold' },
  list: { padding: 16, gap: 12 },
  card: {
    flexDirection: 'row',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    gap: 12,
    marginBottom: 12,
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notifTitle: { fontSize: 14, fontWeight: '700', marginBottom: 3 },
  notifMessage: { fontSize: 12, marginBottom: 6, lineHeight: 17 },
  notifTime: { fontSize: 11 },
  unreadDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#22c55e', marginTop: 4 },
  emptyState: { alignItems: 'center', paddingTop: 100, gap: 12 },
  emptyText: { fontSize: 14 },
});

export default NotificationScreen;
