import React from 'react';
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

const DUMMY_REVIEWS: Review[] = [
  {
    id: 'RV01',
    userName: 'Nguyễn Văn An',
    rating: 5,
    date: '20 Thg 10, 2023',
    comment: 'Sân đẹp, ánh sáng tốt, nhân viên hỗ trợ nhiệt tình. Chắc chắn sẽ quay lại.',
  },
  {
    id: 'RV02',
    userName: 'Trần Thị Bình',
    rating: 4,
    date: '15 Thg 10, 2023',
    comment: 'Sân ổn, giá hợp lý. Bãi giữ xe hơi nhỏ vào giờ cao điểm.',
  },
  {
    id: 'RV03',
    userName: 'Lê Hoàng Cường',
    rating: 5,
    date: '02 Thg 10, 2023',
    comment: 'Mặt sân mới, chơi rất thích. Có dịch vụ thuê trọng tài khá tiện.',
  },
  {
    id: 'RV04',
    userName: 'Phạm Thu Hà',
    rating: 3,
    date: '28 Thg 9, 2023',
    comment: 'Bình thường, phòng thay đồ hơi chật.',
  },
];

const AVERAGE_RATING = 4.5;
const TOTAL_REVIEWS = 124;
const RATING_BREAKDOWN = [
  { star: 5, percent: 0.68 },
  { star: 4, percent: 0.2 },
  { star: 3, percent: 0.08 },
  { star: 2, percent: 0.03 },
  { star: 1, percent: 0.01 },
];

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
  const fieldName = route?.params?.fieldName || 'Sân Cầu Lông SportHub A1';

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
        data={DUMMY_REVIEWS}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <View style={styles.summaryBox}>
            <View style={styles.summaryLeft}>
              <Text style={styles.averageValue}>{AVERAGE_RATING}</Text>
              <Stars rating={Math.round(AVERAGE_RATING)} size={14} />
              <Text style={styles.totalText}>{TOTAL_REVIEWS} đánh giá</Text>
            </View>
            <View style={styles.summaryRight}>
              {RATING_BREAKDOWN.map((r) => (
                <View key={r.star} style={styles.breakdownRow}>
                  <Text style={styles.breakdownStar}>{r.star}</Text>
                  <Ionicons name="star" size={10} color="#f59e0b" />
                  <View style={styles.breakdownBarBg}>
                    <View
                      style={[styles.breakdownBarFill, { width: `${r.percent * 100}%` }]}
                    />
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
                <Text style={styles.avatarText}>{item.userName.charAt(0)}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.userName}>{item.userName}</Text>
                <View style={styles.reviewMeta}>
                  <Stars rating={item.rating} />
                  <Text style={styles.reviewDate}>{item.date}</Text>
                </View>
              </View>
            </View>
            <Text style={styles.reviewComment}>{item.comment}</Text>
          </View>
        )}
      />

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.writeButton}
          onPress={() => navigation.navigate('WriteReview', { field: { name: fieldName } })}
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
