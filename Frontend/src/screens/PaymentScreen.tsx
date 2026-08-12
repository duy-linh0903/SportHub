import React, { useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import QRCode from 'react-native-qrcode-svg';

const PaymentScreen = ({ navigation, route }: { navigation: any; route: any }) => {
  const { bookingData, totalPrice, selectedPayment, bookingCode } = route.params;

  // Mock payment success for school project
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace('BookingSuccess', {
        field: bookingData.field,
        totalPrice,
        paymentMethod: selectedPayment,
        bookingCode: bookingCode || `VNP-${Math.floor(Math.random() * 100000)}`,
      });
    }, 5000); // Navigate after 5 seconds to simulate successful payment

    return () => clearTimeout(timer); // Cleanup
  }, [navigation, bookingData, totalPrice, selectedPayment, bookingCode]);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => {
          Alert.alert(
            'Huỷ thanh toán?',
            'Bạn có chắc chắn muốn huỷ giao dịch này?',
            [
              { text: 'Không', style: 'cancel' },
              { text: 'Huỷ giao dịch', style: 'destructive', onPress: () => navigation.goBack() }
            ]
          );
        }}>
          <Ionicons name="close" size={26} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Thanh toán VNPAY</Text>
        <View style={{ width: 26 }} />
      </View>

      <View style={styles.content}>
        <Text style={styles.instructionText}>Sử dụng ứng dụng ngân hàng hoặc ví VNPAY để quét mã QR dưới đây</Text>
        
        <View style={styles.qrContainer}>
          <QRCode
            value={`VNPAY-${bookingData.fieldId}-${totalPrice}`}
            size={220}
            color="#005A9E"
            backgroundColor="white"
          />
        </View>

        <Text style={styles.priceLabel}>Số tiền cần thanh toán</Text>
        <Text style={styles.priceText}>{totalPrice.toLocaleString('vi-VN')} đ</Text>
        
        <View style={styles.waitingContainer}>
          <ActivityIndicator size="small" color="#22c55e" />
          <Text style={styles.waitingText}>Hệ thống đang chờ thanh toán...</Text>
        </View>

        <TouchableOpacity 
          style={styles.mockButton}
          onPress={() => {
            navigation.replace('BookingSuccess', {
              field: bookingData.field,
              totalPrice,
              paymentMethod: selectedPayment,
              bookingCode: bookingCode || `VNP-${Math.floor(Math.random() * 100000)}`,
            });
          }}
        >
          <Text style={styles.mockButtonText}>Đã thanh toán (Mô phỏng)</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    textAlign: 'center',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 40,
    paddingHorizontal: 20,
  },
  instructionText: {
    fontSize: 15,
    color: '#4b5563',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 22,
  },
  qrContainer: {
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    marginBottom: 30,
  },
  priceLabel: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 4,
  },
  priceText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 40,
  },
  waitingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 40,
  },
  waitingText: {
    marginLeft: 10,
    fontSize: 15,
    color: '#059669',
    fontWeight: '500',
  },
  mockButton: {
    backgroundColor: '#2563eb',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 8,
  },
  mockButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  }
});

export default PaymentScreen;
