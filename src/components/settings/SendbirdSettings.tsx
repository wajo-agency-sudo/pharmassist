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

export function SendbirdSettings() {
  const [applicationId, setApplicationId] = useState("");
  const [apiToken, setApiToken] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const savedAppId = localStorage.getItem('SENDBIRD_APP_ID');
    const savedToken = localStorage.getItem('SENDBIRD_API_TOKEN');
    if (savedAppId && savedToken) {
      setApplicationId(savedAppId);
      setApiToken(savedToken);
      setIsConnected(true);
    }
  }, []);

  const handleConnect = () => {
    if (!applicationId || !apiToken) {
      toast({
        title: "Missing Information",
        description: "Please enter both your Sendbird Application ID and API Token",
        variant: "destructive",
      });
      return;
    }

    localStorage.setItem('SENDBIRD_APP_ID', applicationId);
    localStorage.setItem('SENDBIRD_API_TOKEN', apiToken);
    setIsConnected(true);
    
    toast({
      title: "Sendbird Connected",
      description: "Your Sendbird account has been successfully connected.",
    });
  };

  const handleDisconnect = () => {
    localStorage.removeItem('SENDBIRD_APP_ID');
    localStorage.removeItem('SENDBIRD_API_TOKEN');
    setIsConnected(false);
    setApplicationId("");
    setApiToken("");
    
    toast({
      title: "Sendbird Disconnected",
      description: "Your Sendbird account has been disconnected.",
    });
  };

  const apiBaseUrl = "https://api-AA1E2F11-9DD3-4575-914B-2F66A17686A9.sendbird.com";

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
            <p>4. Enter both credentials below to connect</p>
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