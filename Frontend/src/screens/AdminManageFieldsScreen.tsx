import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, TextInput, Alert, ActivityIndicator, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useIsFocused } from '@react-navigation/native';
import { sportCentersApi } from '../api/sportCentersApi';
import { fieldsApi } from '../api/fieldsApi';

interface AdminField {
  id: string; // SportCenterId
  name: string;
  address: string;
  price: string;
  status: 'open' | 'closed';
  imageUrl?: string;
  description?: string;
}

const TABS = [
  { key: 'all', label: 'Tất cả' },
  { key: 'open', label: 'Đang mở' },
  { key: 'closed', label: 'Đã đóng' },
] as const;

const AdminManageFieldsScreen = ({ navigation }: { navigation: any }) => {
  const [fields, setFields] = useState<AdminField[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<'all' | 'open' | 'closed'>('all');
  const [query, setQuery] = useState('');
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      loadData();
    }
  }, [isFocused]);

  const loadData = async () => {
    setLoading(true);
    try {
      const sportCenters = await sportCentersApi.getAll();
      const mappedData: AdminField[] = [];

      for (const sc of sportCenters) {
        // Fetch field for price
        const scFields = await fieldsApi.getBySportCenter(sc.sportCenterId);
        const price = scFields.length > 0 ? `${scFields[0].pricePerSlot.toLocaleString('vi-VN')}đ/giờ` : 'Chưa có giá';
        
        mappedData.push({
          id: sc.sportCenterId,
          name: sc.name,
          address: sc.address,
          description: sc.description ?? undefined,
          imageUrl: sc.images && sc.images.length > 0 ? sc.images[0].url : undefined,
          price: price,
          status: 'open',
        });
      }
      setFields(mappedData);
    } catch (error) {
      console.error('Failed to load fields', error);
      Alert.alert('Lỗi', 'Không thể tải danh sách sân.');
    } finally {
      setLoading(false);
    }
  };

  const filtered = fields.filter((f) => {
    const matchesTab = tab === 'all' || f.status === tab;
    const matchesQuery = f.name.toLowerCase().includes(query.toLowerCase());
    return matchesTab && matchesQuery;
  });

  const handleDelete = (id: string, name: string) => {
    Alert.alert('Xóa sân', `Bạn có chắc muốn xóa "${name}"?`, [
      { text: 'Hủy', style: 'cancel' },
      { 
        text: 'Xóa', 
        style: 'destructive', 
        onPress: async () => {
          try {
            await sportCentersApi.delete(id);
            setFields((prev) => prev.filter((f) => f.id !== id));
            Alert.alert('Thành công', 'Đã xóa sân.');
          } catch (error) {
            console.error('Failed to delete field', error);
            Alert.alert('Lỗi', 'Không thể xóa sân này.');
          }
        } 
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Quản lý sân</Text>
        <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('AdminEditField')}>
          <Ionicons name="add" size={18} color="#fff" />
          <Text style={styles.addButtonText}>Thêm sân mới</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.searchBar}>
        <Ionicons name="search-outline" size={18} color="#666" style={{ marginRight: 8 }} />
        <TextInput
          style={styles.searchInput}
          placeholder="Tìm kiếm sân..."
          placeholderTextColor="#999"
          value={query}
          onChangeText={setQuery}
        />
      </View>

      <View style={styles.tabRow}>
        {TABS.map((t) => (
          <TouchableOpacity
            key={t.key}
            style={[styles.tabBtn, tab === t.key && styles.tabActive]}
            onPress={() => setTab(t.key)}
          >
            <Text style={[styles.tabText, tab === t.key && styles.tabTextActive]}>
              {t.label} {t.key === 'all' ? `(${fields.length})` : ''}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            {loading ? (
              <ActivityIndicator size="large" color="#006e2f" />
            ) : (
              <>
                <Ionicons name="business-outline" size={44} color="#d1d5db" />
                <Text style={styles.emptyText}>Chưa có sân nào</Text>
              </>
            )}
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            {item.imageUrl ? (
              <Image source={{ uri: item.imageUrl.startsWith('http') ? item.imageUrl : `http://10.0.2.2:5115${item.imageUrl}` }} style={styles.thumb} />
            ) : (
              <View style={styles.thumb}>
                <Ionicons name="business-outline" size={22} color="#22c55e" />
              </View>
            )}
            <View style={{ flex: 1 }}>
              <View style={styles.cardHeaderRow}>
                <Text style={styles.fieldName} numberOfLines={1}>{item.name}</Text>
                <View
                  style={[
                    styles.statusBadge,
                    { backgroundColor: item.status === 'open' ? '#e6f4ea' : '#f2f4f6' },
                  ]}
                >
                  <Text style={[styles.statusText, { color: item.status === 'open' ? '#22c55e' : '#666' }]}>
                    {item.status === 'open' ? 'Đang mở' : 'Đã đóng'}
                  </Text>
                </View>
              </View>
              <Text style={styles.fieldMeta}>{item.address}</Text>
              <Text style={styles.fieldPrice}>{item.price}</Text>
              <View style={styles.actionRow}>
                <TouchableOpacity
                  style={styles.editBtn}
                  onPress={() => navigation.navigate('AdminEditField', { field: item })}
                >
                  <Ionicons name="create-outline" size={14} color="#1E40AF" />
                  <Text style={styles.editText}>Chỉnh sửa</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.deleteBtn} onPress={() => handleDelete(item.id, item.name)}>
                  <Ionicons name="trash-outline" size={14} color="#ba1a1a" />
                  <Text style={styles.deleteText}>Xóa</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f2f4f6' },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    gap: 12,
  },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#1a1a1a' },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#22c55e',
    paddingVertical: 10,
    borderRadius: 10,
    gap: 6,
  },
  addButtonText: { color: '#fff', fontWeight: '700', fontSize: 13 },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 42,
    marginHorizontal: 16,
    marginTop: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  searchInput: { flex: 1, fontSize: 13, color: '#333' },
  tabRow: { flexDirection: 'row', paddingHorizontal: 16, paddingVertical: 12, gap: 10 },
  tabBtn: { flex: 1, paddingVertical: 9, alignItems: 'center', borderRadius: 8, backgroundColor: '#fff', borderWidth: 1, borderColor: '#e2e8f0' },
  tabActive: { backgroundColor: '#22c55e', borderColor: '#22c55e' },
  tabText: { fontSize: 12, fontWeight: '600', color: '#666' },
  tabTextActive: { color: '#fff' },
  list: { paddingHorizontal: 16, paddingBottom: 16 },
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 12,
    gap: 12,
  },
  thumb: { width: 52, height: 52, borderRadius: 12, backgroundColor: '#e6f4ea', justifyContent: 'center', alignItems: 'center' },
  cardHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8, marginBottom: 4 },
  fieldName: { fontSize: 14, fontWeight: 'bold', color: '#1a1a1a', flex: 1 },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  statusText: { fontSize: 10, fontWeight: 'bold' },
  fieldMeta: { fontSize: 12, color: '#666', marginBottom: 4 },
  fieldPrice: { fontSize: 13, fontWeight: 'bold', color: '#006e2f', marginBottom: 10 },
  actionRow: { flexDirection: 'row', gap: 10 },
  editBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, borderWidth: 1, borderColor: '#dbeafe', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8 },
  editText: { fontSize: 11, fontWeight: '700', color: '#1E40AF' },
  deleteBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, borderWidth: 1, borderColor: '#ffdada', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8 },
  deleteText: { fontSize: 11, fontWeight: '700', color: '#ba1a1a' },
  emptyState: { alignItems: 'center', paddingTop: 100, gap: 12 },
  emptyText: { fontSize: 14, color: '#9ca3af' },
});

export default AdminManageFieldsScreen;
