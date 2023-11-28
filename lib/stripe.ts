import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY_TEST!, {
  apiVersion: "2023-10-16",
});
