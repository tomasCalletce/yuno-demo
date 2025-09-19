"use client";

import { YunoProvider } from "@/context/YunoContext";
import { useYuno } from "@/context/YunoContext";

function CheckoutContent({ checkoutSessionId }: { checkoutSessionId: string }) {
  const { yunoInstance, checkoutSession, countryCode } = useYuno();

  return (
    <div className="min-h-screen p-8">
      <main className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Checkout Page</h1>
        <div className="space-y-4">
          <p>Country: {countryCode}</p>
          <p>Checkout Session ID: {checkoutSessionId}</p>
          <p>Checkout Session (Context): {checkoutSession}</p>
          <p>Yuno Instance: {yunoInstance ? "Loaded" : "Loading..."}</p>
        </div>
      </main>
    </div>
  );
}

export default function CheckoutPage({ params }: { params: { _id: string } }) {
  const checkoutSessionId = params._id;

  return (
    <YunoProvider checkoutSession={checkoutSessionId} countryCode="US">
      <CheckoutContent checkoutSessionId={checkoutSessionId} />
    </YunoProvider>
  );
}
