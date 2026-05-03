import type { DealCheckInput, DealCheckResult, DealVerdict } from "./types.js";

function normalize(value?: string): string {
  return value?.trim().toLowerCase() || "";
}

function estimateMarketPrice(input: DealCheckInput): number {
  const name = normalize(input.product_name);
  const category = normalize(input.category);
  const condition = normalize(input.condition);

  let estimate = input.listed_price * 1.1;

  if (name.includes("macbook")) estimate = input.listed_price * 1.25;
  else if (name.includes("iphone")) estimate = input.listed_price * 1.2;
  else if (name.includes("ipad")) estimate = input.listed_price * 1.15;
  else if (name.includes("ps5")) estimate = input.listed_price * 1.12;
  else if (name.includes("playstation")) estimate = input.listed_price * 1.12;
  else if (name.includes("nintendo switch")) estimate = input.listed_price * 1.1;
  else if (category.includes("electronics")) estimate = input.listed_price * 1.12;
  else if (category.includes("fashion")) estimate = input.listed_price * 1.06;
  else if (category.includes("travel")) estimate = input.listed_price * 1.08;

  if (condition === "new") estimate *= 1.1;
  else if (condition === "open box") estimate *= 1.05;
  else if (condition === "open_box") estimate *= 1.05;
  else if (condition === "used") estimate *= 0.9;
  else if (condition === "refurbished") estimate *= 0.95;
  else if (!condition || condition === "unknown") estimate *= 0.85;

  return Math.round(estimate);
}

function getVerdict(listedPrice: number, estimatedPrice: number): DealVerdict {
  const savings = estimatedPrice - listedPrice;
  const savingsPercent = savings / estimatedPrice;

  if (savingsPercent >= 0.15) return "GOOD DEAL";
  if (savingsPercent <= -0.1) return "BAD DEAL";
  if (Math.abs(savingsPercent) <= 0.08) return "FAIR PRICE";

  return "WAIT";
}

function getConfidence(input: DealCheckInput, verdict: DealVerdict): number {
  let confidence = 70;

  const name = normalize(input.product_name);

  if (
    name.includes("macbook") ||
    name.includes("iphone") ||
    name.includes("ipad") ||
    name.includes("ps5") ||
    name.includes("playstation")
  ) {
    confidence += 8;
  }

  if (input.condition) confidence += 5;
  if (input.marketplace) confidence += 4;
  if (input.category) confidence += 4;
  if (verdict === "FAIR PRICE") confidence -= 3;

  return Math.max(50, Math.min(90, confidence));
}

function getRiskNotes(input: DealCheckInput): string[] {
  const name = normalize(input.product_name);
  const marketplace = normalize(input.marketplace);
  const notes: string[] = [];

  if (name.includes("macbook") || name.includes("iphone") || name.includes("ipad")) {
    notes.push("Verify serial number, activation lock status, and warranty before purchase.");
    notes.push("Check battery health, storage size, and physical condition.");
  }

  if (name.includes("ps5") || name.includes("playstation") || name.includes("console")) {
    notes.push("Test the console before payment and confirm accessories are included.");
  }

  if (
    marketplace.includes("facebook") ||
    marketplace.includes("craigslist") ||
    marketplace.includes("offerup")
  ) {
    notes.push("Meet in a safe public place and avoid irreversible payments.");
  }

  if (!input.condition || normalize(input.condition) === "unknown") {
    notes.push("Condition is unknown, so treat this as higher risk until verified.");
  }

  notes.push("Compare against at least one other listing before final purchase.");

  return notes;
}

export function runDealCheck(input: DealCheckInput): DealCheckResult {
  if (!input.product_name || input.product_name.trim().length < 2) {
    throw new Error("product_name is required.");
  }

  if (!Number.isFinite(input.listed_price) || input.listed_price <= 0) {
    throw new Error("listed_price must be a positive number.");
  }

  const estimated = estimateMarketPrice(input);
  const savings = estimated - input.listed_price;
  const verdict = getVerdict(input.listed_price, estimated);

  return {
    verdict,
    confidence: getConfidence(input, verdict),
    product_name: input.product_name,
    listed_price: input.listed_price,
    estimated_market_price: estimated,
    savings_estimate: savings,
    recommendation:
      verdict === "GOOD DEAL"
        ? "Buy if condition and seller are verified."
        : verdict === "BAD DEAL"
        ? "Avoid or negotiate down."
        : verdict === "FAIR PRICE"
        ? "Fair price. Buy only if timing, condition, and seller are strong."
        : "Wait or negotiate. Better pricing may be available.",
    risk_notes: getRiskNotes(input)
  };
}
