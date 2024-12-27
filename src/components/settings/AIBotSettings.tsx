import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Bot, TestTube, Link } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type VerificationStatus = "yes" | "no";

export function AIBotSettings() {
  const [botUrl, setBotUrl] = useState("");
  const [verificationStatus, setVerificationStatus] = useState<VerificationStatus>("no");
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
    botUrl: "${botUrl}",
    verified: ${verificationStatus === "yes"}
  };
</script>
<script src="${botUrl}/widget.js"></script>`;

    navigator.clipboard.writeText(generatedCode);
    toast({
      title: "Code copied to clipboard",
      description: "You can now paste the code into your website",
    });
  };

  const handleVerificationTest = () => {
    toast({
      title: "Verification Status",
      description: `Bot verification status: ${verificationStatus === "yes" ? "Verified" : "Not Verified"}`,
    });
  };

  const handleVerificationChange = (value: string) => {
    setVerificationStatus(value as VerificationStatus);
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

        <div className="space-y-2">
          <label className="text-sm font-medium flex items-center gap-2">
            <TestTube className="h-4 w-4" />
            Verification Status
          </label>
          <Select value={verificationStatus} onValueChange={handleVerificationChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select verification status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="yes">Yes</SelectItem>
              <SelectItem value="no">No</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row">
          <Button onClick={handleGenerateCode} className="flex-1">
            Generate Website Code
          </Button>
          <Button onClick={handleVerificationTest} variant="outline" className="flex-1">
            Test Verification Status
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}