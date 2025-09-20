import {
  generateYunoHeaders,
  getYunoBaseUrl,
  getAccountId,
} from "@/lib/gen-headers";

export async function POST(request: Request) {
  console.log("Session create endpoint called");

  try {
    const headers = generateYunoHeaders();
    const baseUrl = getYunoBaseUrl();
    const accountId = getAccountId();

    const { amount, country } = await request.json();

    const getCurrency = (countryCode: string) => {
      const currencyMap: Record<string, string> = {
        US: "USD",
        CO: "COP",
        MX: "MXN",
        AR: "ARS",
        BR: "BRL",
        PE: "PEN",
      };
      return currencyMap[countryCode] || "USD";
    };

    const response = await fetch(`${baseUrl}/v1/checkout/sessions`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        merchant_order_id: `order_${Date.now()}`,
        account_id: accountId,
        country: country,
        amount: {
          currency: getCurrency(country),
          value: amount,
        },
        payment_description: "Yuno Demo Payment",
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      console.error("Yuno API error:", result);
      return Response.json(
        {
          error: "Failed to create checkout session",
          details: result,
        },
        { status: response.status }
      );
    }

    return Response.json({
      message: "Checkout session created successfully",
      session: result,
    });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    return Response.json(
      {
        error: "Internal server error",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
