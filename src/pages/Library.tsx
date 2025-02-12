
import { useState } from "react";
import { Search, Filter, Share2, Download, Printer } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ResourceGrid } from "@/components/library/ResourceGrid";
import { ResourceFilters } from "@/components/library/ResourceFilters";
import { RecentResources } from "@/components/library/RecentResources";
import { PDFUploader } from "@/components/library/PDFUploader";

const Library = () => {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <h1 className="text-3xl font-bold">Library</h1>
        <div className="flex gap-2">
          <div className="relative flex-1 md:min-w-[300px]">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search resources..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
            />
          </div>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <PDFUploader />

      <div className="grid gap-6 md:grid-cols-[300px_1fr]">
        <ResourceFilters />
        
        <div className="space-y-6">
          <RecentResources />
          
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="w-full justify-start">
              <TabsTrigger value="all">All Resources</TabsTrigger>
              <TabsTrigger value="leaflets">Medication Leaflets</TabsTrigger>
              <TabsTrigger value="documents">Linked Documents</TabsTrigger>
              <TabsTrigger value="videos">Video Instructions</TabsTrigger>
            </TabsList>
            <TabsContent value="all">
              <ResourceGrid />
            </TabsContent>
            <TabsContent value="leaflets">
              <ResourceGrid type="leaflet" />
            </TabsContent>
            <TabsContent value="documents">
              <ResourceGrid type="document" />
            </TabsContent>
            <TabsContent value="videos">
              <ResourceGrid type="video" />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Library;
