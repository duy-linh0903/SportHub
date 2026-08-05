import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';

// ===== Dummy Data - mô phỏng model Booking / Field / ServiceItem =====
interface SelectedService {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface PaymentMethod {
  id: string;
  name: string;
  icon: string;
  description: string;
}

const DUMMY_FIELD = {
  name: 'Sân Cầu Lông SportHub A1',
  address: 'Thiên Sơn Cao Cấp, Q7, TP.HCM',
  date: 'Thứ Bảy, 25 Tháng 10, 2023',
  time: '19:00 - 20:00 (2 giờ)',
  price: 240000,
};

const DUMMY_SELECTED_SERVICES: SelectedService[] = [
  { id: 'SV02', name: 'Thuê trọng tài', price: 200000, quantity: 1 },
  { id: 'SV03', name: 'Nước suối Aquafina', price: 10000, quantity: 3 },
];

const PAYMENT_METHODS: PaymentMethod[] = [
  { id: 'momo', name: 'Ví MoMo', icon: 'wallet-outline', description: 'Thanh toán qua ví MoMo' },
  { id: 'bank', name: 'Thẻ ngân hàng (ATM/Visa/Master)', icon: 'card-outline', description: 'Hỗ trợ hầu hết ngân hàng nội địa' },
  { id: 'cash', name: 'Tiền mặt tại quầy', icon: 'cash-outline', description: 'Thanh toán khi nhận sân' },
];

const CheckoutScreen = ({ navigation, route }: { navigation: any; route: any }) => {
  const field = route?.params?.field || DUMMY_FIELD;
  const selectedServices: SelectedService[] =
    route?.params?.selectedServices || DUMMY_SELECTED_SERVICES;
  const [selectedPayment, setSelectedPayment] = useState(PAYMENT_METHODS[0].id);

  const fieldPrice = field.price;
  const servicesPrice = selectedServices.reduce((sum, s) => sum + s.price * s.quantity, 0);
  const totalPrice = fieldPrice + servicesPrice;

  const handleConfirm = () => {
    navigation.navigate('BookingSuccess', {
      field,
      totalPrice,
      paymentMethod: selectedPayment,
    });
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={26} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Xác nhận đặt sân</Text>
        <View style={{ width: 26 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.fieldCard}>
          <View style={styles.fieldThumb}>
            <Ionicons name="tennisball-outline" size={26} color="#22c55e" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.fieldName}>{field.name}</Text>
            <View style={styles.fieldRow}>
              <Ionicons name="calendar-outline" size={13} color="#6b7280" />
              <Text style={styles.fieldMeta}>{field.date}</Text>
            </View>
            <View style={styles.fieldRow}>
              <Ionicons name="time-outline" size={13} color="#6b7280" />
              <Text style={styles.fieldMeta}>{field.time}</Text>
            </View>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Dịch vụ đã chọn</Text>
        {selectedServices.length === 0 ? (
          <Text style={styles.emptyText}>Không có dịch vụ đi kèm</Text>
        ) : (
          selectedServices.map((s) => (
            <View key={s.id} style={styles.serviceRow}>
              <Text style={styles.serviceRowName}>
                {s.quantity} x {s.name}
              </Text>
              <Text style={styles.serviceRowPrice}>
                {(s.price * s.quantity).toLocaleString('vi-VN')}đ
              </Text>
            </View>
          ))
        )}

        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Phương thức thanh toán</Text>
          <TouchableOpacity onPress={() => navigation.navigate('PaymentMethod')}>
            <Text style={styles.changeLink}>Xem tất cả</Text>
          </TouchableOpacity>
        </View>

        {PAYMENT_METHODS.map((method) => {
          const isSelected = selectedPayment === method.id;
          return (
            <TouchableOpacity
              key={method.id}
              style={[styles.paymentCard, isSelected && styles.paymentCardSelected]}
              onPress={() => setSelectedPayment(method.id)}
            >
              <View
                style={[
                  styles.paymentIconWrap,
                  isSelected && { backgroundColor: '#22c55e' },
                ]}
              >
                <Ionicons
                  name={method.icon}
                  size={18}
                  color={isSelected ? '#fff' : '#6b7280'}
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.paymentName}>{method.name}</Text>
                <Text style={styles.paymentDesc}>{method.description}</Text>
              </View>
              <Ionicons
                name={isSelected ? 'radio-button-on' : 'radio-button-off'}
                size={20}
                color={isSelected ? '#22c55e' : '#d1d5db'}
              />
            </TouchableOpacity>
          );
        })}

        <View style={styles.summaryBox}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Giá thuê sân (2h)</Text>
            <Text style={styles.summaryValue}>{fieldPrice.toLocaleString('vi-VN')}đ</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Dịch vụ đi kèm</Text>
            <Text style={styles.summaryValue}>{servicesPrice.toLocaleString('vi-VN')}đ</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.summaryRow}>
            <Text style={styles.summaryTotalLabel}>Tổng cộng</Text>
            <Text style={styles.summaryTotalValue}>
              {totalPrice.toLocaleString('vi-VN')}đ
            </Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <View>
          <Text style={styles.footerTotalLabel}>Tổng thanh toán</Text>
          <Text style={styles.footerTotalValue}>{totalPrice.toLocaleString('vi-VN')}đ</Text>
        </View>
        <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
          <Text style={styles.confirmButtonText}>Xác nhận đặt sân</Text>
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
  fieldCard: {
    flexDirection: 'row',
    backgroundColor: '#f9fafb',
    borderRadius: 14,
    padding: 12,
    marginBottom: 20,
  },
  fieldThumb: {
    width: 56,
    height: 56,
    borderRadius: 12,
    backgroundColor: '#dcfce7',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  fieldName: { fontSize: 15, fontWeight: '700', color: '#111827', marginBottom: 4 },
  fieldRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 },
  fieldMeta: { fontSize: 12, color: '#6b7280' },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: '#111827', marginBottom: 10 },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  changeLink: { fontSize: 12, color: '#1E40AF', fontWeight: '600' },
  emptyText: { fontSize: 13, color: '#9ca3af', marginBottom: 16 },
  serviceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  serviceRowName: { fontSize: 13, color: '#374151' },
  serviceRowPrice: { fontSize: 13, color: '#374151', fontWeight: '600' },
  paymentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#e5e7eb',
    borderRadius: 14,
    padding: 12,
    marginBottom: 10,
    gap: 12,
  },
  paymentCardSelected: { borderColor: '#22c55e', backgroundColor: '#f0fdf4' },
  paymentIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  paymentName: { fontSize: 13, fontWeight: '600', color: '#111827' },
  paymentDesc: { fontSize: 11, color: '#9ca3af', marginTop: 2 },
  summaryBox: {
    backgroundColor: '#f9fafb',
    borderRadius: 14,
    padding: 16,
    marginTop: 16,
  },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  summaryLabel: { fontSize: 13, color: '#6b7280' },
  summaryValue: { fontSize: 13, color: '#374151' },
  divider: { height: 1, backgroundColor: '#e5e7eb', marginVertical: 4 },
  summaryTotalLabel: { fontSize: 14, fontWeight: '700', color: '#111827' },
  summaryTotalValue: { fontSize: 16, fontWeight: '700', color: '#22c55e' },
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
  confirmButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#22c55e',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 14,
    gap: 6,
  },
  confirmButtonText: { color: '#fff', fontWeight: '600', fontSize: 14 },
});

export default CheckoutScreen;
