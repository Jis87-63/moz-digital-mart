import { collection, addDoc, getDocs, query, orderBy, updateDoc, doc } from 'firebase/firestore';
import { db } from './firebase';

export interface SupportMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  isRead: boolean;
  adminResponse?: string;
  createdAt: Date;
  respondedAt?: Date;
}

const SUPPORT_COLLECTION = 'support_messages';

export const supportService = {
  // Add support message
  async addSupportMessage(message: Omit<SupportMessage, 'id' | 'isRead' | 'createdAt'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, SUPPORT_COLLECTION), {
        ...message,
        isRead: false,
        createdAt: new Date()
      });
      return docRef.id;
    } catch (error) {
      console.error('Error adding support message:', error);
      throw error;
    }
  },

  // Get all support messages (admin only)
  async getAllSupportMessages(): Promise<SupportMessage[]> {
    try {
      const q = query(
        collection(db, SUPPORT_COLLECTION),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as SupportMessage[];
    } catch (error) {
      console.error('Error fetching support messages:', error);
      return [];
    }
  },

  // Respond to support message
  async respondToSupport(id: string, adminResponse: string): Promise<void> {
    try {
      const messageRef = doc(db, SUPPORT_COLLECTION, id);
      await updateDoc(messageRef, {
        adminResponse,
        isRead: true,
        respondedAt: new Date()
      });
    } catch (error) {
      console.error('Error responding to support message:', error);
      throw error;
    }
  },

  // Mark message as read
  async markAsRead(id: string): Promise<void> {
    try {
      const messageRef = doc(db, SUPPORT_COLLECTION, id);
      await updateDoc(messageRef, {
        isRead: true
      });
    } catch (error) {
      console.error('Error marking message as read:', error);
      throw error;
    }
  }
};