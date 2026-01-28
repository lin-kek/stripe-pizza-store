import Header from "@/components/layout/header";
import { stripe } from "@/lib/stripe";
import { redirect } from "next/navigation";

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function SuccessPage({ searchParams }: Props) {
  const sessionId = (await searchParams).session_id as string;

  if (!sessionId) return redirect("/");

  const paymentSession = await stripe.checkout.sessions.retrieve(sessionId);

  if (!paymentSession) return redirect("/");

  const customerEmail = paymentSession.customer_email;

  return (
    <div>
      <Header />
      <main className="container mx-auto mb-4 text-center">
        <h1 className="text-2xl">Thank you for your order!</h1>
        <h3 className="text-xl">
          We will send an email to <strong>{customerEmail}</strong> shortly.
        </h3>
      </main>
    </div>
  );
}
