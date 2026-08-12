import * as signalR from '@microsoft/signalr';
import notifee, { AndroidImportance } from '@notifee/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNotificationStore } from '../store/useNotificationStore';

class NotificationService {
  private hubConnection: signalR.HubConnection | null = null;
  private backendUrl = 'http://10.0.2.2:5286';

  async startConnection() {
    const token = await AsyncStorage.getItem('accessToken');
    if (!token) return;

    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(`${this.backendUrl}/hubs/notifications`, {
        accessTokenFactory: () => token,
      })
      .withAutomaticReconnect()
      .build();

    this.hubConnection.on('ReceiveNotification', async (title: string, body: string, bookingId: string) => {
      useNotificationStore.getState().addNotification({
        type: 'booking',
        title: title,
        message: body,
        bookingId: bookingId,
      });
      await this.displayLocalNotification(title, body, bookingId);
    });

    try {
      await this.hubConnection.start();
      console.log('SignalR Connected.');
    } catch (err) {
      console.error('SignalR Connection Error: ', err);
    }
  }

  async stopConnection() {
    if (this.hubConnection) {
      await this.hubConnection.stop();
      console.log('SignalR Disconnected.');
    }
  }

  async displayLocalNotification(title: string, body: string, bookingId: string) {
    // Request permissions (required for iOS)
    await notifee.requestPermission();

    // Create a channel (required for Android)
    const channelId = await notifee.createChannel({
      id: 'default',
      name: 'Default Channel',
      importance: AndroidImportance.HIGH,
    });

    // Display a notification
    await notifee.displayNotification({
      title: title,
      body: body,
      data: { bookingId },
      android: {
        channelId,
        pressAction: {
          id: 'default',
        },
      },
    });
  }
}

export default new NotificationService();
