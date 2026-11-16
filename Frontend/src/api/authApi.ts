import api from "./axios";
import type { LoginDto, RegisterDto, AuthResponse } from "../types/auth";

export const login = async (dto: LoginDto) => {
  const response = await api.post<AuthResponse>("/Auth/login", dto);
  return response.data;
};

export const register = async (dto: RegisterDto) => {
  const response = await api.post<AuthResponse>("/Auth/register", dto);
  return response.data;
};
