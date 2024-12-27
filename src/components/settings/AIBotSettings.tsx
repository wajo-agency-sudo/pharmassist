import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Bot, Link } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
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

export function AIBotSettings() {
  const [botUrl, setBotUrl] = useState("");
  const { toast } = useToast();

  const handleGenerateCode = () => {
    if (!isValidDomain(botUrl)) {
      toast({
        title: "Invalid Domain",
        description: "Please enter a valid domain URL (e.g., https://example.com)",
        variant: "destructive",
      });
      return;
    }

    const generatedCode = `<!-- PharmaAssist Bot Integration -->
<script>
!function(w, d, s, ...args) {
  var div = d.createElement('div');
  div.id = 'pharma-assist-bot';
  d.body.appendChild(div);
  w.pharmaAssistConfig = {
    botUrl: "${botUrl}",
    theme: {
      primaryColor: "#0284c7",
      fontFamily: "system-ui, -apple-system, sans-serif"
    },
    position: {
      bottom: "20px",
      right: "20px"
    },
    initialMessage: "👋 Hello! How can I assist you with your pharmacy needs today?",
    features: {
      prescriptionLookup: true,
      medicationReminders: true,
      drugInteractions: true
    }
  };
  var f = d.getElementsByTagName(s)[0],
  j = d.createElement(s);
  j.defer = true;
  j.type = 'module';
  j.src = '${botUrl}/widget.js';
  f.parentNode.insertBefore(j, f);
}(window, document, 'script');
</script>`;

    navigator.clipboard.writeText(generatedCode);
    toast({
      title: "Code copied to clipboard",
      description: "You can now paste the code into your website",
    });
  };

  const isValidDomain = (url: string) => {
    try {
      const urlObject = new URL(url);
      return urlObject.protocol === 'http:' || urlObject.protocol === 'https:';
    } catch {
      return false;
    }
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setBotUrl(value);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Bot className="h-6 w-6 text-primary" />
          <div>
            <CardTitle>PharmaAssist Bot</CardTitle>
            <CardDescription>Configure your AI assistant bot settings</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <Alert>
          <AlertTitle>Integration Instructions</AlertTitle>
          <AlertDescription className="mt-2 space-y-2">
            <p>1. Enter your domain URL where the PharmaAssist platform is deployed</p>
            <p>2. Click "Generate Website Code" to copy the integration code</p>
            <p>3. Paste the code just before the closing <code className="bg-muted px-1 py-0.5 rounded">&lt;/body&gt;</code> tag in your website's HTML</p>
          </AlertDescription>
        </Alert>

        <div className="space-y-2">
          <label className="text-sm font-medium flex items-center gap-2">
            <Link className="h-4 w-4" />
            Domain URL
          </label>
          <Input
            placeholder="Enter your domain URL (e.g., https://example.com)"
            value={botUrl}
            onChange={handleUrlChange}
          />
        </div>

        <Button onClick={handleGenerateCode} className="w-full">
          Generate Website Code
        </Button>
      </CardContent>
    </Card>
  );
}