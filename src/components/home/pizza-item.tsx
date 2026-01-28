"use client";

import { Product } from "@/generated/prisma/client";
import Image from "next/image";
import { Button } from "../ui/button";
import { decimalToMoney } from "@/lib/utils";
import { useCart } from "@/stores/cart";

type Props = {
  data: Product;
};

export default function PizzaItem({ data }: Props) {
  const cart = useCart();

  function handleAddToCart() {
    cart.addItem({
      productId: data.id,
      quantity: 1,
    });
  }

  return (
    <div className="text-sm bg-secondary p-4 rounded-md">
      <Image
        src={data.image}
        alt={data.name}
        width={200}
        height={200}
        className="w-full mb-4"
        draggable="false"
        onContextMenu={(e) => e.preventDefault()}
      />
      <div className="text-lg font-bold">{data.name}</div>
      <div className="">{decimalToMoney(data.price)}</div>
      <div className="truncate mb-3">{data.ingredients}</div>
      <div className="text-center">
        <Button onClick={handleAddToCart} className="cursor-pointer">
          Add to Cart
        </Button>
      </div>
    </div>
  );
}
