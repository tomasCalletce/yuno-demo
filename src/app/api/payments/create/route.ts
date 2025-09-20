import {
  generateYunoHeaders,
  getYunoBaseUrl,
  getAccountId,
} from "@/lib/gen-headers";

export async function POST(request: Request) {
  try {
    const headers = generateYunoHeaders();
    const baseUrl = getYunoBaseUrl();
    const accountId = getAccountId();

    const body = await request.json();

    const response = await fetch(`${baseUrl}/v1/payments`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        account_id: accountId,
        merchant_order_id: `order_${Date.now()}`,
        description: "demo payment",
        workflow: "SDK_CHECKOUT",
        ...body,
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      console.error("Yuno API error:", result);
      return Response.json(
        {
          error: "Failed to create payment",
          details: result,
        },
        { status: response.status }
      );
    }

    return Response.json({
      message: "Payment created successfully",
      payment: result,
    });
  } catch (error) {
    console.error("Error creating payment:", error);
    return Response.json(
      {
        error: "Internal server error",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
