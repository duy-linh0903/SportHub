import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator, ScrollView, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { servicesApi } from '../api/servicesApi';
import { ServiceResponseDto } from '../types/api';

const AdminServiceScreen = ({ route, navigation }: { route: any; navigation: any }) => {
  const { sportCenterId, sportCenterName } = route.params;
  const [services, setServices] = useState<ServiceResponseDto[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Form for new service
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [type, setType] = useState('Equipment');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadServices();
  }, [sportCenterId]);

  const loadServices = async () => {
    setLoading(true);
    try {
      const data = await servicesApi.getBySportCenter(sportCenterId);
      setServices(data);
    } catch (error) {
      console.error('Failed to load services', error);
      Alert.alert('Lỗi', 'Không thể tải dịch vụ.');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!name || !price) {
      Alert.alert('Lỗi', 'Vui lòng nhập tên và giá');
      return;
    }

    setIsSubmitting(true);
    try {
      if (editingId) {
        await servicesApi.update(editingId, {
          name,
          price: parseFloat(price),
          type,
          description,
        });
        Alert.alert('Thành công', 'Đã cập nhật dịch vụ.');
      } else {
        await servicesApi.create({
          name,
          price: parseFloat(price),
          type,
          description,
          sportCenterId
        });
        Alert.alert('Thành công', 'Đã thêm dịch vụ.');
      }
      setShowForm(false);
      setEditingId(null);
      setName('');
      setPrice('');
      setDescription('');
      loadServices();
    } catch (error) {
      console.error(error);
      Alert.alert('Lỗi', 'Không thể lưu dịch vụ.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (svc: ServiceResponseDto) => {
    setEditingId(svc.serviceId);
    setName(svc.name);
    setPrice(svc.price.toString());
    setType(svc.type);
    setDescription(svc.description || '');
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    Alert.alert('Xóa', 'Bạn có chắc muốn xóa dịch vụ này?', [
      { text: 'Hủy', style: 'cancel' },
      {
        text: 'Xóa',
        style: 'destructive',
        onPress: async () => {
          try {
            await servicesApi.delete(id);
            setServices((prev) => prev.filter(s => s.serviceId !== id));
          } catch (error) {
            console.error(error);
            Alert.alert('Lỗi', 'Không thể xóa.');
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
        <Text style={styles.headerTitle} numberOfLines={1}>Dịch vụ đi kèm</Text>
        <View style={{ width: 34 }} />
      </View>
      <Text style={styles.subtitle}>{sportCenterName}</Text>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.subHeader}>
          <Text style={styles.subHeaderTitle}>Danh sách dịch vụ</Text>
          <TouchableOpacity 
            style={styles.addButton}
            onPress={() => {
              setShowForm(!showForm);
              if (showForm) {
                setEditingId(null);
                setName('');
                setPrice('');
                setDescription('');
              }
            }}
          >
            <Ionicons name={showForm ? 'close' : 'add'} size={18} color="#fff" />
            <Text style={styles.addButtonText}>{showForm ? 'Hủy' : 'Thêm'}</Text>
          </TouchableOpacity>
        </View>

        {showForm && (
          <View style={styles.formCard}>
            <Text style={styles.formTitle}>{editingId ? 'Cập nhật dịch vụ' : 'Thêm dịch vụ mới'}</Text>
            
            <Text style={styles.label}>Tên dịch vụ</Text>
            <TextInput style={styles.input} placeholder="Vd: Nước suối" value={name} onChangeText={setName} />
            
            <Text style={styles.label}>Giá (VNĐ)</Text>
            <TextInput style={styles.input} placeholder="15000" keyboardType="numeric" value={price} onChangeText={setPrice} />
            
            <Text style={styles.label}>Loại (Type)</Text>
            <TextInput style={styles.input} placeholder="Food / Equipment" value={type} onChangeText={setType} />
            
            <Text style={styles.label}>Mô tả</Text>
            <TextInput style={styles.input} placeholder="Mô tả ngắn gọn" value={description} onChangeText={setDescription} />

            <TouchableOpacity 
              style={styles.submitBtn} 
              onPress={handleSave}
              disabled={isSubmitting}
            >
              {isSubmitting ? <ActivityIndicator color="#fff" /> : <Text style={styles.submitText}>Lưu</Text>}
            </TouchableOpacity>
          </View>
        )}

        {loading ? (
          <ActivityIndicator size="large" color="#22c55e" style={{ marginTop: 20 }} />
        ) : (
          services.length === 0 ? (
            <Text style={styles.emptyText}>Chưa có dịch vụ nào.</Text>
          ) : (
            services.map((svc) => (
              <View key={svc.serviceId} style={styles.serviceCard}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.serviceName}>{svc.name}</Text>
                  <Text style={styles.servicePrice}>{svc.price.toLocaleString('vi-VN')}đ</Text>
                  {svc.description ? <Text style={styles.serviceDesc}>{svc.description}</Text> : null}
                </View>
                <View style={styles.serviceActions}>
                  {!svc.sportCenterId && (
                    <View style={styles.defaultBadge}>
                      <Text style={styles.defaultText}>Mặc định</Text>
                    </View>
                  )}
                  <TouchableOpacity onPress={() => handleEdit(svc)} style={styles.actionBtn}>
                    <Ionicons name="pencil-outline" size={20} color="#3b82f6" />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleDelete(svc.serviceId)} style={styles.actionBtn}>
                    <Ionicons name="trash-outline" size={20} color="#ef4444" />
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#f1f5f9' },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#0f172a' },
  subtitle: { paddingHorizontal: 16, paddingTop: 16, fontSize: 16, color: '#64748b', fontWeight: '500' },
  content: { padding: 16 },
  subHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  subHeaderTitle: { fontSize: 18, fontWeight: 'bold', color: '#0f172a' },
  addButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#22c55e', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8 },
  addButtonText: { color: '#fff', fontWeight: '600', marginLeft: 4 },
  
  formCard: { backgroundColor: '#fff', padding: 16, borderRadius: 12, marginBottom: 16, borderWidth: 1, borderColor: '#e2e8f0' },
  formTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 12, color: '#0f172a' },
  label: { fontSize: 14, color: '#64748b', marginBottom: 4 },
  input: { borderWidth: 1, borderColor: '#cbd5e1', borderRadius: 8, padding: 10, fontSize: 15, backgroundColor: '#f8fafc', marginBottom: 12 },
  submitBtn: { backgroundColor: '#3b82f6', padding: 12, borderRadius: 8, alignItems: 'center', marginTop: 4 },
  submitText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },

  serviceCard: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fff', padding: 16, borderRadius: 12, marginBottom: 12, borderWidth: 1, borderColor: '#e2e8f0' },
  serviceName: { fontSize: 16, fontWeight: '600', color: '#0f172a', marginBottom: 4 },
  servicePrice: { fontSize: 15, fontWeight: 'bold', color: '#3b82f6', marginBottom: 4 },
  serviceDesc: { fontSize: 14, color: '#64748b' },
  serviceActions: { flexDirection: 'row', alignItems: 'center', marginLeft: 12 },
  defaultBadge: { backgroundColor: '#f1f5f9', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4 },
  defaultText: { fontSize: 12, color: '#64748b' },
  actionBtn: { padding: 4, marginLeft: 8 },
  delBtn: { padding: 4 },
  emptyText: { textAlign: 'center', color: '#94a3b8', marginTop: 20 },
});

export default AdminServiceScreen;
