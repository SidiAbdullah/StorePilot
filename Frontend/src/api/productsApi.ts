import api from "./axios";
import type { Product } from "../types/product";

export const getProducts = async () => {
  const response = await api.get<Product[]>("/Products");
  return response.data;
};

export const getProductById = async (id: number) => {
  const response = await api.get<Product>(`/Products/${id}`);
  return response.data;
};
