import { useState } from "react";
import Header from "@/components/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, FileText, Trash2, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface DownloadedContent {
  id: string;
  title: string;
  type: string;
  subject: string;
  size: string;
  downloadedAt: string;
}

const Downloads = () => {
  const { toast } = useToast();
  const [downloads, setDownloads] = useState<DownloadedContent[]>([
    {
      id: "1",
      title: "Mathematics Workbook Chapter 1-5",
      type: "PDF",
      subject: "Mathematics",
      size: "2.4 MB",
      downloadedAt: "2024-11-15",
    },
    {
      id: "2",
      title: "Physics Formulas Reference",
      type: "PDF",
      subject: "Physics",
      size: "1.8 MB",
      downloadedAt: "2024-11-14",
    },
    {
      id: "3",
      title: "Chemistry Lab Manual",
      type: "PDF",
      subject: "Chemistry",
      size: "5.2 MB",
      downloadedAt: "2024-11-13",
    },
  ]);

  const handleDelete = (id: string) => {
    setDownloads(downloads.filter((download) => download.id !== id));
    toast({
      title: "Content deleted",
      description: "The downloaded content has been removed",
    });
  };

  const handleRedownload = (title: string) => {
    toast({
      title: "Downloading",
      description: `Re-downloading ${title}...`,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Downloaded Content</h1>
          <p className="text-muted-foreground">Access your offline learning materials</p>
        </div>

        {downloads.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Download className="h-16 w-16 text-muted-foreground mb-4" />
              <p className="text-lg text-muted-foreground mb-2">No downloads yet</p>
              <p className="text-sm text-muted-foreground">Start downloading content for offline access</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {downloads.map((download) => (
              <Card key={download.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className="bg-primary/10 p-3 rounded-lg">
                        <FileText className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{download.title}</CardTitle>
                        <CardDescription className="flex items-center gap-4 mt-2">
                          <Badge variant="secondary">{download.subject}</Badge>
                          <span className="text-sm">{download.size}</span>
                          <span className="flex items-center gap-1 text-sm">
                            <Calendar className="h-3 w-3" />
                            {download.downloadedAt}
                          </span>
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRedownload(download.title)}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Re-download
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(download.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Downloads;
