import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Link, Key } from "lucide-react";
import { SendbirdRegion } from "@/utils/sendbird";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SendbirdFormProps {
  isConnected: boolean;
  onConnect: (data: SendbirdFormData) => void;
  onDisconnect: () => void;
}

export interface SendbirdFormData {
  applicationId: string;
  apiToken: string;
  webhookUrl: string;
  region: SendbirdRegion;
}

export function SendbirdForm({ isConnected, onConnect, onDisconnect }: SendbirdFormProps) {
  const [applicationId, setApplicationId] = useState("");
  const [apiToken, setApiToken] = useState("");
  const [webhookUrl, setWebhookUrl] = useState("");
  const [region, setRegion] = useState<SendbirdRegion>("US");

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
    }
  }, []);

  const handleSubmit = () => {
    onConnect({
      applicationId,
      apiToken,
      webhookUrl,
      region,
    });
  };

  return (
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

      {isConnected ? (
        <Button onClick={onDisconnect} variant="destructive" className="w-full">
          Disconnect Sendbird
        </Button>
      ) : (
        <Button onClick={handleSubmit} className="w-full">
          Connect Sendbird
        </Button>
      )}
    </div>
  );
}