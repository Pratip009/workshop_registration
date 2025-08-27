import express from "express";
import Stripe from "stripe";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Map workshops → Stripe Price IDs
const workshopPrices = {
  phone_repair: "price_1234567890", // Replace with real Stripe Price ID
  beauty_101: "price_0987654321",
};

// Create Checkout Session
router.post("/create-checkout-session", async (req, res) => {
  try {
    const { workshop, name, email, mobile } = req.body;

    if (!workshopPrices[workshop]) {
      return res.status(400).json({ error: "Invalid workshop" });
    }

    // Debug: confirm metadata
    console.log("Creating checkout session for:", { name, email, mobile, workshop });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price: workshopPrices[workshop],
          quantity: 1,
        },
      ],
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
