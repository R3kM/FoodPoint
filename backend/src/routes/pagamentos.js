import { Router } from 'express';
import Stripe from 'stripe';

const router = Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// ─── POST /api/pagamentos/criar-intencao ──────────────────────────────────────
// Cria um PaymentIntent no Stripe para pagamento com cartão
// Body: { total, metodo_pagamento, pedido_id }
router.post('/criar-intencao', async (req, res) => {
  const { total, pedido_id } = req.body;

  if (!total || total <= 0) {
    return res.status(400).json({ message: 'Valor inválido.' });
  }

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(total * 100), // Stripe usa centavos
      currency: 'brl',
      metadata: { pedido_id: String(pedido_id || '') },
      automatic_payment_methods: { enabled: true },
    });

    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (err) {
    console.error('Stripe error:', err);
    res.status(500).json({ message: err.message });
  }
});

// ─── POST /api/pagamentos/webhook ────────────────────────────────────────────
// Recebe eventos do Stripe (ex: pagamento confirmado)
// Configure a URL no Stripe Dashboard: https://dashboard.stripe.com/webhooks
router.post('/webhook', async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body, // raw body — precisa de express.raw() na rota
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return res.status(400).json({ message: `Webhook error: ${err.message}` });
  }

  if (event.type === 'payment_intent.succeeded') {
    const intent = event.data.object;
    console.log('Pagamento confirmado:', intent.id, 'Pedido:', intent.metadata.pedido_id);
    // Aqui você pode atualizar o status do pagamento no banco se quiser
  }

  res.json({ received: true });
});

export default router;
