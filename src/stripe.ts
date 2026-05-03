import Stripe from "stripe";
import { requireEnv } from "./config.js";

export const stripe = new Stripe(requireEnv("STRIPE_SECRET_KEY"));
