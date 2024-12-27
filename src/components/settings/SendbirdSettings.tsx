import { useState } from "react";
import { MessageSquare } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SendbirdForm, SendbirdFormData } from "./SendbirdForm";
import { SendbirdInstructions } from "./SendbirdInstructions";
import { getApiUrl } from "@/utils/sendbird";

export function SendbirdSettings() {
  const [isConnected, setIsConnected] = useState(false);
  const { toast } = useToast();
  const [currentAppId, setCurrentAppId] = useState(localStorage.getItem('SENDBIRD_APP_ID') || '');
  const [currentRegion, setCurrentRegion] = useState(localStorage.getItem('SENDBIRD_REGION') || 'US');

  const validateCredentials = async (data: SendbirdFormData) => {
    try {
      const apiUrl = getApiUrl(data.applicationId, data.region);
      const response = await fetch(`${apiUrl}/v3/statistics/daily`, {
        method: 'GET',
        headers: {
          'Api-Token': data.apiToken,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        console.error('Sendbird API validation failed:', await response.text());
        return false;
      }

      const responseData = await response.json();
      return responseData && response.status === 200;
    } catch (error) {
      console.error('Error validating Sendbird credentials:', error);
      return false;
    }
  };

  const handleConnect = async (data: SendbirdFormData) => {
    if (!data.applicationId || !data.apiToken) {
      toast({
        title: "Missing Information",
        description: "Please enter both your Sendbird Application ID and API Token",
        variant: "destructive",
      });
      return;
    }

    const isValid = await validateCredentials(data);
    
    if (!isValid) {
      toast({
        title: "Invalid Credentials",
        description: "Could not connect to Sendbird. Please verify your Application ID and API Token.",
        variant: "destructive",
      });
      return;
    }

    localStorage.setItem('SENDBIRD_APP_ID', data.applicationId);
    localStorage.setItem('SENDBIRD_API_TOKEN', data.apiToken);
    localStorage.setItem('SENDBIRD_REGION', data.region);
    if (data.webhookUrl) {
      localStorage.setItem('SENDBIRD_WEBHOOK_URL', data.webhookUrl);
    }
    setIsConnected(true);
    setCurrentAppId(data.applicationId);
    setCurrentRegion(data.region);
    
    toast({
      title: "Sendbird Connected",
      description: "Your Sendbird account has been successfully connected.",
    });
  };

  const handleDisconnect = () => {
    localStorage.removeItem('SENDBIRD_APP_ID');
    localStorage.removeItem('SENDBIRD_API_TOKEN');
    localStorage.removeItem('SENDBIRD_WEBHOOK_URL');
    localStorage.removeItem('SENDBIRD_REGION');
    setIsConnected(false);
    setCurrentAppId('');
    setCurrentRegion('US');
    
    toast({
      title: "Sendbird Disconnected",
      description: "Your Sendbird account has been disconnected.",
    });
  };

  const apiBaseUrl = getApiUrl(currentAppId, currentRegion as any);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageSquare className="h-6 w-6 text-primary" />
            <div>
              <CardTitle>Sendbird Integration</CardTitle>
              <CardDescription>Configure your Sendbird chat integration settings</CardDescription>
            </div>
          </div>
          <Badge variant={isConnected ? "default" : "destructive"}>
            {isConnected ? "Connected" : "Not Connected"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <SendbirdInstructions apiBaseUrl={apiBaseUrl} />
        <SendbirdForm
          isConnected={isConnected}
          onConnect={handleConnect}
          onDisconnect={handleDisconnect}
        />
      </CardContent>
    </Card>
  );
}