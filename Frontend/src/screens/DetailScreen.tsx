import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
  Image,
  Share,
  Alert
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../App';
import { sportCentersApi } from '../api/sportCentersApi';
import { fieldsApi } from '../api/fieldsApi';
import { reviewsApi } from '../api/reviewsApi';
import { favoritesApi } from '../api/favoritesApi';
import { SportCenterResponseDto, FieldResponseDto } from '../types/api';

type DetailScreenRouteProp = RouteProp<RootStackParamList, 'Detail'>;
type DetailScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Detail'>;

type Props = {
  route: DetailScreenRouteProp;
  navigation: DetailScreenNavigationProp;
};

const DetailScreen = ({ route, navigation }: Props) => {
  const sportCenterId = route.params?.sportCenterId;
  const [sportCenter, setSportCenter] = useState<SportCenterResponseDto | null>(null);
  const [fields, setFields] = useState<FieldResponseDto[]>([]);
  const [ratingInfo, setRatingInfo] = useState({ avg: 0, count: 0 });
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    if (sportCenterId) {
      fetchData();
    }
  }, [sportCenterId]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const centerData = await sportCentersApi.getById(sportCenterId!);
      setSportCenter(centerData);
      
      const fieldsData = await fieldsApi.getBySportCenter(sportCenterId!);
      setFields(fieldsData);
      
      const reviews = await reviewsApi.getBySportCenter(sportCenterId!);
      const count = reviews.length;
      const avg = count > 0 ? reviews.reduce((sum, r) => sum + r.rating, 0) / count : 0;
      setRatingInfo({ avg, count });

      // Load favorite status
      try {
        const favoriteStatus = await favoritesApi.checkIsFavorite(sportCenterId!);
        setIsFavorite(favoriteStatus);
      } catch (favErr) {
        console.warn('Could not check favorite status', favErr);
      }
    } catch (error) {
      console.error('Failed to fetch detail', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#006e2f" />
      </SafeAreaView>
    );
  }

  if (!sportCenter) {
    return (
      <SafeAreaView style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text>Không tìm thấy thông tin sân.</Text>
        <TouchableOpacity style={{ marginTop: 20 }} onPress={() => navigation.goBack()}>
          <Text style={{ color: '#006e2f' }}>Quay lại</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  // Calculate min price
  const minPrice = fields.length > 0 
    ? Math.min(...fields.map(f => f.pricePerSlot))
    : 0;

  const handleToggleFavorite = async () => {
    try {
      await favoritesApi.toggleFavorite(sportCenterId!);
      setIsFavorite(!isFavorite);
    } catch (error) {
      console.error('Failed to toggle favorite', error);
      Alert.alert('Lỗi', 'Không thể thực hiện. Vui lòng đăng nhập.');
    }
  };

  const handleShare = async () => {
    try {
      const result = await Share.share({
        message: `Khám phá sân thể thao ${sportCenter?.name} tại SportHub!\nĐịa chỉ: ${sportCenter?.address}\nĐặt sân ngay: https://sporthub.vn/center/${sportCenterId}`,
        title: `Chia sẻ ${sportCenter?.name}`
      });
      // You can handle success callbacks if needed
    } catch (error: any) {
      Alert.alert('Lỗi chia sẻ', error.message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent={true} />
      
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* 1. Phần Hình ảnh Cover & Nút Back */}
        <View style={styles.imageContainer}>
          <View style={styles.imagePlaceholder}>
            {sportCenter.images && sportCenter.images.length > 0 && sportCenter.images[0].url ? (
              <Image source={{ uri: sportCenter.images[0].url }} style={StyleSheet.absoluteFill} resizeMode="cover" />
            ) : (
              <Text style={styles.imageText}>Ảnh {sportCenter.name}</Text>
            )}
          </View>
          
          <View style={styles.headerButtons}>
            <TouchableOpacity style={styles.iconButton} onPress={() => navigation.goBack()}>
              <Ionicons name="arrow-back" size={24} color="#fff" />
            </TouchableOpacity>
            <View style={styles.rightButtons}>
              <TouchableOpacity style={styles.iconButton} onPress={handleShare}>
                <Ionicons name="share-social-outline" size={20} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.iconButton} onPress={handleToggleFavorite}>
                <Ionicons name={isFavorite ? "heart" : "heart-outline"} size={20} color={isFavorite ? "#ef4444" : "#fff"} />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* 2. Thông tin cơ bản */}
        <View style={styles.infoSection}>
          <View style={styles.titleRow}>
            <View style={styles.statusBadge}>
              <Text style={styles.statusText}>Còn sân</Text>
            </View>
            <TouchableOpacity
              style={styles.ratingBox}
              onPress={() => navigation.navigate('ReviewList', { fieldName: sportCenter.name, sportCenterId: sportCenter.sportCenterId })}
            >
              <Ionicons name="star" size={14} color="#F97316" />
              <Text style={styles.ratingText}>
                {ratingInfo.avg > 0 ? ratingInfo.avg.toFixed(1) : 'Chưa có'} 
                <Text style={styles.reviewCount}>
                  {ratingInfo.count > 0 ? ` (${ratingInfo.count} đánh giá)` : ''}
                </Text>
              </Text>
              <Ionicons name="chevron-forward" size={14} color="#666" />
            </TouchableOpacity>
          </View>

          <Text style={styles.venueName}>{sportCenter.name}</Text>
          
          <View style={styles.addressRow}>
            <Ionicons name="location-outline" size={16} color="#666" />
            <Text style={styles.addressText}>{sportCenter.address}</Text>
          </View>
        </View>

        {/* 3. Tiện ích sân (Amenities) */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tiện ích có sẵn</Text>
          <View style={styles.amenitiesContainer}>
            <View style={styles.amenityItem}>
              <View style={styles.amenityIconBox}>
                <Ionicons name="car-outline" size={24} color="#1E40AF" />
              </View>
              <Text style={styles.amenityText}>Bãi đỗ xe</Text>
            </View>
            <View style={styles.amenityItem}>
              <View style={styles.amenityIconBox}>
                <Ionicons name="cafe-outline" size={24} color="#1E40AF" />
              </View>
              <Text style={styles.amenityText}>Canteen</Text>
            </View>
            <View style={styles.amenityItem}>
              <View style={styles.amenityIconBox}>
                <Ionicons name="wifi-outline" size={24} color="#1E40AF" />
              </View>
              <Text style={styles.amenityText}>Wifi Miễn phí</Text>
            </View>
            <View style={styles.amenityItem}>
              <View style={styles.amenityIconBox}>
                <Ionicons name="shirt-outline" size={24} color="#1E40AF" />
              </View>
              <Text style={styles.amenityText}>Thuê áo Pitch</Text>
            </View>
          </View>
        </View>

        {/* 4. Mô tả chi tiết */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Mô tả chi tiết</Text>
          <Text style={styles.descriptionText}>
            {sportCenter.description || 'Chưa có mô tả chi tiết.'}
          </Text>
        </View>

        {/* 5. Đánh giá */}
        <View style={styles.section}>
          <View style={styles.reviewSectionHeader}>
            <Text style={styles.sectionTitle}>Đánh giá từ khách hàng</Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('ReviewList', { fieldName: sportCenter.name, sportCenterId: sportCenter.sportCenterId })}
            >
              <Text style={styles.seeAllText}>Xem tất cả</Text>
            </TouchableOpacity>
          </View>

        </View>

      </ScrollView>

      {/* 6. Thanh Booking cố định dưới cùng */}
      <View style={styles.bottomBar}>
        <View style={styles.priceContainer}>
          <Text style={styles.priceLabel}>Giá thuê từ</Text>
          <Text style={styles.priceValue}>{minPrice > 0 ? minPrice.toLocaleString('vi-VN') : '---'}đ<Text style={styles.priceUnit}>/giờ</Text></Text>
        </View>
        <TouchableOpacity style={styles.bookButton} onPress={() => { if (sportCenterId) navigation.navigate('SelectTime', { sportCenterId, sportCenterAddress: sportCenter?.address, sportCenterName: sportCenter?.name }) }}>
          <Text style={styles.bookButtonText}>Đặt sân ngay</Text>
          <Ionicons name="arrow-forward" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ffffff' },
  scrollContent: { paddingBottom: 100 }, // Trừ hao thanh bottom bar
  imageContainer: {
    height: 250,
    position: 'relative',
  },
  imagePlaceholder: {
    flex: 1,
    backgroundColor: '#1E40AF', // Deep Sporty Blue
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageText: { color: '#fff', opacity: 0.5, fontWeight: 'bold' },
  headerButtons: {
    position: 'absolute',
    top: 40, // Khoảng cách cho status bar
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  rightButtons: { flexDirection: 'row', gap: 12 },
  iconButton: {
    width: 40,
    height: 40,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoSection: { padding: 20, borderBottomWidth: 8, borderBottomColor: '#f2f4f6' },
  titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  statusBadge: { backgroundColor: '#e6f4ea', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6 },
  statusText: { color: '#22c55e', fontSize: 12, fontWeight: 'bold' },
  ratingBox: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  ratingText: { fontSize: 14, fontWeight: 'bold', color: '#1a1a1a' },
  reviewCount: { color: '#666', fontWeight: 'normal', fontSize: 12 },
  venueName: { fontSize: 24, fontWeight: 'bold', color: '#191c1e', marginBottom: 12, lineHeight: 32 },
  addressRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 8, marginBottom: 8 },
  addressText: { flex: 1, fontSize: 14, color: '#333', lineHeight: 20 },
  distanceText: { fontSize: 13, color: '#006e2f', fontWeight: '500', marginLeft: 24 },
  section: { padding: 20, borderBottomWidth: 8, borderBottomColor: '#f2f4f6' },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#191c1e', marginBottom: 16 },
  amenitiesContainer: { flexDirection: 'row', justifyContent: 'space-between', flexWrap: 'wrap' },
  amenityItem: { alignItems: 'center', width: '22%' },
  amenityIconBox: { width: 48, height: 48, backgroundColor: '#f8fafc', borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginBottom: 8 },
  amenityText: { fontSize: 12, color: '#333', textAlign: 'center' },
  descriptionText: { fontSize: 14, color: '#666', lineHeight: 22, marginBottom: 8 },
  readMoreText: { color: '#22c55e', fontWeight: 'bold', fontSize: 14 },
  reviewSectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  seeAllText: { color: '#1E40AF', fontWeight: '600', fontSize: 13 },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#e0e3e5',
    elevation: 10, // Bóng cho Android
    shadowColor: '#000', // Bóng cho iOS
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
  },
  priceContainer: { flex: 1 },
  priceLabel: { fontSize: 12, color: '#666', marginBottom: 2 },
  priceValue: { fontSize: 20, fontWeight: 'bold', color: '#006e2f' },
  priceUnit: { fontSize: 14, color: '#666', fontWeight: 'normal' },
  bookButton: {
    backgroundColor: '#22c55e',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
  },
  bookButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});

export default DetailScreen;