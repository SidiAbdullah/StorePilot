import api from "./axios";
import type { Cart, AddCartItemDto, UpdateCartItemDto } from "../types/cart";

export const getCart = async () => {
  const response = await api.get<Cart>("/Carts");
  return response.data;
};

export const addCartItem = async (dto: AddCartItemDto) => {
  const response = await api.post<Cart>("/Carts/items", dto);
  return response.data;
};

export const updateCartItem = async (
  itemId: number,
  dto: UpdateCartItemDto,
) => {
  const response = await api.put<Cart>(`/Carts/items/${itemId}`, dto);
  return response.data;
};

export const removeCartItem = async (itemId: number) => {
  await api.delete(`/Carts/items/${itemId}`);
};

export const clearCart = async () => {
  await api.delete("/Carts");
};
