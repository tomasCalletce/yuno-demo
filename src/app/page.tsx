"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Home() {
  const router = useRouter();
  const [amount, setAmount] = useState<string>("1000");
  const [country, setCountry] = useState<string>("US");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleStart = async () => {
    setIsLoading(true);
    try {
      const customerResponse = await fetch("/api/customers/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          merchant_customer_id: `steve_jobs_${Date.now()}`,
          country: country,
          first_name: "Bruno",
          last_name: "Oliveira",
          email: "bruno.oliveira@yunotest.com",
        }),
      });

      const sessionResponse = await fetch("/api/session/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: parseInt(amount),
          country: country,
        }),
      });

      const customerResult = await customerResponse.json();
      console.log("Customer response body:", customerResult);

      const sessionResult = await sessionResponse.json();
      console.log("Session response body:", sessionResult);

      if (customerResponse.ok && sessionResponse.ok) {
        const checkoutSessionId = sessionResult.session?.checkout_session;

        if (checkoutSessionId) {
          router.push(`/checkout/${checkoutSessionId}?country=${country}`);
        } else {
          console.error("No checkout session ID found in response");
        }
      }
    } catch (error) {
      console.error("Error calling endpoints:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <main className="text-center space-y-6 max-w-md mx-auto">
        <h1 className="text-4xl font-bold">Yuno Demo App</h1>
        <p className="text-lg text-gray-600">
          This is a demonstration of the Yuno payments SDK integration.
          Configure your payment details below.
        </p>

        <div className="space-y-4">
          <div className="text-left">
            <label htmlFor="amount" className="block text-sm font-medium mb-2">
              Amount
            </label>
            <Input
              id="amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
            />
          </div>

          <div className="text-left">
            <label htmlFor="country" className="block text-sm font-medium mb-2">
              Country
            </label>
            <Select value={country} onValueChange={setCountry}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a country" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="CO">Colombia (CO)</SelectItem>
                <SelectItem value="US">United States (US)</SelectItem>
                <SelectItem value="MX">Mexico (MX)</SelectItem>
                <SelectItem value="AR">Argentina (AR)</SelectItem>
                <SelectItem value="BR">Brazil (BR)</SelectItem>
                <SelectItem value="PE">Peru (PE)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Button
          className="cursor-pointer"
          onClick={handleStart}
          size="lg"
          disabled={isLoading}
        >
          {isLoading ? "Processing..." : "Start Payment Flow"}
        </Button>
      </main>
    </div>
  );
}
