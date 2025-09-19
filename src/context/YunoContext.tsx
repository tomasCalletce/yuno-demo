"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";
import { loadScript } from "@yuno-payments/sdk-web";
import type { YunoInstance } from "@yuno-payments/sdk-web-types";

interface YunoContextType {
  checkoutSession: string;
  yunoInstance: YunoInstance | null;
  countryCode: string;
}

const YunoContext = createContext<YunoContextType>({
  checkoutSession: "",
  countryCode: "",
  yunoInstance: null,
});

const PUBLIC_API_KEY = "";

interface YunoProviderProps {
  children: React.ReactNode;
  checkoutSession: string;
  countryCode: string;
}

export const YunoProvider = ({ children, checkoutSession, countryCode }: YunoProviderProps) => {
  const instanceFlag = useRef(0);
  const [yunoInstance, setYunoInstance] = useState<YunoInstance | null>(null);

  useEffect(() => {
    const createYunoInstance = async () => {
      const yuno = await loadScript();
      const yunoInstance = await yuno.initialize(PUBLIC_API_KEY);
      setYunoInstance(yunoInstance);
    };

    if (instanceFlag.current === 0) {
      createYunoInstance();
      instanceFlag.current = 1;
    }
  }, []);

  if (!yunoInstance) {
    return <div>Loading...</div>;
  }

  return (
    <YunoContext.Provider
      value={{
        checkoutSession,
        yunoInstance,
        countryCode,
      }}
    >
      {children}
    </YunoContext.Provider>
  );
};

export const useYuno = () => {
  const context = useContext(YunoContext);
  if (context === undefined) {
    throw new Error("useYuno must be used within a YunoProvider");
  }
  return context;
};
