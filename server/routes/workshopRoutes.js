import express from "express";
import Stripe from "stripe";

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Map workshops → Stripe Price IDs
const workshopPrices = {
  phone_repair: "price_1S0WPvJ2BpWnjPpMcUA6LrHx",
  beauty_101: "price_1S0WquJ2BpWnjPpMlhvqEBeu",
};

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
    console.error("Error creating checkout session:", err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
