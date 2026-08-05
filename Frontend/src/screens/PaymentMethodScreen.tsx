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

// ===== Dummy Data - mô phỏng model PaymentMethod =====
interface PaymentMethod {
  id: string;
  name: string;
  icon: string;
  description: string;
  group: 'evoucher' | 'bank' | 'cash';
}

const PAYMENT_METHODS: PaymentMethod[] = [
  { id: 'momo', name: 'Ví MoMo', icon: 'wallet-outline', description: 'Liên kết ví MoMo của bạn', group: 'evoucher' },
  { id: 'zalopay', name: 'ZaloPay', icon: 'wallet-outline', description: 'Thanh toán nhanh qua ZaloPay', group: 'evoucher' },
  { id: 'vnpay', name: 'VNPay', icon: 'qr-code-outline', description: 'Quét mã VNPay-QR', group: 'evoucher' },
  { id: 'bank', name: 'Thẻ ngân hàng (ATM/Visa/Master)', icon: 'card-outline', description: 'Hỗ trợ hầu hết ngân hàng nội địa', group: 'bank' },
  { id: 'cash', name: 'Tiền mặt tại quầy', icon: 'cash-outline', description: 'Thanh toán khi nhận sân', group: 'cash' },
];

const GROUP_LABELS: Record<string, string> = {
  evoucher: 'Ví điện tử',
  bank: 'Ngân hàng',
  cash: 'Khác',
};

const PaymentMethodScreen = ({ navigation, route }: { navigation: any; route: any }) => {
  const [selected, setSelected] = useState(route?.params?.currentMethod || 'cash');

  const groups = ['evoucher', 'bank', 'cash'] as const;

  const handleConfirm = () => {
    navigation.navigate({
      name: 'Checkout',
      params: { selectedPayment: selected },
      merge: true,
    });
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={26} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Phương thức thanh toán</Text>
        <View style={{ width: 26 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {groups.map((group) => (
          <View key={group} style={{ marginBottom: 20 }}>
            <Text style={styles.groupLabel}>{GROUP_LABELS[group]}</Text>
            {PAYMENT_METHODS.filter((m) => m.group === group).map((method) => {
              const isSelected = selected === method.id;
              return (
                <TouchableOpacity
                  key={method.id}
                  style={[styles.methodCard, isSelected && styles.methodCardSelected]}
                  onPress={() => setSelected(method.id)}
                >
                  <View
                    style={[
                      styles.iconWrap,
                      isSelected && { backgroundColor: '#22c55e' },
                    ]}
                  >
                    <Ionicons
                      name={method.icon}
                      size={20}
                      color={isSelected ? '#fff' : '#6b7280'}
                    />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.methodName}>{method.name}</Text>
                    <Text style={styles.methodDesc}>{method.description}</Text>
                  </View>
                  <Ionicons
                    name={isSelected ? 'radio-button-on' : 'radio-button-off'}
                    size={20}
                    color={isSelected ? '#22c55e' : '#d1d5db'}
                  />
                </TouchableOpacity>
              );
            })}
          </View>
        ))}
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
          <Text style={styles.confirmButtonText}>Xác nhận</Text>
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
  groupLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#9ca3af',
    textTransform: 'uppercase',
    marginBottom: 10,
  },
  methodCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#e5e7eb',
    borderRadius: 14,
    padding: 12,
    marginBottom: 10,
    gap: 12,
  },
  methodCardSelected: { borderColor: '#22c55e', backgroundColor: '#f0fdf4' },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  methodName: { fontSize: 13, fontWeight: '600', color: '#111827' },
  methodDesc: { fontSize: 11, color: '#9ca3af', marginTop: 2 },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  confirmButton: {
    backgroundColor: '#22c55e',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
  },
  confirmButtonText: { color: '#fff', fontWeight: '700', fontSize: 15 },
});

export default PaymentMethodScreen;
