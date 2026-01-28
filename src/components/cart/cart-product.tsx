"use client";

import { decimalToMoney } from "@/lib/utils";
import { useProducts } from "@/stores/products";
import { CartItem } from "@/types/cart-item";
import Image from "next/image";
import { Button } from "../ui/button";
import { useState } from "react";
import { useCart } from "@/stores/cart";

type Props = {
  data: CartItem;
};

export default function CartProduct({ data }: Props) {
  const products = useProducts();
  let product = products.products.find((item) => item.id === data.productId);
  if (!product) return null;

  const [qt, setQt] = useState(data.quantity);

  const cart = useCart();

  function handleDecreaseProduct() {
    if (qt - 1 <= 0) {
      return cart.removeItem(data.productId);
    }

    cart.addItem({ productId: data.productId, quantity: -1 });
    setQt(qt - 1);
  }

  function handleIncreaseProduct() {
    cart.addItem({ productId: data.productId, quantity: 1 });
    setQt(qt + 1);
  }

  return (
    <div className="flex items-center gap-3">
      <div className="w-10">
        <Image
          src={product.image}
          alt={product.name}
          width={100}
          height={100}
          className="w-full"
        />
      </div>
      <div className="flex-1">
        <div className="">{product.name}</div>
        <div className="text-sm">{decimalToMoney(product.price)}</div>
      </div>
      <div className="flex items-center bg-secondary p-2 rounded-md">
        <Button
          onClick={handleDecreaseProduct}
          className="cursor-pointer"
          size="sm"
          variant="ghost"
        >
          -
        </Button>
        <div className="mx-3">{qt}</div>
        <Button
          onClick={handleIncreaseProduct}
          className="cursor-pointer"
          size="sm"
          variant="ghost"
        >
          +
        </Button>
      </div>
    </div>
  );
}
