import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { launchImageLibrary } from 'react-native-image-picker';
import { uploadApi } from '../api/uploadApi';
import { sportCentersApi } from '../api/sportCentersApi';
import { fieldsApi } from '../api/fieldsApi';

const FIELD_TYPES = ['Bóng đá', 'Cầu lông', 'Tennis', 'Bóng rổ'];

const AdminEditFieldScreen = ({ navigation, route }: { navigation: any; route: any }) => {
  const existingField = route?.params?.field;
  const isEditing = !!existingField;

  const [name, setName] = useState(existingField?.name || '');
  const [fieldType, setFieldType] = useState(FIELD_TYPES[0]);
  const [address, setAddress] = useState(existingField?.address || '');
  const [description, setDescription] = useState(existingField?.description || '');
  const [price, setPrice] = useState(existingField?.price?.replace(/\D/g, '') || '');
  const [imageUri, setImageUri] = useState<string | null>(existingField?.imageUrl || null);
  const [loading, setLoading] = useState(false);

  const canSubmit = name.trim().length > 0 && address.trim().length > 0 && price.trim().length > 0;

  const handlePickImage = async () => {
    const result = await launchImageLibrary({ mediaType: 'photo', quality: 0.8 });
    if (result.assets && result.assets.length > 0) {
      setImageUri(result.assets[0].uri || null);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      let uploadedUrl = imageUri;
      // Nếu là ảnh mới chọn từ thiết bị (không phải http)
      if (imageUri && !imageUri.startsWith('http')) {
        const file = {
          uri: imageUri,
          name: `field_${Date.now()}.jpg`,
          type: 'image/jpeg',
        };
        const uploadRes = await uploadApi.uploadFile(file);
        uploadedUrl = uploadRes.url;
      }

      if (isEditing) {
        // Cập nhật SportCenter
        await sportCentersApi.update(existingField.id, {
          name,
          address,
          description,
        });
        Alert.alert('Thành công', 'Đã cập nhật thông tin sân.', [
          { text: 'OK', onPress: () => navigation.goBack() }
        ]);
      } else {
        // Tạo SportCenter mới
        const sc = await sportCentersApi.create({
          name,
          address,
          description,
          images: uploadedUrl ? [{ url: uploadedUrl }] : [],
        } as any);

        // Tạo Field
        await fieldsApi.create({
          sportCenterId: sc.sportCenterId,
          name: name,
          type: fieldType,
          pricePerSlot: parseFloat(price),
        });

        Alert.alert('Thành công', 'Đã thêm sân mới.', [
          { text: 'OK', onPress: () => navigation.goBack() }
        ]);
      }
    } catch (error) {
      console.error('Save field error:', error);
      Alert.alert('Lỗi', 'Không thể lưu thông tin. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} disabled={loading}>
          <Ionicons name="arrow-back" size={24} color="#1a1a1a" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{isEditing ? 'Chỉnh sửa thông tin sân' : 'Thêm sân mới'}</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.sectionTitle}>Thông tin cơ bản</Text>

        <Text style={styles.label}>Tên sân</Text>
        <TextInput
          style={styles.input}
          placeholder="VD: Sân Cầu Lông A1"
          placeholderTextColor="#999"
          value={name}
          onChangeText={setName}
        />

        <Text style={styles.label}>Loại sân</Text>
        <View style={styles.typeRow}>
          {FIELD_TYPES.map((type) => {
            const isSelected = fieldType === type;
            return (
              <TouchableOpacity
                key={type}
                style={[styles.typeChip, isSelected && styles.typeChipSelected]}
                onPress={() => setFieldType(type)}
              >
                <Text style={[styles.typeChipText, isSelected && styles.typeChipTextSelected]}>{type}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <Text style={styles.label}>Địa chỉ</Text>
        <TextInput
          style={styles.input}
          placeholder="Số nhà, đường, quận, thành phố"
          placeholderTextColor="#999"
          value={address}
          onChangeText={setAddress}
        />

        <Text style={styles.label}>Mô tả chi tiết</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Mô tả sân, tiện ích, quy định..."
          placeholderTextColor="#999"
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={4}
          textAlignVertical="top"
        />

        <Text style={styles.sectionTitle}>Hình ảnh sân</Text>
        <View style={styles.imageRow}>
          {imageUri ? (
            <TouchableOpacity onPress={handlePickImage}>
              <Image source={{ uri: imageUri.startsWith('http') ? imageUri : `http://10.0.2.2:5115${imageUri}` }} style={styles.previewImage} />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.addImageBox} onPress={handlePickImage}>
              <Ionicons name="camera-outline" size={22} color="#666" />
              <Text style={styles.addImageText}>Thêm ảnh</Text>
            </TouchableOpacity>
          )}
        </View>

        <Text style={styles.sectionTitle}>Giá thuê</Text>
        <Text style={styles.label}>Giá theo giờ (VNĐ)</Text>
        <View style={styles.priceInputWrap}>
          <TextInput
            style={styles.priceInput}
            placeholder="0"
            placeholderTextColor="#999"
            value={price}
            onChangeText={(t) => setPrice(t.replace(/\D/g, ''))}
            keyboardType="numeric"
          />
          <Text style={styles.priceUnit}>đ/giờ</Text>
        </View>

        <TouchableOpacity
          style={[styles.saveButton, (!canSubmit || loading) && styles.saveButtonDisabled]}
          disabled={!canSubmit || loading}
          onPress={handleSave}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Ionicons name="save-outline" size={18} color="#fff" />
              <Text style={styles.saveButtonText}>{isEditing ? 'Lưu thay đổi' : 'Thêm sân'}</Text>
            </>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f2f4f6',
  },
  headerTitle: { fontSize: 15, fontWeight: '600', color: '#1a1a1a', flex: 1, textAlign: 'center' },
  content: { padding: 20, paddingBottom: 40 },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: '#1a1a1a', marginBottom: 14, marginTop: 8 },
  label: { fontSize: 13, fontWeight: '600', color: '#333', marginBottom: 8 },
  input: {
    backgroundColor: '#f2f4f6',
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 48,
    fontSize: 14,
    color: '#1a1a1a',
    marginBottom: 16,
  },
  textArea: { height: 100, paddingTop: 12 },
  typeRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 16 },
  typeChip: {
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 10,
    backgroundColor: '#f2f4f6',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  typeChipSelected: { backgroundColor: '#22c55e', borderColor: '#22c55e' },
  typeChipText: { fontSize: 13, fontWeight: '600', color: '#666' },
  typeChipTextSelected: { color: '#fff' },
  imageRow: { flexDirection: 'row', gap: 12, marginBottom: 16 },
  addImageBox: {
    width: 80,
    height: 80,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#e2e8f0',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
  },
  addImageText: { fontSize: 10, color: '#666' },
  previewImage: { width: 80, height: 80, borderRadius: 12 },
  priceInputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f2f4f6',
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 48,
    marginBottom: 24,
  },
  priceInput: { flex: 1, fontSize: 14, color: '#1a1a1a' },
  priceUnit: { fontSize: 13, color: '#666', fontWeight: '600' },
  saveButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#22c55e',
    paddingVertical: 15,
    borderRadius: 12,
  },
  saveButtonDisabled: { backgroundColor: '#d1d5db' },
  saveButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 15 },
});

export default AdminEditFieldScreen;
