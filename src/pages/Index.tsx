import { ChatWidget } from "@/components/chat";

const Index = () => {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold">Welcome</h1>
      <p className="text-muted-foreground mt-2">
        Manage and respond to patient inquiries
      </p>
      <ChatWidget />
    </div>
  );
}

export default Index;
