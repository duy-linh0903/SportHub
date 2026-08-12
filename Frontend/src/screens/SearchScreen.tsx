import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, FlatList, ActivityIndicator, Modal } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { sportCentersApi } from '../api/sportCentersApi';
import { SportCenterResponseDto } from '../types/api';

const SPORT_CATEGORIES = [
  { id: 'football', name: 'Bóng đá', keywords: ['bóng đá', 'cỏ nhân tạo', 'chảo lửa', 'arena'] },
  { id: 'tennis', name: 'Tennis', keywords: ['tennis', 'quần vợt', 'đất nện', 'lan anh'] },
  { id: 'basketball', name: 'Bóng rổ', keywords: ['bóng rổ', 'hoop'] },
  { id: 'badminton', name: 'Cầu lông', keywords: ['cầu lông'] },
  { id: 'swimming', name: 'Bơi lội', keywords: ['bơi', 'hồ bơi', 'yết kiêu'] },
  { id: 'volleyball', name: 'Bóng chuyền', keywords: ['bóng chuyền'] },
  { id: 'golf', name: 'Golf', keywords: ['golf'] },
  { id: 'pingpong', name: 'Bóng bàn', keywords: ['bóng bàn'] },
];

const PRICE_RANGES = [
  { id: 'under_100', name: 'Dưới 100.000đ', min: 0, max: 99999 },
  { id: '100_to_200', name: '100.000đ - 200.000đ', min: 100000, max: 200000 },
  { id: 'above_200', name: 'Trên 200.000đ', min: 200001, max: 99999999 },
];

const SearchScreen = ({ navigation }: { navigation: any }) => {
  const [query, setQuery] = useState('');
  const [allCenters, setAllCenters] = useState<SportCenterResponseDto[]>([]);
  const [loading, setLoading] = useState(true);

  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [selectedSport, setSelectedSport] = useState<string | null>(null);
  const [selectedPrice, setSelectedPrice] = useState<string | null>(null);

  useEffect(() => {
    const fetchInitial = async () => {
      try {
        const data = await sportCentersApi.getAll();
        setAllCenters(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchInitial();
  }, []);

  const searchResults = useMemo(() => {
    let results = allCenters;

    // Filter by search query (name or address)
    if (query.trim().length > 0) {
      const q = query.toLowerCase();
      results = results.filter(c => 
        (c.name && c.name.toLowerCase().includes(q)) || 
        (c.address && c.address.toLowerCase().includes(q))
      );
    }

    // Filter by sport category
    if (selectedSport) {
      const cat = SPORT_CATEGORIES.find(c => c.id === selectedSport);
      if (cat) {
        results = results.filter(center => {
          const text = ((center.name || '') + ' ' + (center.description || '')).toLowerCase();
          return cat.keywords.some(kw => text.includes(kw));
        });
      }
    }

    // Filter by price range
    if (selectedPrice) {
      const priceRange = PRICE_RANGES.find(p => p.id === selectedPrice);
      if (priceRange) {
        results = results.filter(center => {
          // If a center has no fields, its minPrice might be 0, but if we filter by > 200k it should be excluded
          const price = center.minPrice || 0;
          if (price === 0) return false; // Ignore centers with no prices when filtering by price
          return price >= priceRange.min && price <= priceRange.max;
        });
      }
    }

    return results;
  }, [allCenters, query, selectedSport, selectedPrice]);

  const isSearching = query.trim().length > 0 || selectedSport || selectedPrice;
  const activeFiltersCount = (selectedSport ? 1 : 0) + (selectedPrice ? 1 : 0);

  const clearFilters = () => {
    setSelectedSport(null);
    setSelectedPrice(null);
    setFilterModalVisible(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topBar}>
        <View style={styles.brandRow}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={{marginRight: 8}}>
            <Ionicons name="arrow-back" size={24} color="#1a1a1a" />
          </TouchableOpacity>
          <Ionicons name="location-outline" size={16} color="#22c55e" />
          <Text style={styles.brandText}>SportHub Tìm kiếm</Text>
        </View>
        <TouchableOpacity 
          style={[styles.filterButton, activeFiltersCount > 0 && styles.filterButtonActive]} 
          onPress={() => setFilterModalVisible(true)}
        >
          <Ionicons name="options-outline" size={16} color={activeFiltersCount > 0 ? "#fff" : "#1a1a1a"} />
          <Text style={[styles.filterText, activeFiltersCount > 0 && styles.filterTextActive]}>
            Lọc {activeFiltersCount > 0 ? `(${activeFiltersCount})` : ''}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.searchBar}>
        <Ionicons name="search-outline" size={20} color="#666" style={{ marginRight: 8 }} />
        <TextInput
          style={styles.input}
          placeholder="Tìm tên sân bóng, khu vực..."
          placeholderTextColor="#999"
          value={query}
          onChangeText={setQuery}
          autoFocus
        />
        {query.length > 0 && (
          <TouchableOpacity onPress={() => setQuery('')}>
            <Ionicons name="close-circle" size={18} color="#999" />
          </TouchableOpacity>
        )}
      </View>

      {isSearching ? (
        <View style={styles.content}>
          <Text style={styles.sectionTitle}>Kết quả tìm kiếm ({searchResults.length})</Text>
          {loading ? (
             <ActivityIndicator size="large" color="#006e2f" style={{ marginTop: 20 }} />
          ) : (
            <FlatList
              data={searchResults}
              keyExtractor={(item) => item.sportCenterId}
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.resultCard} onPress={() => navigation.navigate('Detail', { sportCenterId: item.sportCenterId })}>
                  <View style={styles.cardLeft}>
                    <Text style={styles.cardTitle}>{item.name}</Text>
                    <Text style={styles.cardSub}>{item.address}</Text>
                    <Text style={styles.cardPrice}>
                      {item.minPrice > 0 ? `${item.minPrice.toLocaleString('vi-VN')}đ` : '---'}<Text style={{fontSize: 12, color: '#666', fontWeight: 'normal'}}>/giờ</Text>
                    </Text>
                  </View>
                  <View style={styles.ratingBox}>
                    <Ionicons name="star" size={12} color="#F97316" />
                    <Text style={styles.ratingText}>4.5</Text>
                  </View>
                </TouchableOpacity>
              )}
              ListEmptyComponent={<Text style={{ textAlign: 'center', marginTop: 40, color: '#666' }}>Không tìm thấy sân nào phù hợp với bộ lọc hiện tại.</Text>}
            />
          )}
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          {loading ? (
            <ActivityIndicator size="large" color="#006e2f" style={{ marginTop: 20 }} />
          ) : (
            <>
              <Text style={styles.discoverTitle}>Khám phá sân chơi</Text>
              <Text style={styles.discoverSubtitle}>Tìm sân cầu lông, bóng đá, tennis gần bạn nhất.</Text>

              {allCenters.length > 0 && (
                <TouchableOpacity style={styles.featuredCard} onPress={() => navigation.navigate('Detail', { sportCenterId: allCenters[0].sportCenterId })}>
                  <View style={styles.featuredTag}>
                    <Text style={styles.featuredTagText}>NỔI BẬT</Text>
                  </View>
                  <Text style={styles.featuredName}>{allCenters[0].name}</Text>
                  <Text style={styles.featuredAddress}>{allCenters[0].address}</Text>
                </TouchableOpacity>
              )}

              <View style={styles.suggestedGrid}>
                {allCenters.slice(1, 3).map((v) => (
                  <TouchableOpacity key={v.sportCenterId} style={styles.suggestedCard} onPress={() => navigation.navigate('Detail', { sportCenterId: v.sportCenterId })}>
                    <View style={styles.suggestedIconWrap}>
                      <Ionicons name="football-outline" size={22} color="#22c55e" />
                    </View>
                    <Text style={styles.suggestedName} numberOfLines={1}>{v.name}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </>
          )}
        </ScrollView>
      )}

      {/* Filter Modal */}
      <Modal
        visible={filterModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setFilterModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Bộ lọc tìm kiếm</Text>
              <TouchableOpacity onPress={() => setFilterModalVisible(false)}>
                <Ionicons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.filterSectionTitle}>Môn thể thao</Text>
              <View style={styles.filterGrid}>
                {SPORT_CATEGORIES.map(cat => (
                  <TouchableOpacity 
                    key={cat.id} 
                    style={[styles.filterChip, selectedSport === cat.id && styles.filterChipActive]}
                    onPress={() => setSelectedSport(selectedSport === cat.id ? null : cat.id)}
                  >
                    <Text style={[styles.filterChipText, selectedSport === cat.id && styles.filterChipTextActive]}>{cat.name}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.filterSectionTitle}>Khoảng giá</Text>
              <View style={styles.filterGrid}>
                {PRICE_RANGES.map(price => (
                  <TouchableOpacity 
                    key={price.id} 
                    style={[styles.filterChip, selectedPrice === price.id && styles.filterChipActive]}
                    onPress={() => setSelectedPrice(selectedPrice === price.id ? null : price.id)}
                  >
                    <Text style={[styles.filterChipText, selectedPrice === price.id && styles.filterChipTextActive]}>{price.name}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity style={styles.btnReset} onPress={clearFilters}>
                <Text style={styles.btnResetText}>Xóa lọc</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.btnApply} onPress={() => setFilterModalVisible(false)}>
                <Text style={styles.btnApplyText}>Áp dụng</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ffffff' },
  topBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingTop: 8 },
  brandRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  brandText: { fontSize: 16, fontWeight: 'bold', color: '#1a1a1a' },
  filterButton: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#f2f4f6', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8 },
  filterButtonActive: { backgroundColor: '#006e2f' },
  filterText: { fontSize: 12, fontWeight: '600', color: '#1a1a1a' },
  filterTextActive: { color: '#fff' },
  searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f2f4f6', borderRadius: 12, paddingHorizontal: 12, height: 44, marginHorizontal: 16, marginVertical: 12 },
  input: { flex: 1, fontSize: 14, color: '#333' },
  content: { flex: 1, padding: 16, paddingTop: 0 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#1a1a1a', marginBottom: 12 },
  resultCard: { flexDirection: 'row', justifyContent: 'space-between', backgroundColor: '#f8fafc', padding: 16, borderRadius: 12, marginBottom: 12, borderWidth: 1, borderColor: '#e2e8f0' },
  cardLeft: { flex: 1 },
  cardTitle: { fontSize: 16, fontWeight: 'bold', color: '#1a1a1a', marginBottom: 4 },
  cardSub: { fontSize: 13, color: '#666', marginBottom: 8 },
  cardPrice: { fontSize: 14, fontWeight: 'bold', color: '#006e2f' },
  ratingBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, gap: 4, borderWidth: 1, borderColor: '#e2e8f0', height: 28 },
  ratingText: { fontSize: 12, fontWeight: 'bold', color: '#1a1a1a' },
  discoverTitle: { fontSize: 20, fontWeight: 'bold', color: '#1a1a1a', marginBottom: 4 },
  discoverSubtitle: { fontSize: 13, color: '#666', marginBottom: 16 },
  featuredCard: { backgroundColor: '#1E40AF', borderRadius: 16, padding: 16, marginBottom: 16, height: 120, justifyContent: 'flex-end' },
  featuredTag: { position: 'absolute', top: 12, left: 12, backgroundColor: '#22c55e', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  featuredTagText: { fontSize: 10, fontWeight: 'bold', color: '#fff' },
  featuredName: { fontSize: 16, fontWeight: 'bold', color: '#fff' },
  featuredAddress: { fontSize: 12, color: '#dbeafe', marginTop: 2 },
  suggestedGrid: { flexDirection: 'row', gap: 12 },
  suggestedCard: { flex: 1, backgroundColor: '#f8fafc', borderRadius: 14, padding: 12, borderWidth: 1, borderColor: '#e2e8f0' },
  suggestedIconWrap: { width: 40, height: 40, borderRadius: 10, backgroundColor: '#e6f4ea', justifyContent: 'center', alignItems: 'center', marginBottom: 8 },
  suggestedName: { fontSize: 12, fontWeight: '600', color: '#1a1a1a' },
  
  // Modal styles
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalSheet: { backgroundColor: '#fff', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 20, maxHeight: '80%' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  modalTitle: { fontSize: 18, fontWeight: 'bold', color: '#1a1a1a' },
  filterSectionTitle: { fontSize: 15, fontWeight: 'bold', color: '#1a1a1a', marginTop: 16, marginBottom: 12 },
  filterGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  filterChip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: '#f2f4f6', borderWidth: 1, borderColor: 'transparent' },
  filterChipActive: { backgroundColor: '#e6f4ea', borderColor: '#22c55e' },
  filterChipText: { fontSize: 13, color: '#666', fontWeight: '500' },
  filterChipTextActive: { color: '#006e2f', fontWeight: 'bold' },
  modalFooter: { flexDirection: 'row', gap: 12, marginTop: 24, paddingTop: 16, borderTopWidth: 1, borderColor: '#f2f4f6' },
  btnReset: { flex: 1, paddingVertical: 14, borderRadius: 12, backgroundColor: '#f2f4f6', alignItems: 'center' },
  btnResetText: { fontSize: 15, fontWeight: 'bold', color: '#666' },
  btnApply: { flex: 2, paddingVertical: 14, borderRadius: 12, backgroundColor: '#006e2f', alignItems: 'center' },
  btnApplyText: { fontSize: 15, fontWeight: 'bold', color: '#fff' }
});

export default SearchScreen;

