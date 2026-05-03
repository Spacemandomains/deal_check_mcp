import type { VercelRequest, VercelResponse } from "@vercel/node";
import { BASE_URL, DEALCHECK_PRICE_DISPLAY } from "../src/config.js";

export default function handler(req: VercelRequest, res: VercelResponse) {
  return res.status(200).json({
    name: "DealCheck MCP",
    description:
      "A Stripe-powered paid MCP server that checks whether a product listing is a good deal.",
    version: "1.0.0",
    base_url: BASE_URL,
    tools: [
      {
        name: "deal_check",
        description: `Check if a product is a good deal. Costs ${DEALCHECK_PRICE_DISPLAY} per call.`,
        endpoint: `${BASE_URL}/api/deal-check`,
        method: "POST",
        price: DEALCHECK_PRICE_DISPLAY,
        input_schema: {
          type: "object",
          required: ["product_name", "listed_price"],
          properties: {
            product_name: {
              type: "string",
              description: "Product name"
            },
            listed_price: {
              type: "number",
              description: "Listed price in USD"
            },
            condition: {
              type: "string",
              description: "Product condition"
            },
            marketplace: {
              type: "string",
              description: "Marketplace or source"
            },
            category: {
              type: "string",
              description: "Product category"
            },
            checkout_session_id: {
              type: "string",
              description: "Stripe Checkout Session ID after payment"
            }
          }
        }
      }
    ]
  });
}
