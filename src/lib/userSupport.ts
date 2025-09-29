import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from './firebase';

export interface UserSupportResponse {
  messageId: string;
  response: string;
  respondedAt: Date;
  isRead: boolean;
}

const USER_SUPPORT_COLLECTION = 'user_support_responses';

export const userSupportService = {
  // Get support responses for a user
  async getUserSupportResponses(userEmail: string): Promise<UserSupportResponse[]> {
    try {
      const userDocRef = doc(db, USER_SUPPORT_COLLECTION, userEmail);
      const userDoc = await getDoc(userDocRef);
      
      if (userDoc.exists()) {
        const data = userDoc.data();
        return (data.responses || []) as UserSupportResponse[];
      }
      
      return [];
    } catch (error) {
      console.error('Error fetching user support responses:', error);
      return [];
    }
  },

  // Add response for user
  async addUserSupportResponse(userEmail: string, response: UserSupportResponse): Promise<void> {
    try {
      const userDocRef = doc(db, USER_SUPPORT_COLLECTION, userEmail);
      const userDoc = await getDoc(userDocRef);
      
      let responses: UserSupportResponse[] = [];
      
      if (userDoc.exists()) {
        const data = userDoc.data();
        responses = data.responses || [];
      }
      
      responses.push(response);
      
      await setDoc(userDocRef, {
        email: userEmail,
        responses,
        updatedAt: new Date()
      });
    } catch (error) {
      console.error('Error adding user support response:', error);
      throw error;
    }
  },

  // Mark response as read
  async markResponseAsRead(userEmail: string, messageId: string): Promise<void> {
    try {
      const userDocRef = doc(db, USER_SUPPORT_COLLECTION, userEmail);
      const userDoc = await getDoc(userDocRef);
      
      if (userDoc.exists()) {
        const data = userDoc.data();
        const responses = (data.responses || []) as UserSupportResponse[];
        
        const updatedResponses = responses.map(r => 
          r.messageId === messageId ? { ...r, isRead: true } : r
        );
        
        await setDoc(userDocRef, {
          email: userEmail,
          responses: updatedResponses,
          updatedAt: new Date()
        });
      }
    } catch (error) {
      console.error('Error marking response as read:', error);
      throw error;
    }
  }
};
