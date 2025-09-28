export interface Product {
  id: string;
  prdt?: string; // Admin key structure as requested
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  downloadLink?: string; // For Ebooks/Games
  redirectLink?: string; // For other categories
  discount: number;
  isNew: boolean;
  isPromotion: boolean;
  promotionValidUntil?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Category {
  id: string;
  title: string;
  icon: string;
  color: string;
}

export interface Banner {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  color: string;
  isActive: boolean;
  order: number;
  createdAt: Date;
}