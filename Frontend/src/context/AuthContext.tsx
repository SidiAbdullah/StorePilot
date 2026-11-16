import { createContext, useState, useEffect, type ReactNode } from "react";

import type { User, AuthResponse } from "../types/auth";
import * as authApi from "../api/authApi";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (
    username: string,
    email: string,
    password: string,
  ) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    if (storedUser && token) {
      try {
        setUser(JSON.parse(storedUser) as User);
      } catch {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
      }
    }

    setIsLoading(false);
  }, []);

  const saveAuthData = (data: AuthResponse) => {
    const currentUser: User = {
      id: data.id,
      username: data.username,
      email: data.email,
      role: data.role,
    };

    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(currentUser));

    setUser(currentUser);
  };

  const login = async (email: string, password: string) => {
    const data = await authApi.login({ email, password });
    saveAuthData(data);
  };

  const register = async (
    username: string,
    email: string,
    password: string,
  ) => {
    const data = await authApi.register({
      username,
      email,
      password,
    });

    saveAuthData(data);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
