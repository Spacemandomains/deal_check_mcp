import type { VercelRequest, VercelResponse } from "@vercel/node";

export default function handler(req: VercelRequest, res: VercelResponse) {
  return res.status(200).send(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Payment Cancelled</title>
      </head>
      <body style="font-family: Arial, sans-serif; padding: 40px;">
        <h1>Payment Cancelled</h1>
        <p>No charge was completed.</p>
      </body>
    </html>
  `);
}
