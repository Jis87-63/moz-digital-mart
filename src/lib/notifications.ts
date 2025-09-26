import { collection, addDoc, getDocs, query, orderBy, where } from 'firebase/firestore';
import { db } from './firebase';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  targetUsers?: string[]; // If empty, notification is for all users
  isActive: boolean;
  createdAt: Date;
  expiresAt?: Date;
}

const NOTIFICATIONS_COLLECTION = 'notifications';

export const notificationService = {
  // Add notification (admin only)
  async addNotification(notification: Omit<Notification, 'id'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, NOTIFICATIONS_COLLECTION), {
        ...notification,
        createdAt: new Date()
      });
      return docRef.id;
    } catch (error) {
      console.error('Error adding notification:', error);
      throw error;
    }
  },

  // Get active notifications for user
  async getActiveNotifications(userId?: string): Promise<Notification[]> {
    try {
      const now = new Date();
      const q = query(
        collection(db, NOTIFICATIONS_COLLECTION),
        where('isActive', '==', true),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      const notifications = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Notification[];

      // Filter notifications based on target users and expiry
      return notifications.filter(notification => {
        // Check if notification has expired
        if (notification.expiresAt && notification.expiresAt < now) {
          return false;
        }

        // If no target users specified, show to all users
        if (!notification.targetUsers || notification.targetUsers.length === 0) {
          return true;
        }

        // If user ID provided, check if user is in target list
        if (userId) {
          return notification.targetUsers.includes(userId);
        }

        return false;
      });
    } catch (error) {
      console.error('Error fetching notifications:', error);
      return [];
    }
  },

  // Mark notification as read (optional - store in user preferences)
  async markAsRead(userId: string, notificationId: string): Promise<void> {
    // This could store read status in user document or separate collection
    // For now, we'll just handle it locally in the component
    localStorage.setItem(`notification_read_${userId}_${notificationId}`, 'true');
  },

  // Check if notification is read
  isRead(userId: string, notificationId: string): boolean {
    return localStorage.getItem(`notification_read_${userId}_${notificationId}`) === 'true';
  }
};