import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageSquare, Link } from "lucide-react";
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
  const [isConnected, setIsConnected] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const savedAppId = localStorage.getItem('SENDBIRD_APP_ID');
    if (savedAppId) {
      setApplicationId(savedAppId);
      setIsConnected(true);
    }
  }, []);

  const handleConnect = () => {
    if (!applicationId) {
      toast({
        title: "Missing Information",
        description: "Please enter your Sendbird Application ID",
        variant: "destructive",
      });
      return;
    }

    // Store the application ID in localStorage for demo purposes
    localStorage.setItem('SENDBIRD_APP_ID', applicationId);
    setIsConnected(true);
    
    toast({
      title: "Sendbird Connected",
      description: "Your Sendbird account has been successfully connected.",
    });
  };

  const handleDisconnect = () => {
    localStorage.removeItem('SENDBIRD_APP_ID');
    setIsConnected(false);
    setApplicationId("");
    
    toast({
      title: "Sendbird Disconnected",
      description: "Your Sendbird account has been disconnected.",
    });
  };

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
          <Badge variant={isConnected ? "success" : "destructive"}>
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
            <p>3. Enter your Application ID below to connect</p>
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

        <div className="space-y-2">
          <label className="text-sm font-medium">Application ID</label>
          <Input
            placeholder="Enter your Sendbird Application ID"
            value={applicationId}
            onChange={(e) => setApplicationId(e.target.value)}
            disabled={isConnected}
          />
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