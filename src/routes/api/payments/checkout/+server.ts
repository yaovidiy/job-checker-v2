import { getStripeInstance } from "$lib/server/stripe";
import { json, error } from "@sveltejs/kit";
import { STRIPE_CANCEL_URL, STRIPE_SUCCESS_URL } from "$env/static/private";

export async function POST({ request }: { request: Request }) {
  const body = await request.json();

  const { price, amount, productName, currency } = body;

  const stripe = getStripeInstance();

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: currency,
            product_data: {
              name: productName,
              images: ['https://example.com/your-product-image.jpg'],
            },
            unit_amount: price, // amount in cents
          },
          quantity: amount,
        },
      ],
      mode: 'payment',
      success_url: STRIPE_SUCCESS_URL,
      cancel_url: STRIPE_CANCEL_URL,
    });

    const checkoutUrl = session.url;
    console.log(checkoutUrl);
    console.log(body);

    return json(checkoutUrl);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    if (err?.type && err.type === 'StripeInvalidRequestError') {
      console.log(err?.code);
      return error(400, { message: `stripe error code: ${err.code}` })
    }

    console.log(err);
    return error(400, { message: 'Error with payment try again later' });
  }
}