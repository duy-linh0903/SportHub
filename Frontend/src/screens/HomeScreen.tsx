import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TextInput, 
  TouchableOpacity,
  Modal,
  FlatList,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { SafeAreaView } from 'react-native-safe-area-context';

// Dummy danh sách khu vực - sau này thay bằng API lấy theo vị trí GPS
const LOCATIONS = [
  'Quận 1, TP. HCM',
  'Quận 3, TP. HCM',
  'Quận 5, TP. HCM',
  'Quận 7, TP. HCM',
  'Quận 10, TP. HCM',
  'Thành phố Thủ Đức',
];

const HomeScreen = ({ navigation }: { navigation: any }) => {
  const [selectedLocation, setSelectedLocation] = useState(LOCATIONS[0]);
  const [locationModalVisible, setLocationModalVisible] = useState(false);

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
          <TouchableOpacity
            style={styles.notificationBtn}
            onPress={() => navigation.navigate('Notification')}
          >
            <Ionicons name="notifications-outline" size={24} color="#333" />
            <View style={styles.notificationDot} />
          </TouchableOpacity>
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
          <TouchableOpacity><Text style={styles.seeAllText}>Tất cả</Text></TouchableOpacity>
        </View>
        <View style={styles.categoryContainer}>
          <TouchableOpacity style={styles.categoryItem}>
            <View style={styles.categoryIconBox}>
              <Ionicons name="football-outline" size={24} color="#333" />
            </View>
            <Text style={styles.categoryText}>Bóng đá</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.categoryItem}>
            <View style={styles.categoryIconBox}>
              <Ionicons name="tennisball-outline" size={24} color="#333" />
            </View>
            <Text style={styles.categoryText}>Tennis</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.categoryItem}>
            <View style={styles.categoryIconBox}>
              <Ionicons name="basketball-outline" size={24} color="#333" />
            </View>
            <Text style={styles.categoryText}>Bóng rổ</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.categoryItem}>
            <View style={styles.categoryIconBox}>
              <Ionicons name="barbell-outline" size={24} color="#333" />
            </View>
            <Text style={styles.categoryText}>Gym</Text>
          </TouchableOpacity>
        </View>

        {/* 5. Sân nổi bật */}
        <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Sân nổi bật</Text>
            <TouchableOpacity onPress={() => navigation.navigate('VenueList')}>
                <Text style={styles.seeAllText}>Xem thêm</Text>
            </TouchableOpacity>
        </View>
        
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.venueScroll}>
          {/* Card Sân 1 */}
          <TouchableOpacity 
            style={styles.venueCard} 
            activeOpacity={0.9}
            onPress={() => navigation.navigate('Detail')}
          >
            <View style={styles.venueImagePlaceholder}>
              <Text style={styles.imageText}>Ảnh Sân Bóng</Text>
              <View style={styles.ratingBadge}>
                <Ionicons name="star" size={12} color="#F97316" />
                <Text style={styles.ratingText}>4.8</Text>
              </View>
            </View>
            <View style={styles.venueInfo}>
              <Text style={styles.venueName} numberOfLines={1}>Sân bóng Đại Thế Giới</Text>
              <Text style={styles.venueAddress} numberOfLines={1}>Quận 5 • 2.5km</Text>
              <View style={styles.priceRow}>
                <Text style={styles.venuePrice}>250.000đ<Text style={styles.priceUnit}>/giờ</Text></Text>
                <View style={styles.statusBadge}>
                  <Text style={styles.statusText}>Còn sân</Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>

          {/* Card Sân 2 */}
          <TouchableOpacity 
            style={styles.venueCard} 
            activeOpacity={0.9}
            onPress={() => navigation.navigate('Detail')}
          >
            <View style={[styles.venueImagePlaceholder, { backgroundColor: '#3755c3' }]}>
              <Text style={styles.imageText}>Ảnh Sân Cầu Lông</Text>
              <View style={styles.ratingBadge}>
                <Ionicons name="star" size={12} color="#F97316" />
                <Text style={styles.ratingText}>4.5</Text>
              </View>
            </View>
            <View style={styles.venueInfo}>
              <Text style={styles.venueName} numberOfLines={1}>Cầu lông Kỳ Hòa</Text>
              <Text style={styles.venueAddress} numberOfLines={1}>Quận 10 • 3.2km</Text>
              <View style={styles.priceRow}>
                <Text style={styles.venuePrice}>120.000đ<Text style={styles.priceUnit}>/giờ</Text></Text>
                <View style={styles.statusBadge}>
                  <Text style={styles.statusText}>Còn sân</Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        </ScrollView>

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
    color: '#1a1a1a',
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
  categoryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  categoryItem: {
    alignItems: 'center',
    gap: 8,
  },
  categoryIconBox: {
    width: 60,
    height: 60,
    backgroundColor: '#f2f4f6',
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryText: {
    fontSize: 13,
    color: '#333',
    fontWeight: '500',
  },
  venueScroll: {
    paddingLeft: 20,
  },
  venueCard: {
    width: 260,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    marginRight: 16,
    borderWidth: 1,
    borderColor: '#e6e8ea',
    shadowColor: '#1e40af',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  venueImagePlaceholder: {
    height: 140,
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
    padding: 16,
  },
  venueName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  venueAddress: {
    fontSize: 13,
    color: '#666',
    marginBottom: 12,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  venuePrice: {
    fontSize: 16,
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
