import type { VercelRequest, VercelResponse } from "@vercel/node";
import { DealCheckSchema } from "../src/schemas.js";
import { runDealCheck } from "../src/dealEngine.js";
import {
  createDealCheckCheckoutSession,
  verifyDealCheckPayment
} from "../src/payment.js";
import { DEALCHECK_PRICE_DISPLAY } from "../src/config.js";

function jsonRpc(id: unknown, result: unknown) {
  return {
    jsonrpc: "2.0",
    id,
    result
  };
}

function jsonRpcError(id: unknown, code: number, message: string, data?: unknown) {
  return {
    jsonrpc: "2.0",
    id,
    error: {
      code,
      message,
      data
    }
  };
}

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

  const { id, method, params } = req.body || {};

  if (method === "tools/list") {
    return res.status(200).json(
      jsonRpc(id, {
        tools: [
          {
            name: "deal_check",
            description: `Check if a product is a good deal. Costs ${DEALCHECK_PRICE_DISPLAY} per call.`,
            inputSchema: {
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
      })
    );
  }

  if (method === "tools/call") {
    const toolName = params?.name;
    const args = params?.arguments || {};

    if (toolName !== "deal_check") {
      return res.status(200).json(
        jsonRpcError(id, -32602, "Unknown tool", {
          toolName
        })
      );
    }

    const parsed = DealCheckSchema.safeParse(args);

    if (!parsed.success) {
      return res.status(200).json(
        jsonRpcError(id, -32602, "Invalid tool arguments", {
          issues: parsed.error.flatten()
        })
      );
    }

    const input = parsed.data;
    const paid = await verifyDealCheckPayment(input.checkout_session_id);

    if (!paid) {
      const challenge = await createDealCheckCheckoutSession();

      return res.status(402).json({
        jsonrpc: "2.0",
        id,
        error: {
          code: 402,
          message: "Payment required",
          data: challenge
        }
      });
    }

    const result = runDealCheck({
      product_name: input.product_name,
      listed_price: input.listed_price,
      condition: input.condition,
      marketplace: input.marketplace,
      category: input.category
    });

    return res.status(200).json(
      jsonRpc(id, {
        content: [
          {
            type: "text",
            text: JSON.stringify(result, null, 2)
          }
        ]
      })
    );
  }

  return res.status(200).json(
    jsonRpcError(id, -32601, "Method not found", {
      method
    })
  );
}
