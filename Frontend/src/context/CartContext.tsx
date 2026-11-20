import {
  createContext,
  useCallback,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import {
  getCart,
  addCartItem,
  updateCartItem,
  removeCartItem,
  clearCart,
} from "../api/cartApi";

import type { Cart, AddCartItemDto } from "../types/cart";
import { useAuth } from "../hooks/useAuth";

interface CartContextType {
  cart: Cart | null;
  cartCount: number;
  isLoading: boolean;
  refreshCart: () => Promise<void>;
  addItem: (data: AddCartItemDto) => Promise<void>;
  updateItem: (itemId: number, quantity: number) => Promise<void>;
  removeItem: (itemId: number) => Promise<void>;
  emptyCart: () => Promise<void>;
}

export const CartContext = createContext<CartContextType | undefined>(
  undefined,
);

interface Props {
  children: ReactNode;
}

export function CartProvider({ children }: Props) {
  const { isAuthenticated, user } = useAuth();

  const [cart, setCart] = useState<Cart | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const isCustomer = isAuthenticated && user?.role === "Customer";

  const refreshCart = useCallback(async () => {
    if (!isCustomer) {
      setCart(null);
      return;
    }

    setIsLoading(true);

    try {
      const data = await getCart();
      setCart(data);
    } finally {
      setIsLoading(false);
    }
  }, [isCustomer]);

  useEffect(() => {
    refreshCart().catch(console.error);
  }, [refreshCart]);

  const addItem = async (data: AddCartItemDto) => {
    await addCartItem(data);
    await refreshCart();
  };

  const updateItem = async (itemId: number, quantity: number) => {
    await updateCartItem(itemId, { quantity });
    await refreshCart();
  };

  const removeItem = async (itemId: number) => {
    await removeCartItem(itemId);
    await refreshCart();
  };

  const emptyCart = async () => {
    await clearCart();
    await refreshCart();
  };

  const cartCount = cart?.totalItems ?? 0;

  return (
    <CartContext.Provider
      value={{
        cart,
        cartCount,
        isLoading,
        refreshCart,
        addItem,
        updateItem,
        removeItem,
        emptyCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
