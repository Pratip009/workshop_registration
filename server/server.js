import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";
import workshopRoutes from "./routes/workshopRoutes.js";
import Stripe from "stripe";

dotenv.config();

const app = express();

// Debug: check if Stripe key is loaded
if (!process.env.STRIPE_SECRET_KEY) {
  console.error("❌ Missing Stripe Secret Key");
  process.exit(1);
}

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Webhook route must be before express.json()
app.post(
  "/api/webhook",
  bodyParser.raw({ type: "application/json" }),
  (req, res) => {
    const sig = req.headers["stripe-signature"];
    let event;

    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      console.error("⚠️ Webhook error:", err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      console.log("✅ Payment success for:", session.metadata);
      // TODO: Save to DB or Google Sheets here
    }

    res.json({ received: true });
  }
);

// Middlewares after webhook
app.use(cors());
app.use(express.json());
app.use("/api/workshops", workshopRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
