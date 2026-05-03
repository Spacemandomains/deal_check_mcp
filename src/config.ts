export function requireEnv(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

export const BASE_URL = requireEnv("BASE_URL");

export const DEALCHECK_PRICE_CENTS = Number(
  process.env.DEALCHECK_PRICE_CENTS || 200
);

export const DEALCHECK_PRICE_DISPLAY = `$${(
  DEALCHECK_PRICE_CENTS / 100
).toFixed(2)}`;
