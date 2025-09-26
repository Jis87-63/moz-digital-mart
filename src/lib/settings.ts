import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from './firebase';

export interface StoreSettings {
  storeName: string;
  storeEmail: string;
  storePhone: string;
  storeDescription: string;
  updatedAt: Date;
}

const SETTINGS_DOC = 'store_settings';
const SETTINGS_COLLECTION = 'settings';

export const settingsService = {
  // Get store settings
  async getStoreSettings(): Promise<StoreSettings> {
    try {
      const settingsRef = doc(db, SETTINGS_COLLECTION, SETTINGS_DOC);
      const settingsSnap = await getDoc(settingsRef);
      
      if (settingsSnap.exists()) {
        return settingsSnap.data() as StoreSettings;
      } else {
        // Return default settings
        return {
          storeName: 'Moz Store Digital',
          storeEmail: 'mozstoredigitalp2@gmail.com',
          storePhone: '+258 87 650 0685',
          storeDescription: 'Sua loja digital de confiança em Moçambique',
          updatedAt: new Date()
        };
      }
    } catch (error) {
      console.error('Error fetching store settings:', error);
      // Return default settings on error
      return {
        storeName: 'Moz Store Digital',
        storeEmail: 'mozstoredigitalp2@gmail.com',
        storePhone: '+258 87 650 0685',
        storeDescription: 'Sua loja digital de confiança em Moçambique',
        updatedAt: new Date()
      };
    }
  },

  // Update store settings
  async updateStoreSettings(settings: Omit<StoreSettings, 'updatedAt'>): Promise<void> {
    try {
      const settingsRef = doc(db, SETTINGS_COLLECTION, SETTINGS_DOC);
      await setDoc(settingsRef, {
        ...settings,
        updatedAt: new Date()
      });
    } catch (error) {
      console.error('Error updating store settings:', error);
      throw error;
    }
  }
};