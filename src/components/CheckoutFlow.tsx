"use client";

import { useState } from "react";
import { PaymentOptions } from "@/components/PaymentOptions";
import { Checkout } from "@/components/Checkout";

interface SelectedPaymentMethod {
  type: string;
  vaultedToken?: string;
}

export const CheckoutFlow: React.FC = () => {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<
    SelectedPaymentMethod | null
  >(null);

  const handleSelectPaymentMethod = (paymentMethodType: string, vaultedToken?: string) => {
    console.log("Selected payment method:", paymentMethodType);
    setSelectedPaymentMethod({ type: paymentMethodType, vaultedToken });
  };

  const handleCheckoutClose = () => {
    console.log("Checkout closed");
    setSelectedPaymentMethod(null);
  };

  return (
    <div className="space-y-6">
      {!selectedPaymentMethod && (
        <PaymentOptions onSelectPaymentMethod={handleSelectPaymentMethod} />
      )}
      {selectedPaymentMethod && (
        <Checkout
          paymentMethodType={selectedPaymentMethod.type}
          vaultedToken={selectedPaymentMethod.vaultedToken}
          onClose={handleCheckoutClose}
        />
      )}
    </div>
  );
};
