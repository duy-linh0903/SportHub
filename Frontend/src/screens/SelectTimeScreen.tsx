import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  ActivityIndicator
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RootStackParamList } from '../../App';
import { fieldsApi } from '../api/fieldsApi';
import { bookingsApi } from '../api/bookingsApi';
import { FieldResponseDto, SportCenterResponseDto } from '../types/api';
import { sportCentersApi } from '../api/sportCentersApi';
import { format, addDays } from 'date-fns';
import { vi } from 'date-fns/locale';

type SelectTimeScreenRouteProp = RouteProp<RootStackParamList, 'SelectTime'>;
type SelectTimeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'SelectTime'>;

type Props = {
  route: SelectTimeScreenRouteProp;
  navigation: SelectTimeScreenNavigationProp;
};

// Generate 14 dates from today
const generateDates = () => {
  return Array.from({ length: 14 }).map((_, index) => {
    const date = addDays(new Date(), index);
    return {
      day: format(date, 'E', { locale: vi }),
      date: format(date, 'd'),
      fullDate: format(date, 'yyyy-MM-dd')
    };
  });
};
const DATES = generateDates();

// Generate 14 time slots based on backend seed data (07:00 to 21:00)
const TIME_SLOTS = Array.from({ length: 14 }).map((_, index) => {
  const hex = (0x400 + index).toString(16).padStart(12, '0');
  const id = `00000000-0000-0000-0000-${hex}`;
  const start = 7 + index;
  const end = 8 + index;
  return {
    id,
    time: `${start.toString().padStart(2, '0')}:00 - ${end.toString().padStart(2, '0')}:00`,
    start,
    end
  };
});

const SelectTimeScreen = ({ route, navigation }: Props) => {
  const sportCenterId = route.params?.sportCenterId;
  const [sportCenter, setSportCenter] = useState<SportCenterResponseDto | null>(null);
  const [fields, setFields] = useState<FieldResponseDto[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedDate, setSelectedDate] = useState(DATES[0]);
  const [selectedField, setSelectedField] = useState<FieldResponseDto | null>(null);
  const [selectedSlots, setSelectedSlots] = useState<string[]>([]);
  const [bookedSlots, setBookedSlots] = useState<string[]>([]);

  useEffect(() => {
    if (sportCenterId) {
      fetchFields();
    }
  }, [sportCenterId]);

  useEffect(() => {
    if (selectedField && selectedDate) {
      fetchBookedSlots();
    }
  }, [selectedField, selectedDate]);

  const fetchBookedSlots = async () => {
    try {
      if (!selectedField) return;
      const slots = await bookingsApi.getBookedSlots(selectedField.fieldId, selectedDate.fullDate);
      setBookedSlots(slots);
      
      // If any selected slot is now booked, remove it from selection
      setSelectedSlots(prev => prev.filter(id => !slots.includes(id)));
    } catch (error) {
      console.error('Failed to fetch booked slots:', error);
    }
  };

  const fetchFields = async () => {
    setLoading(true);
    try {
      if (sportCenterId) {
        const centerData = await sportCentersApi.getById(sportCenterId);
        setSportCenter(centerData);
      }
      const data = await fieldsApi.getBySportCenter(sportCenterId!);
      setFields(data);
      if (data.length > 0) {
        setSelectedField(data[0]);
      }
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Xử lý chọn/bỏ chọn khung giờ
  const toggleSlot = (id: string) => {
    if (selectedSlots.includes(id)) {
      setSelectedSlots(selectedSlots.filter(slotId => slotId !== id));
    } else {
      setSelectedSlots([...selectedSlots, id]);
    }
  };

  // Tính tổng tiền
  const totalPrice = selectedSlots.reduce((total, _) => {
    return total + (selectedField ? selectedField.pricePerSlot : 0);
  }, 0);

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#006e2f" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* 1. Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#1a1a1a" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{sportCenter?.name || route.params?.sportCenterName || 'Đặt sân'}</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Thông tin sân */}
      <View style={styles.venueInfo}>
        <Text style={styles.venueName}>{sportCenter?.name || route.params?.sportCenterName || 'Tên sân'}</Text>
        <Text style={styles.venueAddress}>{sportCenter?.address || route.params?.sportCenterAddress || 'Địa chỉ sân'}</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* 2. Chọn Ngày */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Chọn ngày thi đấu</Text>
            <Ionicons name="calendar-outline" size={20} color="#22c55e" />
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.dateScroll}>
            {DATES.map((item, index) => {
              const isSelected = selectedDate.fullDate === item.fullDate;
              return (
                <TouchableOpacity 
                  key={index} 
                  style={[styles.dateItem, isSelected && styles.dateItemSelected]}
                  onPress={() => {
                    setSelectedDate(item);
                    setSelectedSlots([]); // Reset slots on date change
                  }}
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
            {fields.map((field) => {
              const isSelected = selectedField?.fieldId === field.fieldId;
              return (
                <TouchableOpacity 
                  key={field.fieldId}
                  style={[styles.courtItem, isSelected && styles.courtItemSelected]}
                  onPress={() => {
                    setSelectedField(field);
                    setSelectedSlots([]); // Reset slots on field change
                  }}
                >
                  <Text style={[styles.courtText, isSelected && styles.textWhite]}>{field.name}</Text>
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
              const isBookedOriginal = bookedSlots.includes(slot.id); 
              
              const isToday = selectedDate.fullDate === format(new Date(), 'yyyy-MM-dd');
              const currentHour = new Date().getHours();
              const isPast = isToday && slot.start <= currentHour;
              
              const isDisabled = isBookedOriginal || isPast;

              return (
                <TouchableOpacity
                  key={slot.id}
                  disabled={isDisabled}
                  style={[
                    styles.slotItem,
                    isSelected && styles.slotItemSelected,
                    isDisabled && styles.slotItemBooked
                  ]}
                  onPress={() => toggleSlot(slot.id)}
                >
                  <Text style={[styles.slotTime, isSelected && styles.textWhite, isDisabled && styles.textDisabled]}>
                    {slot.time}
                  </Text>
                  <Text style={[styles.slotPrice, isSelected && styles.textWhite, isDisabled && styles.textDisabled]}>
                    {isDisabled ? (isPast ? 'Đã qua' : 'Đã đặt') : `${selectedField ? selectedField.pricePerSlot.toLocaleString('vi-VN') : 0}đ`}
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
          onPress={() => {
            const selectedTimeSlots = TIME_SLOTS.filter(s => selectedSlots.includes(s.id));
            let timeString = '';
            if (selectedTimeSlots.length > 0) {
              const start = Math.min(...selectedTimeSlots.map(s => s.start));
              const end = Math.max(...selectedTimeSlots.map(s => s.end));
              timeString = `${start.toString().padStart(2, '0')}:00 - ${end.toString().padStart(2, '0')}:00`;
            }
            
            navigation.navigate('Addon', { 
              bookingData: {
                sportCenterId,
                fieldId: selectedField?.fieldId,
                field: {
                  ...selectedField,
                  address: sportCenter?.address || route.params?.sportCenterAddress,
                  name: selectedField?.name || sportCenter?.name || route.params?.sportCenterName,
                  time: timeString,
                  date: selectedDate.fullDate
                },
                bookingDate: selectedDate.fullDate,
                slotIds: selectedSlots,
                totalPrice
              }
            });
          }}
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
  venueInfo: { paddingHorizontal: 20, paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: '#f2f4f6' },
  venueName: { fontSize: 20, fontWeight: 'bold', color: '#191c1e', marginBottom: 4 },
  venueAddress: { fontSize: 14, color: '#666' },
  scrollContent: { paddingBottom: 100 },
  section: { paddingVertical: 20, borderBottomWidth: 8, borderBottomColor: '#f2f4f6' },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, marginBottom: 16 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#1a1a1a', paddingHorizontal: 20 },
  dateScroll: { paddingHorizontal: 20, gap: 12, flexDirection: 'row' },
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
  courtScroll: { paddingHorizontal: 20, gap: 12, flexDirection: 'row', marginTop: 16 },
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