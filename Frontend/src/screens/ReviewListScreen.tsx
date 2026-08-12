import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';

// ===== Dummy Data - mô phỏng model Review =====
interface Review {
  id: string;
  userName: string;
  rating: number;
  date: string;
  comment: string;
}

const Stars = ({ rating, size = 13 }: { rating: number; size?: number }) => (
  <View style={{ flexDirection: 'row' }}>
    {[1, 2, 3, 4, 5].map((i) => (
      <Ionicons
        key={i}
        name={i <= rating ? 'star' : 'star-outline'}
        size={size}
        color="#f59e0b"
        style={{ marginRight: 1 }}
      />
    ))}
  </View>
);

const ReviewListScreen = ({ navigation, route }: { navigation: any; route: any }) => {
  const fieldName = route?.params?.fieldName || 'Sân chưa xác định';
  const sportCenterId = route?.params?.sportCenterId;
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    if (sportCenterId) {
      fetchReviews();
    } else {
      setLoading(false);
    }
  }, [sportCenterId]);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const { reviewsApi } = await import('../api/reviewsApi');
      const data = await reviewsApi.getBySportCenter(sportCenterId);
      setReviews(data);
    } catch (error) {
      console.error('Error fetching reviews', error);
    } finally {
      setLoading(false);
    }
  };

  const totalReviews = reviews.length;
  const averageRating = totalReviews > 0 
    ? reviews.reduce((sum: number, r: any) => sum + r.rating, 0) / totalReviews 
    : 0;

  const ratingCounts = [0, 0, 0, 0, 0];
  reviews.forEach((r: any) => {
    if (r.rating >= 1 && r.rating <= 5) {
      ratingCounts[r.rating - 1]++;
    }
  });

  const ratingBreakdown = [5, 4, 3, 2, 1].map(star => ({
    star,
    percent: totalReviews > 0 ? ratingCounts[star - 1] / totalReviews : 0
  }));

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={26} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>
          Đánh giá - {fieldName}
        </Text>
        <View style={{ width: 26 }} />
      </View>

      <FlatList
        data={reviews}
        keyExtractor={(item, index) => `${item.userId}-${index}`}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <View style={styles.summaryBox}>
            <View style={styles.summaryLeft}>
              <Text style={styles.averageValue}>{averageRating.toFixed(1)}</Text>
              <Stars rating={Math.round(averageRating)} size={14} />
              <Text style={styles.totalText}>{totalReviews} đánh giá</Text>
            </View>
            <View style={styles.summaryRight}>
              {ratingBreakdown.map((r) => (
                <View key={r.star} style={styles.breakdownRow}>
                  <Text style={styles.breakdownStar}>{r.star}</Text>
                  <Ionicons name="star" size={10} color="#f59e0b" />
                  <View style={styles.breakdownBarBg}>
                    <View style={[styles.breakdownBarFill, { width: `${r.percent * 100}%` }]} />
                  </View>
                </View>
              ))}
            </View>
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.reviewCard}>
            <View style={styles.reviewHeader}>
              <View style={styles.avatar}>
                <Ionicons name="person" size={18} color="#fff" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.userName}>Khách hàng</Text>
                <View style={styles.reviewMeta}>
                  <Stars rating={item.rating} />
                  <Text style={styles.reviewDate}>N/A</Text>
                </View>
              </View>
            </View>
            <Text style={styles.reviewComment}>{item.comment}</Text>
          </View>
        )}
        ListEmptyComponent={
          !loading ? <Text style={{ textAlign: 'center', marginTop: 40, color: '#666' }}>Chưa có đánh giá nào.</Text> : null
        }
      />

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.writeButton}
          onPress={() => navigation.navigate('WriteReview', { field: { name: fieldName, sportCenterId } })}
        >
          <Ionicons name="create-outline" size={18} color="#fff" />
          <Text style={styles.writeButtonText}>Viết đánh giá</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  headerTitle: { fontSize: 15, fontWeight: '600', color: '#111827', flex: 1, textAlign: 'center' },
  listContent: { padding: 16, paddingBottom: 24 },
  summaryBox: {
    flexDirection: 'row',
    backgroundColor: '#f9fafb',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  summaryLeft: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingRight: 16,
    borderRightWidth: 1,
    borderRightColor: '#e5e7eb',
    marginRight: 16,
  },
  averageValue: { fontSize: 32, fontWeight: '700', color: '#111827' },
  totalText: { fontSize: 11, color: '#9ca3af', marginTop: 4 },
  summaryRight: { flex: 1, justifyContent: 'center' },
  breakdownRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4, gap: 4 },
  breakdownStar: { fontSize: 11, color: '#6b7280', width: 8 },
  breakdownBarBg: {
    flex: 1,
    height: 5,
    backgroundColor: '#e5e7eb',
    borderRadius: 3,
    marginLeft: 4,
    overflow: 'hidden',
  },
  breakdownBarFill: { height: '100%', backgroundColor: '#f59e0b', borderRadius: 3 },
  reviewCard: {
    backgroundColor: '#f9fafb',
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
  },
  reviewHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#1E40AF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  avatarText: { color: '#fff', fontWeight: '700', fontSize: 14 },
  userName: { fontSize: 13, fontWeight: '700', color: '#111827' },
  reviewMeta: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 3 },
  reviewDate: { fontSize: 11, color: '#9ca3af' },
  reviewComment: { fontSize: 13, color: '#374151', lineHeight: 19 },
  footer: { padding: 16, borderTopWidth: 1, borderTopColor: '#f0f0f0' },
  writeButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#22c55e',
    paddingVertical: 14,
    borderRadius: 14,
  },
  writeButtonText: { color: '#fff', fontWeight: '700', fontSize: 15 },
});

export default ReviewListScreen;
