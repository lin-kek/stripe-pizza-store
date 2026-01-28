import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const headersList = await headers();
  const stripeSignature = headersList.get("stripe-signature");
  const rawBody = await request.text();

  try {
    const event = stripe.webhooks.constructEvent(
      rawBody,
      stripeSignature!,
      process.env.STRIPE_WEBHOOK_KEY!,
    );

    const eventTypes = [
      "checkout.session.completed",
      "checkout.session.async_payment_succeeded",
    ];
    if (eventTypes.includes(event.type)) {
      const { metadata, payment_status } = event.data.object as any;

      if (payment_status === "paid") {
        const { order_id } = metadata;
        if (order_id) {
          const order = await prisma.order.findUnique({
            where: { id: parseInt(order_id) },
          });
          if (order) {
            await prisma.order.update({
              where: { id: parseInt(order_id) },
              data: { status: "PAID" },
            });
          }
        }
      }
    }
  } catch (error: any) {
    console.log(error.message);
    return NextResponse.json({ status: 400 });
  }

  return NextResponse.json({ ok: true });
}
