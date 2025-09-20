import { generateYunoHeaders, getYunoBaseUrl } from "@/lib/gen-headers";

export async function GET(request: Request) {
  try {
    const headers = generateYunoHeaders();
    const baseUrl = getYunoBaseUrl();
    const { searchParams } = new URL(request.url);
    const checkout_session = searchParams.get("checkout_session");

    if (!checkout_session) {
      return Response.json(
        { error: "Missing checkout_session query parameter" },
        { status: 400 }
      );
    }

    const response = await fetch(
      `${baseUrl}/v1/checkout/sessions/${checkout_session}/payment-methods`,
      {
        method: "GET",
        headers,
      }
    );

    const result = await response.json();

    if (!response.ok) {
      console.error("Yuno API error:", result);
      return Response.json(
        {
          error: "Failed to get payment methods",
          details: result,
        },
        { status: response.status }
      );
    }

    return Response.json({
      message: "Payment methods fetched successfully",
      payment_methods: result,
    });
  } catch (error) {
    console.error("Error getting payment methods:", error);
    return Response.json(
      {
        error: "Internal server error",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
