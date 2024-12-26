import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { WhatsappIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";

export function ConnectionPanel() {
  const { toast } = useToast();
  const [isConnected, setIsConnected] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  const handleConnect = () => {
    if (!apiKey || !phoneNumber) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    // Here you would typically make an API call to verify and store the connection
    setIsConnected(true);
    toast({
      title: "WhatsApp Business Connected",
      description: "Your WhatsApp Business account has been successfully connected.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between p-4 border rounded-lg">
        <div className="flex items-center gap-4">
          <div className="h-10 w-10 bg-green-100 rounded-full flex items-center justify-center">
            <WhatsappIcon className="h-6 w-6 text-green-600" />
          </div>
          <div>
            <h3 className="font-medium">WhatsApp Business</h3>
            <p className="text-sm text-muted-foreground">
              Connect your WhatsApp Business account
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {isConnected ? (
            <Badge variant="outline" className="bg-green-50 text-green-700">
              Connected
            </Badge>
          ) : (
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline">Connect</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Connect WhatsApp Business</DialogTitle>
                  <DialogDescription>
                    Enter your WhatsApp Business API credentials to establish connection
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-6 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="apiKey">WhatsApp Business API Key</Label>
                    <Input
                      id="apiKey"
                      type="password"
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                      placeholder="Enter your API key"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Dedicated Phone Number</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="+1234567890"
                    />
                  </div>
                  <Alert>
                    <AlertTitle>Requirements</AlertTitle>
                    <AlertDescription>
                      <ul className="list-disc pl-4 space-y-1 mt-2">
                        <li>Valid WhatsApp Business API Key</li>
                        <li>Verified Facebook Business Manager Account</li>
                        <li>Dedicated phone number (not used with other WhatsApp accounts)</li>
                      </ul>
                    </AlertDescription>
                  </Alert>
                  <Button onClick={handleConnect} className="w-full">
                    Connect WhatsApp Business
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>
    </div>
  );
}