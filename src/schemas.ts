import { z } from "zod";

export const DealCheckSchema = z.object({
  product_name: z.string().min(2),
  listed_price: z.number().positive(),
  condition: z.string().optional(),
  marketplace: z.string().optional(),
  category: z.string().optional(),
  checkout_session_id: z.string().optional()
});

export type DealCheckRequest = z.infer<typeof DealCheckSchema>;
