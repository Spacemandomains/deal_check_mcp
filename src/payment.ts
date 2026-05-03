import { stripe } from "./stripe.js";
import {
  BASE_URL,
  DEALCHECK_PRICE_CENTS,
  DEALCHECK_PRICE_DISPLAY
} from "./config.js";

export async function createDealCheckCheckoutSession() {
  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "usd",
          unit_amount: DEALCHECK_PRICE_CENTS,
          product_data: {
            name: "DealCheck MCP Tool Call",
            description: "One paid DealCheck decision."
          }
        },
        quantity: 1
      }
    ],
    success_url: `${BASE_URL}/api/payment-success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${BASE_URL}/api/payment-cancelled`,
    metadata: {
      product: "dealcheck",
      tool: "deal_check",
      price_cents: String(DEALCHECK_PRICE_CENTS)
    }
  });

  return {
    error: "payment_required",
    message: `DealCheck costs ${DEALCHECK_PRICE_DISPLAY} per tool call.`,
    price: DEALCHECK_PRICE_DISPLAY,
    checkout_url: session.url,
    checkout_session_id: session.id
  };
}

export async function verifyDealCheckPayment(
  checkoutSessionId?: string
): Promise<boolean> {
  if (!checkoutSessionId) return false;

  try {
    const session = await stripe.checkout.sessions.retrieve(checkoutSessionId);

    return (
      session.payment_status === "paid" &&
      session.metadata?.product === "dealcheck" &&
      session.metadata?.tool === "deal_check"
    );
  } catch {
    return false;
  }
}
