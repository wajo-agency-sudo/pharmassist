import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageSquare, Link, Key } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SendbirdRegion, getApiUrl } from "@/utils/sendbird";

export function SendbirdSettings() {
  const [applicationId, setApplicationId] = useState("");
  const [apiToken, setApiToken] = useState("");
  const [webhookUrl, setWebhookUrl] = useState("");
  const [region, setRegion] = useState<SendbirdRegion>("US");
  const [isConnected, setIsConnected] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const savedAppId = localStorage.getItem('SENDBIRD_APP_ID');
    const savedToken = localStorage.getItem('SENDBIRD_API_TOKEN');
    const savedWebhookUrl = localStorage.getItem('SENDBIRD_WEBHOOK_URL');
    const savedRegion = localStorage.getItem('SENDBIRD_REGION') as SendbirdRegion;
    
    if (savedAppId && savedToken) {
      setApplicationId(savedAppId);
      setApiToken(savedToken);
      if (savedWebhookUrl) {
        setWebhookUrl(savedWebhookUrl);
      }
      if (savedRegion) {
        setRegion(savedRegion);
      }
      setIsConnected(true);
    }
  }, []);

  const validateCredentials = async () => {
    try {
      const apiUrl = getApiUrl(applicationId, region);
      const response = await fetch(`${apiUrl}/v3/statistics/daily`, {
        method: 'GET',
        headers: {
          'Api-Token': apiToken,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        console.error('Sendbird API validation failed:', await response.text());
        return false;
      }

      const data = await response.json();
      return data && response.status === 200;
    } catch (error) {
      console.error('Error validating Sendbird credentials:', error);
      return false;
    }
  };

  const handleConnect = async () => {
    if (!applicationId || !apiToken) {
      toast({
        title: "Missing Information",
        description: "Please enter both your Sendbird Application ID and API Token",
        variant: "destructive",
      });
      return;
    }

    const isValid = await validateCredentials();
    
    if (!isValid) {
      toast({
        title: "Invalid Credentials",
        description: "Could not connect to Sendbird. Please verify your Application ID and API Token.",
        variant: "destructive",
      });
      return;
    }

    localStorage.setItem('SENDBIRD_APP_ID', applicationId);
    localStorage.setItem('SENDBIRD_API_TOKEN', apiToken);
    localStorage.setItem('SENDBIRD_REGION', region);
    if (webhookUrl) {
      localStorage.setItem('SENDBIRD_WEBHOOK_URL', webhookUrl);
    }
    setIsConnected(true);
    
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
    setApplicationId("");
    setApiToken("");
    setWebhookUrl("");
    setRegion("US");
    
    toast({
      title: "Sendbird Disconnected",
      description: "Your Sendbird account has been disconnected.",
    });
  };

  const apiBaseUrl = getApiUrl(applicationId, region);

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
        <Alert>
          <AlertTitle>Setup Instructions</AlertTitle>
          <AlertDescription className="mt-2 space-y-2">
            <p>1. Create a Sendbird account if you haven't already</p>
            <p>2. Get your Application ID from the Sendbird Dashboard</p>
            <p>3. Generate an API token from your Sendbird Dashboard</p>
            <p>4. Select your region from the Sendbird Dashboard</p>
            <p>5. (Optional) Configure a webhook URL to receive events</p>
            <p>6. Enter the credentials below to connect</p>
            <p className="text-sm text-muted-foreground mt-2">API Base URL: {apiBaseUrl}</p>
            <a 
              href="https://dashboard.sendbird.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary hover:underline inline-flex items-center gap-1 mt-2"
            >
              <Link className="h-4 w-4" />
              Go to Sendbird Dashboard
            </a>
          </AlertDescription>
        </Alert>

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Region</label>
            <Select
              value={region}
              onValueChange={(value: SendbirdRegion) => setRegion(value)}
              disabled={isConnected}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select region" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="US">US (Default)</SelectItem>
                <SelectItem value="EU">EU</SelectItem>
                <SelectItem value="APAC">APAC</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Application ID</label>
            <Input
              placeholder="Enter your Sendbird Application ID"
              value={applicationId}
              onChange={(e) => setApplicationId(e.target.value)}
              disabled={isConnected}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">API Token</label>
            <div className="relative">
              <Input
                type="password"
                placeholder="Enter your Sendbird API Token"
                value={apiToken}
                onChange={(e) => setApiToken(e.target.value)}
                disabled={isConnected}
              />
              <Key className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Webhook URL (Optional)</label>
            <Input
              placeholder="Enter your webhook URL"
              value={webhookUrl}
              onChange={(e) => setWebhookUrl(e.target.value)}
              disabled={isConnected}
            />
          </div>
        </div>

        {isConnected ? (
          <Button onClick={handleDisconnect} variant="destructive" className="w-full">
            Disconnect Sendbird
          </Button>
        ) : (
          <Button onClick={handleConnect} className="w-full">
            Connect Sendbird
          </Button>
        )}
      </CardContent>
    </Card>
  );
}