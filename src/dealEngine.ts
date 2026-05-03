export function runDealCheck(input: any) {
  const base = input.listed_price;

  let estimated = base * 1.15;

  if (input.product_name.toLowerCase().includes("macbook")) {
    estimated = base * 1.25;
  }

  if (input.condition === "used") {
    estimated *= 0.9;
  }

  const diff = estimated - base;

  let verdict = "FAIR PRICE";

  if (diff > estimated * 0.15) verdict = "GOOD DEAL";
  if (diff < -estimated * 0.1) verdict = "BAD DEAL";
  if (Math.abs(diff) < estimated * 0.08) verdict = "FAIR PRICE";

  return {
    verdict,
    confidence: 75,
    listed_price: base,
    estimated_market_price: Math.round(estimated),
    savings_estimate: Math.round(diff),
    recommendation:
      verdict === "GOOD DEAL"
        ? "Buy now before it's gone."
        : verdict === "BAD DEAL"
        ? "Avoid or negotiate."
        : "Reasonable price.",
    risk_notes: [
      "Verify condition before purchase",
      "Avoid irreversible payments",
      "Check seller reputation"
    ]
  };
}
