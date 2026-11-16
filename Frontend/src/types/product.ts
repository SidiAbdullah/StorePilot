export interface Product {
  id: number;
  name: string;
  sku: string;
  description: string | null;
  price: number;
  imageUrl: string | null;
  minimumStockLevel: number;
  isActive: boolean;
  categoryId: number | null;
  categoryName?: string | null;
  createdAt: string;
  updatedAt: string | null;
}
