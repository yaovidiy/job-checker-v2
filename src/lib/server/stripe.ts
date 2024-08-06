import Stripe from 'stripe';
import { STRIPE_SECRET_KEY } from '$env/static/private';

let stripeInstance: Stripe;

export const getStripeInstance = (): Stripe => {
  if (!stripeInstance) {
    stripeInstance = new Stripe(STRIPE_SECRET_KEY, {
      // Add any additional configuration options here
    });
  }

  return stripeInstance;
};