import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity,
  ActivityIndicator,
  Image
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { sportCentersApi } from '../api/sportCentersApi';
import { SportCenterResponseDto } from '../types/api';

// Categories can be kept static or fetched from somewhere else if needed
const CATEGORIES = ['Tất cả', 'Bóng đá', 'Cầu lông', 'Bóng rổ', 'Tennis'];

const VenueListScreen = ({ navigation }: { navigation: any }) => {
  const [activeCategory, setActiveCategory] = useState('Tất cả');
  const [sportCenters, setSportCenters] = useState<SportCenterResponseDto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSportCenters();
  }, []);

  const fetchSportCenters = async () => {
    setLoading(true);
    try {
      const data = await sportCentersApi.getAll();
      setSportCenters(data);
    } catch (error) {
      console.error('Failed to fetch sport centers:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderVenueCard = ({ item }: { item: SportCenterResponseDto }) => (
    <TouchableOpacity 
      style={styles.card} 
      activeOpacity={0.9}
      onPress={() => navigation.navigate('Detail', { sportCenterId: item.sportCenterId })}
    >
      <View style={[styles.imagePlaceholder]}>
        {item.images && item.images.length > 0 && item.images[0].url && (
          <Image 
            source={{ uri: item.images[0].url }} 
            style={StyleSheet.absoluteFill} 
            resizeMode="cover" 
          />
        )}
        <View style={styles.badgeContainer}>
          <View style={[styles.statusBadge]}>
            <Text style={[styles.statusText]}>
              Còn sân
            </Text>
          </View>
          <View style={styles.ratingBadge}>
            <Ionicons name="star" size={12} color="#F97316" />
            <Text style={styles.ratingText}>4.5 <Text style={styles.reviewText}>(100 đánh giá)</Text></Text>
          </View>
        </View>
      </View>

      <View style={styles.cardInfo}>
        <View style={styles.cardHeader}>
          <Text style={styles.venueName} numberOfLines={1}>{item.name}</Text>
          <Text style={styles.venuePrice}>{item.minPrice ? `${item.minPrice.toLocaleString('vi-VN')}đ` : 'Đang cập nhật'}<Text style={styles.priceUnit}>{item.minPrice ? '/giờ' : ''}</Text></Text>
        </View>
        
        <View style={styles.addressRow}>
          <Ionicons name="location-outline" size={14} color="#666" />
          <Text style={styles.addressText} numberOfLines={1}>{item.address}</Text>
        </View>
        
        <View style={styles.footerRow}>
          <View style={styles.amenities}>
            <Ionicons name="car-outline" size={16} color="#1E40AF" style={styles.amenityIcon} />
            <Ionicons name="wifi-outline" size={16} color="#1E40AF" style={styles.amenityIcon} />
            <Ionicons name="cafe-outline" size={16} color="#1E40AF" style={styles.amenityIcon} />
          </View>
          <TouchableOpacity style={styles.bookButton} onPress={() => navigation.navigate('Detail', { sportCenterId: item.sportCenterId })}>
            <Text style={styles.bookButtonText}>Đặt ngay</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* 1. Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#1a1a1a" />
        </TouchableOpacity>
        <View style={styles.locationTitle}>
          <Text style={styles.headerSubtitle}>Vị trí hiện tại</Text>
          <Text style={styles.headerTitle}>TP. Hồ Chí Minh</Text>
        </View>
        <TouchableOpacity style={styles.filterButton}>
          <Ionicons name="options-outline" size={24} color="#1a1a1a" />
        </TouchableOpacity>
      </View>

      {/* 2. Thanh lọc Danh mục */}
      <View style={styles.categoryWrapper}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={CATEGORIES}
          keyExtractor={(item) => item}
          contentContainerStyle={styles.categoryList}
          renderItem={({ item }) => {
            const isActive = activeCategory === item;
            return (
              <TouchableOpacity 
                style={[styles.categoryChip, isActive && styles.categoryChipActive]}
                onPress={() => setActiveCategory(item)}
              >
                <Text style={[styles.categoryChipText, isActive && styles.categoryChipTextActive]}>
                  {item}
                </Text>
              </TouchableOpacity>
            );
          }}
        />
      </View>

      {/* 3. Danh sách Sân */}
      {loading ? (
        <ActivityIndicator size="large" color="#006e2f" style={{ marginTop: 50 }} />
      ) : (
        <FlatList
          data={sportCenters}
          keyExtractor={(item) => item.sportCenterId}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          renderItem={renderVenueCard}
          ListEmptyComponent={() => (
            <Text style={{ textAlign: 'center', marginTop: 20, color: '#666' }}>Không có sân nào.</Text>
          )}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f2f4f6' }, // Màu nền xám nhạt để làm nổi bật thẻ sân
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#ffffff',
  },
  backButton: { padding: 4 },
  locationTitle: { alignItems: 'center' },
  headerSubtitle: { fontSize: 12, color: '#666' },
  headerTitle: { fontSize: 16, fontWeight: 'bold', color: '#1a1a1a' },
  filterButton: { padding: 4 },
  categoryWrapper: { backgroundColor: '#ffffff', paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: '#e0e3e5' },
  categoryList: { paddingHorizontal: 16, gap: 8 },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f2f4f6',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  categoryChipActive: {
    backgroundColor: '#1E40AF', // Deep Sporty Blue
    borderColor: '#1E40AF',
  },
  categoryChipText: { fontSize: 14, color: '#666', fontWeight: '500' },
  categoryChipTextActive: { color: '#ffffff', fontWeight: 'bold' },
  listContent: { padding: 16, gap: 16 },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#e0e3e5',
    elevation: 4,
    shadowColor: '#1e40af',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
  },
  imagePlaceholder: { height: 160, backgroundColor: '#6d7b6c', padding: 12 },
  badgeContainer: { flexDirection: 'row', justifyContent: 'space-between' },
  statusBadge: { backgroundColor: '#e6f4ea', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, alignSelf: 'flex-start' },
  statusBadgeFull: { backgroundColor: '#ffe4e6' },
  statusText: { color: '#22c55e', fontSize: 12, fontWeight: 'bold' },
  statusTextFull: { color: '#e11d48' },
  ratingBadge: { backgroundColor: 'rgba(0,0,0,0.6)', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, gap: 4 },
  ratingText: { color: '#fff', fontSize: 12, fontWeight: 'bold' },
  reviewText: { fontWeight: 'normal', fontSize: 11 },
  cardInfo: { padding: 16 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 },
  venueName: { flex: 1, fontSize: 18, fontWeight: 'bold', color: '#1a1a1a', marginRight: 8 },
  venuePrice: { fontSize: 16, fontWeight: 'bold', color: '#006e2f' },
  priceUnit: { fontSize: 12, color: '#666', fontWeight: 'normal' },
  addressRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  addressText: { fontSize: 13, color: '#666', marginLeft: 4, flex: 1 },
  footerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderTopWidth: 1, borderTopColor: '#f2f4f6', paddingTop: 12 },
  amenities: { flexDirection: 'row', gap: 12 },
  amenityIcon: { backgroundColor: '#f8fafc', padding: 6, borderRadius: 8 },
  bookButton: { backgroundColor: '#22c55e', paddingHorizontal: 20, paddingVertical: 8, borderRadius: 8 },
  bookButtonText: { color: '#ffffff', fontSize: 14, fontWeight: 'bold' },
});

export default VenueListScreen;