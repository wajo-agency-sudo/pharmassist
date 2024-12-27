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

    const generatedCode = `<!-- PharmaAssist Bot Widget -->
<script>
  window.pharmaAssistConfig = {
    botUrl: "${botUrl}"
  };
</script>
<script src="${botUrl}/widget.js"></script>`;

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