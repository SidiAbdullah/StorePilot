export interface CheckoutOrderDto {
  customerName: string;
  customerPhone: string;
  shippingAddress: string;
}

export interface OrderItem {
  id: number;
  productId: number;
  productName: string;
  unitPrice: number;
  quantity: number;
  subtotal: number;
}

export interface Order {
  id: number;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: string;
  totalAmount: number;
  status: string;
  paymentMethod: string;
  createdAt: string;
  items: OrderItem[];
}
