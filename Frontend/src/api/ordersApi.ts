import api from "./axios";
import type { Order, CheckoutOrderDto } from "../types/order";

export const checkout = async (dto: CheckoutOrderDto) => {
  const response = await api.post<Order>("/Orders/checkout", dto);
  return response.data;
};

export const getMyOrders = async () => {
  const response = await api.get<Order[]>("/Orders/my");
  return response.data;
};

export const getOrderById = async (id: number) => {
  const response = await api.get<Order>(`/Orders/${id}`);
  return response.data;
};
