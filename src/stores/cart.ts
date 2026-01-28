import { CartItem } from "@/types/cart-item";
import { create } from "zustand";

type Store = {
  open: boolean;
  setOpen: (open: boolean) => void;
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (productId: number) => void;
};

export const useCart = create<Store>((set) => ({
  open: false,
  items: [],

  setOpen: (open) => set((state) => ({ ...state, open })),

  addItem: (item) =>
    set((state) => {
      const clonedItems = [...state.items];
      const exist = state.items.find((i) => i.productId === item.productId);

      if (exist) {
        for (const key in clonedItems) {
          if (clonedItems[key].productId === item.productId) {
            clonedItems[key].quantity += item.quantity;
          }
        }
      } else {
        clonedItems.push(item);
      }

      return { ...state, items: clonedItems };
    }),

  removeItem: (productId) =>
    set((state) => ({
      ...state,
      items: state.items.filter((item) => item.productId !== productId),
    })),
}));
