import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { reviewsApi } from '../api/reviewsApi';
import { ReviewResponseDto } from '../types/api';
import { useIsFocused } from '@react-navigation/native';

const AdminReviewListScreen = ({ navigation }: { navigation: any }) => {
  const [reviews, setReviews] = useState<ReviewResponseDto[]>([]);
  const [loading, setLoading] = useState(true);
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      loadReviews();
    }
  }, [isFocused]);

  const loadReviews = async () => {
    setLoading(true);
    try {
      const data = await reviewsApi.getByOwner();
      // Sort by newest first
      data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setReviews(data);
    } catch (error) {
      console.error('Failed to load reviews', error);
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Ionicons
          key={i}
          name={i <= rating ? 'star' : 'star-outline'}
          size={16}
          color="#FFD700"
        />
      );
    }
    return <View style={{ flexDirection: 'row' }}>{stars}</View>;
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 5 }}>
          <Ionicons name="arrow-back" size={24} color="#0f172a" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Đánh giá của khách</Text>
        <View style={{ width: 24 }} />
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#22c55e" />
        </View>
      ) : (
        <FlatList
          data={reviews}
          keyExtractor={(item, index) => item.userId + item.sportCenterId + index}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Ionicons name="chatbubble-ellipses-outline" size={48} color="#d1d5db" />
              <Text style={styles.emptyText}>Chưa có đánh giá nào</Text>
            </View>
          }
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <View style={styles.userInfo}>
                  <View style={styles.avatar}>
                    <Text style={styles.avatarText}>
                      {(item.userName || 'K').charAt(0).toUpperCase()}
                    </Text>
                  </View>
                  <View>
                    <Text style={styles.userName}>{item.userName || 'Khách hàng'}</Text>
                    <Text style={styles.dateText}>
                      {new Date(item.createdAt).toLocaleDateString('vi-VN')}
                    </Text>
                  </View>
                </View>
                {renderStars(item.rating)}
              </View>
              <Text style={styles.sportCenterName}>Khu: {item.sportCenterName || 'Khu thể thao'}</Text>
              {item.comment ? (
                <Text style={styles.commentText}>{item.comment}</Text>
              ) : (
                <Text style={[styles.commentText, { fontStyle: 'italic', color: '#94a3b8' }]}>
                  (Không có bình luận)
                </Text>
              )}
            </View>
          )}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#0f172a' },
  list: { padding: 16 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  userInfo: { flexDirection: 'row', alignItems: 'center' },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#e2e8f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: { fontSize: 16, fontWeight: '700', color: '#64748b' },
  userName: { fontSize: 15, fontWeight: '600', color: '#0f172a' },
  dateText: { fontSize: 12, color: '#64748b', marginTop: 2 },
  sportCenterName: { fontSize: 13, fontWeight: '600', color: '#22c55e', marginBottom: 8 },
  commentText: { fontSize: 14, color: '#334155', lineHeight: 20 },
  emptyState: { alignItems: 'center', marginTop: 60 },
  emptyText: { fontSize: 15, color: '#94a3b8', marginTop: 12 },
});

export default AdminReviewListScreen;
