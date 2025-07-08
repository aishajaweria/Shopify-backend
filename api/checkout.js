import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { items, customer_email } = req.body;

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['p24'],
      mode: 'payment',
      line_items: items,
      customer_email,
      success_url: 'https://luxenordique.com/success',
      cancel_url: 'https://luxenordique.com/cart',
    });

    res.status(200).json({ url: session.url });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Stripe session creation failed' });
  }
}
