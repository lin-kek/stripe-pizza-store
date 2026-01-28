# Pizza Store

Pizza Store is a small e-commerce app built with Next.js + PostgreSQL (Prisma).  
It supports authentication, a product catalog, cart/checkout, and Stripe payments. Orders are stored in the database and only move to **PAID** after Stripe confirms the payment via webhook.

## What you can do with it

- Create an account and sign in
- Browse pizzas loaded from the database (seeded)
- Add items to the cart and create an order
- Pay via Stripe Checkout
- Receive payment confirmation via Stripe webhook and update the order status

## Local setup

### 1) Install dependencies

```bash
npm install
```

### 2) Environment variables

Create a `.env` file:

```env
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/pizza_store"
NEXT_PUBLIC_BASE_URL="http://localhost:3000"

STRIPE_WEBHOOK_KEY="whsec_YOUR_WEBHOOK_SECRET"
STRIPE_SECRET_KEY="sk_test_YOUR_SECRET_KEY"
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_YOUR_PUBLISHABLE_KEY"
```

Notes:

- `NEXT_PUBLIC_*` variables are used by code that runs in the browser.
- Never commit real Stripe secrets!

### 3) Database and Prisma

Make sure Postgres is running and the database exists, then run:

```bash
npx prisma migrate dev
```

If your prisma client does not generate automatically, run it manually:

```bash
npx prisma generate
```

Seed your database with pizzas:

```bash
npx tsx prisma/seed.ts
```

### 4) Run the app

```bash
npm run dev
```

Open `http://localhost:3000`.

## Stripe payments (important)

This project uses Stripe Checkout and relies on **Stripe webhooks** to confirm payments.

If the webhook is not configured, the backend will not receive the payment confirmation and the order status will not be updated to `PAID`.

### Testing cards

Stripe provides official test cards here:
https://docs.stripe.com/testing

### Webhook configuration

You must configure a webhook endpoint in your Stripe Dashboard (Test mode):

- Events used by this project:
  - `checkout.session.completed`
  - (and/or) `checkout.session.async_payment_succeeded`

Copy the webhook **signing secret** and set it as:

```env
STRIPE_WEBHOOK_KEY="whsec_..."
```

If you prefer using Stripe CLI, forward events to the local endpoint:

```bash
stripe listen --forward-to localhost:3000/api/webhook/stripe
```

## API overview

These are the main routes used by the UI:

- `POST /api/auth/signup`
- `POST /api/auth/signin`
- `POST /api/auth/validate_email`
- `GET /api/pizzas`
- `POST /api/order/new` (creates the order + Stripe Checkout Session)
- `POST /api/webhook/stripe` (updates order status after payment)

## Troubleshooting

### Payment succeeded on Stripe, but the order is not marked as PAID

Almost always webhook-related:

- webhook endpoint not configured / not reachable
- wrong `STRIPE_WEBHOOK_KEY` (signing secret mismatch)
- events not selected in the Stripe Dashboard
- local endpoint not exposed (Stripe can't reach localhost)

### Prisma connection errors

- confirm Postgres is running
- confirm `DATABASE_URL` is correct (user/password/host/port/db name)
- run migrations again: `npx prisma migrate dev`
- generate prisma client again: `npx prisma generate`
- restart the application
