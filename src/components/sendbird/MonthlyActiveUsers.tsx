import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users } from "lucide-react";
import { useSendbirdMAU } from "@/hooks/use-sendbird-mau";

export function MonthlyActiveUsers() {
  const { data, isLoading, error } = useSendbirdMAU();

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Monthly Active Users</CardTitle>
        <Users className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {isLoading ? (
            "Loading..."
          ) : error ? (
            "Error loading MAU"
          ) : (
            data?.mau.toLocaleString() || "0"
          )}
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          Active users this month
        </p>
      </CardContent>
    </Card>
  );
}