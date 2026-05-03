import { Transport, Mppx } from "mppx";

export function createPaidTransport() {
  const mppx = Mppx.create({
    paymentMethods: {
      tempo: {
        recipient: process.env.TEMPO_RECIPIENT!
      }
    },
    price: {
      amount: process.env.MPP_AMOUNT || "2000000",
      currency: "USDC",
      network: "tempo"
    }
  });

  return Transport.mcpSdk({ mppx });
}
