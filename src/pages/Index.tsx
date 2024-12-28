import { ChatWidget } from "@/components/chat";
import { DashboardCard } from "@/components/DashboardCard";
import { MessageCircle, TrendingUp, Package } from "lucide-react";
import { MetricsChart } from "@/components/MetricsChart";
import { SalesTrendChart } from "@/components/SalesTrendChart";
import { StockAlerts } from "@/components/StockAlerts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="p-8 space-y-8">
      <h1 className="text-3xl font-bold">Dashboard Overview</h1>
      
      {/* Conversations Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold">Conversations</h2>
          <Link to="/conversations" className="text-primary hover:underline">
            View All
          </Link>
        </div>
        <DashboardCard
          title="Active Conversations"
          value="28"
          icon={<MessageCircle className="h-4 w-4 text-muted-foreground" />}
          description="Current active chats"
        />
        <Card>
          <CardHeader>
            <CardTitle>Weekly Conversation Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <MetricsChart />
          </CardContent>
        </Card>
      </section>

      {/* Sales Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold">Sales</h2>
          <Link to="/sales" className="text-primary hover:underline">
            View All
          </Link>
        </div>
        <DashboardCard
          title="Total Sales"
          value="$124,890"
          icon={<TrendingUp className="h-4 w-4 text-muted-foreground" />}
          description="Last 30 days"
        />
        <Card>
          <CardHeader>
            <CardTitle>Sales Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <SalesTrendChart />
          </CardContent>
        </Card>
      </section>

      {/* Stock Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold">Stock</h2>
          <Link to="/stock" className="text-primary hover:underline">
            View All
          </Link>
        </div>
        <DashboardCard
          title="Low Stock Items"
          value="3"
          icon={<Package className="h-4 w-4 text-muted-foreground" />}
          description="Items below threshold"
        />
        <Card>
          <CardHeader>
            <CardTitle>Stock Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            <StockAlerts />
          </CardContent>
        </Card>
      </section>

      <ChatWidget />
    </div>
  );
};

export default Index;