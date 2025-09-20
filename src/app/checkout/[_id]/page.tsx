"use client";

import { useRef, useState, useEffect } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { YunoInstance } from "@yuno-payments/sdk-web-types";
import { loadScript } from "@yuno-payments/sdk-web";
import { AppContext } from "@/context/YunoContext";
import { CheckoutFlow } from "@/components/CheckoutFlow";

const PK = process.env.NEXT_PUBLIC_PK as string;
if (!PK) {
  throw new Error("NEXT_PUBLIC_PK is not set");
}

export default function CheckoutPage() {
  const { _id: checkoutSessionId } = useParams<{ _id: string }>();
  const searchParams = useSearchParams();
  const country = searchParams.get("country") || "US";

  const instanceFlag = useRef(0);
  const [yunoInstance, setYunoInstance] = useState<YunoInstance | null>(null);

  useEffect(() => {
    const createYunoInstance = async () => {
      const yuno = await loadScript();
      const yunoInstance = await yuno.initialize(PK);
      setYunoInstance(yunoInstance);
    };
    if (instanceFlag.current === 0) {
      createYunoInstance();
      instanceFlag.current = 1;
    }
  }, []);

  if (!yunoInstance) return null;

  return (
    <AppContext.Provider
      value={{
        checkoutSession: checkoutSessionId,
        yunoInstance,
        countryCode: country,
      }}
    >
      <div className="min-h-screen p-8">
        <main className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Yuno Checkout</h1>
          <CheckoutFlow />
        </main>
      </div>
    </AppContext.Provider>
  );
}
