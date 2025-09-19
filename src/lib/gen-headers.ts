interface YunoHeaders extends Record<string, string> {
  "X-Idempotency-Key": string;
  accept: string;
  "content-type": string;
  "private-secret-key": string;
  "public-api-key": string;
}

export function generateYunoHeaders(idempotencyKey?: string): YunoHeaders {
  const SK = process.env.SK;
  const NEXT_PUBLIC_PK = process.env.NEXT_PUBLIC_PK;

  if (!SK) {
    throw new Error("SK environment variable is required");
  }

  if (!NEXT_PUBLIC_PK) {
    throw new Error("NEXT_PUBLIC_PK environment variable is required");
  }

  return {
    "X-Idempotency-Key": idempotencyKey || generateIdempotencyKey(),
    accept: "application/json",
    "content-type": "application/json",
    "private-secret-key": SK,
    "public-api-key": NEXT_PUBLIC_PK,
  };
}

function generateIdempotencyKey(): string {
  return `req_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
}

export function getYunoBaseUrl(): string {
  const ENVIRONMENT_URL = process.env.NEXT_PUBLIC_ENVIRONMENT_URL;

  if (!ENVIRONMENT_URL) {
    throw new Error("ENVIRONMENT_URL environment variable is required");
  }

  return ENVIRONMENT_URL;
}

export function getAccountId(): string {
  const ACCOUNT_ID = process.env.ACCOUNT_ID;

  if (!ACCOUNT_ID) {
    throw new Error("ACCOUNT_ID environment variable is required");
  }

  return ACCOUNT_ID;
}
