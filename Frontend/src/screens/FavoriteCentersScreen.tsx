import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { favoritesApi } from '../api/favoritesApi';
import { SportCenterResponseDto } from '../types/api';
import { useAuthStore } from '../store/useAuthStore';

const FavoriteCentersScreen = ({ navigation }: { navigation: any }) => {
  const [favorites, setFavorites] = useState<SportCenterResponseDto[]>([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated) {
      fetchFavorites();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated]);

  const fetchFavorites = async () => {
    setLoading(true);
    try {
      const data = await favoritesApi.getMyFavorites();
      setFavorites(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <SafeAreaView style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Ionicons name="heart-disallow-outline" size={64} color="#d1d5db" />
        <Text style={{ marginTop: 16, fontSize: 16, color: '#666' }}>Vui lòng đăng nhập để xem danh sách yêu thích</Text>
        <TouchableOpacity style={styles.loginBtn} onPress={() => navigation.navigate('Login')}>
          <Text style={styles.loginBtnText}>Đăng nhập</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ paddingRight: 16 }}>
          <Ionicons name="arrow-back" size={24} color="#1a1a1a" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Sân yêu thích</Text>
      </View>

      <View style={styles.content}>
        {loading ? (
          <ActivityIndicator size="large" color="#006e2f" style={{ marginTop: 40 }} />
        ) : (
          <FlatList
            data={favorites}
            keyExtractor={(item) => item.sportCenterId}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <TouchableOpacity 
                style={styles.resultCard} 
                onPress={() => navigation.navigate('Detail', { sportCenterId: item.sportCenterId })}
              >
                <View style={styles.cardLeft}>
                  <Text style={styles.cardTitle}>{item.name}</Text>
                  <Text style={styles.cardSub}>{item.address}</Text>
                  <Text style={styles.cardPrice}>
                    {item.minPrice > 0 ? `${item.minPrice.toLocaleString('vi-VN')}đ` : 'Chưa có giá'}<Text style={{fontSize: 12, color: '#666', fontWeight: 'normal'}}>/giờ</Text>
                  </Text>
                </View>
                <View style={styles.cardRight}>
                  <Ionicons name="heart" size={24} color="#ef4444" />
                </View>
              </TouchableOpacity>
            )}
            ListEmptyComponent={
              <View style={{ alignItems: 'center', marginTop: 80 }}>
                <Ionicons name="heart-outline" size={64} color="#d1d5db" />
                <Text style={{ marginTop: 16, color: '#666', fontSize: 16 }}>Bạn chưa thích sân nào.</Text>
                <TouchableOpacity style={styles.discoverBtn} onPress={() => navigation.navigate('Search')}>
                  <Text style={styles.discoverText}>Khám phá ngay</Text>
                </TouchableOpacity>
              </View>
            }
          />
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f2f4f6' },
  topBar: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, backgroundColor: '#fff', borderBottomWidth: 1, borderColor: '#e2e8f0' },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#1a1a1a' },
  content: { flex: 1, padding: 16 },
  resultCard: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fff', padding: 16, borderRadius: 12, marginBottom: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 2 },
  cardLeft: { flex: 1, paddingRight: 12 },
  cardRight: { justifyContent: 'center', alignItems: 'center', width: 40, height: 40, borderRadius: 20, backgroundColor: '#fee2e2' },
  cardTitle: { fontSize: 16, fontWeight: 'bold', color: '#1a1a1a', marginBottom: 4 },
  cardSub: { fontSize: 13, color: '#666', marginBottom: 8 },
  cardPrice: { fontSize: 14, fontWeight: 'bold', color: '#006e2f' },
  loginBtn: { marginTop: 24, backgroundColor: '#22c55e', paddingHorizontal: 32, paddingVertical: 12, borderRadius: 12 },
  loginBtnText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  discoverBtn: { marginTop: 20, paddingHorizontal: 20, paddingVertical: 10, borderRadius: 8, borderWidth: 1, borderColor: '#22c55e' },
  discoverText: { color: '#22c55e', fontWeight: 'bold' }
});

export default FavoriteCentersScreen;
