import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';

const RATING_LABELS: Record<number, string> = {
  1: 'Rất tệ',
  2: 'Tệ',
  3: 'Bình thường',
  4: 'Tốt',
  5: 'Tuyệt vời',
};

const WriteReviewScreen = ({ navigation, route }: { navigation: any; route: any }) => {
  const field = route?.params?.field || { name: 'Sân chưa xác định', sportCenterId: '' };
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const canSubmit = rating > 0 && comment.trim().length > 0 && !submitting;

  const handleSubmit = async () => {
    if (!field.sportCenterId) {
      Alert.alert('Thông báo', 'Không tìm thấy ID sân để đánh giá.');
      return;
    }
    setSubmitting(true);
    try {
      const { reviewsApi } = await import('../api/reviewsApi');
      const { useAuthStore } = await import('../store/useAuthStore');
      const userId = useAuthStore.getState().userId;
      
      if (!userId) {
        Alert.alert('Thông báo', 'Vui lòng đăng nhập để đánh giá.');
        setSubmitting(false);
        return;
      }

      if (!route?.params?.bookingId) {
        Alert.alert('Thông báo', 'Không tìm thấy thông tin vé đặt sân. Bạn chỉ có thể đánh giá từ màn hình chi tiết vé đã hoàn thành.');
        setSubmitting(false);
        return;
      }

      await reviewsApi.create({
        userId,
        sportCenterId: field.sportCenterId,
        bookingId: route.params.bookingId,
        rating,
        comment,
      });
      Alert.alert('Thông báo', 'Đánh giá của bạn đã được gửi!');
      navigation.goBack();
    } catch (error: any) {
      console.error('Error submitting review', error);
      const errorMsg = error.response?.data?.message || 'Gửi đánh giá thất bại. Vui lòng thử lại sau.';
      Alert.alert('Thông báo', errorMsg);
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={26} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Viết đánh giá</Text>
        <View style={{ width: 26 }} />
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.content}>
          <View style={styles.fieldCard}>
            <View style={styles.fieldThumb}>
              <Ionicons name="tennisball-outline" size={22} color="#22c55e" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.fieldName}>{field.name}</Text>
              <Text style={styles.fieldDate}>{field.date}</Text>
            </View>
          </View>

          <Text style={styles.sectionLabel}>Bạn đánh giá sân này thế nào?</Text>
          <View style={styles.starsRow}>
            {[1, 2, 3, 4, 5].map((star) => (
              <TouchableOpacity key={star} onPress={() => setRating(star)}>
                <Ionicons
                  name={star <= rating ? 'star' : 'star-outline'}
                  size={38}
                  color={star <= rating ? '#f59e0b' : '#d1d5db'}
                  style={{ marginHorizontal: 4 }}
                />
              </TouchableOpacity>
            ))}
          </View>
          {rating > 0 && (
            <Text style={styles.ratingLabel}>{RATING_LABELS[rating]}</Text>
          )}

          <Text style={styles.sectionLabel}>Nhận xét của bạn</Text>
          <TextInput
            style={styles.textArea}
            placeholder="Chia sẻ cảm nhận của bạn về sân, dịch vụ, tiện ích..."
            placeholderTextColor="#9ca3af"
            multiline
            numberOfLines={6}
            textAlignVertical="top"
            value={comment}
            onChangeText={setComment}
            maxLength={500}
          />
          <Text style={styles.charCount}>{comment.length}/500</Text>
        </View>
      </KeyboardAvoidingView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.submitButton, !canSubmit && styles.submitButtonDisabled]}
          disabled={!canSubmit}
          onPress={handleSubmit}
        >
          <Text style={styles.submitButtonText}>Gửi đánh giá</Text>
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
  headerTitle: { fontSize: 16, fontWeight: '600', color: '#111827' },
  content: { padding: 16 },
  fieldCard: {
    flexDirection: 'row',
    backgroundColor: '#f9fafb',
    borderRadius: 14,
    padding: 12,
    marginBottom: 24,
  },
  fieldThumb: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#dcfce7',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  fieldName: { fontSize: 14, fontWeight: '700', color: '#111827' },
  fieldDate: { fontSize: 12, color: '#6b7280', marginTop: 2 },
  sectionLabel: { fontSize: 14, fontWeight: '600', color: '#111827', marginBottom: 12 },
  starsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 8,
  },
  ratingLabel: {
    textAlign: 'center',
    fontSize: 13,
    fontWeight: '600',
    color: '#f59e0b',
    marginBottom: 24,
  },
  textArea: {
    backgroundColor: '#f9fafb',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    padding: 14,
    fontSize: 13,
    color: '#111827',
    minHeight: 140,
  },
  charCount: {
    alignSelf: 'flex-end',
    fontSize: 11,
    color: '#9ca3af',
    marginTop: 6,
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  submitButton: {
    backgroundColor: '#22c55e',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
  },
  submitButtonDisabled: { backgroundColor: '#d1d5db' },
  submitButtonText: { color: '#fff', fontWeight: '700', fontSize: 15 },
});

export default WriteReviewScreen;
