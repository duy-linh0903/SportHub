import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface AppNotification {
  id: string;
  userId?: string;
  type: 'booking' | 'promo' | 'system';
  title: string;
  message: string;
  time: string;
  read: boolean;
  bookingId?: string;
}

interface NotificationState {
  notifications: AppNotification[];
  addNotification: (notification: Omit<AppNotification, 'id' | 'time' | 'read' | 'userId'>, userId?: string) => void;
  markAsRead: (id: string) => void;
  clearAll: (userId?: string) => void;
}

export const useNotificationStore = create<NotificationState>()(
  persist(
    (set) => ({
      notifications: [],
      addNotification: (notification, userId) =>
        set((state) => ({
          notifications: [
            {
              ...notification,
              id: Date.now().toString(),
              time: new Date().toISOString(),
              read: false,
              userId: userId,
            },
            ...state.notifications,
          ],
        })),
      markAsRead: (id) =>
        set((state) => ({
          notifications: state.notifications.map((n) =>
            n.id === id ? { ...n, read: true } : n
          ),
        })),
      clearAll: (userId) => 
        set((state) => ({
          notifications: userId ? state.notifications.filter(n => n.userId !== userId && n.userId !== undefined) : [],
        })),
    }),
    {
      name: 'notification-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
