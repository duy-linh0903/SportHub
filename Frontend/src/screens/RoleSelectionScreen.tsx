import React, { useState } from 'react';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { RootStackParamList } from '../../App';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'RoleSelection'>;
};

const RoleSelectionScreen = ({ navigation }: Props) => {
  // Trạng thái lưu trữ vai trò đang được chọn: 'customer' (Người thuê) hoặc 'admin' (Chủ sân)
  const [selectedRole, setSelectedRole] = useState<'customer' | 'admin' | null>(null);

  const handleContinue = () => {
    if (selectedRole === 'customer') {
      
      navigation.replace('MainTab');
    } else if (selectedRole === 'admin') {
        navigation.replace('AdminTab');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Bạn là ai?</Text>
          <Text style={styles.subtitle}>Vui lòng chọn vai trò để chúng tôi tối ưu hóa trải nghiệm của bạn trên SportHub.</Text>
        </View>

        <View style={styles.roleContainer}>
          {/* Card Người thuê sân */}
          <TouchableOpacity 
            style={[styles.roleCard, selectedRole === 'customer' && styles.roleCardActive]}
            onPress={() => setSelectedRole('customer')}
            activeOpacity={0.8}
          >
            <View style={styles.iconContainer}>
              <Ionicons 
                name="person" 
                size={32} 
                color={selectedRole === 'customer' ? '#22c55e' : '#666'} 
              />
            </View>
            <Text style={[styles.roleTitle, selectedRole === 'customer' && styles.textActive]}>Người thuê sân</Text>
            <Text style={styles.roleDesc}>Tìm kiếm, đặt lịch và tham gia các hoạt động thể thao.</Text>
            
            {/* Dấu tick khi được chọn */}
            {selectedRole === 'customer' && (
              <View style={styles.checkIcon}>
                <Ionicons name="checkmark-circle" size={24} color="#22c55e" />
              </View>
            )}
          </TouchableOpacity>

          {/* Card Chủ sân */}
          <TouchableOpacity 
            style={[styles.roleCard, selectedRole === 'admin' && styles.roleCardActive]}
            onPress={() => setSelectedRole('admin')}
            activeOpacity={0.8}
          >
            <View style={styles.iconContainer}>
              <Ionicons 
                name="business" 
                size={32} 
                color={selectedRole === 'admin' ? '#22c55e' : '#666'} 
              />
            </View>
            <Text style={[styles.roleTitle, selectedRole === 'admin' && styles.textActive]}>Chủ sân</Text>
            <Text style={styles.roleDesc}>Quản lý sân bãi, theo dõi lịch đặt và doanh thu.</Text>
            
            {selectedRole === 'admin' && (
              <View style={styles.checkIcon}>
                <Ionicons name="checkmark-circle" size={24} color="#22c55e" />
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity 
          style={[styles.primaryButton, !selectedRole && styles.primaryButtonDisabled]}
          disabled={!selectedRole}
          onPress={handleContinue}
        >
          <Text style={styles.primaryButtonText}>Tiếp tục →</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f4f6f8' },
  content: { flex: 1, padding: 24, justifyContent: 'center' },
  header: { marginBottom: 40, alignItems: 'center' },
  title: { fontSize: 28, fontWeight: 'bold', color: '#1a1a1a', marginBottom: 12 },
  subtitle: { fontSize: 14, color: '#666', textAlign: 'center', lineHeight: 22, paddingHorizontal: 20 },
  roleContainer: { gap: 16 },
  roleCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    borderWidth: 2,
    borderColor: '#e0e0e0',
    position: 'relative',
  },
  roleCardActive: {
    borderColor: '#22c55e',
    backgroundColor: '#f0fdf4', // Xanh nhạt
  },
  iconContainer: { marginBottom: 16 },
  roleTitle: { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 8 },
  roleDesc: { fontSize: 13, color: '#666', lineHeight: 20, paddingRight: 20 },
  textActive: { color: '#006e2f' },
  checkIcon: { position: 'absolute', top: 20, right: 20 },
  footer: { padding: 24, backgroundColor: '#fff', borderTopWidth: 1, borderColor: '#eee' },
  primaryButton: {
    backgroundColor: '#006e2f',
    height: 54,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  primaryButtonDisabled: { backgroundColor: '#a5d6a7' },
  primaryButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});

export default RoleSelectionScreen;