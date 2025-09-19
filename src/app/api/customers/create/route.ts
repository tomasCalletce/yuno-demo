import { generateYunoHeaders, getYunoBaseUrl } from "@/lib/gen-headers";

export async function POST(req: Request) {
  console.log("Customer create endpoint called");

  try {
    const headers = generateYunoHeaders();
    const baseUrl = getYunoBaseUrl();

    const customerData = await req.json();

    const response = await fetch(`${baseUrl}/v1/customers`, {
      method: "POST",
      headers,
      body: JSON.stringify(customerData),
    });

    const result = await response.json();

    if (!response.ok) {
      console.error("Yuno API error:", result);
      return Response.json(
        {
          error: "Failed to create customer",
          details: result,
        },
        { status: response.status }
      );
    }

    console.log("Customer created successfully:", result);

    return Response.json({
      message: "Customer created successfully",
      customer: result,
    });
  } catch (error) {
    console.error("Error creating customer:", error);
    return Response.json(
      {
        error: "Internal server error",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
