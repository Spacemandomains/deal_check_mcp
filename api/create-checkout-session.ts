import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createDealCheckCheckoutSession } from "../src/payment.js";

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "method_not_allowed",
      message: "Use POST."
    });
  }

  try {
    const challenge = await createDealCheckCheckoutSession();
    return res.status(200).json(challenge);
  } catch (error: any) {
    return res.status(500).json({
      error: "stripe_checkout_error",
      message: error.message
    });
  }
}
