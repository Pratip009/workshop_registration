import express from "express";
import Stripe from "stripe";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: "2022-11-15" });

// Map workshops → Stripe Price IDs
const workshopPrices = {
  phone_repair: "price_1S0YCUJ2BpWnjPpMeuV6YGr1",
  beauty_101: "price_1S0YBgJ2BpWnjPpM1w3tHewi",
};

// Create Checkout Session
router.post("/create-checkout-session", async (req, res) => {
  const { name, email, mobile, workshop } = req.body;

  if (!workshopPrices[workshop]) {
    return res.status(400).json({ error: "Invalid workshop" });
  }

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [{ price: workshopPrices[workshop], quantity: 1 }],
      mode: "payment",
      success_url: `${process.env.FRONTEND_URL}/success`,
      cancel_url: `${process.env.FRONTEND_URL}/cancel`,
      metadata: { name, email, mobile, workshop },
    });

    res.json({ id: session.id, url: session.url });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
