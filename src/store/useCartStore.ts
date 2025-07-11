import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type CartItem = {
  productId: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  stock: number;
  sellerId: string;
};

type CartState = {
  items: CartItem[];
  totalQuantity: number;
  totalPrice: number;

  addItem: (item: CartItem) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  removeItem: (productId: string) => void;
  clearCart: () => void;
};

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      totalQuantity: 0,
      totalPrice: 0,

      addItem: (item) => {
        const existing = get().items.find((i) => i.productId === item.productId);
        let updatedItems;

        if (existing) {
          updatedItems = get().items.map((i) =>
            i.productId === item.productId
              ? {
                  ...i,
                  quantity: Math.min(i.quantity + item.quantity, i.stock),
                }
              : i
          );
        } else {
          updatedItems = [...get().items, item];
        }

        const totalQuantity = updatedItems.reduce((acc, i) => acc + i.quantity, 0);
        const totalPrice = updatedItems.reduce((acc, i) => acc + i.price * i.quantity, 0);

        set({ items: updatedItems, totalQuantity, totalPrice });
      },

      updateQuantity: (productId, quantity) => {
        const updatedItems = get().items.map((i) =>
          i.productId === productId
            ? { ...i, quantity: Math.max(1, Math.min(quantity, i.stock)) }
            : i
        );

        const totalQuantity = updatedItems.reduce((acc, i) => acc + i.quantity, 0);
        const totalPrice = updatedItems.reduce((acc, i) => acc + i.price * i.quantity, 0);

        set({ items: updatedItems, totalQuantity, totalPrice });
      },

      removeItem: (productId) => {
        const updatedItems = get().items.filter((i) => i.productId !== productId);
        const totalQuantity = updatedItems.reduce((acc, i) => acc + i.quantity, 0);
        const totalPrice = updatedItems.reduce((acc, i) => acc + i.price * i.quantity, 0);

        set({ items: updatedItems, totalQuantity, totalPrice });
      },

      clearCart: () => {
        set({ items: [], totalQuantity: 0, totalPrice: 0 });
      },
    }),
    {
      name: 'lumina-cart', // Nom utilisé pour localStorage
    }
  )
);
