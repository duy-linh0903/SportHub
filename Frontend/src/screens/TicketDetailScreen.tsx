import React, { useEffect, useState, useRef } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator, Linking, PermissionsAndroid, Platform, Alert } from 'react-native';
import ViewShot from 'react-native-view-shot';
import { CameraRoll } from '@react-native-camera-roll/camera-roll';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import QRCode from 'react-native-qrcode-svg';
import { bookingsApi } from '../api/bookingsApi';
import { fieldsApi } from '../api/fieldsApi';
import { BookingResponseDto, FieldResponseDto } from '../types/api';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { useAuthStore } from '../store/useAuthStore';

const TicketDetailScreen = ({ navigation, route }: { navigation: any; route: any }) => {
  const { role } = useAuthStore();
  const isAdmin = role === 'Admin';
  const { bookingCode, field: passedField } = route?.params || {};
  
  const [booking, setBooking] = useState<BookingResponseDto | null>(null);
  const [field, setField] = useState<FieldResponseDto | null>(null);
  const [loading, setLoading] = useState(true);
  
  const viewShotRef = useRef<any>(null);

  const requestStoragePermission = async () => {
    if (Platform.OS === 'android') {
      const permission = Platform.Version >= 33 
        ? PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES 
        : PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE;
      
      const hasPermission = await PermissionsAndroid.check(permission);
      if (hasPermission) return true;
      
      const status = await PermissionsAndroid.request(permission);
      return status === 'granted';
    }
    return true; // iOS permission handles implicitly or by library
  };

  const handleSaveToGallery = async () => {
    try {
      const hasPermission = await requestStoragePermission();
      if (!hasPermission) {
        Alert.alert('Lỗi', 'Cần cấp quyền truy cập để lưu ảnh vé.');
        return;
      }
      
      const uri = await viewShotRef.current?.capture();
      if (uri) {
        await CameraRoll.save(uri, { type: 'photo' });
        Alert.alert('Thành công', 'Đã lưu ảnh vé vào thư viện ảnh!');
      }
    } catch (error) {
      console.error('Lỗi khi lưu ảnh:', error);
      Alert.alert('Lỗi', 'Không thể lưu ảnh, vui lòng thử lại.');
    }
  };

  const handleUpdateStatus = (newStatus: string) => {
    Alert.alert(
      'Xác nhận',
      `Bạn có chắc chắn muốn ${newStatus === 'Confirmed' ? 'duyệt' : 'từ chối'} đơn này?`,
      [
        { text: 'Không', style: 'cancel' },
        { 
          text: 'Có', 
          onPress: async () => {
            try {
              if (bookingCode) {
                await bookingsApi.updateStatus(bookingCode, { status: newStatus });
                Alert.alert('Thành công', newStatus === 'Confirmed' ? 'Đã duyệt đơn!' : 'Đã từ chối đơn!');
                fetchData();
              }
            } catch (error) {
              console.error('Lỗi cập nhật trạng thái:', error);
              Alert.alert('Lỗi', 'Không thể cập nhật trạng thái.');
            }
          }
        }
      ]
    );
  };

  const handleCancelBooking = () => {
    Alert.alert(
      'Xác nhận hủy',
      'Bạn có chắc chắn muốn hủy lịch đặt này không?',
      [
        { text: 'Không', style: 'cancel' },
        { 
          text: 'Có', 
          style: 'destructive',
          onPress: async () => {
            try {
              if (bookingCode) {
                await bookingsApi.delete(bookingCode);
                Alert.alert('Thành công', 'Đã hủy lịch đặt sân');
                fetchData();
              }
            } catch (error) {
              console.error('Lỗi khi hủy:', error);
              Alert.alert('Lỗi', 'Không thể hủy lịch đặt, vui lòng thử lại.');
            }
          }
        }
      ]
    );
  };

  useEffect(() => {
    fetchData();
  }, [bookingCode]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (bookingCode) {
        const b = await bookingsApi.getById(bookingCode);
        setBooking(b);
        const f = await fieldsApi.getById(b.fieldId);
        setField(f);
      }
    } catch (error) {
      console.error('Error fetching ticket detail', error);
    } finally {
      setLoading(false);
    }
  };

  let displayDate = passedField?.date || 'N/A';
  if (booking) {
    try { displayDate = format(new Date(booking.bookingDate), 'dd MMMM, yyyy', { locale: vi }); } catch(e) {}
  }

  const finalStatus = booking?.status !== undefined ? booking.status : passedField?.status !== undefined ? passedField.status : 'Pending';
  const normalizedStatus = String(finalStatus).toLowerCase();
  let statusText = 'CHỜ DUYỆT';
  let statusColor = '#F97316';
  let statusBg = '#fff7ed';
  
  if (normalizedStatus === 'confirmed') {
    statusText = 'ĐÃ XÁC NHẬN';
    statusColor = '#16a34a';
    statusBg = '#dcfce7';
  } else if (normalizedStatus === 'cancelled') {
    statusText = 'ĐÃ TỪ CHỐI / HỦY';
    statusColor = '#ba1a1a';
    statusBg = '#fef2f2';
  } else if (normalizedStatus === 'completed') {
    statusText = 'ĐÃ XONG';
    statusColor = '#666';
    statusBg = '#f2f4f6';
  }

  const finalPrice = booking?.totalPrice || passedField?.price || 0;
  const finalVenueName = booking?.sportCenterName || field?.name || passedField?.name || 'Đang tải...';
  const finalAddress = booking?.sportCenterAddress || passedField?.address || 'Đang tải...';
  const finalTime = booking?.timeSlots || passedField?.time || 'N/A';
  const finalFieldType = booking?.fieldName || booking?.fieldType || field?.type || passedField?.fieldNumber || 'N/A';

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#006e2f" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={26} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Chi tiết đặt sân</Text>
        <TouchableOpacity onPress={() => navigation.navigate(isAdmin ? 'AdminTab' : 'MainTab' as never)}>
          <Ionicons name="close-outline" size={28} color="#111827" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={[styles.statusBadge, { backgroundColor: statusBg }]}>
          <Ionicons name="checkmark-circle" size={14} color={statusColor} />
          <Text style={[styles.statusText, { color: statusColor }]}>{statusText}</Text>
        </View>

        <ViewShot ref={viewShotRef} options={{ format: 'jpg', quality: 1.0 }}>
          <View style={styles.ticketCard}>
            <Text style={styles.qrLabel}>MÃ VÉ ĐẶT SÂN</Text>
          <View style={styles.qrWrapper}>
            <QRCode
              value={booking?.checkInCode || bookingCode}
              size={140}
              color="#111827"
              backgroundColor="#fff"
            />
          </View>
          <Text style={styles.bookingCode}>{booking?.checkInCode || bookingCode}</Text>

          <View style={styles.dashedDivider} />

          <View style={styles.infoGrid}>
            <View style={styles.infoCol}>
              <Text style={styles.infoLabel}>Sân số</Text>
              <Text style={styles.infoValue}>{finalFieldType}</Text>
            </View>
            <View style={styles.infoCol}>
              <Text style={styles.infoLabel}>Ngày đặt</Text>
              <Text style={styles.infoValue}>{displayDate}</Text>
            </View>
          </View>
          <View style={styles.infoGrid}>
            <View style={styles.infoCol}>
              <Text style={styles.infoLabel}>Khung giờ</Text>
              <Text style={styles.infoValue}>{finalTime}</Text>
            </View>
          </View>
          <View style={[styles.infoGrid, { marginBottom: 0 }]}>
            <View style={styles.infoCol}>
              <Text style={styles.infoLabel}>Tổng tiền</Text>
              <Text style={[styles.infoValue, { color: '#22c55e', fontSize: 16 }]}>
                {typeof finalPrice === 'number' ? finalPrice.toLocaleString('vi-VN') + 'đ' : finalPrice}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.venueCard}>
          <View style={styles.venueThumb}>
            <Ionicons name="tennisball-outline" size={22} color="#22c55e" />
          </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.venueName}>{finalVenueName}</Text>
              <Text style={styles.venueAddress}>{finalAddress}</Text>
            </View>
          </View>
        </ViewShot>

        <View style={styles.actionRow}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => {
              if (finalAddress && finalAddress !== 'Đang tải...') {
                const targetId = booking?.sportCenterId || passedField?.sportCenterId;
                navigation.navigate('Map', { targetId });
              }
            }}
          >
            <Ionicons name="navigate-outline" size={18} color="#374151" />
            <Text style={styles.actionButtonText}>Chỉ đường</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {!isAdmin ? (
        <View style={styles.footer}>
          <TouchableOpacity style={styles.saveButton} onPress={handleSaveToGallery}>
            <Ionicons name="download-outline" size={18} color="#fff" />
            <Text style={styles.saveButtonText}>Lưu vào ảnh</Text>
          </TouchableOpacity>
          {(finalStatus === 'Pending' || finalStatus === 'pending' || finalStatus === 0) && (
            <TouchableOpacity style={styles.cancelButton} onPress={handleCancelBooking}>
              <Text style={styles.cancelButtonText}>Hủy lịch đặt</Text>
            </TouchableOpacity>
          )}
          {(finalStatus === 'Completed' || finalStatus === 'completed' || finalStatus === 3) && (
            <TouchableOpacity 
              style={styles.reviewButton} 
              onPress={() => navigation.navigate('WriteReview', { 
                field: { name: finalVenueName, sportCenterId: booking?.sportCenterId || passedField?.sportCenterId },
                bookingId: bookingCode 
              })}
            >
              <Ionicons name="create-outline" size={18} color="#22c55e" />
              <Text style={styles.reviewButtonText}>Viết đánh giá</Text>
            </TouchableOpacity>
          )}
        </View>
      ) : (
        (finalStatus === 'Pending' || finalStatus === 'pending' || finalStatus === 0) && (
          <View style={[styles.footer, { flexDirection: 'row', gap: 12 }]}>
            <TouchableOpacity 
              style={[styles.cancelButton, { flex: 1, marginTop: 0, paddingVertical: 14, borderWidth: 1, borderColor: '#ef4444' }]} 
              onPress={() => handleUpdateStatus('Cancelled')}
            >
              <Text style={styles.cancelButtonText}>Từ chối</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.saveButton, { flex: 1 }]} 
              onPress={() => handleUpdateStatus('Confirmed')}
            >
              <Ionicons name="checkmark-outline" size={18} color="#fff" />
              <Text style={styles.saveButtonText}>Duyệt đơn</Text>
            </TouchableOpacity>
          </View>
        )
      )}
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
  scrollContent: { padding: 16, paddingBottom: 24, alignItems: 'center' },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#dcfce7',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 16,
  },
  statusText: { fontSize: 12, fontWeight: '700', color: '#16a34a' },
  ticketCard: {
    width: '100%',
    backgroundColor: '#f9fafb',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginBottom: 16,
  },
  qrLabel: { fontSize: 11, color: '#9ca3af', fontWeight: '700', letterSpacing: 1, marginBottom: 12 },
  qrWrapper: {
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  bookingCode: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
    marginTop: 12,
    letterSpacing: 1,
  },
  dashedDivider: {
    width: '100%',
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor: '#d1d5db',
    marginVertical: 16,
  },
  infoGrid: { flexDirection: 'row', width: '100%', marginBottom: 12 },
  infoCol: { flex: 1 },
  infoLabel: { fontSize: 11, color: '#9ca3af', marginBottom: 4 },
  infoValue: { fontSize: 13, fontWeight: '600', color: '#111827' },
  venueCard: {
    flexDirection: 'row',
    width: '100%',
    backgroundColor: '#f9fafb',
    borderRadius: 14,
    padding: 12,
    marginBottom: 16,
  },
  venueThumb: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#dcfce7',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  venueName: { fontSize: 14, fontWeight: '700', color: '#111827' },
  venueAddress: { fontSize: 12, color: '#6b7280', marginTop: 2 },
  actionRow: { flexDirection: 'row', width: '100%', gap: 12 },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    paddingVertical: 12,
  },
  actionButtonText: { fontSize: 13, fontWeight: '600', color: '#374151' },
  footer: { padding: 16, borderTopWidth: 1, borderTopColor: '#f0f0f0' },
  saveButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#22c55e',
    paddingVertical: 14,
    borderRadius: 14,
  },
  saveButtonText: { color: '#fff', fontWeight: '700', fontSize: 15 },
  cancelButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fee2e2',
    paddingVertical: 14,
    borderRadius: 14,
    marginTop: 12,
  },
  cancelButtonText: { color: '#ef4444', fontWeight: '700', fontSize: 15 },
  reviewButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#fff',
    borderWidth: 1.5,
    borderColor: '#22c55e',
    paddingVertical: 14,
    borderRadius: 14,
    marginTop: 12,
  },
  reviewButtonText: { color: '#22c55e', fontWeight: '700', fontSize: 15 },
});

export default TicketDetailScreen;
