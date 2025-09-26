import { collection, getDocs, doc, addDoc, updateDoc, deleteDoc, query, where, orderBy } from 'firebase/firestore';
import { db } from './firebase';
import { Product, Banner } from '@/types/product';

// Products collection
const PRODUCTS_COLLECTION = 'products';
const BANNERS_COLLECTION = 'banners';

export const productService = {
  // Get all products
  async getAllProducts(): Promise<Product[]> {
    try {
      const querySnapshot = await getDocs(collection(db, PRODUCTS_COLLECTION));
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Product[];
    } catch (error) {
      console.error('Error fetching products:', error);
      return [];
    }
  },

  // Get products by category
  async getProductsByCategory(category: string): Promise<Product[]> {
    try {
      const q = query(
        collection(db, PRODUCTS_COLLECTION),
        where('category', '==', category),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Product[];
    } catch (error) {
      console.error('Error fetching products by category:', error);
      return [];
    }
  },

  // Get promoted products
  async getPromotedProducts(): Promise<Product[]> {
    try {
      const q = query(
        collection(db, PRODUCTS_COLLECTION),
        where('isPromotion', '==', true),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Product[];
    } catch (error) {
      console.error('Error fetching promoted products:', error);
      return [];
    }
  },

  // Get new products
  async getNewProducts(): Promise<Product[]> {
    try {
      const q = query(
        collection(db, PRODUCTS_COLLECTION),
        where('isNew', '==', true),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Product[];
    } catch (error) {
      console.error('Error fetching new products:', error);
      return [];
    }
  },

  // Add product
  async addProduct(product: Omit<Product, 'id'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, PRODUCTS_COLLECTION), {
        ...product,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      return docRef.id;
    } catch (error) {
      console.error('Error adding product:', error);
      throw error;
    }
  },

  // Update product
  async updateProduct(id: string, product: Partial<Product>): Promise<void> {
    try {
      const productRef = doc(db, PRODUCTS_COLLECTION, id);
      await updateDoc(productRef, {
        ...product,
        updatedAt: new Date()
      });
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    }
  },

  // Delete product
  async deleteProduct(id: string): Promise<void> {
    try {
      const productRef = doc(db, PRODUCTS_COLLECTION, id);
      await deleteDoc(productRef);
    } catch (error) {
      console.error('Error deleting product:', error);
      throw error;
    }
  }
};

export const bannerService = {
  // Get all active banners
  async getActiveBanners(): Promise<Banner[]> {
    try {
      const q = query(
        collection(db, BANNERS_COLLECTION),
        where('isActive', '==', true),
        orderBy('order', 'asc')
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Banner[];
    } catch (error) {
      console.error('Error fetching banners:', error);
      return [];
    }
  },

  // Add banner
  async addBanner(banner: Omit<Banner, 'id'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, BANNERS_COLLECTION), {
        ...banner,
        createdAt: new Date()
      });
      return docRef.id;
    } catch (error) {
      console.error('Error adding banner:', error);
      throw error;
    }
  },

  // Update banner
  async updateBanner(id: string, banner: Partial<Banner>): Promise<void> {
    try {
      const bannerRef = doc(db, BANNERS_COLLECTION, id);
      await updateDoc(bannerRef, banner);
    } catch (error) {
      console.error('Error updating banner:', error);
      throw error;
    }
  },

  // Delete banner
  async deleteBanner(id: string): Promise<void> {
    try {
      const bannerRef = doc(db, BANNERS_COLLECTION, id);
      await deleteDoc(bannerRef);
    } catch (error) {
      console.error('Error deleting banner:', error);
      throw error;
    }
  }
};