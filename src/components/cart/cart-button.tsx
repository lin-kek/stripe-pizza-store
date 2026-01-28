"use client";

import { useCart } from "@/stores/cart";
import { Button } from "../ui/button";
import { ShoppingCart } from "lucide-react";

export default function CartButton() {
  const cart = useCart();

  return (
    <Button
      onClick={() => cart.setOpen(true)}
      className="cursor-pointer relative"
    >
      <ShoppingCart />
      Cart
      {cart.items.length > 0 && (
        <span className="absolute top-0 right-0 w-3 h-3 bg-red-600 rounded-full translate-x-1/2 -translate-y-1/2 animate-pulse" />
      )}
    </Button>
  );
}
