"use client";

import { useContext, useEffect } from "react";
import { AppContext } from "@/context/YunoContext";

interface CheckoutProps {
  paymentMethodType: string;
  vaultedToken?: string;
  onClose: () => void;
}

export const Checkout: React.FC<CheckoutProps> = ({
  paymentMethodType,
  vaultedToken,
  onClose,
}) => {
  const { checkoutSession, countryCode, yunoInstance } = useContext(AppContext);

  useEffect(() => {
    (async () => {
      if (!yunoInstance) return;

      try {
        await yunoInstance.startCheckout({
          checkoutSession: checkoutSession,
          countryCode: countryCode,
          elementSelector: "#root-checkout-yuno",
          card: {
            type: "extends",
            cardSaveEnable: true,
          },
          language: "en",
          showLoading: true,
          issuersFormEnable: true,
          showPaymentStatus: true,
          yunoCreatePayment: async (token) => {
            yunoInstance.continuePayment({ showPaymentStatus: true });
          },
          yunoPaymentResult: (data) => {
            console.log("yunoPaymentResult", data);
          },
          yunoError: (err) => {
            console.error("Yuno error:", err);
          },
          onLoading: (args) => {
            console.log("onLoading", args);
          },
        });

        yunoInstance.mountCheckoutLite({
          paymentMethodType,
          vaultedToken,
        });
      } catch (error) {
        console.error("Failed to mount checkout:", error);
      }
    })();
  }, [
    yunoInstance,
    checkoutSession,
    countryCode,
    paymentMethodType,
    vaultedToken,
    onClose,
  ]);

  return <div id="root-checkout-yuno"></div>;
};
