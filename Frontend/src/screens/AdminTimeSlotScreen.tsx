import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator, ScrollView, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { slotsApi, TimeSlotDto } from '../api/slotsApi';

const AdminTimeSlotScreen = ({ route, navigation }: { route: any; navigation: any }) => {
  const { sportCenterId, sportCenterName } = route.params;
  const [slots, setSlots] = useState<TimeSlotDto[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Form for new slot
  const [showForm, setShowForm] = useState(false);
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadSlots();
  }, [sportCenterId]);

  const loadSlots = async () => {
    setLoading(true);
    try {
      const data = await slotsApi.getBySportCenter(sportCenterId);
      setSlots(data);
    } catch (error) {
      console.error('Failed to load slots', error);
      Alert.alert('Lỗi', 'Không thể tải khung giờ.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!startTime || !endTime) {
      Alert.alert('Lỗi', 'Vui lòng nhập giờ bắt đầu và kết thúc (vd: 07:00)');
      return;
    }
    
    // validate HH:mm format
    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    if (!timeRegex.test(startTime) || !timeRegex.test(endTime)) {
      Alert.alert('Lỗi', 'Định dạng giờ không hợp lệ. Phải là HH:mm (vd: 07:00)');
      return;
    }

    setIsSubmitting(true);
    try {
      await slotsApi.create({
        startTime: startTime + ':00',
        endTime: endTime + ':00',
        sportCenterId
      });
      setShowForm(false);
      setStartTime('');
      setEndTime('');
      loadSlots();
      Alert.alert('Thành công', 'Đã thêm khung giờ.');
    } catch (error) {
      console.error(error);
      Alert.alert('Lỗi', 'Không thể thêm khung giờ.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = (id: string) => {
    Alert.alert('Xóa', 'Bạn có chắc muốn xóa khung giờ này?', [
      { text: 'Hủy', style: 'cancel' },
      {
        text: 'Xóa',
        style: 'destructive',
        onPress: async () => {
          try {
            await slotsApi.delete(id);
            setSlots((prev) => prev.filter(s => s.id !== id));
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
        <Text style={styles.headerTitle} numberOfLines={1}>Khung giờ</Text>
        <View style={{ width: 34 }} />
      </View>
      <Text style={styles.subtitle}>{sportCenterName}</Text>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.subHeader}>
          <Text style={styles.subHeaderTitle}>Danh sách khung giờ</Text>
          <TouchableOpacity 
            style={styles.addButton}
            onPress={() => setShowForm(!showForm)}
          >
            <Ionicons name={showForm ? 'close' : 'add'} size={18} color="#fff" />
            <Text style={styles.addButtonText}>{showForm ? 'Hủy' : 'Thêm'}</Text>
          </TouchableOpacity>
        </View>

        {showForm && (
          <View style={styles.formCard}>
            <Text style={styles.formTitle}>Thêm khung giờ mới</Text>
            <View style={styles.row}>
              <View style={{ flex: 1, marginRight: 8 }}>
                <Text style={styles.label}>Từ giờ (HH:mm)</Text>
                <TextInput
                  style={styles.input}
                  placeholder="07:00"
                  value={startTime}
                  onChangeText={setStartTime}
                />
              </View>
              <View style={{ flex: 1, marginLeft: 8 }}>
                <Text style={styles.label}>Đến giờ (HH:mm)</Text>
                <TextInput
                  style={styles.input}
                  placeholder="08:00"
                  value={endTime}
                  onChangeText={setEndTime}
                />
              </View>
            </View>
            <TouchableOpacity 
              style={styles.submitBtn} 
              onPress={handleCreate}
              disabled={isSubmitting}
            >
              {isSubmitting ? <ActivityIndicator color="#fff" /> : <Text style={styles.submitText}>Lưu</Text>}
            </TouchableOpacity>
          </View>
        )}

        {loading ? (
          <ActivityIndicator size="large" color="#22c55e" style={{ marginTop: 20 }} />
        ) : (
          slots.length === 0 ? (
            <Text style={styles.emptyText}>Chưa có khung giờ nào.</Text>
          ) : (
            slots.map((slot) => {
              // format HH:mm:ss to HH:mm
              const start = slot.startTime.substring(0, 5);
              const end = slot.endTime.substring(0, 5);
              
              return (
                <View key={slot.id} style={styles.slotCard}>
                  <Text style={styles.slotTime}>{start} - {end}</Text>
                  <View style={styles.slotActions}>
                    {!slot.sportCenterId ? (
                      <View style={styles.defaultBadge}>
                        <Text style={styles.defaultText}>Mặc định</Text>
                      </View>
                    ) : (
                      <TouchableOpacity onPress={() => handleDelete(slot.id)} style={styles.delBtn}>
                        <Ionicons name="trash-outline" size={20} color="#ef4444" />
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              );
            })
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
  row: { flexDirection: 'row', marginBottom: 16 },
  label: { fontSize: 14, color: '#64748b', marginBottom: 4 },
  input: { borderWidth: 1, borderColor: '#cbd5e1', borderRadius: 8, padding: 10, fontSize: 15, backgroundColor: '#f8fafc' },
  submitBtn: { backgroundColor: '#3b82f6', padding: 12, borderRadius: 8, alignItems: 'center' },
  submitText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },

  slotCard: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fff', padding: 16, borderRadius: 12, marginBottom: 12, borderWidth: 1, borderColor: '#e2e8f0' },
  slotTime: { fontSize: 16, fontWeight: '600', color: '#0f172a' },
  slotActions: { flexDirection: 'row', alignItems: 'center' },
  defaultBadge: { backgroundColor: '#f1f5f9', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4 },
  defaultText: { fontSize: 12, color: '#64748b' },
  delBtn: { padding: 4 },
  emptyText: { textAlign: 'center', color: '#94a3b8', marginTop: 20 },
});

export default AdminTimeSlotScreen;
