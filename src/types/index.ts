export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  min_stock: number;
  unit: string;
  created_at: string;
}

export interface Sale {
  id: string;
  product_id: string;
  quantity: number;
  total: number;
  sold_at: string;
  product?: Product;
}

export interface StockAlert {
  product: Product;
  current_stock: number;
  min_stock: number;
  shortage: number;
}

export interface DailySales {
  date: string;
  total: number;
  transactions: number;
}
