export interface Product {
  id: number | string;
  name: string;
  description: string;
  price: number;
  stock: number;
  image?: string;
  category?: string;
  created_at?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface User {
  id: number | string;
  name: string;
  email: string;
}

export interface OrderItem {
  id?: number | string;
  product_id: number | string;
  product_name: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: number | string;
  user_id?: number | string;
  total: number;
  status: "pending" | "completed" | "cancelled" | "paid";
  items: OrderItem[];
  created_at: string;
  payment_method?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface ApiResponse<T> {
  success?: boolean;
  data: T;
  message?: string;
}
