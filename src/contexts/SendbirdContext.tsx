import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface SendbirdContextType {
  isConnected: boolean;
  applicationId: string | null;
  region: string | null;
}

const SendbirdContext = createContext<SendbirdContextType>({
  isConnected: false,
  applicationId: null,
  region: null,
});

export const useSendbird = () => {
  const context = useContext(SendbirdContext);
  if (!context) {
    throw new Error("useSendbird must be used within a SendbirdProvider");
  }
  return context;
};

export const SendbirdProvider = ({ children }: { children: ReactNode }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [applicationId, setApplicationId] = useState<string | null>(null);
  const [region, setRegion] = useState<string | null>(null);

  useEffect(() => {
    const savedAppId = localStorage.getItem('SENDBIRD_APP_ID');
    const savedRegion = localStorage.getItem('SENDBIRD_REGION');
    
    if (savedAppId && savedRegion) {
      setApplicationId(savedAppId);
      setRegion(savedRegion);
      setIsConnected(true);
    }
  }, []);

  const value = {
    isConnected,
    applicationId,
    region,
  };

  return (
    <SendbirdContext.Provider value={value}>
      {children}
    </SendbirdContext.Provider>
  );
};