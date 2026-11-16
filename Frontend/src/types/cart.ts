export interface CartItem {
  id: number;
  productId: number;
  productName: string;
  sku: string;
  imageUrl: string | null;
  unitPrice: number;
  quantity: number;
  totalPrice: number;
}

export interface Cart {
  id: number;
  createdAt: string;
  totalItems: number;
  totalPrice: number;
  items: CartItem[];
}

export interface AddCartItemDto {
  productId: number;
  quantity: number;
}

export interface UpdateCartItemDto {
  quantity: number;
}
