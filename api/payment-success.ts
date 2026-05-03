import type { VercelRequest, VercelResponse } from "@vercel/node";

export default function handler(req: VercelRequest, res: VercelResponse) {
  const sessionId = String(req.query.session_id || "");

  return res.status(200).send(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Payment Successful</title>
      </head>
      <body style="font-family: Arial, sans-serif; padding: 40px;">
        <h1>Payment Successful</h1>
        <p>Your DealCheck payment was completed.</p>
        <p>Use this checkout_session_id in your next request:</p>
        <pre style="background:#f4f4f4;padding:16px;border-radius:8px;">${sessionId}</pre>
      </body>
    </html>
  `);
}
