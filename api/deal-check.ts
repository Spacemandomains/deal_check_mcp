import type { VercelRequest, VercelResponse } from "@vercel/node";
import { DealCheckSchema } from "../src/schemas.js";
import { runDealCheck } from "../src/dealEngine.js";
import {
  createDealCheckCheckoutSession,
  verifyDealCheckPayment
} from "../src/payment.js";

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

  const parsed = DealCheckSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({
      error: "invalid_request",
      issues: parsed.error.flatten()
    });
  }

  const input = parsed.data;

  const paid = await verifyDealCheckPayment(input.checkout_session_id);

  if (!paid) {
    const challenge = await createDealCheckCheckoutSession();
    return res.status(402).json(challenge);
  }

  const result = runDealCheck({
    product_name: input.product_name,
    listed_price: input.listed_price,
    condition: input.condition,
    marketplace: input.marketplace,
    category: input.category
  });

  return res.status(200).json({
    paid: true,
    tool: "deal_check",
    result
  });
}
