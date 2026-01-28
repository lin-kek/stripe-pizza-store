"use client";

import { useCart } from "@/stores/cart";
import { Button } from "../ui/button";
import { X } from "lucide-react";

export default function CartEmpty() {
  const { setOpen } = useCart();

  return (
    <div className="my-10 text-center">
      <p className="mb-4">Empty cart.</p>
      <Button onClick={() => setOpen(false)} className="cursor-pointer">
        <X />
        Close
      </Button>
    </div>
  );
}
