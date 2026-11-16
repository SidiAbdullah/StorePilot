export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  username: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  id: number;
  username: string;
  email: string;
  role: "Admin" | "Customer" | "Employee";
  token: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
  role: "Admin" | "Customer" | "Employee";
}
