import { Product } from "@/generated/prisma/client";
import { create } from "zustand";

type Store = {
  products: Product[];
  setProducts: (data: Product[]) => void;
};

export const useProducts = create<Store>((set) => ({
  products: [],
  setProducts: (data) => set({ products: data }),
}));
