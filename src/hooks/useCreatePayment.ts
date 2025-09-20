import { useState } from "react";

interface PaymentRequest {
  checkout: {
    session: string;
  };
  payment_method: {
    type: string;
    token: string;
  };
  country: string;
  amount: {
    value: number;
    currency: string;
  };
}

interface PaymentResponse {
  id: string;
  status: string;
  checkout: {
    session: string;
    sdk_action_required: boolean;
  };
  payment_method: {
    token: string;
    type: string;
  };
}

export const useCreatePayment = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createPayment = async (
    paymentData: PaymentRequest
  ): Promise<PaymentResponse | null> => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/payments/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(paymentData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to create payment");
      }

      return result.payment;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      setError(errorMessage);
      console.error("Error creating payment:", err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    createPayment,
    loading,
    error,
  };
};
