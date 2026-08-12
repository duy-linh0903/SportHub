import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TextInput, 
  TouchableOpacity,
  Modal,
  FlatList,
  ActivityIndicator,
  Image,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { sportCentersApi } from '../api/sportCentersApi';
import { reviewsApi } from '../api/reviewsApi';
import { SportCenterResponseDto } from '../types/api';

// Dummy danh sách khu vực - sau này thay bằng API lấy theo vị trí GPS
const LOCATIONS = [
  'Quận 1, TP. HCM',
  'Quận 2, TP. HCM',
  'Quận 3, TP. HCM',
  'Quận 4, TP. HCM',
  'Quận 5, TP. HCM',
  'Quận 6, TP. HCM',
  'Quận 7, TP. HCM',
  'Quận 8, TP. HCM',
  'Quận 9, TP. HCM',
  'Quận 10, TP. HCM',
  'Quận 11, TP. HCM',
  'Quận 12, TP. HCM',
  'Thành phố Thủ Đức',
  'Quận Bình Thạnh',
  'Quận Phú Nhuận',
  'Quận Gò Vấp',
  'Quận Tân Bình',
  'Quận Tân Phú',
  'Quận Bình Tân',
  'Huyện Bình Chánh',
  'Huyện Hóc Môn',
  'Huyện Củ Chi',
  'Huyện Nhà Bè',
  'Huyện Cần Giờ'
];

const SPORT_CATEGORIES = [
  { id: 'football', name: 'Bóng đá', icon: 'football-outline', keywords: ['bóng đá', 'cỏ nhân tạo', 'chảo lửa', 'arena'] },
  { id: 'tennis', name: 'Tennis', icon: 'tennisball-outline', keywords: ['tennis', 'quần vợt', 'đất nện', 'lan anh'] },
  { id: 'basketball', name: 'Bóng rổ', icon: 'basketball-outline', keywords: ['bóng rổ', 'hoop'] },
  { id: 'badminton', name: 'Cầu lông', icon: 'stopwatch-outline', keywords: ['cầu lông'] },
  { id: 'swimming', name: 'Bơi lội', icon: 'water-outline', keywords: ['bơi', 'hồ bơi', 'yết kiêu'] },
  { id: 'volleyball', name: 'Bóng chuyền', icon: 'baseball-outline', keywords: ['bóng chuyền'] },
  { id: 'golf', name: 'Golf', icon: 'golf-outline', keywords: ['golf'] },
  { id: 'pingpong', name: 'Bóng bàn', icon: 'disc-outline', keywords: ['bóng bàn'] },
];

const HomeScreen = ({ navigation }: { navigation: any }) => {
  const [selectedLocation, setSelectedLocation] = useState(LOCATIONS[0]);
  const [locationModalVisible, setLocationModalVisible] = useState(false);
  const [sportCenters, setSportCenters] = useState<SportCenterResponseDto[]>([]);
  const [ratings, setRatings] = useState<Record<string, number>>({});
  const [loadingCenters, setLoadingCenters] = useState(true);
  const [selectedSport, setSelectedSport] = useState<string | null>(null);

  const filteredCenters = !selectedSport 
    ? sportCenters 
    : sportCenters.filter(center => {
        const cat = SPORT_CATEGORIES.find(c => c.id === selectedSport);
        if (!cat) return true;
        const text = ((center.name || '') + ' ' + (center.description || '')).toLowerCase();
        return cat.keywords.some(kw => text.includes(kw));
      });

  useEffect(() => {
    fetchSportCenters();
  }, []);

  const fetchSportCenters = async () => {
    setLoadingCenters(true);
    try {
      const data = await sportCentersApi.getAll();
      setSportCenters(data);
      
      // Fetch ratings for all centers
      const ratingsData: Record<string, number> = {};
      await Promise.all(
        data.map(async (center) => {
          try {
            const reviews = await reviewsApi.getBySportCenter(center.sportCenterId);
            const count = reviews.length;
            ratingsData[center.sportCenterId] = count > 0 
              ? reviews.reduce((sum, r) => sum + r.rating, 0) / count 
              : 0;
          } catch (e) {
            ratingsData[center.sportCenterId] = 0;
          }
        })
      );
      setRatings(ratingsData);
    } catch (error) {
      console.error('Failed to fetch sport centers:', error);
    } finally {
      setLoadingCenters(false);
    }
  };

  const handleSelectLocation = (loc: string) => {
    setSelectedLocation(loc);
    setLocationModalVisible(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* 1. Header: Vị trí & Thông báo */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.locationContainer}
            onPress={() => setLocationModalVisible(true)}
          >
            <Ionicons name="location" size={20} color="#22c55e" />
            <Text style={styles.locationText}>{selectedLocation}</Text>
            <Ionicons name="chevron-down" size={16} color="#666" />
          </TouchableOpacity>
          <View style={styles.headerRight}>
            <TouchableOpacity
              style={styles.headerBtn}
              onPress={() => navigation.navigate('Map')}
            >
              <Ionicons name="map-outline" size={24} color="#333" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.notificationBtn}
              onPress={() => navigation.navigate('Notification')}
            >
              <Ionicons name="notifications-outline" size={24} color="#333" />
              <View style={styles.notificationDot} />
            </TouchableOpacity>
          </View>
        </View>

        {/* 2. Thanh tìm kiếm - bấm vào sẽ mở màn hình Tìm kiếm */}
        <TouchableOpacity
          style={styles.searchContainer}
          activeOpacity={0.8}
          onPress={() => navigation.navigate('Search')}
        >
          <Ionicons name="search-outline" size={20} color="#666" style={styles.searchIcon} />
          <TextInput 
            style={styles.searchInput} 
            placeholder="Tìm tên sân bóng, khu vực..." 
            placeholderTextColor="#999"
            editable={false}
            pointerEvents="none"
          />
        </TouchableOpacity>

        {/* 3. Banner Khuyến mãi */}
        <View style={styles.bannerContainer}>
          <View style={styles.bannerContent}>
            <Text style={styles.bannerTitle}>Giảm 20% Đặt sân sáng sớm</Text>
            <Text style={styles.bannerSub}>Áp dụng từ 5h00 - 8h00 hằng ngày</Text>
          </View>
        </View>

        {/* 4. Danh mục Môn thể thao */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Môn thể thao</Text>
        </View>
        <View style={styles.categoryGrid}>
          {SPORT_CATEGORIES.map(cat => {
            const isActive = selectedSport === cat.id;
            return (
              <TouchableOpacity 
                key={cat.id} 
                style={[styles.categoryItem, isActive && styles.categoryItemActive]} 
                onPress={() => setSelectedSport(isActive ? null : cat.id)}
              >
                <View style={[styles.categoryIconBox, isActive && styles.categoryIconBoxActive]}>
                  <Ionicons name={cat.icon} size={24} color={isActive ? '#ffffff' : '#333'} />
                </View>
                <Text style={[styles.categoryText, isActive && styles.categoryTextActive]}>{cat.name}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* 5. Sân nổi bật */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Sân Thể Thao Phổ Biến</Text>
          <TouchableOpacity onPress={() => navigation.navigate('VenueList')}>
            <Text style={styles.seeAllText}>Xem tất cả</Text>
          </TouchableOpacity>
        </View>
        
        {loadingCenters ? (
          <ActivityIndicator size="large" color="#006e2f" style={{ marginVertical: 20 }} />
        ) : (
          <View style={styles.venueList}>
            {filteredCenters.length > 0 ? (
              filteredCenters.map((center) => (
                <TouchableOpacity 
                  key={center.sportCenterId} 
                  style={styles.venueCard}
                  activeOpacity={0.9}
                  onPress={() => navigation.navigate('Detail', { sportCenterId: center.sportCenterId })}
                >
                  <View style={styles.venueImagePlaceholder}>
                    {center.images && center.images.length > 0 && center.images[0].url ? (
                      <Image source={{ uri: center.images[0].url }} style={StyleSheet.absoluteFill} resizeMode="cover" />
                    ) : (
                      <Text style={styles.imageText}>Ảnh {center.name}</Text>
                    )}
                    <View style={styles.ratingBadge}>
                      <Ionicons name="star" size={12} color="#F97316" />
                      <Text style={styles.ratingText}>
                        {ratings[center.sportCenterId] > 0 ? ratings[center.sportCenterId].toFixed(1) : '0'}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.venueInfo}>
                    <Text style={styles.venueName} numberOfLines={2}>
                      {center.name}
                    </Text>
                    <Text style={styles.venueAddress} numberOfLines={2}>
                      <Ionicons name="location-outline" size={12} color="#666" /> {center.address}
                    </Text>
                    <View style={styles.priceRow}>
                      <Text style={styles.venuePrice}>{center.minPrice ? `${center.minPrice.toLocaleString('vi-VN')}đ` : 'Đang cập nhật'}<Text style={styles.priceUnit}>{center.minPrice ? '/giờ' : ''}</Text></Text>
                      <View style={styles.statusBadge}>
                        <Text style={styles.statusText}>Còn sân</Text>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              ))
            ) : (
              <Text style={{ color: '#666' }}>Không có sân nào.</Text>
            )}
          </View>
        )}

      </ScrollView>

      {/* Modal chọn khu vực */}
      <Modal
        visible={locationModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setLocationModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setLocationModalVisible(false)}
        >
          <View style={styles.modalSheet}>
            <View style={styles.modalHandle} />
            <Text style={styles.modalTitle}>Chọn khu vực</Text>
            <FlatList
              data={LOCATIONS}
              keyExtractor={(item) => item}
              renderItem={({ item }) => {
                const isSelected = item === selectedLocation;
                return (
                  <TouchableOpacity
                    style={styles.locationOption}
                    onPress={() => handleSelectLocation(item)}
                  >
                    <Ionicons
                      name={isSelected ? 'location' : 'location-outline'}
                      size={18}
                      color={isSelected ? '#22c55e' : '#666'}
                    />
                    <Text style={[styles.locationOptionText, isSelected && styles.locationOptionTextActive]}>
                      {item}
                    </Text>
                    {isSelected && <Ionicons name="checkmark" size={18} color="#22c55e" />}
                  </TouchableOpacity>
                );
              }}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  scrollContent: {
    paddingBottom: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 16,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  locationText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerBtn: {
    padding: 4,
  },
  notificationBtn: {
    position: 'relative',
    padding: 4,
  },
  notificationDot: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 10,
    height: 10,
    backgroundColor: '#ba1a1a',
    borderRadius: 5,
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f2f4f6',
    marginHorizontal: 20,
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 48,
    marginBottom: 20,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#333',
  },
  bannerContainer: {
    marginHorizontal: 20,
    height: 140,
    backgroundColor: '#22c55e',
    borderRadius: 16,
    marginBottom: 24,
    justifyContent: 'center',
    padding: 20,
    overflow: 'hidden',
  },
  bannerContent: {
    width: '70%',
  },
  bannerTitle: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    lineHeight: 28,
  },
  bannerSub: {
    color: '#ffffff',
    fontSize: 12,
    opacity: 0.9,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#191c1e',
  },
  seeAllText: {
    fontSize: 14,
    color: '#22c55e',
    fontWeight: '600',
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  categoryItem: {
    width: '22%', // Allows 4 items per row with space-between
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  categoryItemActive: {
    opacity: 1,
  },
  categoryIconBox: {
    width: 60,
    height: 60,
    backgroundColor: '#f2f4f6',
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryIconBoxActive: {
    backgroundColor: '#22c55e',
  },
  categoryText: {
    fontSize: 13,
    color: '#333',
    fontWeight: '500',
  },
  categoryTextActive: {
    color: '#22c55e',
    fontWeight: 'bold',
  },
  venueList: {
    paddingHorizontal: 20,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingBottom: 20,
  },
  venueCard: {
    width: '48%',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 16,
    borderColor: '#e6e8ea',
    shadowColor: '#1e40af',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  venueImagePlaceholder: {
    height: 120,
    backgroundColor: '#6d7b6c',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  imageText: {
    color: '#fff',
    fontWeight: 'bold',
    opacity: 0.5,
  },
  ratingBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(0,0,0,0.6)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
  },
  ratingText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  venueInfo: {
    padding: 12,
  },
  venueName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 4,
    lineHeight: 20,
  },
  venueAddress: {
    fontSize: 12,
    color: '#666',
    marginBottom: 12,
    lineHeight: 18,
  },
  priceRow: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: 6,
  },
  venuePrice: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#006e2f',
  },
  priceUnit: {
    fontSize: 12,
    color: '#666',
    fontWeight: 'normal',
  },
  statusBadge: {
    backgroundColor: '#e6f4ea',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  statusText: {
    color: '#22c55e',
    fontSize: 12,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 32,
    maxHeight: '60%',
  },
  modalHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#e2e8f0',
    alignSelf: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 12,
  },
  locationOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#f2f4f6',
  },
  locationOptionText: {
    flex: 1,
    fontSize: 14,
    color: '#333',
  },
  locationOptionTextActive: {
    color: '#1a1a1a',
    fontWeight: '700',
  },
});

export default HomeScreen;
