import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, FlatList } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { SafeAreaView } from 'react-native-safe-area-context';

// ===== Dummy Data =====
const FEATURED_VENUE = {
  name: 'Sân Cầu Lông Sunrise',
  address: 'Quận 7, TP.HCM',
  tag: 'MỚI NHẤT',
};

const SUGGESTED_VENUES = [
  { id: 'V1', name: 'Sân Bóng Đá Cỏ Nhân Tạo', icon: 'football-outline' },
  { id: 'V2', name: 'Sân Cầu Lông Đà Nẵng', icon: 'tennisball-outline' },
];

const SEARCH_RESULTS = [
  { id: '1', name: 'Sân bóng Đại Thế Giới', address: 'Quận 5 • 2.5km', price: '250.000đ/giờ', rating: '4.8' },
  { id: '2', name: 'CLB Cầu Lông Tân Sơn', address: 'Quận Tân Bình • 4.2km', price: '120.000đ/giờ', rating: '4.5' },
];

const SearchScreen = ({ navigation }: { navigation: any }) => {
  const [query, setQuery] = useState('');
  const isSearching = query.trim().length > 0;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topBar}>
        <View style={styles.brandRow}>
          <Ionicons name="location-outline" size={16} color="#22c55e" />
          <Text style={styles.brandText}>SportHub</Text>
        </View>
        <TouchableOpacity style={styles.filterButton}>
          <Ionicons name="options-outline" size={16} color="#1a1a1a" />
          <Text style={styles.filterText}>Lọc</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.searchBar}>
        <Ionicons name="search-outline" size={20} color="#666" style={{ marginRight: 8 }} />
        <TextInput
          style={styles.input}
          placeholder="Tìm sân cầu lông, bóng đá, tennis..."
          placeholderTextColor="#999"
          value={query}
          onChangeText={setQuery}
        />
        {query.length > 0 && (
          <TouchableOpacity onPress={() => setQuery('')}>
            <Ionicons name="close-circle" size={18} color="#999" />
          </TouchableOpacity>
        )}
      </View>

      {isSearching ? (
        <View style={styles.content}>
          <Text style={styles.sectionTitle}>Kết quả tìm kiếm</Text>
          <FlatList
            data={SEARCH_RESULTS}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.resultCard} onPress={() => navigation.navigate('Detail')}>
                <View style={styles.cardLeft}>
                  <Text style={styles.cardTitle}>{item.name}</Text>
                  <Text style={styles.cardSub}>{item.address}</Text>
                  <Text style={styles.cardPrice}>{item.price}</Text>
                </View>
                <View style={styles.ratingBox}>
                  <Ionicons name="star" size={12} color="#F97316" />
                  <Text style={styles.ratingText}>{item.rating}</Text>
                </View>
              </TouchableOpacity>
            )}
          />
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <Text style={styles.discoverTitle}>Khám phá sân chơi</Text>
          <Text style={styles.discoverSubtitle}>Tìm sân cầu lông, bóng đá, tennis gần bạn nhất.</Text>

          <TouchableOpacity style={styles.featuredCard} onPress={() => navigation.navigate('Detail')}>
            <View style={styles.featuredTag}>
              <Text style={styles.featuredTagText}>{FEATURED_VENUE.tag}</Text>
            </View>
            <Text style={styles.featuredName}>{FEATURED_VENUE.name}</Text>
            <Text style={styles.featuredAddress}>{FEATURED_VENUE.address}</Text>
          </TouchableOpacity>

          <View style={styles.suggestedGrid}>
            {SUGGESTED_VENUES.map((v) => (
              <TouchableOpacity key={v.id} style={styles.suggestedCard} onPress={() => navigation.navigate('Detail')}>
                <View style={styles.suggestedIconWrap}>
                  <Ionicons name={v.icon} size={22} color="#22c55e" />
                </View>
                <Text style={styles.suggestedName} numberOfLines={1}>{v.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ffffff' },
  topBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingTop: 8 },
  brandRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  brandText: { fontSize: 16, fontWeight: 'bold', color: '#1a1a1a' },
  filterButton: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#f2f4f6', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8 },
  filterText: { fontSize: 12, fontWeight: '600', color: '#1a1a1a' },
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
});

export default SearchScreen;
