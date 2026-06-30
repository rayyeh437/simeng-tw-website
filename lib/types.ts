import { z } from 'zod';

// 用戶類型
export interface User {
  id: number;
  openId?: string;
  name?: string;
  email?: string;
  role: 'user' | 'admin';
  createdAt: Date;
  updatedAt: Date;
}

// 分類類型
export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  order: number;
  isActive: number;
  createdAt: Date;
  updatedAt: Date;
}

// 商品類型
export interface Product {
  id: number;
  categoryId: number;
  name: string;
  description?: string;
  price: number;
  originalPrice?: number;
  image?: string;
  images?: string;
  stock: number;
  sku?: string;
  status: 'draft' | 'published' | 'archived';
  isFeatured: number;
  createdAt: Date;
  updatedAt: Date;
}

// 訂單類型
export interface Order {
  id: number;
  userId: number;
  orderNumber: string;
  totalAmount: number;
  status: 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
}

// tRPC Router 類型 - 簡化版本，只包含必要的端點
export interface AppRouter {
  products: {
    categories: {
      query: () => Promise<Category[]>;
    };
    search: {
      query: (input: {
        query?: string;
        categoryId?: number;
        minPrice?: number;
        maxPrice?: number;
        page?: number;
        pageSize?: number;
        sortBy?: 'newest' | 'price-low' | 'price-high' | 'featured';
      }) => Promise<any>;
    };
  };
}
