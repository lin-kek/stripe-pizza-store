"use client";

import { useCart } from "@/stores/cart";
import { Button } from "../ui/button";
import { useProducts } from "@/stores/products";
import { useEffect, useState } from "react";
import CartProduct from "./cart-product";
import { decimalToMoney } from "@/lib/utils";
import { useAuth } from "@/stores/auth";
import { apiWithAuth } from "@/lib/axios";

export default function CartList() {
  const auth = useAuth();
  const cart = useCart();
  const products = useProducts();

  const [subtotal, setSubtotal] = useState(0);
  const [deliveryFee, setDeliveryFee] = useState(10);

  function calculateSubtotal() {
    let sub = 0;
    for (let item of cart.items) {
      const prod = products.products.find(
        (pitem) => pitem.id === item.productId,
      );
      if (prod) sub += item.quantity * parseFloat(prod.price.toString());
    }
    setSubtotal(sub);
  }
  useEffect(calculateSubtotal, [cart]);

  async function handleCheckout() {
    if (cart.items.length > 0) {
      const orderReq = await apiWithAuth.post("/order/new", {
        cart: cart.items,
      });

      if (orderReq.status === 201) {
        window.location.href = orderReq.data.url;
      }
    }
  }

  return (
    <>
      <div className="flex flex-col gap-3 my-5">
        {cart.items.map((item) => (
          <CartProduct key={item.productId} data={item} />
        ))}
      </div>
      <div className="my-4 text-right">
        <div>Sub-total: {decimalToMoney(subtotal)}</div>
        <div>Delivery Fee: {decimalToMoney(deliveryFee)}</div>
        <div className="font-bold">
          Total: {decimalToMoney(subtotal + deliveryFee)}
        </div>
      </div>

      {auth.token && (
        <Button
          onClick={handleCheckout}
          className="cursor-pointer bg-green-700 hover:bg-green-900"
        >
          Checkout
        </Button>
      )}

      {!auth.token && (
        <Button onClick={() => auth.setOpen(true)} className="cursor-pointer">
          Login / Register
        </Button>
      )}
    </>
  );
}
