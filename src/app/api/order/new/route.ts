import { stripe } from "@/lib/stripe";
import { getLoggedUserFromHeader } from "@/services/auth";
import { createNewOrder } from "@/services/order";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const headersList = await headers();
  const origin = headersList.get("origin");

  const { cart } = await request.json();

  const loggedUser = await getLoggedUserFromHeader();

  if (!loggedUser) return NextResponse.json({ error: "User not logged in." });
  if (!cart || (cart && cart.length <= 0))
    return NextResponse.json({ error: "Empty cart." });

  const order = await createNewOrder(loggedUser.id, cart);

  if (!order) return NextResponse.json({ error: "Something went wrong." });

  const paymentItems = [];
  for (let item of order.orderProducts) {
    paymentItems.push({
      price_data: {
        currency: "USD",
        unit_amount: parseFloat(item.product.price.toString()) * 100,
        product_data: {
          name: item.product.name,
        },
      },
      quantity: item.quantity,
    });
  }

  const paymentSession = await stripe.checkout.sessions.create({
    mode: "payment",
    success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}`,
    line_items: paymentItems,
    customer_email: loggedUser.email,
    shipping_options: [
      {
        shipping_rate_data: {
          type: "fixed_amount",
          display_name: "Delivery Fee",
          fixed_amount: {
            currency: "USD",
            amount: 1000, // $10
          },
        },
      },
    ],
    metadata: {
      order_id: order.id,
    },
  });

  return NextResponse.json({ order, url: paymentSession.url }, { status: 201 });
}
