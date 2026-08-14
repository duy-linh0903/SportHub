import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { fieldsApi } from '../api/fieldsApi';
import { FieldResponseDto } from '../types/api';
import { useIsFocused } from '@react-navigation/native';

const AdminFieldListScreen = ({ route, navigation }: { route: any; navigation: any }) => {
  const { sportCenter } = route.params;
  const [fields, setFields] = useState<FieldResponseDto[]>([]);
  const [loading, setLoading] = useState(true);
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      loadFields();
    }
  }, [isFocused, sportCenter.sportCenterId]);

  const loadFields = async () => {
    setLoading(true);
    try {
      const data = await fieldsApi.getBySportCenter(sportCenter.sportCenterId);
      setFields(data);
    } catch (error) {
      console.error('Failed to load fields', error);
      Alert.alert('Lỗi', 'Không thể tải danh sách sân con.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id: string, name: string) => {
    Alert.alert('Xóa sân con', `Bạn có chắc muốn xóa "${name}"?`, [
      { text: 'Hủy', style: 'cancel' },
      {
        text: 'Xóa',
        style: 'destructive',
        onPress: async () => {
          try {
            await fieldsApi.delete(id);
            setFields((prev) => prev.filter((f) => f.fieldId !== id));
            Alert.alert('Thành công', 'Đã xóa sân con.');
          } catch (error) {
            console.error('Failed to delete sub field', error);
            Alert.alert('Lỗi', 'Không thể xóa sân này.');
          }
        }
      }
    ]);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 5 }}>
          <Ionicons name="arrow-back" size={24} color="#0f172a" />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>{sportCenter.name}</Text>
        <TouchableOpacity onPress={() => navigation.navigate('AdminEditField', { field: sportCenter })} style={{ padding: 5 }}>
          <Ionicons name="settings-outline" size={24} color="#0f172a" />
        </TouchableOpacity>
      </View>

      <View style={styles.actionRow}>
        <TouchableOpacity 
          style={styles.actionBtn}
          onPress={() => navigation.navigate('AdminTimeSlot', { sportCenterId: sportCenter.sportCenterId, sportCenterName: sportCenter.name })}
        >
          <Ionicons name="time-outline" size={20} color="#3b82f6" />
          <Text style={styles.actionBtnText}>Khung giờ</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.actionBtn}
          onPress={() => navigation.navigate('AdminService', { sportCenterId: sportCenter.sportCenterId, sportCenterName: sportCenter.name })}
        >
          <Ionicons name="basket-outline" size={20} color="#f59e0b" />
          <Text style={styles.actionBtnText}>Dịch vụ</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.subHeader}>
        <Text style={styles.subHeaderTitle}>Danh sách sân con</Text>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => navigation.navigate('AdminEditSubField', { sportCenterId: sportCenter.sportCenterId })}
        >
          <Ionicons name="add" size={18} color="#fff" />
          <Text style={styles.addButtonText}>Thêm sân</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#22c55e" />
        </View>
      ) : (
        <FlatList
          data={fields}
          keyExtractor={(item) => item.fieldId}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Ionicons name="football-outline" size={48} color="#d1d5db" />
              <Text style={styles.emptyText}>Chưa có sân con nào</Text>
            </View>
          }
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={styles.cardInfo}>
                <Text style={styles.fieldName}>{item.name}</Text>
                <Text style={styles.fieldType}>Loại: {item.type}</Text>
                <Text style={styles.fieldPrice}>Giá: {item.pricePerSlot.toLocaleString('vi-VN')}đ / giờ</Text>
              </View>
              <View style={styles.cardActions}>
                <TouchableOpacity 
                  style={styles.iconBtn}
                  onPress={() => navigation.navigate('AdminEditSubField', { 
                    sportCenterId: sportCenter.sportCenterId, 
                    subField: item 
                  })}
                >
                  <Ionicons name="pencil" size={20} color="#3b82f6" />
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.iconBtn}
                  onPress={() => handleDelete(item.fieldId, item.name)}
                >
                  <Ionicons name="trash" size={20} color="#ef4444" />
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#0f172a', flex: 1, textAlign: 'center' },
  actionRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
    gap: 12,
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    paddingVertical: 10,
    borderRadius: 8,
    gap: 8,
  },
  actionBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0f172a',
  },
  subHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  subHeaderTitle: { fontSize: 16, fontWeight: '600', color: '#0f172a' },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#22c55e',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  addButtonText: { color: '#fff', fontWeight: '600', marginLeft: 4, fontSize: 14 },
  list: { paddingHorizontal: 16 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyState: { alignItems: 'center', marginTop: 60 },
  emptyText: { fontSize: 15, color: '#94a3b8', marginTop: 12 },
  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardInfo: { flex: 1 },
  fieldName: { fontSize: 16, fontWeight: '600', color: '#0f172a', marginBottom: 4 },
  fieldType: { fontSize: 14, color: '#64748b', marginBottom: 4 },
  fieldPrice: { fontSize: 14, fontWeight: '700', color: '#006e2f' },
  cardActions: { flexDirection: 'row', alignItems: 'center' },
  iconBtn: { padding: 8, marginLeft: 8, backgroundColor: '#f1f5f9', borderRadius: 8 },
});

export default AdminFieldListScreen;
