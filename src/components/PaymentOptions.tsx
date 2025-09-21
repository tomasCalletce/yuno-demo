"use client";

import { useContext, useEffect, useState } from "react";
import { AppContext } from "@/context/YunoContext";
import { Button } from "@/components/ui/button";

interface PaymentMethod {
  name: string;
  type: string;
  icon: string;
  vaulted_token: string | null;
}

interface PaymentOptionsProps {
  onSelectPaymentMethod: (type: string, vaultedToken?: string) => void;
}

export const PaymentOptions: React.FC<PaymentOptionsProps> = ({
  onSelectPaymentMethod,
}) => {
  const { checkoutSession } = useContext(AppContext);
  const [methods, setMethods] = useState<PaymentMethod[]>([]);

  useEffect(() => {
    const fetchMethods = async () => {
      try {
        const response = await fetch(
          `/api/session/methods?checkout_session=${checkoutSession}`
        );
        const result = await response.json();
        setMethods(result.payment_methods || []);
      } catch (error) {
        console.error("Error fetching payment methods:", error);
      }
    };

    if (checkoutSession) fetchMethods();
  }, [checkoutSession]);

  return (
    <div className="grid gap-4">
      {methods.map((method) => (
        <Button
          key={method.type}
          variant="outline"
          className="flex items-center gap-4 h-16 p-4"
          onClick={() =>
            onSelectPaymentMethod(
              method.type,
              method.vaulted_token || undefined
            )
          }
        >
          <img src={method.icon} alt={method.name} className="h-8 w-auto" />
          <span className="font-medium">{method.name}</span>
        </Button>
      ))}
    </div>
  );
};
