import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { servicesApi } from '../api/servicesApi';
import { ServiceResponseDto } from '../types/api';

const AddonServiceScreen = ({ navigation, route }: { navigation: any; route: any }) => {
  const [services, setServices] = useState<ServiceResponseDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [quantities, setQuantities] = useState<Record<string, number>>({});

  useEffect(() => {
    fetchServices();
  }, [route?.params?.bookingData?.sportCenterId]);

  const fetchServices = async () => {
    setLoading(true);
    try {
      const sportCenterId = route?.params?.bookingData?.sportCenterId;
      if (!sportCenterId) return;
      const data = await servicesApi.getBySportCenter(sportCenterId);
      setServices(data);
    } catch (error) {
      console.error('Failed to fetch services:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = (id: string, delta: number) => {
    setQuantities((prev) => {
      const current = prev[id] || 0;
      const next = Math.max(0, current + delta);
      return { ...prev, [id]: next };
    });
  };

  const selectedServices = services.filter((s) => (quantities[s.serviceId] || 0) > 0);
  const totalPrice = selectedServices.reduce(
    (sum, s) => sum + s.price * (quantities[s.serviceId] || 0),
    0,
  );
  const totalItems = selectedServices.reduce((sum, s) => sum + (quantities[s.serviceId] || 0), 0);

  const handleContinue = () => {
    navigation.navigate('Checkout', {
      ...route?.params,
      selectedServices: selectedServices.map((s) => ({
        ...s,
        quantity: quantities[s.serviceId],
      })),
    });
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#22c55e" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={26} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Dịch vụ đi kèm</Text>
        <View style={{ width: 26 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.sectionTitle}>Tiện ích sân tập</Text>
        <Text style={styles.sectionSubtitle}>
          Chọn thêm các dịch vụ có sẵn tại sân để trải nghiệm tốt nhất khi thi đấu.
        </Text>

        {services.map((service) => (
          <View key={service.serviceId} style={styles.serviceCard}>
            <View style={styles.serviceIconWrap}>
              <Ionicons name="pricetag-outline" size={22} color="#22c55e" />
            </View>

            <View style={styles.serviceInfo}>
              <Text style={styles.serviceName}>{service.name}</Text>
              <Text style={styles.servicePrice}>
                {service.price.toLocaleString('vi-VN')}đ
              </Text>
            </View>

            <View style={styles.quantityControl}>
              <TouchableOpacity
                style={styles.quantityButton}
                onPress={() => updateQuantity(service.serviceId, -1)}
              >
                <Ionicons name="remove" size={18} color="#6b7280" />
              </TouchableOpacity>
              <Text style={styles.quantityText}>{quantities[service.serviceId] || 0}</Text>
              <TouchableOpacity
                style={styles.quantityButton}
                onPress={() => updateQuantity(service.serviceId, 1)}
              >
                <Ionicons name="add" size={18} color="#22c55e" />
              </TouchableOpacity>
            </View>
          </View>
        ))}

        <View style={styles.noteBox}>
          <Ionicons name="information-circle-outline" size={18} color="#1E40AF" />
          <Text style={styles.noteText}>
            Bạn có thể thanh toán các dịch vụ này trực tiếp tại quầy hoặc thanh toán cùng tiền sân.
          </Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <View>
          <Text style={styles.footerTotalLabel}>Tạm tính dịch vụ</Text>
          <Text style={styles.footerTotalValue}>
            {totalPrice.toLocaleString('vi-VN')}đ
          </Text>
          <Text style={styles.footerItemCount}>{totalItems} dịch vụ đã chọn</Text>
        </View>
        <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
          <Text style={styles.continueButtonText}>Tiếp tục</Text>
          <Ionicons name="arrow-forward" size={18} color="#fff" />
        </TouchableOpacity>
      </View>
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
    borderBottomColor: '#f0f0f0',
  },
  headerTitle: { fontSize: 16, fontWeight: '600', color: '#111827' },
  scrollContent: { padding: 16, paddingBottom: 24 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#111827', marginBottom: 4 },
  sectionSubtitle: { fontSize: 13, color: '#6b7280', marginBottom: 16, lineHeight: 18 },
  serviceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
    borderRadius: 14,
    padding: 12,
    marginBottom: 12,
  },
  serviceIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#dcfce7',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  serviceInfo: { flex: 1 },
  serviceName: { fontSize: 14, fontWeight: '600', color: '#111827' },
  servicePrice: { fontSize: 13, color: '#6b7280', marginTop: 2 },
  quantityControl: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  quantityButton: { padding: 8 },
  quantityText: { minWidth: 20, textAlign: 'center', fontSize: 14, fontWeight: '600' },
  noteBox: {
    flexDirection: 'row',
    backgroundColor: '#eff6ff',
    borderRadius: 12,
    padding: 12,
    marginTop: 8,
    gap: 8,
  },
  noteText: { flex: 1, fontSize: 12, color: '#1E40AF', lineHeight: 17 },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  footerTotalLabel: { fontSize: 12, color: '#6b7280' },
  footerTotalValue: { fontSize: 18, fontWeight: '700', color: '#111827' },
  footerItemCount: { fontSize: 11, color: '#9ca3af' },
  continueButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#22c55e',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 14,
    gap: 6,
  },
  continueButtonText: { color: '#fff', fontWeight: '600', fontSize: 14 },
});

export default AddonServiceScreen;
