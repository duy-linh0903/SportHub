import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode';

interface AuthState {
  token: string | null;
  role: string | null;
  isAuthenticated: boolean;
  userId: string | null;
  setToken: (token: string) => Promise<void>;
  logout: () => Promise<void>;
  initialize: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  role: null,
  isAuthenticated: false,
  userId: null,
  setToken: async (token: string) => {
    await AsyncStorage.setItem('accessToken', token);
    
    let userId = null;
    let role = null;
    try {
      const decodedPayload: any = jwtDecode(token);
      userId = decodedPayload.sub || decodedPayload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'];
      role = decodedPayload.role || decodedPayload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
    } catch (e) {
      console.warn('Could not decode JWT:', e);
    }
    
    set({ token, role, userId, isAuthenticated: true });
  },
  logout: async () => {
    await AsyncStorage.removeItem('accessToken');
    set({ token: null, role: null, userId: null, isAuthenticated: false });
  },
  initialize: async () => {
    try {
      const token = await AsyncStorage.getItem('accessToken');
      if (token) {
        let userId = null;
        let role = null;
        try {
          const decodedPayload: any = jwtDecode(token);
          userId = decodedPayload.sub || decodedPayload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'];
          role = decodedPayload.role || decodedPayload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
        } catch (e) {
          console.warn('Could not decode JWT on init:', e);
        }
        set({ token, role, userId, isAuthenticated: true });
      }
    } catch (error) {
      console.error('Failed to initialize auth state', error);
    }
  },
}));
