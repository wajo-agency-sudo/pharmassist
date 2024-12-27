import { Link } from "lucide-react";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";

export function SendbirdInstructions({ apiBaseUrl }: { apiBaseUrl: string }) {
  return (
    <Alert>
      <AlertTitle>Setup Instructions</AlertTitle>
      <AlertDescription className="mt-2 space-y-2">
        <p>1. Create a Sendbird account if you haven't already</p>
        <p>2. Get your Application ID from the Sendbird Dashboard</p>
        <p>3. Generate an API token from your Sendbird Dashboard</p>
        <p>4. Select your region from the Sendbird Dashboard (EU server is located in Frankfurt)</p>
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
  );
}