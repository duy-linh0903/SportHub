import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { fieldsApi } from '../api/fieldsApi';

const FIELD_TYPES = ['Bóng đá', 'Cầu lông', 'Tennis', 'Bóng rổ'];

const AdminEditSubFieldScreen = ({ navigation, route }: { navigation: any; route: any }) => {
  const { sportCenterId, subField } = route.params;
  const isEditing = !!subField;

  const [name, setName] = useState(subField?.name || '');
  const [fieldType, setFieldType] = useState(subField?.type || FIELD_TYPES[0]);
  const [price, setPrice] = useState(subField?.pricePerSlot?.toString() || '');
  const [loading, setLoading] = useState(false);

  const canSubmit = name.trim().length > 0 && price.trim().length > 0;

  const handleSave = async () => {
    setLoading(true);
    try {
      if (isEditing) {
        await fieldsApi.update(subField.fieldId, {
          sportCenterId,
          name,
          type: fieldType,
          pricePerSlot: parseFloat(price),
        });
        Alert.alert('Thành công', 'Đã cập nhật sân con.', [
          { text: 'OK', onPress: () => navigation.goBack() }
        ]);
      } else {
        await fieldsApi.create({
          sportCenterId,
          name,
          type: fieldType,
          pricePerSlot: parseFloat(price),
        });
        Alert.alert('Thành công', 'Đã thêm sân con.', [
          { text: 'OK', onPress: () => navigation.goBack() }
        ]);
      }
    } catch (error) {
      console.error('Save sub field error:', error);
      Alert.alert('Lỗi', 'Không thể lưu thông tin. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} disabled={loading} style={{ padding: 5 }}>
          <Ionicons name="arrow-back" size={24} color="#0f172a" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{isEditing ? 'Sửa sân con' : 'Thêm sân con mới'}</Text>
        <View style={{ width: 34 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.label}>Tên sân con <Text style={{ color: 'red' }}>*</Text></Text>
        <TextInput
          style={styles.input}
          placeholder="VD: Sân A1, Sân bóng đá số 1"
          placeholderTextColor="#94a3b8"
          value={name}
          onChangeText={setName}
        />

        <Text style={styles.label}>Loại sân</Text>
        <View style={styles.typeRow}>
          {FIELD_TYPES.map(t => (
            <TouchableOpacity
              key={t}
              style={[styles.typeBtn, fieldType === t && styles.typeBtnActive]}
              onPress={() => setFieldType(t)}
            >
              <Text style={[styles.typeText, fieldType === t && styles.typeTextActive]}>{t}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>Giá mỗi giờ (VNĐ) <Text style={{ color: 'red' }}>*</Text></Text>
        <TextInput
          style={styles.input}
          placeholder="VD: 150000"
          placeholderTextColor="#94a3b8"
          keyboardType="numeric"
          value={price}
          onChangeText={setPrice}
        />
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity 
          style={[styles.submitBtn, !canSubmit && styles.submitBtnDisabled]} 
          onPress={handleSave}
          disabled={!canSubmit || loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.submitBtnText}>{isEditing ? 'LƯU THAY ĐỔI' : 'TẠO MỚI'}</Text>
          )}
        </TouchableOpacity>
      </View>
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
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#0f172a' },
  content: { padding: 20 },
  label: { fontSize: 14, fontWeight: '600', color: '#0f172a', marginBottom: 8, marginTop: 16 },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: '#0f172a',
  },
  typeRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  typeBtn: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  typeBtnActive: {
    backgroundColor: '#22c55e',
    borderColor: '#22c55e',
  },
  typeText: { fontSize: 14, color: '#64748b', fontWeight: '500' },
  typeTextActive: { color: '#fff' },
  footer: {
    padding: 20,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  submitBtn: {
    backgroundColor: '#22c55e',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  submitBtnDisabled: { backgroundColor: '#94a3b8' },
  submitBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});

export default AdminEditSubFieldScreen;
