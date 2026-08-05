import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 

  ScrollView, 
  TouchableOpacity 
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
// Dữ liệu giả lập
const DATES = [
  { day: 'T2', date: '5' },
  { day: 'T3', date: '6' },
  { day: 'T4', date: '7' },
  { day: 'T5', date: '8' },
  { day: 'T6', date: '9' },
];

const COURTS = ['Sân 1', 'Sân 2', 'Sân 3', 'Sân 4'];

const TIME_SLOTS = [
  { id: 1, time: '06:00 - 07:30', price: 120000, isBooked: false },
  { id: 2, time: '07:30 - 09:00', price: 120000, isBooked: true },
  { id: 3, time: '09:00 - 10:30', price: 120000, isBooked: false },
  { id: 4, time: '15:00 - 16:30', price: 150000, isBooked: false },
  { id: 5, time: '16:30 - 18:00', price: 180000, isBooked: false },
  { id: 6, time: '18:00 - 19:30', price: 200000, isBooked: false },
  { id: 7, time: '19:30 - 21:00', price: 200000, isBooked: false },
  { id: 8, time: '21:00 - 22:30', price: 150000, isBooked: false },
];

const SelectTimeScreen = ({ navigation }: { navigation: any }) => {
  const [selectedDate, setSelectedDate] = useState('5');
  const [selectedCourt, setSelectedCourt] = useState('Sân 1');
  const [selectedSlots, setSelectedSlots] = useState<number[]>([]);

  // Xử lý chọn/bỏ chọn khung giờ
  const toggleSlot = (id: number) => {
    if (selectedSlots.includes(id)) {
      setSelectedSlots(selectedSlots.filter(slotId => slotId !== id));
    } else {
      setSelectedSlots([...selectedSlots, id]);
    }
  };

  // Tính tổng tiền
  const totalPrice = selectedSlots.reduce((total, slotId) => {
    const slot = TIME_SLOTS.find(t => t.id === slotId);
    return total + (slot ? slot.price : 0);
  }, 0);
return (
    <SafeAreaView style={styles.container}>
      {/* 1. Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#1a1a1a" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Chọn lịch đặt sân</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* 2. Chọn Ngày */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Tháng 11</Text>
            <Ionicons name="calendar-outline" size={20} color="#22c55e" />
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.dateScroll}>
            {DATES.map((item, index) => {
              const isSelected = selectedDate === item.date;
              return (
                <TouchableOpacity 
                  key={index} 
                  style={[styles.dateItem, isSelected && styles.dateItemSelected]}
                  onPress={() => setSelectedDate(item.date)}
                >
                  <Text style={[styles.dayText, isSelected && styles.textWhite]}>{item.day}</Text>
                  <Text style={[styles.dateText, isSelected && styles.textWhite]}>{item.date}</Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* 3. Chọn Sân */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Chọn khu vực thi đấu</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.courtScroll}>
            {COURTS.map((court, index) => {
              const isSelected = selectedCourt === court;
              return (
                <TouchableOpacity 
                  key={index}
                  style={[styles.courtItem, isSelected && styles.courtItemSelected]}
                  onPress={() => setSelectedCourt(court)}
                >
                  <Text style={[styles.courtText, isSelected && styles.textWhite]}>{court}</Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* 4. Chọn Khung Giờ */}
        <View style={styles.section}>
          <View style={styles.legendRow}>
            <Text style={styles.sectionTitle}>Khung giờ thi đấu</Text>
            <View style={styles.legendItems}>
              <View style={styles.legendBox}><View style={[styles.colorBox, { backgroundColor: '#f2f4f6' }]} /><Text style={styles.legendText}>Trống</Text></View>
              <View style={styles.legendBox}><View style={[styles.colorBox, { backgroundColor: '#22c55e' }]} /><Text style={styles.legendText}>Đang chọn</Text></View>
            </View>
          </View>

          <View style={styles.slotsGrid}>
            {TIME_SLOTS.map((slot) => {
              const isSelected = selectedSlots.includes(slot.id);
              return (
                <TouchableOpacity
                  key={slot.id}
                  disabled={slot.isBooked}
                  style={[
                    styles.slotItem,
                    isSelected && styles.slotItemSelected,
                    slot.isBooked && styles.slotItemBooked
                  ]}
                  onPress={() => toggleSlot(slot.id)}
                >
                  <Text style={[styles.slotTime, isSelected && styles.textWhite, slot.isBooked && styles.textDisabled]}>
                    {slot.time}
                  </Text>
                  <Text style={[styles.slotPrice, isSelected && styles.textWhite, slot.isBooked && styles.textDisabled]}>
                    {slot.isBooked ? 'Đã đặt' : `${slot.price.toLocaleString('vi-VN')}đ`}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

      </ScrollView>

      {/* 5. Thanh Tổng tiền & Tiếp tục */}
      <View style={styles.bottomBar}>
        <View style={styles.priceContainer}>
          <Text style={styles.totalLabel}>Tổng cộng</Text>
          <Text style={styles.totalPrice}>{totalPrice.toLocaleString('vi-VN')}đ</Text>
        </View>
        <TouchableOpacity 
          style={[styles.continueButton, selectedSlots.length === 0 && styles.buttonDisabled]}
          disabled={selectedSlots.length === 0}
          onPress={() => navigation.navigate('AddonServiceScreen')}
        >
          <Text style={styles.continueButtonText}>Tiếp tục</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ffffff' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f2f4f6',
  },
  backButton: { padding: 4 },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#1a1a1a' },
  scrollContent: { paddingBottom: 100 },
  section: { paddingVertical: 20, borderBottomWidth: 8, borderBottomColor: '#f2f4f6' },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, marginBottom: 16 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#1a1a1a', paddingHorizontal: 20 },
  dateScroll: { paddingHorizontal: 20, gap: 12 },
  dateItem: {
    width: 60,
    height: 72,
    backgroundColor: '#f8fafc',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  dateItemSelected: { backgroundColor: '#006e2f', borderColor: '#006e2f' },
  dayText: { fontSize: 13, color: '#666', marginBottom: 4 },
  dateText: { fontSize: 20, fontWeight: 'bold', color: '#1a1a1a' },
  textWhite: { color: '#ffffff' },
  courtScroll: { paddingHorizontal: 20, gap: 12, marginTop: 16 },
  courtItem: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: '#f8fafc',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  courtItemSelected: { backgroundColor: '#1E40AF', borderColor: '#1E40AF' }, // Màu Deep Sporty Blue
  courtText: { fontSize: 14, fontWeight: '600', color: '#666' },
  legendRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  legendItems: { flexDirection: 'row', gap: 12, paddingRight: 20 },
  legendBox: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  colorBox: { width: 12, height: 12, borderRadius: 4 },
  legendText: { fontSize: 12, color: '#666' },
  slotsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16, // Giảm padding ngang để các item đều nhau hơn
    justifyContent: 'space-between',
  },
  slotItem: {
    width: '47%', // Chiếm gần 1 nửa màn hình
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 12,
  },
  slotItemSelected: { backgroundColor: '#22c55e', borderColor: '#22c55e' },
  slotItemBooked: { backgroundColor: '#e2e8f0', borderColor: '#cbd5e1' },
  slotTime: { fontSize: 14, fontWeight: 'bold', color: '#1a1a1a', marginBottom: 4 },
  slotPrice: { fontSize: 13, color: '#22c55e', fontWeight: '600' },
  textDisabled: { color: '#94a3b8' },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#e0e3e5',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
  },
  priceContainer: { flex: 1 },
  totalLabel: { fontSize: 13, color: '#666', marginBottom: 2 },
  totalPrice: { fontSize: 22, fontWeight: 'bold', color: '#1a1a1a' },
  continueButton: {
    backgroundColor: '#22c55e',
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 12,
  },
  buttonDisabled: { backgroundColor: '#a5d6a7' },
  continueButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});

export default SelectTimeScreen;