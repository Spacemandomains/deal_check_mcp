import type { VercelRequest, VercelResponse } from "@vercel/node";
import { stripe } from "../src/stripe.js";

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  const sessionId =
    req.method === "GET"
      ? String(req.query.session_id || "")
      : req.body?.session_id;

  if (!sessionId) {
    return res.status(400).json({
      verified: false,
      error: "missing_session_id"
    });
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    const verified =
      session.payment_status === "paid" &&
      session.metadata?.product === "dealcheck" &&
      session.metadata?.tool === "deal_check";

    return res.status(200).json({
      verified,
      session_id: session.id,
      payment_status: session.payment_status,
      amount_total: session.amount_total,
      currency: session.currency
    });
  } catch (error: any) {
    return res.status(400).json({
      verified: false,
      error: "invalid_session",
      message: error.message
    });
  }
}
