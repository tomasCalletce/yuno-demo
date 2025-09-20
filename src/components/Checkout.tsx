"use client";

import { useContext, useEffect } from "react";
import { AppContext } from "@/context/YunoContext";
import { useCreatePayment } from "@/hooks/useCreatePayment";
import { useRouter } from "next/navigation";

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
  const router = useRouter();
  const { checkoutSession, countryCode, yunoInstance, amount, currency } =
    useContext(AppContext);
  const { createPayment } = useCreatePayment();

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
            await createPayment({
              payment_method: {
                type: paymentMethodType,
                token: token,
              },
              checkout: {
                session: checkoutSession,
              },
              country: countryCode,
              amount: {
                value: amount,
                currency: currency,
              },
            });

            yunoInstance.continuePayment({ showPaymentStatus: true });
          },
          yunoPaymentResult: (data) => {
            console.log("yunoPaymentResult", data);
            if (data === "SUCCEEDED") {
              router.push(`/`);
            }
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
