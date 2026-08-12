import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, ActivityIndicator, Alert, Dimensions } from 'react-native';
import { WebView } from 'react-native-webview';
import Geolocation from '@react-native-community/geolocation';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { sportCentersApi } from '../api/sportCentersApi';
import { SportCenterResponseDto } from '../types/api';

const { width, height } = Dimensions.get('window');

const MapScreen = ({ navigation, route }: { navigation: any, route: any }) => {
  const targetId = route?.params?.targetId;
  const [loading, setLoading] = useState(true);
  const [sportCenters, setSportCenters] = useState<SportCenterResponseDto[]>([]);
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);

  useEffect(() => {
    fetchSportCenters();
    getCurrentLocation();
  }, []);

  const getCurrentLocation = () => {
    Geolocation.getCurrentPosition(
      (position) => {
        let lat = position.coords.latitude;
        let lng = position.coords.longitude;
        // If the location is outside Vietnam (e.g., emulator default at Googleplex), fallback to HCMC
        if (lat < 8 || lat > 24 || lng < 102 || lng > 110) {
          lat = 10.762622;
          lng = 106.660172;
        }
        setUserLocation({
          latitude: lat,
          longitude: lng,
        });
      },
      (error) => {
        console.warn('Geolocation Error:', error.message);
        // Fallback to center of HCMC if location fails
        setUserLocation({
          latitude: 10.762622,
          longitude: 106.660172,
        });
      },
      { enableHighAccuracy: false, timeout: 20000, maximumAge: 1000 }
    );
  };

  const fetchSportCenters = async () => {
    try {
      const data = await sportCentersApi.getAll();
      setSportCenters(data);
    } catch (error) {
      console.error('Failed to fetch sport centers:', error);
      Alert.alert('Lỗi', 'Không thể lấy dữ liệu trung tâm thể thao.');
    } finally {
      setLoading(false);
    }
  };

  // Mock function to generate coordinates based on ID (since Backend doesn't provide them)
  const getMockCoordinates = (id: string, index: number) => {
    const baseLat = 10.762622;
    const baseLng = 106.660172;
    
    // Spread them around the base location
    const angle = (index / 10) * Math.PI * 2;
    const radius = 0.02 + (index % 3) * 0.01;
    
    return {
      latitude: baseLat + Math.cos(angle) * radius,
      longitude: baseLng + Math.sin(angle) * radius,
    };
  };

  if (loading || !userLocation) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1E40AF" />
        <Text style={styles.loadingText}>Đang tải bản đồ...</Text>
      </View>
    );
  }

  let targetLat = userLocation.latitude;
  let targetLng = userLocation.longitude;
  let targetZoom = 13;

  if (targetId && sportCenters.length > 0) {
    const targetIndex = sportCenters.findIndex(c => c.sportCenterId === targetId);
    if (targetIndex !== -1) {
      const coords = getMockCoordinates(targetId, targetIndex);
      targetLat = coords.latitude;
      targetLng = coords.longitude;
      targetZoom = 15;
    }
  }

  const mapHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
      <style>
        body, html { padding: 0; margin: 0; width: 100%; height: 100%; overflow: hidden; }
        #map { width: 100%; height: 100%; }
        .leaflet-popup-content-wrapper { border-radius: 8px; }
        .custom-popup .title { font-size: 14px; font-weight: bold; color: #111827; margin-bottom: 4px; }
        .custom-popup .address { font-size: 12px; color: #6b7280; margin-bottom: 8px; }
        .custom-popup button { margin-top: 8px; padding: 6px 12px; background: #2563eb; color: white; border: none; border-radius: 4px; font-weight: bold; width: 100%; cursor: pointer; }
      </style>
    </head>
    <body>
      <script>
        window.onerror = function(message, source, lineno, colno, error) {
          window.ReactNativeWebView.postMessage("ERROR: " + message + " at " + lineno + ":" + colno);
          return true;
        };
      </script>
      <div id="map"></div>
      
      <script>
        function initMap() {
          var map = L.map('map').setView([${targetLat}, ${targetLng}], ${targetZoom});
          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '© OpenStreetMap'
          }).addTo(map);

          var userIcon = L.icon({
              iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
              shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
              iconSize: [25, 41],
              iconAnchor: [12, 41],
              popupAnchor: [1, -34],
              shadowSize: [41, 41]
          });

          L.marker([${userLocation.latitude}, ${userLocation.longitude}], {icon: userIcon}).addTo(map)
            .bindPopup("<b>Vị trí của bạn</b>");

          var centers = ${JSON.stringify(
            sportCenters.map((c, i) => {
              const coords = getMockCoordinates(c.sportCenterId, i);
              return {
                id: c.sportCenterId,
                lat: coords.latitude,
                lng: coords.longitude,
                name: c.name,
                address: c.address
              };
            })
          )};

          centers.forEach(function(c) {
            var marker = L.marker([c.lat, c.lng]).addTo(map);
            
            var container = document.createElement('div');
            container.className = 'custom-popup';
            
            var title = document.createElement('div');
            title.className = 'title';
            title.textContent = c.name;
            container.appendChild(title);
            
            var address = document.createElement('div');
            address.className = 'address';
            address.textContent = c.address;
            container.appendChild(address);
            
            var btn = document.createElement('button');
            btn.textContent = 'Xem chi tiết';
            btn.onclick = function() {
              window.ReactNativeWebView.postMessage(c.id);
            };
            container.appendChild(btn);
            
            marker.bindPopup(container);
            if (c.id === '${targetId}') {
              marker.openPopup();
            }
          });
        }
      </script>
      <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js" onload="initMap()"></script>
    </body>
    </html>
  `;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={26} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Bản đồ Sân Thể Thao</Text>
      </View>

      <WebView
        key={sportCenters.length}
        originWhitelist={['*']}
        source={{ html: mapHtml, baseUrl: 'https://localhost' }}
        style={{ flex: 1, width: '100%', height: '100%' }}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        mixedContentMode="always"
        allowFileAccess={true}
        allowUniversalAccessFromFileURLs={true}
        onMessage={(event) => {
          const data = event.nativeEvent.data;
          if (data && data.startsWith("ERROR:")) {
            console.error("WebView Error: ", data);
            Alert.alert("Lỗi bản đồ", data);
          } else if (data) {
            navigation.navigate('Detail', { sportCenterId: data });
          }
        }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#6b7280',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
    backgroundColor: '#fff',
    zIndex: 1,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    textAlign: 'center',
    marginRight: 34,
  },
  map: {
    width: width,
    flex: 1,
  }
});
export default MapScreen;
