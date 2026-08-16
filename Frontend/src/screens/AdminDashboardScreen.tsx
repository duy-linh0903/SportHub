import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { bookingsApi } from '../api/bookingsApi';
import { BookingResponseDto } from '../types/api';
import { useIsFocused } from '@react-navigation/native';

const AdminDashboardScreen = ({ navigation }: { navigation: any }) => {
  const [bookings, setBookings] = useState<BookingResponseDto[]>([]);
  const [loading, setLoading] = useState(true);
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      loadData();
    }
  }, [isFocused]);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await bookingsApi.getByOwner();
      setBookings(data);
    } catch (error) {
      console.error('Failed to load dashboard data', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#22c55e" />
      </View>
    );
  }

  const totalBookings = bookings.length;
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  
  const monthlyRevenue = bookings
    .filter(b => {
      const date = new Date(b.createdAt);
      return date.getMonth() === currentMonth && 
             date.getFullYear() === currentYear &&
             (b.status === 'Confirmed' || b.status === 'Completed' || b.status === 'Pending');
    })
    .reduce((sum, b) => sum + b.totalPrice, 0);

  const formatRevenue = (amount: number) => {
    if (amount >= 1000000) return `${(amount / 1000000).toFixed(1)}M`;
    if (amount >= 1000) return `${(amount / 1000).toFixed(0)}K`;
    return `${amount}`;
  };

  const STATS = [
    { label: 'Tổng lượt đặt', value: totalBookings.toLocaleString(), icon: 'calendar-outline' },
    { label: 'Doanh thu tháng', value: formatRevenue(monthlyRevenue), icon: 'cash-outline' },
  ];

  const chartData = [0, 0, 0, 0, 0, 0, 0];
  const now = new Date();
  bookings.forEach(b => {
    const d = new Date(b.createdAt);
    const diffTime = Math.abs(now.getTime() - d.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
    if (diffDays <= 7) {
      chartData[d.getDay()] += 1;
    }
  });
  
  const orderedChartData = [
    chartData[1], chartData[2], chartData[3], chartData[4], 
    chartData[5], chartData[6], chartData[0]
  ];
  const orderedChartLabels = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];
  const maxChartValue = Math.max(...orderedChartData, 10);
  const recentBookings = [...bookings]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerGreeting}>Xin chào,</Text>
          <Text style={styles.headerTitle}>Quản lý hệ thống</Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TouchableOpacity 
            style={{ marginRight: 16, position: 'relative' }}
            onPress={() => navigation.navigate('Notification')}
          >
            <Ionicons name="notifications-outline" size={24} color="#0f172a" />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.avatarBtn}
            onPress={() => navigation.navigate('AdminProfile')}
          >
            <Text style={styles.avatarText}>A</Text>
          </TouchableOpacity>
        </View>
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
          <Text style={styles.chartTitle}>Lượt đặt 7 ngày qua</Text>
          <View style={styles.chartRow}>
            {orderedChartData.map((value, i) => (
              <View key={i} style={styles.chartBarWrap}>
                <View style={[styles.chartBar, { height: (value / maxChartValue) * 90 }]} />
                <Text style={styles.chartLabel}>{orderedChartLabels[i]}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.actionRow}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => navigation.navigate('AdminReviewList')}
          >
            <Ionicons name="star" size={20} color="#EAB308" />
            <Text style={styles.actionButtonText}>Đánh giá của khách</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Hoạt động gần đây</Text>
          <TouchableOpacity onPress={() => navigation.navigate('AdminBookingList')}>
            <Text style={styles.seeAllText}>Xem tất cả</Text>
          </TouchableOpacity>
        </View>

        {recentBookings.map((item) => (
          <TouchableOpacity 
            key={item.bookingId} 
            style={styles.activityCard}
            onPress={() => navigation.navigate('TicketDetail', { bookingCode: item.bookingId })}
          >
            <View style={styles.activityThumb}>
              <Ionicons name="tennisball-outline" size={20} color="#22c55e" />
            </View>
            <View style={{ flex: 1 }}>
              <View style={styles.activityHeaderRow}>
                <Text style={styles.activityName} numberOfLines={1}>
                  {item.sportCenterName && item.fieldName ? `${item.sportCenterName} - ${item.fieldName}` : item.fieldName || item.sportCenterName}
                </Text>
                <View
                  style={[
                    styles.statusBadge,
                    { backgroundColor: item.status === 'Pending' ? '#fff7ed' : item.status === 'Cancelled' ? '#fef2f2' : '#e6f4ea' },
                  ]}
                >
                  <Text
                    style={[
                      styles.statusText,
                      { color: item.status === 'Pending' ? '#F97316' : item.status === 'Cancelled' ? '#ef4444' : '#22c55e' },
                    ]}
                  >
                    {item.status === 'Pending' ? 'CHỜ DUYỆT' : (item.status === 'Confirmed' ? 'ĐÃ XÁC NHẬN' : item.status.toUpperCase())}
                  </Text>
                </View>
              </View>
              <Text style={styles.activityMeta}>{item.sportCenterAddress}</Text>
              <Text style={styles.activityMeta}>{item.timeSlots} - {item.bookingDate}</Text>
            </View>
            <Text style={styles.activityPrice}>{item.totalPrice.toLocaleString('vi-VN')}đ</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  headerGreeting: { fontSize: 14, color: '#64748b', marginBottom: 4 },
  headerTitle: { fontSize: 22, fontWeight: '700', color: '#0f172a' },
  avatarBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#22c55e',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: { color: '#fff', fontSize: 18, fontWeight: '700' },
  content: { padding: 20 },
  statsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 24 },
  statCard: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  statValue: { fontSize: 24, fontWeight: '700', color: '#0f172a', marginTop: 12, marginBottom: 4 },
  statLabel: { fontSize: 13, color: '#64748b' },
  chartCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  chartTitle: { fontSize: 16, fontWeight: '600', color: '#0f172a', marginBottom: 20 },
  chartRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', height: 120 },
  chartBarWrap: { alignItems: 'center', width: 30 },
  chartBar: { width: 8, backgroundColor: '#22c55e', borderRadius: 4, marginBottom: 10 },
  chartLabel: { fontSize: 12, color: '#64748b' },
  actionRow: { marginBottom: 24 },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  actionButtonText: { marginLeft: 12, fontSize: 16, fontWeight: '600', color: '#0f172a' },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#0f172a' },
  seeAllText: { fontSize: 14, color: '#22c55e', fontWeight: '500' },
  activityCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  activityThumb: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#f0fdf4',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  activityHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  activityName: { fontSize: 15, fontWeight: '600', color: '#0f172a', flex: 1, marginRight: 8 },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  statusText: { fontSize: 10, fontWeight: '700' },
  activityMeta: { fontSize: 13, color: '#64748b', marginBottom: 2 },
  activityPrice: { fontSize: 15, fontWeight: '700', color: '#0f172a', position: 'absolute', bottom: 16, right: 16 },
});

export default AdminDashboardScreen;
