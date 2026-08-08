import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';

const STATS = [
  { label: 'Tổng lượt đặt', value: '1,284', icon: 'calendar-outline' },
  { label: 'Doanh thu tháng', value: '45.2M', icon: 'cash-outline' },
];

const CHART_DATA = [40, 55, 35, 70, 60, 85, 50];
const CHART_LABELS = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];
const MAX_CHART_VALUE = 100;

interface Activity {
  id: string;
  fieldName: string;
  address: string;
  time: string;
  status: 'pending' | 'confirmed';
  price: string;
}

const RECENT_ACTIVITY: Activity[] = [
  { id: '1', fieldName: 'Sân bóng đá Thống Nhất', address: 'Quận 10, TP.HCM', time: '20:00, 15 Thg 8, 2024', status: 'pending', price: '450.000đ' },
  { id: '2', fieldName: 'Sân Cầu Lông A1', address: 'Quận 7, TP.HCM', time: '18:00 - 20:00', status: 'confirmed', price: '200.000đ' },
];

const AdminDashboardScreen = ({ navigation }: { navigation: any }) => {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerGreeting}>Xin chào,</Text>
          <Text style={styles.headerTitle}>Quản lý hệ thống</Text>
        </View>
        <TouchableOpacity 
          style={styles.avatarBtn}
          onPress={() => navigation.navigate('AdminProfile')} // Thêm dòng này
        >
          <Text style={styles.avatarText}>A</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.statsRow}>
          {STATS.map((s) => (
            <View key={s.label} style={styles.statCard}>
              <Ionicons name={s.icon} size={18} color="#22c55e" />
              <Text style={styles.statValue}>{s.value}</Text>
              <Text style={styles.statLabel}>{s.label}</Text>
            </View>
          ))}
        </View>

        <View style={styles.chartCard}>
          <Text style={styles.chartTitle}>Lượt đặt trong tuần</Text>
          <View style={styles.chartRow}>
            {CHART_DATA.map((value, i) => (
              <View key={i} style={styles.chartBarWrap}>
                <View style={[styles.chartBar, { height: (value / MAX_CHART_VALUE) * 90 }]} />
                <Text style={styles.chartLabel}>{CHART_LABELS[i]}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Hoạt động gần đây</Text>
          <TouchableOpacity onPress={() => navigation.navigate('AdminBookingList')}>
            <Text style={styles.seeAllText}>Xem tất cả</Text>
          </TouchableOpacity>
        </View>

        {RECENT_ACTIVITY.map((item) => (
          <View key={item.id} style={styles.activityCard}>
            <View style={styles.activityThumb}>
              <Ionicons name="tennisball-outline" size={20} color="#22c55e" />
            </View>
            <View style={{ flex: 1 }}>
              <View style={styles.activityHeaderRow}>
                <Text style={styles.activityName} numberOfLines={1}>{item.fieldName}</Text>
                <View
                  style={[
                    styles.statusBadge,
                    { backgroundColor: item.status === 'pending' ? '#fff7ed' : '#e6f4ea' },
                  ]}
                >
                  <Text
                    style={[
                      styles.statusText,
                      { color: item.status === 'pending' ? '#F97316' : '#22c55e' },
                    ]}
                  >
                    {item.status === 'pending' ? 'CHỜ DUYỆT' : 'ĐÃ XÁC NHẬN'}
                  </Text>
                </View>
              </View>
              <Text style={styles.activityMeta}>{item.address}</Text>
              <Text style={styles.activityMeta}>{item.time}</Text>
              <Text style={styles.activityPrice}>{item.price}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f2f4f6' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  headerGreeting: { fontSize: 12, color: '#666' },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#1a1a1a' },
  avatarBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#22c55e',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  content: { padding: 16, paddingBottom: 32 },
  statsRow: { flexDirection: 'row', gap: 12, marginBottom: 16 },
  statCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  statValue: { fontSize: 20, fontWeight: 'bold', color: '#1a1a1a', marginTop: 8 },
  statLabel: { fontSize: 12, color: '#666', marginTop: 2 },
  chartCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 20,
  },
  chartTitle: { fontSize: 14, fontWeight: '700', color: '#1a1a1a', marginBottom: 16 },
  chartRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', height: 110 },
  chartBarWrap: { alignItems: 'center', gap: 6 },
  chartBar: { width: 18, borderRadius: 6, backgroundColor: '#22c55e' },
  chartLabel: { fontSize: 10, color: '#9ca3af' },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: '#1a1a1a' },
  seeAllText: { fontSize: 12, color: '#1E40AF', fontWeight: '600' },
  activityCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 12,
    gap: 12,
  },
  activityThumb: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#e6f4ea',
    justifyContent: 'center',
    alignItems: 'center',
  },
  activityHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8, marginBottom: 4 },
  activityName: { fontSize: 13, fontWeight: '700', color: '#1a1a1a', flex: 1 },
  statusBadge: { paddingHorizontal: 7, paddingVertical: 3, borderRadius: 6 },
  statusText: { fontSize: 9, fontWeight: 'bold' },
  activityMeta: { fontSize: 11, color: '#666', marginBottom: 2 },
  activityPrice: { fontSize: 13, fontWeight: 'bold', color: '#006e2f', marginTop: 4 },
});

export default AdminDashboardScreen;
