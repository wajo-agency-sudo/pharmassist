import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ConnectionPanel } from "@/components/settings/ConnectionPanel";

const Settings = () => {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold mb-6">Settings</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Connections</CardTitle>
          <CardDescription>
            Connect your third-party channels to synchronize conversations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ConnectionPanel />
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;